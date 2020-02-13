import * as constants from "../Constants";
import * as utils from "../Utils";
import WorldElement from "../WorldElement";

/**
 * The Plot class can be used to draw a line plot or a histogram on an axis. It
 * is also possible to add markers on top of a line plot with information
 * about the -x and -y values.
 * @public
 * @class Plot
 */
export default class Plot extends WorldElement {

  /**
   * @constructor
   * @param {object} [opts] Object that contains valid Plot properties with values. Their values will be assigned at the end of the constructor. If an invalid property is passed then the value will be ignored.
   */
  constructor(opts) {

    // Extend WorldElement.
    super();

    /**
     * Array for storing the points.
     * @type {object[]}
     */
    this.points = [];

    /**
     * Sets the maximum index to display.
     * @type {number}
     */
    this.displayUntil = -1;

    /**
     * Sets a flag for shading the area under the curve.
     * @type {boolean}
     */
    this.shade = false;

    /**
     * Sets the color of the shade.
     * @type {string}
     */
    this.shadeColor = 'rgba(1, 1, 1, 0.2)';

    /**
     * Array for storing the markers.
     * @type {object[]}
     */
    this.markers = [];

    /**
     * Sets the maximum amount of points the plot can have at a single time. Once 
     * the array of points fills up, the earliest points will be removed. 
     * This is done for memory purposes.
     * Default value is 300.
     * @type {number}
     */
    this.limit = 300;

    /**
     * Sets the radius of the markers.
     * Default value is 4.
     * @type {number}
     */
    this.markerRadius = 4;

    /**
     * Sets the linewidth of the plot in pixels.
     * Default value is 2.
     * @type {number}
     */
    this.lineWidth = 2;

    /**
     * Sets the label for the plot. Only used when the plot is added to a {@link Graph} object.
     * Default value is "".
     * @type {string}
     */
    this.label = "";

    /**
     * Flag for drawing all points in the plot regardless if the point is outside the
     * visible range of the plot.
     * Default value is false.
     * @type {boolean}
     */
    this.drawInvisiblePoints = false;

    /**
     * Sets the type of plot. Any other value than "line" will result in a histogram plot.
     * Default value is "line".
     * @type {string}
     */
    this.style = "line";

    /**
     * When the plot is configured in histogram mode, the binWidth is the width of the
     * bars in pixels.
     * Default value is 3.
     * @type {number}
     */
    this.binWidth = 3;

    // Apply user settings.
    utils.loadOptions(this, opts);

  }

  /**
   * Sets a label for the plot. Only used when the plot is added to a {@link Graph} object.
   * @public
   * @param {string} label Label for the plot.
   */
  setLabel(label) {
    this.label = label;
  }

  /**
   * Adds a point to the plot.
   * @public
   * @param {number} x -x coordinate of the point to add.
   * @param {number} y -y coordinate of the point to add.
   */
  addPoint(x, y) {
    this.points.push([x, y]);
    if (this.points.length > this.limit && this.limit > 0) {
      this.points.shift();
    }
  }

  /**
   * Adds a marker to the plot.
   * @public
   * @param {number} x -x coordinate of the marker to add.
   * @param {number} y -y coordinate of the marker to add.
   * @param {object} args Object with other properties that a marker can have.
   * @param {string} args.label Top label of the marker.
   * @param {string} args.lower_label Bottom label of the marker.
   * @param {string} args.color HEX color of the marker. Default value is the color of the plot.
   * @param {boolean} args.top Flag for choosing if the labels will be drawn over the marker or below the marker. Default value is true.
   */
  addMarker(x, y, args) {
    // eslint-disable-next-line prefer-const
    let input = {
      x,
      y,
      label: "",
      lower_label: "",
      color: this.color,
      top: true
    };
    utils.loadOptions(input, args);
    this.markers.push(input);
  }

  /**
   * Deletes all points and markers.
   * @public
   */
  clear() {
    this.points = [];
    this.markers = [];
    this.displayUntil = -1;
  }

  /**
   * Main draw function for the Plot called by the World automatically.
   * @private
   */
  draw() {

    // Get all points.
    const p = this.getPoints();

    // Drawing sequence.
    if (this.shade) this.drawShade(p);
    this.drawPlot(p);
    this.drawMarkers();
    
  }

  /**
   * Calculates the amount of points that can be displayed, starting from 0.
   * @returns {number} The index of the last point.
   */
  maxIdx() {
    return this.displayUntil >= 0 && this.displayUntil < this.points.length ? this.displayUntil + 1 : this.points.length;
  }

  /**
   * Returns the points array until the max Idx. Also converts every point to pixels and determines if
   * the point is visible.
   * @return {any} Array of points.
   */
  getPoints() {
    return this.points
      .filter((_, idx) => idx < this.maxIdx())
      .map(p => {
        const px = p[0] * this.world.scaleX.toPx;
        const py = p[1] * this.world.scaleY.toPx;
        return [
          ...p,
          px,
          py,
          this.world.axis.isPointVisible(px, py)
        ];
      });
  }

  /**
   * Shade the area under the curve.
   * @param {array} p Array of precalculated points.
   * @private
   */
  drawShade(p) {
    const { scaleX, scaleY, ctx } = this.world;
    ctx.beginPath();
    ctx.fillStyle = this.shadeColor;
    let disconnected = false;
    p.forEach(([x, y, px, py, isVisible], i) => {
      if (this.drawInvisiblePoints || isVisible) {
        if (i === 0 || disconnected) {
          ctx.moveTo(px, 0);
          ctx.lineTo(px, py);
          disconnected = false;
        } else {
          ctx.lineTo(px, py);
          if (i === this.maxIdx() - 1) ctx.lineTo(px, 0);          
        }
      } else {
        disconnected = true;
        ctx.lineTo(px, 0);
      }
    });
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Draw the plot.
   * @param {array} p Array of precalculated points.
   * @private
   */
  drawPlot(p) {
    const { scaleX, scaleY, ctx } = this.world;
    const prevLineWidth = ctx.lineWidth;
    ctx.beginPath();
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.color;
    let disconnected = false;
    p.forEach(([x, y, px, py, isVisible], i) => {
      if (this.style === "line") {
        if (this.drawInvisiblePoints || isVisible) {
          if (i === 0 || disconnected) {
            ctx.moveTo(px, py);
            disconnected = false;
          } else {
            ctx.lineTo(px, py);
          }
        } else {
          disconnected = true;
        }
      } else {
        // Draw histogram.
        ctx.fillStyle = this.color;
        ctx.rect(px - this.binWidth / 2, 0, this.binWidth, py);
        ctx.fill();
      }
    });
    ctx.stroke();
    ctx.closePath();
    ctx.lineWidth = prevLineWidth;
  }

  /**
   * Draw the markers.
   * @private
   */
  drawMarkers() {
    const { scaleX, scaleY, ctx } = this.world;
    this.font.set({ baseline: "middle" });
    this.markers.forEach((m) => {

      // Draw marker circles.
      const px = m.x * scaleX.toPx;
      const py = m.y * scaleY.toPx;
      ctx.beginPath();
      ctx.fillStyle = m.color;
      ctx.arc(px, py, this.markerRadius, 0, constants.TWO_PI);
      ctx.fill();
      ctx.closePath();

      // Draw marker labels.
      if (m.label !== "") {
        const direction = m.top ? -1 : 1;
        this.font.toCtx(ctx);
        if (m.lower_label !== "") {
          ctx.fillText(
            m.label,
            px,
            py + (this.markerRadius + 25) * direction
          );
          ctx.fillText(
            m.lower_label,
            px,
            py + (this.markerRadius + 10) * direction
          );
        } else {
          ctx.fillText(
            m.label,
            px,
            py + (this.markerRadius + 10) * direction
          );
        }
      }
    });
  }


}
