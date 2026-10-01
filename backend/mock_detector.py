import random
import time

try:
    from .detection import Detection
    from .event_logger import EventLogger
    from .security_event import SecurityEventHandler
    from .database import Database
except ImportError:  # pragma: no cover
    from detection import Detection
    from event_logger import EventLogger
    from security_event import SecurityEventHandler
    from database import Database


class MockDetector:
    def __init__(self):
        self.objects = [
            "person",
            "car",
            "dog",
            "cat",
            "backpack",
            "cell phone",
        ]

        self.logger = EventLogger(cooldown=5)
        self.security_handler = SecurityEventHandler()
        self.database = Database()

    def run(self):
        print("Mock detector started")
        print("Press Ctrl+C to stop.\n")

        try:
            while True:
                label = random.choice(self.objects)
                confidence = random.uniform(0.60, 0.99)
                detection = Detection(label, confidence)

                print(
                    f"[MOCK] {label:<12} "
                    f"{confidence * 100:5.1f}%"
                )

                self.logger.log_detection(detection)
                is_security_event = self.security_handler.handle_detection(detection)

                self.database.save_detection(detection, is_security_event)

                time.sleep(1)

        except KeyboardInterrupt:
            print("\nMock detector stopped.")


if __name__ == "__main__":
    detector = MockDetector()
    detector.run()

