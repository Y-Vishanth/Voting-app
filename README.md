---

🚀 Voting App CI/CD Pipeline (Docker → Kubernetes → GitHub Actions)

---

📌 Project Overview
This project demonstrates a complete CI/CD pipeline for a containerized Voting Application using:
⚙️ GitHub Actions for automation
🐳 Docker for containerization
☸️ Kubernetes for orchestration
☁️ AWS EC2 for deployment

The pipeline automatically builds, pushes, and deploys the application whenever changes are made to the repository.

---
🗳️ About the Application
This is a simple real-time voting application where users can vote on a fun scenario:

> “Who will win World War 3?”
🎯 Features:
Users can vote between:
🇮🇷 Iran
🇺🇸 USA
Displays live vote counts
Shows results using progress bars
Backend connected to:
Redis (for caching / real-time updates)
MongoDB (for persistence)

This app is used as a sample microservice-based application to demonstrate real-world DevOps workflows.

---

🧠 Architecture Flow
Developer → GitHub Repository → GitHub Actions (CI)
                                      ↓
                            Build Docker Image
                                      ↓
                            Push to Docker Hub
                                      ↓
                            SSH into EC2
                                      ↓
                            Deploy to Kubernetes
                                      ↓
                            Expose via NodePort

---

🛠️ Tech Stack
Category	               Tools
CI/CD	                 GitHub Actions
Containerization	     Docker
Orchestration	         Kubernetes
Cloud                    AWS 
Registry	             Docker Hub
Backend Services	     Redis, MongoDB

---

📂 Project Structure
node-devops-project/
│
├── .github/workflows/
│   └── ci-cd.yaml              # CI/CD pipeline
│
├── k8s/
│   ├── deployment.yaml         # Kubernetes deployment
│   ├── service.yaml            # Kubernetes service
│
├── docker-compose.yml          # Local setup
├── Dockerfile                  # Image build
└── app/                        # Application source

---

🖥️ How to Run Locally

---

🔹 Step 1: Clone Repository
git clone https://github.com/Y-Vishanth/node-devops-project.git
cd node-devops-project

---

🔹 Step 2: Install Requirements
Docker
Docker Compose

---

🔹 Step 3: Start Application
docker-compose up -d

---

🔹 Step 4: Verify Running Containers
docker ps

---

🔹 Step 5: Access Application
http://localhost:8090

---

⚙️ CI/CD Pipeline

---

📄 Workflow File

Refer:
.github/workflows/ci-cd.yaml

Pipeline Responsibilities:
Build Docker image
Push image to Docker Hub
Deploy to Kubernetes on EC2

---

☸️ Kubernetes Deployment

---

📄 Deployment File
k8s/deployment.yaml

---
📄 Service File
k8s/service.yaml

---

🚀 Deployment Flow

---

🔹 Step 1: Push Code
git add .
git commit -m "Trigger pipeline"
git push origin main

---

🔹 Step 2: Pipeline Execution
GitHub Actions triggers automatically
Docker image is built and pushed
Deployment is updated on EC2

---

🔹 Step 3: Verify Deployment
kubectl get pods
kubectl get svc

---

🌐 Access Application (Production)
http://<EC2-PUBLIC-IP>:30004

---

🔄 End-to-End Flow
Code Push → Build → Push Image → Deploy → Kubernetes → App Live

---
Author:

Vishath Yelamarthi


