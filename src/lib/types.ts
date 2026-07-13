/**
 * Shared domain types for the Layered Shade box-shadow generator.
 */

/** A single box-shadow layer. */
export interface ShadowLayer {
  horizontal: number;
  vertical: number;
  blur: number;
  spread: number;
  /** Hex color, e.g. `#000000`. */
  color: string;
  /** 0–1. */
  opacity: number;
  inset: boolean;
}

/** A gradient color stop. */
export interface GradientStop {
  color: string;
  /** 0–100. */
  position: number;
}

/** A background gradient layer. */
export interface BackgroundLayer {
  type: 'linear' | 'radial';
  /** Angle for linear gradients (degrees). */
  angle: number;
  /** Shape for radial gradients. */
  shape: 'circle' | 'ellipse';
  stops: GradientStop[];
  opacity: number;
  /** Radial center X (0–100). */
  posX?: number;
  /** Radial center Y (0–100). */
  posY?: number;
  /** Radial size keyword (e.g. `farthest-corner`, `closest-side`). */
  size?: string;
}

/** Global box (shape/canvas) properties. */
export interface BoxProperties {
  borderRadius: number;
  backgroundColor: string;
  canvasColor: string;
}

/** The full generator state. */
export interface ShadowState {
  layers: ShadowLayer[];
  currentLayerIndex: number;
  backgroundLayers: BackgroundLayer[];
  /** -1 = base color selected. */
  currentBgLayerIndex: number;
  boxProperties: BoxProperties;
}

/** Output tab / copy mode. */
export type CodeMode = 'css' | 'dart' | 'tailwind';
