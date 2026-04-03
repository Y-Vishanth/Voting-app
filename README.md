🚀 Voting App CI/CD Pipeline (Docker → Kubernetes → GitHub Actions)

<p align="center">
  <img src="https://img.shields.io/badge/CI-CD%20Pipeline-GitHub%20Actions-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Container-Docker-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Orchestration-Kubernetes-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Cloud-AWS%20EC2-orange?style=for-the-badge"/>
</p>---

📌 Project Overview

This project demonstrates an end-to-end CI/CD pipeline for a containerized application using:

- ⚙️ GitHub Actions for automation
- 🐳 Docker for containerization
- ☸️ Kubernetes for orchestration
- ☁️ AWS EC2 for deployment

Whenever code is pushed to GitHub, the pipeline:

1. Builds a Docker image
2. Pushes it to Docker Hub
3. Connects to EC2
4. Deploys the latest version to Kubernetes

---

🗳️ About the Application

This is a real-time voting application where users vote on:

👉 "Who will win World War 3?"

- 🌍 Option 1: Iran
- 🇺🇸 Option 2: USA

✨ Features:

- Real-time vote updates
- Backend powered by Redis & MongoDB
- Simple and responsive UI
- Fully containerized architecture

---

🖼️ Application Preview

"Voting App" (./assets/voting-app.png)

---

🏗️ Architecture

Developer → GitHub → GitHub Actions → Docker Hub → EC2 → Kubernetes → Browser

---

🔄 CI/CD Workflow

1. Code pushed to GitHub (main branch)
2. GitHub Actions triggered
3. Docker image built
4. Image pushed to Docker Hub
5. SSH into EC2
6. Kubernetes manifests applied
7. Deployment updated automatically

---

🛠️ Tech Stack

Category| Tools Used
CI/CD| GitHub Actions
Container| Docker
Orchestration| Kubernetes
Cloud| AWS EC2
Backend| Node.js
Database| MongoDB
Cache| Redis

---

📁 Project Structure

.
├── app/                    # Application source code
├── Dockerfile             # Docker build file
├── k8s/
│   ├── deployment.yaml    # Kubernetes Deployment
│   ├── service.yaml       # Kubernetes Service
├── .github/workflows/
│   └── ci-cd.yaml         # GitHub Actions pipeline
├── docker-compose.yml     # Local development setup
└── README.md

---

⚙️ How to Run Locally

🔹 Step 1: Clone the Repository

git clone https://github.com/Y-Vishanth/node-devops-project.git
cd node-devops-project

---

🔹 Step 2: Run using Docker Compose

docker-compose up -d

---

🔹 Step 3: Access the Application

http://localhost:8090

---

☸️ Kubernetes Deployment

🔹 Apply Kubernetes Files

kubectl apply -f k8s/

---

🔹 Verify Pods

kubectl get pods

---

🔹 Check Services

kubectl get svc

---

🔹 Access Application

http://<EC2-PUBLIC-IP>:30004

---

🔐 GitHub Secrets Used

Secret Name| Purpose
DOCKER_USERNAME| Docker Hub login
DOCKER_PASSWORD| Docker Hub password
EC2_PUBLIC_IP| EC2 connection
EC2_SSH_KEY| SSH authentication

---

🚀 Key Highlights

- 🔥 Fully automated CI/CD pipeline
- ⚡ Zero manual deployment
- 📦 Containerized microservice setup
- ☸️ Kubernetes-based scaling
- 🔐 Secure deployment via SSH



---

👨‍💻 Author

Vishanth Yelamarthy

- GitHub: https://github.com/Y-Vishanth
- LinkedIn: (www.linkedin.com/in/vishanth-yelamarthi)

---




