import { Drawable } from "../rendering/drawable";
import { Isomer } from "../rendering/Isomer";

export class Scene {
  protected items: Drawable[] = [];

  public draw(item: Drawable | Drawable[]) {
    this.items.push(...(Array.isArray(item) ? item : [item]));
    // sort based on index before rendering
    this.items.sort((a, b) => a.zIndex - b.zIndex);
  }

  public render(isomer: Isomer) {
    this.items.forEach((item) => item.render(isomer));
  }
}
