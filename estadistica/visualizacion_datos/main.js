// Constants
var MAX_ROWS = 100;             // Maximum amount of rows the user can add.
var ROW_CODE = "<tr>";         // Code inserted when a new row is added.
var BIN_GAP = 3;               // Gap in pixels between bins.
ROW_CODE += "<td class='font-weight-bold text-secondary'></td>";
ROW_CODE += "<td><input type='number' step='0.001' class='var var-1 form-control-sm form-control' placeholder='0'></td>";
ROW_CODE += "<td><input type='number' step='0.001' class='var var-2 form-control-sm form-control' placeholder='0'></td>";
ROW_CODE += "<td><input type='number' step='0.001' class='var var-3 form-control-sm form-control' placeholder='0'></td>";
ROW_CODE += "<td><input type='number' step='0.001' class='var var-4 form-control-sm form-control' placeholder='0'></td>";
ROW_CODE += "<td><button type='button' id='add' class='btn btn-sm btn-danger btn-block remove'><i data-feather='x'></i></button></td>";
ROW_CODE += "</tr>";
var VAR_NAMES = [".var-1", ".var-2", ".var-3", ".var-4"];     // Id of the columns, must match with those in ROW_CODE.

// Variables
var mode = "scatter";         // Initial graph mode.
var rowCount = 1;             // Amount of rows currently enabled.
var data = [];                // 2D array containing the data from the table.
var xVariable = 0;            // Currently selected -x variable.
var yVariable = 1;            // Currently selected -y variable.
var userRangeSet = false;     // Has the user set a range for the histogram?
var userHistMin = 0;          // Min value for the histogram set by the user.
var userHistMax = 0;          // Max value for the histogram set by the user.

// p$ Objects
var plot = new p$.Plot( { 'drawInvisiblePoints': true, 'color': p$.COLORS.BLUE } );
var box = new p$.Box( {debug: false, isDraggable: false, color: p$.BOX_COLORS.GRAY } );
var w;
var controls = {};
var labels = {};

/**
 * Function runs when document is completely loaded.
 */
$(function() {
  setup();
  setupControls();
  getDataFromTable();
  reset();
  w.start();
});

/**
 * Initialize world and set up other objects.
 */
function setup() {
  
  // Configure the world.
  w = new p$.World("canvasContainer", draw, resize);

  // Configure box for displaying which variables are being plotted.
  labels.x = box.addLabel(55, 14, { name: "X:", labelWidth: 20 });
  labels.y = box.addLabel(55, 14, { name: "Y:", labelWidth: 20 });
  labels.x.setPosition(0, 0);
  labels.y.setPosition(70, 0);
  box.calculateDimensions();

  // Add objects to world.
  w.add(plot, box);

}

/**
 * Setup DOM elements.
 */
function setupControls() {

  /**
   * Reads the value from an input element. Makes sure that the element in the cell is a number.
   * If the value is invalid it is automatically replaced by a 0.
   * @param {String | Object} input Input object to read.
   * @returns {Number} the parsed value of the input.
   */
  function parseInput(input) {
    var obj = $(input);
    var newVal = parseFloat(obj.val());
    if (isNaN(newVal)) {
      newVal = 0;
    }
    obj.val(newVal.toFixed(2));
    return newVal;
  }

  /**
   * Callback function for when the input changes value. Makes sure that the value
   * is a number and is fixed to two decimal points. If it is not a number
   * then it sets the input to 0.
   */
  function inputChanged() {
    parseInput(this);
    getDataFromTable();
  }

  // Set the callback for detecting input changes.
  $('input.var').on('focusout', inputChanged);

  /**
   * Toggles the alert div.
   * @param {boolean} state enables or disables the alert div.
   * @param {String} message message displayed on the div.
   */
  function toggleAlert(state, message) {
    if (state) {
      $('#range-warning').removeClass('d-none');
      $('#range-warning').html(message || '');
    } else {
      $('#range-warning').addClass('d-none');
    }
  }

  /**
   * Read the new min and max values for the range of the histogram.
   */
  function histogramRangeChanged() {

    // Read values.
    var min = parseInput('#min');
    var max = parseInput('#max');

    // Make sure that the values are valid.
    if (min > max) {
      userRangeSet = false;
      toggleAlert(true, 'El valor máximo debe ser mayor al valor mínimo.');
    } else if (max === min) {
      userRangeSet = false;
      toggleAlert(min !== 0 && max !== 0, 'El valor mínimo no puede ser igual al valor máximo.')
    } else {
      userRangeSet = true;
      userHistMin = min;
      userHistMax = max;
      toggleAlert(false, '');
    }

    reset();

  }

  /**
   * Callback function for when rows are added/deleted. Updates the id on the row
   * so that they are allways in ascending order without gaps.
   */
  function calculateRowIds() {
    $("#varTable tbody tr").each(function() {
      var id = $(this).find("td").first();
      var i = $(this).index();
      id.html(i + 1);
    });
  }

  /**
   * Appends a row to the end of the table.
   */
  function addRow() {
    rowCount += 1;
    if (rowCount >= MAX_ROWS) {
      controls.add.enabled(false);
    }
    toggleAlert(false);
    $(ROW_CODE).insertAfter("#varTable tbody tr:last");
    feather.replace();
    calculateRowIds();
    $('input.var').on('focusout', inputChanged);
  }

  /**
   * Removes a row from the end of the table.
   */
  function removeRow() {
    if (rowCount >= MAX_ROWS) {
      controls.add.enabled(true);
    }
    rowCount -= 1;
    $("#varTable tbody tr:last").remove();
    calculateRowIds();
  }

  /**
   * After a file is selected this function attempts to read the csv file and
   * populate a table with the data. Then plot it.
   * @param {Event} event callback from input file.
   */
  function readCSV(event) {

    // Create file reader and get the select file.
    var reader = new FileReader();
    var files = event.target.files;
    var file = files[0];

    // Sets the filename label of the file currently selected.
    // Make sure that the label is at most 16 characters long.
    var fileName = file.name
    if (fileName.length > 16) {
      fileName = fileName.substring(0, 16) + "...";
    }
    $('#filename').html(fileName);

    // Read the file as text and set a callback for when it loads.
    reader.readAsText(file);
    reader.onload = function(event){

      // Parse the file data to csv data.
      var csv = $.csv.toArrays(event.target.result);

      // Limit the amount of rows displayed.
      var requiredRows = csv.length;
      if (csv.length > MAX_ROWS) {
        alert('Solo serán desplegadas las primeras ' + MAX_ROWS + ' filas.');
        requiredRows = MAX_ROWS;
      }

      // If file has no rows then stop the execution here.
      if (csv.length === 0) {
      
        alert('El archivo no contiene filas.');
      
      } else {

        // Add or delete rows as required.
        while (requiredRows > rowCount) addRow();
        while (requiredRows < rowCount) removeRow();

        // Get the number of available columns on the file.
        // It there are more than four columns then limit the amount to 4.
        var availableColumns = csv[0].length > 4 ? 4 : csv[0].length;

        // Get all of the inputs for the table.
        var vars = [$('input.var-1'), $('input.var-2'), $('input.var-3'), $('input.var-4')];

        // Clear data object used to plot.
        data = [[], [], [], []];

        // Iterate through all required rows.
        for (var i = 0; i < requiredRows; i++) {

          // Iterate through all columns.
          for (var j = 0; j < 4; j++) {

            // Get the value from the csv data. Attempt to parse it as float,
            // if failed, this means that the cell contains text, default the value to 0.
            var number = 0;
            if (j < availableColumns) {
              var number = parseFloat(csv[i][j]);
              if (isNaN(number)) {
                number = 0;
              }
            }

            // Write the parsed float to the input. Also save the value on the data array.
            $(vars[j][i]).val(number.toFixed(2));
            data[j][i] = number;
          }
        }

        // Reset to redraw points.
        reset();

      }

    }
  }

  /**
   * Callback function for when remove button is pressed.
   */
  $("#varTable").on('click', '.remove', function(e) {
    if (rowCount >= MAX_ROWS) {
      controls.add.enabled(true);
    }
    rowCount -= 1;
    var row = $(this).closest("tr");
    row.remove();
    calculateRowIds();
    getDataFromTable();
    toggleAlert(false);
  });

  /**
   * Callback function for when the add button is pressed.
   */
  controls.add = new p$.dom.Button("add", function(e){
    addRow();
    getDataFromTable();
  });

  // Read the currently selected -x variable.
  controls.xAxis = new p$.dom.Options("xAxis", function(o) {
    xVariable = parseInt(o);
    reset();
  });

  // Read the currently selected -y variable.
  controls.yAxis = new p$.dom.Options("yAxis", function(o) {
    yVariable = parseInt(o);
    reset();
  });

  // Histogram slider.
  controls.bins = new p$.Slider({ id: "bins", start: 5, min: 1, max: 20, decPlaces: 0, units: "", callback: reset });

  // Read the currently selected graph type.
  controls.type = new p$.dom.Select("graphType", function(val) {
    mode = val;
    userRangeSet = false;
    toggleAlert(false);
    if (mode === "histogram") {
      $('#bins').removeClass('d-none');
      $('#range').removeClass('d-none');
      $('#y-axis').addClass('d-none');
    } else {
      $('#bins').addClass('d-none');
      $('#range').addClass('d-none');
      $('#y-axis').removeClass('d-none');
    }
    reset();
  });

  // Detect changes on the histogram range.
  $('input.range').on('focusout', histogramRangeChanged);

  // Detect if File API is supported by the browser.
  // Watch for file input changes.
  if(window.File && window.FileReader && window.FileList && window.Blob) {
    $('#fileBrowser').removeClass('d-none');
    $('#files').bind('change', readCSV);
  }

}

/**
 * Reads the data from the table and stores it in the variable data.
 */
function getDataFromTable() {

  /**
   * Given a class name for a variable it reads all of its values.
   * In other words, it reads all column values. Returns this as an
   * array.
   */
  function readVariable(name) {

    // Iterate through all values.
    var values = []
    $(name).each(function() {

      // Get the floating point value from the cell. If it is not a float
      // then take it as 0.
      var val = parseFloat($(this).val());
      if (isNaN(val)) {
        val = 0;
      }
      values.push(val);
    })

    return values;

  } 

  // Read all variables defined in VAR_NAMES and store them in data.
  for (var i = 0; i < VAR_NAMES.length; i++) {
    data[i] = readVariable(VAR_NAMES[i]);
  }

  // Reset to redraw everything.
  reset();
}

// Set the initial state of all variables.
function reset() {

  // Update box labels for displaying the currently selected variables.
  labels.x.set("Var " + (xVariable + 1));
  if (mode == "histogram") {
    labels.y.set("-");
  } else {
    labels.y.set("Var " + (yVariable + 1));
  }

  // In order to scale the axis for fitting the data correctly,
  // the dimensions of the data must be calculated. These variables
  // store the min/max values in both axes.
  var xMax = -Infinity;
  var xMin = Infinity;
  var yMin = 0;
  var yMax = 0;

  // Current x and y values.
  var x = 0;
  var y = 0;

  /**
   * Takes a point and recalculates the min/max in both axes.
   */
  function calcDimensions(x, y) {
    if (x > xMax) {
      xMax = x;
    }
    if (x < xMin) {
      xMin = x;
    }
    if (y > yMax) {
      yMax = y;
    }
    if (y < yMin) {
      yMin = y;
    }
  }

  // Reset the plot.
  plot.clear();
  plot.style = "line";

  if (mode == "scatter") {

    // Iterate through all points in the selected variables and put markers.
    for (var row = 0; row < rowCount; row++) {
      x = data[xVariable][row];
      y = data[yVariable][row];
      calcDimensions(x, y);
      plot.addMarker(x, y, { 'color': p$.COLORS.BLUE } );
    }

  } else if (mode == "line") {

    // Iterate through all points in the selected variables, put markers and connect the markers by lines.
    for (var row = 0; row < rowCount; row++) {
      x = data[xVariable][row];
      y = data[yVariable][row];
      calcDimensions(x, y);
      plot.addMarker(x, y, { 'color': p$.COLORS.BLUE });
      plot.addPoint(x, y);
    }
    
  } else if (mode == "histogram") {
    
    plot.style = "histogram";

    // Get the data from the selected variable and sort it in ascending order.
    var sorted = [];
    for (var row = 0; row < rowCount; row++) sorted.push(data[xVariable][row]);
    sorted.sort(function(a, b){return a - b});

    // Since the data is sorted, we already know the minimum and maximum values in the -x axis.
    // Also take into account the values set by the user.
    xMax = userRangeSet ? userHistMax : sorted[sorted.length - 1];
    xMin = userRangeSet ? userHistMin : sorted[0];
    yMin = 0;
    yMax = 0;

    // Calculate the bin with based on the range of the data.
    var range = xMax - xMin;
    var binWidth = range / controls.bins.value;

    // Iterate through all bins and count how many items fit on that bin.
    for (var i = 0; i < controls.bins.value; i++) {

      var amount = 0;   // Count of values on the bin.

      // Stores the min and max values for the bin. If the value fits within this range then
      // increate the count.
      var min = xMin + i * binWidth;
      var max = xMin + (i + 1) * binWidth;

      // Iterate through all values.
      for (var j = 0; j < sorted.length; j++) {
        // Check if the value fits within the current bin, if so increase count.
        // Important is that the comparisson is min <= x < max.
        if (sorted[j] >= min && sorted[j] < max) {
          amount += 1;
        }
      }

      // Increase the y-max based on the current amount.
      if (amount > yMax) yMax = amount;

      // Add the bin to the plot. The bin is centered and the with of the bin is later calculated.
      plot.addPoint(
        xMin + i * binWidth + binWidth / 2,
        amount
      );

    }

    // Match the width of the min label to the bin label. Since they are in separate tables
    // they do not initially match.
    $('#min-label').width($('#bins-label').width()); 

    // Set min and max inputs.
    $('#min').val(xMin.toFixed(2));
    $('#max').val(xMax.toFixed(2));

  }
  
  // Fit the axes to the data with a margin of 110%.
  w.fit(xMin, xMax, yMin, yMax, 1.1);

  // Once the data is fitted the bin-width can be scaled.
  // Subtract 2 to leave a 2px gap between bins.
  if (mode == "histogram") {
    plot.binWidth = binWidth * w.scaleX.toPx - BIN_GAP;
    if (plot.binWidth < 0) {
      plot.binWidth = 1;
    }
  }

}

/**
 * Function gets called 60x per second.
 */
function draw() {

}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {
  w.axis.setPosition(w.width / 2, w.height / 2);
  box.setPosition(w.width - 20 - box.width, 20);
  if (w.width < 350) {
    $('#filename').addClass('d-none');
  } else {
    $('#filename').removeClass('d-none');
  }
  reset();
}
