import { Drawable } from "../rendering/drawable";
import { Isomer } from "../rendering/Isomer";

export class Scene {
  protected items: Drawable[] = [];

  public draw(item: Drawable) {
    this.items.push(item);
    this.items.sort((a, b) => b.zIndex - a.zIndex);
  }

  public render(isomer: Isomer) {
    this.items.forEach((item) => item.render(isomer));
  }
}
