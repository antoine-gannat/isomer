import { Color, Path, Point, Vector } from "../../utilities";
import { Canvas } from "./canvas";

type IsomerOptions = {
  // Width of the screen in prisms
  horizontalPrismCount: number;
  lightPosition?: Vector;
  originX?: number;
  originY?: number;
  lightColor?: Color;
};

export class Isomer {
  public canvas: Canvas;
  public scale: number;
  public originX: number;
  public originY: number;

  private angle: number;
  private lightPosition: Vector;
  private lightAngle: Vector;
  private colorDifference: number;
  private lightColor: Color;
  private transformation: number[][];

  public constructor(
    canvas: HTMLCanvasElement | string,
    private options: IsomerOptions
  ) {
    this.canvas = new Canvas(
      typeof canvas === "string"
        ? (document.getElementById(canvas) as HTMLCanvasElement)
        : canvas
    );
    this.angle = Math.PI / 6;

    // init the height and width of the canvas
    this.resize(window.innerWidth, window.innerHeight);
    /**
     * Light source as defined as the angle from
     * the object to the source.
     *
     * We'll define somewhat arbitrarily for now.
     */
    this.lightPosition = this.options.lightPosition || new Vector(2, -1, 3);
    this.lightAngle = this.lightPosition.normalize();

    /**
     * The maximum color difference from shading
     */
    this.colorDifference = 0.2;
    this.lightColor = this.options.lightColor || new Color(255, 255, 255);
  }

  public resize(
    newWidth: number,
    newHeight: number,
    scale: number = this.calculateScale()
  ): void {
    this.canvas.height = this.canvas.element.height = newHeight;
    this.canvas.width = this.canvas.element.width = newWidth;
    this.setScale(scale);
    this.calculateOrigins();
  }

  public setAngle(newAngle: number): void {
    this.angle = newAngle;
    this.transformation = this.calculateTransformation();
  }

  public setScale(newScale: number): void {
    this.scale = newScale;

    this.transformation = this.calculateTransformation();
  }

  public setLightPosition(position: [number, number, number]): void {
    const [x, y, z] = position;
    this.lightPosition = new Vector(x, y, z);
    this.lightAngle = this.lightPosition.normalize();
  }

  public translatePoint(point: Point): Point {
    const xMap = new Point(
      point.x * this.transformation[0][0],
      point.x * this.transformation[0][1],
      0
    );

    const yMap = new Point(
      point.y * this.transformation[1][0],
      point.y * this.transformation[1][1],
      0
    );

    const x = this.originX + xMap.x + yMap.x;
    const y = this.originY - xMap.y - yMap.y - point.z * this.scale;

    return new Point(x, y, 0);
  }

  /**
   * Clear the canvas.
   */
  public clear() {
    this.canvas.clear();
  }

  /**
   * Draw a grid on the canvas, useful for debugging.
   */
  public debugGrid() {
    for (
      let x = -this.options.horizontalPrismCount;
      x < this.options.horizontalPrismCount;
      x++
    ) {
      for (
        let y = -this.options.horizontalPrismCount;
        y < this.options.horizontalPrismCount;
        y++
      ) {
        this.canvas.path(
          [
            this.translatePoint(new Point(x, y, 0)),
            this.translatePoint(new Point(x + 1, y, 0)),
            this.translatePoint(new Point(x + 1, y + 1, 0)),
            this.translatePoint(new Point(x, y + 1, 0)),
          ],
          new Color(0, 0, 0),
          /* fill */ false
        );
      }
    }
  }

  public setOrigin(x: number, y: number): void {
    this.originX = x;
    this.originY = y;
  }

  /**
   * Draw a path on the canvas.
   */
  public drawPath(path: Path, baseColor: Color): void {
    /* Compute color */
    const v1 = Vector.FromTwoPoints(path.points[1], path.points[0]);
    const v2 = Vector.FromTwoPoints(path.points[2], path.points[1]);

    const normal = v1.crossProduct(v2).normalize();

    /**
     * Brightness is between -1 and 1 and is computed based
     * on the dot product between the light source vector and normal.
     */
    const brightness = normal.dotProduct(this.lightAngle);
    const color = baseColor
      .duplicate()
      .lighten(brightness * this.colorDifference, this.lightColor);

    const range = {
      minX: Number.MAX_VALUE,
      maxX: -Number.MAX_VALUE,
      minY: Number.MAX_VALUE,
      maxY: -Number.MAX_VALUE,
    };

    const translatedPoints = path.points.map((point) => {
      const translatedPoint = this.translatePoint(point);
      range.minX = Math.min(range.minX, translatedPoint.x);
      range.maxX = Math.max(range.maxX, translatedPoint.x);
      range.minY = Math.min(range.minY, translatedPoint.y);
      range.maxY = Math.max(range.maxY, translatedPoint.y);
      return translatedPoint;
    });

    // Leave if all points in the path are out of the canvas.
    if (
      range.minX > this.canvas.width ||
      range.maxX < 0 ||
      range.minY > this.canvas.height ||
      range.maxY < 0
    ) {
      return;
    }
    this.canvas.path(translatedPoints, color);
  }

  private calculateScale(): number {
    return Math.round(window.innerWidth / this.options.horizontalPrismCount);
  }

  private calculateOrigins(): void {
    this.originX =
      this.options.originX !== undefined
        ? this.options.originX
        : this.canvas.width / 2;
    this.originY =
      this.options.originY !== undefined
        ? this.options.originY
        : this.canvas.height / 2;
  }

  /**
   * Precalculates transformation values based on the current angle and scale
   * which in theory reduces costly cos and sin calls
   */
  private calculateTransformation() {
    return [
      [this.scale * Math.cos(this.angle), this.scale * Math.sin(this.angle)],
      [
        this.scale * Math.cos(Math.PI - this.angle),
        this.scale * Math.sin(Math.PI - this.angle),
      ],
    ];
  }
}
