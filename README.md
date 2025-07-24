# Alzheimer's Disease Detection App

A modern React Native Expo application for Alzheimer's disease detection through voice analysis. This app provides a user-friendly interface for recording voice samples and analyzing them for cognitive assessment.

## Features

- **Cross-Platform**: Runs on iOS, Android, and Web
- **Bilingual Support**: English and Chinese (Traditional) interface
- **Modern UI/UX**: Clean, accessible design with smooth animations
- **Voice Recording**: High-quality audio recording for analysis
- **Real-time Processing**: Server-side analysis with progress feedback
- **Responsive Design**: Optimized for both mobile and web platforms

## Technology Stack

- **Framework**: React Native with Expo SDK 52
- **Navigation**: React Navigation 6
- **UI Components**: Custom components with React Native Paper
- **Styling**: Modern design system with gradients and shadows
- **Audio**: Expo AV for cross-platform audio recording
- **State Management**: React Context API
- **TypeScript**: Full TypeScript support for type safety

## Project Structure

```
src/
├── components/
│   └── common/           # Reusable UI components
├── contexts/             # React Context providers
├── navigation/           # Navigation configuration
├── screens/              # Main application screens
└── theme/               # Design system (colors, typography, spacing)
```

## Screens Flow

1. **ConsentForm** - Welcome screen with institutional logos
2. **ContactForm** - User information collection
3. **LandingPage** - Main dashboard with dev mode options
4. **InstructionPage** - Recording instructions
5. **RecordPage** - Voice recording interface
6. **ReportPage** - Analysis results display

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on specific platforms:
```bash
npm run ios     # iOS simulator
npm run android # Android emulator
npm run web     # Web browser
```

## Platform-Specific Features

### Mobile (iOS/Android)
- Full audio recording functionality
- Native UI components
- Optimized performance

### Web
- Responsive design
- Graceful degradation for audio recording
- Clear messaging about mobile app requirements

## Configuration

The app includes several configuration options:

- **Dev Mode**: Toggle for development/testing features
- **Language**: Switch between English and Chinese
- **Server Modes**: Different analysis modes for testing

## API Integration

The app connects to a backend service for voice analysis:
- Endpoint: `http://ddbackup.lumilynx.co/predict`
- Supports audio file upload and analysis
- Returns cognitive assessment scores

## Development

### Adding New Languages

1. Update `src/contexts/LanguageContext.tsx`
2. Add translations to the `translations` object
3. Update the language toggle component

### Customizing Themes

Modify files in `src/theme/`:
- `colors.ts` - Color palette
- `typography.ts` - Font styles
- `spacing.ts` - Layout spacing and shadows

### Adding New Screens

1. Create screen component in `src/screens/`
2. Add to navigation in `src/navigation/AppNavigator.tsx`
3. Update TypeScript types for navigation

## Building for Production

### Web Deployment
```bash
expo build:web
```

### Mobile App Stores
```bash
expo build:ios
expo build:android
```

## Docker Support

The project includes Docker configuration for containerized deployment:

```bash
# Development
docker-compose --profile dev up --build

# Production
docker-compose --profile prod up --build -d
```

## Contributing

1. Follow the existing code style and patterns
2. Ensure TypeScript types are properly defined
3. Test on all target platforms (iOS, Android, Web)
4. Update documentation for new features

## License

This project is developed for HKUST Center of Aging research purposes.

## Support

For technical issues or questions, please refer to the development team or create an issue in the project repository.
