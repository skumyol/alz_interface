import { Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Web-specific responsive breakpoints
export const breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
};

// Check if device is mobile-sized
export const isMobileWeb = Platform.OS === 'web' && width <= breakpoints.mobile;
export const isTabletWeb = Platform.OS === 'web' && width > breakpoints.mobile && width <= breakpoints.tablet;

// Responsive font scaling for web
export const getResponsiveFontSize = (baseFontSize: number): number => {
  if (Platform.OS !== 'web') return baseFontSize;
  
  if (width <= breakpoints.mobile) {
    // Scale down for mobile
    return Math.max(baseFontSize * 0.8, 12);
  } else if (width <= breakpoints.tablet) {
    // Scale slightly down for tablet
    return baseFontSize * 0.9;
  }
  
  return baseFontSize;
};

// Responsive spacing for web
export const getResponsiveSpacing = (baseSpacing: number): number => {
  if (Platform.OS !== 'web') return baseSpacing;
  
  if (width <= breakpoints.mobile) {
    return Math.max(baseSpacing * 0.75, 4);
  } else if (width <= breakpoints.tablet) {
    return baseSpacing * 0.85;
  }
  
  return baseSpacing;
};

// Web-specific styles for better mobile experience
export const webMobileStyles = {
  // Ensure text is readable on mobile
  textOptimization: {
    textSizeAdjust: 'none',
    fontSmooth: 'antialiased',
    webkitFontSmoothing: 'antialiased',
    mozOsxFontSmoothing: 'grayscale',
  },
  
  // Improve touch targets for mobile
  touchOptimization: {
    touchAction: 'manipulation',
    userSelect: 'none',
    webkitTouchCallout: 'none',
    webkitUserSelect: 'none',
    mozUserSelect: 'none',
    msUserSelect: 'none',
  },
  
  // Container styles for better mobile layout
  mobileContainer: {
    minHeight: Platform.OS === 'web' ? '100vh' : '100vh',
    overflowX: 'hidden',
    position: 'relative' as const,
    ...(Platform.OS === 'web' && {
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: 'env(safe-area-inset-bottom, 20px)',
    }),
  },
  
  // Prevent zoom on inputs
  inputOptimization: {
    fontSize: 16 as const, // Prevents zoom on iOS Safari
    ...Platform.select({
      web: {
        touchAction: 'manipulation' as const,
      },
      default: {},
    }),
  } as const,
};

// CSS-in-JS injection for web-specific styles
export const injectWebStyles = () => {
  if (Platform.OS !== 'web') return;
  
  const style = document.createElement('style');
  style.textContent = `
    * {
      box-sizing: border-box;
    }
    
    html, body {
      margin: 0;
      padding: 0;
      overflow-x: hidden;
      font-size: 16px;
      -webkit-text-size-adjust: none;
      text-size-adjust: none;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      height: 100%;
      /* Use dynamic viewport units for better mobile experience */
      min-height: 100dvh;
      min-height: -webkit-fill-available;
    }
    
    #root {
      width: 100%;
      min-height: 100dvh;
      min-height: -webkit-fill-available;
      height: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
    }
    
    /* Fix for mobile browsers viewport issues */
    @supports (height: 100dvh) {
      html, body, #root {
        height: 100dvh;
        min-height: 100dvh;
      }
    }
    
    /* Fallback for older browsers */
    @supports not (height: 100dvh) {
      html, body, #root {
        height: 100vh;
        min-height: 100vh;
      }
    }
    
    /* Improve touch targets */
    button, [role="button"] {
      touch-action: manipulation;
      user-select: none;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      min-height: 44px; /* Apple's recommended minimum touch target */
      min-width: 44px;
    }
    
    /* Prevent zoom on inputs for mobile */
    input, textarea, select {
      font-size: 16px !important;
      touch-action: manipulation;
    }
    
    /* Mobile-specific optimizations */
    @media (max-width: ${breakpoints.mobile}px) {
      body {
        font-size: 14px;
      }
      
      /* Ensure content doesn't get hidden behind mobile UI */
      .mobile-safe-area {
        padding-bottom: env(safe-area-inset-bottom, 20px);
        padding-bottom: max(env(safe-area-inset-bottom), 20px);
      }
      
      /* Better spacing for mobile */
      .mobile-optimized {
        padding: 12px !important;
        margin: 8px !important;
      }
      
      /* Ensure buttons are always visible */
      .mobile-button-container {
        position: sticky;
        bottom: 0;
        background: linear-gradient(transparent, rgba(255,255,255,0.9) 50%);
        padding-top: 20px;
        padding-bottom: env(safe-area-inset-bottom, 20px);
        z-index: 10;
      }
    }
    
    /* Handle iOS Safari specific issues */
    @media screen and (max-width: ${breakpoints.mobile}px) and (-webkit-min-device-pixel-ratio: 2) {
      body {
        /* Fix for iOS Safari address bar */
        min-height: -webkit-fill-available;
      }
    }
  `;
  
  document.head.appendChild(style);
};