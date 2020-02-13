// Constants
var PARENTHESIS_SIZE = 72;        // Font size of the parenthesis.
var TEXT_SIZE = 18;               // Default font size for all text.
var WRAP_Y = 0.85;                // Amount in -y that the equation is displaced when the space is small.
var OF = 0.1;                     // Offset used to draw the equals and multiplication sign.
var SPACE = 1;                    // Space between elements in the formula.
var TYPES = new Array();          // Array with the types of units.
var UNITS = new Array();          // Long name for the units.
var UNITS_SHORT = new Array();    // Short name for the units.
var FACTORS = new Array();        // Convertion factor to the reference unit. The reference unit is always the first element in the array.
var EXP = {                       // Array with the exponents.
  "0": "⁰",
  "1": "¹", 
  "2": "²", 
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹"
};

// Length
TYPES[0]        = "Longitud";
UNITS[0]        = ["Metro", "Centímetro", "Milímetro"];
UNITS_SHORT[0]  = ["m", "cm", "mm"];
FACTORS[0]      = [1, 1e-2, 1e-3];

// Area
TYPES[1]        = "Área";
UNITS[1]        = ["Metro Cuadrado", "Centímetro Cuadrado", "Milímetro Cuadrado"];
UNITS_SHORT[1]  = ["m²", "cm²", "mm²"];
FACTORS[1]      = [1, 1e-4, 1e-6];

// Volume
TYPES[2]        = "Volumen";
UNITS[2]        =  ["Metro Cúbico", "Centímetro Cúbico", "Milímetro Cúbico"];
UNITS_SHORT[2]  = ["m³", "cm³", "mm³"];
FACTORS[2]      = [1, 1e-6, 1e-9];

// Append short units to long units.
for (var i = 0; i < UNITS.length; i++) {
  for (var j = 0; j < UNITS[i].length; j++) {
    UNITS[i][j] = UNITS[i][j] + " (" + UNITS_SHORT[i][j] + ")";
  }
}

// p$ Objects
var w;
var s = new p$.Shape(drawScene);
var controls = {};
var labels = {};

/**
 * Function runs when document is completely loaded.
 */
$(function() {
  setup();
  setupControls();
  reset();
  w.start();
});

/**
 * Initialize world and set up other objects.
 */
function setup() {
  
  // Configure the world.
  w = new p$.World("canvasContainer", draw, resize);
  w.color = p$.BOX_COLORS.GRAY.BACKGROUND;
  w.axis.display = false;

  // Configure the z index of all objects.
  s.setZ(1);

  // Add objects to world.
  w.add(s);

}

/**
 * Setup DOM elements.
 */
function setupControls() {

  // Converts an array to an object. Avoided ES6 techniques to provide compatibility.
  function toObject(keys, values) {
    var obj = {};
    for (var i = 0; i < keys.length; i++) {
      if (keys[i]) obj[keys[i]] = values && values.length ? values[i] : i; 
    }
    return obj;
  }

  // Returns an object with the current set of convertion factors.
  function getConversionFactors() {
    return {
      a: FACTORS[controls.type.value][controls.unitA.value],
      b: FACTORS[controls.type.value][controls.unitB.value],
    }
  }

  // Converts the value A to B.
  // k_a * val_a = k_b * val_b => k_a * val_a / k_b = val_b
  function aToB() {
    var factorA = FACTORS[controls.type.value][controls.unitA.value];
    var factorB = FACTORS[controls.type.value][controls.unitB.value];
    var result  = new Decimal(controls.valueA.value).mul(factorA).div(factorB);
    controls.valueB.set(result.toString());
  }

  // Converts the value B to A.
  // k_a * val_a = k_b * val_b => val_a = k_b / k_a * val_b 
  function bToA() {
    var factorA = FACTORS[controls.type.value][controls.unitA.value];
    var factorB = FACTORS[controls.type.value][controls.unitB.value];
    var result  = new Decimal(controls.valueB.value).mul(factorB).div(factorA);
    controls.valueA.set(result.toString());
  }

  // Configure all select and input controls.
  controls.type   = new p$.dom.Select("type", function(unitIdx) {
    var options = toObject(UNITS[unitIdx]);
    controls.unitA.setOptions(options, 0);
    controls.unitB.setOptions(options, UNITS[unitIdx].length > 1 ? 1 : 0);
  });
  controls.unitA  = new p$.dom.Select("unit_a", aToB);
  controls.unitB  = new p$.dom.Select("unit_b", aToB);
  controls.valueA = new p$.dom.Input("value_a", aToB, { isNumber: true, default: 0 });
  controls.valueB = new p$.dom.Input("value_b", bToA, { isNumber: true, default: 0 });

  // Set the current type to the first element of the types array.
  controls.type.setOptions(toObject(TYPES), 0)

}

// Set the initial state of all variables.
function reset() {
}

/**
 * Function gets called 60x per second.
 */
function draw() {
}

/**
 * Draws the blocks and arrows displaying their speeds.
 */
function drawScene() {

  // function convertoToPower(number, _base) {
  //   // Base is an optional parameter. If undefined set it to 100.
  //   var base = _base ? _base : 100;
  //   // Calculate the log base from the number to the defined precision.
  //   // This will avoid getting a result like 0.4999999999999..
  //   var log = new Decimal(number.log(base).toPrecision(10));
  //   // If the log is a whole number and greater than 1, then create a new string.
  //   if (log.dp() === 0 && log.gt(1)) {
  //     // Convert the log to a string, and replace each char with their respective epxonent.
  //     var logStr = log.toString();
  //     var exponent = "";
  //     for (var i = 0; i < logStr.length; i++) exponent += EXP[logStr.charAt(i)];
  //     return base + exponent;
  //   }
  //   // If the provided base is not a whole multiple of the number, then try with the number 10.
  //   if (base !== 10 && !log.eq(1)) {
  //     return convertoToPower(number, 10);
  //   }
  //   // console.log(number.toString(), log.toString())
  //   return number.toString();
  // }

  // Calculates the nth root of a number. Uses the Decimal library for extra precision
  // this avoids getting numbers like 9.999999, due to the rounding of javascript.
  function root(number, r) {
    // Do not calculate the root for 1.
    if (number.eq(1)) return number;
    var power = new Decimal(1).div(r);
    var ans = new Decimal(number).toPower(power).toDecimalPlaces(4);
    return ans + EXP[r];
  }

  function drawMultiplication(x, y) {
    s.save();
    s.translate(x, y);
    s.strokeWeight(2);
    s.line(-OF, -OF, OF, OF);
    s.line(-OF, OF, OF, -OF);
    s.restore();
  }

  function drawEquals(x, y) {
    s.save();
    s.translate(x, y);
    s.strokeWeight(2);
    s.line(-OF, OF, OF, OF);
    s.line(-OF, -OF, OF, -OF);
    s.restore();
  }

  function drawFraction(x, y, width, num, den) {
    s.save();
    s.translate(x, y);
    s.font.set({ size: PARENTHESIS_SIZE, align: "left" });
    s.text("(", - width / 2, 0);
    s.font.set({ size: PARENTHESIS_SIZE, align: "right" });
    s.text(")", width / 2, 0);
    s.strokeWeight(3);
    s.line(-width / 2 + 0.5, 0, width / 2 - 0.5, 0);
    s.font.set({ size: TEXT_SIZE, align: "center" });
    s.text(num, 0, 0.4);
    s.text(den, 0, -0.4);
    s.restore();
  }

  // Configure drawing.
  s.save();
  s.font.set({ color: p$.COLORS.GRAY, weight: "normal", baseline: "middle", align: "center" });
  s.fill(p$.COLORS.GRAY);
  s.stroke(p$.COLORS.GRAY);

  // Get values from the selected units.
  var unitsA    = UNITS_SHORT[controls.type.value][controls.unitA.value];
  var factorA   = FACTORS[controls.type.value][controls.unitA.value];
  var unitsB    = UNITS_SHORT[controls.type.value][controls.unitB.value];
  var factorB   = FACTORS[controls.type.value][controls.unitB.value];
  var input     = controls.valueA.value + " " + unitsA;
  var output    = controls.valueB.value + " " + unitsB;
  
  // Short-hand convertion.
  var num = new Decimal(1).div(factorB).mul(factorA);
  var den = new Decimal(1);

  // If numerator is a decimal, then flip the fraction.
  if (num.lt(1)) {
    den = den.div(num);
    num = new Decimal(1);
  }
  
  // Convert decimal obj to strings.
  var numStr, denStr;
  switch(controls.type.value) {
    case "0": // Length
      denStr = den + " " + unitsA;
      numStr = num + " " + unitsB;
    break;
    case "1": // Area
      denStr = root(den, 2) + " " + unitsA;
      numStr = root(num, 2) + " " + unitsB;
      break;
    case "2": // Volume
      denStr = root(den, 3) + " " + unitsA;
      numStr = root(num, 3) + " " + unitsB;
      break;
    default: // Other
      denStr = den + " " + unitsA;
      numStr = num + " " + unitsB;
      break;
  }

  // Width measurements.
  s.font.set({ size: TEXT_SIZE });
  s.font.toCtx(s.selectCtx());
  var inputW = w.ctx.measureText(input).width * w.scaleX.toUnits;
  var outputW = w.ctx.measureText(output).width * w.scaleX.toUnits;
  var numW = w.ctx.measureText(numStr).width * w.scaleX.toUnits;
  var denW = w.ctx.measureText(denStr).width * w.scaleX.toUnits;
  var width = numW > denW ? numW + 1.5 : denW + 1.5;
  var totalWidth = inputW + 4 * SPACE + outputW + width;
  var wrap = totalWidth > w.width * w.scaleX.toUnits - 1;
  
  // Draw convertion.
  var x = wrap ? -(totalWidth - outputW - SPACE) / 2 : -totalWidth / 2;
  var y = wrap ? WRAP_Y : 0;
  s.font.set({ size: TEXT_SIZE, align: "left" });
  s.text(input, x, y);                                        x += inputW + SPACE;
  drawMultiplication(x, y);                                   x += SPACE + width / 2;
  drawFraction(x, y, width, numStr, denStr);                  x += SPACE + width / 2;
  drawEquals(x, y);                                           x += SPACE;
  s.font.set({ size: TEXT_SIZE, weight: "bold", align: wrap ? "center" : "left" });
  s.text(
    output, 
    wrap ? 0 : x,
    wrap ? -WRAP_Y : y
  );

  s.restore();

}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {
  w.axis.setPosition(w.width / 2, w.height / 2);
}
