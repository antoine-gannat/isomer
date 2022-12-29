import { RESIZE_HANDLER_TIMEOUT } from "../constants";
import { Color } from "../misc/color";
import { Events } from "../misc/events";
import { Path } from "../misc/path";
import { Point } from "../misc/point";
import { Vector } from "../misc/vector";
import { Image } from "../shapes/image";
import { Shape } from "../shapes/shape";
import { Sprite } from "../shapes/sprite";
import { Position, Transformation } from "../types";
import { Canvas } from "./canvas";

type IsomerOptions = {
  // Width of the screen in prisms
  horizontalPrismCount: number;
  // toggle resize handling
  handleResize?: boolean;
  lightPosition?: Vector;
  originX?: number;
  originY?: number;
  lightColor?: Color;
  listenForUserInputs?: boolean;
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
  private transformation: Transformation;
  private resizeTimeout: ReturnType<typeof setTimeout>;
  private Events: Events;

  public constructor(
    canvas: HTMLCanvasElement,
    private options: IsomerOptions
  ) {
    this.canvas = new Canvas(canvas);
    this.angle = Math.PI / 6;

    this.setScale(this.calculateScale());

    this.calculateOrigins();
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
    // Handle user navigation events
    this.Events = new Events(this);
    this.options.listenForUserInputs && this.Events.listenForUserEvents();

    // Handle resize of the screen
    this.options.handleResize &&
      window.addEventListener("resize", this.resizeHandler.bind(this));
  }

  public resize(newWidth: number, newHeight: number, scale: number): void {
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

  public setLightPosition(position: Position): void {
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
   * Draw an item on the canvas
   */
  public add(
    item: Path | Shape | Image | Sprite,
    baseColor: Color = new Color(120, 120, 120)
  ): void {
    if (item instanceof Path) {
      this.addPath(item, baseColor);
    } else if (item instanceof Shape) {
      /* Fetch paths ordered by distance to prevent overlaps */
      const paths = item.orderPaths().paths;

      for (let j = 0; j < paths.length; j++) {
        this.addPath(paths[j], baseColor);
      }
    } else if (item instanceof Image) {
      item.render(this);
    }
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
  public drawGrid() {
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

  public dispose() {
    this.Events.stopListeningForUserEvents();
    this.options.handleResize &&
      window.removeEventListener("resize", this.resizeHandler);
  }

  private calculateScale(): number {
    return Math.round(window.innerWidth / this.options.horizontalPrismCount);
  }

  private resizeHandler() {
    // use timeout to only call the resize handler once instead of calling it at every event
    this.resizeTimeout && clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.resize(window.innerWidth, window.innerHeight, this.calculateScale());
    }, RESIZE_HANDLER_TIMEOUT);
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

  private addPath(path: Path, baseColor: Color) {
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
