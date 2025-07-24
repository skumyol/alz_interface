# 🚀 Alzheimer's Detection App - Public Demo Deployment Guide

## Quick Start Options

### Option 1: Web Demo (Fastest - 5 minutes)

**For immediate public access via web browsers and mobile browsers:**

```bash
# 1. Build web version
npx expo export -p web

# 2. Deploy to Netlify (drag & drop the 'dist' folder)
# Visit: https://netlify.com
# Or use Vercel: npx vercel --prod
```

**Result:** Users can access via any web browser on desktop/mobile
- URL: `https://your-app.netlify.app`
- Mobile responsive design
- Can be added to home screen as PWA

### Option 2: Mobile App Demo (Best Experience)

**For native mobile app experience:**

```bash
# 1. Install EAS CLI
npm install -g @expo/cli eas-cli

# 2. Build development version
eas build --platform all --profile development

# 3. Share QR code with users
```

**Result:** Users install Expo Go app and scan QR code
- Native mobile performance
- Full audio recording functionality
- Works on iOS and Android

### Option 3: Server Deployment (Production)

**For your own server with custom domain:**

```bash
# 1. Build and deploy with Docker
docker build -f Dockerfile.web -t alz-interface .
docker run -p 80:80 alz-interface

# 2. Or use docker-compose
docker-compose -f docker-compose.demo.yml up -d
```

## 📱 How Users Access the Demo

### Web Access
1. Share URL: `https://your-domain.com`
2. Users open in any browser
3. Works on desktop, tablet, mobile
4. Can add to home screen for app-like experience

### Mobile App Access
1. Users install "Expo Go" from app store
2. Share QR code or link
3. Scan with Expo Go or camera app
4. App opens with full native functionality

## 🌐 Recommended Deployment Services

### Free Options
- **Netlify**: Drag & drop deployment, instant SSL
- **Vercel**: Git integration, automatic deployments
- **GitHub Pages**: Free hosting for public repos
- **Expo Publish**: Mobile app sharing via QR codes

### Paid Options
- **Your Server**: Full control, custom domain
- **AWS/Google Cloud**: Scalable infrastructure
- **App Stores**: Professional distribution

## 📋 Pre-Deployment Checklist

- [x] App builds successfully (`npx expo export -p web`)
- [x] All screens work properly
- [x] Bilingual support functional
- [x] Audio recording works on mobile
- [x] Web version shows appropriate messages
- [x] Navigation flows correctly
- [x] Server integration working

## 🔧 Configuration for Demo

### Environment Variables
Create `.env` file:
```
EXPO_PUBLIC_API_URL=http://ddbackup.lumilynx.co
EXPO_PUBLIC_APP_NAME=Alzheimer's Detection Demo
```

### Custom Domain Setup
1. Point domain to hosting service
2. Configure SSL certificate
3. Update CORS settings if needed

## 📊 Analytics & Monitoring

Add to `app.json` for usage tracking:
```json
{
  "expo": {
    "analytics": {
      "enabled": true
    }
  }
}
```

## 🚀 One-Click Deployment Commands

### Netlify
```bash
./deploy-web.sh && npx netlify deploy --prod --dir=dist
```

### Vercel
```bash
npx expo export -p web && npx vercel --prod
```

### Your Server
```bash
docker-compose -f docker-compose.demo.yml up -d
```

## 📱 Sharing Instructions for Users

### For Web Demo:
"Visit [your-url] on any device browser. Works on phones, tablets, and computers!"

### For Mobile App:
"1. Install 'Expo Go' from your app store
2. Scan this QR code: [QR_CODE]
3. App will open with full functionality!"

## 🔒 Security Considerations

- HTTPS enabled by default
- CORS configured for API access
- No sensitive data stored locally
- Audio files processed securely

## 📈 Scaling for High Traffic

If expecting many users:
1. Use CDN for static assets
2. Implement rate limiting
3. Monitor server resources
4. Consider load balancing

## 🆘 Troubleshooting

**Common Issues:**
- Audio not working → Direct users to mobile app
- Slow loading → Enable compression in nginx
- CORS errors → Update API server settings

**Support Resources:**
- Expo Documentation: https://docs.expo.dev
- React Native Web: https://necolas.github.io/react-native-web
