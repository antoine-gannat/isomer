import { Isomer } from "../core/Isomer";
import { Point } from "../misc/point";
import { Size } from "../misc/size";
import { Shape } from "../shapes/shape";

const isomer = new Isomer(
  document.getElementById("canvas-1") as HTMLCanvasElement,
  {
    canvasWidth: 20,
  }
);

isomer.add(Shape.Prism(Point.Origin(), new Size(3, 3, 1)));
