import { Path } from "../misc/path";
import { Point } from "../misc/point";
import { Shape } from "./shape";

export class Cylinder extends Shape {
  public constructor(
    origin: Point,
    radius: number,
    vertices: number,
    height: number
  ) {
    super();
    const circle = Path.Circle(origin, radius, vertices);
    Shape.Extrude(circle, height, this);
  }
}
