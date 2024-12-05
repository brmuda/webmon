// static/script.js

// Chart instances
let responseTimeChart = null;
let availabilityChart = null;

// Initialize charts when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
});

// Function to add new website input field
function addWebsiteInput() {
    const websiteInputs = document.getElementById('websiteInputs');
    const newInput = document.createElement('div');
    newInput.className = 'website-input';
    newInput.innerHTML = `
        <input type="text" placeholder="Enter website URL (e.g., https://example.com)" class="url-input">
    `;
    websiteInputs.appendChild(newInput);
}

// Initialize charts with empty data
function initializeCharts() {
    // Response Time Chart
    const responseTimeCtx = document.getElementById('responseTimeChart').getContext('2d');
    responseTimeChart = new Chart(responseTimeCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Response Time (ms)'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Availability Chart
    const availabilityCtx = document.getElementById('availabilityChart').getContext('2d');
    availabilityChart = new Chart(availabilityCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Availability (%)'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Start monitoring websites
async function startMonitoring() {
    const urls = Array.from(document.querySelectorAll('.url-input'))
        .map(input => input.value)
        .filter(url => url.trim() !== '');

    if (urls.length === 0) {
        alert('Please enter at least one website URL');
        return;
    }

    const interval = parseInt(document.getElementById('intervalInput').value);
    const requests = parseInt(document.getElementById('requestsInput').value);

    // Validate inputs
    if (interval < 5) {
        alert('Interval must be at least 5 seconds');
        return;
    }

    if (requests < 1) {
        alert('Requests per check must be at least 1');
        return;
    }

    // Start monitoring loop
    while (true) {
        try {
            // Send monitoring request
            await fetch('/api/monitor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    urls.map(url => ({
                        url,
                        interval,
                        requests
                    }))
                ),
            });

            // Get updated data
            const response = await fetch('/api/data');
            const data = await response.json();

            // Update charts
            updateCharts(data);
        } catch (error) {
            console.error('Monitoring error:', error);
        }

        // Wait for the specified interval
        await new Promise(resolve => setTimeout(resolve, interval * 1000));
    }
}

// Update charts with new data
function updateCharts(data) {
    // Generate random colors for new websites
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    // Update Response Time Chart
    responseTimeChart.data.labels = data[Object.keys(data)[0]].timestamps;
    responseTimeChart.data.datasets = Object.entries(data).map(([url, siteData]) => ({
        label: url,
        data: siteData.response_times,
        borderColor: getRandomColor(),
        fill: false
    }));
    responseTimeChart.update();

    // Update Availability Chart
    availabilityChart.data.labels = data[Object.keys(data)[0]].timestamps;
    availabilityChart.data.datasets = Object.entries(data).map(([url, siteData]) => ({
        label: url,
        data: siteData.status_codes,
        borderColor: getRandomColor(),
        fill: false
    }));
    availabilityChart.update();
}