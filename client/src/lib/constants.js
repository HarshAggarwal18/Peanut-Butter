/**
 * Design system constants.
 * Single source of truth for colors, spacing, breakpoints.
 * Used by GSAP and other non-Tailwind animations.
 */
export const COLORS = {
  cream: '#FDF6EC',
  creamDark: '#F5E6CE',
  beige: '#E8D5B7',
  golden: '#C4973B',
  goldenLight: '#D4A94E',
  peanut: '#8B5E3C',
  peanutLight: '#A67B5B',
  peanutDark: '#6D4229',
  chocolate: '#3E2723',
  dark: '#1A0E0A',
  white: '#FFFFFF',
};

export const FONTS = {
  serif: "'Playfair Display', Georgia, serif",
  sans: "'Inter', system-ui, -apple-system, sans-serif",
};

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export const EASING = {
  premium: [0.22, 1, 0.36, 1],
  smooth: [0.4, 0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
};

export const SPACING = {
  base: 8,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
};
