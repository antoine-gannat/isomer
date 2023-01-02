import { Color } from "../../misc/color";
import { Path } from "../../misc/path";
import { Point } from "../../misc/point";
import { Size } from "../../misc/size";
import { Isomer } from "./Isomer";

export abstract class Drawable {
  protected paths: Path[] = [];

  public constructor(
    public position: Point,
    protected size: Size,
    private color: Color,
    public zIndex: number = 1
  ) {
    this.buildPath();
    this.orderPaths();
  }

  /**
   * Function to implement by the child class.
   *
   * This should fill the paths array with the paths that will be rendered.
   *
   * The paths should be set in order to render at position 0:0.
   * The position will be applied later on.
   */
  protected abstract buildPath(): void;

  public render(isomer: Isomer): void {
    this.paths.forEach((path) =>
      isomer.drawPath(
        path.offset(this.position.x, this.position.y, this.position.z),
        this.color
      )
    );
  }

  protected push(path: Path): void {
    this.paths.push(path);
  }

  private orderPaths() {
    this.paths.sort((pathA, pathB) => pathB.depth() - pathA.depth());
  }
}
