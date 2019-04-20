import * as utils from "../../Utils";
import * as constants from "../../Constants";
import WorldElement from "../../WorldElement";
import Box from "../Box";

/**
 * A Label Box allows for a pair of label and value to be displayed. It is often used to display results.
 * A Label object is created by calling the method {@link Box.addLabel} on the parent Box.
 * @private
 * @class Label
 */
export default class Label extends WorldElement {

  /**
   * @constructor
   * @param {Box} box Parent box.
   * @param {number} width Width of the label in pixels.
   * @param {number} height Height of the label in pixels.
   * @param {object} [opts] Object that contains valid Text properties with values. Their values will be assigned at the end of the constructor. If an invalid property is passed then the value will be ignored.
   */
  constructor(box, width, height, opts) {

    // Extend WorldElement.
    super();

    /**
     * Sets the parent box where te Label will be placed.
     * @type {Box}
     */
    this.box = box;

    /**
     * Sets the width of the Label in pixels.
     * @type {number}
     */
    this.width = width;

    /**
     * Sets the height of the Label in pixels.
     * Default value is 14.
     * @type {number}
     */
    this.height = height || 14;

    /**
     * Sets the width that the name portion has. This also means that the value
     * of the label is going to be displayed this amount of pixels to the left of it.
     * Furthermore, the width of the label ({@link Label.width}) must be larger than this value.
     * Default value is 75.
     * @type {number}
     */
    this.labelWidth = 75;

    /**
     * Name of the label.
     * Default value is "".
     * @type {string}
     */
    this.name = "";

    /**
     * Sets the formated value for the label. 
     * This is the value that is displayed along the name.
     * @type {string}
     */
    this.value = "";

    /**
     * Sets the units that the value will use.
     * Default value is "".
     * @type {string}
     */
    this.units = "";

    /**
     * Flag for automatically using the (k)ilo, (M)ega, (G)iga prefixes in order to shorten
     * the length of the value.
     * Default value is false.
     * @type {boolean}
     */
    this.usePrefixes = false;

    /**
     * Sets the amount of decimal places displayed on the value.
     * Default value is 2.
     * @type {number}
     */
    this.decPlaces = 2;

    /**
     * Flag for fixing the decimal places to the amount set in {@link Label.decPlaces}.
     * Default value is false.
     * @type {boolean}
     */
    this.fixPlaces = false;

    // Configure font settings for the label.
    this.font.set({
      align: "left",
      size: 14,
      baseline: "middle",
      color: constants.COLORS.GRAY
    });

    // Apply user settings.
    utils.loadOptions(this, opts);

  }

  /**
   * Sets the value of the label. Given any new value it is formated into a string with
   * the provided settings in the object.
   * @public
   * @param {number} value New value for the label.
   */
  set(value) {
    let newValue = value;
    const absValue = Math.abs(value);
    let newUnits = this.units;
    if (this.usePrefixes) {
      if (absValue > 1e32) {
        newValue = constants.SYMBOL.INF;
      } else if (absValue > 1e9) {
        newValue /= 1e9;
        newUnits = `G${this.units}`;
      } else if (absValue > 1e6) {
        newValue /= 1e6;
        newUnits = `M${this.units}`;
      } else if (absValue > 1e3) {
        newValue /= 1e3;
        newUnits = `k${this.units}`;
      }
    }
    this.value = utils.formatValue(
      newValue,
      newUnits,
      this.decPlaces,
      this.fixPlaces
    );
  }

  /**
   * Debug function used to draw a box around the dimensions of the label object.
   * It is only drawn if the parent box has the flag {@link Box.debug} enabled.
   * @private
   */
  debug() {
    const { ctx } = this.box.world;
    ctx.beginPath();
    ctx.strokeStyle = constants.COLORS.BLUE;
    ctx.rect(0, 0, this.width, this.height);
    ctx.moveTo(this.labelWidth, 0);
    ctx.lineTo(this.labelWidth, this.height);
    ctx.stroke();
    ctx.closePath();
  }

  /**
   * Draw function for the Label called by the parent box.
   * @private
   */
  draw() {
    const { ctx } = this.box.world;
    ctx.beginPath();
    this.font.toCtx(ctx);
    ctx.fillText(this.name, 0, this.height / 2);
    ctx.fillText(this.value, this.labelWidth, this.height / 2);
    ctx.closePath();
  }
}
