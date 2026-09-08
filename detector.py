import numpy as np

from picamera2 import Picamera2

from hailo_platform import (
    HEF,
    VDevice,
    ConfigureParams,
    HailoStreamInterface,
    InputVStreamParams,
    OutputVStreamParams,
    InferVStreams,
    FormatType,
)


HEF_PATH = "/usr/share/hailo-models/yolov8s_h8.hef"


class EdgeAIDetector:
    def __init__(self):
        print("Loading YOLOv8s model...")

        self.hef = HEF(HEF_PATH)

        self.device = VDevice()

        configure_params = ConfigureParams.create_from_hef(
            self.hef,
            interface=HailoStreamInterface.PCIe
        )

        self.network_group = self.device.configure(
            self.hef,
            configure_params
        )[0]

        self.input_params = InputVStreamParams.make(
            self.network_group,
            format_type=FormatType.UINT8
        )

        self.output_params = OutputVStreamParams.make(
            self.network_group,
            format_type=FormatType.FLOAT32
        )

        self.input_name = self.hef.get_input_vstream_infos()[0].name

        print("Starting camera...")

        self.camera = Picamera2()

        camera_config = self.camera.create_preview_configuration(
            main={
                "size": (640, 640),
                "format": "RGB888"
            }
        )

        self.camera.configure(camera_config)
        self.camera.start()

        print("Detector ready.")

    def run(self):
        print("Starting object detection...")
        print("Press Ctrl+C to stop.\n")

        try:
            with InferVStreams(
                self.network_group,
                self.input_params,
                self.output_params
            ) as pipeline:

                with self.network_group.activate():

                    while True:
                        frame = self.camera.capture_array()

                        # Hailo expects a batch dimension:
                        # (640, 640, 3) -> (1, 640, 640, 3)
                        input_data = np.expand_dims(frame, axis=0)

                        result = pipeline.infer({
                            self.input_name: input_data
                        })

                        self.process_results(result)

        except KeyboardInterrupt:
            print("\nStopping detector...")

        finally:
            self.close()

    def process_results(self, result):
        # Standard COCO class names used by YOLOv8
        coco_classes = [
            "person", "bicycle", "car", "motorcycle", "airplane",
            "bus", "train", "truck", "boat", "traffic light",
            "fire hydrant", "stop sign", "parking meter", "bench",
            "bird", "cat", "dog", "horse", "sheep", "cow",
            "elephant", "bear", "zebra", "giraffe", "backpack",
            "umbrella", "handbag", "tie", "suitcase", "frisbee",
            "skis", "snowboard", "sports ball", "kite",
            "baseball bat", "baseball glove", "skateboard",
            "surfboard", "tennis racket", "bottle", "wine glass",
            "cup", "fork", "knife", "spoon", "bowl", "banana",
            "apple", "sandwich", "orange", "broccoli", "carrot",
            "hot dog", "pizza", "donut", "cake", "chair", "couch",
            "potted plant", "bed", "dining table", "toilet", "tv",
            "laptop", "mouse", "remote", "keyboard", "cell phone",
            "microwave", "oven", "toaster", "sink", "refrigerator",
            "book", "clock", "vase", "scissors", "teddy bear",
            "hair drier", "toothbrush"
        ]

        confidence_threshold = 0.40

        # One output tensor
        detections = next(iter(result.values()))

        # First batch
        detections = detections[0]

        found = []

        for class_id, class_detections in enumerate(detections):
            for detection in class_detections:
                y_min, x_min, y_max, x_max, confidence = detection

                if confidence >= confidence_threshold:
                    found.append(
                        (
                            coco_classes[class_id],
                            float(confidence)
                        )
                    )

        if found:
            print("\n--- DETECTIONS ---")

            for label, confidence in found:
                print(
                    f"{label:<15} "
                    f"{confidence * 100:5.1f}%"
                )
    # We inspect the real NMS structure next.
    # Detection parsing will be added after this works.

    def close(self):
        print("\nClosing camera and Hailo device...")

        self.camera.stop()
        self.camera.close()
        self.device.release()

        print("Shutdown complete.")


def run_detector():
    detector = EdgeAIDetector()
    detector.run()