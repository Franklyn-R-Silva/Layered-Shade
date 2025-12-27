/**
 * ShadowModel.test.js
 * Unit tests for ShadowModel class
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { ShadowModel } from '../../js/model/ShadowModel.js';

describe('ShadowModel', () => {
  let model;

  beforeEach(() => {
    model = new ShadowModel();
  });

  // ============================================
  // CONSTRUCTOR & INITIAL STATE
  // ============================================
  describe('constructor', () => {
    it('should initialize with default layer state', () => {
      expect(model.layers).toHaveLength(1);
      expect(model.currentLayerIndex).toBe(0);
    });

    it('should have correct default layer values', () => {
      const layer = model.layers[0];
      expect(layer.horizontal).toBe(5);
      expect(layer.vertical).toBe(5);
      expect(layer.blur).toBe(10);
      expect(layer.spread).toBe(3);
      expect(layer.color).toBe('#000000');
      expect(layer.opacity).toBe(0.2);
      expect(layer.inset).toBe(false);
    });

    it('should have correct default box properties', () => {
      expect(model.boxProperties.borderRadius).toBe(0);
      expect(model.boxProperties.backgroundColor).toBe('#ffdd00');
      expect(model.boxProperties.canvasColor).toBe('#ffffff');
    });

    it('should initialize with empty background layers', () => {
      expect(model.backgroundLayers).toHaveLength(0);
      expect(model.currentBgLayerIndex).toBe(-1);
    });
  });

  // ============================================
  // getState()
  // ============================================
  describe('getState', () => {
    it('should return combined state object', () => {
      const state = model.getState();

      expect(state).toHaveProperty('horizontal');
      expect(state).toHaveProperty('vertical');
      expect(state).toHaveProperty('blur');
      expect(state).toHaveProperty('spread');
      expect(state).toHaveProperty('color');
      expect(state).toHaveProperty('opacity');
      expect(state).toHaveProperty('inset');
      expect(state).toHaveProperty('borderRadius');
      expect(state).toHaveProperty('backgroundColor');
      expect(state).toHaveProperty('canvasColor');
      expect(state).toHaveProperty('layerCount');
      expect(state).toHaveProperty('currentLayerIndex');
    });

    it('should return correct layer count', () => {
      expect(model.getState().layerCount).toBe(1);
      model.addLayer();
      expect(model.getState().layerCount).toBe(2);
    });
  });

  // ============================================
  // update()
  // ============================================
  describe('update', () => {
    it('should update layer properties', () => {
      model.update('horizontal', 10);
      model.update('vertical', 15);
      model.update('blur', 20);
      model.update('spread', 5);

      const layer = model.layers[0];
      expect(layer.horizontal).toBe(10);
      expect(layer.vertical).toBe(15);
      expect(layer.blur).toBe(20);
      expect(layer.spread).toBe(5);
    });

    it('should update box properties', () => {
      model.update('borderRadius', 15);
      model.update('backgroundColor', '#ff0000');
      model.update('canvasColor', '#333333');

      expect(model.boxProperties.borderRadius).toBe(15);
      expect(model.boxProperties.backgroundColor).toBe('#ff0000');
      expect(model.boxProperties.canvasColor).toBe('#333333');
    });

    it('should update opacity correctly', () => {
      model.update('opacity', 0.75);
      expect(model.layers[0].opacity).toBe(0.75);
    });

    it('should update inset property', () => {
      model.update('inset', true);
      expect(model.layers[0].inset).toBe(true);
    });

    it('should update color property', () => {
      model.update('color', '#ff5500');
      expect(model.layers[0].color).toBe('#ff5500');
    });
  });

  // ============================================
  // reset()
  // ============================================
  describe('reset', () => {
    it('should reset layers to default', () => {
      model.update('horizontal', 100);
      model.addLayer();
      model.addLayer();

      model.reset();

      expect(model.layers).toHaveLength(1);
      expect(model.currentLayerIndex).toBe(0);
      expect(model.layers[0].horizontal).toBe(5);
    });

    it('should reset box properties', () => {
      model.update('borderRadius', 50);
      model.update('backgroundColor', '#123456');

      model.reset();

      expect(model.boxProperties.borderRadius).toBe(0);
      expect(model.boxProperties.backgroundColor).toBe('#ffdd00');
      expect(model.boxProperties.canvasColor).toBe('#ffffff');
    });

    it('should clear background layers', () => {
      model.addBackgroundLayer('linear');
      model.addBackgroundLayer('radial');

      model.reset();

      expect(model.backgroundLayers).toHaveLength(0);
      expect(model.currentBgLayerIndex).toBe(-1);
    });
  });

  // ============================================
  // SHADOW LAYER MANAGEMENT
  // ============================================
  describe('addLayer', () => {
    it('should add a new layer', () => {
      model.addLayer();
      expect(model.layers).toHaveLength(2);
    });

    it('should select the new layer', () => {
      model.addLayer();
      expect(model.currentLayerIndex).toBe(1);
    });

    it('should add default values to new layer', () => {
      model.addLayer();
      const newLayer = model.layers[1];
      expect(newLayer.horizontal).toBe(5);
      expect(newLayer.blur).toBe(10);
    });
  });

  describe('removeLayer', () => {
    it('should remove layer at index', () => {
      model.addLayer();
      model.addLayer();
      expect(model.layers).toHaveLength(3);

      model.removeLayer(1);
      expect(model.layers).toHaveLength(2);
    });

    it('should not remove if only one layer', () => {
      model.removeLayer(0);
      expect(model.layers).toHaveLength(1);
    });

    it('should adjust currentLayerIndex if needed', () => {
      model.addLayer();
      model.addLayer();
      model.selectLayer(2);

      model.removeLayer(2);
      expect(model.currentLayerIndex).toBe(1);
    });
  });

  describe('selectLayer', () => {
    it('should select valid layer index', () => {
      model.addLayer();
      model.addLayer();

      model.selectLayer(1);
      expect(model.currentLayerIndex).toBe(1);
    });

    it('should not select invalid index', () => {
      model.selectLayer(99);
      expect(model.currentLayerIndex).toBe(0);

      model.selectLayer(-1);
      expect(model.currentLayerIndex).toBe(0);
    });
  });

  // ============================================
  // BACKGROUND LAYER MANAGEMENT
  // ============================================
  describe('addBackgroundLayer', () => {
    it('should add linear gradient layer by default', () => {
      model.addBackgroundLayer();
      expect(model.backgroundLayers).toHaveLength(1);
      expect(model.backgroundLayers[0].type).toBe('linear');
    });

    it('should add radial gradient layer', () => {
      model.addBackgroundLayer('radial');
      expect(model.backgroundLayers[0].type).toBe('radial');
    });

    it('should have default stops', () => {
      model.addBackgroundLayer();
      expect(model.backgroundLayers[0].stops).toHaveLength(2);
    });

    it('should select the new background layer', () => {
      model.addBackgroundLayer();
      expect(model.currentBgLayerIndex).toBe(0);
    });
  });

  describe('removeBackgroundLayer', () => {
    it('should remove background layer', () => {
      model.addBackgroundLayer();
      model.addBackgroundLayer();

      model.removeBackgroundLayer(0);
      expect(model.backgroundLayers).toHaveLength(1);
    });

    it('should adjust currentBgLayerIndex', () => {
      model.addBackgroundLayer();
      model.addBackgroundLayer();

      model.removeBackgroundLayer(0);
      expect(model.currentBgLayerIndex).toBe(0);
    });
  });

  describe('selectBackgroundLayer', () => {
    it('should select background layer', () => {
      model.addBackgroundLayer();
      model.addBackgroundLayer();

      model.selectBackgroundLayer(0);
      expect(model.currentBgLayerIndex).toBe(0);
    });
  });

  // ============================================
  // CSS GENERATION
  // ============================================
  describe('getCSS', () => {
    it('should generate valid CSS shadow string', () => {
      const css = model.getCSS();
      expect(css).toContain('px');
      expect(css).toContain('rgba');
    });

    it('should include inset when set', () => {
      model.update('inset', true);
      const css = model.getCSS();
      expect(css).toContain('inset');
    });

    it('should combine multiple layers with comma', () => {
      model.addLayer();
      const css = model.getCSS();
      expect(css).toContain(', ');
    });

    it('should use correct opacity in rgba', () => {
      model.update('opacity', 0.5);
      model.update('color', '#000000');
      const css = model.getCSS();
      expect(css).toContain('rgba(0, 0, 0, 0.5)');
    });
  });

  describe('getBackgroundCSS', () => {
    it('should return solid color when no gradient layers', () => {
      const bgCSS = model.getBackgroundCSS();
      expect(bgCSS).toBe('#ffdd00');
    });

    it('should generate linear gradient CSS', () => {
      model.addBackgroundLayer('linear');
      const bgCSS = model.getBackgroundCSS();
      expect(bgCSS).toContain('linear-gradient');
    });

    it('should generate radial gradient CSS', () => {
      model.addBackgroundLayer('radial');
      const bgCSS = model.getBackgroundCSS();
      expect(bgCSS).toContain('radial-gradient');
    });

    it('should include base color with gradients', () => {
      model.addBackgroundLayer('linear');
      const bgCSS = model.getBackgroundCSS();
      expect(bgCSS).toContain('#ffdd00');
    });

    it('should generate radial gradient with custom size', () => {
      model.addBackgroundLayer('radial');
      model.backgroundLayers[0].size = 'closest-side';
      const bgCSS = model.getBackgroundCSS();
      expect(bgCSS).toContain('radial-gradient');
      expect(bgCSS).toContain('closest-side');
    });

    it('should generate radial gradient with custom position', () => {
      model.addBackgroundLayer('radial');
      model.backgroundLayers[0].posX = 25;
      model.backgroundLayers[0].posY = 75;
      const bgCSS = model.getBackgroundCSS();
      expect(bgCSS).toContain('25%');
      expect(bgCSS).toContain('75%');
    });

    it('should combine multiple gradient layers', () => {
      model.addBackgroundLayer('linear');
      model.addBackgroundLayer('radial');
      const bgCSS = model.getBackgroundCSS();
      expect(bgCSS).toContain('linear-gradient');
      expect(bgCSS).toContain('radial-gradient');
      expect(bgCSS).toContain('#ffdd00');
    });
  });

  // ============================================
  // DART CODE GENERATION
  // ============================================
  describe('getDart', () => {
    it('should generate valid Dart code', () => {
      const dart = model.getDart();
      expect(dart).toContain('BoxShadow');
      expect(dart).toContain('color:');
      expect(dart).toContain('offset:');
    });

    it('should include borderRadius when set', () => {
      model.update('borderRadius', 10);
      const dart = model.getDart();
      expect(dart).toContain('borderRadius');
      expect(dart).toContain('10');
    });

    it('should include inset comment when inset is true', () => {
      model.update('inset', true);
      const dart = model.getDart();
      expect(dart).toContain('inset');
    });

    it('should handle multiple layers', () => {
      model.addLayer();
      const dart = model.getDart();
      expect(dart.match(/BoxShadow\(/g)).toHaveLength(2);
    });

    it('should include gradient when background layers exist', () => {
      model.update('borderRadius', 10);
      model.addBackgroundLayer('linear');
      const dart = model.getDart();
      expect(dart).toContain('gradient:');
      expect(dart).toContain('LinearGradient');
      expect(dart).toContain('BoxDecoration');
    });

    it('should include radial gradient in Dart', () => {
      model.update('borderRadius', 5);
      model.addBackgroundLayer('radial');
      const dart = model.getDart();
      expect(dart).toContain('RadialGradient');
    });

    it('should output BoxDecoration with boxShadow array', () => {
      model.update('borderRadius', 0);
      model.backgroundLayers = [];
      const dart = model.getDart();
      expect(dart).toContain('boxShadow: [');
      expect(dart).toContain('BoxDecoration');
    });

    it('should output solid color in Dart when no gradient layers', () => {
      model.update('borderRadius', 10);
      const dart = model.getDart();
      expect(dart).toContain('color: Color(0xFFFFDD00)');
    });
  });

  // ============================================
  // TAILWIND CODE GENERATION
  // ============================================
  describe('getTailwind', () => {
    it('should generate shadow arbitrary value', () => {
      const tw = model.getTailwind();
      expect(tw).toContain('shadow-[');
      expect(tw).toContain(']');
    });

    it('should generate background arbitrary value', () => {
      const tw = model.getTailwind();
      expect(tw).toContain('bg-[');
    });

    it('should replace spaces with underscores', () => {
      const tw = model.getTailwind();
      expect(tw).not.toMatch(/shadow-\[[^\]]*\s[^\]]*\]/);
    });
  });

  // ============================================
  // HELPER METHODS
  // ============================================
  describe('hexToRgba', () => {
    it('should convert hex to rgba', () => {
      const rgba = model.hexToRgba('#ff0000', 0.5);
      expect(rgba).toBe('rgba(255, 0, 0, 0.5)');
    });

    it('should handle shorthand hex', () => {
      const rgba = model.hexToRgba('#f00', 1);
      expect(rgba).toBe('rgba(255, 0, 0, 1)');
    });

    it('should handle hex without hash', () => {
      const rgba = model.hexToRgba('00ff00', 0.8);
      expect(rgba).toBe('rgba(0, 255, 0, 0.8)');
    });

    it('should return fallback for invalid hex', () => {
      const rgba = model.hexToRgba('invalid', 0.5);
      expect(rgba).toBe('rgba(0,0,0,0.5)');
    });
  });

  describe('hexToColorObj', () => {
    it('should convert hex to uppercase object', () => {
      const obj = model.hexToColorObj('#aabbcc');
      expect(obj.hex).toBe('AABBCC');
    });

    it('should expand shorthand hex', () => {
      const obj = model.hexToColorObj('#abc');
      expect(obj.hex).toBe('AABBCC');
    });

    it('should handle hex without hash', () => {
      const obj = model.hexToColorObj('ff0000');
      expect(obj.hex).toBe('FF0000');
    });
  });

  describe('rgbaToHex', () => {
    it('should return fallback (basic implementation)', () => {
      const hex = model.rgbaToHex('rgba(255, 0, 0, 1)');
      expect(hex).toBe('#000000');
    });
  });

  // ============================================
  // GRADIENT LAYER DART GENERATION
  // ============================================
  describe('getLayerDart', () => {
    it('should generate LinearGradient code', () => {
      model.addBackgroundLayer('linear');
      const dart = model.getLayerDart(model.backgroundLayers[0]);
      expect(dart).toContain('LinearGradient');
      expect(dart).toContain('colors');
      expect(dart).toContain('stops');
    });

    it('should generate RadialGradient code', () => {
      model.addBackgroundLayer('radial');
      const dart = model.getLayerDart(model.backgroundLayers[0]);
      expect(dart).toContain('RadialGradient');
      expect(dart).toContain('center');
    });
  });

  // ============================================
  // GRADIENT LAYER TAILWIND GENERATION
  // ============================================
  describe('getLayerTailwind', () => {
    it('should generate Tailwind arbitrary gradient class', () => {
      model.addBackgroundLayer('linear');
      const tw = model.getLayerTailwind(model.backgroundLayers[0]);
      expect(tw).toContain('bg-[');
      expect(tw).toContain('linear-gradient');
    });
  });

  // ============================================
  // BACKGROUND LAYER CSS FOR SINGLE LAYER
  // ============================================
  describe('getBackgroundCSSForLayer', () => {
    it('should generate CSS for linear gradient layer', () => {
      model.addBackgroundLayer('linear');
      const css = model.getBackgroundCSSForLayer(model.backgroundLayers[0]);
      expect(css).toContain('linear-gradient');
      expect(css).toContain('deg');
    });

    it('should generate CSS for radial gradient layer', () => {
      model.addBackgroundLayer('radial');
      const css = model.getBackgroundCSSForLayer(model.backgroundLayers[0]);
      expect(css).toContain('radial-gradient');
    });
  });

  // ============================================
  // BACKGROUND LAYER UPDATES VIA update()
  // ============================================
  describe('update (background layer properties)', () => {
    beforeEach(() => {
      model.addBackgroundLayer('linear');
    });

    it('should update bgLayerAngle', () => {
      model.update('bgLayerAngle', 45);
      expect(model.backgroundLayers[0].angle).toBe(45);
    });

    it('should update bgLayerType', () => {
      model.update('bgLayerType', 'radial');
      expect(model.backgroundLayers[0].type).toBe('radial');
    });

    it('should update bgLayerStops', () => {
      const newStops = [
        { color: '#ff0000', position: 0 },
        { color: '#00ff00', position: 100 },
      ];
      model.update('bgLayerStops', newStops);
      expect(model.backgroundLayers[0].stops).toEqual(newStops);
    });
  });
});
