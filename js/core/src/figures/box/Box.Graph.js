import * as utils from "../../Utils";
import * as constants from "../../Constants";
import WorldElement from "../../WorldElement";
import Scale from "../../Scale";
import Axis from "../Axis";
import Plot from "../Plot";

/**
 * A Graph Box allow for {@link Plot} elements to be displayed in the box using a different scale to
 * the main axis in the world.
 * A Graph object is created by calling the method {@link Box.addGraph} on the parent Box.
 * @private
 */
export default class Graph extends WorldElement {

  /**
   * @constructor
   * @param {Box} box Parent box.
   * @param {number} width Width of the graph in pixels.
   * @param {number} height Height of the graph in pixels.
   * @param {object} [opts] Object that contains valid Graph properties with values. Their values will be assigned at the end of the constructor. If an invalid property is passed then the value will be ignored.
   */
  constructor(box, width, height, opts) {

    // Extend WorldElement.
    super();

    /**
     * Sets the parent box where te Graph will be placed.
     * @type {Box}
     */
    this.box = box;

    /**
     * Sets the width of the Graph in pixels.
     * @type {number}
     */
    this.width = width;

    /**
     * Sets the height of the Graph in pixels.
     * @type {number}
     */
    this.height = height;

    /**
     * Array containing the plots displayed on the graph.
     * @type {Plot[]}
     */
    this.plots = [];

    /**
     * Flag for enabling the display of the plot's legend. Usually turned on when
     * more than one plot is being displayed.
     * Default value is false.
     * @type {boolean}
     */
    this.legends_enabled = false;

    /**
     * Sets the padding in pixels that the graph has. The padding is used to display
     * the title, x label, and y label. The padding is then adjusted depending on the
     * value of {@link Graph.legends_enabled} to accomodate the display of the legends.
     * @type {object}
     * @property {number} left=25 Left padding in pixels.
     * @property {number} bottom=25 Bottom padding in pixels.
     * @property {number} right=10 Right padding in pixels.
     * @property {number} top=10 Top padding.
     */
    this.padding = { left: 25, bottom: 25, right: 10, top: 10 };

    /**
     * Scale object for the -x axis.
     * Default scale is 20px per 1 unit.
     * @type {Scale}
     */
    this.scaleX = new Scale(20, 1, "");

    /**
     * Scale object for the -y axis.
     * Default scale is 20px per 1 unit.
     * @type {Scale}
     */
    this.scaleY = new Scale(20, -1, "");

    /**
     * Sets the title for the graph.
     * Default value is "".
     * @type {string}
     */
    this.title = "";

    /**
     * Sets the label for the -x axis.
     * Default value is "x".
     * @type {string}
     */
    this.xlabel = "x";

    /**
     * Sets the label for the -y axis.
     * Default value is "y".
     * @type {string}
     */
    this.ylabel = "y";

    /**
     * Array that stores the position of the axis. See {@link Graph.setAxisPosition} for
     * more details.
     * Default value is ["left", "bottom"].
     * @type {string[]}
     */
    this.axisPosition = ["left", "bottom"];

    /**
     * Context of the cavas where the Graph is drawn. The canvas is saved
     * in order for the plots to be able to find it, since the parent of the Plot is
     * this object.
     * @type {object}
     */
    this.ctx = undefined;

    /**
     * Axis object used to draw the graph axis.
     * @type {Axis}
     */
    this.axis = new Axis(
      this.width - this.padding.left - this.padding.right,
      this.height - this.padding.top - this.padding.bottom,
      {
        world: this,
        color: constants.COLORS.GRAY,
        subAxisColor: "#DDDDDD",
        textOffset: 2,
        tickSize: 4,
        tickSizeSmall: 2,
        outsideNumbers: false
      }
    );

    // Configure the font used on the axis.
    this.font.set({ size: 14, color: constants.COLORS.GRAY, baseline: "top" });

    // Configure the axis font and disable the prerenderer.
    this.axis.font.color = constants.COLORS.GRAY;
    this.axis.renderer.enabled = false;
    
    // Configure the axis position.
    this.setAxisPosition();
    
    // Apply user settings.
    utils.loadOptions(this, opts);

  }

  /**
   * Sets the origin of the axis. 
   * The -x axis has the following position options: center, right, left.
   * The -y axis has the following position options: center, top, bottom.
   * @public
   * @param {string} [xPos] Desired position for the -x axis.
   * @param {string} [yPos] Desired position for the -y axis.
   */
  setAxisPosition(xPos, yPos) {

    if (xPos !== undefined) this.axisPosition[0] = xPos;
    if (yPos !== undefined) this.axisPosition[1] = yPos;

    let x = 0;
    let y = this.axis.height;

    if (this.axisPosition[0] === "center") {
      x = this.axis.width / 2;
    } else if (this.axisPosition[0] === "right") {
      x = this.axis.width;
    }
    if (this.axisPosition[1] === "top") {
      y = 0;
    } else if (this.axisPosition[1] === "center") {
      y = this.axis.height / 2;
    }

    this.axis.setPosition(x, y);

  }

  /**
   * Calculates the dimensions of the axis based on the total Graph dimensions and
   * the padding set. Then the calculated dimensions are set to the axis.
   * @private
   */
  setAxisDimensions() {
    this.axis.width = this.width - this.padding.left - this.padding.right;
    this.axis.height = this.height - this.padding.top - this.padding.bottom;
    this.setAxisPosition();
  }

  /**
   * Change the dimensions of the Graph object.
   * @public
   * @param {number} width Width of the graph.
   * @param {number} height Height of the graph.
   */
  setDimensions(width, height) {
    this.width = width;
    this.height = height;
    this.setAxisDimensions();
  }

  /**
   * Controls if the legens are displayed. If true, then the padding is adjusted
   * to make space for it.
   * @public
   * @param {boolean} state Desired state for the legends.
   */
  legends(state) {
    this.legends_enabled = state;
    if (this.legends_enabled) {
      this.padding.top = 25;
    } else {
      this.padding.top = 10;
    }
    this.setAxisDimensions();
  }

  /**
   * Sets the padding of the Graph object.
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
    this.axis.width = this.width - left - right;
    this.axis.height = this.height - top - bottom;
    this.setAxisDimensions();
  }

  /**
   * Adds a {@link Plot} to the graph.
   * @public
   * @param {object} opts Object that contains valid Plot properties with values. Their values will be assigned at the end of the constructor. If an invalid property is passed then the value will be ignored.
   * @returns {Plot} The newly created plot object.
   */
  addPlot(opts) {
    const plot = new Plot(opts);
    plot.setWorld(this);
    this.plots.push(plot);
    return plot;
  }

  /**
   * Sets the labels for the graph. Usually the graph title is left blank, and the box's title
   * is used as title.
   * @public
   * @param {string} title Title of the graph.
   * @param {string} xlabel Label for the -x axis.
   * @param {string} ylabel Label for the -y axis.
   */
  setLabels(title, xlabel, ylabel) {
    this.title = title;
    this.xlabel = xlabel;
    this.ylabel = ylabel;
  }

  /**
   * Debug function used to draw a box around the dimensions of the Graph object. It
   * also draws boxes around the padding sections with different fill colors in order
   * to distinguish between them.
   * The boxes are only drawn if the parent box has the flag {@link Box.debug} enabled.
   * @private
   */
  debug() {
    const { ctx } = this.box.world;

    // Section above graph.
    ctx.beginPath();
    ctx.fillStyle = constants.BOX_COLORS.GREEN.BACKGROUND;
    ctx.rect(0, 0, this.width - this.padding.right, this.padding.top);
    ctx.fill();
    ctx.closePath();

    // Section bellow graph.
    ctx.beginPath();
    ctx.fillStyle = constants.BOX_COLORS.PURPLE.BACKGROUND;
    ctx.rect(
      0,
      this.height - this.padding.bottom,
      this.width,
      this.padding.bottom
    );
    ctx.fill();
    ctx.closePath();

    // Section left of graph.
    ctx.beginPath();
    ctx.fillStyle = constants.BOX_COLORS.YELLOW.BACKGROUND;
    ctx.rect(0, 0, this.padding.left, this.height - this.padding.bottom);
    ctx.fill();
    ctx.closePath();

    // Circle at the origin of the axis.
    ctx.beginPath();
    ctx.arc(
      this.axis.position.x + this.padding.left,
      this.axis.position.y + this.padding.top,
      4,
      0,
      constants.TWO_PI
    );
    ctx.stroke();
    ctx.closePath();

    // Red box around the graph dimensions.
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = constants.COLORS.RED;
    ctx.rect(0, 0, this.width, this.height);
    ctx.rect(
      this.padding.left,
      this.padding.top,
      this.width - this.padding.left - this.padding.right,
      this.height - this.padding.top - this.padding.bottom
    );
    ctx.stroke();
    ctx.closePath();
  }

  /**
   * Draw function for the Graph and Plots called by the parent box.
   * @private
   */
  draw() {
    const { ctx } = this.box.world;

    // Draw legends.
    if (this.legends_enabled) {
      const enabledPlots = this.plots.filter((p) => p.display && p.label !== '');
      const legendSpace = this.width / enabledPlots.length;
      enabledPlots.forEach((plot, i) => {
        ctx.beginPath();
        this.font.set({ size: 12, baseline: "middle" });
        this.font.toCtx(ctx);
        const x = Math.floor(legendSpace / 2 + legendSpace * i);
        const y = Math.floor(this.padding.top * 0.3);
        ctx.fillText(plot.label, x, y);
        ctx.fillStyle = plot.color;
        ctx.arc(
          Math.floor(x - ctx.measureText(plot.label).width / 2 - 10),
          y,
          4,
          0,
          constants.TWO_PI
        );
        ctx.fill();
        ctx.closePath();
      });
    }

    // Draw Title
    if (this.title !== "") {
      this.font.set({ size: 14 });
      this.font.toCtx(ctx);
      ctx.beginPath();
      ctx.fillText(
        this.title,
        Math.floor(this.width / 2),
        Math.floor(this.padding.top * 0.2)
      );
    }

    // Draw X Label
    this.font.set({ size: 12, baseline: 'bottom' });
    this.font.toCtx(ctx);
    ctx.fillText(
      this.xlabel,
      Math.floor(this.padding.left + this.axis.width / 2),
      Math.floor(this.height)
    );

    // Draw Y Label
    ctx.save();
    ctx.translate(
      Math.floor(0),
      Math.floor(this.padding.top + this.axis.height / 2)
    );
    ctx.rotate(constants.HALF_PI);
    ctx.fillText(this.ylabel, 0, 0);
    ctx.restore();
    ctx.closePath();

    // Draw Axis
    ctx.translate(
      this.axis.position.x + this.padding.left,
      this.axis.position.y + this.padding.top
    );
    this.ctx = ctx;
    this.axis.draw();

    // Draw plots.
    this.plots.forEach(plot => {
      if (plot.display) plot.draw()
    });
  }

}
