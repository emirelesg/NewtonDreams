// Constants
var ZMIN = -7;          // Start of the normal distribution.
var ZMAX = 7;           // End of the normal distribution.
var STEP = 0.01;        // Step made every interation.
var MU = 0;             // Distribution mean.
var SIGMA = 1;          // Distribution standard deviation.
var CDF_Z_MIN = -4;     // Start of the precalculated area table.
var CDF = [             // Area under the normal distribution from -4 to 0 in steps of 0.01.
    0.000032, 
    0.000033, 0.000034, 0.000036, 0.000037, 0.000039, 0.000041, 0.000042, 0.000044, 0.000046, 0.000048, 
    0.000050, 0.000052, 0.000054, 0.000057, 0.000059, 0.000062, 0.000064, 0.000067, 0.000069, 0.000072, 
    0.000075, 0.000078, 0.000082, 0.000085, 0.000088, 0.000092, 0.000096, 0.000100, 0.000104, 0.000108, 
    0.000112, 0.000117, 0.000121, 0.000126, 0.000131, 0.000136, 0.000142, 0.000147, 0.000153, 0.000159, 
    0.000165, 0.000172, 0.000178, 0.000185, 0.000193, 0.000200, 0.000208, 0.000216, 0.000224, 0.000233, 
    0.000242, 0.000251, 0.000260, 0.000270, 0.000280, 0.000291, 0.000302, 0.000313, 0.000325, 0.000337, 
    0.000349, 0.000362, 0.000376, 0.000390, 0.000404, 0.000419, 0.000434, 0.000450, 0.000466, 0.000483, 
    0.000501, 0.000519, 0.000538, 0.000557, 0.000577, 0.000598, 0.000619, 0.000641, 0.000664, 0.000687, 
    0.000711, 0.000736, 0.000762, 0.000789, 0.000816, 0.000845, 0.000874, 0.000904, 0.000935, 0.000968, 
    0.001001, 0.001035, 0.001070, 0.001107, 0.001144, 0.001183, 0.001223, 0.001264, 0.001306, 0.001350, 
    0.001395, 0.001441, 0.001489, 0.001538, 0.001589, 0.001641, 0.001695, 0.001750, 0.001807, 0.001866, 
    0.001926, 0.001988, 0.002052, 0.002118, 0.002186, 0.002256, 0.002327, 0.002401, 0.002477, 0.002555, 
    0.002635, 0.002718, 0.002803, 0.002890, 0.002980, 0.003072, 0.003167, 0.003264, 0.003364, 0.003467, 
    0.003573, 0.003681, 0.003793, 0.003907, 0.004025, 0.004145, 0.004269, 0.004396, 0.004527, 0.004661, 
    0.004799, 0.004940, 0.005085, 0.005234, 0.005386, 0.005543, 0.005703, 0.005868, 0.006037, 0.006210, 
    0.006387, 0.006569, 0.006756, 0.006947, 0.007143, 0.007344, 0.007549, 0.007760, 0.007976, 0.008198, 
    0.008424, 0.008656, 0.008894, 0.009137, 0.009387, 0.009642, 0.009903, 0.010170, 0.010444, 0.010724, 
    0.011011, 0.011304, 0.011604, 0.011911, 0.012224, 0.012545, 0.012874, 0.013209, 0.013553, 0.013903, 
    0.014262, 0.014629, 0.015003, 0.015386, 0.015778, 0.016177, 0.016586, 0.017003, 0.017429, 0.017864, 
    0.018309, 0.018763, 0.019226, 0.019699, 0.020182, 0.020675, 0.021178, 0.021692, 0.022216, 0.022750, 
    0.023295, 0.023852, 0.024419, 0.024998, 0.025588, 0.026190, 0.026803, 0.027429, 0.028067, 0.028717, 
    0.029379, 0.030054, 0.030742, 0.031443, 0.032157, 0.032884, 0.033625, 0.034380, 0.035148, 0.035930, 
    0.036727, 0.037538, 0.038364, 0.039204, 0.040059, 0.040930, 0.041815, 0.042716, 0.043633, 0.044565, 
    0.045514, 0.046479, 0.047460, 0.048457, 0.049471, 0.050503, 0.051551, 0.052616, 0.053699, 0.054799, 
    0.055917, 0.057053, 0.058208, 0.059380, 0.060571, 0.061780, 0.063008, 0.064255, 0.065522, 0.066807, 
    0.068112, 0.069437, 0.070781, 0.072145, 0.073529, 0.074934, 0.076359, 0.077804, 0.079270, 0.080757, 
    0.082264, 0.083793, 0.085343, 0.086915, 0.088508, 0.090123, 0.091759, 0.093418, 0.095098, 0.096800, 
    0.098525, 0.100273, 0.102042, 0.103835, 0.105650, 0.107488, 0.109349, 0.111232, 0.113139, 0.115070, 
    0.117023, 0.119000, 0.121000, 0.123024, 0.125072, 0.127143, 0.129238, 0.131357, 0.133500, 0.135666, 
    0.137857, 0.140071, 0.142310, 0.144572, 0.146859, 0.149170, 0.151505, 0.153864, 0.156248, 0.158655, 
    0.161087, 0.163543, 0.166023, 0.168528, 0.171056, 0.173609, 0.176186, 0.178786, 0.181411, 0.184060, 
    0.186733, 0.189430, 0.192150, 0.194895, 0.197663, 0.200454, 0.203269, 0.206108, 0.208970, 0.211855, 
    0.214764, 0.217695, 0.220650, 0.223627, 0.226627, 0.229650, 0.232695, 0.235762, 0.238852, 0.241964, 
    0.245097, 0.248252, 0.251429, 0.254627, 0.257846, 0.261086, 0.264347, 0.267629, 0.270931, 0.274253, 
    0.277595, 0.280957, 0.284339, 0.287740, 0.291160, 0.294599, 0.298056, 0.301532, 0.305026, 0.308538, 
    0.312067, 0.315614, 0.319178, 0.322758, 0.326355, 0.329969, 0.333598, 0.337243, 0.340903, 0.344578, 
    0.348268, 0.351973, 0.355691, 0.359424, 0.363169, 0.366928, 0.370700, 0.374484, 0.378280, 0.382089, 
    0.385908, 0.389739, 0.393580, 0.397432, 0.401294, 0.405165, 0.409046, 0.412936, 0.416834, 0.420740, 
    0.424655, 0.428576, 0.432505, 0.436441, 0.440382, 0.444330, 0.448283, 0.452242, 0.456205, 0.460172, 
    0.464144, 0.468119, 0.472097, 0.476078, 0.480061, 0.484047, 0.488034, 0.492022, 0.496011, 0.500000
  ];

// Variables

// p$ Objects
var w;
var dc = new p$.DataCursor();
var plot = new p$.Plot({ limit: 1000, drawInvisiblePoints: true });
var shade = new p$.Plot({ limit: 1000, drawInvisiblePoints: true, shade: true, shadeColor: p$.utils.rgbToRgba(p$.COLORS.RED, 0.15) })
var box = new p$.Box( { debug: false, title: "Resultados", isDraggable: false } );
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
  w.scaleX.set(50, 0.5, "");
  w.scaleY.set(50, -0.1, "");
  w.axis.outsideNumbers = false;
  w.axis.draggable(false);

  // Configure box and labels.
  labels.area = box.addLabel(110, 14, { name: "Área", units: "", decPlaces: 5, labelWidth: 60, fixPlaces: true });
  labels.area.setPosition(0, 25);
  box.calculateDimensions();

  // Add plots to data cursor.
  dc.add(plot);

  // Add objects to world.
  w.add(plot, shade, dc, box);

  // Calculate the probability density function for the normal distribution.
  plot.clear();
  for (var z = ZMIN; z <= ZMAX; z += STEP) {
    var pdf = (1 / (SIGMA * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow(((z - MU) / SIGMA), 2));
    plot.points.push([z, pdf]);
  }

}

/**
 * Setup DOM elements.
 */
function setupControls() {

  // Configure sliders.
  controls.z = new p$.Slider({ id: "z", start: 0, min: -3, max: 3, decPlaces: 2, units: "", callback: reset });
  controls.tail = new p$.dom.Options("tail", reset);

}

/**
 * Calculate the area under the curve for a given z value.
 */
function cdf(z) {
  // Calculate the index for the z value that 
  var idx = Math.floor((z - CDF_Z_MIN) / STEP);
  if (idx > CDF.length - 1) return 1 - cdf(-z);
  return CDF[idx];
}

/**
 * Set the initial state of all variables.
 * Called when any slider changes values.
 */
function reset() {

  // Matches the x value to the index in the points array.
  var idx = Math.floor((controls.z.value - ZMIN) / STEP);

  // Select the correct tail.
  if (controls.tail.value === 'left') {
    
    // Left
    // Selects the left section from the PDF.
    shade.points = plot.points.slice(0, idx + 1);
    shade.displayUntil = idx;

    // Calculate area.
    // Subtract 1, from the area since the cdf array is shifted by 1.
    labels.area.set(cdf(controls.z.value));
    
  } else {
 
    // Right
    // Selects the right section from the PDF.
    shade.points = plot.points.slice(idx);
    shade.displayUntil = -1;

    // Calculate area.
    // Subtract 1, from the area since the cdf array is shifted by 1.
    labels.area.set(1 - cdf(controls.z.value));

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
    w.axis.setPosition(w.width / 2, w.height);
    box.setPosition(20, 20);
    if (w.width < 500) {
      w.scaleX.set(50, 1, "");
    } else {
      w.scaleX.set(50, 0.5, "");      
    }
}
