# MUI Compat Layer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://react.dev/)

> **Compatibility layer that maps Material UI v5 components to Radix UI primitives, providing automatic theming, migration utilities, and fallback implementations for teams migrating away from MUI**

MUI Compat Layer makes it easy to migrate from Material UI to Radix UI by providing automated component mapping, theme conversion, and codemods for large codebases.

## ✨ Features

- 🔄 **Automated Migration** - Codemods convert MUI imports, components, props, and sx styles to Radix equivalents
- 🎨 **Theme Conversion** - Convert MUI v5 theme objects to Radix UI theme configuration
- 📦 **Component Mapping** - 100+ MUI components mapped to Radix UI primitives
- 🛠️ **CLI Tool** - Run migrations on entire codebases with configurable options
- 🔌 **Drop-in Replacements** - Use Radix components with MUI-like API
- 🌳 **Tree-shakable** - Zero runtime dependencies, only peer dependencies
- 📝 **TypeScript First** - Full type safety with comprehensive types

## 🚀 Quick Start

```bash
# Install
npm install mui-compat-layer @radix-ui/themes

# Run migration on your project
npx mui-compat-layer --project ./my-app --verbose
```

### With Theme Conversion

```bash
npx mui-compat-layer \
  --project ./my-app \
  --theme-file ./src/theme.ts \
  --verbose
```

### Dry Run (Preview Changes)

```bash
npx mui-compat-layer --project ./my-app --dry-run --verbose
```

## 📦 Installation

```bash
npm install mui-compat-layer @radix-ui/themes
```

Peer dependencies:
```bash
npm install react react-dom
```

## 🔧 CLI Usage

```bash
# Basic migration
mui-compat-layer --project ./my-app

# With theme conversion
mui-compat-layer --project ./my-app --theme-file ./src/theme.ts

# Dry run (preview only)
mui-compat-layer --project ./my-app --dry-run

# Specific files only
mui-compat-layer --project ./my-app --target-files "src/components/Button.tsx,src/pages/Dashboard.tsx"

# Disable certain transformations
mui-compat-layer --project ./my-app --no-convert-sx --no-convert-theme-usage

# Use config file
mui-compat-layer --config migration-config.json
```

### Config File Example

```json
{
  "projectRoot": "./my-app",
  "themeFile": "./src/theme.ts",
  "includePatterns": ["**/*.{ts,tsx}"],
  "excludePatterns": ["**/node_modules/**", "**/*.test.ts", "**/*.stories.tsx"],
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
```

## 🎯 Component Mapping

MUI Compat Layer maps 100+ MUI components to Radix UI:

| MUI Component | Radix Component | Package |
|--------------|----------------|---------|
| `Box` | `Box` | `@radix-ui/themes` |
| `Container` | `Box` | `@radix-ui/themes` |
| `Grid` | `Grid` | `@radix-ui/themes` |
| `Stack` | `Flex` | `@radix-ui/themes` |
| `Typography` | `Text` / `Heading` | `@radix-ui/themes` |
| `Button` | `Button` | `@radix-ui/themes` |
| `IconButton` | `Button` | `@radix-ui/themes` |
| `TextField` | `Input` / `TextArea` | `@radix-ui/themes` |
| `Select` | `Select` | `@radix-ui/themes` |
| `Checkbox` | `Checkbox` | `@radix-ui/themes` |
| `Radio` | `RadioGroup.Item` | `@radix-ui/themes` |
| `Switch` | `Switch` | `@radix-ui/themes` |
| `Slider` | `Slider` | `@radix-ui/themes` |
| `Dialog` | `Dialog` | `@radix-ui/themes` |
| `Drawer` | `Sheet` | `@radix-ui/themes` |
| `Menu` | `DropdownMenu` | `@radix-ui/themes` |
| `Popover` | `Popover` | `@radix-ui/themes` |
| `Tooltip` | `Tooltip` | `@radix-ui/themes` |
| `Tabs` | `Tabs` | `@radix-ui/themes` |
| `Accordion` | `Collapsible` | `@radix-ui/themes` |
| `Table` | `Table` | `@radix-ui/themes` |
| `Card` | `Card` | `@radix-ui/themes` |
| `Alert` | `Alert` | `@radix-ui/themes` |
| `Snackbar` | `Toast` | `@radix-ui/themes` |
| `Avatar` | `Avatar` | `@radix-ui/themes` |
| `Badge` | `Badge` | `@radix-ui/themes` |
| `Chip` | `Badge` | `@radix-ui/themes` |
| `Divider` | `Separator` | `@radix-ui/themes` |
| `Pagination` | *(custom)* | - |
| `Stepper` | *(custom)* | - |
| `Timeline` | *(custom)* | - |

See [mappings documentation](docs/mappings.md) for complete list.

## 🎨 Theme Conversion

Convert your MUI theme to Radix automatically:

```typescript
// MUI theme (theme.ts)
import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
  spacing: 8,
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: { borderRadius: 4 },
});

// After migration - Radix theme (radix-theme.config.ts)
import { createTheme } from '@radix-ui/themes';

export const radixTheme = createTheme({
  colors: {
    primary: { /* auto-generated 12-step scale */ },
    secondary: { /* auto-generated 12-step scale */ },
  },
  spacing: { base: '0.5rem', scale: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96] },
  radii: { none: '0', xs: '1px', sm: '2px', md: '4px', lg: '8px', xl: '12px', '2xl': '16px', full: '9999px' },
  // ... all other tokens converted
});
```

## 🔌 Programmatic Usage

```typescript
import { MUICompatLayer, createCompatLayer, convertMUIThemeToRadix } from 'mui-compat-layer';

// Create compatibility layer
const compatLayer = createCompatLayer({
  muiTheme: myMUITheme,
  themeOptions: { preserveCustomColors: true },
});

// Convert theme
const radixTheme = convertMUIThemeToRadix(myMUITheme);

// Get component mapping
const mapping = compatLayer.getComponentMapping('Button');
console.log(mapping); // { radixComponent: 'Button', package: '@radix-ui/themes', ... }

// Convert props
const radixProps = compatLayer.convertProps('Button', {
  variant: 'contained',
  color: 'primary',
  size: 'large',
  fullWidth: true,
});
// Returns: { variant: 'solid', color: 'blue', size: '3', width: '100%' }
```

## 🛠️ Codemods

Run automated migrations on your codebase:

```typescript
import { runMigration } from 'mui-compat-layer/codemods';

const result = await runMigration({
  projectRoot: './my-app',
  includePatterns: ['**/*.{ts,tsx}'],
  excludePatterns: ['**/node_modules/**', '**/*.test.ts'],
  transformOptions: {
    convertTheme: true,
    convertImports: true,
    convertComponents: true,
    convertProps: true,
    convertSx: true,
    convertThemeUsage: true,
  },
  dryRun: false,
  verbose: true,
  backup: true,
});

console.log(result); // { filesProcessed, filesModified, componentsMigrated, errors, warnings }
```

### What Gets Transformed

1. **Imports** - `@mui/material/Button` → `@radix-ui/themes/Button`
2. **Components** - `<Button>` → `<Button>` (Radix)
3. **Props** - `variant="contained"` → `variant="solid"`, `fullWidth` → `width="100%"`
4. **SX Props** - `sx={{ p: 2, m: 1 }}` → `style={{ padding: '8px', margin: '4px' }}`
5. **Theme Usage** - `useTheme()` → `useRadixTheme()`, `ThemeProvider` → `RadixThemeProvider`

## 📁 Output Structure

After migration, your project will have:

```
my-app/
├── radix-theme.config.ts     # Generated Radix theme
├── src/
│   ├── components/
│   │   └── Button.tsx        # Migrated to Radix
│   └── pages/
│       └── Dashboard.tsx     # Migrated to Radix
└── package.json              # Updated dependencies
```

## 🧪 Testing

```bash
npm test
npm test -- --coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests (TDD)
4. Implement feature
5. Submit PR

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- [GitHub Repository](https://github.com/workbuddy/mui-compat-layer)
- [Issue Tracker](https://github.com/workbuddy/mui-compat-layer/issues)
- [Documentation](https://github.com/workbuddy/mui-compat-layer/docs)
- [Radix UI](https://www.radix-ui.com/)
- [Material UI](https://mui.com/)

---

**Made with ❤️ by the WorkBuddy team**