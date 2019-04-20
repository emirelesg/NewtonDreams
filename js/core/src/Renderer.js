import * as utils from "./Utils";
import World from "./World";

/**
 * Enables an element to be prerendered in a hidden canvas. Once an element is prerendered it can be drawn to the main canvas faster.
 * If an element has not changed, then prerendered version will be used, thus optimizing the application.
 * @private
 * @class Renderer
 */
export default class Renderer {

  /**
   * @constructor
   * @param {object} [opts] Object that contains valid Renderer properties with values. Their values will be assigned at the end of the constructor. If an invalid property is passed then the value will be ignored.
   */
  constructor(opts) {

    /**
     * Sets if the target object is an axis. It is important to set this property for all axis objects.
     * Default value is false.
     * @type {boolean}
     */
    this.isAxis = false;

    /**
     * Sets the object that will be prerendered.
     * Default value is undefined.
     * @type {object}
     */
    this.parent = undefined;

    /**
     * Flag for signaling when then object has been drawn in the hidden canvas.
     * Default value is false.
     * @type {boolean}
     */
    this.rendered = false;

    /**
     * Flag for switching the renderer on or off. If it is set to false, then the object will
     * be drawn normally on the main canvas.
     * Default value is true.
     * @type {boolean}
     */
    this.enabled = true;

    /**
     * Sets the reference to the world object. 
     * Default value is undefined.
     * @type {World}
     */
    this.world = undefined;

    /**
     * Sets if the rendered image will be drawn with respect to the axis of the world or not.
     * Default value is false.
     * @type {boolean}
     */
    this.absolute = false;

    /**
     * Canvas element where the object will be prerendered.
     * @type {object}
     */
    this.canvas = document.createElement("canvas");

    /**
     * Context of the canvas element where the object will be prerendered.
     * @type {object}
     */
    this.ctx = this.canvas.getContext("2d");

    /**
     * Function used to set the drawing procedure for the renderer.
     * @type {function}
     */
    this.callback = undefined;

    /**
     * Arguments passed to the callback function used to draw onto the renderer.
     * @type {*}
     */
    this.callbackArgs = undefined;

    // Apply user settings.
    utils.loadOptions(this, opts);

  }

  /**
   * Sets the world object used by the renderer. It is automatically set by the world
   * when the element is added to the world.
   * @private
   * @param {World} world World object where the renderer will draw the render.
   */
  setWorld(world) {
    this.world = world;
    this.resize();
  }

  /**
   * Sets the callback function for when the renderer is drawn.
   * @param {function} f Callback function.
   * @param {*} args Arguments passed to the callback function when called.
   */
  setCallback(f, args) {
    this.resize();
    this.render();
    this.callback = f;
    this.callbackArgs = args;
  }

  /**
   * Set the flags required to start the rendering process.
   * The flag {@link Renderer.enabled} is set to true and the flag {@link Renderer.rendered} is set to false.
   * @public
   */
  render() {
    this.enabled = true;
    this.rendered = false;
  }

  /**
   * Resizes the rendered canvas to match the size of the world's canvas.
   * It is automatically called when the canvas gets resized.
   * @private
   */
  resize() {
    const { pxRatio, canvas } = this.world;
    this.canvas.width = canvas.width;
    this.canvas.height = canvas.height;
    this.ctx.scale(pxRatio, pxRatio);
    this.rendered = false;
  }

  /**
   * Starts the drawing process of the rendered canvas on the world canvas.
   * It sets the translation depending on the value of {@link Renderer.absolute}.
   * @public
   */
  begin() {
    const { width, height } = this.world;
    this.ctx.save();
    this.ctx.clearRect(0, 0, width, height);
    if (!this.absolute) {
      const axis = this.isAxis ? this.parent : this.world.axis;
      this.ctx.translate(axis.position.x, axis.position.y);
    }
  }

  /**
   * Finishes the drawing process of the rendered canvas on the world canvas.
   * @public
   */
  end() {
    this.ctx.restore();
    this.rendered = true;
  }

  /**
   * Draws the rendered canvas onto the world canvas.
   * @private
   */
  draw() {
    const { width, height, ctx } = this.world;
    if (this.absolute) {
      ctx.drawImage(this.canvas, 0, 0, width, height);
    } else {
      const axis = this.isAxis ? this.parent : this.world.axis;
      ctx.drawImage(
        this.canvas,
        -axis.position.x,
        -axis.position.y,
        width,
        height
      );
    }
  }
}
