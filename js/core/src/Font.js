import * as constants from "./Constants";

/**
 * Stores the font settings currently used by a World Element.
 * @private
 * @class Font
 */
export default class Font {

  /**
   * @constructor
   * @param {object} [opts] Object that contains valid Font properties with values. Their values will be assigned at the end of the constructor. If an invalid property is passed then the value will be ignored.
   */
  constructor(opts) {

    /**
     * Sets the font size in pixels. 
     * Default value is {@link FONT_SIZE}.
     * @type {number|string}
     */
    this.size = constants.FONT_SIZE;

    /**
     * Sets the font face used.
     * Default value is {@link FONT}.
     * @type {string}
     */
    this.face = constants.FONT;

    /**
     * Sets the font color in HEX format. 
     * Default value is {@link FONT_COLOR}.
     * @type {string}
     */
    this.color = constants.FONT_COLOR;

    /**
     * Sets the baseline value for the text.
     * Default value is middle.
     * @type {string}
     */
    this.baseline = "middle";

    /**
     * Sets the alignment value for the text.
     * Default value is center.
     * @type {string}
     */
    this.align = "center";

    /**
     * Sets the font weight used. If the font face has different weights available, another value can be selected.
     * Default value is normal.
     * @type {string}
     */
    this.weight = "normal";

    /**
     * Sets the line spacing between text lines. The value is multiplied by the current font size.
     * Default value is 1.
     * @type {number}
     */
    this.spacing = 1;

    // Apply user settings.
    this.set(opts);
  }

  /**
   * Given an object with valid properties, it assigns their values to the object.
   * This allows for a signle line to modify multiple properties of the font object.
   * @public
   * @param {object} opts Object with font properties.
   */
  set(opts) {
    if (opts) {
      if (opts.size) this.size = opts.size;
      if (opts.face) this.face = opts.face;
      if (opts.color) this.color = opts.color;
      if (opts.baseline && Font.validateBaseline(opts.baseline))
        this.baseline = opts.baseline;
      if (opts.align && Font.validateAlign(opts.align)) this.align = opts.align;
      if (opts.weight) this.weight = opts.weight;
      if (opts.spacing) this.spacing = opts.spacing;
    }
  }

  /**
   * Checks if the provided baseline value is valid for a canvas element.
   * Valid baseline values include: "top", "hanging", "middle", "alphabetic", "ideographic", "bottom".
   * @private 
   * @param {string} baseline Baseline value to check.
   * @throws {error} Error when the baseline value is invalid.
   * @returns {boolean} True if baseline value is valid.
   */
  static validateBaseline(baseline) {
    if (constants.FONT_BASELINE.includes(baseline)) {
      return true;
    }
    throw new Error(`${baseline} is not a valid baseline.`);
  }
  
  /**
   * Checks if the provided align value is valid for a canvas element.
   * Valid align values: "left", "right", "center", "start", "end".
   * @private 
   * @param {string} align Align value to check.
   * @throws {error} Error when the align value is invalid.
   * @returns {boolean} True if align value is valid.
   */
  static validateAlign(align) {
    if (constants.FONT_ALIGN.includes(align)) {
      return true;
    }
    throw new Error(`${align} is not a valid text align.`);
  }
  
  /**
   * Sets the current font settings to the context.
   * @private
   * @param {object} ctx Canvas context object.
   */
  toCtx(ctx) {
    if (this.weight !== "normal") {
      ctx.font = `${this.weight} ${this.size}px ${this.face}`;
    } else {
      ctx.font = `${this.size}px ${this.face}`;
    }
    ctx.textAlign = this.align;
    ctx.textBaseline = this.baseline;
    ctx.fillStyle = this.color;
  }
}
