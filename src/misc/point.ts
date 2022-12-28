import { IPoint, ScaleBy, TranslateBy } from "../types";

export class Point implements IPoint {
  public static Origin() {
    return new Point(0, 0, 0);
  }

  public static FromPoint(source: Point) {
    return new Point(source.x, source.y, source.z);
  }

  public static FromOrigin(delta: TranslateBy) {
    const point = Point.Origin();
    point.translate(delta);
    return point;
  }

  public constructor(public x: number, public y: number, public z: number) {}

  public duplicate() {
    return Point.FromPoint(this);
  }

  public translate(delta: TranslateBy): IPoint {
    const [x = 0, y = 0, z = 0] = delta;
    this.x += x;
    this.y += y;
    this.z += z;
    return this;
  }

  public translateCpy(delta: TranslateBy): IPoint {
    const [x = 0, y = 0, z = 0] = delta;
    const cpy = this.duplicate();
    cpy.x += x;
    cpy.y += y;
    cpy.z += z;
    return cpy;
  }

  public scale(origin: IPoint, multiplier: ScaleBy) {
    const [x, y, z] = multiplier;

    this.translate([-origin.x, -origin.y, -origin.z]);

    this.x *= x;
    this.y *= y;
    this.z *= z;

    this.translate([origin.x, origin.y, origin.z]);
    return this;
  }

  public rotateX(origin: IPoint, angle: number) {
    this.translate([-origin.x, -origin.y, -origin.z]);
    const z = this.z * Math.cos(angle) - this.y * Math.sin(angle);
    const y = this.z * Math.sin(angle) + this.y * Math.cos(angle);
    this.z = z;
    this.y = y;

    this.translate([origin.x, origin.y, origin.z]);
    return this;
  }

  public rotateY(origin: IPoint, angle: number) {
    this.translate([-origin.x, -origin.y, -origin.z]);
    const x = this.x * Math.cos(angle) - this.z * Math.sin(angle);
    const z = this.x * Math.sin(angle) + this.z * Math.cos(angle);
    this.x = x;
    this.z = z;
    this.translate([origin.x, origin.y, origin.z]);
    return this;
  }

  public rotateZ(origin: IPoint, angle: number) {
    this.translate([-origin.x, -origin.y, -origin.z]);
    const x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
    const y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
    this.x = x;
    this.y = y;
    this.translate([origin.x, origin.y, origin.z]);
    return this;
  }

  public depth() {
    return this.x + this.y - 2 * this.z;
  }

  public distance(to: IPoint) {
    const dx = to.x - this.x;
    const dy = to.y - this.y;
    const dz = to.z - this.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}
