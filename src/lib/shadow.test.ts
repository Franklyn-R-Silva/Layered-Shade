/**
 * shadow.test.ts
 * Pure-logic tests ported from the original ShadowModel suite.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  createInitialState,
  update,
  reset,
  addLayer,
  removeLayer,
  selectLayer,
  addBackgroundLayer,
  removeBackgroundLayer,
  selectBackgroundLayer,
  getCSS,
  getBackgroundCSS,
  getBackgroundCSSForLayer,
  getDart,
  getTailwind,
  getLayerDart,
  getLayerTailwind,
  hexToRgba,
  hexToColorObj,
  rgbaToHex,
} from './shadow';
import type { BackgroundLayer, ShadowState } from './types';

describe('shadow (pure logic)', () => {
  let s: ShadowState;

  beforeEach(() => {
    s = createInitialState();
  });

  describe('initial state', () => {
    it('should initialize with one default layer', () => {
      expect(s.layers).toHaveLength(1);
      expect(s.currentLayerIndex).toBe(0);
    });

    it('should have correct default layer values', () => {
      const layer = s.layers[0];
      expect(layer.horizontal).toBe(5);
      expect(layer.vertical).toBe(5);
      expect(layer.blur).toBe(10);
      expect(layer.spread).toBe(3);
      expect(layer.color).toBe('#000000');
      expect(layer.opacity).toBe(0.2);
      expect(layer.inset).toBe(false);
    });

    it('should have correct default box properties', () => {
      expect(s.boxProperties.borderRadius).toBe(0);
      expect(s.boxProperties.backgroundColor).toBe('#ffdd00');
      expect(s.boxProperties.canvasColor).toBe('#ffffff');
    });

    it('should initialize with empty background layers', () => {
      expect(s.backgroundLayers).toHaveLength(0);
      expect(s.currentBgLayerIndex).toBe(-1);
    });
  });

  describe('update', () => {
    it('should update layer properties', () => {
      update(s, 'horizontal', 10);
      update(s, 'vertical', 15);
      update(s, 'blur', 20);
      update(s, 'spread', 5);

      const layer = s.layers[0];
      expect(layer.horizontal).toBe(10);
      expect(layer.vertical).toBe(15);
      expect(layer.blur).toBe(20);
      expect(layer.spread).toBe(5);
    });

    it('should update box properties', () => {
      update(s, 'borderRadius', 15);
      update(s, 'backgroundColor', '#ff0000');
      update(s, 'canvasColor', '#333333');

      expect(s.boxProperties.borderRadius).toBe(15);
      expect(s.boxProperties.backgroundColor).toBe('#ff0000');
      expect(s.boxProperties.canvasColor).toBe('#333333');
    });

    it('should update opacity correctly', () => {
      update(s, 'opacity', 0.75);
      expect(s.layers[0].opacity).toBe(0.75);
    });

    it('should update inset property', () => {
      update(s, 'inset', true);
      expect(s.layers[0].inset).toBe(true);
    });

    it('should update color property', () => {
      update(s, 'color', '#ff5500');
      expect(s.layers[0].color).toBe('#ff5500');
    });
  });

  describe('reset', () => {
    it('should reset layers to default', () => {
      update(s, 'horizontal', 100);
      addLayer(s);
      addLayer(s);

      reset(s);

      expect(s.layers).toHaveLength(1);
      expect(s.currentLayerIndex).toBe(0);
      expect(s.layers[0].horizontal).toBe(5);
    });

    it('should reset box properties', () => {
      update(s, 'borderRadius', 50);
      update(s, 'backgroundColor', '#123456');

      reset(s);

      expect(s.boxProperties.borderRadius).toBe(0);
      expect(s.boxProperties.backgroundColor).toBe('#ffdd00');
      expect(s.boxProperties.canvasColor).toBe('#ffffff');
    });

    it('should clear background layers', () => {
      addBackgroundLayer(s, 'linear');
      addBackgroundLayer(s, 'radial');

      reset(s);

      expect(s.backgroundLayers).toHaveLength(0);
      expect(s.currentBgLayerIndex).toBe(-1);
    });

    // Regression: reset() must restore the same opacity as the initial state.
    it('should restore the same opacity as the initial state', () => {
      const initialOpacity = createInitialState().layers[0].opacity;
      update(s, 'opacity', 0.9);
      reset(s);
      expect(s.layers[0].opacity).toBe(initialOpacity);
    });
  });

  describe('addLayer', () => {
    it('should add a new layer', () => {
      addLayer(s);
      expect(s.layers).toHaveLength(2);
    });

    it('should select the new layer', () => {
      addLayer(s);
      expect(s.currentLayerIndex).toBe(1);
    });

    it('should add default values to new layer', () => {
      addLayer(s);
      const newLayer = s.layers[1];
      expect(newLayer.horizontal).toBe(5);
      expect(newLayer.blur).toBe(10);
    });
  });

  describe('removeLayer', () => {
    it('should remove layer at index', () => {
      addLayer(s);
      addLayer(s);
      expect(s.layers).toHaveLength(3);

      removeLayer(s, 1);
      expect(s.layers).toHaveLength(2);
    });

    it('should not remove if only one layer', () => {
      removeLayer(s, 0);
      expect(s.layers).toHaveLength(1);
    });

    it('should adjust currentLayerIndex if needed', () => {
      addLayer(s);
      addLayer(s);
      selectLayer(s, 2);

      removeLayer(s, 2);
      expect(s.currentLayerIndex).toBe(1);
    });
  });

  describe('selectLayer', () => {
    it('should select valid layer index', () => {
      addLayer(s);
      addLayer(s);

      selectLayer(s, 1);
      expect(s.currentLayerIndex).toBe(1);
    });

    it('should not select invalid index', () => {
      selectLayer(s, 99);
      expect(s.currentLayerIndex).toBe(0);

      selectLayer(s, -1);
      expect(s.currentLayerIndex).toBe(0);
    });
  });

  describe('addBackgroundLayer', () => {
    it('should add linear gradient layer by default', () => {
      addBackgroundLayer(s);
      expect(s.backgroundLayers).toHaveLength(1);
      expect(s.backgroundLayers[0].type).toBe('linear');
    });

    it('should add radial gradient layer', () => {
      addBackgroundLayer(s, 'radial');
      expect(s.backgroundLayers[0].type).toBe('radial');
    });

    it('should have default stops', () => {
      addBackgroundLayer(s);
      expect(s.backgroundLayers[0].stops).toHaveLength(2);
    });

    it('should select the new background layer', () => {
      addBackgroundLayer(s);
      expect(s.currentBgLayerIndex).toBe(0);
    });
  });

  describe('removeBackgroundLayer', () => {
    it('should remove background layer', () => {
      addBackgroundLayer(s);
      addBackgroundLayer(s);

      removeBackgroundLayer(s, 0);
      expect(s.backgroundLayers).toHaveLength(1);
    });

    it('should adjust currentBgLayerIndex', () => {
      addBackgroundLayer(s);
      addBackgroundLayer(s);

      removeBackgroundLayer(s, 0);
      expect(s.currentBgLayerIndex).toBe(0);
    });
  });

  describe('selectBackgroundLayer', () => {
    it('should select background layer', () => {
      addBackgroundLayer(s);
      addBackgroundLayer(s);

      selectBackgroundLayer(s, 0);
      expect(s.currentBgLayerIndex).toBe(0);
    });
  });

  describe('getCSS', () => {
    it('should generate valid CSS shadow string', () => {
      const css = getCSS(s);
      expect(css).toContain('px');
      expect(css).toContain('rgba');
    });

    it('should include inset when set', () => {
      update(s, 'inset', true);
      expect(getCSS(s)).toContain('inset');
    });

    it('should combine multiple layers with comma', () => {
      addLayer(s);
      expect(getCSS(s)).toContain(', ');
    });

    it('should use correct opacity in rgba', () => {
      update(s, 'opacity', 0.5);
      update(s, 'color', '#000000');
      expect(getCSS(s)).toContain('rgba(0, 0, 0, 0.5)');
    });
  });

  describe('getBackgroundCSS', () => {
    it('should return solid color when no gradient layers', () => {
      expect(getBackgroundCSS(s)).toBe('#ffdd00');
    });

    it('should generate linear gradient CSS', () => {
      addBackgroundLayer(s, 'linear');
      expect(getBackgroundCSS(s)).toContain('linear-gradient');
    });

    it('should generate radial gradient CSS', () => {
      addBackgroundLayer(s, 'radial');
      expect(getBackgroundCSS(s)).toContain('radial-gradient');
    });

    it('should include base color with gradients', () => {
      addBackgroundLayer(s, 'linear');
      expect(getBackgroundCSS(s)).toContain('#ffdd00');
    });

    it('should generate radial gradient with custom size', () => {
      addBackgroundLayer(s, 'radial');
      s.backgroundLayers[0].size = 'closest-side';
      const bgCSS = getBackgroundCSS(s);
      expect(bgCSS).toContain('radial-gradient');
      expect(bgCSS).toContain('closest-side');
    });

    it('should generate radial gradient with custom position', () => {
      addBackgroundLayer(s, 'radial');
      s.backgroundLayers[0].posX = 25;
      s.backgroundLayers[0].posY = 75;
      const bgCSS = getBackgroundCSS(s);
      expect(bgCSS).toContain('25%');
      expect(bgCSS).toContain('75%');
    });

    it('should combine multiple gradient layers', () => {
      addBackgroundLayer(s, 'linear');
      addBackgroundLayer(s, 'radial');
      const bgCSS = getBackgroundCSS(s);
      expect(bgCSS).toContain('linear-gradient');
      expect(bgCSS).toContain('radial-gradient');
      expect(bgCSS).toContain('#ffdd00');
    });

    // Regression: generation must not mutate stop order.
    it('should not mutate the order of layer.stops', () => {
      addBackgroundLayer(s, 'linear');
      s.backgroundLayers[0].stops = [
        { color: '#ff0000', position: 80 },
        { color: '#00ff00', position: 10 },
        { color: '#0000ff', position: 40 },
      ];
      const before = s.backgroundLayers[0].stops.map((x) => x.position);

      getBackgroundCSS(s);
      getBackgroundCSS(s);

      const after = s.backgroundLayers[0].stops.map((x) => x.position);
      expect(after).toEqual(before);
    });

    it('getBackgroundCSSForLayer should not mutate stop order', () => {
      const layer: BackgroundLayer = {
        type: 'linear',
        angle: 90,
        shape: 'circle',
        opacity: 1,
        stops: [
          { color: '#ffffff', position: 100 },
          { color: '#000000', position: 0 },
        ],
      };
      const before = layer.stops.map((x) => x.position);
      getBackgroundCSSForLayer(layer);
      expect(layer.stops.map((x) => x.position)).toEqual(before);
    });
  });

  describe('getDart', () => {
    it('should generate valid Dart code', () => {
      const dart = getDart(s);
      expect(dart).toContain('BoxShadow');
      expect(dart).toContain('color:');
      expect(dart).toContain('offset:');
    });

    it('should include borderRadius when set', () => {
      update(s, 'borderRadius', 10);
      const dart = getDart(s);
      expect(dart).toContain('borderRadius');
      expect(dart).toContain('10');
    });

    it('should include inset comment when inset is true', () => {
      update(s, 'inset', true);
      expect(getDart(s)).toContain('inset');
    });

    it('should handle multiple layers', () => {
      addLayer(s);
      expect(getDart(s).match(/BoxShadow\(/g)).toHaveLength(2);
    });

    it('should include gradient when background layers exist', () => {
      update(s, 'borderRadius', 10);
      addBackgroundLayer(s, 'linear');
      const dart = getDart(s);
      expect(dart).toContain('gradient:');
      expect(dart).toContain('LinearGradient');
      expect(dart).toContain('BoxDecoration');
    });

    it('should include radial gradient in Dart', () => {
      update(s, 'borderRadius', 5);
      addBackgroundLayer(s, 'radial');
      expect(getDart(s)).toContain('RadialGradient');
    });

    it('should output BoxDecoration with boxShadow array', () => {
      update(s, 'borderRadius', 0);
      s.backgroundLayers = [];
      const dart = getDart(s);
      expect(dart).toContain('boxShadow: [');
      expect(dart).toContain('BoxDecoration');
    });

    it('should output solid color in Dart when no gradient layers', () => {
      update(s, 'borderRadius', 10);
      expect(getDart(s)).toContain('color: Color(0xFFFFDD00)');
    });
  });

  describe('getTailwind', () => {
    it('should generate shadow arbitrary value', () => {
      const tw = getTailwind(s);
      expect(tw).toContain('shadow-[');
      expect(tw).toContain(']');
    });

    it('should generate background arbitrary value', () => {
      expect(getTailwind(s)).toContain('bg-[');
    });

    it('should replace spaces with underscores', () => {
      expect(getTailwind(s)).not.toMatch(/shadow-\[[^\]]*\s[^\]]*\]/);
    });

    it('should not contain backslashes (escaping regression)', () => {
      addBackgroundLayer(s, 'radial');
      expect(getTailwind(s)).not.toContain('\\');
    });

    it('should keep rgba() intact with no internal spaces (shadow regression)', () => {
      update(s, 'color', '#ff0000');
      update(s, 'opacity', 0.5);
      const tw = getTailwind(s);
      expect(tw).toContain('rgba(');
      expect(tw).not.toMatch(/\[[^\]]*\s[^\]]*\]/);
    });

    it('should preserve gradient parentheses in bg token', () => {
      addBackgroundLayer(s, 'linear');
      expect(getTailwind(s)).toContain('linear-gradient(');
    });
  });

  describe('hexToRgba', () => {
    it('should convert hex to rgba', () => {
      expect(hexToRgba('#ff0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
    });

    it('should handle shorthand hex', () => {
      expect(hexToRgba('#f00', 1)).toBe('rgba(255, 0, 0, 1)');
    });

    it('should handle hex without hash', () => {
      expect(hexToRgba('00ff00', 0.8)).toBe('rgba(0, 255, 0, 0.8)');
    });

    it('should return fallback for invalid hex', () => {
      expect(hexToRgba('invalid', 0.5)).toBe('rgba(0,0,0,0.5)');
    });
  });

  describe('hexToColorObj', () => {
    it('should convert hex to uppercase object', () => {
      expect(hexToColorObj('#aabbcc').hex).toBe('AABBCC');
    });

    it('should expand shorthand hex', () => {
      expect(hexToColorObj('#abc').hex).toBe('AABBCC');
    });

    it('should handle hex without hash', () => {
      expect(hexToColorObj('ff0000').hex).toBe('FF0000');
    });
  });

  describe('rgbaToHex', () => {
    it('should return fallback (basic implementation)', () => {
      expect(rgbaToHex('rgba(255, 0, 0, 1)')).toBe('#000000');
    });
  });

  describe('getLayerDart', () => {
    it('should generate LinearGradient code', () => {
      addBackgroundLayer(s, 'linear');
      const dart = getLayerDart(s.backgroundLayers[0]);
      expect(dart).toContain('LinearGradient');
      expect(dart).toContain('colors');
      expect(dart).toContain('stops');
    });

    it('should generate RadialGradient code', () => {
      addBackgroundLayer(s, 'radial');
      const dart = getLayerDart(s.backgroundLayers[0]);
      expect(dart).toContain('RadialGradient');
      expect(dart).toContain('center');
    });
  });

  describe('getLayerTailwind', () => {
    it('should generate Tailwind arbitrary gradient class', () => {
      addBackgroundLayer(s, 'linear');
      const tw = getLayerTailwind(s.backgroundLayers[0]);
      expect(tw).toContain('bg-[');
      expect(tw).toContain('linear-gradient');
    });
  });

  describe('getBackgroundCSSForLayer', () => {
    it('should generate CSS for linear gradient layer', () => {
      addBackgroundLayer(s, 'linear');
      const css = getBackgroundCSSForLayer(s.backgroundLayers[0]);
      expect(css).toContain('linear-gradient');
      expect(css).toContain('deg');
    });

    it('should generate CSS for radial gradient layer', () => {
      addBackgroundLayer(s, 'radial');
      expect(getBackgroundCSSForLayer(s.backgroundLayers[0])).toContain('radial-gradient');
    });
  });

  describe('update (background layer properties)', () => {
    beforeEach(() => {
      addBackgroundLayer(s, 'linear');
    });

    it('should update bgLayerAngle', () => {
      update(s, 'bgLayerAngle', 45);
      expect(s.backgroundLayers[0].angle).toBe(45);
    });

    it('should update bgLayerType', () => {
      update(s, 'bgLayerType', 'radial');
      expect(s.backgroundLayers[0].type).toBe('radial');
    });

    it('should update bgLayerStops', () => {
      const newStops = [
        { color: '#ff0000', position: 0 },
        { color: '#00ff00', position: 100 },
      ];
      update(s, 'bgLayerStops', newStops);
      expect(s.backgroundLayers[0].stops).toEqual(newStops);
    });
  });
});
