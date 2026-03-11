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

## Persistence

MongoDB data is stored in a Docker volume to ensure data persistence across container restarts.
