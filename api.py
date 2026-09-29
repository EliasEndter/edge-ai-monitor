from fastapi import FastAPI, Query

from database import Database
from schemas import DetectionResponse, StatsResponse, StatusResponse


app = FastAPI(
    title="Edge AI Monitor API",
    description="REST API for the Edge AI Monitor",
    version="0.1.0"
)

database = Database()


@app.get("/", response_model=StatusResponse)
def root():
    return {
        "name": "Edge AI Monitor",
        "status": "online"
    }


@app.get(
    "/api/detections",
    response_model=list[DetectionResponse]
)
def get_detections(
    limit: int = Query(default=20, ge=1, le=100)
):
    return database.get_detections(limit)


@app.get(
    "/api/security-events",
    response_model=list[DetectionResponse]
)
def get_security_events(
    limit: int = Query(default=20, ge=1, le=100)
):
    return database.get_security_events(limit)


@app.get(
    "/api/stats",
    response_model=StatsResponse
)
def get_stats():
    return database.get_stats()