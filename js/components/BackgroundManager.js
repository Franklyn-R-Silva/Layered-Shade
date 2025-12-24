/**
 * BackgroundManager.js
 * Manages multiple background layers (Gradients).
 */
export class BackgroundManager {
  constructor(container, controlsContainer, callbacks) {
    this.container = container; // Layers list container
    this.controlsContainer = controlsContainer; // Controls for active layer
    this.callbacks = callbacks;

    // Base color picker (internal reference or bound in View? let's bind element here)
    this.baseColorPicker = document.querySelector('#base-bg-picker');
    if (this.baseColorPicker) {
      this.baseColorPicker.addEventListener('input', (e) =>
        this.callbacks.onUpdate('backgroundColor', e.target.value),
      );
    }

    this.renderControls = this.renderControls.bind(this);
  }

  update(state) {
    this.renderLayersList(state.backgroundLayers, state.currentBgLayerIndex);

    if (state.currentBgLayerIndex >= 0 && state.currentBgLayer) {
      this.currentActiveIndex = state.currentBgLayerIndex; // Store for callbacks
      this.renderControls(state.currentBgLayer);
      this.controlsContainer.style.display = 'block';
    } else {
      this.controlsContainer.innerHTML =
        '<p class="bg-empty-state">Adicione uma camada de gradiente acima ou edite a cor base.</p>';
    }
  }

  renderLayersList(layers, activeIndex) {
    let html = `
            <div class="layer-controls-header">
                <h3>Gradientes (${layers.length})</h3>
                <button class="layer-btn add" id="add-bg-layer" title="Adicionar Gradiente">+</button>
            </div>
            <div class="layers-list">
        `;

    layers.forEach((layer, index) => {
      const isActive = index === activeIndex ? 'active' : '';
      const typeLabel = layer.type === 'linear' ? 'Linear' : 'Radial';

      // Generate a mini preview of the gradient
      const previewGradient =
        layer.type === 'linear'
          ? `linear-gradient(90deg, ${layer.stops[0].color}, ${layer.stops[layer.stops.length - 1].color})`
          : `radial-gradient(circle, ${layer.stops[0].color}, ${layer.stops[layer.stops.length - 1].color})`;

      html += `
                <div class="layer-item ${isActive}" data-index="${index}">
                    <div class="bg-preview-wrapper">
                        <div class="bg-preview-swatch" style="background:${previewGradient}"></div>
                        <span class="layer-name">${typeLabel}</span>
                    </div>
                    <button class="remove-layer-btn" data-index="${index}">×</button>
                </div>
            `;
    });

    html += `</div>`;
    this.container.innerHTML = html;

    // Bind Events
    this.container
      .querySelector('#add-bg-layer')
      .addEventListener('click', () => this.callbacks.onAdd());

    this.container.querySelectorAll('.layer-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        if (!e.target.classList.contains('remove-layer-btn')) {
          this.callbacks.onSelect(parseInt(item.dataset.index));
        }
      });
    });

    this.container.querySelectorAll('.remove-layer-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.callbacks.onRemove(parseInt(btn.dataset.index));
      });
    });
  }

  renderControls(layer) {
    // Controls for the ACTIVE layer
    let controlsHtml = `
            <div class="bg-controls-group">
                <div class="control-header"><label>Tipo</label></div>
                <select id="bg-type-select" class="form-select bg-select-input">
                    <option value="linear" ${layer.type === 'linear' ? 'selected' : ''}>Linear</option>
                    <option value="radial" ${layer.type === 'radial' ? 'selected' : ''}>Radial</option>
                </select>

                ${
                  layer.type === 'linear'
                    ? `
                    <div class="control-header control-header-margin"><label>Ângulo: ${layer.angle}°</label></div>
                    <input type="range" id="bg-angle-range" min="0" max="360" value="${layer.angle}">
                `
                    : `
                   <div class="bg-position-controls">
                       <div class="bg-position-control">
                           <label>Posição X (${layer.posX ?? 50}%)</label>
                           <input type="range" id="bg-pos-x" min="0" max="100" value="${layer.posX ?? 50}">
                       </div>
                       <div class="bg-position-control">
                           <label>Posição Y (${layer.posY ?? 50}%)</label>
                           <input type="range" id="bg-pos-y" min="0" max="100" value="${layer.posY ?? 50}">
                       </div>
                   </div>
                   <div class="control-header control-header-margin"><label>Tamanho (Radial)</label></div>
                   <select id="bg-radial-size" class="form-select bg-select-input">
                       <option value="farthest-corner" ${layer.size === 'farthest-corner' ? 'selected' : ''}>Farthest Corner (Padrão)</option>
                       <option value="closest-side" ${layer.size === 'closest-side' ? 'selected' : ''}>Closest Side</option>
                       <option value="closest-corner" ${layer.size === 'closest-corner' ? 'selected' : ''}>Closest Corner</option>
                       <option value="farthest-side" ${layer.size === 'farthest-side' ? 'selected' : ''}>Farthest Side</option>
                   </select>
                `
                }
                
                <div class="bg-stops-header">
                    <label>Cores (Stops)</label>
                    <button class="bg-add-stop-btn" id="bg-add-stop">+ Add Cor</button>
                </div>
                
                <div class="bg-stops-list">
                    ${layer.stops
                      .map(
                        (stop, i) => `
                        <div class="bg-stop-row">
                            <input type="color" class="bg-stop-input" data-index="${i}" value="${stop.color}" title="Cor do Stop">
                            <input type="range" class="bg-stop-slider" data-index="${i}" min="0" max="100" value="${stop.position}" title="Posição: ${stop.position}%">
                            <button class="bg-remove-stop-btn" data-index="${i}" title="Remover cor">×</button>
                        </div>
                    `,
                      )
                      .join('')}
                </div>
            </div>
        `;

    this.controlsContainer.innerHTML = controlsHtml;

    // Bind Events
    this.bindControlEvents(layer);
  }

  bindControlEvents(layer) {
    const typeSelect = this.controlsContainer.querySelector('#bg-type-select');
    typeSelect?.addEventListener('change', (e) =>
      this.callbacks.onUpdateLayer('bgLayerType', e.target.value),
    );

    if (layer.type === 'linear') {
      const angleRange = this.controlsContainer.querySelector('#bg-angle-range');
      angleRange?.addEventListener('input', (e) =>
        this.callbacks.onUpdateLayer('bgLayerAngle', e.target.value),
      );
    } else {
      const posX = this.controlsContainer.querySelector('#bg-pos-x');
      const posY = this.controlsContainer.querySelector('#bg-pos-y');

      posX?.addEventListener('input', (e) =>
        this.callbacks.onUpdateLayer('bgLayerPosX', e.target.value),
      );
      posY?.addEventListener('input', (e) =>
        this.callbacks.onUpdateLayer('bgLayerPosY', e.target.value),
      );

      const radialSize = this.controlsContainer.querySelector('#bg-radial-size');
      radialSize?.addEventListener('change', (e) =>
        this.callbacks.onUpdateLayer('bgLayerSize', e.target.value),
      );
    }

    // Stops Management
    const addStopBtn = this.controlsContainer.querySelector('#bg-add-stop');
    addStopBtn?.addEventListener('click', () => {
      const newStops = [...layer.stops, { color: '#888888', position: 100 }];
      // Distribute positions roughly if needed, or just append at end
      this.callbacks.onUpdateLayer('bgLayerStops', newStops);
    });

    const stopInputs = this.controlsContainer.querySelectorAll('.bg-stop-input');
    stopInputs.forEach((input) => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.index);
        const newStops = [...layer.stops];
        newStops[idx].color = e.target.value;
        this.callbacks.onUpdateLayer('bgLayerStops', newStops);
      });
    });

    const stopSliders = this.controlsContainer.querySelectorAll('.bg-stop-slider');
    stopSliders.forEach((slider) => {
      slider.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.index);
        const newStops = [...layer.stops];
        newStops[idx].position = parseInt(e.target.value);
        this.callbacks.onUpdateLayer('bgLayerStops', newStops);
      });
    });

    const removeBtns = this.controlsContainer.querySelectorAll('.bg-remove-stop-btn');
    removeBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        if (layer.stops.length <= 2) {
          alert('Mínimo 2 cores necessárias.');
          return;
        }
        const newStops = layer.stops.filter((_, i) => i !== idx);
        this.callbacks.onUpdateLayer('bgLayerStops', newStops);
      });
    });
  }
}
