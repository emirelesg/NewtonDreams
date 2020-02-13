import * as utils from "../Utils";
import * as constants from "../Constants";
import WorldElement from "../WorldElement";
import Plot from "./Plot";
import Graph from "./box/Box.Graph";

/**
 * The DataCursor class is used to add data cursors to plots. It works with plots added to Graph and World objects.
 * @public
 * @class DataCursor
 */
export default class DataCursor extends WorldElement {

  /**
   * @constructor
   * @param {object} [opts] Object that contains valid DataCursor properties with values. Their values will be assigned at the end of the constructor. If an invalid property is passed then the value will be ignored.
   */
  constructor(opts) {

    // Extend WorldElement.
    super();    

    /**
     * Updates the data cursor every frame.
     * @type {boolean}
     */
    this.constant = false;

    /**
     * Array with Plot elements that can have data cursors.
     * @type {[Plot]}
     */
    this.plots = [];

    /**
     * Sets the radius of the cursor.
     * Default value is 4.
     * @type {number}
     */
    this.cursorRadius = 4;

    /**
     * Object that contains info about the closest point to the cursor.
     * @type {object}
     * @property {distance} Squared distance to the closest point.
     * @property {px} -x coordinate in pixels, referenced to the main axis.
     * @property {py} -y coordinate in pixels, referenced to the main axis.
     * @property {label} Label with the -x and -y coordinates to be displayed in the data cursor.
     * @property {color} Plot's color.
     */
    this.closest = { distance: Infinity, px: 0, py: 0, label: '', color: '' };

    /**
     * Sets the color of the data cursor box. The color must have the format as in {@link BOX_COLORS}.
     * The default value is {@link BOX_COLORS}.BLUE.
     * @type {object}
     * @property {string} BACKGROUND Background color.
     * @property {string} BORDER Border color.
     */
    this.color = constants.BOX_COLORS.GRAY;

    /**
     * Sets the cursor that appears when hovering a point in a plot.
     * @type {string}
     */
    this.cursor = constants.CURSOR.CROSS;

    /**
     * Flag for allowing the element to be dragged around. Must be set to true, in order
     * for the cursor to be changed.
     */
    this.isDraggable = true;

    // Sets the data cursor's font.
    this.font.set({
      size: 12,
      baseline: "middle",
      align: "center",
      color: constants.COLORS.GRAY
    });

    // Apply user settings.
    utils.loadOptions(this, opts);

  }

  /*
   * Add a data cursor to a Plot.
   * @public
   * @param  {...Plot} Plots to be added.
   */
  add(...args) {
    args.forEach((obj) => {
      if (obj instanceof Plot && this.plots.indexOf(obj) < 0) {
        this.plots.push(obj);
      }
    })
  } 

  /**
   * Removes the data cursor from a Plot.
   * @public
   * @param  {...Plot} Plots to be removed.
   */
  remove(...args) {
    args.forEach((obj) => {
      if (this.plots.indexOf(obj)) {
        this.plots.splice(this.plots.indexOf(obj), 1);
      }
    })
  } 

  /**
   * Determines which is the closest point to the pointer.
   * @private
   */
  isMouseOverPlot(plot) {

    // Check if the plot is placed inside of a Graph object.
    const isInGraph = plot.world instanceof Graph;

    // Get the mouse object.
    const { mouse } = isInGraph ? plot.world.box.world : plot.world;

    // Calculate the -x and -y offsets to the points in px.
    let offsetX = plot.world.axis.position.x;
    let offsetY = plot.world.axis.position.y;
    if (isInGraph) {
      offsetX += plot.world.box.position.x 
        + plot.world.box.padding.left 
        + plot.world.position.x 
        + plot.world.padding.left;
      offsetY += plot.world.box.position.y
        + plot.world.box.padding.top 
        + plot.world.position.y
        + plot.world.padding.top;
    }

    // Iterate through all points in the plot and find the closest point.
    let closestPoint = { distance: Infinity, px: 0, py: 0, label: '', color: '' };
    plot.getPoints().forEach(([x, y, px, py, isVisible]) => {

      // Only analyze points that are in view.
      if (isVisible) {

        // Compare the squared distance to the point.
        const distance = utils.distSquared(mouse.x, mouse.y, px + offsetX, py + offsetY);

        // If point is closer to previous point...
        if (distance < closestPoint.distance && distance < 125) {
          closestPoint.px = px;
          closestPoint.py = py;
          // If point is in a graph, get the position in pixels referenced to the true world's axis.
          if (isInGraph) {
            closestPoint.px += offsetX - plot.world.box.world.axis.position.x;
            closestPoint.py += offsetY - plot.world.box.world.axis.position.y;
          }
          closestPoint.label = `(${utils.round(x, 2)}, ${utils.round(y, 2)})`;
          closestPoint.distance = distance;
          closestPoint.color = plot.color;
        }
      }  

    });

    return closestPoint;

  };
    

  /**
   * Tests if the mouse is over any plot.
   * @private 
   * @returns {boolean} Returns true if the pointer is over any plot.
   */
  isMouseOver() {
    // Get the closest point from every plot, and then sort them by increasing distance.
    let closestPoints = this.plots
      .filter(plot => plot.display)
      .map(plot => this.isMouseOverPlot(plot)).sort((a, b) => a.distance - b.distance);
    if (closestPoints.length && closestPoints[0].distance < Infinity) {
      this.closest = closestPoints[0];
      return true;
    }
    this.closest.distance = Infinity;
    return false;
  }

  /**
   * Draws the data cursor.
   * @private
   */
  draw() {
    const { ctx } = this.world;

    // Continuously check if the mouse is over something.
    if (this.constant) this.isMouseOver();

    // Only draw coordinates if mouse is over something.
    if (this.closest.distance < Infinity) {
    
      // Move to the point.
      ctx.save();
      ctx.translate(this.closest.px, this.closest.py);

      // Calculate the text's dimensions.
      this.font.toCtx(ctx);
      const width = ctx.measureText(this.closest.label).width + 10;
      const height = this.font.size + 10;
      const offsetHeight = 25;

      // Draw marker.
      ctx.beginPath();
      ctx.fillStyle = this.closest.color;
      ctx.arc(0, 0, this.cursorRadius, 0, constants.TWO_PI);
      ctx.fill();
      ctx.closePath();

      // Draw rectangle.
      ctx.beginPath();
      ctx.fillStyle = this.color.BACKGROUND;
      ctx.strokeStyle = this.color.BORDER;
      ctx.rect(-width/2, -height/2 - offsetHeight, width, height);
      ctx.stroke();
      ctx.fill();
      ctx.closePath();
      
      // Draw text.
      ctx.beginPath();
      this.font.toCtx(ctx);
      ctx.fillText(this.closest.label, 0, -offsetHeight);
      ctx.fill();
      ctx.closePath();

      ctx.restore();
    }

  }

}
