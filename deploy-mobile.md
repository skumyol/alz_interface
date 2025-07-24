# Mobile Deployment Guide

## Option 1: Expo Development Build (Recommended)

### Setup EAS Build
```bash
npm install -g @expo/cli
npx expo install expo-dev-client
eas build --platform all --profile development
```

### Share with Users
1. Users install Expo Go app
2. Share the QR code or deep link
3. Users can run the app natively

## Option 2: Expo Publish (Legacy but Simple)
```bash
npx expo publish
```
- Generates a public URL
- Users scan QR code with Expo Go
- Works immediately on iOS/Android

## Option 3: App Store Distribution
```bash
eas build --platform all --profile production
eas submit --platform all
```
- Full app store distribution
- Professional deployment
- Requires Apple/Google developer accounts

## QR Code Access
Once deployed, users can:
1. Open camera app on phone
2. Scan the QR code
3. App opens in Expo Go or browser
4. Full functionality on mobile devices
