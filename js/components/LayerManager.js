/**
 * LayerManager.js
 * Manages the UI for adding, removing, and selecting shadow layers.
 */
export class LayerManager {
    constructor(container, callbacks) {
        this.container = container;
        this.callbacks = callbacks; // { onSelect, onAdd, onRemove }
        
        // We will create the UI structure dynamically
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="layer-controls-header">
                <h3>Camadas</h3>
                <button id="add-layer-btn" class="layer-btn add" title="Adicionar Camada">+</button>
            </div>
            <div id="layers-list" class="layers-list"></div>
        `;

        this.listContainer = this.container.querySelector('#layers-list');
        this.addBtn = this.container.querySelector('#add-layer-btn');

        this.addBtn.addEventListener('click', () => {
            if (this.callbacks.onAdd) this.callbacks.onAdd();
        });
    }

    update(layerCount, activeIndex) {
        this.listContainer.innerHTML = '';

        for (let i = 0; i < layerCount; i++) {
            const layerItem = document.createElement('div');
            layerItem.className = `layer-item ${i === activeIndex ? 'active' : ''}`;
            layerItem.innerHTML = `
                <span class="layer-name">Camada ${i + 1}</span>
                <button class="remove-layer-btn" data-index="${i}" title="Remover Camada">×</button>
            `;

            // Select layer on click
            layerItem.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-layer-btn')) return;
                if (this.callbacks.onSelect) this.callbacks.onSelect(i);
            });

            // Remove button
            const removeBtn = layerItem.querySelector('.remove-layer-btn');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.callbacks.onRemove) this.callbacks.onRemove(i);
            });

            this.listContainer.appendChild(layerItem);
        }
    }
}
