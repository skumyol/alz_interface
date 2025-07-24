#!/bin/bash

# Production Docker script
echo "Starting Alzheimer's Interface App in Production Mode..."

# Build and run production container
docker-compose --profile prod up --build -d

echo "Production server started!"
echo "Access the app at: http://localhost"
echo "To stop the server, run: docker-compose --profile prod down"
