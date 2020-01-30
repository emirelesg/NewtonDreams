// Constants
var COLORS = Object.values(p$.COLORS);  // Array of colors.
var MAX_VECTORS = 10;                             // Amount of vectors allowed.
var DECPLACES = 2;                                // Number of dec places shown in the input.

// Variables
var xMin = 0;         // Position of the farthest object in -x direction.
var xMax = 0;         // Position of the farthest object in +x direction.
var yMin = 0;         // Position of the farthest object in -y direction.
var yMax = 0;         // Position of the farthest object in y direction.
var binded = false;   // Determine if the input change callback has already been binded. 
var colorIndex = 1;   // Index of the currently selected color.

// p$ Objects
var w;
var vectors = [];
var resultant = new p$.Vector({ componentsAtOrigin: false, color: p$.COLORS.GRAY });
var controls = {};

/**
 * Function runs when document is completely loaded.
 */
$(function() {
  setup();
  setupControls();
  w.start();
});

/**
 * Initialize world and set up other objects.
 */
function setup() {

  // Configure the world.
  w = new p$.World("canvasContainer", draw, resize);

  // Create the first vector A.
  var v = new p$.Vector({ componentsAtOrigin: false, color: COLORS[0] });
  vectors.push(v);
  
  // Configure the z index of all objects.
  resultant.setZ(2);

  // Add objects to world.
  w.add(v, resultant);

}

/**
 * Setup DOM elements.
 */
function setupControls() {

  // Monitor the add button.
  controls.addVector = new p$.dom.Button("addVector", function(e){
    addVector();
    calcResultant();
  });

  // Monitor delete buttons.
  $("table#vectorTable").on("click", ".removeVector", function() {
    removeVector($(this).closest("tr"));
    calcResultant();
  });

  // Monitor toggleComponent buttons.
  $("table#vectorTable").on("click", ".toggleComponents", function() {
    toggleComponents($(this).closest("tr"), $(this).closest("button"));
    calcResultant();
  });

  // Monitor the changes on the inputs.
  $("input").on("input", function(e){
    inputChanged(e);
    calcResultant();
  });

}

/**
 * Adds a vector to the table and to the calculations.
*/
function addVector() {

  // Get the vector's letter and color
  var letter = p$.SYMBOL.LETTERS.charAt(vectors.length);

  // Html code for the vector
  var rowCode = "<tr>";
  rowCode += "<td class='font-weight-bold' style='color: " + COLORS[colorIndex] + ";'>" + letter + "</td>";
  rowCode += "<td><input type='text' class='form-control-sm form-control' placeholder='0'></td>";
  rowCode += "<td><input type='text' class='form-control-sm form-control' placeholder='0'></td>";
  rowCode += "<td><input type='text' class='form-control-sm form-control' placeholder='0'></td>";
  rowCode += "<td><input type='text' class='form-control-sm form-control' placeholder='0'></td>";
  rowCode += "<td><button type='button' class='btn btn-sm toggleComponents btn-block'><i data-feather='eye' class='d-none'></i><i data-feather='eye-off'></i></button></td>";
  rowCode += "<td><button type='button' class='btn btn-sm removeVector btn-danger btn-block'><i data-feather='x'></i></button></td>";
  rowCode += "</tr>";

  // Insert before last row
  $(rowCode).insertBefore("#vectorTable tbody tr:last");
  feather.replace();

  // Monitor the changes on the newly added inputs
  $("input").on("input", function(e){
    inputChanged(e);
    calcResultant();
  });

  // Create a new vector object and add vector to stage
  var v = new p$.Vector( { componentsAtOrigin: false, color: COLORS[colorIndex] } );
  vectors.push(v);
  w.add(v);

  // Increase color
  colorIndex += 1;
  if (colorIndex >= COLORS.length - 3) colorIndex = 0;

  // Disable add button
  if (vectors.length >= MAX_VECTORS) {
    controls.addVector.enabled(false);
  }

}

/**
 * Remove a vector from the table and from the calculations.
 */
function removeVector(row) {

  // Reenable add button
  if (vectors.length >= MAX_VECTORS) {
    controls.addVector.enabled(true);
  }

  // Remove row and vector from array
  var i = row.index();
  w.remove(vectors[i]);
  vectors.splice(i, 1);

  // Remove click event
  row.remove();

  // Recalculate letters of vectors
  $("#vectorTable tbody tr:not(:last-child)").each(function() {
    
    // Find the column with the vector's letter and its index
    var vectorLetter = $(this).find("td").first();
    var i = $(this).index();

    // Change the letter of the vector
    vectorLetter.html(p$.SYMBOL.LETTERS.charAt(i));

    // Change the color of the vector
    colorIndex = i;
    vectorLetter.css("color", COLORS[colorIndex]);
    vectors[i].color = COLORS[colorIndex];

  });

  // Next color
  colorIndex += 1;

}

/**
 * Callback function to a change in an input. Determine which value changed
 * and then update vectors and calculations.
 */
function inputChanged(e) {

  // Get the value, vector
  var input = $(e.target);
  var value = parseFloat(input.val());

  // Validate that the input is a float
  if (value == input.val()) {

    // The input is a valid float
    input.removeClass("invalid");

    // Remove any handlers
    input.unbind("focusout");
    binded = false;

  } else if (input.val() === "") {

    // If the input is blank then make it valid
    input.removeClass("invalid");
    binded = false;

  } else {

    // Make the input invalid
    input.addClass("invalid");

    if (!binded) {

      // When the user focuses out make the input valid
      input.on("focusout", function() {
        $(this).removeClass("invalid");
        $(this).val(value || "");
      });

      binded = true;
    }

  }

  // Get the col and row of respective input
  var row = input.parent().parent().index();
  var col = input.parent().index();
  var v = vectors[row];

  // Obtain all of the inputs in the row
  var inputs = input.parent().parent().find("input");
  var magnitude = $(inputs[0]);
  var angle = $(inputs[1]);
  var x = $(inputs[2]);
  var y = $(inputs[3]);

  if (col === 1) {
    // Update the magnitude of the vector
    var ang = parseFloat(angle.val()) || 0;
    v.setMag(value, ang);

    // Update other input fields
    angle.val(p$.utils.round(ang, DECPLACES) || "");
    x.val(p$.utils.round(v.x, DECPLACES) || "");
    y.val(p$.utils.round(v.y, DECPLACES) || "");
  } else if (col === 2) {
    // Update the direction of the vector
    var mag = parseFloat(magnitude.val()) || 0;
    v.setMag(mag, value);

    // Update other input fields
    magnitude.val(p$.utils.round(mag, DECPLACES) || "");
    x.val(p$.utils.round(v.x, DECPLACES) || "");
    y.val(p$.utils.round(v.y, DECPLACES) || "");
  } else if (col === 3) {
    // Update the x component of the vector
    v.x = value || 0;

    // Update other input fields
    magnitude.val(p$.utils.round(v.mag(), DECPLACES) || "");
    angle.val(p$.utils.round(v.standardAngle(), DECPLACES) || "");
  } else if (col === 4) {
    // Update the y component of the vector
    v.y = value || 0;

    // Update other input fields
    magnitude.val(p$.utils.round(v.mag(), DECPLACES) || "");
    angle.val(p$.utils.round(v.standardAngle(), DECPLACES) || "");
  }

}

/**
 * Update vectors positions and resultant vector and input fields.
 */
function calcResultant() {

  // Show the resultant vector if two or more vectors are being added
  resultant.display = vectors.length > 1;

  // Calculate the resultant vector and update the position of the vectors
  // along the calculation. Also determine the maximum an minimum positions to
  // set the viewing scale.
  resultant.set(0, 0);
  xMax = 0;
  xMin = 0;
  yMin = 0;
  yMax = 0;
  for (var i = 0; i < vectors.length; i++) {
    // Change the position of the vector to the current sum of the previous
    // vectors.
    vectors[i].setPosition(resultant.x, resultant.y);

    // Add next vector
    resultant.add(vectors[i]);

    // Calculate the dimensions the vectors need
    if (resultant.x > 0) {
      if (resultant.x > xMax) xMax = resultant.x;
    } else if (resultant.x < xMin) xMin = resultant.x;
    if (resultant.y > 0) {
      if (resultant.y > yMax) yMax = resultant.y;
    } else if (resultant.y < yMin) yMin = resultant.y;
  }

  // Move the grid to fit all vectors
  w.fit(xMin, xMax, yMin, yMax, 1.25);

  // Update input fields
  var inputs = $("#vectorTable tbody tr:last-child").find("input");
  $(inputs[0]).val(p$.utils.round(resultant.mag(), DECPLACES));
  $(inputs[1]).val(p$.utils.round(resultant.standardAngle(), DECPLACES));
  $(inputs[2]).val(p$.utils.round(resultant.x, DECPLACES));
  $(inputs[3]).val(p$.utils.round(resultant.y, DECPLACES));
  
}

/**
 * Toggle the components of the desired vector.
 */
function toggleComponents(row, button) {

  // Get index of row
  var i = row.index();

  // Check if vector is the resultant
  var state = false;
  var v = (i === vectors.length) ? resultant : vectors[i];
  v.components = !v.components;
  state = v.components;

  // Toggle color and icon off button
  if (state) {
    button.addClass("btn-primary");
    button.children(":eq(0)").removeClass("d-none").addClass("d-inline");
    button.children(":eq(1)").addClass("d-none").removeClass("d-inline");
  } else {
    button.removeClass("btn-primary");
    button.children(":eq(0)").addClass("d-none").removeClass("d-inline");
    button.children(":eq(1)").removeClass("d-none").addClass("d-inline");
  }

}

/**
 * Function gets called 60x per second.
 */
function draw() {}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {
  w.fit(xMin, xMax, yMin, yMax, 1.25);
}