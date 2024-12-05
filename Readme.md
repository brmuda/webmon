# Website Monitoring Dashboard

A real-time website monitoring dashboard built with FastAPI and Chart.js that allows users to track multiple websites' performance metrics simultaneously.

## Features

- 📊 Real-time performance monitoring
- 🌐 Support for multiple websites
- ⏱️ Customizable monitoring intervals
- 📈 Interactive performance charts
- 🔄 Automatic data updates
- 📱 Responsive design
- 🐳 Docker support

## Tech Stack

- Backend: FastAPI (Python)
- Frontend: HTML, CSS, JavaScript
- Charts: Chart.js
- Containerization: Docker
- Async HTTP Client: aiohttp

## Prerequisites

- Docker
- Docker Compose

## Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/website-monitor.git
cd website-monitor
```

2. Build and run with Docker Compose:
```bash
docker-compose up --build
```

3. Access the dashboard at:
```
http://localhost:8000
```

## Project Structure

```
website-monitor/
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
├── main.py
├── README.md
└── static/
    ├── index.html
    ├── style.css
    └── script.js
```

## Usage

1. Open the dashboard in your web browser
2. Add website URLs to monitor (include 'http://' or 'https://')
3. Set the monitoring interval (minimum 5 seconds)
4. Set the number of requests per check
5. Click "Start Monitoring"
6. View real-time performance metrics on the charts

## Monitoring Metrics

The dashboard provides two main charts:
- **Response Time**: Shows the average response time in milliseconds
- **Availability**: Displays the percentage of successful responses

## Docker Commands

- Build and start containers:
```bash
docker-compose up --build
```

- Run in background:
```bash
docker-compose up -d
```

- Stop containers:
```bash
docker-compose down
```

- View logs:
```bash
docker-compose logs -f
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## API Endpoints

- `GET /`: Main dashboard interface
- `POST /api/monitor`: Start monitoring websites
- `GET /api/data`: Get current monitoring data

## Configuration

You can modify these settings in `docker-compose.yml`:
- Port mapping (default: 8000)
- Restart policy
- Health check parameters

## Performance Considerations

- Minimum monitoring interval: 5 seconds
- Recommended maximum websites to monitor simultaneously: 10
- Each website check performs multiple requests for accurate averaging

## Troubleshooting

1. If the dashboard isn't loading:
   - Check if Docker containers are running
   - Verify port 8000 isn't in use
   - Check browser console for errors

2. If monitoring isn't starting:
   - Ensure website URLs include http:// or https://
   - Check browser console for API errors
   - Verify network connectivity

## Security Notes

- The application performs basic HTTP/HTTPS requests only
- No authentication is required (add if needed)
- Rate limiting is not implemented by default
- Consider adding CORS policies for production

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- FastAPI for the amazing Python framework
- Chart.js for the beautiful charts
- Docker for containerization support

## Contact

For questions or support, please open an issue in the repository.

---

Remember to star ⭐ this repository if you find it helpful!