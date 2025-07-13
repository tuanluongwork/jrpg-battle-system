#!/bin/bash

# Build and deploy to GitHub Pages
# Usage: ./deploy-gh-pages.sh

echo "Building Cocos Creator project for web..."
echo "Please build your project in Cocos Creator first (Build -> Web Mobile)"
echo "The build output should be in the 'build/web-mobile' directory"

read -p "Have you built the project in Cocos Creator? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Please build the project first in Cocos Creator"
    exit 1
fi

# Check if build directory exists
if [ ! -d "build/web-mobile" ]; then
    echo "Error: build/web-mobile directory not found!"
    echo "Please build the project in Cocos Creator first"
    exit 1
fi

# Create a temporary directory
TEMP_DIR=$(mktemp -d)

# Copy build files to temp directory
cp -r build/web-mobile/* $TEMP_DIR/

# Switch to gh-pages branch
git checkout -B gh-pages

# Remove all files
git rm -rf .

# Copy build files
cp -r $TEMP_DIR/* .

# Add and commit
git add -A
git commit -m "Deploy to GitHub Pages"

# Push to GitHub
git push origin gh-pages --force

# Switch back to master
git checkout master

# Clean up
rm -rf $TEMP_DIR

echo "Deployment complete!"
echo "Your game will be available at: https://tuanluongwork.github.io/jrpg-battle-system/"
echo "Note: It may take a few minutes for GitHub Pages to update" 