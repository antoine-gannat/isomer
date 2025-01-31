import { Point } from "./point";

export class Vector {
  public constructor(public i: number, public j: number, public k: number) {}

  public static FromTwoPoints(p1: Point, p2: Point) {
    return new Vector(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
  }

  public crossProduct(v2: Vector) {
    const i = this.j * v2.k - v2.j * this.k;
    const j = -1 * (this.i * v2.k - v2.i * this.k);
    const k = this.i * v2.j - v2.i * this.j;

    return new Vector(i, j, k);
  }

  public dotProduct(v2: Vector) {
    return this.i * v2.i + this.j * v2.j + this.k * v2.k;
  }

  public magnitude() {
    return Math.sqrt(this.i * this.i + this.j * this.j + this.k * this.k);
  }

  public normalize() {
    const magnitude = this.magnitude();

    if (magnitude === 0) {
      return new Vector(0, 0, 0);
    }

    return new Vector(
      this.i / magnitude,
      this.j / magnitude,
      this.k / magnitude
    );
  }
}
