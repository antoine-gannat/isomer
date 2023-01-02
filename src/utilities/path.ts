import { DEFAULT_VERTICES_COUNT } from "../constants";
import { ScaleBy, TranslateBy } from "../types";
import { Point } from "./point";

export class Path {
  public points: Point[];

  public static Rectangle(origin: Point, width = 1, height = 1) {
    return new Path([
      origin,
      new Point(origin.x + width, origin.y, origin.z),
      new Point(origin.x + width, origin.y + height, origin.z),
      new Point(origin.x, origin.y + height, origin.z),
    ]);
  }

  public static Circle(
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

  public constructor(points: Point[] = []) {
    this.points = points.map((point) => point.duplicate());
  }

  public duplicate(): Path {
    return new Path(this.points);
  }

  public push(point: Point): Path {
    this.points.push(point);
    return this;
  }

  public reverse(): Path {
    this.points = this.points.reverse();
    return this;
  }

  public translate(delta: TranslateBy): Path {
    this.points.forEach((point) => {
      point.translate(delta);
    });
    return this;
  }

  public scale(origin: Point, multiplier: ScaleBy): Path {
    this.points.forEach((point) => {
      point.scale(origin, multiplier);
    });
    return this;
  }

  public rotateX(origin: Point, angle: number): Path {
    this.points.forEach((point) => {
      point.rotateX(origin, angle);
    });
    return this;
  }

  public rotateY(origin: Point, angle: number): Path {
    this.points.forEach((point) => {
      point.rotateY(origin, angle);
    });
    return this;
  }

  public rotateZ(origin: Point, angle: number): Path {
    this.points.forEach((point) => {
      point.rotateZ(origin, angle);
    });
    return this;
  }

  public depth(): number {
    const sum = this.points.reduce((output, point) => {
      return output + point.depth();
    }, 0);

    return sum / (this.points.length || 1);
  }

  public offset(xOffset = 0, yOffset = 0, zOffset = 0): Path {
    const copy = this.duplicate();

    copy.points.forEach((point) => {
      point.x += xOffset;
      point.y += yOffset;
      point.z += zOffset;
    });

    return copy;
  }
}
