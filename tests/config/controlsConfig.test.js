/**
 * controlsConfig.test.js
 * Tests for the controls configuration
 */
import { describe, it, expect } from 'vitest';
import { shadowControls } from '../../js/config/controlsConfig.js';

describe('controlsConfig', () => {
  describe('shadowControls', () => {
    it('should be an array', () => {
      expect(Array.isArray(shadowControls)).toBe(true);
    });

    it('should have 8 control configurations', () => {
      expect(shadowControls).toHaveLength(8);
    });

    it('should have horizontal control', () => {
      const horizontal = shadowControls.find((c) => c.id === 'horizontal');
      expect(horizontal).toBeDefined();
      expect(horizontal.min).toBe(-100);
      expect(horizontal.max).toBe(100);
      expect(horizontal.category).toBe('shadow');
    });

    it('should have vertical control', () => {
      const vertical = shadowControls.find((c) => c.id === 'vertical');
      expect(vertical).toBeDefined();
      expect(vertical.min).toBe(-100);
      expect(vertical.max).toBe(100);
    });

    it('should have blur control', () => {
      const blur = shadowControls.find((c) => c.id === 'blur');
      expect(blur).toBeDefined();
      expect(blur.min).toBe(0);
      expect(blur.max).toBe(100);
    });

    it('should have spread control', () => {
      const spread = shadowControls.find((c) => c.id === 'spread');
      expect(spread).toBeDefined();
      expect(spread.min).toBe(-100);
      expect(spread.max).toBe(100);
    });

    it('should have color control with type color', () => {
      const color = shadowControls.find((c) => c.id === 'color');
      expect(color).toBeDefined();
      expect(color.type).toBe('color');
    });

    it('should have opacity control', () => {
      const opacity = shadowControls.find((c) => c.id === 'opacity');
      expect(opacity).toBeDefined();
      expect(opacity.min).toBe(0);
      expect(opacity.max).toBe(100);
    });

    it('should have inset control with type checkbox', () => {
      const inset = shadowControls.find((c) => c.id === 'inset');
      expect(inset).toBeDefined();
      expect(inset.type).toBe('checkbox');
    });

    it('should have borderRadius control in shape category', () => {
      const borderRadius = shadowControls.find((c) => c.id === 'borderRadius');
      expect(borderRadius).toBeDefined();
      expect(borderRadius.category).toBe('shape');
    });

    it('should have all shadow controls in shadow category', () => {
      const shadowCtrls = shadowControls.filter((c) => c.category === 'shadow');
      expect(shadowCtrls).toHaveLength(7);
    });

    it('should have all shape controls in shape category', () => {
      const shapeCtrls = shadowControls.filter((c) => c.category === 'shape');
      expect(shapeCtrls).toHaveLength(1);
    });
  });
});
