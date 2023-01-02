import { Color } from "../../utilities/color";
import { Path } from "../../utilities/path";
import { Point } from "../../utilities/point";
import { Size } from "../../utilities/size";
import { Isomer } from "./Isomer";

export abstract class Drawable {
  // Original path which is based on the position 0:0:0
  protected paths: Path[] = [];
  // Modified path which is based on the position
  private pathsWithPos: Path[] = [];

  public constructor(
    protected position: Point,
    protected size: Size,
    public color: Color
  ) {
    this.createPath();
    this.orderPaths();
    this.move(position);
  }

  /**
   * Function to implement by the child class.
   *
   * This should fill the paths array with the paths that will be rendered.
   *
   * The paths should be set in order to render at position 0:0.
   * The position will be applied later on.
   */
  protected abstract createPath(): void;

  public render(isomer: Isomer): void {
    this.pathsWithPos.forEach((path) => isomer.drawPath(path, this.color));
  }

  public move(to: Point): void {
    // change the position
    this.position = to;
    // update the paths
    this.pathsWithPos = this.paths.map((path) =>
      path.offset(this.position.x, this.position.y, this.position.z)
    );
  }

  public resize(newSize: Size): void {
    this.size = newSize;
    // we have to recreate the paths on size change
    this.createPath();
    this.orderPaths();
    this.move(this.position);
  }

  public getPosition(): Point {
    return this.position;
  }

  public getSize(): Size {
    return this.size;
  }

  protected push(path: Path): void {
    this.paths.push(path);
  }

  private orderPaths() {
    this.paths.sort((pathA, pathB) => pathB.depth() - pathA.depth());
  }
}
