/**
 * Components Index
 * 
 * Re-exports components from @radix-ui/themes for convenience.
 * Provides a drop-in replacement for MUI components.
 * 
 * Note: These are re-exports from @radix-ui/themes.
 * Install @radix-ui/themes to use these components.
 */

// Re-export all components from @radix-ui/themes
export {
  // Layout
  Box,
  Flex,
  Grid,
  
  // Typography
  Text,
  Heading,
  
  // Buttons
  Button,
  IconButton,
  
  // Inputs
  Input,
  TextArea,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  Slider,
  Label,
  Field,
  Form,
  
  // Cards & Surfaces
  Card,
  Separator,
  
  // Feedback
  Alert,
  Badge,
  Toast,
  Toaster,
  
  // Data Display
  Avatar,
  Table,
  
  // Overlays
  Dialog,
  Sheet,
  Drawer,
  Menu,
  DropdownMenu,
  ContextMenu,
  HoverCard,
  Popover,
  Tooltip,
  
  // Navigation
  Tabs,
  Accordion,
  Collapsible,
  ScrollArea,
  
  // Utility
  AspectRatio,
  VisuallyHidden,
  FocusScope,
  Portal,
  Slot,
} from '@radix-ui/themes';

/**
 * Component type aliases for MUI compatibility
 * These provide the same API surface as MUI components
 */

// Layout types
export type { BoxProps } from '@radix-ui/themes';
export type { FlexProps } from '@radix-ui/themes';
export type { GridProps } from '@radix-ui/themes';

// Typography types
export type { TextProps } from '@radix-ui/themes';
export type { HeadingProps } from '@radix-ui/themes';

// Button types
export type { ButtonProps } from '@radix-ui/themes';

// Input types
export type { InputProps } from '@radix-ui/themes';
export type { TextAreaProps } from '@radix-ui/themes';
export type { SelectProps } from '@radix-ui/themes';
export type { CheckboxProps } from '@radix-ui/themes';
export type { RadioGroupProps } from '@radix-ui/themes';
export type { SwitchProps } from '@radix-ui/themes';
export type { SliderProps } from '@radix-ui/themes';
export type { LabelProps } from '@radix-ui/themes';
export type { FieldProps } from '@radix-ui/themes';
export type { FormProps } from '@radix-ui/themes';

// Feedback types
export type { AlertProps } from '@radix-ui/themes';
export type { BadgeProps } from '@radix-ui/themes';
export type { ToastProps } from '@radix-ui/themes';
export type { ToasterProps } from '@radix-ui/themes';

// Data Display types
export type { AvatarProps } from '@radix-ui/themes';
export type { TableProps } from '@radix-ui/themes';

// Overlay types
export type { DialogProps } from '@radix-ui/themes';
export type { SheetProps } from '@radix-ui/themes';
export type { DrawerProps } from '@radix-ui/themes';
export type { MenuProps } from '@radix-ui/themes';
export type { DropdownMenuProps } from '@radix-ui/themes';
export type { ContextMenuProps } from '@radix-ui/themes';
export type { HoverCardProps } from '@radix-ui/themes';
export type { PopoverProps } from '@radix-ui/themes';
export type { TooltipProps } from '@radix-ui/themes';

// Navigation types
export type { TabsProps } from '@radix-ui/themes';
export type { AccordionProps } from '@radix-ui/themes';
export type { CollapsibleProps } from '@radix-ui/themes';
export type { ScrollAreaProps } from '@radix-ui/themes';

// Utility types
export type { AspectRatioProps } from '@radix-ui/themes';
export type { VisuallyHiddenProps } from '@radix-ui/themes';
export type { FocusScopeProps } from '@radix-ui/themes';
export type { PortalProps } from '@radix-ui/themes';
export type { SlotProps } from '@radix-ui/themes';

/**
 * MUI-to-Radix component mapping for reference
 * 
 * MUI Component -> Radix Component
 * 
 * Layout:
 * - Box -> Box
 * - Container -> Box (with maxWidth)
 * - Grid -> Grid
 * - Stack -> Flex
 * 
 * Typography:
 * - Typography -> Text (for body) / Heading (for headings)
 * 
 * Buttons:
 * - Button -> Button
 * - IconButton -> Button
 * - ButtonGroup -> Flex
 * 
 * Inputs:
 * - TextField -> Input / TextArea
 * - Input -> Input
 * - Textarea -> TextArea
 * - Select -> Select
 * - Checkbox -> Checkbox
 * - Radio -> RadioGroup.Item
 * - RadioGroup -> RadioGroup
 * - Switch -> Switch
 * - Slider -> Slider
 * 
 * Feedback:
 * - Alert -> Alert
 * - Snackbar -> Toast/Toaster
 * - Avatar -> Avatar
 * - Badge -> Badge
 * - Chip -> Badge
 * - Divider -> Separator
 * 
 * Overlays:
 * - Dialog -> Dialog
 * - Drawer -> Sheet (side) / Dialog (modal)
 * - Menu -> DropdownMenu
 * - Popover -> Popover
 * - Tooltip -> Tooltip
 * 
 * Navigation:
 * - Tabs -> Tabs
 * - Accordion -> Collapsible
 * - Pagination -> (custom)
 * - Breadcrumbs -> Flex
 * - Stepper -> (custom)
 * 
 * Data Display:
 * - Table -> Table
 * - Card -> Card
 * - List -> Box/Flex
 * - Avatar -> Avatar
 * - Chip -> Badge
 * - Table -> Table
 * 
 * Data Entry:
 * - FormControl -> Field
 * - FormLabel -> Label
 * - FormHelperText -> Text
 * - InputLabel -> Label
 * 
 * Utility:
 * - Paper -> Box
 * - Card -> Card
 * - Modal -> Dialog
 * - Drawer -> Sheet
 * - Popover -> Popover
 * - Tooltip -> Tooltip
 * - Backdrop -> (handled by Dialog/Sheet)
 * - Portal -> Portal
 * - ClickAwayListener -> (use onClickOutside)
 * - FocusTrap -> FocusScope
 * - Hidden -> Box (with display: none)
 * - GridList -> Grid
 * - ImageList -> Grid
 * - Masonry -> Grid
 * - SpeedDial -> (custom)
 * - Stepper -> (custom)
 * - Timeline -> (custom)
 * 
 * Not directly available in Radix (need custom implementation or other libraries):
 * - Charts (AreaChart, BarChart, LineChart, PieChart, ScatterChart, Sparkline)
 * - DataGrid / DataGridPro
 * - Date/Time Pickers (use @radix-ui/react-date-picker or similar)
 * - Rich Text Editor
 * - File Upload
 * - Autocomplete (use Select with filtering)
 * - TransferList
 * - TreeView
 * - Rating
 * - Skeleton
 * - Progress (Linear/Circular)
 */

// Export all for convenience
export * from '@radix-ui/themes';