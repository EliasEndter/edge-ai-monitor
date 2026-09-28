import random
import time
from event_logger import EventLogger


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


    def run(self):
        print("Mock detector started")
        print("Press Ctrl+C to stop.\n")

        try:
            while True:
                label = random.choice(self.objects)
                confidence = random.uniform(0.60, 0.99)

                print(
                    f"[MOCK] {label:<12} "
                    f"{confidence * 100:5.1f}%"
                )

                self.logger.log_detection(label, confidence)

                time.sleep(1)

        except KeyboardInterrupt:
            print("\nMock detector stopped.")


if __name__ == "__main__":
    detector = MockDetector()
    detector.run()