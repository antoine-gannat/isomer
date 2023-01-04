import { Drawable } from "../rendering/drawable";
import { Isomer } from "../rendering/Isomer";
import { Events, IClick } from "./events";

export class Scene {
  protected items: Drawable[] = [];
  private isomer: Isomer | null = null;
  private eventManager: Events | null = null;

  private onClickCleanupCallback: (() => void) | null = null;

  public draw(item: Drawable | Drawable[]) {
    this.items.push(...(Array.isArray(item) ? item : [item]));
    // sort items based on the one with the lowest x and y positions
    this.items.sort((a, b) => {
      const posA = a.getPosition();
      const posB = b.getPosition();
      if (posA.y < posB.y) return 1;
      if (posA.y > posB.y) return -1;
      if (posA.x < posB.x) return 1;
      if (posA.x > posB.x) return -1;
      return 0;
    });
  }

  // Initialize the scene, don't call directly, this will be called by the engine.
  public init(isomer: Isomer, eventManager: Events) {
    this.isomer = isomer;
    this.eventManager = eventManager;
    this.onClickCleanupCallback = this.eventManager.onClick((click) => {
      const clickedItem = this.getClickItem(click);
      console.log(clickedItem);
    });
  }

  // Cleanup the scene, don't call directly, this will be called by the engine.
  public destroy() {
    this.onClickCleanupCallback?.();
  }

  // Render the scene, don't call directly, this will be called by the engine.
  public render() {
    this.items.forEach((item) => item.render(this.isomer));
  }

  private getClickItem(_click: IClick): Drawable | null {
    const clickedItem = this.items.find((_item) => {
      // to implement
      return false;
    });
    return clickedItem || null;
  }
}
