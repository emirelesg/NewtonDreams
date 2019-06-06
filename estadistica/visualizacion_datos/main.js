// Constants
var MAX_ROWS = 30;
var ROW_CODE = "<tr>";
ROW_CODE += "<td class='font-weight-bold text-secondary'></td>";
ROW_CODE += "<td><input type='number' step='0.001' class='var var-1 form-control-sm form-control' placeholder='0'></td>";
ROW_CODE += "<td><input type='number' step='0.001' class='var var-2 form-control-sm form-control' placeholder='0'></td>";
ROW_CODE += "<td><input type='number' step='0.001' class='var var-3 form-control-sm form-control' placeholder='0'></td>";
ROW_CODE += "<td><input type='number' step='0.001' class='var var-4 form-control-sm form-control' placeholder='0'></td>";
ROW_CODE += "<td><button type='button' id='add' class='btn btn-sm btn-danger btn-block remove'><i data-feather='x'></i></button></td>";
ROW_CODE += "</tr>";
var VAR_NAMES = [".var-1", ".var-2", ".var-3", ".var-4"];

// Variables
var mode = "scatter";
var rowCount = 1;
var data = [];
var xVariable = 0;
var yVariable = 1;

// p$ Objects
var plot = new p$.Plot( { 'drawInvisiblePoints': true, 'color': p$.COLORS.BLUE } );
var box = new p$.Box();
var w;
var controls = {};

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

  // Configure the z index of all objects.

  // Add objects to world.
  w.add(plot, box);

}

/**
 * Setup DOM elements.
 */
function setupControls() {

  function inputChanged() {
    var prevVal = $(this).val();
    var newVal = parseFloat(prevVal).toFixed(2);
    if (!isNaN(newVal)) {
      $(this).val(newVal);
    } else {
      $(this).val(0);
    }
    getDataFromTable();
  }

  function calculateRowIds() {
    $("#varTable tbody tr").each(function() {
      var id = $(this).find("td").first();
      var i = $(this).index();
      id.html(i + 1);
    });
  }

  $("#varTable").on('click', '.remove', function(e) {
    if (rowCount >= MAX_ROWS) {
      controls.add.enabled(true);
    }
    rowCount -= 1;
    var row = $(this).closest("tr");
    row.remove();
    calculateRowIds();
    getDataFromTable();
  });

  controls.add = new p$.dom.Button("add", function(e){
    rowCount += 1;
    if (rowCount >= MAX_ROWS) {
      controls.add.enabled(false);
    }
    $(ROW_CODE).insertAfter("#varTable tbody tr:last");
    feather.replace();
    calculateRowIds();
    $('input.var').on('focusout', inputChanged);
    getDataFromTable();
  });

  controls.xAxis = new p$.dom.Options("xAxis", function(o) {
    xVariable = parseInt(o);
    reset();
  });

  controls.yAxis = new p$.dom.Options("yAxis", function(o) {
    yVariable = parseInt(o);
    reset();
  });

  controls.bins = new p$.Slider({ id: "bins", start: 5, min: 1, max: 20, decPlaces: 0, units: "", callback: reset });
  

  controls.type = new p$.dom.Select("graphType", function(val) {
    mode = val;
    if (mode === "histogram") {
      $('#bins').removeClass('d-none');
    } else {
      $('#bins').addClass('d-none');
    }
    controls.yAxis.enabled(mode !== "histogram");
    reset();
  });

  $('input.var').on('focusout', inputChanged);
  
}

function getDataFromTable() {
  function readVariable(name) {
    var values = []
    $(name).each(function() {
      var val = parseFloat($(this).val());
      if (isNaN(val)) {
        val = 0;
      }
      values.push(val);
    })
    return values;
  } 
  for (var i = 0; i < VAR_NAMES.length; i++) {
    data[i] = readVariable(VAR_NAMES[i]);
  }
  reset();
}

// Set the initial state of all variables.
function reset() {

  var xMax = -Infinity;
  var xMin = Infinity;
  var yMin = 0;
  var yMax = 0;
  var x = 0;
  var y = 0;

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

  plot.clear();
  plot.style = "line";

  if (mode == "scatter") {

    for (var row = 0; row < rowCount; row++) {
      x = data[xVariable][row];
      y = data[yVariable][row];
      calcDimensions(x, y);
      plot.addMarker(x, y, { 'color': p$.COLORS.BLUE } );
    }

  } else if (mode == "line") {

    for (var row = 0; row < rowCount; row++) {
      x = data[xVariable][row];
      y = data[yVariable][row];
      calcDimensions(x, y);
      plot.addMarker(x, y, { 'color': p$.COLORS.BLUE });
      plot.addPoint(x, y);
    }
    
  } else if (mode == "histogram") {
    
    plot.style = "histogram";

    var sorted = [];
    for (var row = 0; row < rowCount; row++) sorted.push(data[xVariable][row]);
    sorted.sort(function(a, b){return a - b});

    xMax = sorted[sorted.length - 1];
    xMin = sorted[0];
    yMin = 0;
    yMax = 0;

    var range = xMax - xMin;
    var binWidth = range / controls.bins.value;

    for (var i = 0; i < controls.bins.value; i++) {

      var amount = 0;
      var min = sorted[0] + i * binWidth;
      var max = sorted[0] + (i + 1) * binWidth;

      if (i == controls.bins.value - 1) {
        amount += 1;
      }

      for (var j = 0; j < sorted.length; j++) {
        if (sorted[j] >= min && sorted[j] < max) {
          amount += 1;
        }
      }

      if (amount > yMax) yMax = amount;

      plot.addPoint(
        sorted[0] + i * binWidth + binWidth / 2,
        amount
      );
    }



  }
  
  
  w.fit(xMin, xMax, yMin, yMax, 1.1);

  if (mode == "histogram") {
    plot.binWidth = binWidth * w.scaleX.toPx * 0.95;
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
}
