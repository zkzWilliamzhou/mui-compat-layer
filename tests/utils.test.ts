/**
 * Utils Tests
 */

import { describe, it, expect } from 'vitest';
import { 
  muiSpacingToPx, 
  muiSpacingToRem, 
  generateCSSVariables, 
  createThemeBridge, 
  validateMapping, 
  deepMerge, 
  generateId, 
  debounce, 
  throttle 
} from '../src/utils';

describe('muiSpacingToPx', () => {
  it('should convert number spacing', () => {
    expect(muiSpacingToPx(8, 1)).toBe(8);
    expect(muiSpacingToPx(8, 2)).toBe(16);
  });

  it('should convert function spacing', () => {
    const spacingFn = (factor: number) => factor * 8;
    expect(muiSpacingToPx(spacingFn, 1)).toBe(8);
    expect(muiSpacingToPx(spacingFn, 3)).toBe(24);
  });
});

describe('muiSpacingToRem', () => {
  it('should convert to rem with default base font size', () => {
    expect(muiSpacingToRem(16)).toBe('1rem');
    expect(muiSpacingToRem(8)).toBe('0.5rem');
  });

  it('should convert with custom base font size', () => {
    expect(muiSpacingToRem(20, 1, 20)).toBe('1rem');
  });
});

describe('generateCSSVariables', () => {
  it('should generate color variables', () => {
    const theme = {
      palette: {
        primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0' },
        secondary: { main: '#dc004e' },
        grey: { 50: '#fafafa', 100: '#f5f5f5' },
      },
      spacing: 8,
      shape: { borderRadius: 4 },
      breakpoints: { values: { xs: 0, sm: 600, md: 960 } },
    };

    const variables = generateCSSVariables(theme);

    expect(variables['--mui-primary-main']).toBe('#1976d2');
    expect(variables['--mui-primary-light']).toBe('#42a5f5');
    expect(variables['--mui-secondary-main']).toBe('#dc004e');
    expect(variables['--mui-grey-50']).toBe('#fafafa');
    expect(variables['--mui-spacing']).toBe('8px');
    expect(variables['--mui-border-radius']).toBe('4px');
    expect(variables['--mui-breakpoint-sm']).toBe('600px');
  });
});

describe('createThemeBridge', () => {
  it('should create bridge with tokens', () => {
    const muiTheme = {
      palette: { primary: { main: '#1976d2' } },
      spacing: 8,
      typography: { h1: { fontSize: '6rem' } },
    };
    const radixTheme = {
      colors: { primary: { 6: '#1976d2' } },
      spacing: { scale: [0, 4, 8, 12, 16] },
    };

    const bridge = createThemeBridge(muiTheme, radixTheme);

    expect(bridge.tokens.getColor('primary.main')).toBe('#1976d2');
    expect(bridge.tokens.getSpacing(1)).toBe(8);
    expect(bridge.tokens.getTypography('h1')).toEqual({ fontSize: '6rem' });
  });
});

describe('validateMapping', () => {
  it('should return errors for missing component', () => {
    const errors = validateMapping('Button', {});
    expect(errors).toContain('Missing radix component name');
    expect(errors).toContain('Missing radix package name');
  });

  it('should return errors for empty prop mappings', () => {
    const errors = validateMapping('Button', {
      component: 'Button',
      package: '@radix-ui/themes',
      propMappings: { variant: '' },
    });
    expect(errors).toContain('Empty mapping for prop: variant');
  });

  it('should return empty array for valid mapping', () => {
    const errors = validateMapping('Button', {
      component: 'Button',
      package: '@radix-ui/themes',
      propMappings: { variant: 'variant' },
    });
    expect(errors).toHaveLength(0);
  });
});

describe('deepMerge', () => {
  it('should merge objects deeply', () => {
    const target = { a: 1, b: { c: 2, d: 3 } };
    const source = { b: { d: 4, e: 5 }, f: 6 };
    
    const result = deepMerge(target, source);
    
    expect(result).toEqual({ a: 1, b: { c: 2, d: 4, e: 5 }, f: 6 });
  });

  it('should not mutate target', () => {
    const target = { a: 1, b: { c: 2 } };
    const source = { b: { d: 3 } };
    
    deepMerge(target, source);
    
    expect(target).toEqual({ a: 1, b: { c: 2 } });
  });
});

describe('generateId', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId('test');
    const id2 = generateId('test');
    
    expect(id1).toMatch(/^test-/);
    expect(id2).toMatch(/^test-/);
    expect(id1).not.toBe(id2);
  });
});

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should debounce function calls', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    
    debounced();
    debounced();
    debounced();
    
    expect(fn).not.toHaveBeenCalled();
    
    vi.advanceTimersByTime(100);
    
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should throttle function calls', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);
    
    throttled();
    throttled();
    throttled();
    
    expect(fn).toHaveBeenCalledTimes(1);
    
    vi.advanceTimersByTime(100);
    
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});