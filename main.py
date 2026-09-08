"""Edge AI Monitor.

Raspberry Pi 5 edge-AI object detection using Hailo acceleration.
"""

from detector import run_detector


def main():
    print("=" * 50)
    print("Edge AI Monitor")
    print("Hailo accelerated object detection")
    print("=" * 50)

    run_detector()


if __name__ == "__main__":
    main()