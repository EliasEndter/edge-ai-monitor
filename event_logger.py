import csv
import os
import time
from datetime import datetime


class EventLogger:
    def __init__(self, log_file="logs/detections.csv", cooldown=5):
        self.log_file = log_file
        self.cooldown = cooldown
        self.last_detection = {}

        os.makedirs(os.path.dirname(self.log_file), exist_ok=True)

        if not os.path.exists(self.log_file):
            with open(self.log_file, "w", newline="", encoding="utf-8") as file:
                writer = csv.writer(file)
                writer.writerow([
                    "timestamp",
                    "label",
                    "confidence"
                ])

    def log_detection(self, label, confidence):
        current_time = time.time()

        last_time = self.last_detection.get(label, 0)

        if current_time - last_time < self.cooldown:
            return False

        self.last_detection[label] = current_time

        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        with open(self.log_file, "a", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            writer.writerow([
                timestamp,
                label,
                f"{confidence:.3f}"
            ])

        print(
            f"[EVENT] {timestamp} | "
            f"{label:<12} | "
            f"{confidence * 100:.1f}%"
        )

        return True