import * as utils from "../Utils";
import * as constants from "../Constants";
import WorldElement from "../WorldElement";
import Text from "./box/Box.Text";
import Graph from "./box/Box.Graph";
import Label from "./box/Box.Label";

/**
 * A Box allows for a window like object to be displayed in the world. This window object
 * has the possibility to display text, labels and graphs, completely isolated
 * from the settings of the world. 
 * A box object does not have a width or a height. Instead, it takes the dimensions
 * of the objects it contains.
 * @public
 * @class Box
 */
export default class Box extends WorldElement {

  /**
   * @constructor
   * @param {object} [opts] Object that contains valid Box properties with values. Their values will be assigned at the end of the constructor. If an invalid property is passed then the value will be ignored.
   */
  constructor(opts) {

    // Extend WorldElement.
    super();

    /**
     * Sets the width of the Box in pixels.
     * Default value is 0.
     * @type {number}
     */
    this.width = 0;

    /**
     * Sets the height of the Box in pixels.
     * Default value is 0.
     * @type {number}
     */
    this.height = 0;

    /**
     * Sets the color of the Box. The color must have the format as in {@link BOX_COLORS}.
     * The default value is {@link BOX_COLORS}.BLUE.
     * @type {object}
     * @property {string} BACKGROUND Background color.
     * @property {string} BORDER Border color.
     */
    this.color = constants.BOX_COLORS.BLUE;

    /**
     * Sets the move style of the Box to change by pixels rather than by units.
     * Default value is {@link MOVE_STYLE}.BY_PX.
     * @type {string}
     */
    this.mouseMoveStyle = constants.MOVE_STYLE.BY_PX;

    /**
     * Flag for allowing the Box to be dragged around.
     * Default value is true.
     * @type {boolean}
     */
    this.isDraggable = true;
    
    /**
     * Sets the padding in pixels that the Box has. 
     * @type {object}
     * @property {number} left=10 Left padding in pixels.
     * @property {number} bottom=10 Bottom padding in pixels.
     * @property {number} right=10 Right padding in pixels.
     * @property {number} top=10 Top padding.
     */
    this.padding = { top: 10, right: 10, bottom: 10, left: 10 };

    /**
     * Flag for displaying debug rectangles around the elements inside the Box.
     * Default value is false.
     * @type {boolean}
     */
    this.debug = false;

    /**
     * Sets the title for the Box.
     * Default value is "".
     * @type {string}
     */
    this.title = "";

    /**
     * Sets an array where all elements inside the Box are stored.
     * Default value is []
     * @type {Label[]|Text[]|Graph[]}
     */
    this.elements = [];

    // Configure the font of the Box.
    this.font.set({
      weight: 500,
      size: 16,
      baseline: "top",
      align: "center",
      color: constants.COLORS.GRAY
    });

    // Apply user settings.
    utils.loadOptions(this, opts);

  }
  
  /**
   * Adds a Text to the Box.
   * @param {number} width Width of the Text in pixels.
   * @param {number} height Height of the Text in pixels.
   * @param {object} [opts] Object that contains valid Text properties with values. Their values will be assigned at the end of the constructor. If an invalid property is passed then the value will be ignored.
   * @returns {Text} Newly added Text.
   */
  addText(width, height, opts) {
    const tb = new Text(this, width, height, opts);
    this.elements.push(tb);
    this.calculateDimensions();
    return tb;
  }

  /**
   * Adds a Label to the Box.
   * @param {number} width Width of the Label in pixels.
   * @param {number} height Height of the Label in pixels.
   * @param {object} [opts] Object that contains valid Label properties with values. Their values will be assigned at the end of the constructor. If an invalid property is passed then the value will be ignored.
   * @returns {Label} Newly added Label.
   */
  addLabel(width, height, opts) {
    const tb = new Label(this, width, height, opts);
    this.elements.push(tb);
    this.calculateDimensions();
    return tb;
  }

  /**
   * Adds a Graph to the Box.
   * @param {number} width Width of the Graph in pixels.
   * @param {number} height Height of the Graph in pixels.
   * @param {object} [opts] Object that contains valid Graph properties with values. Their values will be assigned at the end of the constructor. If an invalid property is passed then the value will be ignored.
   * @returns {Graph} Newly added Graph.
   */
  addGraph(width, height, opts) {
    const gb = new Graph(this, width, height, opts);
    this.elements.push(gb);
    this.calculateDimensions();
    return gb;
  }

  /**
   * Sets the padding of the Box object.
   * @public
   * @param {number} top Top padding in pixels.
   * @param {number} right Right padding in pixels.
   * @param {number} bottom Bottom padding in pixels.
   * @param {number} left Left padding in pixels.
   */
  setPadding(top, right, bottom, left) {
    this.padding.top = top;
    this.padding.right = right;
    this.padding.bottom = bottom;
    this.padding.left = left;
    this.calculateDimensions();
  }

  /**
   * Since the box takes the dimensions of the objects it contains, this
   * function calculates these dimensions. The function must be called after setting
   * the dimensions of the objects it contains.
   * @public
   */
  calculateDimensions() {
    this.width = 0;
    this.height = 0;
    for (let i = 0; i < this.elements.length; i++) {
      const minWidth =
        this.padding.left +
        this.padding.right +
        this.elements[i].position.x +
        this.elements[i].width;
      if (this.width < minWidth) this.width = Math.ceil(minWidth);
      const minHeight =
        this.padding.top +
        this.padding.bottom +
        this.elements[i].position.y +
        this.elements[i].height;
      if (this.height < minHeight) this.height = Math.ceil(minHeight);
    }
  }

  /**
   * Tests if the mouse is over the box.
   * @private
   * @returns {boolean} True if the mouse is over the box, false otherwise.
   */
  isMouseOver() {
    return utils.isCoordInside(
      this.world.mouse.x,
      this.world.mouse.y,
      this.position.x + this.width / 2,
      this.position.y + this.height / 2,
      this.width / 2,
      this.height / 2
    );
  }

  /**
   * Main draw function for the Box called by the World automatically.
   * @private
   */
  draw() {
    const { ctx } = this.world;
    const x0 = this.position.x - this.world.axis.position.x;
    const y0 = this.position.y - this.world.axis.position.y;
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.fillStyle = this.color.BACKGROUND;
    ctx.strokeStyle = this.color.BORDER;
    ctx.rect(x0, y0, this.width, this.height);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    ctx.lineWidth = 1;
    if (this.debug) {
      ctx.beginPath();
      ctx.strokeStyle = constants.COLORS.RED;
      ctx.rect(
        x0 + this.padding.left,
        y0 + this.padding.top,
        this.width - this.padding.left - this.padding.right,
        this.height - this.padding.top - this.padding.bottom
      );
      ctx.stroke();
      ctx.closePath();
    }
    if (this.title !== "") {
      ctx.beginPath();
      this.font.toCtx(ctx);
      ctx.fillText(this.title, x0 + this.width / 2, y0 + this.padding.top);
      ctx.closePath();
    }
    for (let i = 0; i < this.elements.length; i++) {
      ctx.save();
      ctx.translate(
        x0 + this.padding.left + this.elements[i].position.x,
        y0 + this.padding.top + this.elements[i].position.y
      );
      if (this.debug && utils.isFunction(this.elements[i].debug))
        this.elements[i].debug();
      if (this.elements[i].display)
        this.elements[i].draw(ctx, this.display.debug);
      ctx.restore();
    }
  }

}
