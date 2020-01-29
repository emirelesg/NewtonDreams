import * as constants from "./Constants";
import * as utils from "./Utils";
import World from "./World";
import Slider from "./dom/Slider";
import Vector from "./figures/Vector";
import Ball from "./figures/Ball";
import * as dom from "./dom/dom";
import Picture from "./figures/Picture";
import Shape from "./figures/Shape";
import Plot from "./figures/Plot";
import Box from "./figures/Box";
import DataCursor from "./figures/DataCursor";

window.requestAnimationFrame = (() => {
  function backupTimeout(callback) {
    window.setTimeout(callback, 1000 / 60);
  }
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    backupTimeout
  );
})();

window.cancelAnimationFrame = (() =>
  window.cancelAnimationFrame ||
  window.webkitCancelRequestAnimationFrame ||
  window.mozCancelRequestAnimationFrame ||
  window.oCancelRequestAnimationFrame ||
  window.msCancelRequestAnimationFrame ||
  clearTimeout)();

/**
 * The libray is exposed to the window object through this object.
 * Constants can be found by accessing p$.constants.
 * Utils can be accessed through p$.utils.
 * @type {object}
 */
const p$ = constants;
p$.Box = Box;
p$.Ball = Ball;
p$.Box = Box;
p$.Picture = Picture;
p$.Plot = Plot;
p$.Shape = Shape;
p$.Slider = Slider;
p$.Vector = Vector;
p$.World = World;
p$.utils = utils;
p$.dom = dom;
p$.DataCursor = DataCursor;
window.p$ = p$;
