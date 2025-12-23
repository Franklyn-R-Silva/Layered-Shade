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

    // Initial Render
    this.view.updateInputs(this.model.getState());
    this.view.updatePreview(this.model.getCSS(), this.model.getDart());

    // Bind events
    this.view.bindEvents(this.handleEvent.bind(this));
  }

  handleEvent(type, value) {
    if (type === 'reset') {
      this.model.reset();
      this.view.updateInputs(this.model.getState());
      this.view.updatePreview(this.model.getCSS(), this.model.getDart());
      return;
    }

    if (type === 'copy') {
      // Value passed from View is the 'activeTab' name string ('css' or 'dart')
      this.copyToClipboard(value);
      return;
    }

    // Normal updates
    if (type === 'opacity') {
        value = value / 100;
    }
    
    if (['horizontal', 'vertical', 'blur', 'spread'].includes(type)) {
        const intVal = parseInt(value);
        if (!isNaN(intVal)) {
            value = intVal;
        }
    }

    this.model.update(type, value);
    
    this.view.updateInputs(this.model.getState()); 
    this.view.updatePreview(this.model.getCSS(), this.model.getDart());
  }

  copyToClipboard(mode) {
    let textToCopy = "";
    
    if (mode === 'dart') {
        textToCopy = this.model.getDart();
    } else {
        // Default to CSS
        textToCopy = `box-shadow: ${this.model.getCSS()};\n-webkit-box-shadow: ${this.model.getCSS()};\n-moz-box-shadow: ${this.model.getCSS()};`;
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

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    const app = new ShadowController(new ShadowModel(), new ShadowView());
});
