export { colors } from './colors';
export { typography } from './typography';
export { spacing, borderRadius, shadows } from './spacing';
export { 
  webMobileStyles, 
  injectWebStyles, 
  isMobileWeb, 
  isTabletWeb,
  getResponsiveFontSize,
  getResponsiveSpacing 
} from './webStyles';

export const theme = {
  colors: require('./colors').colors,
  typography: require('./typography').typography,
  spacing: require('./spacing').spacing,
  borderRadius: require('./spacing').borderRadius,
  shadows: require('./spacing').shadows,
};
