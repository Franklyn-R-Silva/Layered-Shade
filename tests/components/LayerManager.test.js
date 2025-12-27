/**
 * LayerManager.test.js
 * Tests for LayerManager component
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LayerManager } from '../../js/components/LayerManager.js';

describe('LayerManager', () => {
  let container;
  let callbacks;
  let manager;

  beforeEach(() => {
    container = document.createElement('div');
    callbacks = {
      onSelect: vi.fn(),
      onAdd: vi.fn(),
      onRemove: vi.fn(),
    };
    manager = new LayerManager(container, callbacks);
  });

  describe('constructor', () => {
    it('should store container and callbacks', () => {
      expect(manager.container).toBe(container);
      expect(manager.callbacks).toBe(callbacks);
    });

    it('should call render on construction', () => {
      expect(container.innerHTML).toContain('Camadas');
    });
  });

  describe('render', () => {
    it('should create header with title', () => {
      const header = container.querySelector('.layer-controls-header');
      expect(header).toBeDefined();
      expect(header.querySelector('h3').textContent).toBe('Camadas');
    });

    it('should create add button', () => {
      const addBtn = container.querySelector('#add-layer-btn');
      expect(addBtn).toBeDefined();
      expect(addBtn.textContent).toBe('+');
    });

    it('should create layers list container', () => {
      const list = container.querySelector('#layers-list');
      expect(list).toBeDefined();
    });

    it('should call onAdd callback when add button clicked', () => {
      const addBtn = container.querySelector('#add-layer-btn');
      addBtn.click();
      expect(callbacks.onAdd).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should render correct number of layers', () => {
      manager.update(3, 0);
      const layers = container.querySelectorAll('.layer-item');
      expect(layers.length).toBe(3);
    });

    it('should mark active layer', () => {
      manager.update(3, 1);
      const layers = container.querySelectorAll('.layer-item');
      expect(layers[0].classList.contains('active')).toBe(false);
      expect(layers[1].classList.contains('active')).toBe(true);
      expect(layers[2].classList.contains('active')).toBe(false);
    });

    it('should display layer names correctly', () => {
      manager.update(2, 0);
      const names = container.querySelectorAll('.layer-name');
      expect(names[0].textContent).toBe('Camada 1');
      expect(names[1].textContent).toBe('Camada 2');
    });

    it('should include remove buttons', () => {
      manager.update(2, 0);
      const removeBtns = container.querySelectorAll('.remove-layer-btn');
      expect(removeBtns.length).toBe(2);
    });

    it('should call onSelect when layer clicked', () => {
      manager.update(3, 0);
      const layers = container.querySelectorAll('.layer-item');
      layers[1].click();
      expect(callbacks.onSelect).toHaveBeenCalledWith(1);
    });

    it('should call onRemove when remove button clicked', () => {
      manager.update(3, 0);
      const removeBtn = container.querySelector('.remove-layer-btn[data-index="1"]');
      removeBtn.click();
      expect(callbacks.onRemove).toHaveBeenCalledWith(1);
    });

    it('should not call onSelect when remove button clicked', () => {
      manager.update(3, 0);
      const removeBtn = container.querySelector('.remove-layer-btn[data-index="0"]');
      removeBtn.click();
      expect(callbacks.onSelect).not.toHaveBeenCalled();
    });

    it('should clear previous layers on update', () => {
      manager.update(5, 0);
      manager.update(2, 0);
      const layers = container.querySelectorAll('.layer-item');
      expect(layers.length).toBe(2);
    });
  });
});
