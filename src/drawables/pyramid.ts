import { Drawable } from "../core/rendering/drawable";
import { Path, Point } from "../utilities";

export class Pyramid extends Drawable {
  protected createPath(): void {
    const { width: dx = 1, height: dy = 1, depth: dz = 1 } = this.size;

    const origin = Point.Origin();
    /* Path parallel to the x-axis */
    const face1a = new Path([
      origin,
      new Point(origin.x + dx, origin.y, origin.z),
      new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z + dz),
    ]);

    /* Push the face, and its opposite face, by rotating around the Z-axis */
    this.push(face1a);
    const face1b = face1a
      .duplicate()
      .rotateZ(Point.FromPoint(origin).translate([dx / 2, dy / 2, 0]), Math.PI);
    this.push(face1b);

    /* Path parallel to the y-axis */
    const face2a = new Path([
      origin,
      new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z + dz),
      new Point(origin.x, origin.y + dy, origin.z),
    ]);
    this.push(face2a);
    const face2b = face2a
      .duplicate()
      .rotateZ(Point.FromPoint(origin).translate([dx / 2, dy / 2, 0]), Math.PI);
    this.push(face2b);
  }
}
