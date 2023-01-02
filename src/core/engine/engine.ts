import { ENGINE_REFRESH_RATE } from "../../constants";
import { Isomer } from "../rendering/Isomer";
import { Events } from "./events";
import { Scene } from "./scene";

interface IEngineOptions {
  canvasId: string;
  // Only to be used during development
  debug?: boolean;
}

export class Engine {
  private interval: number = -1;
  private onTickListener: (() => void) | undefined = undefined;
  private isomer: Isomer;
  private eventManager: Events;

  private activeScene: Scene | null = null;

  public constructor(private options: IEngineOptions) {
    this.isomer = new Isomer(this.options.canvasId, {
      horizontalPrismCount: 20,
    });
    this.eventManager = new Events(this.isomer);
  }

  // Start the engine loop
  public start() {
    this.eventManager.startListening();
    this.interval = setInterval(() => {
      const start = performance.now();
      this.mainLoop();
      this.updateDebugPanel(performance.now() - start);
    }, ENGINE_REFRESH_RATE);
  }

  // Stop the engine loop
  public stop() {
    this.eventManager.stopListening();
    this.interval != -1 && clearInterval(this.interval);
  }

  // Register a callback to be called on each tick/render
  public onTick(onTick: () => void) {
    this.onTickListener = onTick;
  }

  // Set the active scene
  public play(scene: Scene | null) {
    this.activeScene = scene;
  }

  private mainLoop() {
    this.onTickListener?.();
    this.isomer.clear();
    this.isDebug() && this.isomer.debugGrid();
    this.activeScene && this.activeScene.render(this.isomer);
  }

  private isDebug(): boolean {
    return this.options.debug || false;
  }

  // debug panel displaying the fps
  private updateDebugPanel(frameDuration: number) {
    if (!this.isDebug()) {
      return;
    }

    let debugPanel = document.getElementById("debug-panel");
    if (!debugPanel) {
      debugPanel = document.createElement("div");
      debugPanel.setAttribute("id", "debug-panel");
      document.body.appendChild(debugPanel);
    }
    // only update once every 500ms
    if (
      Date.now() - Number(debugPanel.getAttribute("data-last-update") || 0) <
      500
    ) {
      return;
    }
    debugPanel.setAttribute("data-last-update", Date.now().toString());
    debugPanel.innerHTML = `MAX FPS: ${(1000 / frameDuration).toPrecision(
      4
    )} [${frameDuration.toPrecision(2)}ms/${ENGINE_REFRESH_RATE.toPrecision(
      2
    )}ms]`;
  }
}
