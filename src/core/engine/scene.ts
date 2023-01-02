import { Drawable } from "../rendering/drawable";
import { Isomer } from "../rendering/Isomer";

export class Scene {
  protected items: Drawable[] = [];

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

  public render(isomer: Isomer) {
    this.items.forEach((item) => item.render(isomer));
  }
}
