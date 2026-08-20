#!/bin/bash

# Start Module Federation Development Servers
# This script starts both the remote and host applications

echo "Starting Module Federation development servers..."

# Function to kill background processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $REMOTE_PID $HOST_PID 2>/dev/null
    exit
}

# Set up trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Start remote application on port 5001
echo "Starting remote application on port 5001..."
cd remote && npm run dev &
REMOTE_PID=$!

# Wait a moment for remote to start
sleep 3

# Start host application on port 5173
echo "Starting host application on port 5173..."
cd ./host && npm run dev &
HOST_PID=$!

echo "Both applications are starting..."
echo "Remote app: http://localhost:5001"
echo "Host app: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait
