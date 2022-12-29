import { Isomer } from "../core/Isomer";
import { Point } from "../misc/point";
import { Size } from "../misc/size";
import { Prism } from "../shapes/prism";
import { Cylinder } from "../shapes/cylinder";
import { Pyramid } from "../shapes/pyramid";
import { Shape } from "../shapes/shape";
import { Color } from "../misc/color";

const isomer = new Isomer("canvas-1", {
  horizontalPrismCount: 20,
  listenForUserInputs: true,
  handleResize: true,
});

const els: Shape[] = [];

els.push(new Prism(Point.Origin(), new Size(3, 3, 1), new Color(230, 50, 50)));
els.push(new Pyramid(new Point(0, 2, 1), undefined, new Color(40, 250, 50)));
els.push(new Cylinder(new Point(2, 2, 1), 0.5, 35, 2, new Color(230, 10, 150)));

setInterval(() => {
  isomer.clear();
  isomer.debugGrid();
  els.forEach((el) => isomer.draw(el));
}, 1000 / 60);
