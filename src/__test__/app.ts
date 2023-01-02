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

const cylinder = new Cylinder(
  new Point(1, 1, 0),
  new Size(1, 3),
  new Color(150, 100, 250)
);

const pyramid = new Pyramid(
  new Point(0, 3, 0),
  new Size(1, 1, 2),
  new Color(50, 100, 250),
  0
);

scene.draw([prism, cylinder, pyramid]);

engine.play(scene);

engine.onTick(() => {
  const pos = prism.getPosition();
  const size = prism.getSize();
  if (pos.x <= 10) {
    pos.x += 0.1;
    prism.move(pos);
  } else {
    pos.x = -7;
    size.width += 1;
    prism.resize(size);
    prism.move(pos);
  }
});
engine.start();
