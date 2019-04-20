import * as utils from "../Utils";
import WorldElement from "../WorldElement";

/**
 * The Picture class is used to draw images on the screen. Extra attention must be made when waiting
 * for the image to load.
 * @public
 * @class Picture
 */
export default class Picture extends WorldElement {

  /**
   * @constructor
   * @param {string} path Path for the image.
   * @param {object} [opts] Object that contains valid Picture properties with values. Their values will be assigned at the end of the constructor. If an invalid property is passed then the value will be ignored.
   */
  constructor(path, opts) {

    // Extend WorldElement.
    super();

    /**
     * Width of the scaled image in units.
     * @type {number}
     */
    this.width = 0;

    /**
     * Height of the scaled image in units.
     * @type {number}
     */
    this.height = 0;

    /**
     * Flag for allowing the picture to be dragged around.
     * Default value is true.
     * @type {boolean}
     */ 
    this.isDraggable = true;

    /**
     * Image object where picture will be loaded.
     * @type {object}
     */
    this.img = new Image();
    this.img.src = path;

    /**
     * Flag for when the image has fully loaded. It is set after the onload event fires.
     * @type {boolean}
     */
    this.loaded = false;

    /**
     * Sets the pivot point around which the picture is drawn.
     * Must be a number between 0 and 1.
     * @type {object}
     * @property {number} x X pivot point for the image.
     * @property {number} y Y pivot point for the image.
     */
    this.pivot = { x: 0.5, y: 0.5 };

    // Callback function for when the image gets loaded.
    const self = this;
    this.img.onload = () => {
      self.loaded = true;
    };

    // Apply user settings.
    utils.loadOptions(this, opts);

  }

  /**
   * Tests if the mouse is over the picture.
   * @private
   * @returns {boolean} True if the mouse is over the picture, false otherwise.
   */
  isMouseOver() {
    return utils.isCoordInside(
      this.world.mouse.rx,
      this.world.mouse.ry,
      this.position.x,
      this.position.y,
      this.width / 2,
      this.height / 2
    );
  }

  /**
   * Tests if the image is fully loaded. This means that its properties such as the width are available.
   * @public
   * @returns {boolean} True if the image is fully loaded, false otherwise.
   */
  isLoaded() {
    return this.loaded && isFinite(this.img.width) && this.img.width != 0;
  }

  /**
   * Main draw function for the picture called by the World automatically.
   * @private
   */
  draw() {

    const { scaleX, scaleY, ctx } = this.world;
    const w = Math.floor(this.img.width * this.scale);
    const h = Math.floor(this.img.height * this.scale);
    const px = this.position.x * scaleX.toPx;
    const py = this.position.y * scaleY.toPx;
    this.width = w * scaleX.toUnits;
    this.height = h * scaleY.toUnits;

    if (!this.loaded || !this.display) return;

    // Draw image.
    if (this.rotation !== 0) {
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(this.rotation);
      ctx.drawImage(this.img, -w * this.pivot.x, -h * this.pivot.y, w, h);
      ctx.restore();
    } else {
      ctx.drawImage(
        this.img,
        px - w * this.pivot.x,
        py - h * this.pivot.y,
        w,
        h
      );
    }
    
  }
}
