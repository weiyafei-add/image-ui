export interface CanvasPreset {
  name: string;
  width: number;
  height: number;
}

export type BackgroundType = "blur" | "mirror" | "color";

export type CanvasMode = "preset" | "original" | "custom";

export interface CanvasSize {
  width: number;
  height: number;
}
