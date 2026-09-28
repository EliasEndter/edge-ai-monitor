import csv
import os
import time


class SecurityEventHandler:
    def __init__(
        self,
        cooldown=30,
        log_file="logs/security_events.csv"
    ):
        self.security_labels = {
            "person",
        }

        self.cooldown = cooldown
        self.last_event_time = 0
        self.log_file = log_file

        os.makedirs(os.path.dirname(self.log_file), exist_ok=True)

        if not os.path.exists(self.log_file):
            with open(
                self.log_file,
                "w",
                newline="",
                encoding="utf-8"
            ) as file:
                writer = csv.writer(file)
                writer.writerow([
                    "timestamp",
                    "label",
                    "confidence"
                ])

    def handle_detection(self, detection):
        if detection.label not in self.security_labels:
            return False

        current_time = time.time()

        if current_time - self.last_event_time < self.cooldown:
            return False

        self.last_event_time = current_time

        timestamp = detection.timestamp.strftime(
            "%Y-%m-%d %H:%M:%S"
        )

        with open(
            self.log_file,
            "a",
            newline="",
            encoding="utf-8"
        ) as file:
            writer = csv.writer(file)
            writer.writerow([
                timestamp,
                detection.label,
                f"{detection.confidence:.3f}"
            ])

        print(
            f"[SECURITY] {timestamp} | "
            f"{detection.label:<12} | "
            f"{detection.confidence * 100:.1f}%"
        )

        return True