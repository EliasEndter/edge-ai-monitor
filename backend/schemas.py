from datetime import datetime
from pydantic import BaseModel

# todo replace with dataclasses
class DetectionResponse(BaseModel):
    id: int
    timestamp: datetime
    label: str
    confidence: float
    is_security_event: bool


class StatsResponse(BaseModel):
    total_detections: int
    security_events: int
    person_detections: int


class StatusResponse(BaseModel):
    name: str
    status: str

