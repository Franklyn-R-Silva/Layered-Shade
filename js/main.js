/**
 * main.js
 * Controller: Links Model and View
 */
import { ShadowModel } from './model/ShadowModel.js';
import { ShadowView } from './view/ShadowView.js';

class ShadowController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Initialize Layer Manager (Shadows)
    this.view.initLayerManager({
        onSelect: (index) => this.handleLayerSelect(index),
        onAdd: () => this.handleLayerAdd(),
        onRemove: (index) => this.handleLayerRemove(index)
    });

    // Initialize Background Manager (Gradients)
    this.view.initBackgroundManager({
        onAdd: () => {
            this.model.addBackgroundLayer();
            this.refreshView();
        },
        onRemove: (index) => {
            this.model.removeBackgroundLayer(index);
            this.refreshView();
        },
        onSelect: (index) => {
            this.model.selectBackgroundLayer(index);
            this.refreshView();
        },
        onUpdate: (key, value) => {
            // updates global bg params like 'backgroundColor'
            this.model.update(key, value);
            this.refreshView();
        },
        onUpdateLayer: (key, value) => {
            // updates specific active layer param
            this.model.update(key, value);
            this.refreshView();
        },
        onCopyLayer: (index, mode) => {
             const layer = this.model.backgroundLayers[index];
             if(!layer) return;
             
             let text = "";
             if (mode === 'css') {
                 // Generate CSS just for this layer
                 text = this.model.getBackgroundCSSForLayer(layer) + ";"; 
             } else if (mode === 'dart') {
                 text = this.model.getLayerDart(layer);
             } else if (mode === 'tailwind') {
                 text = this.model.getLayerTailwind(layer);
             }
             
             navigator.clipboard.writeText(text).then(() => {
                 this.view.showCopyFeedback(); // We can reuse the main copy feedback
             });
        }
    });

    // Initial Render
    this.refreshView();

    // Bind events
    this.view.bindEvents(this.handleEvent.bind(this));
  }

  handleEvent(type, value) {
    if (type === 'reset') {
      this.model.reset();
      this.refreshView();
      return;
    }

    if (type === 'copy') {
      this.copyToClipboard(value);
      return;
    }

    if (type === 'preset') {
        this.applyPreset(value);
        return;
    }

    if (['canvasColor', 'backgroundColor'].includes(type)) {
        this.model.update(type, value);
        this.refreshView();
        return;
    }

    // Normal updates (Slider inputs)
    if (type === 'opacity') {
        value = value / 100;
    }
    
    if (['horizontal', 'vertical', 'blur', 'spread', 'borderRadius'].includes(type)) { 
        const intVal = parseInt(value);
        if (!isNaN(intVal)) {
            value = intVal;
        }
    }

    this.model.update(type, value);
    this.refreshView();
  }

  handleLayerSelect(index) {
      this.model.selectLayer(index);
      this.refreshView();
  }

  handleLayerAdd() {
      this.model.addLayer();
      this.refreshView();
  }

  handleLayerRemove(index) {
      this.model.removeLayer(index);
      this.refreshView();
  }

  applyPreset(presetName) {
      this.model.reset();
      
      if (presetName === 'soft') {
          this.model.update('blur', 10);
          this.model.update('opacity', 0.15);
          this.model.update('vertical', 4);
          this.model.update('canvasColor', '#f3f4f6');
          this.model.update('backgroundColor', '#ffffff');
          // Clear background layers
          this.model.backgroundLayers = [];
      } else if (presetName === 'neumorphism') {
          this.model.reset(); 
          // Layer 1
          this.model.update('horizontal', -5);
          this.model.update('vertical', -5);
          this.model.update('blur', 10);
          this.model.update('color', '#ffffff');
          this.model.update('opacity', 1);
          this.model.addLayer();
          // Layer 2
          this.model.update('horizontal', 5);
          this.model.update('vertical', 5);
          this.model.update('blur', 10);
          this.model.update('color', '#bebebe');
          this.model.update('opacity', 1);
          
          this.model.update('backgroundColor', '#e0e0e0');
          this.model.update('canvasColor', '#e0e0e0');
          this.model.backgroundLayers = [];
      } else if (presetName === 'cristal') {
          this.model.reset(); 
          // Layer 1
          this.model.update('horizontal', 0);
          this.model.update('vertical', 8);
          this.model.update('blur', 32);
          this.model.update('color', '#1f2687');
          this.model.update('opacity', 0.37);
          this.model.addLayer();
          // Layer 2
          this.model.update('horizontal', 0);
          this.model.update('vertical', 0);
          this.model.update('blur', 0);
          this.model.update('spread', 1);
          this.model.update('color', '#ffffff');
          this.model.update('opacity', 0.18);
          this.model.update('inset', true);

          this.model.update('backgroundColor', 'rgba(255, 255, 255, 0.15)'); 
          this.model.update('canvasColor', '#0891b2');
          this.model.backgroundLayers = [];
      }

      this.refreshView();
  }

  refreshView() {
    const state = this.model.getState();
    const css = this.model.getCSS();
    const dart = this.model.getDart();
    const tailwind = this.model.getTailwind();
    const bgCSS = this.model.getBackgroundCSS();

    this.view.updateInputs(state);
    this.view.updatePreview(css, dart, tailwind, state, bgCSS);
  }

  copyToClipboard(mode) {
    let textToCopy = "";
    const state = this.model.getState();
    const shadowRule = this.model.getCSS();
    const bgCSS = this.model.getBackgroundCSS();
    
    if (mode === 'dart') {
        textToCopy = this.model.getDart();
    } else if (mode === 'tailwind') {
        textToCopy = this.model.getTailwind();
    } else {
        // CSS
        textToCopy = `box-shadow: ${shadowRule};\n`;
        textToCopy += `background: ${bgCSS};\n`; // Now includes gradient/solid
        
        if (state.borderRadius > 0) {
            textToCopy += `border-radius: ${state.borderRadius}px;`;
        }
    }
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        this.view.showCopyFeedback();
      })
      .catch(err => {
        console.error('Failed to copy', err);
      });
  }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new ShadowController(new ShadowModel(), new ShadowView());
});
