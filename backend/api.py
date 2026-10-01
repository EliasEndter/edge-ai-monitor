from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

try:
    from .database import Database
    from .schemas import DetectionResponse, StatsResponse, StatusResponse
except ImportError:  # pragma: no cover
    from database import Database
    from schemas import DetectionResponse, StatsResponse, StatusResponse


app = FastAPI(
    title="Edge AI Monitor API",
    description="REST API for the Edge AI Monitor",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

database = Database()


@app.get("/", response_model=StatusResponse)
def root():
    return {
        "name": "Edge AI Monitor",
        "status": "online",
    }


@app.get("/api/detections", response_model=list[DetectionResponse])
def get_detections(limit: int = Query(default=20, ge=1, le=100)):
    return database.get_detections(limit)


@app.get("/api/security-events", response_model=list[DetectionResponse])
def get_security_events(limit: int = Query(default=20, ge=1, le=100)):
    return database.get_security_events(limit)


@app.get("/api/stats", response_model=StatsResponse)
def get_stats():
    return database.get_stats()

