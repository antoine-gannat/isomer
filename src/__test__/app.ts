import { Engine } from "../core/engine/engine";
import { Scene } from "../core/engine/scene";
import { Color } from "../misc/color";
import { Point } from "../misc/point";
import { Size } from "../misc/size";
import { Prism } from "../shapes/prism";

const engine = new Engine("canvas-1");
const scene = new Scene();

const prism = new Prism(
  new Point(0, 0, 0),
  new Size(3, 3, 1),
  new Color(230, 50, 50)
);

scene.draw(prism);

engine.play(scene);

engine.onTick(() => {
  prism.position.x += Math.random();
  prism.position.y += Math.random();
  prism.position.x -= Math.random();
  prism.position.y -= Math.random();
});
engine.start();
