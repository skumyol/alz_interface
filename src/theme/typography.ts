import { getResponsiveFontSize } from './webStyles';

export const typography = {
  // Font families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  
  // Font sizes - now responsive for web
  fontSize: {
    xs: getResponsiveFontSize(12),
    sm: getResponsiveFontSize(14),
    base: getResponsiveFontSize(16),
    lg: getResponsiveFontSize(18),
    xl: getResponsiveFontSize(20),
    '2xl': getResponsiveFontSize(24),
    '3xl': getResponsiveFontSize(30),
    '4xl': getResponsiveFontSize(36),
    '5xl': getResponsiveFontSize(48),
    '6xl': getResponsiveFontSize(60),
  },
  
  // Line heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Font weights
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Letter spacing
  letterSpacing: {
    tight: -0.025,
    normal: 0,
    wide: 0.025,
  },
};
