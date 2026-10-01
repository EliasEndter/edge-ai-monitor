from datetime import datetime


class Detection:
    def __init__(self, label, confidence):
        self.label = label
        self.confidence = confidence
        self.timestamp = datetime.now()

