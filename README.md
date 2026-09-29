# Edge AI Monitor

A Raspberry Pi based edge-AI security and monitoring system with real-time object detection, local event processing and a web dashboard.

The project is designed to process camera input directly on the Raspberry Pi using hardware-accelerated AI inference.

## Current Status

The core architecture is implemented and working.

Currently implemented:

- Raspberry Pi 5 development environment
- Raspberry Pi AI Camera
- Hailo AI accelerator
- Hailo-accelerated YOLOv8 object detection
- Real detection mode on Raspberry Pi
- Mock detection mode for development on other systems
- Shared detection data model
- Detection event logging
- Security event handling
- SQLite event database
- FastAPI backend
- REST API for detections, security events and statistics
- Next.js dashboard
- Dashboard statistics
- Security event overview
- Collapsible recent detection history
- Remote development via SSH and PyCharm
- Git version control

## Architecture

```text
Raspberry Pi + Camera
        |
        v
Hailo / YOLO Detection
        |
        v
Detection Processing
   |             |
   v             v
Logging     Security Events
   |             |
   +-------> SQLite
                |
                v
             FastAPI
                |
                v
        Next.js Dashboard
```

## Hardware

- Raspberry Pi 5
- Raspberry Pi AI HAT with Hailo accelerator
- Raspberry Pi AI Camera
- Raspberry Pi Active Cooler

## Tech Stack

### Backend

- Python
- FastAPI
- SQLite
- Picamera2
- Hailo AI software stack
- YOLOv8

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Development

- Git
- GitHub
- PyCharm
- SSH remote development

## Development Modes

The project supports two detection modes.

### Mock Mode

Used for development without access to the Raspberry Pi hardware.

```bash
python main.py --mode mock
```

### Real Mode

Runs hardware-accelerated detection on the Raspberry Pi.

```bash
python main.py --mode real
```

## Planned Features

- Detection history and filtering
- Detection statistics and analytics
- Security event snapshots
- Live camera stream
- Bounding box visualization
- Notifications
- System monitoring
- Automatic startup on Raspberry Pi
- Event/session tracking
- 3D printed enclosure

## Project Goal

This project is being developed as a practical exploration of edge AI, computer vision, embedded Linux, backend development and modern web development.

The long-term goal is to build a local AI-powered security camera system that performs detection and event processing directly on the Raspberry Pi.