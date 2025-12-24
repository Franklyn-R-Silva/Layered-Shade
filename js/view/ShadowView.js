import { TabManager } from '../components/TabManager.js';
import { NotificationManager } from '../components/NotificationManager.js';
import { ControlFactory } from '../components/ControlFactory.js';
import { LayerManager } from '../components/LayerManager.js';
import { BackgroundManager } from '../components/BackgroundManager.js'; // New
import { shadowControls } from '../config/controlsConfig.js';

export class ShadowView {
  constructor() {
    // Containers
    this.shadowContainer = document.querySelector('#shadow-controls-container');
    this.shapeContainer = document.querySelector('#shape-controls-container');
    this.layerContainer = document.querySelector('#layer-controls-container');

    // New Background Containers
    this.bgLayersContainer = document.querySelector('#background-layers-container');
    this.bgControlsWrapper = document.querySelector('#bg-controls-wrapper');

    // Initialize dynamic controls
    this.initDynamicControls();

    this.initSidebarTabs(); // Initialize sidebar tabs logic

    // Bind dynamic elements
    this.horizontal = document.querySelector('#horizontal');
    this.horizontalRef = document.querySelector('#horizontal-value');
    this.vertical = document.querySelector('#vertical');
    this.verticalRef = document.querySelector('#vertical-value');
    this.blur = document.querySelector('#blur');
    this.blurRef = document.querySelector('#blur-value');
    this.spread = document.querySelector('#spread');
    this.spreadRef = document.querySelector('#spread-value');
    // this.color ... (handled by manager usually but kept for sync)
    this.opacity = document.querySelector('#opacidade');
    this.opacityRef = document.querySelector('#opacidade-value');
    this.inset = document.querySelector('#insetBox');
    this.borderRadius = document.querySelector('#borderRadius');
    this.borderRadiusRef = document.querySelector('#borderRadius-value');

    // Outputs
    this.previewBox = document.querySelector('#box');
    this.previewWrapper = document.querySelector('#preview');
    this.rule = document.querySelector('#rule span');
    this.webkitRule = document.querySelector('#webkit-rule span');
    this.mozRule = document.querySelector('#moz-rule span');
    this.bgRule = document.querySelector('#bg-rule span');
    this.borderRadiusRule = document.querySelector('#border-radius-rule');
    this.borderRadiusRuleSpan = document.querySelector('#border-radius-rule span');
    this.dartRule = document.querySelector('#dart-rule span');
    this.dartInstallInfo = document.querySelector('#dart-install-info');
    this.tailwindRule = document.querySelector('#tailwind-rule span');

    // Customization Inputs
    this.bgColorPicker = document.querySelector('#bg-color-picker'); // Canvas bg

    // Buttons
    this.copyBtn = document.querySelector('#copiarTexto');
    this.copyText = document.querySelector('#texto');
    this.resetBtn = document.querySelector('#resetButton');
    this.presetBtns = document.querySelectorAll('.preset-btn');

    // Managers
    this.notificationManager = new NotificationManager(this.copyText, this.copyBtn);
    this.tabManager = new TabManager(this);

    // State
    this.activeTab = 'css';
    this.isInset = false;
  }

  initSidebarTabs() {
    const tabs = document.querySelectorAll('.sidebar-tab');
    const contents = document.querySelectorAll('.sidebar-content');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        // Remove active
        tabs.forEach((t) => t.classList.remove('active'));
        contents.forEach((c) => c.classList.remove('active'));

        // Add active
        tab.classList.add('active');
        const target = document.getElementById(`sidebar-content-${tab.dataset.sidebar}`);
        if (target) target.classList.add('active');
      });
    });
  }

  initDynamicControls() {
    shadowControls.forEach((config) => {
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

  // New Background Manager
  initBackgroundManager(callbacks) {
    this.backgroundManager = new BackgroundManager(
      this.bgLayersContainer,
      this.bgControlsWrapper,
      callbacks,
    );
  }

  onTabChanged(newTab) {
    this.activeTab = newTab;
    this.notificationManager.updateCopyButtonText(newTab);
    this.checkInstallInfo();
  }

  bindEvents(handler) {
    const bindDualInput = (elem, type) => {
      if (!elem) return;
      elem.addEventListener('input', (e) => handler(type, e.target.value));
    };

    shadowControls.forEach((config) => {
      if (config.type !== 'checkbox') {
        const slider = document.getElementById(config.id);
        const textInput = document.getElementById(`${config.id}-value`);
        bindDualInput(slider, config.id);
        bindDualInput(textInput, config.id);
      } else {
        const check = document.getElementById(config.id);
        check.addEventListener('change', (e) => handler(config.id, e.target.checked));
      }
    });

    this.resetBtn.addEventListener('click', () => handler('reset'));
    this.copyBtn.addEventListener('click', () => handler('copy', this.activeTab));

    // Presets
    this.presetBtns.forEach((btn) => {
      btn.addEventListener('click', () => handler('preset', btn.dataset.preset));
    });

    // Canvas Background Color
    if (this.bgColorPicker) {
      this.bgColorPicker.addEventListener('input', (e) => handler('canvasColor', e.target.value));
    }
  }

  updatePreview(cssString, dartString, tailwindString, state, backgroundCSS) {
    this.previewBox.style.boxShadow = cssString;
    this.previewBox.style.borderRadius = `${state.borderRadius}px`;

    // Apply background (Solid or Gradient Layers)
    this.previewBox.style.background = backgroundCSS;

    this.previewWrapper.style.backgroundColor = state.canvasColor;

    this.rule.innerText = cssString;
    this.webkitRule.innerText = cssString;
    this.mozRule.innerText = cssString;
    this.bgRule.innerText = backgroundCSS;
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

    // Update Managers
    if (this.layerManager) {
      this.layerManager.update(state.layerCount, state.currentLayerIndex);
    }
    if (this.backgroundManager) {
      this.backgroundManager.update(state);
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
    // Canvas Picker
    if (this.bgColorPicker) this.bgColorPicker.value = state.canvasColor;

    shadowControls.forEach((config) => {
      const slider = document.getElementById(config.id);
      const textInput = document.getElementById(`${config.id}-value`);
      if (!slider) return;

      if (config.type === 'checkbox') {
        slider.checked = state[config.id];
      } else if (config.id === 'opacity') {
        slider.value = state.opacity * 100;
        if (textInput) textInput.value = state.opacity;
      } else {
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
