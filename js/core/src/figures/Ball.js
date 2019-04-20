import * as utils from "../Utils";
import * as constants from "../Constants";
import WorldElement from "../WorldElement";

/**
 * The Ball class is a particle class used to draw round particles with the advantage that
 * they can be labeled and displayed with a gradient, giving a more realistic feel to the
 * particle.
 * @public
 * @class Ball
 */
export default class Ball extends WorldElement {

  /**
   * @constructor
   * @param {number} [r=1] Radius of the charge in units.
   * @param {object} [opts] Object that contains valid Ball properties with values. Their values will be assigned at the end of the constructor. If an invalid property is passed then the value will be ignored.
   */
  constructor(r, opts) {

    // Extend WorldElement.
    super();

    /**
     * Flag for allowing the ball to be dragged around.
     * Default value is true.
     * @type {boolean}
     */
    this.isDraggable = true;


    /**
     * Flag for allowing the ball to become a topmost object when its beging dragged,
     * Default value is true.
     * @type {boolean}
     */
    this.topmostOnDrag = true;

    /**
     * Radius of the ball in units.
     * Default value is 1.
     * @type {number}
     */
    this.r = r === undefined ? 1 : r;

    /**
     * Spot for writing a label on the ball. If the {@link Ball.upperLabel} is blank,
     * then the lower label will be centered on the particle. If not, then it will be
     * the lower label on the ball.
     * Default value is "".
     * @type {string}
     */
    this.lowerLabel = "";

    /**
     * Upper spot for writing a label on the bal..
     * Default value is "".
     * @type {string}
     */
    this.upperLabel = "";

    /**
     * Flag for enabling a gradient on the ball. The color used for gradient
     * is the one set in {@link Ball.color}.
     * Default value is true.
     * @type {boolean}
     */
    this.gradient = true;

    // Apply user settings.
    utils.loadOptions(this, opts);

  }

  /**
   * Tests if the mouse is over the ball.
   * @private
   * @returns {boolean} True if the mouse is over the ball, false otherwise.
   */
  isMouseOver() {
    return (
      utils.distSquared(
        this.world.mouse.rx,
        this.world.mouse.ry,
        this.position.x,
        this.position.y
      ) <
      this.r ** 2
    );
  }

  /**
   * Main draw function for the ball called by the World automatically.
   * @private
   */
  draw() {
    if (this.r === 0) return;
    const { scaleX, scaleY, ctx } = this.world;
    let { color } = this;
    const px = this.position.x * scaleX.toPx;
    const py = this.position.y * scaleY.toPx;
    const pr = this.r * scaleX.toPx;
    if (this.gradient) {
      color = ctx.createRadialGradient(px, py, 0, px, py, pr);
      color.addColorStop(0, "white");
      color.addColorStop(1, this.color);
    }
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, constants.TWO_PI);
    ctx.fill();
    ctx.closePath();
    if (this.upperLabel !== "" || this.lowerLabel !== "") {
      this.font.toCtx(ctx);
      const offset = this.upperLabel !== "" && this.lowerLabel !== "" ? 7 : 0;
      if (this.upperLabel !== "")
        ctx.fillText(this.upperLabel, px, py - offset);
      if (this.lowerLabel !== "")
        ctx.fillText(this.lowerLabel, px, py + offset);
    }
  }

  /**
   * Gets a color depending on the value a charge has.
   * If the charge is positive the color is {@link COLORS}.RED.
   * If the charge is negative the color is {@link COLORS}.BLUE.
   * If the charge is neutral the color is {@link COLORS}.GRAY.
   * @public
   * @param {number} charge Charge of the particle in coulombs.
   * @returns {string} Color for the charge.
   */
  static getChargeColor(charge) {
    if (charge > 0) {
      return constants.COLORS.RED;
    }
    if (charge < 0) {
      return constants.COLORS.BLUE;
    }
    return constants.COLORS.GRAY;
  }

  /**
   * Gets the sign a charge must have depending on the value a charge has.
   * If the charge is positive the sign is "+".
   * If the charge is negative the sign is "-".
   * If the charge is neutral the sign is "".
   * @public
   * @param {number} charge  Charge of the particle in coulombs.
   * @returns {string} Sign for the charge.
   */
  static getChargeSign(charge) {
    if (charge > 0) {
      return "+";
    }
    if (charge < 0) {
      return "-";
    }
    return "0";
  }

}
