import { DEFAULT_VERTICES_COUNT } from "../constants";
import { Drawable } from "../core/rendering/drawable";
import { Path, Point } from "../utilities";

export class Cylinder extends Drawable {
  protected createPath(): void {
    const { width, height } = this.size;
    const radius = width / 2; // radius is width divided by 2
    const origin = Point.FromOrigin([radius, radius, 0]);
    const circle = this.createCircle(origin, radius);

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

  private createCircle(
    origin: Point,
    radius: number,
    vertices = DEFAULT_VERTICES_COUNT
  ) {
    const path = new Path();

    for (let i = 0; i < vertices; i++) {
      path.push(
        new Point(
          radius * Math.cos((i * 2 * Math.PI) / vertices),
          radius * Math.sin((i * 2 * Math.PI) / vertices),
          0
        )
      );
    }

    path.translate([origin.x, origin.y, origin.z]);
    return path;
  }
}
