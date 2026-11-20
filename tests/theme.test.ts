/**
 * Theme Conversion Tests
 */

import { describe, it, expect } from 'vitest';
import { 
  convertMUIThemeToRadix, 
  generateThemeTokenMap, 
  createRadixThemeConfig 
} from '../src/theme';

describe('convertMUIThemeToRadix', () => {
  const sampleMUITheme = {
    palette: {
      primary: {
        50: '#e3f2fd', 100: '#bbdefb', 200: '#90caf9', 300: '#64b5f6',
        400: '#42a5f5', 500: '#2196f3', 600: '#1e88e5', 700: '#1976d2',
        800: '#1565c0', 900: '#0d47a1', A100: '#82b1ff', A200: '#448aff',
        A400: '#2979ff', A700: '#2962ff', main: '#1976d2', light: '#42a5f5',
        dark: '#1565c0', contrastText: '#ffffff'
      },
      secondary: {
        main: '#dc004e', light: '#ff5983', dark: '#9a0036', contrastText: '#fff'
      },
      error: { main: '#f44336' },
      warning: { main: '#ff9800' },
      success: { main: '#4caf50' },
      grey: {
        50: '#fafafa', 100: '#f5f5f5', 200: '#eeeeee', 300: '#e0e0e0',
        400: '#bdbdbd', 500: '#9e9e9e', 600: '#757575', 700: '#616161',
        800: '#424242', 900: '#212121'
      },
      background: { default: '#ffffff', paper: '#fafafa' },
      text: { primary: '#212121', secondary: '#757575', disabled: '#9e9e9e' },
      divider: 'rgba(0,0,0,0.12)',
      action: { active: 'rgba(0,0,0,0.54)', hover: 'rgba(0,0,0,0.04)' }
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: 14,
      h1: { fontSize: '6rem', fontWeight: 300, lineHeight: 1.167 },
      h2: { fontSize: '3.75rem', fontWeight: 300, lineHeight: 1.2 },
      h3: { fontSize: '3rem', fontWeight: 400, lineHeight: 1.167 },
      h4: { fontSize: '2.125rem', fontWeight: 400, lineHeight: 1.235 },
      h5: { fontSize: '1.5rem', fontWeight: 400, lineHeight: 1.334 },
      h6: { fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.6 },
      body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
      body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.43 },
      button: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.75, textTransform: 'uppercase' },
    },
    spacing: 8,
    shadows: [
      'none',
      '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
      // ... more shadows
    ],
    shape: { borderRadius: 4 },
    breakpoints: { values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 } },
    transitions: {
      duration: { shortest: 150, shorter: 200, short: 250, standard: 300, complex: 375, long: 500 },
      easing: { easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)', easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)', easeIn: 'cubic-bezier(0.4, 0, 1, 1)' }
    },
    zIndex: { mobileStepper: 1000, appBar: 1100, drawer: 1200, modal: 1300, snackbar: 1400, tooltip: 1500 }
  };

  it('should convert primary colors to 12-step scale', () => {
    const radixTheme = convertMUIThemeToRadix(sampleMUITheme);
    
    expect(radixTheme.colors.primary).toBeDefined();
    expect(Object.keys(radixTheme.colors.primary!).length).toBeGreaterThanOrEqual(10);
    expect(radixTheme.colors.primary![6]).toBe('#1976d2'); // main color at step 6
  });

  it('should convert secondary colors', () => {
    const radixTheme = convertMUIThemeToRadix(sampleMUITheme);
    
    expect(radixTheme.colors.secondary).toBeDefined();
    expect(radixTheme.colors.secondary![6]).toBe('#dc004e');
  });

  it('should convert error, warning, success colors', () => {
    const radixTheme = convertMUIThemeToRadix(sampleMUITheme);
    
    expect(radixTheme.colors.destructive).toBeDefined();
    expect(radixTheme.colors.warning).toBeDefined();
    expect(radixTheme.colors.success).toBeDefined();
  });

  it('should convert grey to gray scale', () => {
    const radixTheme = convertMUIThemeToRadix(sampleMUITheme);
    
    expect(radixTheme.colors.gray).toBeDefined();
    expect(Object.keys(radixTheme.colors.gray!).length).toBeGreaterThanOrEqual(10);
  });

  it('should convert background colors', () => {
    const radixTheme = convertMUIThemeToRadix(sampleMUITheme);
    
    expect(radixTheme.colors.background).toBe('#ffffff');
    expect(radixTheme.colors.backgroundSecondary).toBe('#fafafa');
  });

  it('should convert text colors', () => {
    const radixTheme = convertMUIThemeToRadix(sampleMUITheme);
    
    expect(radixTheme.colors.foreground).toBe('#212121');
    expect(radixTheme.colors.mutedForeground).toBe('#757575');
    expect(radixTheme.colors.disabledForeground).toBe('#9e9e9e');
  });

  it('should convert typography', () => {
    const radixTheme = convertMUIThemeToRadix(sampleMUITheme);
    
    expect(radixTheme.typography.fontFamily).toBe('"Roboto", "Helvetica", "Arial", sans-serif');
    expect(radixTheme.typography.fontSize.base).toBe('1rem');
    expect(radixTheme.typography.fontWeight.normal).toBe(400);
    expect(radixTheme.typography.fontWeight.bold).toBe(700);
  });

  it('should convert spacing', () => {
    const radixTheme = convertMUIThemeToRadix(sampleMUITheme);
    
    expect(radixTheme.spacing.base).toBe('0.5rem'); // 8px / 16 = 0.5rem
    expect(radixTheme.spacing.scale).toBeDefined();
    expect(radixTheme.spacing.scale.length).toBeGreaterThan(10);
  });

  it('should convert shadows', () => {
    const radixTheme = convertMUIThemeToRadix(sampleMUITheme);
    
    expect(radixTheme.shadows.xs).toBeDefined();
    expect(radixTheme.shadows.md).toBeDefined();
    expect(radixTheme.shadows.lg).toBeDefined();
  });

  it('should convert border radius', () => {
    const radixTheme = convertMUIThemeToRadix(sampleMUITheme);
    
    expect(radixTheme.radii.md).toBe('4px');
    expect(radixTheme.radii.lg).toBe('8px');
    expect(radixTheme.radii.full).toBe('9999px');
  });

  it('should convert breakpoints', () => {
    const radixTheme = convertMUIThemeToRadix(sampleMUITheme);
    
    expect(radixTheme.breakpoints.sm).toBe('600px');
    expect(radixTheme.breakpoints.md).toBe('960px');
    expect(radixTheme.breakpoints.lg).toBe('1280px');
    expect(radixTheme.breakpoints.xl).toBe('1920px');
  });

  it('should convert transitions', () => {
    const radixTheme = convertMUIThemeToRadix(sampleMUITheme);
    
    expect(radixTheme.transitions.fast).toBe('150ms');
    expect(radixTheme.transitions.normal).toBe('300ms');
    expect(radixTheme.transitions.slow).toBe('500ms');
  });

  it('should convert z-indices', () => {
    const radixTheme = convertMUIThemeToRadix(sampleMUITheme);
    
    expect(radixTheme.zIndices.modal).toBe(1300);
    expect(radixTheme.zIndices.tooltip).toBe(1500);
    expect(radixTheme.zIndices.toast).toBe(1400);
  });

  it('should handle options correctly', () => {
    const radixTheme = convertMUIThemeToRadix(sampleMUITheme, {
      mapTypography: false,
      mapSpacing: false,
      preserveCustomColors: false,
    });
    
    // Should still have basic structure but with defaults
    expect(radixTheme.typography.fontFamily).toBe('system-ui, -apple-system, sans-serif');
  });
});

describe('generateThemeTokenMap', () => {
  const sampleMUITheme = {
    palette: {
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
    },
    typography: {
      fontFamily: 'Roboto',
      h1: { fontSize: '6rem', fontWeight: 300, lineHeight: 1.167 },
      body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
    },
    spacing: 8,
  };

  it('should generate token map', () => {
    const tokenMap = generateThemeTokenMap(sampleMUITheme);
    
    expect(tokenMap['color.primary']).toBe('colors.primary');
    expect(tokenMap['color.secondary']).toBe('colors.secondary');
    expect(tokenMap['typography.h1.fontSize']).toBe('fontSize.h1');
    expect(tokenMap['typography.body1.fontSize']).toBe('fontSize.body1');
    expect(tokenMap['spacing.base']).toBe('spacing.base');
  });
});

describe('createRadixThemeConfig', () => {
  const sampleMUITheme = {
    palette: {
      primary: { main: '#1976d2' },
    },
    spacing: 8,
  };

  it('should create complete config with metadata', () => {
    const config = createRadixThemeConfig(sampleMUITheme);
    
    expect(config.colors).toBeDefined();
    expect(config.spacing).toBeDefined();
    expect((config as any)._meta).toBeDefined();
    expect((config as any)._meta.tokenMap).toBeDefined();
    expect((config as any)._meta.source).toBe('mui-theme-converter');
  });
});