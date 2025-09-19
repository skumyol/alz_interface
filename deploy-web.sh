#!/bin/bash

# Web Deployment Script for Alzheimer's Detection App
echo "🚀 Building web version for deployment..."

# Build the web version
npx expo export -p web

echo "✅ Web build completed!"
echo "📁 Build files are in the 'dist' directory"
echo ""
echo "🌐 Deployment options:"
echo "1. Upload 'dist' folder to your web server"
echo "2. Use services like Netlify, Vercel, or GitHub Pages"
echo "3. Use Docker for containerized deployment (runs on port 5000)"
echo ""
echo "📱 Users can then access via:"
echo "- Web browsers on any device"
echo "- Mobile browsers (responsive design)"
echo "- Can be added to home screen as PWA"
echo ""
echo "🔧 For Docker deployment:"
echo "- App runs on port 5000 inside container"
echo "- Use nginx reverse proxy to redirect traffic"
