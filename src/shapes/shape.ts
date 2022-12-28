import { Path } from "../misc/path";
import { Point } from "../misc/point";
import { ScaleBy, TranslateBy } from "../types";

export class Shape {
  public paths: Path[];

  public static Extrude(path: Path, height = 1, originShape?: Shape) {
    const shape = originShape || new Shape();

    const topPath = path.duplicate().translate([0, 0, height]);

    /* Push the top and bottom faces, top face must be oriented correctly */
    shape.push(path.duplicate().reverse());
    shape.push(topPath);

    for (let i = 0; i < path.points.length; i++) {
      shape.push(
        new Path([
          topPath.points[i],
          path.points[i],
          path.points[(i + 1) % path.points.length],
          topPath.points[(i + 1) % topPath.points.length],
        ])
      );
    }

    return shape;
  }

  public constructor(paths: Path[] = []) {
    this.paths = paths.map((path) => path.duplicate());
  }

  public duplicate(): Shape {
    return new Shape(this.paths);
  }

  public log() {
    this.paths.forEach((path, index) => {
      console.log(
        index,
        path.points.map((p) => `${p.x},${p.y},${p.z}`)
      );
    });
  }

  public clear(): Shape {
    this.paths = [];
    return this;
  }

  public push(path: Path): Shape {
    this.paths.push(path);
    return this;
  }

  public translate(delta: TranslateBy): Shape {
    this.paths.forEach((path) => {
      path.translate(delta);
    });
    return this;
  }

  public scale(origin: Point, multiplier: ScaleBy): Shape {
    this.paths.forEach((path) => {
      path.scale(origin, multiplier);
    });
    return this;
  }

  public rotateX(origin: Point, angle: number): Shape {
    this.paths.forEach((path) => {
      path.rotateX(origin, angle);
    });
    return this;
  }

  public rotateY(origin: Point, angle: number): Shape {
    this.paths.forEach((path) => {
      path.rotateY(origin, angle);
    });
    return this;
  }

  public rotateZ(origin: Point, angle: number): Shape {
    this.paths.forEach((path) => {
      path.rotateZ(origin, angle);
    });
    return this;
  }

  public orderPaths(): Shape {
    this.paths.sort(function (pathA, pathB) {
      return pathB.depth() - pathA.depth();
    });
    return this;
  }
}
