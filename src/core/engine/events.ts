import { MAX_SCALE, MIN_SCALE, RESIZE_HANDLER_TIMEOUT } from "../../constants";
import { createDispatcher, Listener } from "../../utilities/dispatcher";
import { Isomer } from "../rendering/isomer";

export interface IClick {
  x: number;
  y: number;
}

export class Events {
  private clickPosition: IClick;
  private previousTouches: IClick[] = [];
  private resizeTimeout: ReturnType<typeof setTimeout>;
  private dragHappened = false;
  private dispatcher = createDispatcher<IClick>();

  public constructor(private isomer: Isomer) {}

  public onClick(callback: Listener<IClick>): () => void {
    return this.dispatcher.listen(callback);
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
    const canvas = this.isomer.canvas.element;
    e.preventDefault();
    // if touch event
    if (e instanceof TouchEvent && e.touches.length > 1) {
      for (let i = 0; i < e.touches.length; i++) {
        this.previousTouches.push({
          x: e.touches[i].clientX - canvas.offsetLeft,
          y: e.touches[i].clientY - canvas.offsetTop,
        });
      }
    } else {
      const { clientX, clientY } = e instanceof TouchEvent ? e.touches[0] : e;
      this.clickPosition = {
        x: clientX - canvas.offsetLeft,
        y: clientY - canvas.offsetTop,
      };
    }
  }

  private mouseUpHandler() {
    // if the mouse didn't move, it's a click
    if (!this.dragHappened) {
      this.dispatcher.dispatch(this.clickPosition);
    }
    this.clickPosition = undefined;
    this.previousTouches = [];
    this.dragHappened = false;
  }

  private mouseMoveHandler(e: MouseEvent | TouchEvent) {
    if (!this.clickPosition) {
      return;
    }
    const canvas = this.isomer.canvas.element;
    this.dragHappened = true;
    e.preventDefault();
    // check for pinch zoom
    if (
      e instanceof TouchEvent &&
      e.touches.length > 1 &&
      this.previousTouches.length > 1
    ) {
      let { clientX, clientY } = e.touches[0];
      let { clientX: clientX2, clientY: clientY2 } = e.touches[1];

      clientX -= canvas.offsetLeft;
      clientY -= canvas.offsetTop;
      clientX2 -= canvas.offsetLeft;
      clientY2 -= canvas.offsetTop;

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
}
