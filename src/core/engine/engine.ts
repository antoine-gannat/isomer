import { ENGINE_REFRESH_RATE } from "../../constants";
import { Isomer } from "../rendering/Isomer";
import { Scene } from "./scene";

export class Engine {
  private interval: number = -1;
  private onTickListener: (() => void) | undefined = undefined;
  private isomer: Isomer;

  private activeScene: Scene | null = null;

  public constructor(canvasId: string) {
    this.isomer = new Isomer(canvasId, { horizontalPrismCount: 20 });
  }

  // Start the engine loop
  public start() {
    this.interval = setInterval(() => this.mainLoop(), ENGINE_REFRESH_RATE);
  }

  // Stop the engine loop
  public stop() {
    if (this.interval === -1) {
      return;
    }
    clearInterval(this.interval);
  }

  // Register a callback to be called on each tick/render
  public onTick(onTick: () => void) {
    this.onTickListener = onTick;
  }

  // Set the active scene
  public play(scene: Scene) {
    this.activeScene = scene;
  }

  private mainLoop() {
    this.onTickListener?.();
    this.isomer.clear();
    this.activeScene && this.activeScene.render(this.isomer);
  }
}
