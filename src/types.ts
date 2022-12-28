import type { Color } from "./misc/color";
import type { Vector } from "./misc/vector";

export type TranslateBy = [number, number, number];
export type ScaleBy = [number, number, number];
export type Position = [number, number, number];

export type Transformation = number[][];

export type IsomerOptions = {
  // Width of the screen in prisms
  canvasWidth: number;
  lightPosition?: Vector;
  originX?: number;
  originY?: number;
  lightColor?: Color;
  listenForUserInputs?: boolean;
};
