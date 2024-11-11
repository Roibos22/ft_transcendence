# ft_transcendence

## 🌟 Overview
**ft_transcendence** is the final project in the [42 School](https://www.42berlin.de/en/program/curriculum/) core curriculum. It showcases a comprehensive and full-featured web application that combines system administration and web development skills. The project features a RESTful API backend and a responsive single-page web application, enabling cross-desktop gameplay. While the CLI client provides full game functionality, the Desktop App offers a dynamic 3D visualization. Security is ensured through JWT authentication and 2FA implementation.

## 🖥️ Technologies Used
- **Web App**: Javascript, HTML, CSS, Bootstrap, Three.js
- **Backend**: Django, REST
- **Database**: PostgreSQL
- **Authentication**: JWT, 2FA
- **Containerization**: Docker, Docker Compose
- **Real-time Communication**: WebSockets
- **CLI app**: Python3

## 🚀 Features
- **User Authentication**: Secure login system with JWT integration and 2FA.
- **Game Feature**: Implemented a multiplayer game (e.g., Pong) that users can play against each other.
- **User Profiles**: Customizable profiles with settings.
- **Security**: JWT, passwords hashing, 2FA
- **Responsive Design**: Optimized for desktop devices.
- **CLI client**: CLI client with full functionality
- **3D Visualization**: Dynamic 3D game environment display.
- **Remote Players**: Cross-desktop multiplayer support via WebSocket connections.


## 🛠️ Getting Started

### Prerequisites
- **Docker** and **Docker Compose** installed on your machine.

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Roibos22/ft_transcendence.git
   cd ft_transcendence
   ```
2. Setup environment:
   - Creates .env from .env.example.
   - In order to use 2FA or Remote Players, please update the .env with your values
   ```
   make setup
   ```
4. Run the project:
   ```
   make run
   ```
5. Access the application:
   ```
   open https://localhost:8443
   ```
