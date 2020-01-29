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
  }

  /**
   * Main draw function for the Plot called by the World automatically.
   * @private
   */
  draw() {
    const { scaleX, scaleY, ctx } = this.world;
    const prevLineWidth = ctx.lineWidth;

    // Draw path.
    ctx.beginPath();
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.color;
    let disconnected = false;
    for (let i = 0; i < this.points.length; i++) {

      // Draw line plot.
      const x = this.points[i][0] * scaleX.toPx;
      const y = this.points[i][1] * scaleY.toPx;

      if (this.style === "line") {
        if (this.drawInvisiblePoints || this.world.axis.isPointVisible(x, y)) {
          if (i === 0 || disconnected) {
            ctx.moveTo(x, y);
            disconnected = false;
          } else {
            ctx.lineTo(x, y);
          }
        } else {
          disconnected = true;
        }
      } else {

        // Draw histogram.
        ctx.fillStyle = this.color;
        ctx.rect(x - this.binWidth / 2, 0, this.binWidth, y);
        ctx.fill();

      }

    }
    ctx.stroke();
    ctx.closePath();

    // Draw markers.
    this.font.set({ baseline: "middle" });
    for (let i = 0; i < this.markers.length; i++) {
      // Draw marker circles.
      const x = this.markers[i].x * scaleX.toPx;
      const y = this.markers[i].y * scaleY.toPx;
      ctx.beginPath();
      ctx.fillStyle = this.markers[i].color;
      ctx.arc(x, y, this.markerRadius, 0, constants.TWO_PI);
      ctx.fill();
      // ctx.closePath();

      // Draw marker label box.

      // Draw marker labels.
      if (this.markers[i].label !== "") {
        const direction = this.markers[i].top ? -1 : 1;
        this.font.toCtx(ctx);
        if (this.markers[i].lower_label !== "") {
          ctx.fillText(
            this.markers[i].label,
            x,
            y + (this.markerRadius + 25) * direction
          );
          ctx.fillText(
            this.markers[i].lower_label,
            x,
            y + (this.markerRadius + 10) * direction
          );
        } else {
          ctx.fillText(
            this.markers[i].label,
            x,
            y + (this.markerRadius + 10) * direction
          );
        }
      }
    }
    ctx.lineWidth = prevLineWidth;
  }

}
