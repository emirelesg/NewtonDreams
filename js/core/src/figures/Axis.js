import * as utils from "../Utils";
import * as constants from "../Constants";
import WorldElement from "../WorldElement";
import Renderer from "../Renderer";

/**
 * The Axis class is responsible for drawing the axis onto the canvas and setting the new
 * origin used for the canvas. All objects displayed will be referenced to the position of the axis.
 * Therefore, by changing its position the origin is also displaced.
 * @private
 * @class Axis
 */
export default class Axis extends WorldElement {

  /**
   * @constructor
   * @param {number} [width=0] Initial width of the axis.
   * @param {number} [height=0] Initial height of the canvas.
   * @param {object} [opts] Object that contains valid Axis properties with values. Their values will be assigned at the end of the constructor. If an invalid property is passed then the value will be ignored.
   */
  constructor(width, height, opts) {
    
    // Extend WorldElement.
    super();

    /**
     * Sets the current height of the axis.
     * @type {number}
     */
    this.height = height || 0;

    /**
     * Sets the current width of the axis.
     * @type {number}
     */
    this.width = width || 0;

    /**
     * Flag for allowing the axis to be dragged around.
     * Default value is true.
     * @type {boolean}
     */
    this.isDraggable = true;

    /**
     * Sets the color of the main -x and -y axis.
     * Default value is #CCCCCC.
     * @type {string}
     */
    this.color = "#CCCCCC";

    /**
     * Sets the color of the grid.
     * Default value is #EEEEEE.
     * @type {string}
     */
    this.subAxisColor = "#EEEEEE";

    /**
     * Sets the cursor style when the mouse is over the axis.
     * Default value is {@link CURSOR}.MOVE.
     * @type {string}
     */
    this.cursor = constants.CURSOR.MOVE;

    /**
     * Sets the move style of the axis to change by pixels rather than by units.
     * Default value is {@link MOVE_STYLE}.BY_PX.
     * @type {string}
     */
    this.mouseMoveStyle = constants.MOVE_STYLE.BY_PX;

    /**
     * Stores the minimum dimensions that the axis can have given the current
     * position and dimensions of the axis in both -x and -y directions.
     * @type {number[]}
     */
    this.min = [0, 0];

    /**
     * Stores the maximum dimensions that the axis can have given the current
     * position and dimensions of the axis in both -x and -y directions.
     * @type {number[]}
     */
    this.max = [0, 0];

    /**
     * Flag for enabling the display of the -x axis.
     * Default value is true.
     * @type {boolean}
     */
    this.displayX = true;

    /**
     * Flag for enabling the display of the -y axis.
     * Default value is true.
     * @type {boolean}
     */
    this.displayY = true;

    /**
     * Sets the length of the ticks that are placed every "unit" in pixels.
     * Default value is 12.
     * @type {number}
     */
    this.tickSize = 12;
    
    /**
     * Sets the length of the smaller ticks that are placed every "unit" / 2 in pixels.
     * Default value is 8.
     * @type {number}
     */
    this.tickSizeSmall = 8;

    /**
     * Sets the distance between the axis and the unit label.
     * Default value is 5.
     * @type {number}
     */
    this.textOffset = 5;

    /**
     * Flag for enabling the drawing of the negative part of the axis.
     * Default value is true.
     * @type {boolean}
     */
    this.negative = true;

    /**
     * Flag for enabling the drawing of the grid.
     * Default value is true.
     * @type {boolean}
     */
    this.grid = true;

    /**
     * Flag for placing the numbers on the outside of the first quadrant of the axis.
     * Default value is true.
     * @type {boolean}
     */
    this.outsideNumbers = true;

    /**
     * Sets the prerenderer for the Axis. It is enabled by default.
     * @type {Renderer}
     */
    this.renderer = new Renderer({ enabled: true, isAxis: true, parent: this });

    // Apply user settings.
    utils.loadOptions(this, opts);

  }

  /**
   * Updates the dimensions of the axis when the world gets resized.
   * @private
   */
  resize() {
    this.width = this.world.width;
    this.height = this.world.height;
  }

  /**
   * Tests if the mouse is over the axis. If the axis is enabled it will return true, since at all
   * moments the mouse is over the axis.
   * @private
   * @returns {boolean} True if the axis is enabled, false otherwise.
   */
  isMouseOver() {
    return this.display;
  }

  /**
   * Draws the axis onto the selected canvas (renderer by default). First, the dimension of the axis
   * are calculated in order for the axis to do not extend more than the visible dimensions of the canvas.
   * With that, a grid is drawn and finally the -x and -y axes are drawn.
   * @private
   */
  drawAxis() {
    const { scaleX, scaleY } = this.world;
    const ctx = this.renderer.enabled ? this.renderer.ctx : this.world.ctx;
    const width = this.width > 0 ? this.width : this.world.width;
    const height = this.height > 0 ? this.height : this.world.height;
    const minY = this.negative ? height - this.position.y : 0;
    const maxY = -this.position.y;
    const minX = this.negative ? -this.position.x : 0;
    const maxX = width - this.position.x;

    this.min = [minX, minY];
    this.max = [maxX, maxY];

    const fromX = Math.ceil(minX / scaleX.px) * scaleX.px;
    const toX = Math.floor(maxX / scaleX.px) * scaleX.px;
    const fromY = Math.ceil(maxY / scaleY.px) * scaleY.px;
    const toY = Math.floor(minY / scaleY.px) * scaleY.px;
    let x = 0;
    let y = 0;

    // Draw the grid
    if (this.grid) {
      ctx.beginPath();
      ctx.strokeStyle = this.subAxisColor;
      // Draw subdivisions of the Y axis
      for (y = fromY; y <= toY; y += scaleY.px) {
        if (y !== 0) {
          ctx.moveTo(minX, y);
          ctx.lineTo(maxX, y);
        }
      }
      // Draw subdivisions of the X axis
      for (x = fromX; x <= toX; x += scaleX.px) {
        if (x !== 0) {
          ctx.moveTo(x, minY);
          ctx.lineTo(x, maxY);
        }
      }
      ctx.stroke();
      ctx.closePath();
    }

    // Draw Y axis ticks
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    this.font.toCtx(ctx);

    // Make sure the Y axis is visible, if it is then
    // draw the Y axis and the ticks and labels
    if (
      this.position.x < width + this.tickSize &&
      this.position.x > -this.tickSize &&
      this.displayY
    ) {
      // Draw Y axis
      ctx.moveTo(0, minY);
      ctx.lineTo(0, maxY);

      // Calculate the text offset for the labels
      const xOffset = this.outsideNumbers
        ? -this.tickSize - this.textOffset
        : this.tickSize + this.textOffset;
      ctx.textAlign = this.outsideNumbers ? "right" : "left";

      // Draw ticks subdividing the X axis
      for (y = fromY; y <= toY; y += scaleY.px) {
        // Do not draw a big tick and the scale when y = 0.
        if (y !== 0) {
          // Draw big ticks
          ctx.moveTo(-this.tickSize, y);
          ctx.lineTo(+this.tickSize, y);

          // Draw scale
          ctx.fillText(
            utils.round(y * scaleY.toUnits, 3) + scaleY.unit,
            xOffset,
            y
          );
        }

        // Draw small ticks
        if (y - scaleY.px / 2 > maxY) {
          ctx.moveTo(-this.tickSizeSmall, y - scaleY.px / 2);
          ctx.lineTo(+this.tickSizeSmall, y - scaleY.px / 2);
        }
      }

      // Last tick
      if (toY + scaleY.px / 2 < minY) {
        ctx.moveTo(-this.tickSizeSmall, toY + scaleY.px / 2);
        ctx.lineTo(+this.tickSizeSmall, toY + scaleY.px / 2);
      }
    }

    // Make sure the X axis is still visible, if it is then
    // draw the X axis and the ticks and labels
    if (
      this.position.y < height + this.tickSize &&
      this.position.y > -this.tickSize &&
      this.displayX
    ) {
      // Draw X Axis
      ctx.moveTo(minX, 0);
      ctx.lineTo(maxX, 0);

      // Calculate the text offset for the labels
      const yOffset = this.outsideNumbers
        ? 7 + this.tickSize + this.textOffset
        : -7 - this.tickSize - this.textOffset;
      ctx.textAlign = "center";

      // Draw ticks subdividing the Y axis
      for (x = fromX; x <= toX; x += scaleX.px) {
        // Do not draw the big ticks when x = 0 unless no negative numbers are being displayed
        if (x !== 0 || !this.negative) {
          ctx.moveTo(x, -this.tickSize);
          ctx.lineTo(x, +this.tickSize);
        }

        // Draw scale when x is not 0 unless it no negative numbers are being displayed
        if ((x === 0 && !this.negative) || x !== 0) {
          ctx.fillText(
            utils.round(x * scaleX.toUnits, 3) + scaleX.unit,
            x,
            yOffset
          );
        }

        // Draw small ticks
        if (x - scaleX.px / 2 > minX) {
          ctx.moveTo(x - scaleX.px / 2, -this.tickSizeSmall);
          ctx.lineTo(x - scaleX.px / 2, +this.tickSizeSmall);
        }
      }

      // Last tick
      if (toX + scaleX.px / 2 < maxX) {
        ctx.moveTo(toX + scaleX.px / 2, -this.tickSizeSmall);
        ctx.lineTo(toX + scaleX.px / 2, +this.tickSizeSmall);
      }
    }

    // As the zero point is labed by the x axis, display it if the y axis is
    // still being display.
    if (this.displayY && !this.displayX) {
      const xOffset = this.outsideNumbers
        ? -this.tickSize - this.textOffset
        : this.tickSize + this.textOffset;
      ctx.textAlign = this.outsideNumbers ? "right" : "left";
      ctx.fillText(`0${scaleX.unit}`, xOffset, 0);
    }

    ctx.stroke();
    ctx.closePath();
  }

  /**
   * Main draw function for the axis called by the World automatically. Since the axis is prerendered, 
   * this function handles the toggling between the renderer and the canvas.
   * @private
   */
  draw() {
    if (this.renderer.enabled) {
      if (this.renderer.rendered) {
        this.renderer.draw();
      } else {
        this.renderer.begin();
        this.drawAxis();
        this.renderer.end();
        this.renderer.draw();
      }
    } else {
      this.drawAxis();
    }
  }

  /**
   * Test if a point is visible given the current position of the axis and the canvas size.
   * @public
   * @param {number} x Coordinate -x to test.
   * @param {number} y Coordinate -y to test.
   * @returns {boolean} True if the point is visible, false otherwise.
   */
  isPointVisible(x, y) {
    if (this.min[0] <= x && x <= this.max[0]) {
      if (this.min[1] >= y && y >= this.max[1]) {
        return true;
      }
    }
    return false;
  }
}
