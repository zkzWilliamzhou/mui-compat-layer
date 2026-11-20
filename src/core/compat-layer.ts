/**
 * Core Compatibility Layer
 * 
 * Main class that orchestrates MUI to Radix UI component mapping,
 * theme conversion, and migration utilities.
 */

import { MUI_TO_RADIX_MAPPINGS, getRadixComponent, MUIComponentName, RadixComponentConfig } from '../mappings';
import { convertMUIThemeToRadix, MUITheme, RadixThemeConfig } from '../theme';
import { runMigration, MigrationResult, CodemodOptions } from '../codemods';

/**
 * Configuration for the compatibility layer
 */
export interface CompatLayerConfig {
  /** MUI theme to convert */
  muiTheme?: MUITheme;
  /** Custom component mappings */
  customMappings?: Partial<Record<MUIComponentName, RadixComponentConfig>>;
  /** Theme conversion options */
  themeOptions?: {
    preserveCustomColors?: boolean;
    mapSpacing?: boolean;
    mapTypography?: boolean;
  };
  /** Migration options */
  migrationOptions?: CodemodOptions;
}

/**
 * Component mapping interface
 */
export interface ComponentMapping {
  muiComponent: MUIComponentName;
  radixComponent: string;
  radixPackage: string;
  propMappings: Record<string, string>;
  styleMappings?: Record<string, string>;
  requiredProps?: string[];
  unsupportedProps?: string[];
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  muiTheme: MUITheme;
  radixTheme: RadixThemeConfig;
  tokenMap: Record<string, string>;
}

/**
 * Migration options
 */
export interface MigrationOptions {
  dryRun?: boolean;
  verbose?: boolean;
  backup?: boolean;
  targetFiles?: string[];
  excludePatterns?: string[];
}

/**
 * Main MUI Compatibility Layer Class
 */
export class MUICompatLayer {
  private config: CompatLayerConfig;
  private componentMappings: Map<MUIComponentName, ComponentMapping>;
  private themeConfig: ThemeConfig | null = null;

  constructor(config: CompatLayerConfig = {}) {
    this.config = {
      themeOptions: {
        preserveCustomColors: true,
        mapSpacing: true,
        mapTypography: true,
        ...config.themeOptions,
      },
      ...config,
    };

    this.componentMappings = this.buildComponentMappings();
    
    if (this.config.muiTheme) {
      this.themeConfig = this.convertTheme(this.config.muiTheme);
    }
  }

  /**
   * Build component mappings from built-in and custom mappings
   */
  private buildComponentMappings(): Map<MUIComponentName, ComponentMapping> {
    const mappings = new Map<MUIComponentName, ComponentMapping>();
    
    // Add built-in mappings
    for (const [muiName, radixConfig] of Object.entries(MUI_TO_RADIX_MAPPINGS)) {
      mappings.set(muiName as MUIComponentName, {
        muiComponent: muiName as MUIComponentName,
        radixComponent: radixConfig.component,
        radixPackage: radixConfig.package,
        propMappings: radixConfig.propMappings || {},
        styleMappings: radixConfig.styleMappings,
        requiredProps: radixConfig.requiredProps,
        unsupportedProps: radixConfig.unsupportedProps,
      });
    }
    
    // Add custom mappings
    if (this.config.customMappings) {
      for (const [muiName, radixConfig] of Object.entries(this.config.customMappings)) {
        mappings.set(muiName as MUIComponentName, {
          muiComponent: muiName as MUIComponentName,
          radixComponent: radixConfig.component,
          radixPackage: radixConfig.package,
          propMappings: radixConfig.propMappings || {},
          styleMappings: radixConfig.styleMappings,
          requiredProps: radixConfig.requiredProps,
          unsupportedProps: radixConfig.unsupportedProps,
        });
      }
    }
    
    return mappings;
  }

  /**
   * Convert MUI theme to Radix theme
   */
  private convertTheme(muiTheme: MUITheme): ThemeConfig {
    const radixTheme = convertMUIThemeToRadix(muiTheme, this.config.themeOptions);
    
    // Build token map for reference
    const tokenMap: Record<string, string> = {};
    // This would be populated during conversion
    
    return {
      muiTheme,
      radixTheme,
      tokenMap,
    };
  }

  /**
   * Get Radix component config for an MUI component
   */
  getComponentMapping(muiComponent: MUIComponentName): ComponentMapping | undefined {
    return this.componentMappings.get(muiComponent);
  }

  /**
   * Get all component mappings
   */
  getAllMappings(): ComponentMapping[] {
    return Array.from(this.componentMappings.values());
  }

  /**
   * Get converted Radix theme
   */
  getRadixTheme(): RadixThemeConfig | null {
    return this.themeConfig?.radixTheme || null;
  }

  /**
   * Get theme token mapping
   */
  getThemeTokenMap(): Record<string, string> {
    return this.themeConfig?.tokenMap || {};
  }

  /**
   * Check if MUI component is supported
   */
  isSupported(muiComponent: string): boolean {
    return this.componentMappings.has(muiComponent as MUIComponentName);
  }

  /**
   * Get unsupported props for a component
   */
  getUnsupportedProps(muiComponent: MUIComponentName): string[] {
    return this.componentMappings.get(muiComponent)?.unsupportedProps || [];
  }

  /**
   * Get required props for Radix component
   */
  getRequiredProps(muiComponent: MUIComponentName): string[] {
    return this.componentMappings.get(muiComponent)?.requiredProps || [];
  }

  /**
   * Convert MUI props to Radix props
   */
  convertProps(muiComponent: MUIComponentName, muiProps: Record<string, any>): Record<string, any> {
    const mapping = this.componentMappings.get(muiComponent);
    if (!mapping) {
      console.warn(`No mapping found for MUI component: ${muiComponent}`);
      return muiProps;
    }

    const radixProps: Record<string, any> = {};
    
    for (const [muiProp, value] of Object.entries(muiProps)) {
      // Skip unsupported props
      if (mapping.unsupportedProps?.includes(muiProp)) {
        console.warn(`Prop ${muiProp} is not supported for ${muiComponent}`);
        continue;
      }
      
      // Map prop name
      const radixProp = mapping.propMappings[muiProp] || muiProp;
      radixProps[radixProp] = value;
    }
    
    // Add required props with defaults if missing
    for (const requiredProp of mapping.requiredProps || []) {
      if (!(requiredProp in radixProps)) {
        // Would need default values based on component
        console.warn(`Required prop ${requiredProp} not provided for ${mapping.radixComponent}`);
      }
    }
    
    return radixProps;
  }

  /**
   * Run migration on codebase
   */
  async migrate(options: MigrationOptions = {}): Promise<MigrationResult> {
    return runMigration({
      ...this.config.migrationOptions,
      ...options,
      muiTheme: this.config.muiTheme,
      customMappings: this.config.customMappings,
    });
  }

  /**
   * Generate migration report
   */
  generateMigrationReport(result: MigrationResult): string {
    const lines = [
      '# MUI to Radix Migration Report',
      '',
      `## Summary`,
      `- Files processed: ${result.filesProcessed}`,
      `- Files modified: ${result.filesModified}`,
      `- Components migrated: ${result.componentsMigrated}`,
      `- Errors: ${result.errors.length}`,
      `- Warnings: ${result.warnings.length}`,
      '',
      `## Component Migration Details`,
    ];
    
    for (const [component, count] of Object.entries(result.componentCounts)) {
      lines.push(`- ${component}: ${count} occurrences`);
    }
    
    if (result.errors.length > 0) {
      lines.push('', '## Errors');
      for (const error of result.errors) {
        lines.push(`- ${error.file}: ${error.message}`);
      }
    }
    
    if (result.warnings.length > 0) {
      lines.push('', '## Warnings');
      for (const warning of result.warnings) {
        lines.push(`- ${warning.file}: ${warning.message}`);
      }
    }
    
    return lines.join('\n');
  }

  /**
   * Create a wrapper component that uses Radix internally
   */
  createWrapperComponent<MUIProps extends Record<string, any>>(
    muiComponent: MUIComponentName,
    radixComponent: React.ComponentType<any>,
    propTransform?: (props: MUIProps) => any
  ): React.FC<MUIProps> {
    const mapping = this.componentMappings.get(muiComponent);
    
    if (!mapping) {
      throw new Error(`No mapping found for ${muiComponent}`);
    }
    
    const Wrapper: React.FC<MUIProps> = (props) => {
      const radixProps = this.convertProps(muiComponent, props as Record<string, any>);
      const transformedProps = propTransform ? propTransform(radixProps as MUIProps) : radixProps;
      
      return <radixComponent {...transformedProps} />;
    };
    
    Wrapper.displayName = `MUICompat(${muiComponent})`;
    return Wrapper;
  }
}

/**
 * Create compatibility layer instance
 */
export function createCompatLayer(config?: CompatLayerConfig): MUICompatLayer {
  return new MUICompatLayer(config);
}

/**
 * Default compatibility layer instance
 */
export const defaultCompatLayer = new MUICompatLayer();

export { MUICompatLayer, createCompatLayer };