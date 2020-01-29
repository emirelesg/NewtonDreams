import * as utils from "../Utils";
import * as constants from "../Constants";
import Renderer from "../Renderer";
import WorldElement from "../WorldElement";

/**
 * The Shape class is used to draw shapes manually onto the world. The class provides similar
 * functionality to the methods found in the context on a canvas with key difference
 * that all coordinates passed to the methods in the Shape class take as parameters real
 * units. This makes it possible to draw shapes in the world with ease.
 * @public
 */
export default class Shape extends WorldElement {

  /**
   * @constructor
   * @param {function} onDraw Function where the drawing process occurs.
   * @param {object} [opts] Object that contains valid Shape properties with values. Their values will be assigned at the end of the constructor. If an invalid property is passed then the value will be ignored.
   */
  constructor(onDraw, opts) {

    // Extend WorldElement.
    super();

    /**
     * Sets the currently active shape style.
     * Default value is {@link SHAPE_STYLE}.NONE.
     * @type {number}
     */
    this.shapeStyle = constants.SHAPE_STYLE.NONE;

    /**
     * Sets the fill color for shapes.
     * Default value is {@link BOX_COLORS}.GREEN.BACKGROUND.
     * @type {string}
     */
    this.fillColor = constants.BOX_COLORS.GREEN.BACKGROUND;

    /**
     * Sets the stroke color for shapes.
     * Default value is {@link BOX_COLORS}.GREEN.BORDER.
     * @type {string}
     */
    this.strokeColor = constants.BOX_COLORS.GREEN.BORDER;

    /**
     * Sets the default angle style. This means all angles used as parameters are provided and
     * set with this style.
     * Default value is {@link ANGLE_STYLE}.DEG.
     * @type {number}
     */
    this.angleStyle = constants.ANGLE_STYLE.DEG;

    /**
     * Sets if the coordinates are referenced to the previous coordinates given or are 
     * allways absolute.
     * Default value is {@link SHAPE_STYLE}.NONE.
     * @type {number}
     */
    this.shapeMode = constants.SHAPE_STYLE.NONE;

    /**
     * Sets the previous position used by {@link Shape.lineTo} or {@link Shape.moveTo}.
     * This is used if the {@link Shape.shapeMode} is set to {@link SHAPE_STYLE}.ACCOMULATIVE.
     * @type {object}
     * @property {number} x -x coordinate.
     * @property {number} y -y coordinate.
     */
    this.prevPosition = { x: 0, y: 0 };

    /**
     * Callback function where the shape will be drawn.
     * @type {function}
     */
    this.onDraw = utils.isFunction(onDraw) ? onDraw : undefined;

    /**
     * Sets the prerenderer for the Shape. It is disabled by default.
     * @type {Renderer}
     */
    this.renderer = new Renderer({ enabled: false });
    
    // Apply user settings.
    utils.loadOptions(this, opts);

  }

  /**
   * Selects the currently active context for drawing the shape.
   * @private
   * @returns {object} The context where shape will be drawn.
   */
  selectCtx() {
    return this.renderer.enabled ? this.renderer.ctx : this.world.ctx;
  }

  /**
   * Starts a drawing path.
   * @private
   * @param {number} [s] Desired shape style. See {@link SHAPE_STYLE}.
   */
  begin(s) {
    const ctx = this.selectCtx();
    this.shapeStyle = s !== undefined ? s : constants.SHAPE_STYLE.NONE;
    ctx.beginPath();
  }

  /**
   * Closes a drawing path and fills and/or strokes it depending on the settings of
   * {@link Shape.fillColor} and {@link Shape.strokeColor}.
   * @public
   */
  end() {
    const ctx = this.selectCtx();
    if (this.fillColor !== undefined) {
      ctx.fillStyle = this.fillColor;
      ctx.fill();
    }
    if (this.strokeColor !== undefined) {
      ctx.strokeStyle = this.strokeColor;
      ctx.stroke();
    }
    ctx.closePath();
  }

  /**
   * Main draw function for the shape called by the World automatically.
   * @private
   */
  draw() {
    if (utils.isFunction(this.onDraw)) {
      if (this.renderer.enabled) {
        if (this.renderer.rendered) {
          this.renderer.draw();
        } else {
          this.renderer.begin();
          this.onDraw();
          this.renderer.end();
          this.renderer.draw();
        }
      } else {
        this.save();
        this.onDraw();
        this.restore();
      }
    }
  }

  /**
   * Sets the starting position of drawing path. The path must be then continued by 
   * calling {@link Shape.lineTo}.
   * @public
   * @param {number} x0 Starting -x coordinate for the current drawing path.
   * @param {number} y0 Starting -y coodinate for the current drawing path.
   */
  moveTo(x0, y0) {
    const ctx = this.selectCtx();
    const { scaleX, scaleY } = this.world;
    this.prevPosition.x = x0 * scaleX.toPx;
    this.prevPosition.y = y0 * scaleY.toPx;
    ctx.moveTo(this.prevPosition.x, this.prevPosition.y);
  }

  /**
   * Draws a line to coordinates (x0, y0). Before using this function, the function
   * {@link Shape.moveTo} must be used to set the starting point of the line. Multiple calls
   * to this function can be used to create a shape.
   * @public
   * @param {number} x0 Next -x coordinate for the line.
   * @param {number} y0 Next -y coordinate for the line.
   */
  lineTo(x0, y0) {
    const ctx = this.selectCtx();
    const { scaleX, scaleY } = this.world;
    if (this.shapeStyle === constants.SHAPE_STYLE.ACCOMULATIVE) {
      this.prevPosition.x += x0 * scaleX.toPx;
      this.prevPosition.y += y0 * scaleY.toPx;
      ctx.lineTo(this.prevPosition.x, this.prevPosition.y);
    } else {
      ctx.lineTo(x0 * scaleX.toPx, y0 * scaleY.toPx);
    }
  }

  /**
   * Sets a fill color.
   * @public
   * @param {string} fillColor Fill color in HEX format.
   */
  fill(fillColor) {
    this.fillColor = fillColor;
  }

  /** Disables filling the shapes drawn.
   * @public
   */
  noFill() {
    this.fillColor = undefined;
  }

  /**
   * Sets a stroke color.
   * @public
   * @param {string} strokeColor Stroke color in HEX format.
   */
  stroke(strokeColor) {
    this.strokeColor = strokeColor;
  }

  /**
   * Disables stroking the shapes drawn.
   * @public
   */
  noStroke() {
    this.strokeColor = undefined;
  }

  /**
   * Saves the current state of the shape.
   * @public
   */
  save() {
    const ctx = this.selectCtx();
    ctx.save();
  }

  /**
   * Restores the shape to the previously saved state.
   * @public
   */
  restore() {
    const ctx = this.selectCtx();
    ctx.restore();
  }

  /**
   * Sets the stroke weight of all lines.
   * @public
   * @param {number} weight Weight of the lines.
   */
  strokeWeight(weight) {
    const ctx = this.selectCtx();
    ctx.lineWidth = weight;
  }

  /**
   * Sets the line dash of all lines.
   * @public
   * @param {number} i Length of the dash in pixels.
   */
  lineDash(i) {
    const ctx = this.selectCtx();
    ctx.setLineDash([i]);
  }

  /**
   * Sets the rotation of the canvas. Before doing a rotation the shape must be saved and then
   * restored. See {@link Shape.translate} for an example.
   * @public
   * @param {number} angle Desired rotation angle.
   */
  rotate(angle) {
    const ctx = this.selectCtx();
    ctx.rotate(-utils.rad(angle, this.angleStyle));
  }

  /**
   * Sets the active angle style found in {@link ANGLE_STYLE}.
   * @public
   * @param {number} mode Desired angle style.
   */
  angleStyle(mode) {
    this.angleStyle = mode;
  }

  /**
   * Translates the origin to a new point (x, y). Doing a translation requires to first save
   * the context by calling {@link Shape.save}, and when finalizing the drawing by calling
   * {@link Shape.restore}. This ensures that the translation doesn't mess with the origin of
   * the axis.
   * Translation is also required when doing a rotation around a point.
   * @example
   * // The following example will draw a 5x5 box at coordinates (1, 1) with a rotation of 90°.
   * var s = new Shape();
   * s.save()
   * s.translate(1, 1)
   * s.rotate(90)
   * s.rect(0, 0, 5, 5);
   * s.restore();
   * @public
   * @param {number} x -x coordinate to translate.
   * @param {number} y -y coordinate to translate.
   */
  translate(x, y) {
    const ctx = this.selectCtx();
    const { scaleX, scaleY } = this.world;
    ctx.translate(x * scaleX.toPx, y * scaleY.toPx);
  }

  /**
   * Draws a triangle given three sets of points.
   * @public
   * @param {number} x0 First -x coordinate of the triangle.
   * @param {number} y0 First -y coordinate of the triangle.
   * @param {number} x1 Second -x coordinate of the triangle.
   * @param {number} y1 Second -y coordinate of the triangle.
   * @param {number} x2 Third -x coordinate of the triangle.
   * @param {number} y2 Third -y coordinate of the triangle.
   */
  triangle(x0, y0, x1, y1, x2, y2) {
    const ctx = this.selectCtx();
    const { scaleX, scaleY } = this.world;
    this.begin();
    ctx.moveTo(x0 * scaleX.toPx, y0 * scaleY.toPx);
    ctx.lineTo(x1 * scaleX.toPx, y1 * scaleY.toPx);
    ctx.lineTo(x2 * scaleX.toPx, y2 * scaleY.toPx);
    ctx.lineTo(x0 * scaleX.toPx, y0 * scaleY.toPx);
    this.end();
  }

  /**
   * Draws a vector given a starting point and a magnitude and angle.
   * @public
   * @param {number} x0 Start -x coordinate of the vector.
   * @param {number} y0 Start -y coordinate of the vector.
   * @param {number} mag Magnitude of the vector.
   * @param {number} angle Angle of the vector.
   * @param {number} color Color of the vector in HEX format.
   * @param {boolean} dashed Flag for drawing the vector with a dashed line.
   * @returns {number[]} Array with the -x and -y end coordinates of the vector.
   */
  vectorFromMag(x0, y0, mag, angle, color, dashed) {
    this.fill(color);
    this.stroke(color);
    const x1 = x0 + mag * utils.cos(angle, this.angleStyle);
    const y1 = y0 + mag * utils.sin(angle, this.angleStyle);
    this.vector(x0, y0, x1, y1, dashed);
    return [x1, y1];
  }

  /**
   * Draws a vector between two points. The vector is a line with an equilateral triangle at
   * the tip of the vector.
   * @public
   * @param {number} _x0 Start -x coordinate of the vector.
   * @param {number} _y0 Start -y coordinate of the vector.
   * @param {number} _x1 End -x coordinate of the vector.
   * @param {number} _y1 End -y coordinate of the vector.
   * @param {boolean} dashed Flag for drawing the vector with a dashed line.
   */
  vector(_x0, _y0, _x1, _y1, dashed) {
    const ctx = this.selectCtx();
    const { scaleX, scaleY } = this.world;
    const x0 = _x0 * scaleX.toPx;
    let x1 = _x1 * scaleX.toPx;
    const y0 = _y0 * scaleY.toPx;
    let y1 = _y1 * scaleY.toPx;
    const side = 0.2 * scaleX.toPx;
    const height = side * constants.SIN60;
    const angle = Math.atan2(y1 - y0, x1 - x0);
    const prevStrokeWeight = ctx.lineWidth;
    this.begin();
    this.strokeWeight(2);
    if (dashed) this.lineDash(5);
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    this.end();
    if (dashed) this.lineDash(1);
    this.begin();
    if (angle !== 0) {
      this.save();
      ctx.translate(x1, y1);
      ctx.rotate(angle);
      x1 = 0;
      y1 = 0;
    }
    ctx.moveTo(x1 - height / 2, y1 + side / 2);
    ctx.lineTo(x1 - height / 2, y1 - side / 2);
    ctx.lineTo(x1 + height / 2, y1);
    ctx.lineTo(x1 - height / 2, y1 + side / 2);
    this.end();
    this.strokeWeight(prevStrokeWeight);
    if (angle !== 0) {
      this.restore();
    }
  }

  /**
   * Draws an equilateral triangle centered around the coordinates (x, y).
   * @public
   * @param {number} x Center -x coordinate of the triangle.
   * @param {number} y Center -y coordinate of the triangle.
   * @param {number} s Side length of the triangle.
   * @param {number} r Rotation of the triangle.
   */
  equilateralTriangle(x, y, s, r) {
    const ctx = this.selectCtx();
    const { scaleX, scaleY } = this.world;
    const side = s * scaleX.toPx;
    const height = side * constants.SIN60;
    let x0 = x * scaleX.toPx;
    let y0 = y * scaleY.toPx;
    this.begin();
    if (r !== undefined && r !== 0) {
      this.save();
      ctx.translate(x0, y0);
      this.rotate(r);
      x0 = 0;
      y0 = 0;
    }
    ctx.moveTo(x0 - height / 2, y0 + side / 2);
    ctx.lineTo(x0 - height / 2, y0 - side / 2);
    ctx.lineTo(x0 + height / 2, y0);
    ctx.lineTo(x0 - height / 2, y0 + side / 2);
    this.end();
    if (r !== undefined && r !== 0) {
      this.restore();
    }
  }

  /**
   * Draws a rectangle on the world.
   * @public
   * @param {number} x0 Bottom left -x coordinate of the rectangle.
   * @param {number} y0 Bottom left -y coordinate of the rectangle.
   * @param {number} w Width of the rectangle.
   * @param {number} h Height of the rectangle.
   */
  rect(x0, y0, w, h) {
    const ctx = this.selectCtx();
    const { scaleX, scaleY } = this.world;
    this.begin();
    ctx.rect(
      x0 * scaleX.toPx,
      y0 * scaleY.toPx,
      w * scaleX.toPx,
      h * scaleY.toPx
    );
    this.end();
  }

  // cube(x0, y0, w, h, l) {

  //   const ctx = this.selectCtx();
  //   const { scaleX, scaleY } = this.world;

  //   const x0_px = x0 * scaleX.toPx;
  //   const y0_px = y0 * scaleY.toPx;
  //   const w_px = w * scaleX.toPx;
  //   const h_px = h * scaleY.toPx;
  //   const ofx = l/2 * Math.cos(25 * constants.DEG_TO_RAD) * scaleX.toPx;
  //   const ofy = l/2 * Math.sin(25 * constants.DEG_TO_RAD) * scaleY.toPx;

  //   this.save();

  //   // Front face.
  //   this.begin();
  //   ctx.translate(x0_px, y0_px);
  //   ctx.rect(0, 0, w_px, h_px);
  //   this.end();

  //   // Top face.
  //   this.begin();
  //   ctx.translate(0, h_px);
  //   ctx.moveTo(0, 0);
  //   ctx.lineTo(ofx, ofy);
  //   ctx.lineTo(w_px + ofx, ofy);
  //   ctx.lineTo(w_px, 0);
  //   ctx.lineTo(0, 0);
  //   this.end();

  //   // Left face.
  //   this.begin();
  //   ctx.translate(w_px, -h_px)
  //   ctx.moveTo(0, 0);
  //   ctx.lineTo(ofx, ofy);
  //   ctx.lineTo(ofx, h_px - ofy);
  //   ctx.lineTo(0, h_px);
  //   ctx.lineTo(0, 0)
  //   this.end();

  //   this.restore();

  // }

  /**
   * Draws a line on the world.
   * @public
   * @param {number} x0 Start -x coordinate of the line. 
   * @param {number} y0 Start -y coordinate of the line.
   * @param {number} x1 End -x coordinate of the line.
   * @param {number} y1 End -y coordinate of the line.
   */
  line(x0, y0, x1, y1) {
    const ctx = this.selectCtx();
    const { scaleX, scaleY } = this.world;
    this.begin();
    ctx.moveTo(x0 * scaleX.toPx, y0 * scaleY.toPx);
    ctx.lineTo(x1 * scaleX.toPx, y1 * scaleY.toPx);
    this.end();
  }

  /**
   * Draws an arc or a circle on the world.
   * @public
   * @param {number} x0 Center -x coordinate of the ellipse.
   * @param {number} y0 Center -y coordinate of the ellipse.
   * @param {number} r Radius of the ellipse.
   * @param {number} start Start angle of the ellipse.
   * @param {number} end End angle of the ellipse.
   */
  arc(x0, y0, r, start, end) {
    const ctx = this.selectCtx();
    const { scaleX, scaleY } = this.world;
    this.begin();
    ctx.arc(
      x0 * scaleX.toPx,
      y0 * scaleY.toPx,
      r * scaleX.toPx,
      utils.rad(start, this.angleStyle),
      utils.rad(end, this.angleStyle)
    );
    this.end();
  }

  /**
   * Draws an ellipse on the world.
   * @public  
   * @param {number} x0 Center -x coordinate of the ellipse.
   * @param {number} y0 Center -y coordinate of the ellipse.
   * @param {number} w Width of the ellipse.
   * @param {number} h Height of the ellipse.
   * @param {number} start Start angle of the ellipse.
   * @param {number} end End angle of the ellipse.
   */
  ellipse(x0, y0, w, h, start, end) {
    const ctx = this.selectCtx();
    const { scaleX, scaleY } = this.world;
    this.begin();
    ctx.ellipse(
      x0 * scaleX.toPx,
      y0 * scaleY.toPx,
      Math.abs(w * scaleX.toPx),
      Math.abs(h * scaleY.toPx),
      0,
      utils.rad(start, this.angleStyle),
      utils.rad(end, this.angleStyle)
    );
    this.end();
  }

  /**
   * Writes text on the world. The style of the text is set by {@link Shape.font}.
   * @public
   * @param {string} text Text to write.
   * @param {number} x0 -x coordinate of the text.
   * @param {number} y0 -y coordinate of the text.
   */
  text(text, x0, y0) {
    const ctx = this.selectCtx();
    const { scaleX, scaleY } = this.world;
    this.begin();
    this.font.toCtx(ctx);
    ctx.fillText(text, x0 * scaleX.toPx, y0 * scaleY.toPx);
    this.end();
  }

  /**
   * Get the width of a text in units.
   * @public
   * @param {string} text Text to measure.
   * @returns {number} Width of the text-
   */
  textWidth(text) {
    const ctx = this.selectCtx();
    const { scaleX } = this.world;
    return ctx.measureText(text).width * scaleX.toUnits;
  }
}
