/**
 * ShadowModel.js
 * Responsible for holding the state of the box shadow generator.
 * Now supports multiple layers.
 */
export class ShadowModel {
    constructor() {
      // Default template for a new layer
      this.defaultLayerState = {
        horizontal: 5,
        vertical: 5,
        blur: 10,
        spread: 3,
        color: "#000000",
        opacity: 0.5, // Default opacity for new layers
        inset: false,
      };

      // We'll separate box properties from shadow properties
      this.boxProperties = {
        borderRadius: 0,
        backgroundColor: "#ffdd00", // Default Yellow
        canvasColor: "#ffffff"      // Preview background color
      };

      this.layers = [ { ...this.defaultLayerState, opacity: 0.2 } ];
      this.currentLayerIndex = 0;
    }
  
    /**
     * Updates the current layer or global box properties
     */
    update(key, value) {
      if (['borderRadius'].includes(key)) {
        this.boxProperties[key] = value;
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
     * Returns the state of the CURRENT active layer + global box properties
     * This ensures the View inputs show the correct values for the selected layer.
     */
    getState() {
      const currentLayer = this.layers[this.currentLayerIndex] || this.defaultLayerState;
      return { 
          ...currentLayer,
          ...this.boxProperties,
          // Add helpful metadata for the view
          layerCount: this.layers.length,
          currentLayerIndex: this.currentLayerIndex
      };
    }
    
    getAllLayers() {
        return this.layers;
    }

    addLayer() {
        // Clone default state
        this.layers.push({ ...this.defaultLayerState });
        this.currentLayerIndex = this.layers.length - 1;
    }

    removeLayer(index) {
        // If index not provided, remove current
        const idxToRemove = index !== undefined ? index : this.currentLayerIndex;
        
        if (this.layers.length > 1) {
            this.layers.splice(idxToRemove, 1);
            // Adjust index if out of bounds
            if (this.currentLayerIndex >= this.layers.length) {
                this.currentLayerIndex = this.layers.length - 1;
            }
        }
    }

    selectLayer(index) {
        if (index >= 0 && index < this.layers.length) {
            this.currentLayerIndex = index;
        }
    }
  
    reset() {
      this.layers = [ { ...this.defaultLayerState, opacity: 0.2 } ];
      this.currentLayerIndex = 0;
      this.boxProperties.borderRadius = 0;
    }
  
    /**
     * Generates the CSS-compatible shadow string for ALL layers
     */
    getCSS() {
      const shadows = this.layers.map(layer => {
          const insetValue = layer.inset ? "inset" : "";
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

        if (borderRadius > 0) {
            code += `// Container decoration\n`;
            code += `decoration: BoxDecoration(\n`;
            code += `  borderRadius: BorderRadius.circular(${borderRadius}),\n`;
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
        
        if (borderRadius > 0) {
            code += `)`;
        }

        return code;
    }

    /**
     * Generates Tailwind CSS configuration/classes
     */
    getTailwind() {
        // Tailwind arbitrary value: shadow-[...]
        // We need to replace spaces with underscores for arbitrary values in Tailwind class names
        // But for multiple shadows, commas are used.
        // shadow-[0px_10px_20px_rgba(0,0,0,0.5),_0px_4px_6px_rgba(0,0,0,0.1)]
        
        let shadowString = this.getCSS();
        // Simple heuristic: replace spaces with underscores, but keep commas
        // Actually, for arbitrary values, spaces are often problematic if not escaped or underscored.
        // Let's allow spaces but in config it's a string.
        // If we want a CLASS name:
        // shadow-[...]
        
        const arbitraryValue = shadowString.replace(/, /g, ',').replace(/ /g, '_');
        
        return `shadow-[${arbitraryValue}]`;
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
  }
