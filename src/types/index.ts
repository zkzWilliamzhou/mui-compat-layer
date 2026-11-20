/**
 * Type Definitions for MUI Compat Layer
 */

import type { Theme as MUIThemeType } from '@mui/material/styles';
import type { Theme as RadixThemeType } from '@radix-ui/themes';

/**
 * MUI Component Names
 */
export type MUIComponentName = 
  | 'Box' | 'Container' | 'Grid' | 'Stack' | 'Typography' | 'Button' | 'IconButton' | 'ButtonGroup'
  | 'TextField' | 'Input' | 'Textarea' | 'Select' | 'FormControl' | 'FormLabel' | 'FormHelperText' | 'InputLabel'
  | 'Checkbox' | 'Radio' | 'RadioGroup' | 'Switch'
  | 'Alert' | 'Snackbar' | 'Avatar' | 'Badge' | 'Chip' | 'Divider'
  | 'List' | 'ListItem' | 'ListItemText' | 'ListItemIcon'
  | 'Dialog' | 'Drawer' | 'Menu' | 'MenuItem' | 'Popover' | 'Tooltip' | 'Popper'
  | 'Tabs' | 'Tab' | 'Breadcrumbs' | 'Link' | 'Pagination'
  | 'Slider' | 'Rating'
  | 'Paper' | 'Card' | 'CardContent' | 'CardHeader' | 'CardActions' | 'CardMedia'
  | 'Accordion' | 'AccordionSummary' | 'AccordionDetails'
  | 'Table' | 'TableHead' | 'TableBody' | 'TableRow' | 'TableCell' | 'TableContainer' | 'TablePagination' | 'TableSortLabel'
  | 'LinearProgress' | 'CircularProgress' | 'Skeleton'
  | 'Modal' | 'Backdrop' | 'ClickAwayListener' | 'FocusTrap' | 'Portal' | 'Hidden'
  | 'GridList' | 'GridListTile' | 'GridListTileBar'
  | 'ImageList' | 'ImageListItem' | 'ImageListItemBar' | 'Masonry'
  | 'SpeedDial' | 'SpeedDialAction' | 'SpeedDialIcon'
  | 'Stepper' | 'Step' | 'StepLabel' | 'StepIcon' | 'StepConnector'
  | 'Timeline' | 'TimelineItem' | 'TimelineSeparator' | 'TimelineConnector' | 'TimelineContent' | 'TimelineOppositeContent' | 'TimelineDot';

/**
 * Radix Component Configuration
 */
export interface RadixComponentConfig {
  /** Radix component name */
  component: string;
  /** Radix package name */
  package: string;
  /** Prop name mappings (MUI -> Radix) */
  propMappings?: Record<string, string>;
  /** Style prop mappings (MUI sx -> Radix style) */
  styleMappings?: Record<string, string>;
  /** Required props for Radix component */
  requiredProps?: string[];
  /** Unsupported MUI props */
  unsupportedProps?: string[];
}

/**
 * MUI Theme (simplified)
 */
export interface MUITheme {
  palette?: {
    primary?: PaletteColor;
    secondary?: PaletteColor;
    error?: PaletteColor;
    warning?: PaletteColor;
    info?: PaletteColor;
    success?: PaletteColor;
    grey?: PaletteColor;
    background?: { default?: string; paper?: string };
    text?: { primary?: string; secondary?: string; disabled?: string };
    action?: { active?: string; hover?: string; selected?: string };
    divider?: string;
    custom?: Record<string, PaletteColor>;
  };
  typography?: Record<string, TypographyVariant>;
  spacing?: number | ((factor: number) => number | string);
  shadows?: string[];
  shape?: { borderRadius?: number };
  breakpoints?: { values?: Record<string, number> };
  transitions?: {
    duration?: { shortest?: number; shorter?: number; short?: number; standard?: number; complex?: number; long?: number };
    easing?: { easeInOut?: string; easeOut?: string; easeIn?: string; sharp?: string };
  };
  zIndex?: Record<string, number>;
}

export interface PaletteColor {
  50?: string; 100?: string; 200?: string; 300?: string; 400?: string;
  500?: string; 600?: string; 700?: string; 800?: string; 900?: string;
  A100?: string; A200?: string; A400?: string; A700?: string;
  main?: string; light?: string; dark?: string; contrastText?: string;
}

export interface TypographyVariant {
  fontFamily?: string;
  fontSize?: number | string;
  fontWeight?: number;
  lineHeight?: number | string;
  letterSpacing?: string;
  textTransform?: string;
}

/**
 * Radix Theme Configuration
 */
export interface RadixThemeConfig {
  colors?: Record<string, Record<number, string>>;
  typography?: {
    fontFamily?: string;
    fontSize?: Record<string, string>;
    fontWeight?: Record<string, number>;
    lineHeight?: Record<string, number>;
    letterSpacing?: Record<string, string>;
  };
  spacing?: {
    base?: string;
    scale?: number[];
  };
  shadows?: {
    xs?: string; sm?: string; md?: string; lg?: string; xl?: string; '2xl'?: string; inner?: string; none?: string;
  };
  radii?: {
    none?: string; xs?: string; sm?: string; md?: string; lg?: string; xl?: string; '2xl'?: string; full?: string;
  };
  breakpoints?: Record<string, string>;
  transitions?: {
    fast?: string; normal?: string; slow?: string;
    easing?: { easeIn?: string; easeOut?: string; easeInOut?: string };
  };
  zIndices?: {
    hide?: number; base?: number; dropdown?: number; sticky?: number; modal?: number; popover?: number; tooltip?: number; toast?: number;
  };
}

/**
 * Theme Token Map
 */
export interface ThemeTokenMap {
  [token: string]: string;
}

/**
 * Theme Conversion Options
 */
export interface ThemeConversionOptions {
  preserveCustomColors?: boolean;
  mapSpacing?: boolean;
  mapTypography?: boolean;
}

/**
 * Compatibility Layer Configuration
 */
export interface CompatLayerConfig {
  muiTheme?: MUITheme;
  customMappings?: Partial<Record<MUIComponentName, RadixComponentConfig>>;
  themeOptions?: {
    preserveCustomColors?: boolean;
    mapSpacing?: boolean;
    mapTypography?: boolean;
  };
  migrationOptions?: CodemodOptions;
}

/**
 * Component Mapping
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
 * Theme Configuration
 */
export interface ThemeConfig {
  muiTheme: MUITheme;
  radixTheme: RadixThemeConfig;
  tokenMap: ThemeTokenMap;
}

/**
 * Migration Options
 */
export interface MigrationOptions {
  dryRun?: boolean;
  verbose?: boolean;
  backup?: boolean;
  targetFiles?: string[];
  excludePatterns?: string[];
}

/**
 * Codemod Options
 */
export interface CodemodOptions {
  projectRoot: string;
  includePatterns?: string[];
  excludePatterns?: string[];
  muiTheme?: MUITheme;
  customMappings?: Record<string, RadixComponentConfig>;
  dryRun?: boolean;
  verbose?: boolean;
  backup?: boolean;
  targetFiles?: string[];
  transformOptions?: {
    convertTheme?: boolean;
    convertImports?: boolean;
    convertComponents?: boolean;
    convertProps?: boolean;
    convertSx?: boolean;
    convertThemeUsage?: boolean;
  };
}

/**
 * Migration Result
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
 * Migration Error
 */
export interface MigrationError {
  file: string;
  line: number;
  column: number;
  message: string;
  code: string;
}

/**
 * Migration Warning
 */
export interface MigrationWarning {
  file: string;
  line: number;
  column: number;
  message: string;
  suggestion?: string;
}

/**
 * Extended MUI Theme (re-export)
 */
export type MUITheme = MUIThemeType;

/**
 * Extended Radix Theme (re-export)
 */
export type RadixTheme = RadixThemeType;