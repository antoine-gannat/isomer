import { Isomer } from "../core/rendering/Isomer";
import { Point } from "../misc/Point";

/**
 * Used to render an image on the isometric canvas.
 */
export class Image {
  protected ratio: number;

  public constructor(
    protected position: Point,
    protected size: number,
    protected asset: HTMLImageElement
  ) {
    // calculate the image width to height ratio
    this.ratio = this.asset.height / this.asset.width;
  }

  public render(isomer: Isomer): void {
    const { ctx } = isomer.canvas;

    // width: this.size * isomer.scale
    // height: this.size * isomer.scale * this.ratio

    // convert width to height

    const width = this.size * isomer.scale;
    const { x, y } = isomer.translatePoint(this.position);
    ctx.drawImage(
      this.asset,
      /* position X */ x,
      /* position Y */ y,
      /* width */ width,
      /* height */ width * this.ratio
    );
  }
}
