import * as utils from "./Utils";

 /**
  * Stores the scale properties in a particular axis (-x or -y).
  * @public
  * @class Scale
  */
export default class Scale {
  
  /**
   * @constructor
   * @param {number} px Number of pixels that one magnitude value is equivalent.
   * @param {number} mag Magnitude of the scale.
   * @param {string} [unit=""] Unit of the scale.
   */
  constructor(px, mag, unit) {

    /**
     * Number of pixels that one magnitude value is equivalent.
     * Default value is 0.
     * @type {number}
     */
    this.px = 0;

    /**
     * Magnitude of the scale.
     * Default value is 0.
     * @type {number}
     */
    this.mag = 0;

    /**
     * Units of the scale. These units are displayed in the axis.
     * Default value is "".
     * @type {string}
     */
    this.unit = "";
    
    /**
     * Conversion factor from units to pixels.
     * Default value is 0.
     * @type {number}
     * @example
     * var pixels = units * scale.toPixels;
     */
    this.toPx = 0;
    
    /**
     * Conversion factor from pixels to units.
     * Default value is 0.
     * @type {number}
     * @example
     * var units = pixels * scale.toUnits;
     */
    this.toUnits = 0;
    
    // Apply user settings.
    this.set(px, mag, unit);

  }

  /**
   * Sets the scale for the axis. It calculates the conversion factors between pixels and units.
   * @public
   * @param {number} px Number of pixels that one magnitude value is equivalent.
   * @param {number} mag Magnitude of the scale.
   * @param {string} [unit=""] Unit of the scale.
   */
  set(px, mag, unit) {
    this.px = px;
    this.mag = mag;
    this.unit = utils.isString(unit) ? unit : "";
    this.toPx = this.px / this.mag;
    this.toUnits = this.mag / this.px;
  }
}
