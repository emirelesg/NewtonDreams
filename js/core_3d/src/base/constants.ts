import {
    Color,
    Font
} from "three";
const rawFont = require('three/examples/fonts/helvetiker_regular.typeface.json');

export class Constants {

  public static readonly FONT = new Font(rawFont);
  public static readonly SCENE_BG_COLOR = new Color('rgb(250, 250, 250)');
  public static readonly AXIS_SIZE = 100;
  public static readonly AXIS_COLOR = new Color('rgb(170, 170, 180)');
  public static readonly AXIS_GRID_COLOR = new Color('rgb(0, 0, 0)');
  public static readonly AXIS_GRID_OPACITY = 0.05;
  public static readonly AXIS_UNITS_COLOR = new Color('rgb(150, 150, 150)');
  public static readonly AXIS_UNITS_STEP = 10;
  
}