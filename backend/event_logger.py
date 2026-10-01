import csv
import os
import time


PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOG_DIR = os.path.join(PROJECT_ROOT, "logs")


class EventLogger:
    def __init__(self, log_file=None, cooldown=5):
        self.log_file = log_file or os.path.join(LOG_DIR, "detections.csv")
        self.cooldown = cooldown
        self.last_detection = {}

        os.makedirs(os.path.dirname(self.log_file), exist_ok=True)

        if not os.path.exists(self.log_file):
            with open(
                self.log_file,
                "w",
                newline="",
                encoding="utf-8",
            ) as file:
                writer = csv.writer(file)
                writer.writerow(["timestamp", "label", "confidence"])

    def log_detection(self, detection):
        current_time = time.time()

        last_time = self.last_detection.get(detection.label, 0)

        if current_time - last_time < self.cooldown:
            return False

        self.last_detection[detection.label] = current_time

        timestamp = detection.timestamp.strftime("%Y-%m-%d %H:%M:%S")

        with open(
            self.log_file,
            "a",
            newline="",
            encoding="utf-8",
        ) as file:
            writer = csv.writer(file)
            writer.writerow([
                timestamp,
                detection.label,
                f"{detection.confidence:.3f}",
            ])

        print(
            f"[EVENT] {timestamp} | "
            f"{detection.label:<12} | "
            f"{detection.confidence * 100:.1f}%"
        )

        return True

