/**
 * Design System - Design Tokens (TypeScript)
 * 统一的设计规范和主题变量 - TypeScript版本
 */

// ============================================
// Color System - 颜色系统
// ============================================

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export const colors = {
  // Primary Colors - 主色调
  primary: {
    50: 'oklch(0.985 0.05 45)',
    100: 'oklch(0.97 0.08 45)',
    200: 'oklch(0.94 0.12 45)',
    300: 'oklch(0.88 0.16 45)',
    400: 'oklch(0.82 0.20 45)',
    500: 'oklch(0.75 0.22 45)', // 主色
    600: 'oklch(0.68 0.20 45)',
    700: 'oklch(0.60 0.18 45)',
    800: 'oklch(0.52 0.16 45)',
    900: 'oklch(0.45 0.14 45)',
    950: 'oklch(0.38 0.12 45)',
  } as ColorScale,

  // Secondary Colors - 次要色调
  secondary: {
    50: 'oklch(0.985 0.05 270)',
    100: 'oklch(0.97 0.08 270)',
    200: 'oklch(0.94 0.12 270)',
    300: 'oklch(0.88 0.16 270)',
    400: 'oklch(0.82 0.20 270)',
    500: 'oklch(0.75 0.22 270)', // 次要色
    600: 'oklch(0.68 0.20 270)',
    700: 'oklch(0.60 0.18 270)',
    800: 'oklch(0.52 0.16 270)',
    900: 'oklch(0.45 0.14 270)',
    950: 'oklch(0.38 0.12 270)',
  } as ColorScale,

  // Accent Colors - 强调色
  accent: {
    50: 'oklch(0.985 0.05 180)',
    100: 'oklch(0.97 0.08 180)',
    200: 'oklch(0.94 0.12 180)',
    300: 'oklch(0.88 0.16 180)',
    400: 'oklch(0.82 0.20 180)',
    500: 'oklch(0.75 0.22 180)', // 强调色
    600: 'oklch(0.68 0.20 180)',
    700: 'oklch(0.60 0.18 180)',
    800: 'oklch(0.52 0.16 180)',
    900: 'oklch(0.45 0.14 180)',
    950: 'oklch(0.38 0.12 180)',
  } as ColorScale,

  // Neutral Colors - 中性色
  neutral: {
    0: 'oklch(1 0 0)',      // 纯白
    50: 'oklch(0.985 0 0)',
    100: 'oklch(0.97 0 0)',
    200: 'oklch(0.94 0 0)',
    300: 'oklch(0.88 0 0)',
    400: 'oklch(0.82 0 0)',
    500: 'oklch(0.75 0 0)',
    600: 'oklch(0.68 0 0)',
    700: 'oklch(0.60 0 0)',
    800: 'oklch(0.52 0 0)',
    900: 'oklch(0.45 0 0)',
    950: 'oklch(0.38 0 0)',
    1000: 'oklch(0 0 0)',  // 纯黑
  },

  // Semantic Colors - 语义色
  success: {
    50: 'oklch(0.985 0.05 140)',
    500: 'oklch(0.75 0.22 140)',
    600: 'oklch(0.68 0.20 140)',
  },

  warning: {
    50: 'oklch(0.985 0.05 80)',
    500: 'oklch(0.75 0.22 80)',
    600: 'oklch(0.68 0.20 80)',
  },

  error: {
    50: 'oklch(0.985 0.05 25)',
    500: 'oklch(0.75 0.22 25)',
    600: 'oklch(0.68 0.20 25)',
  },

  info: {
    50: 'oklch(0.985 0.05 220)',
    500: 'oklch(0.75 0.22 220)',
    600: 'oklch(0.68 0.20 220)',
  },
} as const;

// ============================================
// Typography - 字体系统
// ============================================

export interface TypographyScale {
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing?: string;
}

export const typography = {
  // Font Families
  fontFamily: {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },

  // Font Sizes
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',     // 24px
    '3xl': '1.875rem',   // 30px
    '4xl': '2.25rem',    // 36px
    '5xl': '3rem',       // 48px
    '6xl': '3.75rem',    // 60px
    '7xl': '4.5rem',     // 72px
    '8xl': '6rem',       // 96px
    '9xl': '8rem',       // 128px
  },

  // Font Weights
  fontWeight: {
    thin: 100,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // Line Heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Heading Styles
  heading: {
    h1: {
      fontSize: '3.75rem',     // 60px
      fontWeight: 700,
      lineHeight: '1.25',
    } as TypographyScale,
    h2: {
      fontSize: '3rem',        // 48px
      fontWeight: 700,
      lineHeight: '1.25',
    } as TypographyScale,
    h3: {
      fontSize: '2.25rem',     // 36px
      fontWeight: 700,
      lineHeight: '1.25',
    } as TypographyScale,
    h4: {
      fontSize: '1.875rem',    // 30px
      fontWeight: 600,
      lineHeight: '1.25',
    } as TypographyScale,
    h5: {
      fontSize: '1.5rem',      // 24px
      fontWeight: 600,
      lineHeight: '1.375',
    } as TypographyScale,
    h6: {
      fontSize: '1.25rem',     // 20px
      fontWeight: 600,
      lineHeight: '1.375',
    } as TypographyScale,
  },

  // Body Text Styles
  body: {
    lg: {
      fontSize: '1.125rem',    // 18px
      fontWeight: 400,
      lineHeight: '1.625',
    } as TypographyScale,
    base: {
      fontSize: '1rem',        // 16px
      fontWeight: 400,
      lineHeight: '1.5',
    } as TypographyScale,
    sm: {
      fontSize: '0.875rem',    // 14px
      fontWeight: 400,
      lineHeight: '1.5',
    } as TypographyScale,
  },

  // Caption Styles
  caption: {
    fontSize: '0.75rem',      // 12px
    fontWeight: 400,
    lineHeight: '1.25',
  } as TypographyScale,
} as const;

// ============================================
// Spacing - 间距系统
// ============================================

export const spacing = {
  0: '0',
  0.5: '0.125rem',   // 2px
  1: '0.25rem',      // 4px
  1.5: '0.375rem',   // 6px
  2: '0.5rem',       // 8px
  2.5: '0.625rem',   // 10px
  3: '0.75rem',      // 12px
  3.5: '0.875rem',   // 14px
  4: '1rem',         // 16px
  5: '1.25rem',      // 20px
  6: '1.5rem',       // 24px
  7: '1.75rem',      // 28px
  8: '2rem',         // 32px
  9: '2.25rem',      // 36px
  10: '2.5rem',      // 40px
  11: '2.75rem',     // 44px
  12: '3rem',        // 48px
  14: '3.5rem',      // 56px
  16: '4rem',        // 64px
  20: '5rem',        // 80px
  24: '6rem',        // 96px
  28: '7rem',        // 112px
  32: '8rem',        // 128px
  36: '9rem',        // 144px
  40: '10rem',       // 160px
  44: '11rem',       // 176px
  48: '12rem',       // 192px
  52: '13rem',       // 208px
  56: '14rem',       // 224px
  60: '15rem',       // 240px
  64: '16rem',       // 256px
  72: '18rem',       // 288px
  80: '20rem',       // 320px
  96: '24rem',       // 384px
} as const;

// ============================================
// Radius - 圆角系统
// ============================================

export const radius = {
  none: '0',
  sm: '0.125rem',     // 2px
  base: '0.25rem',    // 4px
  md: '0.375rem',     // 6px
  lg: '0.5rem',       // 8px
  xl: '0.75rem',      // 12px
  '2xl': '1rem',        // 16px
  '3xl': '1.5rem',      // 24px
  full: '9999px',     // 完全圆角
} as const;

// ============================================
// Shadows - 阴影系统
// ============================================

export const shadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '2xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
} as const;

// ============================================
// Z-Index - 层级系统
// ============================================

export const zIndex = {
  hide: -1,
  base: 0,
  raised: 1,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;

// ============================================
// Transitions - 过渡动画
// ============================================

export const transitions = {
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  timing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// ============================================
// Component Variants - 组件变体
// ============================================

export const componentVariants = {
  // Button Variants
  button: {
    primary: {
      backgroundColor: colors.primary[500],
      color: 'white',
      borderColor: colors.primary[500],
      hover: {
        backgroundColor: colors.primary[600],
        borderColor: colors.primary[600],
      },
    },
    secondary: {
      backgroundColor: colors.secondary[500],
      color: 'white',
      borderColor: colors.secondary[500],
      hover: {
        backgroundColor: colors.secondary[600],
        borderColor: colors.secondary[600],
      },
    },
    outline: {
      backgroundColor: 'transparent',
      color: colors.primary[500],
      borderColor: colors.primary[500],
      hover: {
        backgroundColor: colors.primary[50],
        color: colors.primary[600],
        borderColor: colors.primary[600],
      },
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.neutral[700],
      borderColor: 'transparent',
      hover: {
        backgroundColor: colors.neutral[100],
        color: colors.neutral[800],
      },
    },
  },

  // Card Variants
  card: {
    default: {
      backgroundColor: 'white',
      borderColor: colors.neutral[200],
      shadow: shadows.sm,
    },
    elevated: {
      backgroundColor: 'white',
      borderColor: colors.neutral[200],
      shadow: shadows.lg,
    },
    bordered: {
      backgroundColor: 'white',
      borderColor: colors.neutral[300],
      shadow: shadows.none,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: colors.neutral[200],
      shadow: shadows.none,
    },
  },
} as const;

// ============================================
// Breakpoints - 断点系统
// ============================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================
// Dark Mode Colors - 暗色模式颜色
// ============================================

export const darkModeColors = {
  // Primary Colors - Dark Mode
  'primary-dark': {
    50: 'oklch(0.38 0.12 45)',
    100: 'oklch(0.45 0.14 45)',
    200: 'oklch(0.52 0.16 45)',
    300: 'oklch(0.60 0.18 45)',
    400: 'oklch(0.68 0.20 45)',
    500: 'oklch(0.75 0.22 45)',
    600: 'oklch(0.82 0.20 45)',
    700: 'oklch(0.88 0.16 45)',
    800: 'oklch(0.94 0.12 45)',
    900: 'oklch(0.97 0.08 45)',
    950: 'oklch(0.985 0.05 45)',
  } as ColorScale,
} as const;

// ============================================
// Utility Functions - 工具函数
// ============================================

/**
 * 获取颜色值
 */
export function getColor(colorName: keyof typeof colors, shade: keyof ColorScale = 500): string {
  const colorScale = colors[colorName];
  if (colorScale && typeof colorScale === 'object' && shade in colorScale) {
    return colorScale[shade as keyof typeof colorScale];
  }
  return colors.neutral[500];
}

/**
 * 获取间距值
 */
export function getSpacing(spacingKey: keyof typeof spacing): string {
  return spacing[spacingKey];
}

/**
 * 获取圆角值
 */
export function getRadius(radiusKey: keyof typeof radius): string {
  return radius[radiusKey];
}

/**
 * 获取阴影值
 */
export function getShadow(shadowKey: keyof typeof shadows): string {
  return shadows[shadowKey];
}

/**
 * 获取字体样式
 */
export function getTypography(variant: keyof typeof typography.heading): TypographyScale {
  return typography.heading[variant];
}

/**
 * 获取组件变体样式
 */
export function getComponentVariant(
  component: keyof typeof componentVariants,
  variant: string
): any {
  const componentConfig = componentVariants[component];
  if (componentConfig && variant in componentConfig) {
    return componentConfig[variant as keyof typeof componentConfig];
  }
  return null;
}

// ============================================
// CSS-in-JS 支持
// ============================================

/**
 * 创建主题对象，用于CSS-in-JS库
 */
export function createTheme() {
  return {
    colors,
    typography,
    spacing,
    radius,
    shadows,
    zIndex,
    transitions,
    componentVariants,
    breakpoints,
  };
}

export default {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  zIndex,
  transitions,
  componentVariants,
  breakpoints,
  darkModeColors,
  getColor,
  getSpacing,
  getRadius,
  getShadow,
  getTypography,
  getComponentVariant,
  createTheme,
};