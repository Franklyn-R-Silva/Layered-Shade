/**
 * ShadowView.js
 * Responsible for DOM manipulation and Event binding.
 */
export class ShadowView {
    constructor() {
      // Inputs
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
  
      // Outputs
      this.previewBox = document.querySelector("#box");
      this.rule = document.querySelector("#rule span");
      this.webkitRule = document.querySelector("#webkit-rule span");
      this.mozRule = document.querySelector("#moz-rule span");
      this.dartRule = document.querySelector("#dart-rule span");

      // Tabs
      this.tabBtns = document.querySelectorAll(".tab-btn");
      this.tabContents = document.querySelectorAll(".tab-content");
      this.activeTab = "css"; // default
  
      // Buttons
      this.copyBtn = document.querySelector("#copiarTexto");
      this.copyText = document.querySelector("#texto");
      this.resetBtn = document.querySelector("#resetButton");

      // Initialize Tabs
      this.initTabs();
    }

    initTabs() {
        this.tabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                // Remove active from all
                this.tabBtns.forEach(b => b.classList.remove("active"));
                this.tabContents.forEach(c => c.classList.remove("active"));

                // Add active to clicked
                btn.classList.add("active");
                const target = btn.dataset.tab;
                document.getElementById(`${target}-content`).classList.add("active");
                
                // Update state
                this.activeTab = target;
                
                // Update button text to reflect what will be copied
                const label = target === 'css' ? 'CSS' : 'Dart';
                this.copyText.textContent = `Clique aqui para copiar as regras (${label})`;
            });
        });
    }
  
    bindEvents(handler) {
      // helper to bind input + change for range sliders
      const bindDualInput = (elem, type) => {
        elem.addEventListener("input", (e) => handler(type, e.target.value));
      };
  
      // Ranges
      bindDualInput(this.horizontal, "horizontal");
      bindDualInput(this.vertical, "vertical");
      bindDualInput(this.blur, "blur");
      bindDualInput(this.spread, "spread");
      bindDualInput(this.opacity, "opacity");
      
      // Other inputs
      bindDualInput(this.color, "color");
      this.inset.addEventListener("change", (e) => handler("inset", e.target.checked));
  
      // Reference inputs (Manual typing)
      this.horizontalRef.addEventListener("input", (e) => handler("horizontal", e.target.value));
      this.verticalRef.addEventListener("input", (e) => handler("vertical", e.target.value));
      this.blurRef.addEventListener("input", (e) => handler("blur", e.target.value));
      this.spreadRef.addEventListener("input", (e) => handler("spread", e.target.value));
      
      // Buttons
      this.resetBtn.addEventListener("click", () => handler("reset"));
      this.copyBtn.addEventListener("click", () => handler("copy", this.activeTab)); // Pass active tab
    }
  
    updatePreview(cssString, dartString) {
      this.previewBox.style.boxShadow = cssString;
      this.rule.innerText = cssString;
      this.webkitRule.innerText = cssString;
      this.mozRule.innerText = cssString;
      this.dartRule.innerText = dartString;
    }
  
    updateInputs(state) {
      this.horizontal.value = state.horizontal;
      this.horizontalRef.value = state.horizontal;
      
      this.vertical.value = state.vertical;
      this.verticalRef.value = state.vertical;
      
      this.blur.value = state.blur;
      this.blurRef.value = state.blur;
      
      this.spread.value = state.spread;
      this.spreadRef.value = state.spread;
      
      this.color.value = state.color;
      this.colorRef.value = state.color;
      
      // Opacity is 0-1 state, 0-100 input
      this.opacity.value = state.opacity * 100;
      this.opacityRef.value = state.opacity;
      
      this.inset.checked = state.inset;
    }
  
    showCopyFeedback() {
      // const originalText = this.copyText.textContent; // Not used currently
      this.copyText.textContent = "Copiado com sucesso!";
      this.copyBtn.classList.add("copied");
      
      setTimeout(() => {
        const label = this.activeTab === 'css' ? 'CSS' : 'Dart';
        this.copyText.textContent = `Clique aqui para copiar as regras (${label})`;
        this.copyBtn.classList.remove("copied");
      }, 2000);
    }
}
