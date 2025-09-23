import { Platform, Dimensions } from 'react-native';

// Mobile browser detection and viewport utilities
export const getMobileViewportInfo = () => {
  const { width, height } = Dimensions.get('window');
  const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');
  
  return {
    width,
    height,
    screenWidth,
    screenHeight,
    isMobileBrowser: Platform.OS === 'web' && width <= 768,
    isSmallMobile: Platform.OS === 'web' && width <= 480,
    hasViewportIssues: Platform.OS === 'web' && height < screenHeight * 0.8,
  };
};

// Get safe bottom padding for mobile browsers
export const getSafeBottomPadding = () => {
  const { isMobileBrowser, hasViewportIssues } = getMobileViewportInfo();
  
  if (Platform.OS !== 'web') return 0;
  
  if (isMobileBrowser) {
    return hasViewportIssues ? 40 : 20; // More padding if viewport is compromised
  }
  
  return 0;
};

// Apply mobile viewport fixes
export const applyMobileViewportFixes = () => {
  if (Platform.OS !== 'web') return;
  
  // Function to set the viewport height accounting for mobile browser UI
  const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--full-height', `${window.innerHeight}px`);
  };

  // Apply initial viewport height
  setViewportHeight();

  // Update on resize and orientation change
  window.addEventListener('resize', setViewportHeight);
  window.addEventListener('orientationchange', () => {
    setTimeout(setViewportHeight, 500); // Delay for mobile browser UI changes
  });
  
  // Add aggressive CSS fixes for mobile viewport
  const existingStyle = document.getElementById('mobile-viewport-fixes');
  if (existingStyle) existingStyle.remove();
  
  const style = document.createElement('style');
  style.id = 'mobile-viewport-fixes';
  style.textContent = `
    :root {
      --vh: 1vh;
      --safe-bottom: env(safe-area-inset-bottom, 20px);
    }

    /* Force proper viewport on mobile */
    html, body {
      height: 100vh;
      height: calc(var(--vh, 1vh) * 100);
      min-height: 100vh;
      min-height: calc(var(--vh, 1vh) * 100);
      position: relative;
      overflow-x: hidden;
    }

    #root {
      height: 100vh;
      height: calc(var(--vh, 1vh) * 100);
      min-height: 100vh;
      min-height: calc(var(--vh, 1vh) * 100);
      display: flex;
      flex-direction: column;
    }

    /* Aggressive mobile fixes */
    @media screen and (max-width: 480px) {
      /* Force buttons to be always visible */
      [class*="buttonContainer"],
      [class*="instructionsContainer"] {
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        background: linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0.98) 100%) !important;
        backdrop-filter: blur(15px) !important;
        -webkit-backdrop-filter: blur(15px) !important;
        padding: 20px !important;
        padding-bottom: calc(20px + var(--safe-bottom)) !important;
        z-index: 9999 !important;
        box-shadow: 0 -8px 32px rgba(0,0,0,0.15) !important;
        border-top: 1px solid rgba(255,255,255,0.5) !important;
      }

      /* Prevent content overlap */
      [class*="safeArea"] {
        padding-bottom: 140px !important;
      }

      /* Force proper touch targets */
      button, [role="button"] {
        min-height: 48px !important;
        min-width: 48px !important;
        touch-action: manipulation !important;
      }

      /* Handle very small screens */
      @media screen and (max-height: 550px) {
        [class*="safeArea"] {
          padding-bottom: 100px !important;
        }
        
        [class*="buttonContainer"] {
          padding: 12px !important;
          padding-bottom: calc(12px + var(--safe-bottom)) !important;
        }
      }
    }

    /* iOS Safari specific fixes */
    @supports (-webkit-touch-callout: none) {
      html, body, #root {
        height: -webkit-fill-available !important;
        min-height: -webkit-fill-available !important;
      }
    }

    /* Additional emergency fixes for problematic browsers */
    .emergency-bottom-fix {
      margin-bottom: 80px !important;
    }
  `;
  
  document.head.appendChild(style);
  
  // Additional emergency detection
  setTimeout(() => {
    const buttons = document.querySelectorAll('[class*="buttonContainer"], button');
    buttons.forEach(button => {
      const rect = button.getBoundingClientRect();
      const isVisible = rect.bottom <= window.innerHeight;
      
      if (!isVisible) {
        console.log('Button not visible, applying emergency fix');
        button.classList.add('emergency-bottom-fix');
      }
    });
  }, 2000);
};