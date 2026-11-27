/**
 * Declarative configuration for the shadow/shape controls.
 */
import type { Key } from '../i18n.svelte';

export type ControlType = 'range' | 'color' | 'checkbox';
export type ControlCategory = 'shadow' | 'shape';

export interface ControlConfig {
  id: string;
  /** Key of the label in the i18n dictionary. */
  label: Key;
  type?: ControlType;
  min?: number;
  max?: number;
  value?: number | string;
  /** Unit shown beside the number field (range controls). */
  unit?: string;
  category: ControlCategory;
}

export const shadowControls: ControlConfig[] = [
  { id: 'horizontal', label: 'horizontal', min: -100, max: 100, value: 5, unit: 'px', category: 'shadow' },
  { id: 'vertical', label: 'vertical', min: -100, max: 100, value: 5, unit: 'px', category: 'shadow' },
  { id: 'blur', label: 'blur', min: 0, max: 100, value: 10, unit: 'px', category: 'shadow' },
  { id: 'spread', label: 'spread', min: -100, max: 100, value: 3, unit: 'px', category: 'shadow' },
  { id: 'color', label: 'shadowColor', type: 'color', value: '#000000', category: 'shadow' },
  { id: 'opacity', label: 'opacity', min: 0, max: 100, value: 100, unit: '%', category: 'shadow' },
  { id: 'inset', label: 'inset', type: 'checkbox', category: 'shadow' },
  { id: 'borderRadius', label: 'borderRadius', min: 0, max: 50, value: 0, unit: 'px', category: 'shape' },
];
