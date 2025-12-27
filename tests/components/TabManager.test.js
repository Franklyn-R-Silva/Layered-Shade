/**
 * TabManager.test.js
 * Tests for TabManager component
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TabManager } from '../../js/components/TabManager.js';

describe('TabManager', () => {
  let viewContext;
  let manager;

  beforeEach(() => {
    // Set up DOM structure
    document.body.innerHTML = `
      <div class="tabs">
        <button class="tab-btn active" data-tab="css">CSS</button>
        <button class="tab-btn" data-tab="dart">Dart</button>
        <button class="tab-btn" data-tab="tailwind">Tailwind</button>
      </div>
      <div id="css-content" class="tab-content active"></div>
      <div id="dart-content" class="tab-content"></div>
      <div id="tailwind-content" class="tab-content"></div>
    `;

    viewContext = {
      activeTab: 'css',
      onTabChanged: vi.fn(),
    };

    manager = new TabManager(viewContext);
  });

  describe('constructor', () => {
    it('should store view context', () => {
      expect(manager.view).toBe(viewContext);
    });

    it('should select all tab buttons', () => {
      expect(manager.tabBtns.length).toBe(3);
    });

    it('should select all tab contents', () => {
      expect(manager.tabContents.length).toBe(3);
    });
  });

  describe('switchTab', () => {
    it('should remove active from all buttons', () => {
      const dartBtn = document.querySelector('[data-tab="dart"]');
      manager.switchTab(dartBtn);

      const buttons = document.querySelectorAll('.tab-btn');
      const activeButtons = Array.from(buttons).filter((b) => b.classList.contains('active'));
      expect(activeButtons.length).toBe(1);
    });

    it('should add active to clicked button', () => {
      const dartBtn = document.querySelector('[data-tab="dart"]');
      manager.switchTab(dartBtn);

      expect(dartBtn.classList.contains('active')).toBe(true);
    });

    it('should remove active from all contents', () => {
      const dartBtn = document.querySelector('[data-tab="dart"]');
      manager.switchTab(dartBtn);

      const cssContent = document.getElementById('css-content');
      expect(cssContent.classList.contains('active')).toBe(false);
    });

    it('should add active to target content', () => {
      const dartBtn = document.querySelector('[data-tab="dart"]');
      manager.switchTab(dartBtn);

      const dartContent = document.getElementById('dart-content');
      expect(dartContent.classList.contains('active')).toBe(true);
    });

    it('should update view activeTab', () => {
      const dartBtn = document.querySelector('[data-tab="dart"]');
      manager.switchTab(dartBtn);

      expect(viewContext.activeTab).toBe('dart');
    });

    it('should call onTabChanged callback', () => {
      const tailwindBtn = document.querySelector('[data-tab="tailwind"]');
      manager.switchTab(tailwindBtn);

      expect(viewContext.onTabChanged).toHaveBeenCalledWith('tailwind');
    });
  });

  describe('init', () => {
    it('should bind click events to buttons', () => {
      const dartBtn = document.querySelector('[data-tab="dart"]');
      dartBtn.click();

      expect(viewContext.onTabChanged).toHaveBeenCalledWith('dart');
    });
  });
});
