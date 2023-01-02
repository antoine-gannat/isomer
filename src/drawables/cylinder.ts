import { Drawable } from "../core/rendering/drawable";
import { Path, Point } from "../utilities";

export class Cylinder extends Drawable {
  protected createPath(): void {
    const { width, height } = this.size;
    const radius = width / 2; // radius is width divided by 2
    const origin = Point.FromOrigin([radius, radius, 0]);
    const circle = Path.Circle(origin, radius);

    const topPath = circle.duplicate().translate([0, 0, height]);

    /* Push the top and bottom faces, top face must be oriented correctly */
    this.push(circle.duplicate().reverse());
    this.push(topPath);

    for (let i = 0; i < circle.points.length; i++) {
      this.push(
        new Path([
          topPath.points[i],
          circle.points[i],
          circle.points[(i + 1) % circle.points.length],
          topPath.points[(i + 1) % topPath.points.length],
        ])
      );
    }
  }
}
