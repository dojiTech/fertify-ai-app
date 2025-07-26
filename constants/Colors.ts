/**
 * Agricultural color palette for Fertify AI app (light and dark mode).
 * Inspired by nature: leafy greens, soil browns, sky blues, and sun yellows.
 */

const tintColorLight = '#388e3c'; // Leafy green
const tintColorDark = '#a5d6a7';  // Light green for dark mode accent
const backgroundLight = '#f5fbe7'; // Very light green/earth
const backgroundDark = '#263238';  // Deep earth/forest
const textLight = '#2e4631'; // Dark greenish-brown
const textDark = '#e8f5e9';  // Light greenish
const iconLight = '#8d6e63'; // Soil brown
const iconDark = '#cfd8dc';  // Muted light for dark mode
const tabIconDefaultLight = '#a1887f'; // Muted brown
const tabIconDefaultDark = '#789262';  // Muted green
const tabIconSelectedLight = tintColorLight;
const tabIconSelectedDark = tintColorDark;

export const Colors = {
  light: {
    text: textLight,
    background: backgroundLight,
    tint: tintColorLight,
    icon: iconLight,
    tabIconDefault: tabIconDefaultLight,
    tabIconSelected: tabIconSelectedLight,
  },
  dark: {
    text: textDark,
    background: backgroundDark,
    tint: tintColorDark,
    icon: iconDark,
    tabIconDefault: tabIconDefaultDark,
    tabIconSelected: tabIconSelectedDark,
  },
};
