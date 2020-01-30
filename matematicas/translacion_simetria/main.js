// Constants
var TEXT_OFFSET = 0.12;   // Distance between text sections in the formula.

// Variables
var texts = [];           // Array containing all formula sections.

// p$ Objects
var w;
var dc = new p$.DataCursor();
var formula = new p$.Shape(drawFormula, {} );
var results = new p$.Box( { debug: false, isDraggable: false, title: "Formula" } );
var plot = new p$.Plot( {limit: 1000, drawInvisiblePoints: true } );
var originalPlot = new p$.Plot( {limit: 1000, drawInvisiblePoints: true, color: p$.BOX_COLORS.RED.BACKGROUND } );
var controls = {};
var labels = {}

/**
 * Function runs when document is completely loaded.
 */
$(function() {
  setup();
  resize();
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

  // Configure the result's box.
  labels.formula = results.addText(100, 14, { text: '' });
  labels.formula.setPosition(0, 25);
  results.calculateDimensions();

  // Configure the z index of all objects.
  originalPlot.setZ(2);
  plot.setZ(3);
  results.setZ(4);
  formula.setZ(5);
  dc.setZ(6);
  
  // Add plots to data cursor.
  dc.add(plot);

  // Add objects to world.
  w.add(plot, originalPlot, results, formula, dc);

}

/**
 * Setup DOM elements.
 */
function setupControls() {

  // Configure sliders.
  controls.a = new p$.Slider({ id: "a", start: 1, min: -4, max: 4, decPlaces: 2, units: "", callback: reset, color: p$.COLORS.RED });
  controls.b = new p$.Slider({ id: "b", start: 1, min: -4, max: 4, decPlaces: 2, units: "", callback: reset, color: p$.COLORS.GREEN });
  controls.c = new p$.Slider({ id: "c", start: 0, min: -4, max: 4, decPlaces: 2, units: "", callback: reset, color: p$.COLORS.BLUE });
  controls.d = new p$.Slider({ id: "d", start: 0, min: -4, max: 4, decPlaces: 2, units: "", callback: reset, color: p$.COLORS.YELLOW });
  
  // Configure reset button.
  controls.reset = new p$.dom.Button("reset", function() {
    controls.a.set(controls.a.start);
    controls.b.set(controls.b.start);
    controls.c.set(controls.c.start);
    controls.d.set(controls.d.start);
    resize();
  });

}

/**
 * Set the initial state of all variables.
 * Called when any slider changes values.
 */
function reset() {

  // Configure font. Force these configs to the context.
  formula.font.set( { size: 14, align: "left", baseline: "top" } );
  formula.font.toCtx(w.ctx);

  // Array of all texts.
  texts = [
    {
      text: 'f(x) =',
      color: p$.COLORS.GRAY,
      x: 0,
      width: 0
    },
    {
      text: controls.a.value,
      color: p$.COLORS.RED,
      x: 0,
      width: 0
    },
    {
      text: '* (',
      color: p$.COLORS.GRAY,
      x: 0,
      width: 0
    },
    {
      text: controls.b.value,
      color: p$.COLORS.GREEN,
      x: 0,
      width: 0
    },
    {
      text: '( x +',
      color: p$.COLORS.GRAY,
      x: 0,
      width: 0
    },
    {
      text: controls.c.value,
      color: p$.COLORS.BLUE,
      x: 0,
      width: 0
    },
    {
      text: ')) ² +',
      color: p$.COLORS.GRAY,
      x: 0,
      width: 0
    },
    {
      text: controls.d.value,
      color: p$.COLORS.YELLOW,
      x: 0,
      width: 0
    },
  ];

  // Calculate the -x position of each text section.
  for (var i = 0; i < texts.length; i++) {
    texts[i].width = formula.textWidth(texts[i].text);
    if (i > 0) texts[i].x = texts[i-1].x + texts[i-1].width + TEXT_OFFSET;
  }

  // Calculate the formula's width and adjust the box.
  // Only update the box's width if the difference is > 10px.
  var formulaWidth = (texts[texts.length - 1].x + texts[texts.length - 1].width + TEXT_OFFSET) * w.scaleX.toPx;
  if (Math.abs(labels.formula.width - formulaWidth) > 10) {
    labels.formula.width = formulaWidth;
    results.calculateDimensions();
  }

}

/**
 * Function gets called 60x per second.
 */
function draw() {

  // To plot from edge to edge obtain the position of the axis and convert it to real units
  var xMin = -w.axis.position.x * w.scaleX.toUnits;
  var xMax = xMin + w.width * w.scaleX.toUnits;

  // Evaluate function in range.
  plot.clear();
  originalPlot.clear();
  for (var x = xMin; x <= xMax; x += 0.1 ) {
    originalPlot.addPoint(x, Math.pow(x, 2));
    plot.addPoint(x, controls.a.value * Math.pow(controls.b.value * (x + controls.c.value), 2) + controls.d.value);
  }

}

/**
 * Function draws the formula using different colors for the coefficients.
 */
function drawFormula() {

  // Position the formula on top of the results box.
  formula.save();
  formula.translate(
    (results.position.x + results.padding.top - w.axis.position.x) * w.scaleX.toUnits,
    (labels.formula.position.y + results.position.y + results.padding.left - w.axis.position.y) * w.scaleY.toUnits
  );

  // Draw each text with their respective color.
  for (var i = 0; i < texts.length; i++) {
    formula.font.set({ 
      color: texts[i].color, 
      weight: texts[i].color === p$.COLORS.GRAY ? 'normal' : 'bold' 
    });
    formula.text(texts[i].text, texts[i].x, 0);
  }

  formula.restore();

}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {
  w.axis.setPosition(w.width / 2, w.height / 2);
  results.setPosition(20, 20);
}