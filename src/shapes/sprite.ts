import { Isomer } from "../core/isomer";
import { Image } from "./image";
import { Point } from "../misc/point";

/**
 * Used to render an image on the isometric canvas.
 */
export class Sprite extends Image {
  private frameIndex = 0;
  private frameCount: number;

  public constructor(
    position: Point,
    size: number,
    asset: HTMLImageElement,
    private frameWidth: number
  ) {
    super(position, size, asset);
    this.ratio = this.asset.height / frameWidth;
    // calculate the image ratio
    this.frameCount = Math.round(this.asset.width / this.frameWidth);
  }
  /**
   * Play the next frame of the animation.
   * @returns True if the animation is finished
   */
  public nextFrame(): boolean {
    this.frameIndex++;
    if (this.frameIndex >= this.frameCount) {
      this.frameIndex = 0;
      return true;
    }
    return false;
  }

  public render(isomer: Isomer): void {
    const { ctx } = isomer.canvas;

    const width = this.size * isomer.scale;
    const { x, y } = isomer.translatePoint(this.position);
    // Display the frame of the sprite
    ctx.drawImage(
      this.asset,
      this.frameIndex * this.frameWidth,
      0,
      this.frameWidth,
      this.asset.height,
      /* position X */ x,
      /* position Y */ y,
      /* width */ width,
      /* height */ width * this.ratio
    );
  }
}
