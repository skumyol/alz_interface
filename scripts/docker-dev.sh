#!/bin/bash

# Development Docker script
echo "Starting Alzheimer's Interface App in Development Mode..."

# Build and run development container
docker-compose --profile dev up --build

echo "Development server started!"
echo "Access the app at: http://localhost:19000"
