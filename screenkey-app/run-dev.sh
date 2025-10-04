#!/bin/bash
# Clean and build with proper permissions

# Change to app directory
cd "$(dirname "$0")"

# Fix ownership of target directory if it exists
if [ -d "src-tauri/target" ]; then
    echo "Fixing permissions on target directory..."
    sudo chown -R $USER:$USER src-tauri/target
fi

# Run the dev server
npm run tauri dev
