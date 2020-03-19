import * as utils from "./Utils";
import * as constants from "./Constants";
import Scale from "./Scale";
import Axis from "./figures/Axis";
import Renderer from "./Renderer";
import WorldElement from "./WorldElement";

/**
 * The World class handles the canvas and the drawing of elements. It manages all touch and mouse events,
 * as well as the scaling and axis settings. All elements drawn to the canvas must go through a World object.
 * @public
 * @class World
 */
export default class World {

  /**
   * @constructor
   * @param {string} id HTML id of the div where the World will be initiated.
   * @param {function} drawCallback Function called every 60fps to draw animations.
   * @param {function} resizeCallback Function called every time the canvas gets resized.
   */
  constructor(id, drawCallback, resizeCallback) {

    /**
     * jQuery reference to the div container of the canvas.
     * @type {object}
     */
    this.container = $(utils.fixId(id));

    /**
     * HTML canvas created for the world. Important to note is that the canvas does not have an alpha
     * channel. This is done to optimize the framerate.
     * @type {object}
     */
    this.canvas = document.createElement("canvas", { alpha: false });

    /**
     * Context of the created canvas for the world.
     * @type {object}
     */
    this.ctx = this.canvas.getContext("2d");

    /**
     * Pixel ratio of the device.
     * @type {number}
     */
    this.pxRatio = utils.getPixelRatio(this.ctx);

    /**
     * Scale object for the -x axis.
     * Default scale is 50px per 1 unit.
     * @type {Scale}
     */
    this.scaleX = new Scale(50, 1);

    /**
     * Scale object for the -y axis.
     * Default scale is 50px per 1 unit.
     * @type {Scale}
     */
    this.scaleY = new Scale(50, -1);

    /**
     * Width of the canvas in pixels.
     * @type {number}
     */
    this.width = 0;

    /**
     * Width before resizing the canvas to the new width. Used to determine if a change
     * has occured in the width in order to continue with the resizing process.
     * @type {number}
     */
    this.prevWidth = 0;

    /**
     * Height of the canvas in pixels.
     * @type {number}
     */
    this.height = 0;

    /**
     * Array of elements added to the world.
     * @type {WorldElement[]}
     */
    this.elements = [];

    /**
     * Axis object used to draw the main axis.
     * @type {Axis}
     */
    this.axis = new Axis();

    /**
     * Callback function for when the elements are drawn to the canvas.
     * @type {function}
     */
    this.onDraw = utils.isFunction(drawCallback) ? drawCallback : null;

    /**
     * Callback function for when the canvas gets resized.
     * @type {function}
     */
    this.onResize = utils.isFunction(resizeCallback) ? resizeCallback : null;

    /**
     * Callback function for when the mouse moves over the canvas.
     * @type {function}
     */
    this.onMouseMove = null;

    /**
     * Simple background color for the canvas. If set to ther value than {@link COLORS}.WHITE the canvas
     * will draw a rectangle with the new color at the beginning of every draw cycle. When the background
     * renderer is enabled, the color value is no more relevant.
     * @type {string}
     */
    this.color = constants.COLORS.WHITE;

    /**
     * Request id number from the requestAnimationFrame. Used to determine if the animation has
     * started.
     * @type {number}
     */
    this.started = null;

    /**
     * Mouse object containing all mouse properties and values.
     * @type {object}
     * @property {number} x Current -x position of the mouse in pixels.
     * @property {number} y Current -y position of the mouse in pixels.
     * @property {number} px Previous -x position of the mouse in pixels.
     * @property {number} py Previous -y position of the mouse in pixels.
     * @property {number} dx Change in the -x direction in pixels.
     * @property {number} dy Change in the -y direction in pixels.
     * @property {number} rx Real -x position of the mouse with respect to the axis in units.
     * @property {number} ry Real -y position of the mouse with respect to the axis in units.
     * @property {boolean} down Flag for when the mouse is pressed down over the canvas.
     * @property {boolean} inCanvas Flag for when the mouse is over the canvas.
     * @property {object} dragging Contains the currently dragged {@link WorldElement}. If no element is dragged then the value is equal to {@link DRAG_NOTHING}.
     * @property {object} over Contains the element that the mouse is currently over. If no element is under the mouse then the value is equal to {@link OVER_NOTHING}.
     * @property {string} cursor Current cursor of the canvas. Changes depending if it is over an element.
     */
    this.mouse = {
      x: 0,
      y: 0,
      px: 0,
      py: 0,
      dx: 0,
      dy: 0,
      rx: 0,
      ry: 0,
      down: false,
      inCanvas: false,
      dragging: constants.DRAG_NOTHING,
      over: constants.OVER_NOTHING,
      cursor: constants.CURSOR.DEFAULT
    };

    /**
     * Background renderer object. It is disabled by default. 
     * @type {Renderer}
     */
    this.background = new Renderer({
      absolute: true,
      enabled: false,
      world: this
    });

    // Add the canvas to the container.
    this.container.append(this.canvas);

    // Add the axis to the list of elements.
    this.add(this.axis);

    // Bind all events to the canvas and force a resize event.
    this.bindEventListeners();
    this.resize();

  }

  /**
   * Once it has been determined that the mouse is over an element and a dragging process has begun,
   * the position of the object must be updated to follow the mouse. The function looks at the value of 
   * {@link WorldElement.mouseMoveStyle} to determine if the position should be updated in pixels or in
   * real values. The position is updated by adding the change in the mouse's position to the element.
   * This creates a smoother movement. Finally, the callback function {@link WorldElement.onMouseMove} is
   * called.
   * @private
   */
  moveElements() {
    const element = this.mouse.dragging;
    if (element) {
      if (this.mouse.inCanvas) {
        if (element.mouseMoveStyle === constants.MOVE_STYLE.BY_PX) {
          element.addPosition(this.mouse.dx, this.mouse.dy);
        } else {
          element.addPosition(this.mouse.rdx, this.mouse.rdy);
          if (!this.axis.negative) {
            if (element.position.x < 0) element.position.x = 0;
            if (element.position.y < 0) element.position.y = 0;
          }
        }
        if (element.renderer) element.renderer.rendered = false;
        if (utils.isFunction(element.onMouseMove)) element.onMouseMove(element);
      }
      element.dragging = this.mouse.down && this.mouse.inCanvas;
      element.mouse_over = element.dragging;
      this.mouse.dragging = element.dragging
        ? this.mouse.dragging
        : constants.DRAG_NOTHING;
      element.topmost(element.dragging && element.topmostOnDrag);
    }
  }

  /**
   * Obtain the mouse or touch coordinates from the event data obtained from the callback. The data
   * is obtained in pixels, howevere it is also converted to real units using the scale provided. It
   * also calcualtes the previous positio and the change in position in both units (pixels and real units).
   * @private
   */
  getMousePosition(e) {
    const m = this.mouse;
    const rect = this.canvas.getBoundingClientRect();
    // Determine if it is a touch event or mouse event.
    let evt;
    if (e && !e.clientX) {
      if (e.touches) {
        [evt] = e.touches;
      } else if (e.changedTouches) {
        [evt] = e.changedTouches;
      }
    } else {
      evt = e;
    }
    // Save previous values
    m.px = m.x;
    m.py = m.y;
    // Calculate position in pixels.
    m.x = Math.floor(evt.clientX - rect.left);
    m.y = Math.floor(evt.clientY - rect.top);
    // Convert position to real units.
    m.rx = (m.x - this.axis.position.x) * this.scaleX.toUnits;
    m.ry = (m.y - this.axis.position.y) * this.scaleY.toUnits;
    // Calculate the delta in pixels.
    m.dx = m.x - m.px;
    m.dy = m.y - m.py;
    // Calculate the delta in real units.
    m.rdx = m.dx * this.scaleX.toUnits;
    m.rdy = m.dy * this.scaleY.toUnits;
  }

  /**
   * Find if the mouse is over an element. It queries the method {@link WorldElement.isMouseOver} to check
   * if the mouse is over the bounding box of the element.
   * @private
   */
  isMouseOverElement() {
    if (this.mouse.dragging !== constants.DRAG_NOTHING) return;
    let found = constants.OVER_NOTHING;
    let overElement = false;
    for (let i = this.elements.length - 1; i >= 0; i -= 1) {

      // A Box has multiple elements inside that can be clickable.
      if (this.elements[i].elements) {
        // Iterate though all elements and find those with click callbacks.
        this.elements[i].elements
          .filter(e => e.onClick)
          .forEach(e => {
            if (utils.isFunction(e.isMouseOver)) {
              e.mouseOver = e.isMouseOver();
              overElement = overElement || e.mouseOver;
            }
          });
      }

      // Check if the mouse is over an element.
      if (
        this.elements[i].isMouseOver() &&
        this.elements[i].display &&
        this.elements[i].isDraggable &&
        found === constants.OVER_NOTHING
      ) {
        found = i;
        this.elements[i].mouseOver = true;
      } else {
        this.elements[i].mouseOver = false;
      }
    }

    // Change the cursor if the mouse is over an element or found an element.
    let cursor = constants.CURSOR.DEFAULT;
    if (overElement) cursor = constants.CURSOR.POINTER;
    if (found !== constants.OVER_NOTHING) cursor = this.elements[found].cursor;
    this.setCursor(cursor);
    this.mouse.over = found;
  }

  /**
   * Binds a callback function to the mouse, touch and resize event listeners.
   * @private
   */
  bindEventListeners() {
    const self = this;
    const callbacks = {
      mousemove(e) {
        self.getMousePosition(e);
        self.isMouseOverElement();
        self.moveElements();
        if (utils.isFunction(self.onMouseMove)) self.onMouseMove();
      },
      mouseenter(e) {
        e.preventDefault();
        self.mouse.inCanvas = true;
      },
      mouseleave(e) {
        e.preventDefault();
        self.mouse.inCanvas = false;
      },
      mousedown(e) {
        e.preventDefault();
        self.getMousePosition(e);
        self.isMouseOverElement();
        self.mouse.down = true;
        if (self.mouse.over !== constants.OVER_NOTHING) {
          self.mouse.dragging = self.elements[self.mouse.over];
        }
      },
      mouseup(e) {
        e.preventDefault();
        self.mouse.down = false;
        self.moveElements();
      },
      touchstart(e) {
        self.getMousePosition(e);
        self.isMouseOverElement();
        self.mouse.down = true;
        if (self.mouse.over !== constants.OVER_NOTHING) {
          if (e.cancelable) e.preventDefault();
          self.mouse.dragging = self.elements[self.mouse.over];
          self.mouse.inCanvas = true;
        }
      },
      touchend(e) {
        self.mouse.down = false;
        if (self.mouse.dragging !== constants.DRAG_NOTHING) {
          if (e.cancelable) e.preventDefault();
          self.mouse.inCanvas = false;
          self.moveElements();
        }
      },
      resize(e) {
        self.resize(e);
      }
    };
    window.addEventListener("resize", callbacks.resize, false);
    window.addEventListener("mouseup", callbacks.mouseup, false);
    this.canvas.addEventListener("mousemove", callbacks.mousemove, false);
    this.canvas.addEventListener("mouseenter", callbacks.mouseenter, false);
    this.canvas.addEventListener("mouseleave", callbacks.mouseleave, false);
    this.canvas.addEventListener("mousedown", callbacks.mousedown, false);
    this.canvas.addEventListener("touchmove", callbacks.mousemove, false);
    this.canvas.addEventListener("touchstart", callbacks.touchstart, false);
    this.canvas.addEventListener("touchend", callbacks.touchend, false);
  }

  /**
   * Callback function for the resize event. It recalculates the width of the main canvas as well
   * as all rendered canvases and their elements. It calls the callback function {@link World.onResize}.
   * @private
   */
  resize(e) {
    this.width = this.container.width();
    const widthChange = Math.abs(this.prevWidth - this.width);
    this.prevWidth = this.width;
    this.height = this.container.height();
    this.pxRatio = utils.getPixelRatio(this.ctx);
    this.canvas.width = Math.floor(this.width * this.pxRatio);
    this.canvas.height = Math.floor(this.height * this.pxRatio);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(this.pxRatio, this.pxRatio);
    if (this.background.enabled) {
      this.background.resize();
    }
    for (let i = 0; i < this.elements.length; i++) {
      if (utils.isFunction(this.elements[i].resize)) this.elements[i].resize();
      if (this.elements[i].renderer) this.elements[i].renderer.resize();
    }
    if (this.started && utils.isFunction(this.onResize) && widthChange > 0) this.onResize();
  }

  /**
   * Sets a new cursor for when the mouse is over the canvas.
   * @public
   * @param {string} cursor Valid cursor type.
   */
  setCursor(cursor) {
    if (cursor !== this.mouse.cursor) {
      this.canvas.style.cursor = cursor;
      this.mouse.cursor = cursor;
    }
  }

  /**
   * Main draw function. Runs at 60fps and can't be stopped once the world is started.
   * Therefore it is constantly drawing to the canvas. This further optimizes the code needed
   * to run simulations.
   * Looks at the background object to check if it's enabled. If so, it draws the prerendered image
   * to the main canvas, thus avoiding to draw the background every time from scratch.
   * The draw method {@link WorldElement.draw} is called for every element added to the world.
   * @private
   */
  draw() {
    this.onDraw();
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Background.
    if (this.background.enabled) {
      if (this.background.rendered) {
        this.background.draw();
      } else if (utils.isFunction(this.background.callback)) {
        this.background.begin();
        this.background.callback(
          this.background.ctx,
          this.background.callbackArgs
        );
        this.background.end();
        this.background.draw();
      }
    } else if (this.color !== constants.COLORS.WHITE) {
      this.ctx.fillStyle = this.color;
      this.ctx.rect(0, 0, this.width, this.height);
      this.ctx.fill();
    }

    this.ctx.save();
    this.ctx.translate(this.axis.position.x, this.axis.position.y);
    this.elements.sort((a, b) => a.zIndex - b.zIndex);
    for (let i = 0; i < this.elements.length; i++) {
      if (utils.isFunction(this.elements[i].draw) && this.elements[i].display)
        this.elements[i].draw();
    }
    this.ctx.restore();
    this.start();
  }

  /**
   * Adds a {@link WorldElement} to the world. Multiple elements can be added in a
   * single add function, they only need to be separated by comma.
   * @public
   * @param  {...WorldElement} args Elements to add to the world.
   */
  add(...args) {
    for (let i = 0; i < args.length; i++) {
      if (
        utils.isObject(args[i]) &&
        Object.prototype.hasOwnProperty.call(args[i], "valid")
      ) {
        args[i].setWorld(this);
        if (args[i].renderer) args[i].renderer.setWorld(this);
        this.elements.push(args[i]);
      }
    }
  }

  /**
   * Remove a {@link WorldElement} from the world. Multiple elements can be removed
   * in a single remove function, they only need to be separated by comma.
   * @public
   * @param {...WorldElement} args Elements to remove from the world.
   */
  remove(...args) {
    for (let i = 0; i < args.length; i++) {
      const index = this.elements.indexOf(args[i]);
      if (index > -1) {
        this.elements[index].world = undefined;
        this.elements.splice(index, 1);
      }
    }
  }

  /**
   * Starts the animation loop of 60fps.
   * @private
   */
  start() {
    const self = this;
    if (this.started === null && utils.isFunction(this.onResize)) {
      this.onResize();
    }
    this.started = requestAnimationFrame(() => {
      self.draw();
    });
  }

  /**
   * Creates a screenshot of the canvas and saves it as sc.png in the same folder
   * as the main file from the simulation. The canvas data is passed to a php file 
   * that only runs at localhost.
   * @public
   */
  export() {
    // Split url to get simulation path
    // /newtondreams-bs4/fisica/sim/
    const urlArray = window.location.pathname.split("/");
    const simType = urlArray[2];
    const simName = urlArray[3];
    $.ajax({
      data: {
        data: this.canvas.toDataURL(),
        path: `/${simType}/${simName}/`
      },
      url: "../../php/export.php",
      dataType: "html",
      type: "post",
      success(response) {
        console.log(response);
      }
    });
  }

  /**
   * Makes sure that a box of width (xMin + xMax) and height {yMin + yMax} fits in the canvas.
   * This is used when the dimensions of objects changes dynamically.
   * @public
   * @param {number} xMin Minimum x value required to be displayed.
   * @param {number} xMax Maximum x value required to be displayed.
   * @param {number} yMin Minimum y value required to be displayed.
   * @param {number} yMax Maximum y value required to be displayed.
   * @param {number} scale Scale given to the range provided. If the scale is > 1 then the bounding box will be larger than the data and thus will result in a better fit.
   */
  fit(xMin, xMax, yMin, yMax, scale) {
    const xRange = Math.abs(xMin) + Math.abs(xMax);
    const yRange = Math.abs(yMin) + Math.abs(yMax);
    const xScale = utils.calcStepSize(
      xRange * scale,
      this.width / this.scaleX.px
    );
    const yScale = utils.calcStepSize(
      yRange * scale,
      this.height / this.scaleY.px
    );
    this.scaleX.set(
      this.scaleX.px,
      Number.isNaN(xScale) ? 1 : xScale,
      this.scaleX.unit
    );
    this.scaleY.set(
      this.scaleY.px,
      Number.isNaN(yScale) ? -1 : -yScale,
      this.scaleY.unit
    );
    const xCenter = Math.floor(
      Math.abs(xMin) * this.scaleX.toPx +
        (this.width - xRange * this.scaleX.toPx) / 2
    );
    const yCenter = Math.floor(
      Math.abs(yMin) * this.scaleY.toPx +
        (this.height - yRange * this.scaleY.toPx) / 2
    );
    this.axis.setPosition(xCenter, yCenter);
  }
}
