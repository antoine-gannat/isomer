import { IPath, IPoint, ScaleBy, TranslateBy } from "../types";
import { Point } from "./point";

export class Path implements IPath {
  public points: IPoint[];

  public static Rectangle(origin: IPoint, width = 1, height = 1) {
    return new Path([
      origin,
      new Point(origin.x + width, origin.y, origin.z),
      new Point(origin.x + width, origin.y + height, origin.z),
      new Point(origin.x, origin.y + height, origin.z),
    ]);
  }

  public static Circle(origin: IPoint, radius: number, vertices = 20) {
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

  public constructor(points: IPoint[] = []) {
    this.points = points.map((point) => point.duplicate());
  }

  public duplicate(): IPath {
    return new Path(this.points);
  }

  public push(point: IPoint): IPath {
    this.points.push(point);
    return this;
  }

  public reverse(): IPath {
    this.points = this.points.reverse();
    return this;
  }

  public translate(delta: TranslateBy): IPath {
    this.points.forEach((point) => {
      point.translate(delta);
    });
    return this;
  }

  public scale(origin: IPoint, multiplier: ScaleBy): IPath {
    this.points.forEach((point) => {
      point.scale(origin, multiplier);
    });
    return this;
  }

  public rotateX(origin: IPoint, angle: number): IPath {
    this.points.forEach((point) => {
      point.rotateX(origin, angle);
    });
    return this;
  }

  public rotateY(origin: IPoint, angle: number): IPath {
    this.points.forEach((point) => {
      point.rotateY(origin, angle);
    });
    return this;
  }

  public rotateZ(origin: IPoint, angle: number): IPath {
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
}
