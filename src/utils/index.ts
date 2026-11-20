/**
 * Utility Functions for MUI Compat Layer
 */

/**
 * Convert MUI spacing value to pixels
 */
export function muiSpacingToPx(spacing: number | ((factor: number) => number), factor = 1): number {
  if (typeof spacing === 'function') {
    return spacing(factor);
  }
  return spacing * factor;
}

/**
 * Convert MUI spacing to rem
 */
export function muiSpacingToRem(spacing: number | ((factor: number) => number), factor = 1, baseFontSize = 16): string {
  const px = muiSpacingToPx(spacing, factor);
  return `${px / baseFontSize}rem`;
}

/**
 * Generate CSS custom properties from MUI theme
 */
export function generateCSSVariables(muiTheme: any): Record<string, string> {
  const variables: Record<string, string> = {};
  
  // Colors
  if (muiTheme.palette) {
    for (const [colorName, color] of Object.entries(muiTheme.palette)) {
      if (typeof color === 'object' && color !== null) {
        for (const [shade, value] of Object.entries(color)) {
          if (typeof value === 'string') {
            variables[`--mui-${colorName}-${shade}`] = value;
          }
        }
      }
    }
  }
  
  // Spacing
  if (muiTheme.spacing) {
    const base = typeof muiTheme.spacing === 'function' ? muiTheme.spacing(1) : muiTheme.spacing;
    variables['--mui-spacing'] = typeof base === 'number' ? `${base}px` : base;
  }
  
  // Border radius
  if (muiTheme.shape?.borderRadius) {
    variables['--mui-border-radius'] = `${muiTheme.shape.borderRadius}px`;
  }
  
  // Breakpoints
  if (muiTheme.breakpoints?.values) {
    for (const [name, value] of Object.entries(muiTheme.breakpoints.values)) {
      variables[`--mui-breakpoint-${name}`] = `${value}px`;
    }
  }
  
  return variables;
}

/**
 * Apply CSS variables to document root
 */
export function applyCSSVariables(variables: Record<string, string>): void {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(variables)) {
      root.style.setProperty(key, value);
    }
  }
}

/**
 * Create a theme bridge for gradual migration
 * Allows using both MUI and Radix themes simultaneously
 */
export function createThemeBridge(muiTheme: any, radixTheme: any) {
  return {
    mui: muiTheme,
    radix: radixTheme,
    tokens: {
      getColor: (path: string) => {
        const keys = path.split('.');
        let value: any = muiTheme.palette;
        for (const key of keys) {
          value = value?.[key];
        }
        return value || radixTheme.colors?.[path];
      },
      getSpacing: (factor: number) => {
        return muiTheme.spacing ? muiTheme.spacing(factor) : radixTheme.spacing?.scale?.[factor];
      },
      getTypography: (variant: string) => {
        return muiTheme.typography?.[variant] || radixTheme.typography?.[variant];
      },
    },
  };
}

/**
 * Validate component mapping
 */
export function validateMapping(muiComponent: string, radixConfig: any): string[] {
  const errors: string[] = [];
  
  if (!radixConfig.component) {
    errors.push('Missing radix component name');
  }
  
  if (!radixConfig.package) {
    errors.push('Missing radix package name');
  }
  
  if (radixConfig.propMappings) {
    for (const [muiProp, radixProp] of Object.entries(radixConfig.propMappings)) {
      if (!radixProp) {
        errors.push(`Empty mapping for prop: ${muiProp}`);
      }
    }
  }
  
  return errors;
}

/**
 * Deep merge two objects
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = target[key];
    
    if (isObject(sourceValue) && isObject(targetValue)) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue;
    }
  }
  
  return result;
}

function isObject(value: any): boolean {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Generate unique ID
 */
export function generateId(prefix = 'mui-compat'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Check if running in browser
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Check if running in Node.js
 */
export const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;