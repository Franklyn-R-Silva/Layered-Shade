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
  /** Hidden layers stay in the list but are left out of the preview and every export. */
  hidden?: boolean;
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

/** The user's text for the text preview (the shadow layers become its `text-shadow`). */
export interface TextProps {
  content: string;
  /** Family name only: letters, digits, space, `_`, `-` (it goes into CSS and generated code). */
  font: string;
  size: number;
  /** 100–900, step 100. */
  weight: number;
  color: string;
}

/** The full generator state. */
export interface ShadowState {
  layers: ShadowLayer[];
  currentLayerIndex: number;
  backgroundLayers: BackgroundLayer[];
  /** -1 = base color selected. */
  currentBgLayerIndex: number;
  boxProperties: BoxProperties;
  text: TextProps;
}

/** Output tab / copy mode. */
export type CodeMode = 'css' | 'tailwind' | 'dart' | 'compose' | 'swiftui' | 'rn';

/** What the preview draws the shadow on. */
export type PreviewContext = 'box' | 'card' | 'button' | 'text';
