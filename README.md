# Node DevOps Mongo Redis Demo

## Overview
This project demonstrates a simple Node.js application deployed using Docker and Docker Compose with MongoDB and Redis.

## Architecture

Node.js → Application server  
MongoDB → Database  
Redis → Caching service  

All services run in separate Docker containers and communicate through Docker Compose networking.

## Project Structure

app.js – Node application  
Dockerfile – Build Node container  
docker-compose.yml – Run multi-container setup  
.env – Environment variables  

## Setup Instructions

Clone the repository

Run the application

docker-compose up --build

Application will be available at

http://localhost:8090

## Endpoints

/ → confirms application is running  
/health → returns application health status

## Tech Stack

Node.js

Docker

Docker Compose

MongoDB

Redis

Linux (AWS EC2)

## Project Structure

node-devops-project
│
├── app.js
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .env
└── README.md

## Setup Instructions

1️⃣ Clone the repository
git clone https://github.com/Y-Vishanth/node-devops-project.git
cd node-devops-project

2️⃣ Start the application
docker-compose up --build

This will start the following containers:

Node.js Application
MongoDB
Redis

## Access the application

Open in browser:

http://localhost:8090

Health endpoint:

http://localhost:8090/health

## Data Persistence

MongoDB uses Docker volumes to ensure data persists even if the container is restarted or removed.

Volume → mongo-data
Mount → /data/db

## DevOps Concepts Demonstrated

Docker containerization

Multi-container orchestration using Docker Compose

Service discovery using Docker networking

Environment variable management with .env

Persistent storage using Docker volumes

## Author

Vishanth Yelamarthy

GitHub
https://github.com/Y-Vishanth
