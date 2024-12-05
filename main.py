# main.py
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import aiohttp
import asyncio
import time
from typing import List
import uvicorn

app = FastAPI()

# Serve static files (HTML, CSS, JS)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Store monitoring data
monitoring_data = {}


class Website(BaseModel):
    url: str
    interval: int  # seconds
    requests: int  # number of requests per check


class MonitoringResult:
    def __init__(self):
        self.response_times = []
        self.status_codes = []
        self.timestamps = []


# Async function to check website status
async def check_website(url: str, num_requests: int):
    results = []
    async with aiohttp.ClientSession() as session:
        for _ in range(num_requests):
            start_time = time.time()
            try:
                async with session.get(url) as response:
                    end_time = time.time()
                    results.append({
                        'response_time': round((end_time - start_time) * 1000, 2),
                        'status_code': response.status
                    })
            except:
                results.append({
                    'response_time': 0,
                    'status_code': 0
                })
    return results


@app.get("/", response_class=HTMLResponse)
async def read_root():
    with open("static/index.html") as f:
        return f.read()


@app.post("/api/monitor")
async def monitor_websites(websites: List[Website]):
    for website in websites:
        if website.url not in monitoring_data:
            monitoring_data[website.url] = MonitoringResult()

        results = await check_website(website.url, website.requests)

        # Update monitoring data
        current_time = time.strftime('%H:%M:%S')
        monitoring_data[website.url].timestamps.append(current_time)
        monitoring_data[website.url].response_times.append(
            sum(r['response_time'] for r in results) / len(results)
        )
        monitoring_data[website.url].status_codes.append(
            sum(1 for r in results if r['status_code'] == 200) / len(results) * 100
        )

        # Keep only last 50 data points
        max_points = 50
        monitoring_data[website.url].timestamps = monitoring_data[website.url].timestamps[-max_points:]
        monitoring_data[website.url].response_times = monitoring_data[website.url].response_times[-max_points:]
        monitoring_data[website.url].status_codes = monitoring_data[website.url].status_codes[-max_points:]

    return {"status": "success"}


@app.get("/api/data")
async def get_data():
    return {
        url: {
            "timestamps": result.timestamps,
            "response_times": result.response_times,
            "status_codes": result.status_codes
        }
        for url, result in monitoring_data.items()
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)