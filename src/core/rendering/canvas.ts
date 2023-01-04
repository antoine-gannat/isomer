import { Color } from "../../utilities/color";
import { Point } from "../../utilities/point";

export class Canvas {
  public width: number;
  public height: number;
  public ctx: CanvasRenderingContext2D | null;

  public constructor(public element: HTMLCanvasElement) {
    this.ctx = element.getContext("2d");
    if (!this.ctx) {
      throw new Error("Fatal: Unable to get the context from the canvas.");
    }
    this.width = element.width;
    this.height = element.height;
  }

  public clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    return this;
  }

  public path(points: Point[], color: Color, fill = true) {
    this.ctx.beginPath();
    // set start pos
    this.ctx.moveTo(points[0].x, points[0].y);

    // then draw the rest of the points
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }

    this.ctx.closePath();

    this.ctx.save();

    this.ctx.globalAlpha = color.a;
    this.ctx.fillStyle = color.toHex();
    this.ctx.strokeStyle = color.toHex();
    this.ctx.stroke();
    fill && this.ctx.fill();
    this.ctx.restore();
  }
}
