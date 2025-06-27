# VR Gameroom - Setup Guide

## 📋 Overview

VR Gameroom is a fork of the Monaco Gameroom project, customized for VR (Virtual Reality) branding and theming. This guide will help you set up and customize the project for your specific needs.

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/monaco-gg/vr-gameroom.git
cd vr-gameroom
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file and configure it:
```bash
cp .env.example .env.local
```

### 4. Run Development Server
```bash
npm run dev
```

## 🎨 Customization Guide

### Branding Changes

#### 1. Colors and Theme
- **Primary Colors**: Update in `tailwind.config.js`
- **Logo**: Replace `public/logo.png` and related logo files
- **Favicon**: Update `public/icon.ico` and icon files in `public/icons/`

#### 2. Game Assets
- **Game Sprites**: Update sprites in `public/games/` directories
- **Background Images**: Replace images in `public/imgs/`
- **Audio Files**: Update game sounds in `public/audios/`

#### 3. Text and Content
- **Translations**: Update `public/locales/` files
- **Game Names**: Update game titles and descriptions
- **UI Text**: Modify component text throughout the application

### Key Files to Customize

1. **`tailwind.config.js`** - Theme colors and styling
2. **`public/logo.png`** - Main logo
3. **`public/manifest.json`** - PWA manifest
4. **`src/components/Header/index.js`** - Header branding
5. **`src/pages/index.js`** - Landing page content
6. **`public/locales/`** - Multi-language support

## 🔧 Configuration

### Environment Variables

Required environment variables for production:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.com

# API Configuration
API_KEY=your_api_key
CRON_SECRET=your_cron_secret

# Firebase (for notifications)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key

# Payment Providers
ASAAS_API_KEY=your_asaas_api_key
STARKBANK_PROJECT_ID=your_starkbank_project_id
STARKBANK_PRIVATE_KEY=your_starkbank_private_key
```

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### AWS Deployment
Use the deployment scripts from `monaco-devops-scripts`:
```bash
# Build and deploy to AWS ECS
./gameroom-deploy-aws.sh
```

## 📱 PWA Features

The application includes Progressive Web App features:
- Offline support
- Install prompt
- Push notifications
- Service worker caching

## 🎮 Games Included

1. **Runner** - Endless runner game
2. **ShootEmUp** - Space shooter game
3. **StackJump** - Platform jumping game
4. **Touch** - Reaction time game

## 🔄 Cron Jobs

The application uses two daily cron jobs:
- **Coin Renewal**: `/api/users/renew-coins` (12:00 UTC)
- **Order Cleanup**: `/api/orders/batch-cancel-expired` (12:00 UTC)

## 📞 Support

For technical support or customization requests, contact the development team.

---

**Note**: This is a fork of the Monaco Gameroom project. Make sure to respect the original project's license and attribution requirements. 