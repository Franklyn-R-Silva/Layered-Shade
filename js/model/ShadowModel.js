/**
 * ShadowModel.js
 * Responsible for holding the state of the box shadow generator.
 * Implements the Model layer of the MVC pattern.
 *
 * @module ShadowModel
 * @author Franklyn R. Silva
 * @license MIT
 */

/**
 * @typedef {Object} ShadowLayer
 * @property {number} horizontal - X offset in pixels
 * @property {number} vertical - Y offset in pixels
 * @property {number} blur - Blur radius in pixels
 * @property {number} spread - Spread radius in pixels
 * @property {string} color - Hex color value
 * @property {number} opacity - Opacity from 0 to 1
 * @property {boolean} inset - Whether shadow is inset
 */

/**
 * @typedef {Object} GradientStop
 * @property {string} color - Hex color value
 * @property {number} position - Position from 0 to 100
 */

/**
 * @typedef {Object} BackgroundLayer
 * @property {'linear'|'radial'} type - Gradient type
 * @property {number} angle - Angle for linear gradients (degrees)
 * @property {'circle'|'ellipse'} shape - Shape for radial gradients
 * @property {GradientStop[]} stops - Color stops array
 * @property {number} opacity - Layer opacity
 */

/**
 * Model class for the box shadow generator.
 * Manages shadow layers, background gradients, and box properties.
 * Generates CSS, Dart/Flutter, and Tailwind output.
 *
 * @class ShadowModel
 * @example
 * const model = new ShadowModel();
 * model.update('blur', 15);
 * console.log(model.getCSS());
 */
export class ShadowModel {
  /**
   * Creates a new ShadowModel instance with default values.
   * Initializes one shadow layer and no background gradients.
   */
  constructor() {
    /**
     * Default template for a new shadow layer
     * @type {ShadowLayer}
     */
    this.defaultLayerState = {
      horizontal: 5,
      vertical: 5,
      blur: 10,
      spread: 3,
      color: '#000000',
      opacity: 0.5,
      inset: false,
    };

    /**
     * Global box properties
     * @type {Object}
     */
    this.boxProperties = {
      borderRadius: 0,
      backgroundColor: '#ffdd00',
      canvasColor: '#ffffff',
    };

    /**
     * Array of background gradient layers
     * @type {BackgroundLayer[]}
     */
    this.backgroundLayers = [];

    /**
     * Index of currently selected background layer (-1 = base color)
     * @type {number}
     */
    this.currentBgLayerIndex = -1;

    /**
     * Array of shadow layers
     * @type {ShadowLayer[]}
     */
    this.layers = [{ ...this.defaultLayerState, opacity: 0.2 }];

    /**
     * Index of currently selected shadow layer
     * @type {number}
     */
    this.currentLayerIndex = 0;
  }

  /**
   * Returns the full state for View rendering.
   * Combines box properties with current layer properties.
   *
   * @returns {Object} Complete state object for the View
   * @property {number} borderRadius - Border radius in pixels
   * @property {string} backgroundColor - Base background color
   * @property {number} horizontal - Current layer X offset
   * @property {number} vertical - Current layer Y offset
   * @property {number} layerCount - Total number of shadow layers
   * @property {number} currentLayerIndex - Index of selected layer
   */
  getState() {
    const currentLayer = this.layers[this.currentLayerIndex] || this.defaultLayerState;

    return {
      ...this.boxProperties,
      ...currentLayer,
      layerCount: this.layers.length,
      currentLayerIndex: this.currentLayerIndex,
      backgroundLayers: this.backgroundLayers,
      currentBgLayerIndex: this.currentBgLayerIndex,
      currentBgLayer:
        this.currentBgLayerIndex >= 0 ? this.backgroundLayers[this.currentBgLayerIndex] : null,
    };
  }

  /**
   * Updates a property on the current layer or global box properties.
   * Automatically routes to the correct target based on key prefix.
   *
   * @param {string} key - Property name to update
   * @param {*} value - New value for the property
   * @example
   * model.update('blur', 15);         // Shadow property
   * model.update('borderRadius', 10); // Box property
   * model.update('bgLayerAngle', 45); // Background layer property
   */
  update(key, value) {
    if (['borderRadius', 'backgroundColor', 'canvasColor'].includes(key)) {
      this.boxProperties[key] = value;
    } else if (key.startsWith('bgLayer')) {
      // Handle Background Layer Updates
      if (this.currentBgLayerIndex >= 0 && this.backgroundLayers[this.currentBgLayerIndex]) {
        const layer = this.backgroundLayers[this.currentBgLayerIndex];
        const param = key.replace('bgLayer', ''); // e.g. 'Type', 'Angle'
        // Convert to camelCase (e.g. PosX -> posX)
        const prop = param.charAt(0).toLowerCase() + param.slice(1);

        if (prop === 'stops') {
          layer.stops = value;
        } else {
          layer[prop] = value;
        }
      }
    } else {
      // Shadow specific property
      if (key === 'opacity') {
        // value is 0-1
        if (this.layers[this.currentLayerIndex]) {
          this.layers[this.currentLayerIndex][key] = value;
        }
      } else {
        if (this.layers[this.currentLayerIndex]) {
          this.layers[this.currentLayerIndex][key] = value;
        }
      }
    }
  }

  /**
   * Resets the model to default state.
   * Clears all layers and restores default values.
   */
  reset() {
    this.layers = [{ ...this.defaultLayerState, opacity: 0.2 }];
    this.currentLayerIndex = 0;
    this.backgroundLayers = [];
    this.currentBgLayerIndex = -1;
    this.boxProperties = {
      borderRadius: 0,
      backgroundColor: '#ffdd00',
      canvasColor: '#ffffff',
    };
  }

  /**
   * Adds a new shadow layer with default values.
   * Automatically selects the new layer.
   */
  addLayer() {
    this.layers.push({ ...this.defaultLayerState });
    this.currentLayerIndex = this.layers.length - 1;
  }

  /**
   * Removes a shadow layer by index.
   * Maintains at least one layer.
   *
   * @param {number} index - Index of layer to remove
   */
  removeLayer(index) {
    if (this.layers.length <= 1) return;
    this.layers.splice(index, 1);
    if (this.currentLayerIndex >= this.layers.length) {
      this.currentLayerIndex = this.layers.length - 1;
    }
  }

  selectLayer(index) {
    if (index >= 0 && index < this.layers.length) {
      this.currentLayerIndex = index;
    }
  }

  /* Background Layer Management */
  addBackgroundLayer(type = 'linear') {
    this.backgroundLayers.push({
      type: type,
      angle: 90, // for linear
      shape: 'circle', // for radial
      stops: [
        { color: '#ffffff', position: 0 },
        { color: '#000000', position: 100 },
      ],
      opacity: 1,
    });
    this.currentBgLayerIndex = this.backgroundLayers.length - 1;
  }

  removeBackgroundLayer(index) {
    this.backgroundLayers.splice(index, 1);
    this.currentBgLayerIndex = this.backgroundLayers.length > 0 ? 0 : -1;
  }

  selectBackgroundLayer(index) {
    this.currentBgLayerIndex = index;
  }

  /**
   * Helper to get the background CSS value (Layers + Base Color)
   */
  getBackgroundCSS() {
    const layersCSS = this.backgroundLayers.map((layer) => {
      const stopsStr = [...layer.stops]
        .sort((a, b) => a.position - b.position)
        .map((s) => `${s.color} ${s.position}%`)
        .join(', ');

      if (layer.type === 'radial') {
        // Radial position syntax: radial-gradient(shape at position, stops)
        // Default center if not specified
        const posX = layer.posX !== undefined ? layer.posX : 50;
        const posY = layer.posY !== undefined ? layer.posY : 50;
        const size = layer.size || 'farthest-corner';

        // Simplify default size to avoid syntax quirks in some browsers if position is present
        // radial-gradient(circle at 50% 50%, ...) is safest for default
        if (size === 'farthest-corner') {
          return `radial-gradient(${layer.shape || 'circle'} at ${posX}% ${posY}%, ${stopsStr})`;
        }

        return `radial-gradient(${layer.shape || 'circle'} ${size} at ${posX}% ${posY}%, ${stopsStr})`;
      }
      // Linear
      return `linear-gradient(${layer.angle}deg, ${stopsStr})`;
    });

    // Add base color at the end
    if (layersCSS.length > 0) {
      return `${layersCSS.join(', ')}, ${this.boxProperties.backgroundColor}`;
    }
    return this.boxProperties.backgroundColor;
  }

  /**
   * Generates Dart/Flutter code for a specific gradient layer
   */
  getLayerDart(layer) {
    let code = '';
    const sortedStops = [...layer.stops].sort((a, b) => a.position - b.position);

    // Stops and Colors
    const colors = sortedStops
      .map((s) => {
        const c = this.hexToColorObj(s.color.startsWith('#') ? s.color : this.rgbaToHex(s.color));
        // Handle alpha if hexToColorObj doesn't (it currently assumes strict hex) --
        // actually hexToColorObj expects #RRGGBB.
        // If s.color is rgba, we need a better parser.
        // For now assuming input is hex from color picker.
        return `Color(0xFF${c.hex})`;
      })
      .join(',\n      ');

    const stops = sortedStops.map((s) => (s.position / 100).toFixed(2)).join(', ');

    if (layer.type === 'radial') {
      const posX = ((layer.posX !== undefined ? layer.posX : 50) / 100) * 2 - 1; // 0..100 -> -1..1
      const posY = ((layer.posY !== undefined ? layer.posY : 50) / 100) * 2 - 1;

      code += `RadialGradient(\n`;
      code += `    center: Alignment(${posX.toFixed(2)}, ${posY.toFixed(2)}),\n`;
      code += `    radius: 0.5,\n`; // Default radius logic might need a slider, sticking to simple for now
      code += `    colors: [\n      ${colors}\n    ],\n`;
      code += `    stops: [${stops}],\n`;
      code += `  )`;
    } else {
      // Linear
      // This is a rough approximation of CSS angles to Flutter Alignment
      // Real conversion is complex math, but let's stick to standard 4 corners for simplicity or just expose alignment?
      // Only exact 45/90/etc map cleanly.
      // We will produce a generic LinearGradient
      code += `LinearGradient(\n`;
      // TODO: implement angle to alignment conversion if strict accuracy needed
      code += `    begin: Alignment.topLeft,\n`;
      code += `    end: Alignment.bottomRight,\n`;
      code += `    transform: GradientRotation(${((layer.angle * Math.PI) / 180).toFixed(3)}),\n`;
      code += `    colors: [\n      ${colors}\n    ],\n`;
      code += `    stops: [${stops}],\n`;
      code += `  )`;
    }
    return code;
  }

  /**
   * Generates Tailwind code for a gradient layer
   * Tailwind doesn't support multi-layer gradients well via utility classes alone
   * without config. We will generate arbitrary values.
   */
  getLayerTailwind(layer) {
    // bg-[linear-gradient(90deg,red,blue)]
    // We reuse the CSS generation logic but wrap it validly
    const css = this.getBackgroundCSSForLayer(layer);
    const arbitrary = css.replace(/, /g, ',').replace(/ /g, '_');
    return `bg-[${arbitrary}]`;
  }

  getBackgroundCSSForLayer(layer) {
    const stopsStr = [...layer.stops]
      .sort((a, b) => a.position - b.position)
      .map((s) => `${s.color} ${s.position}%`)
      .join(', ');

    if (layer.type === 'radial') {
      const posX = layer.posX !== undefined ? layer.posX : 50;
      const posY = layer.posY !== undefined ? layer.posY : 50;
      const size = layer.size || 'farthest-corner';

      if (size === 'farthest-corner') {
        return `radial-gradient(${layer.shape || 'circle'} at ${posX}% ${posY}%, ${stopsStr})`;
      }
      return `radial-gradient(${layer.shape || 'circle'} ${size} at ${posX}% ${posY}%, ${stopsStr})`;
    }
    return `linear-gradient(${layer.angle}deg, ${stopsStr})`;
  }

  /**
   * Generates the CSS-compatible shadow string for ALL layers
   */
  getCSS() {
    const shadows = this.layers.map((layer) => {
      const insetValue = layer.inset ? 'inset' : '';
      const color = this.hexToRgba(layer.color, layer.opacity);
      return `${layer.horizontal}px ${layer.vertical}px ${layer.blur}px ${layer.spread}px ${color} ${insetValue}`.trim();
    });

    return shadows.join(', ');
  }

  /**
   * Generates Flutter BoxShadow code
   */
  getDart() {
    const { borderRadius } = this.boxProperties;
    let code = '';

    if (
      borderRadius > 0 ||
      this.backgroundLayers.length > 0 ||
      this.boxProperties.backgroundColor
    ) {
      code += `// Container decoration\n`;
      code += `decoration: BoxDecoration(\n`;
      if (borderRadius > 0) code += `  borderRadius: BorderRadius.circular(${borderRadius}),\n`;

      // Background
      // Flutter doesn't natively support stacking multiple background gradients in one BoxDecoration easily
      // without using a Stack widget or ShaderMasks.
      // BoxDecoration accepts only ONE gradient or ONE color.
      // If we have layers, we might just output the TOP most layer as the gradient,
      // or if user wants layers, they'd conceptually need a Stack.
      // For this generator, let's assume valid output is the TOP gradient if exists, else solid.
      if (this.backgroundLayers.length > 0) {
        // In CSS `background: gradientA, gradientB`, the first layer is on top.
        // BoxDecoration accepts only one gradient, so we export the top (first) layer.
        const cssTopLayer = this.backgroundLayers[0];
        code += `  gradient: ${this.getLayerDart(cssTopLayer)},\n`;
      } else {
        const bg = this.hexToColorObj(this.boxProperties.backgroundColor);
        code += `  color: Color(0xFF${bg.hex}),\n`;
      }

      code += `  boxShadow: [\n`;
    } else {
      code += `boxShadow: [\n`;
    }

    this.layers.forEach((layer) => {
      const { horizontal, vertical, blur, spread, color, opacity, inset } = layer;
      // Convert hex to rgb components
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      code += `    BoxShadow(\n`;
      code += `      color: Color.fromRGBO(${r}, ${g}, ${b}, ${opacity}),\n`;
      code += `      offset: Offset(${horizontal}, ${vertical}),\n`;
      code += `      blurRadius: ${blur},\n`;
      code += `      spreadRadius: ${spread},\n`;
      if (inset) {
        code += `      // inset: true, // Requires flutter_inset_box_shadow\n`;
      }
      code += `    ),\n`;
    });

    code += `  ],\n`;

    if (borderRadius > 0 || this.backgroundLayers.length > 0) {
      code += `)`;
    }

    return code;
  }

  /**
   * Generates Tailwind CSS configuration/classes
   */
  getTailwind() {
    // Tailwind arbitrary values (shadow-[...] / bg-[...]): spaces are significant,
    // so encode them as underscores and drop the space after commas. Parentheses
    // from rgba()/gradient functions are valid inside arbitrary values as-is and
    // must NOT be stripped or escaped.
    const arbitraryShadow = this.toTailwindArbitrary(this.getCSS());
    const arbitraryBg = this.toTailwindArbitrary(this.getBackgroundCSS());

    return `shadow-[${arbitraryShadow}] bg-[${arbitraryBg}]`;
  }

  /**
   * Normalizes a CSS value string into a Tailwind arbitrary-value token.
   * @param {string} value - Raw CSS value
   * @returns {string} Token safe for `[...]` arbitrary values
   */
  toTailwindArbitrary(value) {
    return value.replace(/,\s+/g, ',').replace(/\s+/g, '_');
  }

  /**
   * Helper to convert Hex + Alpha to RGBA string
   */
  hexToRgba(hex, alpha) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return `rgba(0,0,0,${alpha})`;

    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  rgbaToHex(_rgba) {
    // Basic fallback if color is not #hex.
    // TODO: implement robust rgba() parsing if gradient stops ever store rgba strings.
    return '#000000';
  }

  hexToColorObj(hex) {
    // Handle #RRGGBB
    let c = hex.startsWith('#') ? hex.substring(1) : hex;
    if (c.length === 3) {
      c = c
        .split('')
        .map((char) => char + char)
        .join('');
    }
    return { hex: c.toUpperCase() };
  }
}
