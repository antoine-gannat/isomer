import { Engine } from "../core/engine/engine";
import { Scene } from "../core/engine/scene";
import { Cylinder, Prism, Pyramid } from "../drawables";
import { Color, Point, Size } from "../utilities";

const engine = new Engine({ canvasId: "canvas-1", debug: true });
const scene = new Scene();

const prism = new Prism(
  new Point(0, 0, 0),
  new Size(3, 3, 1),
  new Color(230, 50, 50)
);
const cube = new Prism(
  new Point(0, 4, 0),
  new Size(1, 1, 1),
  new Color(230, 50, 50)
);
const cube2 = new Prism(
  new Point(1, 3, 0),
  new Size(1, 1, 1),
  new Color(230, 50, 50)
);

const cylinder = new Cylinder(
  new Point(1, 1, 0),
  new Size(1, 3),
  new Color(150, 100, 250)
);

const pyramid = new Pyramid(
  new Point(0, 3, 0),
  new Size(1, 1, 2),
  new Color(50, 100, 250)
);

scene.draw([prism, cylinder, pyramid, cube, cube2]);

engine.play(scene);

let toggle = false;
engine.onTick(() => {
  const pos = prism.getPosition();
  if (toggle) {
    pos.x -= 0.1;
    prism.move(pos);
    if (pos.x <= -10) toggle = false;
  } else {
    pos.x += 0.1;
    prism.move(pos);
    if (pos.x >= 10) toggle = true;
  }
});
engine.start();
