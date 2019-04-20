var ARROW_RANGE = 10;
var ARROW_STEP = 0.5;
var ARROW_HEAD_SIDE = 0.2;
var ARROW_BODY_LENGTH = 0.15;
var ARROW_BODY_HEIGHT = 0.05;
var HALF_ARROW_BODY_HEIGHT = ARROW_BODY_HEIGHT / 2;
var ARROW_LENGTH = ARROW_HEAD_SIDE * p$.SIN60 + ARROW_BODY_LENGTH;
var HALF_ARROW_LENGTH = ARROW_LENGTH / 2;
var ARROW_HEAD_X0 = HALF_ARROW_LENGTH - (ARROW_HEAD_SIDE * p$.SIN60) / 2;
var ARROW_BODY_X0 = -HALF_ARROW_LENGTH;

/**
 * Function used to draw arrows centered on (x, y);
 */
function drawArrow(obj, x, y, theta) {
  if (theta !== 0) {
    obj.save();
    obj.translate(x, y);
    obj.rotate(theta);
    x = 0;
    y = 0;
  }
  obj.rect(x + ARROW_BODY_X0, y - HALF_ARROW_BODY_HEIGHT, ARROW_BODY_LENGTH, ARROW_BODY_HEIGHT);
  obj.equilateralTriangle(x + ARROW_HEAD_X0, y, ARROW_HEAD_SIDE);
  if (theta !== 0) {
    obj.restore();
  }
}

/**
 * Calculates the electric field caused by a charge in a position (x, y).
 */
function calculateField(from, to, charge) {
  var dx = (to.x - from.x) * p$.CM_TO_M;
  var dy = (to.y - from.y) * p$.CM_TO_M;
  var r_sq = dx * dx + dy * dy;
  var r_mag = Math.sqrt(r_sq);
  var e = Math.floor(p$.K * charge / r_sq);
  return {
    x: Math.floor(e * dx / r_mag),
    y: Math.floor(e * dy / r_mag),
  };
}

/**
 * Retuns an hsl color that varies in intensity depending on the magnitud value.
 */
function fieldColor(k) {

  // Clamp 
  k = p$.utils.clamp(k, -20, 20) || 0;

  // Calculate Hue.
  // Interpolate between RED and BLUE
  // 360 - 240 = 120
  // range of k = 40
  // k * 3 <- 120 / 40
  hue = 300 + k * 3;

  // Calculate Saturation.
  // HIGH --> LOW --> HIGH
  // k = 0 => 0
  // k = +/- 20 => 70
  saturation = 7 * Math.pow(Math.abs(k), 2) / 40;
  
  // Calculate Luma.
  // LOW --> HIGH --> LOW
  // k = 0 => 90
  // k = +/- 20 => 70
  luma = -Math.pow(Math.abs(k), 2) / 20 + 95;

  // Clamp values to valid ranges.
  hue = p$.utils.clamp(Math.floor(hue), 240, 360);
  saturation = p$.utils.clamp(Math.floor(saturation), 0, 100);
  luma = p$.utils.clamp(Math.floor(luma), 70, 100);

  // Create HSL color.
  return "hsl(" + hue + "," + saturation + "%," + luma + "%)";

}

function effectOnPoint(f, charge) {
  return Math.floor(p$.utils.clamp(Math.sqrt(f.x * f.x + f.y * f.y) / 1e7, 0, 6)) * charge;
}

/**
 * Returns a color depending on the charge.
 */
function getColor(charge) {
  if (charge > 0) {
    return p$.COLORS.RED;
  } else if (charge < 0) {
    return p$.COLORS.BLUE;
  }
  return p$.COLORS.GRAY;
}

/**
 * Returns a sign depending on the charge.
 */
function getSign(charge) {
  if (charge > 0) {
    return"+";
  } else if (charge < 0) {
    return "-";
  }
  return "0";
}