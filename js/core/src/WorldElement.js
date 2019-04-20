/* eslint-disable class-methods-use-this */
import * as constants from "./Constants";
import * as utils from "./Utils";
import World from "./World";
import Font from "./Font";
import Renderer from "./Renderer";

/**
 * Parent class for all elements added to the world. Sets the basic properties
 * and methods all objects need.
 * @private
 * @class WorldElement
 */
export default class WorldElement {

  /**
   * @constructor
   */
  constructor() {

    /**
     * Sets the world where this element is found. It is automatically set when added to the world.
     * @type {World}
     */
    this.world = null;

    /**
     * Flag for enabling or diabling this element.
     * Default value is true.
     * @type {boolean}
     */
    this.display = true;

    /**
     * Sets the z-index of the element.
     * Default value is 0.
     * @type {number}
     */
    this.zIndex = 0;

    /**
     * A copy of the z-index value is stored here. When the element is dragged around, 
     * the element moves as a topmost element (only if {@link WorldElement.topmostOnDrag} 
     * is set to true). Therefore, the z-index of the element is increased and must 
     * be restored when the mouse gets released. 
     * The default value is 0.
     * @type {number}
     */
    this.savedZIndex = 0;

    /**
     * Sets the position of the element. The units can be in pixels or in units.
     * Must look at the value of {@link WorldElement.mouseMoveStyle}.
     * @type {object}
     * @property {number} x=0 -x coordinate.
     * @property {number} y=0 -y coordinate.
     */
    this.position = { x: 0, y: 0 };

    /**
     * Flag for determining if the element will be a top-most element when dragged around.
     * This means the element can be behind other objects, but when its dragged it will
     * temporarily have a higher z-index.
     * Default value is false.
     * @type {boolean}
     */
    this.topmostOnDrag = false;

    /**
     * Flag for allowing the element to be dragged around.
     * Default value is false.
     * @type {boolean}
     */
    this.isDraggable = false;

    /**
     * Flag set when the element is being dragged around.
     * Default value is false.
     * @type {boolean}
     */
    this.dragging = false;

    /**
     * Sets a callback function for when the element is dragged around.
     * @type {function}
     */
    this.onMouseMove = undefined;

    /**
     * Flag set when the mouse is over the element.
     * Default value is false.
     * @type {boolean}
     */
    this.mouseOver = false;

    /**
     * Sets the move style of the element.
     * Default value is {@link MOVE_STYLE}.BY_UNITS.
     * @type {string}
     */
    this.mouseMoveStyle = constants.MOVE_STYLE.BY_UNITS;

    /**
     * Sets the cursor style when the mouse is over the element.
     * Default value is {@link CURSOR}.POINTER.
     * @type {string}
     */
    this.cursor = constants.CURSOR.POINTER;

    /**
     * Sets the color in HEX format of the element. The use of it depends on the type of element.
     * Default value is {@link COLORS}.RED.
     * @type {string}
     */
    this.color = constants.COLORS.RED;

    /**
     * Sets the drawing scale of the element. 
     * Until now this property is only useful for {@link Picture} objects.
     * Default value is 1.
     * @type {number}
     */
    this.scale = 1;

    /**
     * Sets the rotation of the element. The units depend on the value of element's angle style.
     * Default value is 0.
     * @type {number}
     */
    this.rotation = 0;

    /**
     * Flag used to determine if an object is a child of WorldElement. 
     * Only these objects have a {@link WorldElement.valid} flag.
     * Default value is true.
     * @type {boolean}
     */
    this.valid = true;

    /**
     * Sets the renderer used for the element.
     * The default value is undefined.
     * @type {Renderer}
     */
    this.renderer = undefined;

    /**
     * Sets the current width of the element.
     * The default value is 0.
     * @type {number}
     */
    this.width = 0;

    /**
     * Sets the current height of the element.
     * The default value is 0.
     * @type {number}
     */
    this.height = 0;

    /**
     * Sets the font of the element.
     * The default value is Font().
     * @type {Font}
     */
    this.font = new Font();
  }

  /**
   * Sets the world object where element will be drawn. It is automatically set by the
   * world when the element is added to it.
   * @private
   * @param {World} world World of the element.
   */
  setWorld(world) {
    this.world = world;
    this.resize();
  }

  /**
   * Function called when the canvas gets resized. Enables the different element types to handle
   * resize events differently depending on their needs. This is an empty resize function.
   * @private
   */
  resize() {}

  /**
   * Function called when the mouse moves to check if the pointer is over the element.
   * The function is later replaced by the different types of elements.
   * @public
   * @returns {boolean} Returns false by default.
   */
  isMouseOver() {
    return false;
  }

  /**
   * Sets the scale of the element.
   * @public
   * @param {number} s Scale value for the element. Must be between 1 and 0.
   */
  setScale(s) {
    this.scale = s >= 0 && s <= 1 ? s : 0;
    if (this.renderer) this.renderer.rendered = false;
  }

  /**
   * Sets the color in HEX format of the element.
   * @public
   * @param {string} c Desired color in HEX format.
   */
  setColor(c) {
    this.color = c;
    if (this.renderer) this.renderer.rendered = false;
  }

  /**
   * Sets if the element is draggable.
   * @public
   * @param {boolean} s True sets the element as draggable, false otherwise.
   */
  draggable(s) {
    this.isDraggable = s;
  }

  /**
   * Sets the element as a topmost element.
   * @private
   * @param {boolean} state True sets the z-index to 1000, false sets the z-index to the saved z-index.
   */
  topmost(state) {
    this.zIndex = state ? 1000 : this.savedZIndex;
  }

  /**
   * Sets the z-index of the element. It is used to sort the drawing order of the element.
   * Those with the lowest z-index are drawn first. The highest z-index is drawn last.
   * @public
   * @param {number} z Desired z-index.
   */
  setZ(z) {
    this.zIndex = z;
    this.savedZIndex = z;
  }

  /**
   * Sets the position of the element.
   * @public
   * @param {number} x -x coordinate.
   * @param {number} y -y coordinate.
   */
  setPosition(x, y) {
    this.position.x = utils.round(x, 3);
    this.position.y = utils.round(y, 3);
    if (this.renderer) this.renderer.rendered = false;
  }

  /**
   * Adds the provided coordinates to the position.
   * @public
   * @param {number} x -x coordinate.
   * @param {number} y -y coordinate.
   */
  addPosition(x, y) {
    this.position.x += utils.round(x, 3);
    this.position.y += utils.round(y, 3);
    if (this.renderer) this.renderer.rendered = false;
  }

}
