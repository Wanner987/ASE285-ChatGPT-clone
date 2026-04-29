#!/bin/bash

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install express sqlite3 cors dotenv

# Start server
echo "Starting server..."
npm start &
SERVER_PID=$!

# Install client dependencies
echo "Installing client dependencies..."
cd ../client
npm install @google/genai @testing-library/dom @testing-library/jest-dom @testing-library/react @testing-library/user-event mime react react-dom react-scripts web-vitals
npm install -D @types/node


# Start frontend
echo "Starting frontend..."
npm start &
FRONTEND_PID=$!

echo "Server PID: $SERVER_PID"
echo "Frontend PID: $FRONTEND_PID"

# Wait for both processes
wait