import { Isomer } from "../core/Isomer";
import { Color } from "../misc/color";
import { Point } from "../misc/point";
import { Size } from "../misc/size";
import { Cylinder } from "../shapes/cylinder";
import { Prism } from "../shapes/prism";
import { Pyramid } from "../shapes/pyramid";

const isomer = new Isomer(
  document.getElementById("canvas-1") as HTMLCanvasElement,
  {
    canvasWidth: 20,
  }
);

isomer.add(new Prism(Point.Origin(), new Size(3, 3, 1)));
isomer.add(new Pyramid(new Point(0, 2, 1)), new Color(160, 60, 50));
isomer.add(new Cylinder(new Point(2, 2, 1), 0.5, 35, 2), new Color(0, 155, 50));
