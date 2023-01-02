import { MAX_SCALE, MIN_SCALE, RESIZE_HANDLER_TIMEOUT } from "../../constants";
import { Isomer } from "../rendering/isomer";

export class Events {
  private clickPosition: { x: number; y: number };
  private previousTouches: { x: number; y: number }[] = [];
  private resizeTimeout: ReturnType<typeof setTimeout>;

  public constructor(private isomer: Isomer) {}

  private zoom(delta: number, scrollSpeed = 2) {
    // scroll up
    if (delta > 0 && this.isomer.scale - scrollSpeed > MIN_SCALE) {
      this.isomer.setScale(this.isomer.scale - scrollSpeed);
    } else if (delta < 0 && this.isomer.scale + scrollSpeed < MAX_SCALE) {
      // scroll down
      this.isomer.setScale(this.isomer.scale + scrollSpeed);
    }
  }

  private wheelHandler(e: WheelEvent) {
    e.preventDefault();
    this.zoom(e.deltaY);
  }

  private mouseDownHandler(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    if (e instanceof TouchEvent && e.touches.length > 1) {
      for (let i = 0; i < e.touches.length; i++) {
        this.previousTouches.push({
          x: e.touches[i].clientX,
          y: e.touches[i].clientY,
        });
      }
    } else {
      const { clientX, clientY } = e instanceof TouchEvent ? e.touches[0] : e;
      this.clickPosition = { x: clientX, y: clientY };
    }
  }

  private mouseUpHandler() {
    this.clickPosition = undefined;
    this.previousTouches = [];
  }

  private mouseMoveHandler(e: MouseEvent | TouchEvent) {
    if (!this.clickPosition) {
      return;
    }
    e.preventDefault();
    // check for pinch zoom
    if (
      e instanceof TouchEvent &&
      e.touches.length > 1 &&
      this.previousTouches.length > 1
    ) {
      const { clientX, clientY } = e.touches[0];
      const { clientX: clientX2, clientY: clientY2 } = e.touches[1];
      const currentDistance = Math.hypot(
        clientX - clientX2,
        clientY - clientY2
      );
      const previousDistance = Math.hypot(
        this.previousTouches[0].x - this.previousTouches[1].x,
        this.previousTouches[0].y - this.previousTouches[1].y
      );
      this.zoom(currentDistance > previousDistance ? -1 : 1, 0.5);
      this.previousTouches = [
        { x: clientX, y: clientY },
        { x: clientX2, y: clientY2 },
      ];
      return;
    }
    const { clientX, clientY } = e instanceof MouseEvent ? e : e.touches[0];
    // calculate the delta between the last mouse and the current mouse position
    const deltaX = Math.floor(clientX - this.clickPosition.x);
    const deltaY = Math.floor(clientY - this.clickPosition.y);

    // update the pos to the new current pos
    this.clickPosition.x = clientX;
    this.clickPosition.y = clientY;

    // change the canvas origin based on the delta
    this.isomer.setOrigin(
      this.isomer.originX + deltaX,
      this.isomer.originY + deltaY
    );
  }

  private resizeHandler() {
    // use timeout to only call the resize handler once instead of calling it at every event
    this.resizeTimeout && clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.isomer.resize(window.innerWidth, window.innerHeight);
    }, RESIZE_HANDLER_TIMEOUT);
  }

  public startListening() {
    const canvas = this.isomer.canvas.element;
    // listen for resize
    window.addEventListener("resize", this.resizeHandler.bind(this));
    // listen for wheel events to zoom in and out
    canvas.addEventListener("wheel", this.wheelHandler.bind(this), {
      passive: false,
    });

    // listen for mouse move events to move the canvas around
    canvas.addEventListener("mousedown", this.mouseDownHandler.bind(this));
    canvas.addEventListener("touchstart", this.mouseDownHandler.bind(this), {
      passive: false,
    });
    canvas.addEventListener("mouseup", this.mouseUpHandler.bind(this));
    canvas.addEventListener("touchend", this.mouseUpHandler.bind(this));
    canvas.addEventListener("touchmove", this.mouseMoveHandler.bind(this), {
      passive: false,
    });
    canvas.addEventListener("mousemove", this.mouseMoveHandler.bind(this));
  }

  public stopListening() {
    const canvas = this.isomer.canvas.element;
    // clear timeout if set
    this.resizeTimeout && clearTimeout(this.resizeTimeout);

    window.removeEventListener("resize", this.resizeHandler.bind(this));
    canvas.removeEventListener("wheel", this.wheelHandler.bind(this));
    canvas.removeEventListener("mousedown", this.mouseDownHandler.bind(this));
    canvas.removeEventListener("touchstart", this.mouseDownHandler.bind(this));
    canvas.removeEventListener("mouseup", this.mouseUpHandler.bind(this));
    canvas.removeEventListener("touchend", this.mouseUpHandler.bind(this));
    canvas.removeEventListener("touchmove", this.mouseMoveHandler.bind(this));
    canvas.removeEventListener("mousemove", this.mouseMoveHandler.bind(this));
  }
}
