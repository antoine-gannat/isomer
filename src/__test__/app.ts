import { Isomer } from "../core/Isomer";
import { Color } from "../misc/color";
import { Point } from "../misc/point";
import { Size } from "../misc/size";
import { Prism } from "../shapes/prism";
import { Cylinder } from "../shapes/cylinder";
import { Pyramid } from "../shapes/pyramid";
import { Shape } from "../shapes/shape";

const isomer = new Isomer(
  document.getElementById("canvas-1") as HTMLCanvasElement,
  {
    horizontalPrismCount: 20,
    listenForUserInputs: true,
  }
);

let avg = 0;
let count = 0;

const els: Shape[] = [];

els.push(new Prism(Point.Origin(), new Size(3, 3, 1)));
els.push(new Prism(new Point(0, 0, 0), new Size(1, 1, 1)));
els.push(new Pyramid(new Point(0, 2, 1)));
els.push(new Cylinder(new Point(2, 2, 1), 0.5, 35, 2));

setInterval(() => {
  const start = performance.now();
  isomer.clear();
  els.forEach((el) => isomer.add(el, new Color(0, 155, 50)));
  // isomer.add(els[0], new Color(0, 155, 50));
  const end = performance.now();
  avg += end - start;
  count++;
  if (count % 30 == 0) {
    console.log("avg", avg / count);
  }
}, 1000 / 60);
