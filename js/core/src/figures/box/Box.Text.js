import * as utils from "../../Utils";
import * as constants from "../../Constants";
import WorldElement from "../../WorldElement";

/**
 * A Text Box allows for text to be displayed on a Box element. The text can be multiline
 * containing \n caracters.
 * A Text object is created by calling the method {@link Box.addText} on the parent Box.
 * @private
 * @class Text
 */
export default class Text extends WorldElement {

  /**
   * @constructor
   * @param {Box} box Parent box.
   * @param {number} width Width of the text in pixels.
   * @param {number} height Height of the text in pixels.
   * @param {object} [opts] Object that contains valid Text properties with values. Their values will be assigned at the end of the constructor. If an invalid property is passed then the value will be ignored.
   */
  constructor(box, width, height, opts) {

    // Extend WorldElement.
    super();

    /**
     * Sets the parent box where te Text will be placed.
     * @type {Box}
     */
    this.box = box;

    /**
     * Sets the width of the Text in pixels.
     * @type {number}
     */
    this.width = width;

    /**
     * Sets the height of the Text in pixels.
     * @type {number}
     */
    this.height = height;

    /**
     * Contains the string to be displayed separated by every \n character.
     * Default value is [].
     * @type {string[]}
     */
    this.text = [];
    
    // Configure font settings for the text.
    this.font.set({
      align: "left",
      size: 14,
      baseline: "top",
      color: constants.COLORS.GRAY
    });

    // Apply user settings.
    utils.loadOptions(this, opts);

  }

  /**
   * Sets the text that will be displayed. The text can have multiple lines.
   * @public
   * @param {string} rawText Text to be displayed.
   */
  setText(rawText) {
    this.text = rawText.split("\n");
  }

  /**
   * Debug function used to draw a box around the dimensions of the text object.
   * It is only drawn if the parent box has the flag {@link Box.debug} enabled.
   * @private
   */
  debug() {
    const { ctx } = this.box.world;
    ctx.beginPath();
    ctx.strokeStyle = constants.COLORS.RED;
    ctx.rect(0, 0, this.width, this.height);
    ctx.stroke();
    ctx.closePath();
  }

  /**
   * Draw function for the Text called by the parent box.
   * @private
   */
  draw() {
    const { ctx } = this.box.world;
    ctx.beginPath();
    this.font.toCtx(ctx);
    for (let i = 0; i < this.text.length; i += 1) {
      ctx.fillText(this.text[i], 0, i * this.font.spacing * this.font.size);
    }
    ctx.closePath();
  }
}
