/**
 * MUI Compat Layer
 * 
 * Compatibility layer that maps Material UI v5 components to Radix UI primitives,
 * providing automatic theming, migration utilities, and fallback implementations
 * for teams migrating away from MUI.
 * 
 * @package mui-compat-layer
 * @version 0.1.0
 * @license MIT
 */

// Main exports
export {
  MUICompatLayer,
  createCompatLayer,
  type CompatLayerConfig,
  type ComponentMapping,
  type ThemeConfig,
  type MigrationOptions,
} from './core/compat-layer';

// Component mappings
export {
  MUI_TO_RADIX_MAPPINGS,
  getRadixComponent,
  type MUIComponentName,
  type RadixComponentConfig,
} from './mappings';

// Theme conversion
export {
  convertMUIThemeToRadix,
  type MUITheme,
  type RadixThemeConfig,
  type ThemeTokenMap,
} from './theme';

// Codemods
export {
  runMigration,
  type MigrationResult,
  type CodemodOptions,
} from './codemods';

// Types
export * from './types';

// Utils
export * from './utils';

// Components (re-exported from @radix-ui/themes)
export {
  Box,
  Flex,
  Grid,
  Text,
  Heading,
  Button,
  IconButton,
  Input,
  TextArea,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  Slider,
  Label,
  Form,
  Card,
  Separator,
  Alert,
  Badge,
  Avatar,
  Tooltip,
  Popover,
  Dialog,
  Sheet,
  Drawer,
  Menu,
  DropdownMenu,
  ContextMenu,
  HoverCard,
  Toast,
  Toaster,
  Table,
  Tabs,
  Accordion,
  Collapsible,
  ScrollArea,
  AspectRatio,
  VisuallyHidden,
  FocusScope,
  Portal,
  Slot,
} from './components';

// Default export
import { MUICompatLayer } from './core/compat-layer';

export default MUICompatLayer;