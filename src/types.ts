import type { Shape } from "./shapes/shape";

export type TranslateBy = [number, number, number];
export type ScaleBy = [number, number, number];
export type Position = [number, number, number];

export type Transformation = number[][];

export type Drawable = Shape;
