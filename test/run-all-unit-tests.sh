#!/usr/bin/env bash
cd "$(dirname "$0")"
echo "Running client tests..."
cd ../my-app/client
npm test -- --watchAll=false
client_exit=$?
echo "Client tests exit code: $client_exit"
echo "Running server tests..."
cd ../server
npm test -- --runInBand
server_exit=$?
echo "Server tests exit code: $server_exit"
echo "All tests completed."
read -p "Press enter to continue"
