/**
 * Codemods Module
 * 
 * Automated migration scripts for converting MUI v5 code to Radix UI.
 * Uses ts-morph for AST-based code transformations.
 */

import { Project, SourceFile, ImportDeclaration, JSXElement, JSXAttribute, PropertyAssignment, ObjectLiteralExpression, CallExpression, Identifier } from 'ts-morph';
import { MUI_TO_RADIX_MAPPINGS, getRadixComponent, getMigrationNotes, MUIComponentName } from '../mappings';
import { convertMUIThemeToRadix } from '../theme';

/**
 * Migration result
 */
export interface MigrationResult {
  filesProcessed: number;
  filesModified: number;
  componentsMigrated: number;
  componentCounts: Record<string, number>;
  errors: MigrationError[];
  warnings: MigrationWarning[];
}

/**
 * Migration error
 */
export interface MigrationError {
  file: string;
  line: number;
  column: number;
  message: string;
  code: string;
}

/**
 * Migration warning
 */
export interface MigrationWarning {
  file: string;
  line: number;
  column: number;
  message: string;
  suggestion?: string;
}

/**
 * Codemod options
 */
export interface CodemodOptions {
  /** Project root directory */
  projectRoot: string;
  /** File patterns to include */
  includePatterns?: string[];
  /** File patterns to exclude */
  excludePatterns?: string[];
  /** MUI theme for theme conversion */
  muiTheme?: any;
  /** Custom component mappings */
  customMappings?: Record<string, any>;
  /** Dry run mode (no file writes) */
  dryRun?: boolean;
  /** Verbose output */
  verbose?: boolean;
  /** Create backup files */
  backup?: boolean;
  /** Target specific files */
  targetFiles?: string[];
  /** Transformation options */
  transformOptions?: {
    /** Convert MUI theme to Radix */
    convertTheme?: boolean;
    /** Convert component imports */
    convertImports?: boolean;
    /** Convert component usage */
    convertComponents?: boolean;
    /** Convert props */
    convertProps?: boolean;
    /** Convert sx/styled props */
    convertSx?: boolean;
    /** Convert theme usage */
    convertThemeUsage?: boolean;
  };
}

/**
 * Run migration on a codebase
 */
export async function runMigration(options: CodemodOptions): Promise<MigrationResult> {
  const opts: Required<CodemodOptions> = {
    projectRoot: options.projectRoot,
    includePatterns: options.includePatterns || ['**/*.{ts,tsx,js,jsx}'],
    excludePatterns: options.excludePatterns || ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.git/**'],
    muiTheme: options.muiTheme,
    customMappings: options.customMappings || {},
    dryRun: options.dryRun || false,
    verbose: options.verbose || false,
    backup: options.backup || false,
    targetFiles: options.targetFiles || [],
    transformOptions: {
      convertTheme: options.transformOptions?.convertTheme ?? true,
      convertImports: options.transformOptions?.convertImports ?? true,
      convertComponents: options.transformOptions?.convertComponents ?? true,
      convertProps: options.transformOptions?.convertProps ?? true,
      convertSx: options.transformOptions?.convertSx ?? true,
      convertThemeUsage: options.transformOptions?.convertThemeUsage ?? true,
    },
  };

  const result: MigrationResult = {
    filesProcessed: 0,
    filesModified: 0,
    componentsMigrated: 0,
    componentCounts: {},
    errors: [],
    warnings: [],
  };

  // Initialize ts-morph project
  const project = new Project({
    tsConfigFilePath: path.join(opts.projectRoot, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
  });

  // Add source files
  const sourceFiles = addSourceFiles(project, opts);
  result.filesProcessed = sourceFiles.length;

  if (opts.verbose) {
    console.log(`Processing ${sourceFiles.length} files...`);
  }

  // Process each file
  for (const sourceFile of sourceFiles) {
    try {
      const modified = await processFile(sourceFile, opts, result);
      if (modified && !opts.dryRun) {
        await sourceFile.save();
        result.filesModified++;
      }
    } catch (error) {
      result.errors.push({
        file: sourceFile.getFilePath(),
        line: 0,
        column: 0,
        message: error.message,
        code: 'PROCESSING_ERROR',
      });
    }
  }

  // Generate theme config if requested
  if (opts.transformOptions.convertTheme && opts.muiTheme) {
    try {
      const radixTheme = convertMUIThemeToRadix(opts.muiTheme);
      const themeConfigPath = path.join(opts.projectRoot, 'radix-theme.config.ts');
      await writeThemeConfig(themeConfigPath, radixTheme, opts.dryRun);
      if (opts.verbose) {
        console.log(`Generated Radix theme config: ${themeConfigPath}`);
      }
    } catch (error) {
      result.warnings.push({
        file: 'theme-config',
        line: 0,
        column: 0,
        message: `Failed to generate theme config: ${error.message}`,
        suggestion: 'Manually create radix-theme.config.ts',
      });
    }
  }

  if (opts.verbose) {
    console.log('\nMigration Summary:');
    console.log(`Files processed: ${result.filesProcessed}`);
    console.log(`Files modified: ${result.filesModified}`);
    console.log(`Components migrated: ${result.componentsMigrated}`);
    console.log(`Errors: ${result.errors.length}`);
    console.log(`Warnings: ${result.warnings.length}`);
  }

  return result;
}

/**
 * Add source files to project
 */
function addSourceFiles(project: Project, opts: Required<CodemodOptions>): SourceFile[] {
  const sourceFiles: SourceFile[] = [];
  
  if (opts.targetFiles.length > 0) {
    for (const file of opts.targetFiles) {
      const fullPath = path.join(opts.projectRoot, file);
      if (fs.existsSync(fullPath)) {
        sourceFiles.push(project.addSourceFileAtPath(fullPath));
      }
    }
  } else {
    // Use glob patterns (simplified - in production use fast-glob)
    const files = findFiles(opts.projectRoot, opts.includePatterns, opts.excludePatterns);
    for (const file of files) {
      try {
        sourceFiles.push(project.addSourceFileAtPath(file));
      } catch (error) {
        // Skip files that can't be parsed
      }
    }
  }
  
  return sourceFiles;
}

/**
 * Find files matching patterns
 */
function findFiles(root: string, includePatterns: string[], excludePatterns: string[]): string[] {
  // Simplified file finding - in production use fast-glob
  const files: string[] = [];
  
  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      // Check exclude patterns
      const shouldExclude = excludePatterns.some(pattern => 
        minimatch(fullPath, pattern) || minimatch(entry.name, pattern)
      );
      
      if (shouldExclude) continue;
      
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        // Check include patterns
        const shouldInclude = includePatterns.some(pattern =>
          minimatch(fullPath, pattern) || minimatch(entry.name, pattern)
        );
        
        if (shouldInclude) {
          files.push(fullPath);
        }
      }
    }
  }
  
  walk(root);
  return files;
}

/**
 * Process a single source file
 */
async function processFile(
  sourceFile: SourceFile,
  opts: Required<CodemodOptions>,
  result: MigrationResult
): Promise<boolean> {
  let modified = false;
  
  if (opts.transformOptions.convertImports) {
    modified = convertImports(sourceFile, opts, result) || modified;
  }
  
  if (opts.transformOptions.convertComponents) {
    modified = convertComponents(sourceFile, opts, result) || modified;
  }
  
  if (opts.transformOptions.convertProps) {
    modified = convertProps(sourceFile, opts, result) || modified;
  }
  
  if (opts.transformOptions.convertSx) {
    modified = convertSxProps(sourceFile, opts, result) || modified;
  }
  
  if (opts.transformOptions.convertThemeUsage) {
    modified = convertThemeUsage(sourceFile, opts, result) || modified;
  }
  
  return modified;
}

/**
 * Convert MUI imports to Radix imports
 */
function convertImports(
  sourceFile: SourceFile,
  opts: Required<CodemodOptions>,
  result: MigrationResult
): boolean {
  let modified = false;
  const imports = sourceFile.getImportDeclarations();
  
  for (const importDecl of imports) {
    const moduleSpecifier = importDecl.getModuleSpecifierValue();
    
    // Check if it's an MUI import
    if (moduleSpecifier.startsWith('@mui/') || moduleSpecifier === '@mui/material') {
      const namedImports = importDecl.getNamedImports();
      
      for (const namedImport of namedImports) {
        const importName = namedImport.getName();
        const mapping = getRadixComponent(importName as MUIComponentName);
        
        if (mapping) {
          // Add Radix import
          const existingRadixImport = sourceFile.getImportDeclaration(mapping.package);
          
          if (!existingRadixImport) {
            sourceFile.addImportDeclaration({
              moduleSpecifier: mapping.package,
              namedImports: [mapping.component],
            });
          } else {
            existingRadixImport.addNamedImport(mapping.component);
          }
          
          // Remove MUI import if it's the only one from this specifier
          if (namedImports.length === 1) {
            importDecl.remove();
          } else {
            namedImport.remove();
          }
          
          modified = true;
          result.componentsMigrated++;
          result.componentCounts[importName] = (result.componentCounts[importName] || 0) + 1;
          
          if (opts.verbose) {
            console.log(`  ${sourceFile.getFilePath()}: ${importName} -> ${mapping.component} (from ${mapping.package})`);
          }
        } else {
          // Check if component is not supported
          if (isMUIComponent(importName)) {
            result.warnings.push({
              file: sourceFile.getFilePath(),
              line: importDecl.getStartLineNumber(),
              column: 0,
              message: `No Radix equivalent found for MUI component: ${importName}`,
              suggestion: 'Consider keeping MUI component or finding alternative',
            });
          }
        }
      }
    }
  }
  
  return modified;
}

/**
 * Convert MUI component usage to Radix components
 */
function convertComponents(
  sourceFile: SourceFile,
  opts: Required<CodemodOptions>,
  result: MigrationResult
): boolean {
  let modified = false;
  
  // Find all JSX elements
  const jsxElements = sourceFile.getDescendantsOfKind(ts.SyntaxKind.JsxElement);
  
  for (const jsxElement of jsxElements) {
    const tagName = jsxElement.getTagName();
    const mapping = getRadixComponent(tagName as MUIComponentName);
    
    if (mapping) {
      // Replace component name
      jsxElement.replaceWithText(
        jsxElement.getText().replace(
          new RegExp(`<\\/?${tagName}`, 'g'),
          `<\/?${mapping.component}`
        )
      );
      
      modified = true;
      result.componentsMigrated++;
      result.componentCounts[tagName] = (result.componentCounts[tagName] || 0) + 1;
      
      if (opts.verbose) {
        console.log(`  ${sourceFile.getFilePath()}: <${tagName}> -> <${mapping.component}>`);
      }
    }
  }
  
  return modified;
}

/**
 * Convert MUI props to Radix props
 */
function convertProps(
  sourceFile: SourceFile,
  opts: Required<CodemodOptions>,
  result: MigrationResult
): boolean {
  let modified = false;
  
  // Find JSX attributes on MUI components
  const jsxAttributes = sourceFile.getDescendantsOfKind(ts.SyntaxKind.JsxAttribute);
  
  for (const attr of jsxAttributes) {
    const parent = attr.getParent();
    if (!parent || parent.getKind() !== ts.SyntaxKind.JsxOpeningElement) continue;
    
    const tagName = parent.getTagName();
    const mapping = getRadixComponent(tagName as MUIComponentName);
    
    if (!mapping || !mapping.propMappings) continue;
    
    const attrName = attr.getName();
    const radixProp = mapping.propMappings[attrName];
    
    if (radixProp && radixProp !== attrName) {
      // Rename attribute
      attr.rename(radixProp);
      modified = true;
      
      if (opts.verbose) {
        console.log(`  ${sourceFile.getFilePath()}: ${tagName}.${attrName} -> ${radixProp}`);
      }
    }
    
    // Check for unsupported props
    if (mapping.unsupportedProps?.includes(attrName)) {
      result.warnings.push({
        file: sourceFile.getFilePath(),
        line: attr.getStartLineNumber(),
        column: 0,
        message: `Unsupported prop ${attrName} on ${tagName}`,
        suggestion: 'Remove or find alternative implementation',
      });
    }
  }
  
  return modified;
}

/**
 * Convert sx/styled props to Radix equivalents
 */
function convertSxProps(
  sourceFile: SourceFile,
  opts: Required<CodemodOptions>,
  result: MigrationResult
): boolean {
  let modified = false;
  
  // Find sx props on JSX elements
  const jsxAttributes = sourceFile.getDescendantsOfKind(ts.SyntaxKind.JsxAttribute);
  
  for (const attr of jsxAttributes) {
    if (attr.getName() !== 'sx') continue;
    
    const initializer = attr.getInitializer();
    if (!initializer) continue;
    
    const sxValue = initializer.getText();
    // Convert MUI sx to Radix style/props
    // This is complex - in production would use a proper parser
    const converted = convertSxToRadix(sxValue);
    
    if (converted !== sxValue) {
      attr.setInitializer(converted);
      attr.rename('style');
      modified = true;
    }
  }
  
  return modified;
}

/**
 * Convert MUI sx object to Radix style object
 */
function convertSxToRadix(sxValue: string): string {
  // Simple conversion - replace MUI spacing with Radix spacing
  // In production, use AST to properly transform
  return sxValue
    .replace(/(\s+)([pmyx])(\d+)/g, (match, space, prop, value) => {
      const radixProp = prop === 'p' ? 'padding' : prop === 'm' ? 'margin' : prop === 'x' ? 'marginInline' : 'marginBlock';
      const radixValue = parseInt(value) * 4; // MUI spacing unit is typically 8px, Radix uses 4px
      return `${space}${radixProp}: ${radixValue}px`;
    });
}

/**
 * Convert theme usage (useTheme, ThemeProvider, etc.)
 */
function convertThemeUsage(
  sourceFile: SourceFile,
  opts: Required<CodemodOptions>,
  result: MigrationResult
): boolean {
  let modified = false;
  
  // Find useTheme hook usage
  const importDeclarations = sourceFile.getImportDeclarations();
  
  for (const importDecl of importDeclarations) {
    const moduleSpecifier = importDecl.getModuleSpecifierValue();
    
    if (moduleSpecifier === '@mui/material/styles' || moduleSpecifier === '@mui/system') {
      const namedImports = importDecl.getNamedImports();
      
      for (const namedImport of namedImports) {
        const importName = namedImport.getName();
        
        if (importName === 'useTheme') {
          // Replace with Radix theme hook
          namedImport.rename('useRadixTheme');
          
          // Add Radix import
          const existingRadixImport = sourceFile.getImportDeclaration('@radix-ui/themes');
          if (!existingRadixImport) {
            sourceFile.addImportDeclaration({
              moduleSpecifier: '@radix-ui/themes',
              namedImports: ['useRadixTheme'],
            });
          } else {
            existingRadixImport.addNamedImport('useRadixTheme');
          }
          
          modified = true;
        }
        
        if (importName === 'ThemeProvider') {
          namedImport.rename('RadixThemeProvider');
          
          const existingRadixImport = sourceFile.getImportDeclaration('@radix-ui/themes');
          if (!existingRadixImport) {
            sourceFile.addImportDeclaration({
              moduleSpecifier: '@radix-ui/themes',
              namedImports: ['RadixThemeProvider'],
            });
          } else {
            existingRadixImport.addNamedImport('RadixThemeProvider');
          }
          
          modified = true;
        }
        
        if (importName === 'styled') {
          namedImport.rename('styled');
          
          const existingRadixImport = sourceFile.getImportDeclaration('@radix-ui/themes');
          if (!existingRadixImport) {
            sourceFile.addImportDeclaration({
              moduleSpecifier: '@radix-ui/themes',
              namedImports: ['styled'],
            });
          } else {
            existingRadixImport.addNamedImport('styled');
          }
          
          modified = true;
        }
      }
    }
  }
  
  return modified;
}

/**
 * Write theme configuration file
 */
async function writeThemeConfig(
  filePath: string,
  themeConfig: any,
  dryRun: boolean
): Promise<void> {
  const content = generateThemeConfigFile(themeConfig);
  
  if (!dryRun) {
    await fs.promises.writeFile(filePath, content, 'utf-8');
  }
}

/**
 * Generate theme config file content
 */
function generateThemeConfigFile(themeConfig: any): string {
  return `// Auto-generated Radix theme configuration
// Generated by mui-compat-layer

import { createTheme } from '@radix-ui/themes';

export const radixTheme = createTheme(${JSON.stringify(themeConfig, null, 2)});

export default radixTheme;
`;
}

/**
 * Check if a component name is an MUI component
 */
function isMUIComponent(name: string): boolean {
  // Common MUI component patterns
  const muiComponents = [
    'Box', 'Container', 'Grid', 'Stack', 'Typography', 'Button', 'IconButton',
    'ButtonGroup', 'TextField', 'Input', 'Textarea', 'Select', 'FormControl',
    'FormLabel', 'FormHelperText', 'InputLabel', 'Checkbox', 'Radio', 'RadioGroup',
    'Switch', 'Alert', 'Snackbar', 'Avatar', 'Badge', 'Chip', 'Divider',
    'List', 'ListItem', 'ListItemText', 'ListItemIcon', 'Dialog', 'Drawer',
    'Menu', 'MenuItem', 'Popover', 'Tooltip', 'Popper', 'Tabs', 'Tab',
    'Breadcrumbs', 'Link', 'Pagination', 'Slider', 'Rating', 'Paper', 'Card',
    'CardContent', 'CardHeader', 'CardActions', 'CardMedia', 'Accordion',
    'AccordionSummary', 'AccordionDetails', 'Table', 'TableHead', 'TableBody',
    'TableRow', 'TableCell', 'TableContainer', 'TablePagination', 'TableSortLabel',
    'LinearProgress', 'CircularProgress', 'Skeleton', 'Modal', 'Backdrop',
    'ClickAwayListener', 'FocusTrap', 'Portal', 'Hidden', 'GridList',
    'GridListTile', 'GridListTileBar', 'ImageList', 'ImageListItem',
    'ImageListItemBar', 'Masonry', 'SpeedDial', 'SpeedDialAction',
    'SpeedDialIcon', 'Stepper', 'Step', 'StepLabel', 'StepIcon', 'StepConnector',
    'Timeline', 'TimelineItem', 'TimelineSeparator', 'TimelineConnector',
    'TimelineContent', 'TimelineOppositeContent', 'TimelineDot',
  ];
  
  return muiComponents.includes(name);
}

/**
 * Helper: minimatch implementation (simplified)
 */
function minimatch(filepath: string, pattern: string): boolean {
  // Convert glob to regex
  const regexPattern = pattern
    .replace(/\./g, '\\.')
    .replace(/\*\*/g, '.*')
    .replace(/\*/g, '[^/]*')
    .replace(/\?/g, '[^/]');
  
  try {
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(filepath);
  } catch {
    return false;
  }
}

// Import required modules
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

// Re-export types
export type { MigrationResult, MigrationError, MigrationWarning, CodemodOptions } from './index';