/**
 * Theme Conversion Module
 * 
 * Converts MUI v5 theme objects to Radix UI theme configuration.
 * Handles color palette, typography, spacing, shadows, breakpoints, and more.
 */

import { MUITheme, RadixThemeConfig, ThemeTokenMap, ThemeConversionOptions } from '../types';

/**
 * Default conversion options
 */
const DEFAULT_OPTIONS: Required<ThemeConversionOptions> = {
  preserveCustomColors: true,
  mapSpacing: true,
  mapTypography: true,
};

/**
 * Convert MUI theme to Radix theme configuration
 */
export function convertMUIThemeToRadix(
  muiTheme: MUITheme,
  options: ThemeConversionOptions = {}
): RadixThemeConfig {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  const radixTheme: RadixThemeConfig = {
    // Colors
    colors: convertColors(muiTheme, opts),
    
    // Typography
    typography: convertTypography(muiTheme, opts),
    
    // Spacing
    spacing: convertSpacing(muiTheme, opts),
    
    // Shadows
    shadows: convertShadows(muiTheme),
    
    // Border radius
    radii: convertRadii(muiTheme),
    
    // Breakpoints
    breakpoints: convertBreakpoints(muiTheme),
    
    // Transitions
    transitions: convertTransitions(muiTheme),
    
    // Z-index
    zIndices: convertZIndices(muiTheme),
  };
  
  return radixTheme;
}

/**
 * Convert MUI color palette to Radix color scales
 */
function convertColors(muiTheme: MUITheme, opts: Required<ThemeConversionOptions>): RadixThemeConfig['colors'] {
  const colors: RadixThemeConfig['colors'] = {};
  const muiPalette = muiTheme.palette || {};
  
  // Primary color scale
  if (muiPalette.primary) {
    colors.primary = generateColorScale(muiPalette.primary);
  }
  
  // Secondary color scale
  if (muiPalette.secondary) {
    colors.secondary = generateColorScale(muiPalette.secondary);
  }
  
  // Error/Destructive color scale
  if (muiPalette.error) {
    colors.destructive = generateColorScale(muiPalette.error);
  }
  
  // Warning color scale
  if (muiPalette.warning) {
    colors.warning = generateColorScale(muiPalette.warning);
  }
  
  // Success color scale
  if (muiPalette.success) {
    colors.success = generateColorScale(muiPalette.success);
  }
  
  // Info color scale
  if (muiPalette.info) {
    colors.info = generateColorScale(muiPalette.info);
  }
  
  // Neutral/Gray scale
  if (muiPalette.grey) {
    colors.gray = generateColorScale(muiPalette.grey);
  }
  
  // Background colors
  if (muiPalette.background) {
    colors.background = muiPalette.background.default || '#ffffff';
    colors.backgroundSecondary = muiPalette.background.paper || '#f5f5f5';
  }
  
  // Text colors
  if (muiPalette.text) {
    colors.foreground = muiPalette.text.primary || '#1a1a2e';
    colors.mutedForeground = muiPalette.text.secondary || '#6b7280';
    colors.disabledForeground = muiPalette.text.disabled || '#9ca3af';
  }
  
  // Action colors
  if (muiPalette.action) {
    colors.accent = muiPalette.action.active || muiPalette.primary?.main || '#2563eb';
    colors.accentForeground = '#ffffff';
  }
  
  // Border colors
  if (muiPalette.divider) {
    colors.border = muiPalette.divider;
  }
  
  // Focus ring
  if (muiPalette.primary) {
    colors.focus = muiPalette.primary.main;
  }
  
  // Preserve custom colors if enabled
  if (opts.preserveCustomColors && muiPalette.custom) {
    for (const [key, value] of Object.entries(muiPalette.custom)) {
      if (typeof value === 'object' && value.main) {
        colors[key] = generateColorScale(value);
      }
    }
  }
  
  return colors;
}

/**
 * Generate a full color scale from MUI color object
 */
function generateColorScale(muiColor: MUITheme['palette']['primary']): RadixThemeConfig['colors']['primary'] {
  if (!muiColor) return {};
  
  const scale: Record<number, string> = {};
  
  // MUI provides: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, A100, A200, A400, A700
  // Radix expects: 1-12 scale
  
  const muiToRadixMap: Record<number, keyof typeof muiColor> = {
    1: 50,
    2: 100,
    3: 200,
    4: 300,
    5: 400,
    6: 500,
    7: 600,
    8: 700,
    9: 800,
    10: 900,
    11: 'A100',
    12: 'A200',
  };
  
  for (const [radixStep, muiStep] of Object.entries(muiToRadixMap)) {
    if (muiColor[muiStep as keyof typeof muiColor]) {
      scale[parseInt(radixStep)] = muiColor[muiStep as keyof typeof muiColor]!;
    }
  }
  
  // Ensure we have at least the main color
  if (muiColor.main && !scale[6]) {
    scale[6] = muiColor.main;
  }
  
  return scale;
}

/**
 * Convert MUI typography to Radix typography
 */
function convertTypography(muiTheme: MUITheme, opts: Required<ThemeConversionOptions>): RadixThemeConfig['typography'] {
  if (!opts.mapTypography || !muiTheme.typography) {
    return {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: { base: '1rem', scale: 1.2 },
      fontWeight: { normal: 400, medium: 500, bold: 700 },
      lineHeight: { normal: 1.5, relaxed: 1.75 },
      letterSpacing: { normal: '0', tight: '-0.02em' },
    };
  }
  
  const muiTypography = muiTheme.typography;
  const fontFamily = muiTypography.fontFamily || 'system-ui, -apple-system, sans-serif';
  
  // Extract font sizes from MUI variants
  const fontSizes: Record<string, string> = {};
  const fontWeights: Record<string, number> = {};
  const lineHeights: Record<string, number> = {};
  
  for (const [variant, value] of Object.entries(muiTypography)) {
    if (typeof value === 'object' && value !== null && 'fontSize' in value) {
      const typographyValue = value as any;
      if (typographyValue.fontSize) {
        fontSizes[variant] = typeof typographyValue.fontSize === 'number' 
          ? `${typographyValue.fontSize}px` 
          : typographyValue.fontSize;
      }
      if (typographyValue.fontWeight) {
        fontWeights[variant] = typographyValue.fontWeight;
      }
      if (typographyValue.lineHeight) {
        lineHeights[variant] = typeof typographyValue.lineHeight === 'number'
          ? typographyValue.lineHeight
          : parseFloat(typographyValue.lineHeight);
      }
    }
  }
  
  return {
    fontFamily,
    fontSize: {
      base: fontSizes.body1 || '1rem',
      scale: 1.2,
      ...fontSizes,
    },
    fontWeight: {
      normal: fontWeights.body1 || 400,
      medium: fontWeights.body2 || 500,
      bold: fontWeights.h6 || 700,
      ...fontWeights,
    },
    lineHeight: {
      normal: lineHeights.body1 || 1.5,
      relaxed: 1.75,
      ...lineHeights,
    },
    letterSpacing: {
      normal: '0',
      tight: '-0.02em',
    },
  };
}

/**
 * Convert MUI spacing to Radix spacing
 */
function convertSpacing(muiTheme: MUITheme, opts: Required<ThemeConversionOptions>): RadixThemeConfig['spacing'] {
  if (!opts.mapSpacing || !muiTheme.spacing) {
    return {
      base: '0.25rem',
      scale: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96],
    };
  }
  
  // MUI spacing is typically a function or number (8px default)
  const spacingValue = typeof muiTheme.spacing === 'function' 
    ? muiTheme.spacing(1) 
    : muiTheme.spacing;
  
  const baseUnit = typeof spacingValue === 'number' ? spacingValue : 8;
  
  return {
    base: `${baseUnit / 16}rem`, // Convert to rem
    scale: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      8,
      10,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64,
      80,
      96,
    ].map(n => n * (baseUnit / 8)), // Scale based on base unit
  };
}

/**
 * Convert MUI shadows to Radix shadows
 */
function convertShadows(muiTheme: MUITheme): RadixThemeConfig['shadows'] {
  const muiShadows = muiTheme.shadows || [];
  
  // MUI has 25 shadow levels (0-24)
  // Radix uses: xs, sm, md, lg, xl, 2xl
  const radixShadows: RadixThemeConfig['shadows'] = {
    xs: muiShadows[1] || '0 1px 2px rgba(0,0,0,0.05)',
    sm: muiShadows[2] || '0 1px 3px rgba(0,0,0,0.1)',
    md: muiShadows[4] || '0 4px 6px -1px rgba(0,0,0,0.1)',
    lg: muiShadows[8] || '0 10px 15px -3px rgba(0,0,0,0.1)',
    xl: muiShadows[12] || '0 20px 25px -5px rgba(0,0,0,0.1)',
    '2xl': muiShadows[16] || '0 25px 50px -12px rgba(0,0,0,0.25)',
    inner: 'inset 0 2px 4px rgba(0,0,0,0.06)',
    none: 'none',
  };
  
  return radixShadows;
}

/**
 * Convert MUI border radius to Radix radii
 */
function convertRadii(muiTheme: MUITheme): RadixThemeConfig['radii'] {
  const muiShape = muiTheme.shape || {};
  const borderRadius = muiShape.borderRadius || 4;
  
  return {
    none: '0',
    xs: `${borderRadius / 4}px`,
    sm: `${borderRadius / 2}px`,
    md: `${borderRadius}px`,
    lg: `${borderRadius * 2}px`,
    xl: `${borderRadius * 3}px`,
    '2xl': `${borderRadius * 4}px`,
    full: '9999px',
  };
}

/**
 * Convert MUI breakpoints to Radix breakpoints
 */
function convertBreakpoints(muiTheme: MUITheme): RadixThemeConfig['breakpoints'] {
  const muiBreakpoints = muiTheme.breakpoints?.values || {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  };
  
  return {
    xs: `${muiBreakpoints.xs}px`,
    sm: `${muiBreakpoints.sm}px`,
    md: `${muiBreakpoints.md}px`,
    lg: `${muiBreakpoints.lg}px`,
    xl: `${muiBreakpoints.xl}px`,
    '2xl': `${(muiBreakpoints.xl || 1536) * 1.5}px`,
  };
}

/**
 * Convert MUI transitions to Radix transitions
 */
function convertTransitions(muiTheme: MUITheme): RadixThemeConfig['transitions'] {
  const muiTransitions = muiTheme.transitions || {};
  
  return {
    fast: muiTransitions.duration?.short || '150ms',
    normal: muiTransitions.duration?.standard || '300ms',
    slow: muiTransitions.duration?.complex || '500ms',
    easing: {
      easeIn: muiTransitions.easing?.easeInOut || 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: muiTransitions.easing?.easeOut || 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: muiTransitions.easing?.easeInOut || 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  };
}

/**
 * Convert MUI z-index to Radix z-indices
 */
function convertZIndices(muiTheme: MUITheme): RadixThemeConfig['zIndices'] {
  const muiZIndex = muiTheme.zIndex || {
    mobileStepper: 1000,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  };
  
  return {
    hide: -1,
    base: 0,
    dropdown: muiZIndex.appBar || 1000,
    sticky: muiZIndex.appBar || 1000,
    modal: muiZIndex.modal || 1300,
    popover: muiZIndex.tooltip || 1500,
    tooltip: muiZIndex.tooltip || 1500,
    toast: muiZIndex.snackbar || 1400,
  };
}

/**
 * Generate theme token mapping for reference
 */
export function generateThemeTokenMap(muiTheme: MUITheme): ThemeTokenMap {
  const tokenMap: ThemeTokenMap = {};
  
  // Color tokens
  if (muiTheme.palette) {
    for (const [colorName, colorValue] of Object.entries(muiTheme.palette)) {
      if (typeof colorValue === 'object' && colorValue !== null) {
        tokenMap[`color.${colorName}`] = `colors.${colorName}`;
      }
    }
  }
  
  // Typography tokens
  if (muiTheme.typography) {
    for (const [variant, value] of Object.entries(muiTheme.typography)) {
      if (typeof value === 'object' && value !== null) {
        tokenMap[`typography.${variant}.fontSize`] = `fontSize.${variant}`;
        tokenMap[`typography.${variant}.fontWeight`] = `fontWeight.${variant}`;
        tokenMap[`typography.${variant}.lineHeight`] = `lineHeight.${variant}`;
      }
    }
  }
  
  // Spacing tokens
  tokenMap['spacing.base'] = 'spacing.base';
  tokenMap['spacing.scale'] = 'spacing.scale';
  
  // Shadow tokens
  tokenMap['shadows'] = 'shadows';
  
  // Radius tokens
  tokenMap['radii'] = 'radii';
  
  // Breakpoint tokens
  tokenMap['breakpoints'] = 'breakpoints';
  
  // Transition tokens
  tokenMap['transitions'] = 'transitions';
  
  // Z-index tokens
  tokenMap['zIndex'] = 'zIndices';
  
  return tokenMap;
}

/**
 * Create a complete Radix theme config with all MUI theme properties
 */
export function createRadixThemeConfig(muiTheme: MUITheme, options: ThemeConversionOptions = {}): RadixThemeConfig {
  const theme = convertMUIThemeToRadix(muiTheme, options);
  const tokenMap = generateThemeTokenMap(muiTheme);
  
  return {
    ...theme,
    // Additional metadata
    _meta: {
      source: 'mui-theme-converter',
      version: '1.0.0',
      tokenMap,
    },
  } as RadixThemeConfig & { _meta: { tokenMap: ThemeTokenMap } };
}

export { convertMUIThemeToRadix, generateThemeTokenMap, createRadixThemeConfig };