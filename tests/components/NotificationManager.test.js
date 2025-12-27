/**
 * NotificationManager.test.js
 * Tests for NotificationManager component
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotificationManager } from '../../js/components/NotificationManager.js';

describe('NotificationManager', () => {
  let copyTextElement;
  let copyBtnElement;
  let manager;

  beforeEach(() => {
    // Create mock DOM elements
    copyTextElement = document.createElement('span');
    copyTextElement.id = 'texto';
    copyBtnElement = document.createElement('button');
    copyBtnElement.id = 'copiarTexto';

    manager = new NotificationManager(copyTextElement, copyBtnElement);
  });

  describe('constructor', () => {
    it('should store references to elements', () => {
      expect(manager.copyText).toBe(copyTextElement);
      expect(manager.copyBtn).toBe(copyBtnElement);
    });
  });

  describe('showCopyFeedback', () => {
    it('should update text to success message', () => {
      manager.showCopyFeedback('css');
      expect(copyTextElement.textContent).toBe('Copiado com sucesso!');
    });

    it('should add copied class to button', () => {
      manager.showCopyFeedback('css');
      expect(copyBtnElement.classList.contains('copied')).toBe(true);
    });

    it('should revert text after timeout for CSS', async () => {
      vi.useFakeTimers();

      manager.showCopyFeedback('css');
      vi.advanceTimersByTime(2000);

      expect(copyTextElement.textContent).toBe('Clique aqui para copiar as regras (CSS)');
      expect(copyBtnElement.classList.contains('copied')).toBe(false);

      vi.useRealTimers();
    });

    it('should revert text after timeout for Dart', async () => {
      vi.useFakeTimers();

      manager.showCopyFeedback('dart');
      vi.advanceTimersByTime(2000);

      expect(copyTextElement.textContent).toBe('Clique aqui para copiar as regras (Dart)');

      vi.useRealTimers();
    });
  });

  describe('updateCopyButtonText', () => {
    it('should update text for CSS tab', () => {
      manager.updateCopyButtonText('css');
      expect(copyTextElement.textContent).toBe('Clique aqui para copiar as regras (CSS)');
    });

    it('should update text for Dart tab', () => {
      manager.updateCopyButtonText('dart');
      expect(copyTextElement.textContent).toBe('Clique aqui para copiar as regras (Dart)');
    });

    it('should default to Dart for unknown tabs', () => {
      manager.updateCopyButtonText('tailwind');
      expect(copyTextElement.textContent).toBe('Clique aqui para copiar as regras (Dart)');
    });
  });
});
