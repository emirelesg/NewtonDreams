import * as utils from "../Utils";
import * as constants from "../Constants";
import WorldElement from "../WorldElement";

/**
 * The Vector class is used for handling vector quantities and for drawing them onto the world.
 * @public
 * @class Vector
 */
export default class Vector extends WorldElement {

  /**
   * 
   * @param {object} [opts] Object that contains valid Vector properties with values. Their values will be assigned at the end of the constructor. If an invalid property is passed then the value will be ignored.
   */
  constructor(opts) {

    // Extend WorldElement.
    super();

    /**
     * Sets the -x magnitude of the vector.
     * Default value is 0.
     * @type {number}
     */
    this.x = 0;

    /**
     * Sets the -y magnitude of the vector.
     * Default value is 0.
     * @type {number}
     */
    this.y = 0;

    /**
     * Flag for enabling the drawing of the vector's components.
     * Default value is false.
     * @type {boolean}
     */
    this.components = false;

    /**
     * Color of the components.
     * Default value is {@link COLORS}.COMPONENT.
     * @type {string}
     */
    this.componentColor = constants.COLORS.COMPONENT;

    /**
     * Flag for drawing the components at the starting point of the vector.
     * Default value is true.
     * @type {boolean}
     */
    this.componentsAtOrigin = true;

    /**
     * Flag for setting the angle style of the vector.
     * Default value is {@link ANGLE_STYLE}.DEG.
     * @type {number}
     */
    this.angleStyle = constants.ANGLE_STYLE.DEG;

    // Apply user settings.
    utils.loadOptions(this, opts);

  }

  /**
   * Tests if the mouse is over the vector.
   * @private
   * @returns {boolean} True if the mouse is over the vector, false otherwise.
   */
  isMouseOver() {
    return (
      utils.distSquared(
        this.world.mouse.rx,
        this.world.mouse.ry,
        this.position.x,
        this.position.y
      ) < 1
    );
  }

  /**
   * Draws a vector between two points. The vector is a line with an equilateral triangle at
   * the tip of the vector.
   * @private
   * @param {number} x0 Start -x coordinate of the vector in pixels.
   * @param {number} y0 Start -y coordinate of the vector in pixels.
   * @param {number} x1 End -x coordinate of the vector in pixels.
   * @param {number} y1 End -y coordinate of the vector in pixels.
   * @param {string} color Color of the vector in HEX format.
   * @param {boolean} dashed Flag for drawing the vector with a dashed line.
   */
  drawLine(x0, y0, x1, y1, color, dashed) {
    const { ctx } = this.world;
    const dx = x1 - x0;
    const dy = y1 - y0;
    const mag = Math.sqrt(dx ** 2 + dy ** 2);
    const a1 = Math.atan2(dy, dx);
    const a2 = constants.FIFTH_PI;
    const headlen = mag > 10 ? 10 : mag;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    ctx.beginPath();
    if (dashed) ctx.setLineDash([7, 7]);
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    if (dashed) ctx.setLineDash([]);
    ctx.lineTo(
      x1 - Math.floor(headlen * Math.cos(a1 - a2)),
      y1 - Math.floor(headlen * Math.sin(a1 - a2))
    );
    ctx.lineTo(
      x1 - Math.floor(headlen * Math.cos(a1 + a2)),
      y1 - Math.floor(headlen * Math.sin(a1 + a2))
    );
    ctx.lineTo(x1, y1);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }
  
  /**
   * Main draw function for the vector called by the World automatically.
   * @private
   */
  draw() {
    if (this.x === 0 && this.y === 0) return;
    const { scaleX, scaleY, ctx } = this.world;
    const fromX = Math.floor(this.position.x * scaleX.toPx);
    const toX = Math.floor(fromX + this.x * scaleX.toPx * this.scale);
    const fromY = Math.floor(this.position.y * scaleY.toPx);
    const toY = Math.floor(fromY + this.y * scaleY.toPx * this.scale);
    const prevLineWidth = ctx.lineWidth;
    ctx.lineWidth = 2;
    if (this.components) {
      this.drawLine(fromX, fromY, toX, fromY, this.componentColor, true);
      this.drawLine(
        this.componentsAtOrigin ? fromX : toX,
        fromY,
        this.componentsAtOrigin ? fromX : toX,
        toY,
        this.componentColor,
        true
      );
    }
    this.drawLine(fromX, fromY, toX, toY, this.color, false);
    ctx.lineWidth = prevLineWidth;
  }

  /**
   * Set the vector's magnitude and angle.
   * @public
   * @param {number} mag Magnitude of the vector.
   * @param {number} angle Angle of the vector.
   */
  setMag(mag, angle) {
    this.x = mag * utils.cos(angle, this.angleStyle);
    this.y = mag * utils.sin(angle, this.angleStyle);
  }

  /**
   * Set the -x and -y components of the vector.
   * @public
   * @param {number|object} x -x component of the vector. If x is another vector, the components of this vector are used to set the target vector.
   * @param {number} [y] -y component of the vector.
   */
  set(x, y) {
    if (utils.isObject(x)) {
      this.x = x.x || 0;
      this.y = x.y || 0;
    } else {
      this.x = x || 0;
      this.y = y || 0;
    }
  }

  /**
   * Add a value to the -x and -y components of the vector.
   * @public
   * @param {number|object} x Value to add to the -x component of the vector. If x is another vector, the components of this vector are added to the target vector.
   * @param {number} [y] Value to add to the -y component of the vector.
   */
  add(x, y) {
    if (utils.isObject(x)) {
      this.x += x.x || 0;
      this.y += x.y || 0;
    } else {
      this.x += x || 0;
      this.y += y || 0;
    }
  }

  /**
   * Subtract a value to the -x and -y components of the vector.
   * @public
   * @param {number|object} x Value to subtract to the -x component of the vector. If x is another vector, the components of this vector are subtracted to the target vector.
   * @param {number} [y] Value to subtract to the -y component of the vector.
   */
  sub(x, y) {
    if (utils.isObject(x)) {
      this.x -= x.x || 0;
      this.y -= x.y || 0;
    } else {
      this.x -= x || 0;
      this.y -= y || 0;
    }
  }

 /**
   * Multiply the -x and -y components of the vector by a constant value.
   * @public
   * @param {number|object} x Value that multiplies the -x component of the vector. If x is another vector, the components of this vector are multiplied with the target vector.
   * @param {number} [y] Value that multiplies the -y component of the vector.
   */
  mult(x, y) {
    if (utils.isObject(x)) {
      this.x *= x.x || 0;
      this.y += x.y || 0;
    } else if (y === undefined) {
      this.x *= x || 0;
      this.y *= x || 0;
    } else {
      this.x *= x || 0;
      this.y *= y || 0;
    }
  }

  /**
   * Get a readable format of the vector's components.
   * @public
   * @returns {string} Readable string with the vector's -x and -y components.
   */
  print() {
    return `x: ${this.x} y: ${this.y}`;
  }

  /**
   * Dot product between two vectors.
   * @public
   * @param {number|object} x -x component of the vector used for calculating the dot product. If x is another vector, the dot product is calculated between x and the target vector.
   * @param {number} [y]  -y component of the vector used for calculating the dot product.
   * @return {number} The dot product between the two vector.
   */
  dot(x, y) {
    if (utils.isObject(x)) {
      return this.dot(x.x, x.y);
    }
    return this.x * x + this.y * y;
  }

  /**
   * Get the magnitude of the vector.
   * @public
   * @returns {number} The magnitude of the vector.
   */
  mag() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  /**
   * Get the angle of the vector. The type of angle depends on the value of
   * {@link Vector.angleStyle}.
   * @public
   * @returns {number} The angle of the vector.
   */
  angle() {
    if (this.angleStyle === constants.ANGLE_STYLE.DEG) {
      return Math.atan2(this.y, this.x) * constants.RAD_TO_DEG;
    }
    return Math.atan2(this.y, this.x);
  }

  /**
   * Gets the standard angle of the vector. This means that the angle
   * ranges from 0 to 360°. Only works when the angleStyle is in degrees.
   * @public
   * @returns {number} The standard angle.
   */
  standardAngle() {
    const a = this.angle();
    return a < 0 ? a + 360 : a;
  }

  /**
   * Get the magnitude squared of the vector.
   * @public
   * @returns {number} The magnitude squared of the vector.
   */
  magSquared() {
    return this.x ** 2 + this.y ** 2;
  }
}
