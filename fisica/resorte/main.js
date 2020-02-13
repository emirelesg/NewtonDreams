// Constants
var SPRING_STROKE = 4;                  // Weight of the stroke used to draw the spring.
var SPRING_WIDTH = 1.2;                 // Width of the spring.
var SPRING_WINDINGS = 8;                // Amount of windings in the spring.
var SPRING_HANGING_OFFSET = 0.4;        // Distance from the ceiling to the spring.
var SPRING_STEP = 1 / SPRING_WINDINGS;  // Required for drawing algorithm.
var SPRING_X0 = 3;                      // Starting x position for the spring.
var SPRING_Y0 = 0;                      // Starting y position for the spring.
var SPRING_NATURAL_LENGTH = 4;          // Resting length of the spring.
var CEILING_HEIGHT = 10;                // Height of the ceiling in pixels.

// Variables
var weight_side = 0;                    // Dimensions of the hanging mass. Depends on its mass.
var spring_y = 0;                       // Current extension of the spring. 
var natural_y = 0;                      // Y coordinate of the spring"s natural length.
var equilibrium_y = 0;                  // Y coordinate of the equilibrium point of the spring.
var extended_y = 0;                     // Y coordinate of the spring"s extended length.
var frame = 0;                          // Current frame.
var started = false;                    // Is the animation running?
var horizontal_distance_labels = true;  // Display labels horizontally or vertically?

// p$ Objects
var w;
var dc = new p$.DataCursor({ constant: true });
var box = new p$.Box( { debug: false, title: "Movimiento del Resorte", isDraggable: false } );
var spring = new p$.Shape(drawSpring);
var controls = {};
var graph = undefined;
var path = undefined;
var damping_plot_top = undefined;
var damping_plot_bottom = undefined;

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
  w.axis.isDraggable = false;
  w.axis.display = true;
  w.axis.displayX = false;
  w.axis.grid = false;
  w.scaleX.set(50, 2, "cm");
  w.scaleY.set(50, -2, "cm");

  // Define background.
  w.background.setCallback(function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = p$.BOX_COLORS.GRAY.BACKGROUND;
    ctx.rect(0, 0, w.width, w.height);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = p$.COLORS.BROWN;
    ctx.rect(0, 0, w.width, CEILING_HEIGHT);
    ctx.fill();
  });

  // Configure graph plot.
  graph = box.addGraph(300, 200, {});
  graph.setLabels("", "Tiempo [s]", "Amplitud [cm]");
  graph.setPosition(0, 20);
  graph.scaleX.set(50, 2, "");
  graph.scaleY.set(50, -2, "");
  graph.setAxisPosition("left", "center");
  path = graph.addPlot( { color: p$.COLORS.BLUE, label: "", limit: 1000 } );
  damping_plot_top = graph.addPlot( { color: p$.BOX_COLORS.GRAY.BORDER, label: "", limit: 1000, display: false } );
  damping_plot_bottom = graph.addPlot( { color: p$.BOX_COLORS.GRAY.BORDER, label: "", limit: 1000, display: false });
  box.calculateDimensions();

  // Add plots to data cursor.
  dc.add(path);

  // Configure the z index of all objects.
  box.setZ(1);
  spring.setZ(2);
  dc.setZ(3);

  // Add objects to world.
  w.add(spring, box, dc);

}

/**
 * Setup DOM elements.
 */
function setupControls() {

  // Configure sliders.
  controls.mass       = new p$.Slider({ id: "mass", start: 2.5, min: 1, max: 3, decPlaces: 1, units: "kg", callback: reset, color: p$.COLORS.RED });
  controls.amplitude  = new p$.Slider({ id: "amplitude", start: 2, min: 0, max: 3, decPlaces: 1, units: "cm", callback: reset, color: p$.COLORS.GREEN });
  controls.k          = new p$.Slider({ id: "k", start: 5, min: 5, max: 10, decPlaces: 1, units: "N/m", callback: reset, color: p$.COLORS.BLUE });
  controls.damping    = new p$.Slider({ id: "damping", start: 0.5, min: 0, max: 3, decPlaces: 1, units: "", callback: reset, color: p$.COLORS.YELLOW });
  
  // Buttons.
  controls.start = new p$.dom.Button("start", function() {
    // Reset the simulation only if the simulation has ended.
    if (frame >= path.points.length - 1) frame = 0;
    started = true;
  });
  controls.pause = new p$.dom.Button("pause", function() {
    started = false;
  });
  controls.forward = new p$.dom.Button("forward", function() {
    started = false;
    frame += 10;
    if (frame >= path.points.length) frame = path.points.length - 1;
  });
  controls.back = new p$.dom.Button("back", function() {
    started = false;
    frame -= 10;
    if (frame < 0) frame = 0;
  });
  controls.reset = new p$.dom.Button("reset", function() {
    started = false;
    frame = 0;
  });

  // Show damping option.
  controls.show_damping = new p$.dom.Option("showDamping", function(c) {
    damping_plot_bottom.display = c;
    damping_plot_top.display = c;
  });
  
}

/**
 * Set the initial state of all variables.
 * Called when any slider changes values.
 */
function reset() {

  // Calculate equilibrium point. The mass moves around this point.
  // F(weight) = F(spring)
  // mg = kx
  // x = mg / k
  equilibrium_point = controls.mass.value * 9.81 / controls.k.value;

  // Calculate spring lengths. They are the absolute y length of the spring.
  // This means the zero point is taken into consideration.
  natural_y     = SPRING_Y0 - SPRING_NATURAL_LENGTH;
  equilibrium_y = natural_y - equilibrium_point;
  extended_y    = equilibrium_y - controls.amplitude.value;

  // Calculate dimensions of box based on mass.
  weight_side = Math.pow(controls.mass.value * 2, 1 / 3);

  // Set spring position at its extended length.
  spring_y = extended_y;

  // Clear plots.
  path.clear();
  path.addMarker(0, 0);
  damping_plot_top.clear();
  damping_plot_bottom.clear();
  
  // Stop and reset animation.
  frame = 0;
  started = false;
  resize();

  // Precalculate the simulation.
  var omega     = Math.sqrt(controls.k.value / controls.mass.value);
  var t_period  = 2 * p$.PI * Math.sqrt(controls.mass.value / controls.k.value);
  var y         = controls.damping.value / (2 * controls.mass.value);
  var t         = 0;

  // Calculate the displacement and damping factor of the spring.
  function calc(t) {
    var damp_factor = Math.exp(-y * t);
    var s = damp_factor * controls.amplitude.value * Math.cos(Math.sqrt(omega * omega - y * y) * t);
    path.points.push([t, -s]);
    damping_plot_top.points.push([t, damp_factor * controls.amplitude.value]);
    damping_plot_bottom.points.push([t, -damp_factor * controls.amplitude.value]);
  }

  // Calculate the spring"s movement and store it in an array.
  if (controls.damping.value > 0) {
    // Record points until the spring stops moving.
    do {
      calc(t);
      t += 1/60.0;
    } while (damping_plot_top.points[damping_plot_top.points.length - 1][1] > 0.05);
  } else {
    // Record points until the first period.
    for (t = 0; t < 10 * t_period; t += 1 / 60.0) {
      calc(t);
    }
  }


}

/**
 * Function gets called 60x per second.
 */
function draw() {

  // Update the control buttons, depending on the current frame.
  controls.start.enabled(!started);
  controls.pause.enabled(started);
  controls.back.enabled(frame > 0);
  controls.forward.enabled(frame < path.points.length - 1);
  controls.reset.enabled(started || frame > 0);

  // Increase current frame only if the simulation has not started.
  if (started) {
    if (frame < path.points.length - 1) {
      // Next frame of the animation.
      frame += 1;
    } else if (controls.damping.value > 0) {
      // Stop the simulation, the movement of the spring is not noticeable.
      started = false;
    } else {
      // Repeat the points. The spring never stops moving.
      frame = 0;
    }
  }

  // Set the spring"s position.
  spring_y = equilibrium_y + path.points[frame][1];
  path.markers[0].x = path.points[frame][0];
  path.markers[0].y = path.points[frame][1];

  // If the graph has gone outside of the available graph space,
  // then move the x axis to fit the latest data.
  var availableDisplayTime = graph.axis.width * graph.scaleX.toUnits;
  if (path.points[frame][0] > availableDisplayTime) {
    graph.axis.position.x = -(path.points[frame][0] - availableDisplayTime) * graph.scaleX.toPx;
  } else {
    graph.axis.position.x = 0;
  }

}

function drawSpring() {

  function drawBackShading() {
    /**
     * Draw background of spring for shading.
     */

    spring.begin();
    spring.stroke(p$.COLORS.GRAY);
    spring.noFill();
    spring.moveTo(SPRING_X0, SPRING_Y0);
    for (var i = 0; i <= 1 - SPRING_STEP; i += SPRING_STEP) {
      for (var j = 0; j < 1; j += 0.05) {
        var xx = SPRING_X0 + Math.sin(j * Math.PI * 2) * SPRING_WIDTH;
        var yy = SPRING_Y0 + spring_length * (i + j * SPRING_STEP);
        spring.lineTo(xx, yy);
      }
    }
    spring.lineTo(SPRING_X0, spring_y);
    spring.end();
  }

  function drawSpring() {
    /**
     * Draw the main spring. Only draws highlighted sections.
     */

    spring.begin();
    spring.stroke(p$.COLORS.LIGHT_GRAY);
    spring.noFill();
    for(var i = 0; i <= 1-SPRING_STEP; i += SPRING_STEP){  // for each winding
      for(var j = 0.25; j <= 0.76; j += 0.05){
        var xx = SPRING_X0 + Math.sin(j * Math.PI * 2) * SPRING_WIDTH;
        var yy = SPRING_Y0 + spring_length * (i + j * SPRING_STEP);
        if (j === 0.25) {
          spring.moveTo(xx, yy);
        } else {
          spring.lineTo(xx, yy);
        }
      }
    }
    spring.moveTo(SPRING_X0, spring_y);
    spring.lineTo(SPRING_X0, spring_y - SPRING_HANGING_OFFSET);
    spring.moveTo(SPRING_X0, SPRING_Y0);
    spring.lineTo(SPRING_X0, SPRING_Y0 + SPRING_HANGING_OFFSET);
    spring.end();
  }

  function drawMass() {
    /**
     * Draws the hanging mass at the end of the spring.
     */

    // Move to the hanging point of the mass.
    spring.save();
    spring.translate(SPRING_X0, spring_length - SPRING_HANGING_OFFSET - 0.2);
    spring.stroke(p$.BOX_COLORS.YELLOW.BORDER);
    
    // Draw hanging ring.
    spring.arc(0, 0, 0.2, 180, 360);
      
    // Draw hanging mass.
    spring.fill(p$.BOX_COLORS.YELLOW.BACKGROUND);
    spring.rect(-weight_side / 2, -weight_side, weight_side, weight_side);

    // Draw mass label.
    spring.font.set( { align: "center" } );
    spring.text(controls.mass.value + " kg", 0, -weight_side / 2);
    spring.restore();

  }

  function drawDistances() {
    /**
     * Draws the extended and relaxed lengths of the spring.
     */

    // Allign fonts to the left.
    if (horizontal_distance_labels) {
      spring.font.set( { align: "left" } );
    } else {
      spring.font.set( { align: "center" } );
    }

    // Calculate the x position of the lines
    var x0 = SPRING_X0 * 2;

    // Draw y0 / spring"s natural length.
    spring.stroke(p$.BOX_COLORS.YELLOW.BORDER);
    spring.fill(p$.BOX_COLORS.YELLOW.BACKGROUND);
    spring.rect(0, 0, x0, natural_y);
    if (horizontal_distance_labels) {
      spring.text("Longitud", x0 + 0.5, natural_y + SPRING_NATURAL_LENGTH / 2 + 0.3);
      spring.text("Fija", x0 + 0.5, natural_y + SPRING_NATURAL_LENGTH / 2 - 0.3);
    } else {
      spring.save();
      spring.translate(x0 + 0.5, natural_y + SPRING_NATURAL_LENGTH / 2);
      spring.rotate(90);
      spring.text("Longitud", 0, 0);
      spring.text("Fija", 0, -0.6);
      spring.restore();
    }

    // Draw y1 or the equilibrium point of the spring with the mass.
    spring.stroke(p$.BOX_COLORS.BLUE.BORDER);
    spring.fill(p$.BOX_COLORS.BLUE.BACKGROUND);
    spring.rect(0, natural_y, x0, equilibrium_y - natural_y);
    if (horizontal_distance_labels) {
      spring.text("Longitud de", x0 + 0.5, equilibrium_y + equilibrium_point / 2 + 0.3);
      spring.text("Equilibrio", x0 + 0.5, equilibrium_y + equilibrium_point / 2 - 0.3);
    } else {
      spring.save();
      spring.translate(x0 + 0.5, equilibrium_y + equilibrium_point / 2);
      spring.rotate(90);
      spring.text("Longitud de", 0, 0);
      spring.text("Equilibrio", 0, -0.6);
      spring.restore();
    }

    // Draw amplitude length. How much the user pulls on the mass?
    if (controls.amplitude.value > 0) {
      spring.stroke(p$.BOX_COLORS.GREEN.BORDER);
      spring.fill(p$.BOX_COLORS.GREEN.BACKGROUND);
      spring.rect(0, equilibrium_y, x0, extended_y - equilibrium_y);
      if (horizontal_distance_labels) {
        spring.text("Amplitud", x0 + 0.5, extended_y + controls.amplitude.value / 2);
      } else {
        spring.save();
        spring.translate(x0 + 0.5, extended_y + controls.amplitude.value / 2);
        spring.rotate(90);
        spring.text("Amplitud", 0, 0);
        spring.restore();
      }
    }

  }

  // Calculate the height of the spring. As spring_y takes into account the origin,
  // it must be subtracted from the calculation.
  var spring_length = spring_y - SPRING_Y0;

  // Draw sequence.
  spring.lineDash(4);
  drawDistances();
  spring.lineDash(0);
  spring.strokeWeight(SPRING_STROKE);
  drawBackShading();
  drawSpring();
  spring.strokeWeight(2);
  drawMass();

  // Draw reference line to the plot.
  var lastPointX = path.points[frame][0] * graph.scaleX.toPx + graph.axis.position.x;
  spring.stroke(p$.BOX_COLORS.GRAY.BORDER);
  spring.lineDash(4);
  spring.strokeWeight(2);
  spring.line(SPRING_X0, spring_y, (lastPointX + box.position.x - w.axis.position.x + box.padding.left + graph.padding.left) * w.scaleX.toUnits, spring_y)
  
}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {
  
  /**
   * Resizes the graph while keeping the last x position of the axis.
   * Since the x axis is sliding during the animation, the position must be restored.
   */
  function resizeGraph(width, height) {
    
    if (started) {
      var axis_x = graph.axis.position.x;
      graph.setDimensions(width, height);
      graph.axis.position.x = axis_x; 
    } else {
      graph.setDimensions(width, height)
    }
 
  }

  // Position the axis at the top left corner.
  w.axis.setPosition(50, CEILING_HEIGHT + SPRING_HANGING_OFFSET * w.scaleX.toPx);

  // Spring x position.
  SPRING_X0 = w.width > 600 ? 3 : 2;

  // Only display the graph if width > 350.
  box.display = w.width > 350;

  // Change graph title for smaller windows.
  box.title = w.width > 450 ? "Movimiento del Resorte" : "Movimiento";

  // Rotate labels if graph is close to them.
  horizontal_distance_labels = w.width > 480 || w.width < 350;

  // Keep the width of the graph equal to the half of the canvas width.
  resizeGraph(w.width / 2 - 30, 310);

  // Recalculate the dimensions and set its position on the top right corner.
  box.calculateDimensions();
  box.setPosition(w.width - box.width - 20, 30);

  // Set the -y axis to the height of the equilibrium position.
  var graphYAbs = box.position.y - w.axis.position.y + box.padding.top + graph.position.y + graph.padding.top;
  graph.axis.position.y = equilibrium_y * w.scaleY.toPx - graphYAbs;

}
