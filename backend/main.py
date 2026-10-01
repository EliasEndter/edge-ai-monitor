"""Edge AI Monitor.

Supports real Hailo detection on Raspberry Pi
and mock detection for development on other systems.
"""

import argparse


def main():
    parser = argparse.ArgumentParser(description="Edge AI Monitor")
    parser.add_argument(
        "--mode",
        choices=["mock", "real"],
        default="mock",
        help="Detection mode: mock or real",
    )

    args = parser.parse_args()

    print("=" * 50)
    print("Edge AI Monitor")
    print(f"Mode: {args.mode}")
    print("=" * 50)

    if args.mode == "mock":
        try:
            from .mock_detector import MockDetector
        except ImportError:  # pragma: no cover
            from mock_detector import MockDetector
        detector = MockDetector()
        detector.run()
    elif args.mode == "real":
        try:
            from .detector import run_detector
        except ImportError:  # pragma: no cover
            from detector import run_detector
        run_detector()


if __name__ == "__main__":
    main()

