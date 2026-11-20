/**
 * Mappings Tests
 */

import { describe, it, expect } from 'vitest';
import { 
  MUI_TO_RADIX_MAPPINGS, 
  getRadixComponent, 
  getSupportedComponents, 
  isSupported, 
  getMigrationNotes 
} from '../src/mappings';

describe('MUI_TO_RADIX_MAPPINGS', () => {
  it('should have mappings for common components', () => {
    expect(MUI_TO_RADIX_MAPPINGS.Box).toBeDefined();
    expect(MUI_TO_RADIX_MAPPINGS.Button).toBeDefined();
    expect(MUI_TO_RADIX_MAPPINGS.TextField).toBeDefined();
    expect(MUI_TO_RADIX_MAPPINGS.Dialog).toBeDefined();
    expect(MUI_TO_RADIX_MAPPINGS.Table).toBeDefined();
  });

  it('should have correct structure for each mapping', () => {
    const buttonMapping = MUI_TO_RADIX_MAPPINGS.Button;
    
    expect(buttonMapping.component).toBe('Button');
    expect(buttonMapping.package).toBe('@radix-ui/themes');
    expect(buttonMapping.propMappings).toBeDefined();
    expect(buttonMapping.propMappings.variant).toBe('variant');
    expect(buttonMapping.propMappings.size).toBe('size');
    expect(buttonMapping.unsupportedProps).toContain('href');
  });

  it('should map variant correctly for Button', () => {
    const mapping = MUI_TO_RADIX_MAPPINGS.Button;
    expect(mapping.propMappings.variant).toBe('variant');
    // MUI 'contained' -> Radix 'solid'
  });

  it('should map Drawer to Sheet', () => {
    const mapping = MUI_TO_RADIX_MAPPINGS.Drawer;
    expect(mapping.component).toBe('Sheet');
    expect(mapping.propMappings.anchor).toBe('side');
  });

  it('should map Menu to DropdownMenu', () => {
    const mapping = MUI_TO_RADIX_MAPPINGS.Menu;
    expect(mapping.component).toBe('DropdownMenu');
    expect(mapping.package).toBe('@radix-ui/themes');
  });
});

describe('getRadixComponent', () => {
  it('should return mapping for supported component', () => {
    const mapping = getRadixComponent('Button');
    
    expect(mapping).toBeDefined();
    expect(mapping!.component).toBe('Button');
  });

  it('should return undefined for unsupported component', () => {
    const mapping = getRadixComponent('NonExistentComponent' as any);
    
    expect(mapping).toBeUndefined();
  });
});

describe('getSupportedComponents', () => {
  it('should return array of component names', () => {
    const components = getSupportedComponents();
    
    expect(Array.isArray(components)).toBe(true);
    expect(components.length).toBeGreaterThan(50);
    expect(components).toContain('Button');
    expect(components).toContain('Dialog');
  });
});

describe('isSupported', () => {
  it('should return true for supported components', () => {
    expect(isSupported('Button')).toBe(true);
    expect(isSupported('Dialog')).toBe(true);
    expect(isSupported('TextField')).toBe(true);
  });

  it('should return false for unsupported components', () => {
    expect(isSupported('NonExistent')).toBe(false);
    expect(isSupported('DataGrid')).toBe(false); // Not in Radix
  });
});

describe('getMigrationNotes', () => {
  it('should provide notes for Button', () => {
    const notes = getMigrationNotes('Button');
    
    expect(Array.isArray(notes)).toBe(true);
    expect(notes.length).toBeGreaterThan(0);
  });

  it('should mention unsupported props', () => {
    const notes = getMigrationNotes('Button');
    
    const unsupportedNote = notes.find(n => n.includes('Unsupported props'));
    expect(unsupportedNote).toBeDefined();
    expect(unsupportedNote).toContain('href');
  });

  it('should mention required props', () => {
    const notes = getMigrationNotes('Select');
    
    const requiredNote = notes.find(n => n.includes('Required props'));
    expect(requiredNote).toBeDefined();
  });

  it('should mention package for non-standard packages', () => {
    const notes = getMigrationNotes('FocusTrap');
    
    const packageNote = notes.find(n => n.includes('Requires package'));
    expect(packageNote).toBeDefined();
    expect(packageNote).toContain('@radix-ui/react-focus-scope');
  });
});