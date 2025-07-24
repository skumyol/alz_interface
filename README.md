# Alzheimer's Interface App

A React Native application built with Expo for Alzheimer's research and patient interaction. The app provides a multi-screen interface for consent forms, contact information, instructions, recording capabilities, and reporting.

## Features

- **Consent Form**: Patient consent management
- **Landing Page**: Welcome interface
- **Contact Form**: Contact information collection
- **Instructions**: User guidance and instructions
- **Recording Page**: Audio recording capabilities
- **Report Page**: Data reporting and analysis

## Technology Stack

- React Native 0.73.6
- Expo ~50.0.19
- React Navigation
- React Native Paper
- TypeScript

## Quick Start

### Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose (for containerized deployment)
- Expo CLI (for local development)

### Local Development

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on specific platforms
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

## Docker Deployment

This application is Docker-ready with both development and production configurations.

### Development with Docker

```bash
# Using docker-compose (recommended)
docker-compose --profile dev up --build

# Or using the convenience script
./scripts/docker-dev.sh

# Access the app at http://localhost:19000
```

### Production Deployment

```bash
# Using docker-compose (recommended)
docker-compose --profile prod up --build -d

# Or using the convenience script
./scripts/docker-prod.sh

# Access the app at http://localhost
```

### Manual Docker Commands

#### Development
```bash
# Build development image
docker build -t alz-interface:dev .

# Run development container
docker run -p 19000:19000 -p 19001:19001 -p 19002:19002 alz-interface:dev
```

#### Production
```bash
# Build production image
docker build -f Dockerfile.prod -t alz-interface:prod .

# Run production container
docker run -p 80:80 alz-interface:prod
```

## Docker Configuration

### Files Overview

- `Dockerfile`: Development container configuration
- `Dockerfile.prod`: Production container with Nginx
- `docker-compose.yml`: Multi-environment orchestration
- `.dockerignore`: Files excluded from Docker context
- `nginx.conf`: Production web server configuration
- `scripts/docker-dev.sh`: Development deployment script
- `scripts/docker-prod.sh`: Production deployment script

### Environment Variables

- `NODE_ENV`: Set to 'development' or 'production'
- `EXPO_DEVTOOLS_LISTEN_ADDRESS`: Set to '0.0.0.0' for Docker

### Ports

- **Development**: 19000 (Expo dev server), 19001 (dev tools), 19002 (Metro bundler)
- **Production**: 80 (HTTP web server)

## Production Deployment

The production setup uses a multi-stage Docker build:

1. **Builder stage**: Installs dependencies and builds the web version
2. **Production stage**: Serves the built files with Nginx

### Features

- Optimized Nginx configuration
- Client-side routing support
- Static asset caching
- Security headers
- Minimal production image size

## Development

### Project Structure

```
├── App.js                 # Main application component
├── components/            # React components
│   ├── DataProvider.js    # Data context provider
│   ├── LandingPage.js     # Welcome screen
│   ├── ConsentForm.js     # Consent management
│   ├── ContactForm.js     # Contact information
│   ├── InstructionPage.js # User instructions
│   ├── RecordPage.js      # Audio recording
│   └── ReportPage.js      # Data reporting
├── assets/                # Static assets
├── package.json           # Dependencies and scripts
└── Docker files           # Containerization config
```

### Adding New Features

1. Create new components in the `components/` directory
2. Add navigation routes in `App.js`
3. Update dependencies in `package.json`
4. Rebuild Docker images if needed

## Troubleshooting

### Common Issues

- **Port conflicts**: Ensure ports 19000-19002 (dev) or 80 (prod) are available
- **Permission issues**: Run `chmod +x scripts/*.sh` to make scripts executable
- **Build failures**: Clear Docker cache with `docker system prune`

### Logs

```bash
# View container logs
docker-compose logs alz-dev    # Development
docker-compose logs alz-prod   # Production

# Follow logs in real-time
docker-compose logs -f alz-dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker
5. Submit a pull request

## License

This project is private and proprietary.
