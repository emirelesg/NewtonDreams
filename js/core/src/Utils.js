import * as constants from "./Constants";

/**
 * Obtains the pixel ratio of the device. Used to scale properly the canvas for high resolution devices.
 * @public
 * @param {object} ctx Canvas context object.
 * @returns {number} The pixel ratio of the device.
 */
export function getPixelRatio(ctx) {
  const devicePixelRatio = window.devicePixelRatio || 1;
  const backingStoreRatio =
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1;
  return devicePixelRatio / backingStoreRatio;
}

/**
 * Makes sure that a HTML id allways has a # at the beginning. 
 * If the provided id already has a # then it returns the same id, otherwise it is added.
 * @public
 * @param {string} id Id of an HTML object.
 * @returns {string} Id with a # prepended.
 */
export function fixId(id) {
  return id[0] === "#" ? id : `#${id}`;
}

/**
 * Round a number to a given amount of decimal places.
 * @public
 * @param {number} value Value to round.
 * @param {number} precision Amount of decimal places required.
 * @returns {number} Rounded number.
 */
export function round(value, precision) {
  const multiplier = 10 ** (precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Constrain a value within a range of values.
 * If value > max then value = max;
 * If value < min then value = min;
 * @public
 * @param {number} val Value to clamp within range.
 * @param {number} min Minimum acceptable value.
 * @param {number} max Maximum acceptable value.
 * @returns {number} Constrained value to the given range.
 */
export function clamp(val, min, max) {
  if (val > max) return max;
  if (val < min) return min;
  return val;
}

/**
 * Cosine function that can accept angles in radians or degrees.
 * @public
 * @param {number} val Angle for calculating the cosine.
 * @param {number} type Determines if the angle provided is in radians or in degrees. See {@link ANGLE_STYLE}.
 * @returns {number} Cosine of the angle.
 */
export function cos(val, type) {
  return Math.cos(
    type === constants.ANGLE_STYLE.DEG ? val * constants.DEG_TO_RAD : val
  );
}

/**
 * Sine function that can accept angles in radians or degrees.
 * @public
 * @param {number} val Angle for calculating the sine.
 * @param {number} type Determines if the angle provided is in radians or in degrees. See {@link ANGLE_STYLE}.
 * @returns {number} Sine of the angle.
 */
export function sin(val, type) {
  return Math.sin(
    type === constants.ANGLE_STYLE.DEG ? val * constants.DEG_TO_RAD : val
  );
}

/**
 * Test if an object is a function.
 * @public
 * @param {object} f Object to test.
 * @returns {boolean} True if the object is a function, false otherwise.
 */
export function isFunction(f) {
  return typeof f === "function";
}

/**
 * Test if an object is an object.
 * @public
 * @param {object} o Object to test.
 * @returns {boolean} True if the object is an object, false otherwise.
 */
export function isObject(o) {
  return typeof o === "object";
}

/**
 * Test if an object is a string.
 * @public
 * @param {object} s Object to test.
 * @returns {boolean} True if the object is a string, false otherwise.
 */
export function isString(s) {
  return typeof s === "string";
}

/**
 * Given a set of two points the squared distance is calculated.
 * This is faster than calculating the Euclidean distance between them, since no square root is calculated.
 * @public
 * @param {number} x0 Initial -x coordinate.
 * @param {number} y0 Initial -y coordinate.
 * @param {number} x1 Final -x coordinate.
 * @param {number} y1 Final -y coordinate.
 * @returns {number} The squared distance between points.
 */
export function distSquared(x0, y0, x1, y1) {
  return (x1 - x0) ** 2 + (y1 - y0) ** 2;
}

/**
 * Given an angle makes sure that it is in radians.
 * @public
 * @param {number} angle Angle to convert to radians.
 * @param {number} type Determines if the angle provided is in radians or in degrees. See {@link ANGLE_STYLE}.
 * @returns {number} Angle in radians.
 */
export function rad(angle, type) {
  return type === constants.ANGLE_STYLE.DEG ? angle * constants.DEG_TO_RAD : angle;
}

/**
 * Determines if a point is inside of a box.
 * Often used to test is the mouse is over an element.
 * @public
 * @param {number} x -x coordinate to test.
 * @param {number} y -y coordinate to test.
 * @param {number} bx -x center coordinate of the box.
 * @param {number} by -y center coordinate of the box.
 * @param {number} bw Half of the box's width.
 * @param {number} bh Half of the box's height.
 * @returns {boolean} True if point is within the box, false otherwise.
 */
export function isCoordInside(x, y, bx, by, bw, bh) {
  return (bx - x) ** 2 < bw ** 2 && (y - by) ** 2 < bh ** 2;
}

/**
 * Format a number to have a certain number of decimal places and/or fixed places and
 * add a unit label. Used to format the strings of labels and sliders.
 * If the input value is a {@link SYMBOL} then return the same symbol.
 * @public
 * @param {number|string} val Input number. Can also be a string or a symbol such as in {@link SYMBOL}.
 * @param {string} units Units of the input number.
 * @param {number} decPlaces Amount of decimal places to round.
 * @param {boolean} fixPlaces Fix the amount of decimal places. If the number doesn't have enough, zeros will be added.
 * @returns {string} Formated number.
 */
export function formatValue(val, units, decPlaces, fixPlaces) {
  if (val === constants.SYMBOL.BLANK || val === constants.SYMBOL.INF)
    return val;
  let result =
    Number.isNaN(val) && val !== undefined ? 0 : round(val, decPlaces);
  if (fixPlaces) result = result.toFixed(decPlaces);
  return units === "°" || this.units === "º"
    ? `${result}°`
    : `${result} ${units}`;
}

/**
 * Assign the matching properties from the args object to the obj object.
 * This allows for settings to be passed in single line and set on the receiving object.
 * Almost all World Element objects accept such settings on their constructors.
 * @example
 * loadOptions(font, { face: "Helvetica", size: 12 });
 * @public
 * @param {object} obj Object where the settings will be loaded.
 * @param {object} args Object with matching properties from obj.
 */
export function loadOptions(obj, args) {
  if (args) {
    const keys = Object.keys(args);
    for (let i = 0; i < keys.length; i += 1) {
      if (Object.prototype.hasOwnProperty.call(obj, keys[i])) {
        obj[keys[i]] = args[keys[i]];
      }
    }
  }
}

/**
 * Finds the best fitting scale for a given range. Used for simulations where the scale of the data
 * changes dramatically.
 * @param {number} value Corresponds to the range between the minimum required value to be displayed and the maximum required value to be displayed.
 * @param {number} stepAmount Desired amount of steps within the range.
 * @returns {number} Magnitude of the step size. 
 */
export function calcStepSize(value, stepAmount) {
  
  // Calculate initial guess at step size
  const tempStep = value / stepAmount;

  // Get the magnitude of the step size
  const mag = Math.floor(Math.log(tempStep) / constants.LOG10);
  const magPow = 10 ** mag;

  // Calculate the most significant digit of the new step size
  let magMsd = Math.round(tempStep / magPow + 0.5);

  // Promote the MSD to either 1, 2, or 5
  if (magMsd > 5.0) {
    magMsd = 10.0;
  } else if (magMsd > 2.0) {
    magMsd = 5.0;
  } else if (magMsd > 1) {
    magMsd = 2.0;
  }

  return magMsd * magPow;
}

/**
 * Generate a random number following a gaussian distribuition.
 * @public
 * @param {number} n Amount of iterations.
 * @returns {number} Random number that follows a gaussian distribuition.
 */
export function gaussian(n) {
  let sum = 0;
  for (let i = 0; i < n; i += 1) {
    sum += Math.random();
  }
  return sum / n;
}


/**
 * Adds an alpha channel to an rgb color.
 * Must have the pattern #AABBCC.
 * @public
 * @param {string} color Color to add alpha.
 * @param {number} alpha Alpha channel added to the color.
 */
export function rgbToRgba(color, alpha) {
  const alphaP = alpha > 1 ? 1 : alpha < 0 ? 0 : alpha;
  const r = parseInt(color.substr(1, 2), 16);
  const g = parseInt(color.substr(3, 2), 16);
  const b = parseInt(color.substr(5, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${alphaP})`
}