import { Color } from "../misc/color";
import { Path } from "../misc/path";
import { Point } from "../misc/point";
import { Size } from "../misc/size";
import { Shape } from "./shape";

export class Prism extends Shape {
  public constructor(origin: Point, dimensions: Size, color?: Color) {
    super(undefined, color);
    const { width: dx = 1, height: dy = 1, depth: dz = 1 } = dimensions;

    /* Squares parallel to the x-axis */
    const face1a = new Path([
      origin,
      new Point(origin.x + dx, origin.y, origin.z),
      new Point(origin.x + dx, origin.y, origin.z + dz),
      new Point(origin.x, origin.y, origin.z + dz),
    ]);

    /* Push this face and its opposite */
    this.push(face1a);
    const face1b = face1a.duplicate().reverse().translate([0, dy, 0]);
    this.push(face1b);

    /* Square parallel to the y-axis */
    const face2a = new Path([
      origin,
      new Point(origin.x, origin.y, origin.z + dz),
      new Point(origin.x, origin.y + dy, origin.z + dz),
      new Point(origin.x, origin.y + dy, origin.z),
    ]);
    this.push(face2a);
    const face2b = face2a.duplicate().reverse().translate([dx, 0, 0]);
    this.push(face2b);

    /* Square parallel to the xy-plane */
    const face3a = new Path([
      origin,
      new Point(origin.x + dx, origin.y, origin.z),
      new Point(origin.x + dx, origin.y + dy, origin.z),
      new Point(origin.x, origin.y + dy, origin.z),
    ]);
    /* This surface is oriented backwards, so we need to reverse the points */
    const face3b = face3a.duplicate().translate([0, 0, dz]);

    this.push(face3a.reverse());
    this.push(face3b);
  }
}
