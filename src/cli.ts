#!/usr/bin/env node

/**
 * MUI Compat Layer - CLI
 * 
 * Command-line tool for migrating MUI v5 projects to Radix UI.
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import { runMigration, CodemodOptions, MigrationResult } from './codemods';
import { convertMUIThemeToRadix, createRadixThemeConfig } from './theme';

interface CLIOptions {
  project?: string;
  config?: string;
  output?: string;
  dryRun?: boolean;
  verbose?: boolean;
  backup?: boolean;
  include?: string[];
  exclude?: string[];
  targetFiles?: string[];
  convertTheme?: boolean;
  convertImports?: boolean;
  convertComponents?: boolean;
  convertProps?: boolean;
  convertSx?: boolean;
  convertThemeUsage?: boolean;
  themeFile?: string;
  help?: boolean;
  version?: boolean;
}

const VERSION = '0.1.0';

function printHelp(): void {
  console.log(`
MUI Compat Layer v${VERSION} - MUI to Radix UI Migration Tool

Usage: mui-compat-layer [options]

Options:
  -p, --project <dir>        Project root directory (default: current directory)
  -c, --config <file>        Migration config file (JSON)
  -o, --output <file>        Output migration report file
  --dry-run                  Preview changes without modifying files
  -v, --verbose              Verbose output
  -b, --backup               Create backup files before modifying
  --include <patterns>       File patterns to include (comma-separated)
  --exclude <patterns>       File patterns to exclude (comma-separated)
  --target-files <files>     Specific files to migrate (comma-separated)
  --theme-file <file>        MUI theme file to convert (JS/TS/JSON)
  
  Transformation Options:
  --convert-theme            Convert MUI theme to Radix (default: true)
  --convert-imports          Convert MUI imports to Radix (default: true)
  --convert-components       Convert component usage (default: true)
  --convert-props            Convert component props (default: true)
  --convert-sx               Convert sx/styled props (default: true)
  --convert-theme-usage      Convert theme hooks/providers (default: true)
  --no-convert-theme         Disable theme conversion
  --no-convert-imports       Disable import conversion
  --no-convert-components    Disable component conversion
  --no-convert-props         Disable prop conversion
  --no-convert-sx            Disable sx prop conversion
  --no-convert-theme-usage   Disable theme usage conversion
  
  -h, --help                 Show this help
  --version                  Show version

Examples:
  mui-compat-layer --project ./my-app --verbose
  mui-compat-layer --project ./my-app --theme-file ./src/theme.ts --dry-run
  mui-compat-layer --config migration-config.json
  mui-compat-layer --project ./my-app --target-files "src/components/Button.tsx,src/pages/Dashboard.tsx"
  mui-compat-layer --project ./my-app --no-convert-sx --backup

Config file example (migration-config.json):
{
  "projectRoot": "./my-app",
  "themeFile": "./src/theme.ts",
  "includePatterns": ["**/*.{ts,tsx}"],
  "excludePatterns": ["**/node_modules/**", "**/*.test.ts"],
  "transformOptions": {
    "convertTheme": true,
    "convertImports": true,
    "convertComponents": true,
    "convertProps": true,
    "convertSx": true,
    "convertThemeUsage": true
  },
  "dryRun": false,
  "verbose": true,
  "backup": true
}
`);
}

function printVersion(): void {
  console.log(`MUI Compat Layer v${VERSION}`);
}

function parseArgs(args: string[]): CLIOptions {
  const options: CLIOptions = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '-p':
      case '--project':
        options.project = args[++i];
        break;
      case '-c':
      case '--config':
        options.config = args[++i];
        break;
      case '-o':
      case '--output':
        options.output = args[++i];
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '-v':
      case '--verbose':
        options.verbose = true;
        break;
      case '-b':
      case '--backup':
        options.backup = true;
        break;
      case '--include':
        options.include = args[++i].split(',');
        break;
      case '--exclude':
        options.exclude = args[++i].split(',');
        break;
      case '--target-files':
        options.targetFiles = args[++i].split(',');
        break;
      case '--theme-file':
        options.themeFile = args[++i];
        break;
      case '--convert-theme':
        options.convertTheme = true;
        break;
      case '--no-convert-theme':
        options.convertTheme = false;
        break;
      case '--convert-imports':
        options.convertImports = true;
        break;
      case '--no-convert-imports':
        options.convertImports = false;
        break;
      case '--convert-components':
        options.convertComponents = true;
        break;
      case '--no-convert-components':
        options.convertComponents = false;
        break;
      case '--convert-props':
        options.convertProps = true;
        break;
      case '--no-convert-props':
        options.convertProps = false;
        break;
      case '--convert-sx':
        options.convertSx = true;
        break;
      case '--no-convert-sx':
        options.convertSx = false;
        break;
      case '--convert-theme-usage':
        options.convertThemeUsage = true;
        break;
      case '--no-convert-theme-usage':
        options.convertThemeUsage = false;
        break;
      case '-h':
      case '--help':
        options.help = true;
        break;
      case '--version':
        options.version = true;
        break;
      default:
        console.error(`Unknown option: ${arg}`);
        process.exit(1);
    }
  }
  
  return options;
}

async function loadConfigFile(configPath: string): Promise<Partial<CodemodOptions>> {
  try {
    const content = await fs.readFile(configPath, 'utf-8');
    const ext = path.extname(configPath).toLowerCase();
    
    if (ext === '.json') {
      return JSON.parse(content);
    }
    
    throw new Error(`Unsupported config format: ${ext}`);
  } catch (error) {
    console.error(`Failed to load config: ${error.message}`);
    process.exit(1);
  }
}

async function loadThemeFile(themePath: string): Promise<any> {
  try {
    const fullPath = path.resolve(themePath);
    const ext = path.extname(fullPath).toLowerCase();
    
    if (ext === '.json') {
      const content = await fs.readFile(fullPath, 'utf-8');
      return JSON.parse(content);
    }
    
    if (ext === '.js' || ext === '.ts') {
      // For JS/TS files, we'd need to evaluate them
      // This is a simplified approach - in production use a proper evaluator
      const content = await fs.readFile(fullPath, 'utf-8');
      
      // Try to extract theme object from export
      const exportMatch = content.match(/export\s+(?:default\s+)?(?:const|let|var)\s+\w+\s*=\s*(\{[\s\S]*?\});?/);
      if (exportMatch) {
        // This is a simplified parser - use proper evaluation in production
        console.warn('Theme file parsing is limited. Consider using JSON format for theme.');
        return {};
      }
      
      return {};
    }
    
    throw new Error(`Unsupported theme file format: ${ext}`);
  } catch (error) {
    console.error(`Failed to load theme: ${error.message}`);
    process.exit(1);
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const options = parseArgs(args);
  
  if (options.help) {
    printHelp();
    return;
  }
  
  if (options.version) {
    printVersion();
    return;
  }
  
  // Load config file if provided
  let fileConfig: Partial<CodemodOptions> = {};
  if (options.config) {
    fileConfig = await loadConfigFile(options.config);
  }
  
  // Load theme file if provided
  let muiTheme: any = fileConfig.muiTheme;
  if (options.themeFile) {
    muiTheme = await loadThemeFile(options.themeFile);
  }
  
  // Build codemod options
  const projectRoot = path.resolve(options.project || fileConfig.projectRoot || process.cwd());
  
  const codemodOptions: CodemodOptions = {
    projectRoot,
    muiTheme,
    customMappings: fileConfig.customMappings,
    includePatterns: options.include || fileConfig.includePatterns || ['**/*.{ts,tsx,js,jsx}'],
    excludePatterns: options.exclude || fileConfig.excludePatterns || ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.git/**'],
    targetFiles: options.targetFiles || fileConfig.targetFiles || [],
    dryRun: options.dryRun ?? fileConfig.dryRun ?? false,
    verbose: options.verbose ?? fileConfig.verbose ?? false,
    backup: options.backup ?? fileConfig.backup ?? false,
    transformOptions: {
      convertTheme: options.convertTheme ?? fileConfig.transformOptions?.convertTheme ?? true,
      convertImports: options.convertImports ?? fileConfig.transformOptions?.convertImports ?? true,
      convertComponents: options.convertComponents ?? fileConfig.transformOptions?.convertComponents ?? true,
      convertProps: options.convertProps ?? fileConfig.transformOptions?.convertProps ?? true,
      convertSx: options.convertSx ?? fileConfig.transformOptions?.convertSx ?? true,
      convertThemeUsage: options.convertThemeUsage ?? fileConfig.transformOptions?.convertThemeUsage ?? true,
    },
  };
  
  console.log('🚀 Starting MUI to Radix UI migration...');
  console.log(`📁 Project: ${projectRoot}`);
  console.log(`🔧 Options:`, {
    dryRun: codemodOptions.dryRun,
    verbose: codemodOptions.verbose,
    backup: codemodOptions.backup,
    theme: !!muiTheme,
    transforms: codemodOptions.transformOptions,
  });
  
  // Run migration
  const result: MigrationResult = await runMigration(codemodOptions);
  
  // Print summary
  console.log('\n📊 Migration Summary:');
  console.log(`   Files processed: ${result.filesProcessed}`);
  console.log(`   Files modified: ${result.filesModified}`);
  console.log(`   Components migrated: ${result.componentsMigrated}`);
  console.log(`   Errors: ${result.errors.length}`);
  console.log(`   Warnings: ${result.warnings.length}`);
  
  if (Object.keys(result.componentCounts).length > 0) {
    console.log('\n📦 Component Migration Counts:');
    for (const [component, count] of Object.entries(result.componentCounts)) {
      console.log(`   ${component}: ${count}`);
    }
  }
  
  if (result.errors.length > 0) {
    console.log('\n❌ Errors:');
    for (const error of result.errors.slice(0, 10)) {
      console.log(`   ${error.file}:${error.line}:${error.column} - ${error.message}`);
    }
    if (result.errors.length > 10) {
      console.log(`   ... and ${result.errors.length - 10} more errors`);
    }
  }
  
  if (result.warnings.length > 0) {
    console.log('\n⚠️ Warnings:');
    for (const warning of result.warnings.slice(0, 10)) {
      console.log(`   ${warning.file}:${warning.line}:${warning.column} - ${warning.message}`);
      if (warning.suggestion) {
        console.log(`      Suggestion: ${warning.suggestion}`);
      }
    }
    if (result.warnings.length > 10) {
      console.log(`   ... and ${result.warnings.length - 10} more warnings`);
    }
  }
  
  // Write output report if requested
  if (options.output) {
    const report = generateReport(result, codemodOptions);
    await fs.writeFile(options.output, report, 'utf-8');
    console.log(`\n📄 Report written to: ${options.output}`);
  }
  
  // Generate theme config if theme was provided
  if (muiTheme && codemodOptions.transformOptions.convertTheme) {
    try {
      const radixTheme = createRadixThemeConfig(muiTheme);
      const themeOutput = path.join(projectRoot, 'radix-theme.config.ts');
      const themeContent = generateThemeConfigFile(radixTheme);
      
      if (!codemodOptions.dryRun) {
        await fs.writeFile(themeOutput, themeContent, 'utf-8');
        console.log(`\n🎨 Radix theme config generated: ${themeOutput}`);
      } else {
        console.log(`\n🎨 Radix theme config would be generated at: ${themeOutput}`);
      }
    } catch (error) {
      console.warn(`\n⚠️ Failed to generate theme config: ${error.message}`);
    }
  }
  
  // Exit with error code if there were errors
  if (result.errors.length > 0) {
    process.exit(1);
  }
}

function generateReport(result: MigrationResult, options: CodemodOptions): string {
  const lines = [
    '# MUI to Radix UI Migration Report',
    '',
    `**Generated:** ${new Date().toISOString()}`,
    `**Project:** ${options.projectRoot}`,
    `**Dry Run:** ${options.dryRun}`,
    '',
    '## Summary',
    `- Files processed: ${result.filesProcessed}`,
    `- Files modified: ${result.filesModified}`,
    `- Components migrated: ${result.componentsMigrated}`,
    `- Errors: ${result.errors.length}`,
    `- Warnings: ${result.warnings.length}`,
    '',
    '## Component Migration Counts',
  ];
  
  for (const [component, count] of Object.entries(result.componentCounts)) {
    lines.push(`- ${component}: ${count}`);
  }
  
  if (result.errors.length > 0) {
    lines.push('', '## Errors');
    for (const error of result.errors) {
      lines.push(`- \`${error.file}:${error.line}:${error.column}\` - ${error.message}`);
    }
  }
  
  if (result.warnings.length > 0) {
    lines.push('', '## Warnings');
    for (const warning of result.warnings) {
      lines.push(`- \`${warning.file}:${warning.line}:${warning.column}\` - ${warning.message}`);
      if (warning.suggestion) {
        lines.push(`  > ${warning.suggestion}`);
      }
    }
  }
  
  return lines.join('\n');
}

function generateThemeConfigFile(themeConfig: any): string {
  return `// Auto-generated Radix theme configuration
// Generated by mui-compat-layer CLI

import { createTheme } from '@radix-ui/themes';

export const radixTheme = createTheme(${JSON.stringify(themeConfig, null, 2)});

export default radixTheme;
`;
}

// Run CLI
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});