import { TabManager } from '../components/TabManager.js';
import { NotificationManager } from '../components/NotificationManager.js';
import { ControlFactory } from '../components/ControlFactory.js';
import { LayerManager } from '../components/LayerManager.js';
import { shadowControls } from '../config/controlsConfig.js';

export class ShadowView {
    constructor() {
      // Containers
      this.shadowContainer = document.querySelector("#shadow-controls-container");
      this.shapeContainer = document.querySelector("#shape-controls-container");
      this.layerContainer = document.querySelector("#layer-controls-container");
      
      // Initialize dynamic controls
      this.initDynamicControls();

      // Bind dynamic elements
      this.horizontal = document.querySelector("#horizontal");
      this.horizontalRef = document.querySelector("#horizontal-value");
      this.vertical = document.querySelector("#vertical");
      this.verticalRef = document.querySelector("#vertical-value");
      this.blur = document.querySelector("#blur");
      this.blurRef = document.querySelector("#blur-value");
      this.spread = document.querySelector("#spread");
      this.spreadRef = document.querySelector("#spread-value");
      this.color = document.querySelector("#cores");
      this.colorRef = document.querySelector("#color-value");
      this.opacity = document.querySelector("#opacidade");
      this.opacityRef = document.querySelector("#opacidade-value");
      this.inset = document.querySelector("#insetBox");
      this.borderRadius = document.querySelector("#borderRadius");
      this.borderRadiusRef = document.querySelector("#borderRadius-value");
  
      // Outputs
      this.previewBox = document.querySelector("#box");
      this.previewWrapper = document.querySelector("#preview"); 
      this.rule = document.querySelector("#rule span");
      this.webkitRule = document.querySelector("#webkit-rule span");
      this.mozRule = document.querySelector("#moz-rule span");
      this.borderRadiusRule = document.querySelector("#border-radius-rule");
      this.borderRadiusRuleSpan = document.querySelector("#border-radius-rule span");
      this.dartRule = document.querySelector("#dart-rule span");
      this.dartInstallInfo = document.querySelector("#dart-install-info");
      this.tailwindRule = document.querySelector("#tailwind-rule span");

      // Customization Inputs
      this.bgColorPicker = document.querySelector("#bg-color-picker");
      this.objColorPicker = document.querySelector("#obj-color-picker");

      // Buttons
      this.copyBtn = document.querySelector("#copiarTexto");
      this.copyText = document.querySelector("#texto");
      this.resetBtn = document.querySelector("#resetButton");
      this.presetBtns = document.querySelectorAll(".preset-btn");
      
      // Managers
      this.notificationManager = new NotificationManager(this.copyText, this.copyBtn);
      this.tabManager = new TabManager(this);
      
      // State
      this.activeTab = "css"; 
      this.isInset = false;
    }

    initDynamicControls() {
        shadowControls.forEach(config => {
            let control;
            if (config.type === 'checkbox') {
                control = ControlFactory.createCheckboxControl(config);
            } else {
                control = ControlFactory.createRangeControl(config);
            }

            if (config.category === 'shadow') {
                this.shadowContainer.appendChild(control);
            } else {
                this.shapeContainer.appendChild(control);
            }
        });
    }

    initLayerManager(callbacks) {
        this.layerManager = new LayerManager(this.layerContainer, callbacks);
    }

    onTabChanged(newTab) {
        this.activeTab = newTab;
        this.notificationManager.updateCopyButtonText(newTab);
        this.checkInstallInfo();
    }
  
    bindEvents(handler) {
      const bindDualInput = (elem, type) => {
        if (!elem) return;
        elem.addEventListener("input", (e) => handler(type, e.target.value));
      };
  
      shadowControls.forEach(config => {
          if (config.type !== 'checkbox') {
              const slider = document.getElementById(config.id);
              const textInput = document.getElementById(`${config.id}-value`);
              bindDualInput(slider, config.id);
              bindDualInput(textInput, config.id);
          } else {
              const check = document.getElementById(config.id);
              check.addEventListener("change", (e) => handler(config.id, e.target.checked));
          }
      });
      
      this.resetBtn.addEventListener("click", () => handler("reset"));
      this.copyBtn.addEventListener("click", () => handler("copy", this.activeTab));

      // Presets
      this.presetBtns.forEach(btn => {
          btn.addEventListener("click", () => handler("preset", btn.dataset.preset));
      });

      // Color Customization
      this.bgColorPicker.addEventListener("input", (e) => handler("canvasColor", e.target.value));
      this.objColorPicker.addEventListener("input", (e) => handler("backgroundColor", e.target.value));
    }
  
    updatePreview(cssString, dartString, tailwindString, state) {
      this.previewBox.style.boxShadow = cssString;
      this.previewBox.style.borderRadius = `${state.borderRadius}px`;
      this.previewBox.style.backgroundColor = state.backgroundColor;
      
      // Update canvas background if previewWrapper has a specific area, 
      // but actually user asked to change the preview area background.
      // We can apply it to the parent of #box which is #preview.
      // #preview has h2 etc, maybe we just want the area around the box.
      // But let's apply to #preview for now.
      // Better: Apply to #preview or create a wrapper. 
      // The CSS structure has #preview { ... }. 
      this.previewWrapper.style.backgroundColor = state.canvasColor;

      this.rule.innerText = cssString;
      this.webkitRule.innerText = cssString;
      this.mozRule.innerText = cssString;
      this.tailwindRule.innerText = tailwindString;
      
      if (state.borderRadius > 0) {
          this.borderRadiusRule.style.display = 'block';
          this.borderRadiusRuleSpan.innerText = `${state.borderRadius}px`;
      } else {
          this.borderRadiusRule.style.display = 'none';
      }

      this.dartRule.innerText = dartString;
      this.isInset = state.inset;
      this.checkInstallInfo();

      // Update Layer Manager UI
      if (this.layerManager) {
          this.layerManager.update(state.layerCount, state.currentLayerIndex);
      }
    }

    checkInstallInfo() {
        if (this.activeTab === 'dart' && this.isInset) {
            this.dartInstallInfo.style.display = 'block';
        } else {
            this.dartInstallInfo.style.display = 'none';
        }
    }
  
    updateInputs(state) {
        // Update customization pickers
        this.bgColorPicker.value = state.canvasColor;
        this.objColorPicker.value = state.backgroundColor;

        shadowControls.forEach(config => {
            const slider = document.getElementById(config.id);
            const textInput = document.getElementById(`${config.id}-value`);

            if (config.type === 'checkbox') {
                slider.checked = state[config.id];
            } else if (config.id === 'opacity') {
                slider.value = state.opacity * 100;
                textInput.value = state.opacity;
            } else {
                // If the property exists in state, update it.
                // Some properties might be global (borderRadius) or layer specific
                if (state[config.id] !== undefined) {
                    slider.value = state[config.id];
                    if (textInput) textInput.value = state[config.id];
                }
            }
        });
    }
  
    showCopyFeedback() {
        this.notificationManager.showCopyFeedback(this.activeTab);
    }
}
