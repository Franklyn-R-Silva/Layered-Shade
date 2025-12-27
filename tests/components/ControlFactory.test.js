/**
 * ControlFactory.test.js
 * Tests for ControlFactory component
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { ControlFactory } from '../../js/components/ControlFactory.js';

describe('ControlFactory', () => {
  describe('createRangeControl', () => {
    it('should create a container element', () => {
      const config = {
        id: 'test',
        label: 'Test Label',
        min: 0,
        max: 100,
        value: 50,
      };

      const container = ControlFactory.createRangeControl(config);
      expect(container).toBeDefined();
      expect(container.tagName).toBe('DIV');
      expect(container.className).toBe('form-control');
    });

    it('should include a label', () => {
      const config = {
        id: 'blur',
        label: 'Desfoque',
        min: 0,
        max: 100,
        value: 10,
      };

      const container = ControlFactory.createRangeControl(config);
      const label = container.querySelector('label');
      expect(label).toBeDefined();
      expect(label.textContent).toBe('Desfoque');
      expect(label.getAttribute('for')).toBe('blur');
    });

    it('should include range input with correct attributes', () => {
      const config = {
        id: 'horizontal',
        label: 'Horizontal',
        min: -100,
        max: 100,
        value: 5,
      };

      const container = ControlFactory.createRangeControl(config);
      const input = container.querySelector('input[type="range"]');
      expect(input).toBeDefined();
      expect(input.id).toBe('horizontal');
      expect(input.min).toBe('-100');
      expect(input.max).toBe('100');
      expect(input.value).toBe('5');
    });

    it('should include text input for value display', () => {
      const config = {
        id: 'spread',
        label: 'Spread',
        min: -100,
        max: 100,
        value: 3,
      };

      const container = ControlFactory.createRangeControl(config);
      const textInput = container.querySelector('input[type="text"]');
      expect(textInput).toBeDefined();
      expect(textInput.id).toBe('spread-value');
    });

    it('should include px unit for non-color inputs', () => {
      const config = {
        id: 'blur',
        label: 'Blur',
        min: 0,
        max: 100,
        value: 10,
      };

      const container = ControlFactory.createRangeControl(config);
      const unit = container.querySelector('.unit');
      expect(unit).toBeDefined();
      expect(unit.textContent).toBe('px');
    });

    it('should create color input when type is color', () => {
      const config = {
        id: 'color',
        label: 'Cor',
        type: 'color',
        value: '#ff0000',
      };

      const container = ControlFactory.createRangeControl(config);
      const colorInput = container.querySelector('input[type="color"]');
      expect(colorInput).toBeDefined();
      expect(colorInput.value).toBe('#ff0000');
    });

    it('should not include px unit for color inputs', () => {
      const config = {
        id: 'color',
        label: 'Cor',
        type: 'color',
      };

      const container = ControlFactory.createRangeControl(config);
      const unit = container.querySelector('.unit');
      expect(unit).toBeNull();
    });

    it('should use default value for color when not provided', () => {
      const config = {
        id: 'color',
        label: 'Cor',
        type: 'color',
      };

      const container = ControlFactory.createRangeControl(config);
      const colorInput = container.querySelector('input[type="color"]');
      expect(colorInput.value).toBe('#000000');
    });
  });

  describe('createCheckboxControl', () => {
    it('should create a checkbox container', () => {
      const config = {
        id: 'inset',
        label: 'Inset',
      };

      const container = ControlFactory.createCheckboxControl(config);
      expect(container).toBeDefined();
      expect(container.className).toContain('checkbox-control');
    });

    it('should include checkbox input', () => {
      const config = {
        id: 'inset',
        label: 'Sombra Interna',
      };

      const container = ControlFactory.createCheckboxControl(config);
      const checkbox = container.querySelector('input[type="checkbox"]');
      expect(checkbox).toBeDefined();
      expect(checkbox.id).toBe('inset');
    });

    it('should include label', () => {
      const config = {
        id: 'inset',
        label: 'Sombra Interna',
      };

      const container = ControlFactory.createCheckboxControl(config);
      const label = container.querySelector('label');
      expect(label.textContent).toBe('Sombra Interna');
    });

    it('should set checked attribute when true', () => {
      const config = {
        id: 'inset',
        label: 'Inset',
        checked: true,
      };

      const container = ControlFactory.createCheckboxControl(config);
      const checkbox = container.querySelector('input[type="checkbox"]');
      expect(checkbox.checked).toBe(true);
    });

    it('should not set checked attribute when false', () => {
      const config = {
        id: 'inset',
        label: 'Inset',
        checked: false,
      };

      const container = ControlFactory.createCheckboxControl(config);
      const checkbox = container.querySelector('input[type="checkbox"]');
      expect(checkbox.checked).toBe(false);
    });

    it('should have checkmark class', () => {
      const config = {
        id: 'inset',
        label: 'Inset',
      };

      const container = ControlFactory.createCheckboxControl(config);
      const checkbox = container.querySelector('input[type="checkbox"]');
      expect(checkbox.className).toContain('checkmark');
    });
  });
});
