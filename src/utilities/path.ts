import { ScaleBy, TranslateBy } from "../types";
import { Point } from "./point";

export class Path {
  public points: Point[];

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
