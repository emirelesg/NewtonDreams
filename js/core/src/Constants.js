/**
 * @module Constants
 */

/**
 * Defines how the coordinates of an object will be changed when the object is dragged around.
 * @property {string} BY_PX="px" The position of the object will be changed in pixels.
 * @property {string} BY_UNITS="units" The position of the object will be changed in units. 
 */
export const MOVE_STYLE = {
  BY_PX: "px",
  BY_UNITS: "units"
};

/**
 * Defines how a shape is drawn with the methods {@link Shape.moveTo} and {@link Shape.lineTo}.
 * @property {number} NONE=0 Every time a set of coordinates is provided they will be used as absolute coordinates.
 * @property {number} ACCOMULATIVE=1 The next set of coordinates will be used relative to the previous set of coordinates.
 */
export const SHAPE_STYLE = {
  NONE: 0,
  ACCOMULATIVE: 1
};

/**
 * Defines if the angle used is in radians or degrees.
 * @property {number} DEG=1 Angle is in degrees.
 * @property {number} RAD=2 Angle is in radians.
 */
export const ANGLE_STYLE = {
  DEG: 1,
  RAD: 2
};

/**
 * Useful symbols for simulations. The unicode of every symbol is used.
 * @property {string} BLANK=- Used for labels when no value is provided.
 * @property {string} THETA="θ"
 * @property {string} INF="\u221e"
 * @property {string} MICRO="\u03BC"
 * @property {string} OHM="\u2126"
 * @property {string} LETTERS="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
 */
export const SYMBOL = {
  BLANK: "-",
  THETA: "θ",
  INF: "\u221e",
  MICRO: "\u03BC",
  OHM: "\u2126",
  LETTERS: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
};

/**
 * Types of cursors that an object can have when hovered or dragged.
 * @property {string} DEFAULT="default"
 * @property {string} POINTER="pointer"
 * @property {string} CROSS="cross"
 * @property {string} MOVE="move"
 * @property {string} TEXT="text"
 */
export const CURSOR = {
  DEFAULT: "default",
  POINTER: "pointer",
  CROSS: "cross",
  MOVE: "move",
  TEXT: "text"
};

/**
 * Conversion factor from radians to degrees.
 * @type {number}
 */
export const RAD_TO_DEG = 180 / Math.PI;

/**
 * Conversion factor from degrees to radians.
 * @type {number}
 */
export const DEG_TO_RAD = Math.PI / 180;

/**
 * Conversion factor from meters to centimeters.
 * @type {number}
 */
export const M_TO_CM = 100;

/**
 * Conversion factor from centimeters to meters.
 * @type {number}
 */
export const CM_TO_M = 1 / 100;

/**
 * Conversion factor from cubic centimeters to cubic meters.
 * @type {number}
 */
export const CM3_TO_M3 = 1 / 100 ** 3;

/**
 * Conversion factor from pascals to atmospheres.
 * @type {number}
 */
export const PA_TO_ATM = 9.86923E-6;

/**
 * PI constant.
 * @type {number}
 */
export const { PI } = Math;

/**
 * 2 * PI constant.
 * @type {number}
 */
export const TWO_PI = PI * 2;

/**
 * PI / 2 constant.
 * @type {number}
 */
export const HALF_PI = PI / 2;

/**
 * PI / 3 constant.
 * @type {number}
 */
export const THIRD_PI = PI / 3;

/**
 * PI / 4 constant.
 * @type {number}
 */
export const FOURTH_PI = PI / 4;

/**
 * PI / 5 constant.
 * @type {number}
 */
export const FIFTH_PI = PI / 5;

/**
 * PI / 6 constant.
 * @type {number}
 */
export const SIXTH_PI = PI / 6;

/**
 * Log 10 constant.
 * @type {number}
 */
export const LOG10 = Math.log(10);

/**
 * Sine of 60°.
 * @type {number}
 */
export const SIN60 = Math.sin(THIRD_PI);

/**
 * Cosine of 60°.
 * @type {number}
 */
export const COS60 = Math.cos(THIRD_PI);

/**
 * Sine of 30°.
 * @type {number}
 */
export const SIN30 = COS60;

/**
 * Cosine of 30°.
 * @type {number}
 */
export const COS30 = SIN60;

/**
 * Graviy constant.
 * @type {number}
 */
export const GRAVITY = -9.81;

/**
 * Coulomb's constant.
 * @type {number}
 * @see https://en.wikipedia.org/wiki/Coulomb_constant
 */
export const K = 8.987e9;

/**
 * Vacuum permittivity constant.
 * @type {number}
 * @see https://en.wikipedia.org/wiki/Vacuum_permittivity
 */
export const E0 = 8.854e-12;

/**
 * Boltzmann constant.
 * @type {number}
 * @see https://en.wikipedia.org/wiki/Boltzmann_constant
 */
export const BOLTZMANN = 1.38064852E-23;

/**
 * Avogadro constants.
 * @type {number}
 * @see https://en.wikipedia.org/wiki/Avogadro_constant
 */
export const AVOGADRO = 6.0221409E23;

/**
 * Used when the mouse isn't over an object.
 * @type {number}
 */
export const OVER_NOTHING = -1;

/**
 * Used when the mouse isn't dragging an object.
 * @type {null}
 */
export const DRAG_NOTHING = null;

/**
 * Defines the default font used for all simulations.
 */
export const FONT =
  "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial";

/**
 * Defines the default font size for all simulations.
 */
export const FONT_SIZE = "12";

/**
 * Defines the default font color for all simulaions.
 */
export const FONT_COLOR = "#444444";

/**
 * Defines the valid font baselines.
 */
export const FONT_BASELINE = [
  "top",
  "hanging",
  "middle",
  "alphabetic",
  "ideographic",
  "bottom"
];

/**
 * Defines teh valid font alignments.
 */
export const FONT_ALIGN = ["left", "right", "center", "start", "end"];

/**
 * Defines the default colors used for simulations.
 */
export const COLORS = {
  RED: "#F44336",
  BLUE: "#007bff",
  GREEN: "#4CAF50",
  YELLOW: "#FFC510",
  PURPLE: "#673AB7",
  BROWN: "#795548",
  LIGHT_GREEN: "#CDDC39",
  GRAY: "#607D8B",
  LIGHT_GRAY: "#8FA4AD",
  WHITE: "#FFFFFF",
  BLACK: "#000000",
  COMPONENT: "#B7B7B7"
};

/**
 * Defines the default colors used for box displays.
 * Colors are provided in matching pairs of BACKGROUND and BORDER colors.
 */
export const BOX_COLORS = {
  BLUE: {
    BACKGROUND: "#F0F5FF",
    BORDER: "#A2C1FF"
  },
  GREEN: {
    BACKGROUND: "#D5E8D4",
    BORDER: "#82B366"
  },
  RED: {
    BACKGROUND: "#F8CECC",
    BORDER: "#B85450"
  },
  YELLOW: {
    BACKGROUND: "#FFF2CC",
    BORDER: "#D6B656"
  },
  ORANGE: {
    BACKGROUND: "#FFE6CC",
    BORDER: "#D79B00"
  },
  PURPLE: {
    BACKGROUND: "#E1D5E7",
    BORDER: "#9673A6"
  },
  GRAY: {
    BACKGROUND: "#F5F5F5",
    BORDER: "#CCCCCC"
  }
};
