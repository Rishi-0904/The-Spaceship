# Autonomous Driving Simulator — Self-Driving Vehicle Perception & Planning

## Project Overview
An autonomous driving perception and planning system designed to simulate self-driving capabilities. It integrates multi-sensor inputs to establish lane segmentation, object classification, trajectory prediction, and control actuation.

## Timeline
**2024 - Present**

## Key Contributions & Achievements
- **Perception Modules**: Designed real-time perception module utilizing YOLOv8 for object classification and UNet for semantic lane segmentation.
- **Multi-Sensor Fusion**: Integrated sensor data (LiDAR point clouds, Camera frames, GPS coordinates, IMU data) to establish stable localization and environmental mapping.
- **Safe Path Planning**: Coded A* and Dijkstra pathfinding models to plan dynamically safe trajectories avoiding static and dynamic obstacles.
- **Vehicle Actuation**: Implemented PID controllers to translate predicted paths to steering, throttle, and brake actuators.

## Technology Stack
- **Deep Learning**: PyTorch, YOLOv8, UNet
- **Computer Vision**: OpenCV, Python
- **Pathfinding Algorithms**: A* Algorithm, Dijkstra's Algorithm
- **Vehicle Control**: PID Controllers
- **Sensors Simulated**: Camera (RGB), LiDAR, GPS, IMU
