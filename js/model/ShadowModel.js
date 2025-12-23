/**
 * ShadowModel.js
 * Responsible for holding the state of the box shadow generator.
 */
export class ShadowModel {
    constructor() {
      this.state = {
        horizontal: 5,
        vertical: 5,
        blur: 10,
        spread: 3,
        color: "#000000",
        opacity: 1, // Stored as 0-1
        inset: false,
      };
      
      this.defaultState = { ...this.state };
    }
  
    update(key, value) {
      if (key === 'opacity') {
        // Opacity comes in as 0-100 from slider, convert to 0-1
        // But if it's already 0-1 (e.g. from internal calls), we handle that logic in Controller
        // Actually, let's strictly say Model expects formatted values or handle conversion here.
        // Let's decide: Model stores RAW data. If input gives 0-100, we store normalized?
        // Let's store normalized 0-1 for opacity.
        this.state[key] = value;
      } else {
        this.state[key] = value;
      }
    }
  
    getState() {
      return { ...this.state };
    }
  
    reset() {
      this.state = { ...this.defaultState };
    }
  
    /**
     * Generates the CSS-compatible shadow string
     * e.g., "5px 5px 10px 3px rgba(0,0,0,1)" or with "inset"
     */
    getCSS() {
      const insetValue = this.state.inset ? "inset" : "";
      const color = this.hexToRgba(this.state.color, this.state.opacity);
      
      // Clean up extra spaces
      return `${this.state.horizontal}px ${this.state.vertical}px ${this.state.blur}px ${this.state.spread}px ${color} ${insetValue}`.trim();
    }
  
    /**
     * Generates Flutter BoxShadow code
     */
    getDart() {
        const { horizontal, vertical, blur, spread, color, opacity, inset } = this.state;
        
        // Convert hex to rgb components
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        
        // Flutter uses 0.0-1.0 for opacity, which matches our internal state `opacity`.
        
        // BoxShadow(
        //   color: Color.fromRGBO(0, 0, 0, 1),
        //   offset: Offset(0, 0),
        //   blurRadius: 10,
        //   spreadRadius: 0,
        // )
        
        const insetComment = inset ? ' // inset not supported in BoxShadow' : '';
        
        return `BoxShadow(
      color: Color.fromRGBO(${r}, ${g}, ${b}, ${opacity}),
      offset: Offset(${horizontal}, ${vertical}),
      blurRadius: ${blur},
      spreadRadius: ${spread},
    )${insetComment}`;
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
