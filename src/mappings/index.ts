/**
 * Component Mappings
 * 
 * Maps Material UI v5 components to Radix UI primitives.
 * Each mapping includes component name, package, prop mappings, and style conversions.
 */

import type { RadixComponentConfig, MUIComponentName } from '../types';

/**
 * MUI to Radix UI component mappings
 * 
 * Covers the most commonly used MUI components with their Radix equivalents.
 * Some MUI components map to multiple Radix components depending on usage.
 */
export const MUI_TO_RADIX_MAPPINGS: Record<MUIComponentName, RadixComponentConfig> = {
  // Layout
  Box: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      component: 'as',
      sx: 'style',
    },
    styleMappings: {
      // MUI spacing -> Radix spacing
      p: 'padding',
      px: 'paddingInline',
      py: 'paddingBlock',
      m: 'margin',
      mx: 'marginInline',
      my: 'marginBlock',
    },
  },
  Container: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      maxWidth: 'width',
      component: 'as',
      sx: 'style',
    },
  },
  Grid: {
    component: 'Grid',
    package: '@radix-ui/themes',
    propMappings: {
      container: 'type', // Grid type: 'grid' | 'row' | 'col'
      spacing: 'gap',
      direction: 'direction',
      wrap: 'wrap',
      justifyContent: 'justify',
      alignItems: 'align',
      sx: 'style',
    },
    unsupportedProps: ['item', 'xs', 'sm', 'md', 'lg', 'xl', 'zeroMinWidth'],
  },
  Stack: {
    component: 'Flex',
    package: '@radix-ui/themes',
    propMappings: {
      direction: 'direction',
      spacing: 'gap',
      divider: 'divider',
      sx: 'style',
    },
  },

  // Typography
  Typography: {
    component: 'Text',
    package: '@radix-ui/themes',
    propMappings: {
      variant: 'as', // h1-h6, p, span, etc.
      color: 'color',
      align: 'align',
      gutterBottom: 'marginBottom',
      paragraph: 'as', // forces 'p'
      component: 'as',
      sx: 'style',
    },
    styleMappings: {
      fontWeight: 'fontWeight',
      fontSize: 'fontSize',
      lineHeight: 'lineHeight',
      letterSpacing: 'letterSpacing',
      textTransform: 'textTransform',
    },
  },

  // Buttons
  Button: {
    component: 'Button',
    package: '@radix-ui/themes',
    propMappings: {
      variant: 'variant', // 'solid' | 'soft' | 'surface' | 'outline' | 'ghost'
      size: 'size', // '1' | '2' | '3'
      color: 'color', // 'gray' | 'blue' | 'red' | etc.
      disabled: 'disabled',
      loading: 'loading',
      startIcon: 'children', // prefix
      endIcon: 'children', // suffix
      fullWidth: 'width', // '100%'
      disableElevation: 'variant', // 'ghost' or 'soft'
      disableRipple: undefined, // not in Radix
      disableFocusRipple: undefined,
      sx: 'style',
    },
    requiredProps: [],
    unsupportedProps: ['href', 'component', 'disableTouchRipple'],
  },
  IconButton: {
    component: 'Button',
    package: '@radix-ui/themes',
    propMappings: {
      variant: 'variant',
      size: 'size',
      color: 'color',
      disabled: 'disabled',
      edge: undefined, // not directly supported
      sx: 'style',
    },
    unsupportedProps: ['edge', 'href'],
  },
  ButtonGroup: {
    component: 'Flex',
    package: '@radix-ui/themes',
    propMappings: {
      orientation: 'direction',
      spacing: 'gap',
      sx: 'style',
    },
  },

  // Inputs
  TextField: {
    component: 'Input',
    package: '@radix-ui/themes',
    propMappings: {
      label: 'label',
      value: 'value',
      onChange: 'onValueChange',
      placeholder: 'placeholder',
      disabled: 'disabled',
      required: 'required',
      error: 'invalid',
      helperText: 'description',
      placeholder: 'placeholder',
      type: 'type',
      multiline: 'as', // 'textarea'
      rows: 'rows',
      maxRows: undefined,
      fullWidth: 'width',
      size: 'size',
      variant: undefined, // Radix uses consistent styling
      InputProps: undefined,
      inputProps: undefined,
      sx: 'style',
    },
    unsupportedProps: ['variant', 'InputProps', 'inputProps', 'InputLabelProps'],
  },
  Input: {
    component: 'Input',
    package: '@radix-ui/themes',
    propMappings: {
      value: 'value',
      onChange: 'onValueChange',
      placeholder: 'placeholder',
      disabled: 'disabled',
      required: 'required',
      type: 'type',
      sx: 'style',
    },
  },
  Textarea: {
    component: 'TextArea',
    package: '@radix-ui/themes',
    propMappings: {
      value: 'value',
      onChange: 'onValueChange',
      placeholder: 'placeholder',
      disabled: 'disabled',
      required: 'required',
      rows: 'rows',
      sx: 'style',
    },
  },
  Select: {
    component: 'Select',
    package: '@radix-ui/themes',
    propMappings: {
      value: 'value',
      onChange: 'onValueChange',
      label: 'label',
      placeholder: 'placeholder',
      disabled: 'disabled',
      required: 'required',
      error: 'invalid',
      helperText: 'description',
      multiple: 'multiple',
      sx: 'style',
    },
    unsupportedProps: ['variant', 'MenuProps', 'native', 'IconComponent'],
  },
  FormControl: {
    component: 'Field',
    package: '@radix-ui/themes',
    propMappings: {
      component: 'as',
      sx: 'style',
    },
    requiredProps: [],
  },
  FormLabel: {
    component: 'Label',
    package: '@radix-ui/themes',
    propMappings: {
      component: 'as',
      sx: 'style',
    },
  },
  FormHelperText: {
    component: 'Text',
    package: '@radix-ui/themes',
    propMappings: {
      component: 'as',
      sx: 'style',
    },
  },
  InputLabel: {
    component: 'Label',
    package: '@radix-ui/themes',
    propMappings: {
      shrink: undefined,
      sx: 'style',
    },
  },

  // Checkbox & Radio
  Checkbox: {
    component: 'Checkbox',
    package: '@radix-ui/themes',
    propMappings: {
      checked: 'checked',
      onChange: 'onCheckedChange',
      disabled: 'disabled',
      required: 'required',
      value: 'value',
      color: 'color',
      sx: 'style',
    },
    unsupportedProps: ['icon', 'checkedIcon', 'indeterminateIcon'],
  },
  Radio: {
    component: 'RadioGroup.Item',
    package: '@radix-ui/themes',
    propMappings: {
      checked: 'checked',
      onChange: 'onValueChange',
      disabled: 'disabled',
      value: 'value',
      color: 'color',
      sx: 'style',
    },
  },
  RadioGroup: {
    component: 'RadioGroup',
    package: '@radix-ui/themes',
    propMappings: {
      value: 'value',
      onChange: 'onValueChange',
      disabled: 'disabled',
      required: 'required',
      sx: 'style',
    },
  },
  Switch: {
    component: 'Switch',
    package: '@radix-ui/themes',
    propMappings: {
      checked: 'checked',
      onChange: 'onCheckedChange',
      disabled: 'disabled',
      required: 'required',
      value: 'value',
      color: 'color',
      sx: 'style',
    },
    unsupportedProps: ['icon', 'checkedIcon'],
  },

  // Feedback
  Alert: {
    component: 'Alert',
    package: '@radix-ui/themes',
    propMappings: {
      severity: 'variant', // 'info' | 'success' | 'warning' | 'error'
      variant: 'variant', // 'filled' | 'outlined' | 'standard'
      action: 'action',
      onClose: 'onClose',
      sx: 'style',
    },
  },
  Snackbar: {
    component: 'Toast',
    package: '@radix-ui/themes',
    propMappings: {
      open: 'open',
      onClose: 'onOpenChange',
      message: 'children',
      action: 'action',
      autoHideDuration: 'duration',
      sx: 'style',
    },
  },

  // Data Display
  Avatar: {
    component: 'Avatar',
    package: '@radix-ui/themes',
    propMappings: {
      src: 'src',
      alt: 'alt',
      size: 'size',
      sx: 'style',
    },
  },
  Badge: {
    component: 'Badge',
    package: '@radix-ui/themes',
    propMappings: {
      badgeContent: 'children',
      color: 'color',
      variant: 'variant',
      max: undefined,
      showZero: undefined,
      sx: 'style',
    },
  },
  Chip: {
    component: 'Badge',
    package: '@radix-ui/themes',
    propMappings: {
      label: 'children',
      onDelete: 'onClose',
      variant: 'variant',
      color: 'color',
      size: 'size',
      disabled: 'disabled',
      sx: 'style',
    },
    unsupportedProps: ['avatar', 'icon', 'deleteIcon'],
  },
  Divider: {
    component: 'Separator',
    package: '@radix-ui/themes',
    propMappings: {
      orientation: 'orientation',
      variant: undefined,
      sx: 'style',
    },
  },
  List: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      component: 'as',
      sx: 'style',
    },
  },
  ListItem: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      button: undefined,
      component: 'as',
      sx: 'style',
    },
  },
  ListItemText: {
    component: 'Text',
    package: '@radix-ui/themes',
    propMappings: {
      primary: 'children',
      secondary: undefined,
      sx: 'style',
    },
  },
  ListItemIcon: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },

  // Overlays
  Dialog: {
    component: 'Dialog',
    package: '@radix-ui/themes',
    propMappings: {
      open: 'open',
      onClose: 'onOpenChange',
      fullWidth: 'width',
      maxWidth: 'maxWidth',
      fullScreen: undefined,
      PaperProps: undefined,
      sx: 'style',
    },
    unsupportedProps: ['PaperProps', 'TransitionComponent', 'TransitionProps'],
  },
  Drawer: {
    component: 'Sheet', // Radix Sheet for side drawers
    package: '@radix-ui/themes',
    propMappings: {
      open: 'open',
      onClose: 'onOpenChange',
      anchor: 'side', // 'left' | 'right' | 'top' | 'bottom'
      variant: undefined,
      PaperProps: undefined,
      sx: 'style',
    },
    unsupportedProps: ['PaperProps', 'variant', 'TransitionProps'],
  },
  Menu: {
    component: 'DropdownMenu',
    package: '@radix-ui/themes',
    propMappings: {
      open: 'open',
      onClose: 'onOpenChange',
      anchorEl: undefined,
      PaperProps: undefined,
      sx: 'style',
    },
    unsupportedProps: ['anchorEl', 'PaperProps', 'TransitionProps'],
  },
  MenuItem: {
    component: 'DropdownMenu.Item',
    package: '@radix-ui/themes',
    propMappings: {
      onClick: 'onSelect',
      disabled: 'disabled',
      sx: 'style',
    },
  },
  Popover: {
    component: 'Popover',
    package: '@radix-ui/themes',
    propMappings: {
      open: 'open',
      onClose: 'onOpenChange',
      anchorEl: undefined,
      anchorOrigin: 'side',
      transformOrigin: 'side',
      PaperProps: undefined,
      sx: 'style',
    },
    unsupportedProps: ['anchorEl', 'PaperProps', 'TransitionProps'],
  },
  Tooltip: {
    component: 'Tooltip',
    package: '@radix-ui/themes',
    propMappings: {
      title: 'content',
      placement: 'side',
      arrow: 'showArrow',
      disabled: 'disabled',
      sx: 'style',
    },
    unsupportedProps: ['arrow', 'TransitionComponent', 'PopperProps'],
  },
  Popper: {
    component: 'Popover',
    package: '@radix-ui/themes',
    propMappings: {
      open: 'open',
      onClose: 'onOpenChange',
      anchorEl: undefined,
      placement: 'side',
      sx: 'style',
    },
  },

  // Navigation
  Tabs: {
    component: 'Tabs',
    package: '@radix-ui/themes',
    propMappings: {
      value: 'value',
      onChange: 'onValueChange',
      variant: 'variant', // 'solid' | 'soft' | 'surface'
      orientation: 'orientation',
      sx: 'style',
    },
    unsupportedProps: ['TabIndicatorProps', 'TabScrollButtonProps'],
  },
  Tab: {
    component: 'Tabs.Trigger',
    package: '@radix-ui/themes',
    propMappings: {
      label: 'children',
      disabled: 'disabled',
      icon: undefined,
      sx: 'style',
    },
  },
  Breadcrumbs: {
    component: 'Flex',
    package: '@radix-ui/themes',
    propMappings: {
      separator: 'divider',
      sx: 'style',
    },
  },
  Link: {
    component: 'Text',
    package: '@radix-ui/themes',
    propMappings: {
      component: 'as', // 'a'
      href: 'href',
      underline: 'underline',
      sx: 'style',
    },
  },
  Pagination: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      count: undefined,
      page: undefined,
      onChange: undefined,
      sx: 'style',
    },
    unsupportedProps: ['count', 'page', 'onChange', 'color', 'shape', 'size', 'variant'],
  },

  // Data Entry
  Slider: {
    component: 'Slider',
    package: '@radix-ui/themes',
    propMappings: {
      value: 'value',
      onChange: 'onValueChange',
      min: 'min',
      max: 'max',
      step: 'step',
      disabled: 'disabled',
      marks: undefined,
      sx: 'style',
    },
    unsupportedProps: ['marks', 'valueLabelDisplay', 'valueLabelFormat'],
  },
  Rating: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      value: undefined,
      onChange: undefined,
      max: undefined,
      sx: 'style',
    },
    unsupportedProps: ['value', 'onChange', 'max', 'precision', 'icon', 'emptyIcon'],
  },

  // Utility
  Paper: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      elevation: 'shadow',
      variant: 'variant',
      sx: 'style',
    },
  },
  Card: {
    component: 'Card',
    package: '@radix-ui/themes',
    propMappings: {
      variant: 'variant', // 'surface' | 'classic' | 'ghost'
      sx: 'style',
    },
  },
  CardContent: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },
  CardHeader: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },
  CardActions: {
    component: 'Flex',
    package: '@radix-ui/themes',
    propMappings: {
      spacing: 'gap',
      sx: 'style',
    },
  },
  CardMedia: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      component: 'as', // 'img'
      sx: 'style',
    },
  },
  Accordion: {
    component: 'Collapsible',
    package: '@radix-ui/themes',
    propMappings: {
      expanded: 'open',
      onChange: 'onOpenChange',
      disabled: 'disabled',
      sx: 'style',
    },
  },
  AccordionSummary: {
    component: 'Collapsible.Trigger',
    package: '@radix-ui/themes',
    propMappings: {
      expandIcon: undefined,
      sx: 'style',
    },
  },
  AccordionDetails: {
    component: 'Collapsible.Content',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },
  Table: {
    component: 'Table',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },
  TableHead: {
    component: 'Table.Header',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },
  TableBody: {
    component: 'Table.Body',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },
  TableRow: {
    component: 'Table.Row',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },
  TableCell: {
    component: 'Table.Cell',
    package: '@radix-ui/themes',
    propMappings: {
      align: 'align',
      sx: 'style',
    },
  },
  TableContainer: {
    component: 'ScrollArea',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },
  TablePagination: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
    unsupportedProps: ['count', 'page', 'onPageChange', 'rowsPerPage', 'onRowsPerPageChange'],
  },
  TableSortLabel: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      active: undefined,
      direction: undefined,
      sx: 'style',
    },
  },

  // Progress
  LinearProgress: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      value: undefined,
      variant: undefined,
      sx: 'style',
    },
    unsupportedProps: ['value', 'variant', 'color', 'valueBuffer'],
  },
  CircularProgress: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      value: undefined,
      variant: undefined,
      sx: 'style',
    },
    unsupportedProps: ['value', 'variant', 'color', 'disableShrink'],
  },
  Skeleton: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      variant: undefined,
      animation: undefined,
      sx: 'style',
    },
    unsupportedProps: ['variant', 'animation'],
  },

  // Other
  Modal: {
    component: 'Dialog',
    package: '@radix-ui/themes',
    propMappings: {
      open: 'open',
      onClose: 'onOpenChange',
      closeAfterTransition: undefined,
      sx: 'style',
    },
  },
  Backdrop: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      open: 'open',
      sx: 'style',
    },
  },
  ClickAwayListener: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      onClickAway: undefined,
      sx: 'style',
    },
  },
  FocusTrap: {
    component: 'FocusScope',
    package: '@radix-ui/react-focus-scope',
    propMappings: {
      sx: 'style',
    },
  },
  Portal: {
    component: 'Portal',
    package: '@radix-ui/react-portal',
    propMappings: {
      container: 'container',
      sx: 'style',
    },
  },
  Hidden: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      hidden: undefined,
      onlyScreen: undefined,
      sx: 'style',
    },
    unsupportedProps: ['onlyScreen', 'implementation'],
  },
  GridList: {
    component: 'Grid',
    package: '@radix-ui/themes',
    propMappings: {
      cols: 'columns',
      spacing: 'gap',
      sx: 'style',
    },
  },
  GridListTile: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },
  GridListTileBar: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },
  ImageList: {
    component: 'Grid',
    package: '@radix-ui/themes',
    propMappings: {
      cols: 'columns',
      spacing: 'gap',
      sx: 'style',
    },
  },
  ImageListItem: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },
  ImageListItemBar: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },
  Masonry: {
    component: 'Grid',
    package: '@radix-ui/themes',
    propMappings: {
      cols: 'columns',
      spacing: 'gap',
      sx: 'style',
    },
  },
  SpeedDial: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },
  SpeedDialAction: {
    component: 'Button',
    package: '@radix-ui/themes',
    propMappings: {
      tooltip: 'tooltip',
      sx: 'style',
    },
  },
  SpeedDialIcon: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },
  Stepper: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      activeStep: undefined,
      orientation: 'direction',
      sx: 'style',
    },
    unsupportedProps: ['activeStep', 'alternativeLabel', 'connector', 'nonLinear'],
  },
  Step: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },
  StepLabel: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },
  StepIcon: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },
  StepConnector: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },
  Timeline: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },
  TimelineItem: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },
  TimelineSeparator: {
    component: 'Separator',
    package: '@radix-ui/themes',
    propMappings: {
      orientation: 'vertical',
      sx: 'style',
    },
  },
  TimelineConnector: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },
  TimelineContent: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },
  TimelineOppositeContent: {
    component: 'Box',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },
  TimelineDot: {
    component: 'Badge',
    package: '@radix-ui/themes',
    propMappings: {
      sx: 'style',
    },
  },

  // Charts - not in Radix, would need separate charting library
  // Sparklines, AreaChart, BarChart, LineChart, PieChart, ScatterChart, etc.
};

/**
 * Get Radix component config for an MUI component
 */
export function getRadixComponent(muiComponent: MUIComponentName): RadixComponentConfig | undefined {
  return MUI_TO_RADIX_MAPPINGS[muiComponent];
}

/**
 * Get all supported MUI component names
 */
export function getSupportedComponents(): MUIComponentName[] {
  return Object.keys(MUI_TO_RADIX_MAPPINGS) as MUIComponentName[];
}

/**
 * Check if an MUI component is supported
 */
export function isSupported(muiComponent: string): boolean {
  return muiComponent in MUI_TO_RADIX_MAPPINGS;
}

/**
 * Get migration notes for a component
 */
export function getMigrationNotes(muiComponent: MUIComponentName): string[] {
  const config = MUI_TO_RADIX_MAPPINGS[muiComponent];
  if (!config) return [`No migration available for ${muiComponent}`];
  
  const notes: string[] = [];
  
  if (config.unsupportedProps && config.unsupportedProps.length > 0) {
    notes.push(`Unsupported props: ${config.unsupportedProps.join(', ')}`);
  }
  
  if (config.requiredProps && config.requiredProps.length > 0) {
    notes.push(`Required props: ${config.requiredProps.join(', ')}`);
  }
  
  const propMappings = Object.entries(config.propMappings || {})
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => `${k} -> ${v}`);
  
  if (propMappings.length > 0) {
    notes.push(`Prop mappings: ${propMappings.join(', ')}`);
  }
  
  if (config.package && config.package !== '@radix-ui/themes') {
    notes.push(`Requires package: ${config.package}`);
  }
  
  return notes.length > 0 ? notes : ['Direct replacement available'];
}

export { MUI_TO_RADIX_MAPPINGS, getRadixComponent, getSupportedComponents, isSupported, getMigrationNotes };