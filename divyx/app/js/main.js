/*
  Video size handling.
  Update top coordinates to show real values.
*/
$(function() {

  // General variables
  var w, h;                             // Canvas width and height
  var c, v, c2;                             // Control and video canvas
  var mouse = {
    pos: {x: 0, y: 0},
    is_down: false,
    is_inside: false
  };
  var state = '';
  var marker_id = 0;
  var go_to_next_frame = false;
  var ruler_id = 0;
  var buttons = {};
  var px_ratio = 0;
  var _background_color = "#f5f5f5";
  var zoom = true;

  function round(num, places) {
    /*
      Rounds a number to a given amount of places.
    */

    return +(Math.round(num + "e+" + places)  + "e-" + places);

  }

  /*

  ############ INIT FUNCTIONS METHODS ############

  */

  function init() {

    getElements();

    timeline.init(c2.ctx);

    axis.init(c.ctx);
    axis.display = false;

    ruler.init(c.ctx);
    ruler.display = false;

    table.init('dataTableBody', 'tableContainer');
    table.onClick(rowClicked)

    buttons.play = new Button('#play', function() { video.play(); });
    buttons.pause = new Button('#pause', function() { video.pause(); });
    buttons.forward = new Button('#forward', function() { video.nextFrame(); });
    buttons.backward = new Button('#backward', function() { video.prevFrame(); });
    buttons.add_marker = new Button('#add_marker', addMarker);
    buttons.delete_marker = new Button('#delete_marker', deleteMarker);
    buttons.set_axis = new Button('#set_axis', setAxis);
    buttons.set_ruler = new Button('#set_ruler', setRuler);
    buttons.export = new Button('#export', exportData);
    buttons.fps = new Button('#set_fps', setFPS);
    buttons.clear = new Button('#clear', clearAll);
    buttons.mute = new Button('#mute', mute);
    buttons.zoom = new Button('#zoom', toggleZoom);

    video.init('bottomCanvas', 'video');
    video.ready(videoLoaded);
    video.onDrawFrame(update);

    markers.init(c.ctx, table);

    $(c2).on('mousedown', function(e) { e.preventDefault(); mouseDown(e); });
    $(c2).on('mouseup', function(e) { e.preventDefault(); mouseUp(e); });
    $(c2).on('mousemove', function(e) { e.preventDefault(); mouseMove(e); });
    $(c2).on('mouseenter', function(e) { e.preventDefault(); mouse.is_inside = true; });
    $(c2).on('mouseleave', function(e) { e.preventDefault(); mouse.is_inside = false; if (video.loaded) drawInfo("mouseleave"); });
    $("input#import").change(function (e) { 
      loadVideo(e.target.files[0]); 
    });
    $(c2).on('drop', function(e) { 
      e.preventDefault();  
      videoDrop(e); 
      e.stopPropagation(); 
    });
    $(c2).on('dragover', function(e) { 
      e.preventDefault();
      displayWaitForFileScreen(true); 
      e.stopPropagation();
    });
    $(c2).on('dragleave', function(e) { 
      e.preventDefault(); 
      if (!video.loaded) { displayWaitForFileScreen(false); } else { c2.ctx.clearRect(0, 0, w, h); update('dragleave'); }
      e.stopPropagation();
    });

    setCanvasSize();

    displayWaitForFileScreen(false);

  }

  function getPixelRatio() {
    /*
      Returns the pixel ratio.
    */

    var devicePixelRatio = window.devicePixelRatio || 1;
    var backingStoreRatio = c.ctx.webkitBackingStorePixelRatio ||
                            c.ctx.mozBackingStorePixelRatio ||
                            c.ctx.msBackingStorePixelRatio ||
                            c.ctx.oBackingStorePixelRatio ||
                            c.ctx.backingStorePixelRatio || 1;
    return devicePixelRatio / backingStoreRatio;

  }

  function getElements() {
    /*
      Gets all elements used in the app and stores them in a variable.
    */

    // Controls canvas
    c = document.getElementById("middleCanvas");
    c.ctx = c.getContext('2d');
    c.container = $(c).parent();

    c2 = document.getElementById("topCanvas");
    c2.ctx = c2.getContext('2d');

    px_ratio = getPixelRatio();

  }

  function setCanvasSize() {
    /*
      Set the size of the canvases.
    */

    // Get new dimensions proportional to 16:9
    w = Math.floor(c.container.width());
    h = Math.floor(9*w/16)+100;

    // Update the canvas size
    c.width = Math.floor(w * px_ratio);
    c.height = Math.floor(h * px_ratio);
    c2.width = c.width;
    c2.height = c.height;

    // Handle HiDPI screens
    if (px_ratio > 1) {
      c.style.width = w + "px";
      c.style.height = h + "px";
      c2.style.width = w + "px";
      c2.style.height = h + "px";
      c.ctx.scale(px_ratio, px_ratio);
      c2.ctx.scale(px_ratio, px_ratio);
    }

    // Set the size of the objects
    video.setSize(w, h, px_ratio);
    axis.setSize(w, h);
    timeline.setSize(w, h);
    table.setHeight(h);

    // Update the container and table sizes
    $("#canvasContainer").css('height', h + 'px');
    $("#dataContainer").css('height', h + 'px');
    $("#tableContainer").css('height', (h - $("#tableExportContainer").outerHeight()) + 'px')

  }

  /*

  ############ TOP CONTROLS ############

  */


  function setAxis() {

    if (video.is_playing) video.pause();

    if (!axis.is_set) {
      buttons.set_axis.disable();
      axis.is_set = true;
      state = 'axis';
      axis.display = false;
    }

    if (axis.display) {
      buttons.set_axis.text("Show Axis");
      axis.display = false;
    } else {
      buttons.set_axis.text("Hide Axis");
      axis.display = true;
    }
    
    buttons.clear.enable();

    updateIfNotPlaying("setaxis");


  }

  function setRuler() {

    if (video.is_playing) video.pause();

    if (!ruler.is_set) {
      buttons.set_ruler.disable();
      ruler_id = 1;
      state = 'ruler';
      ruler.is_set = true;
      ruler.display = false;
    }

    if (ruler.display) {
      buttons.set_ruler.text("Show Ruler");
      ruler.display = false;
    } else {
      buttons.set_ruler.text("Hide Ruler");
      ruler.display = true;
    }

    updateIfNotPlaying("setruler");


  }

  function addMarker() {

    if (video.is_playing) video.pause();
    var frame = video.current_frame;
    marker_id = markers.add(frame, video.inv_fps);
    state = 'marker';
    go_to_next_frame = true;
    updateIfNotPlaying("addmarker");
    video.goToFrame(frame);
    buttons.export.enable();


  }

  function deleteMarker() {

    if (video.is_playing) video.pause();
    var i = markers.getCurrentMarkerId();
    markers.delete();
    if (i > 0) {
      video.goToFrame(markers.getFrame(i-1));
    } else {
      updateIfNotPlaying("deletemarker");
    }
    if (markers.count == 0) {
      buttons.export.disable();
    }

  }

  function setFPS() {

    video.promptFPS();
    markers.recalculate(video.inv_fps);

  }

  function toggleZoom() {

    if (zoom) {
      buttons.zoom.text("Zoom Off");
    } else {
      buttons.zoom.text("Zoom On");
    }
    zoom = !zoom;

  }

  function mute() {

    // $("span", "#mute").toggleClass("glyphicon-volume-off glyphicon-volume-up");

    $("#volume").toggleClass('d-none');
    $("#volume-x").toggleClass('d-none');

    video.toggleMute();

  }

  function clearAll() {
    
    if (confirm("Are you sure you want to clear your DivYX Data?")) {

      // Reset buttons
      buttons.add_marker.disable();
      buttons.delete_marker.disable();
      buttons.set_ruler.disable();
      buttons.set_axis.enable();
      buttons.export.disable();
      buttons.play.disable();
      buttons.pause.disable();
      buttons.forward.disable();
      buttons.backward.disable();
      buttons.export.disable();
      buttons.fps.enable();
      buttons.clear.enable();
      buttons.zoom.enable();
      buttons.zoom.text("Zoom On");
      buttons.set_axis.text("Set Axis");
      buttons.set_ruler.text("Set Ruler");

      // Mute video again
      if (!video.muted) mute();

      // Reset all controls
      state = '';
      zoom = true;
      marker_id = 0;
      go_to_next_frame = false;
      ruler_id = 0;
      video.goToFrame(0);
      axis.clear();
      ruler.clear();
      table.clear();
      markers.clear();
      timeline.clear();
      update();

    }
    
  }

  /*

  ############ EVENTS ############

  */

  function rowClicked(frame) {
    
    video.goToFrame(frame);
  
  }

  function mouseDown(event) {
  
    mouse.is_down = true;
  
  }

  function mouseUp(event) {

    if (state === 'marker') {

      state = '';
      if (go_to_next_frame) {
        video.nextFrame();
        go_to_next_frame = false;
      } else {
        updateIfNotPlaying("mouseup-setmarker");
      }


    } else if (state === 'axis') {

      buttons.set_axis.enable();
      buttons.set_ruler.enable();
      markers.recalculate(video.inv_fps);
      state = '';

    } else if (state === 'ruler') {

      if (!ruler.p1.is_set) {
        ruler.p1.is_set = true;
        ruler_id = 2;
        ruler.set(ruler_id, mouse.pos.x, mouse.pos.y);
      } else {
        ruler.p2.is_set = true;
        ruler_id = 0;
        state = '';
        if (!markers.isMarkerOnFrame(video.current_frame)) buttons.add_marker.enable();
        if (ruler.length == 0) {
          buttons.set_ruler.enable();
          updateRulerLength(false);
          markers.setScale(ruler.getScale());
        }
        markers.recalculate(video.inv_fps);
      }

    } else if (state === 'timeline') {

      state = '';

    } else if (state === '') {

      if (timeline.isMouseOn(mouse.pos.x, mouse.pos.y)) {
        if (video.is_playing) video.pause();
        video.goToNearestFrame(video.total_time * (mouse.pos.x/w));
      } else if (ruler.isMouseOnLength(mouse.pos.x, mouse.pos.y)) {
        updateRulerLength(true);
      } else {
        var target = markers.isMouseOn(mouse.pos.x, mouse.pos.y);
        if (target >= 0) {
          if (markers.getFrame(target) != video.current_frame) video.goToFrame(markers.getFrame(target));
        }
      }

    }

    mouse.is_down = false;
    if (video.loaded) update('mouseup');

  }

  function mouseMove(event) {

    // Get the mouse position
    // if (!e) var e = event;
    var rect = c.getBoundingClientRect();
    mouse.pos.x = Math.floor((event.clientX || event.offsetX) - rect.left);
    mouse.pos.y = Math.floor((event.clientY || event.offsetY) - rect.top);

    var mouse_on_axis = axis.isMouseOn(mouse.pos.x, mouse.pos.y);
    var mouse_on_marker = markers.isMouseOn(mouse.pos.x, mouse.pos.y);
    var mouse_on_ruler = ruler.isMouseOn(mouse.pos.x, mouse.pos.y);
    var mouse_on_timline = timeline.isMouseOn(mouse.pos.x, mouse.pos.y);
    var mouse_on_ruler_length = ruler.isMouseOnLength(mouse.pos.x, mouse.pos.y);

    if (mouse_on_axis || mouse_on_timline || mouse_on_ruler_length || mouse_on_marker > -1 || mouse_on_ruler > 0 || state != '') {
      c2.style.cursor = 'pointer';
    } else {
      c2.style.cursor = 'default';
    }

    if (state === 'marker') {
      markers.set(marker_id, mouse.pos.x, mouse.pos.y);
    } else if (state === 'axis') {
      axis.set(mouse.pos.x, mouse.pos.y);
      markers.setZero(axis.x, axis.y);
    } else if (state === 'ruler') {
      ruler.set(ruler_id, mouse.pos.x, mouse.pos.y);
      markers.setScale(ruler.getScale());
    } else if (state === 'timeline') {
      video.goToNearestFrame(video.total_time * (mouse.pos.x/w));
    }

    if (mouse.is_down && state == '') {
      if (mouse_on_axis) {
        state = 'axis';
      } else if (mouse_on_marker > -1) {
        if (markers.getFrame(mouse_on_marker) != video.current_frame) video.goToFrame(markers.getFrame(mouse_on_marker));
        state = 'marker';
        marker_id = mouse_on_marker;
      } else if (mouse_on_ruler > 0) {
        state = 'ruler';
        ruler_id = mouse_on_ruler;
      } else if (mouse_on_timline) {
        state = 'timeline';
      }
    }

    if (state != '') {
      updateIfNotPlaying("mousemove");
    } else {
      if (video.loaded) drawInfo("mousemove");
    }

  }

  function videoDrop(e) {

    if (e.originalEvent.dataTransfer) {
      
      if (e.originalEvent.dataTransfer.files.length) {

        var loaded = false;
        for (var i = 0; i < e.originalEvent.dataTransfer.files.length; i++) {
          if (e.originalEvent.dataTransfer.files[i].type.match(/video.mp4/)) {
            loaded = true;
            loadVideo(e.originalEvent.dataTransfer.files[0]);
            break;
          }
        }

        if (!loaded) {
          alert("No .mp4 file was found.");
          displayWaitForFileScreen();
        }

      }   
    
    }

  }

  function loadVideo(file) {

    if (file) {

      // Reset
      reset();

      // Display loading screen
      displayLoadingScreen(file.name);

      // Read file and create a url
      var url = URL.createObjectURL(file);

      // Reload the video object
      video.reload(url);

    }

  }

  function videoLoaded() {

    video.setSize(w, h, px_ratio);

    c2.ctx.clearRect(0, 0, w, h);

    buttons.set_axis.enable();
    buttons.fps.enable();
    buttons.mute.enable();
    buttons.zoom.enable();

  }

  /*

  ############ GENERAL FUNCTIONS ############

  */

  function reset() {

    // Reset buttons
    buttons.add_marker.disable();
    buttons.delete_marker.disable();
    buttons.set_ruler.disable();
    buttons.set_axis.disable();
    buttons.export.disable();
    buttons.play.disable();
    buttons.pause.disable();
    buttons.forward.disable();
    buttons.backward.disable();
    buttons.export.disable();
    buttons.fps.disable();
    buttons.clear.disable();
    buttons.zoom.disable();
    buttons.zoom.text("Zoom On");
    buttons.set_axis.text("Set Axis");
    buttons.set_ruler.text("Set Ruler");

    // Mute video again
    if (!video.muted) mute();

    // Reset all controls
    state = '';
    marker_id = 0;
    go_to_next_frame = false;
    ruler_id = 0;
    zoom = true;
    video.loaded = false;
    axis.clear();
    ruler.clear();
    table.clear();
    markers.clear();
    timeline.clear();

  }


  function exportData() {

    if (buttons.export.isEnabled()) {

      debugger;
      var date = new Date();
      var components = [
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      ];
      var filename = "divyx_log_" + components.join("_") + ".csv";
      var data = "Created with DivYX 3.1,,,\r\n" + markers.export();
      $(buttons.export.get()).attr({
        'download': filename,
        'href': 'data:application/csv;charset=utf-8,' + encodeURIComponent(data),
        'target': '_blank'
      });

    }

  }

  function updateIfNotPlaying(from) {

    if (!video.is_playing && video.loaded) {
      update(from);
    }

  }

  function displayWaitForFileScreen(state) {
    
    if (state) {
    // File is hovering the canvas

      c2.ctx.fillStyle = "#f5f5f5";
      c2.ctx.fillRect(0, 0, w, h);

      c2.ctx.strokeStyle = "#ddd";
      c2.ctx.lineWidth = 2;
      c2.ctx.strokeRect(0, 0, w, h);

      c2.ctx.textAlign = "center";
      c2.ctx.textBaseline = "middle";
      c2.ctx.font = "18px Arial";
      var text = "Drop .mp4 file here...";
      c2.ctx.fillStyle = "#777";
      c2.ctx.fillText(text, w/2, h/2);

    } else {
    // No file is hovering the canvas

      c2.ctx.fillStyle = "#fff";
      c2.ctx.fillRect(0, 0, w, h);

      c2.ctx.strokeStyle = "#ddd";
      c2.ctx.lineWidth = 2;
      c2.ctx.strokeRect(0, 0, w, h);

      c2.ctx.textAlign = "center";
      c2.ctx.textBaseline = "middle";
      c2.ctx.font = "18px Arial";
      var text = "Drag and drop an .mp4 file here...";
      c2.ctx.fillStyle = "#777";
      c2.ctx.fillText(text, w/2, h/2);

      c2.ctx.textAlign = "left";
      c2.ctx.textBaseline = "middle";
      c2.ctx.font = "14px Arial";
      var text = "Don't worry! No video is uploaded to the website. The site runs completly on your computer.";
      c2.ctx.fillStyle = "#999";
      c2.ctx.fillText(text, 18, h-30);
    
    }

  }

  function displayLoadingScreen(filename) {

    // Draw black screen to cover the frame jumps
    c2.ctx.fillStyle = _background_color;
    c2.ctx.fillRect(0, 0, w, h);
    c2.ctx.strokeStyle = "#ddd";
    c2.ctx.strokeRect(0, 0, w, h);
    c2.ctx.textAlign = "center";
    c2.ctx.textBaseline = "middle";
    c2.ctx.font = "18px Arial";
    c2.ctx.fillStyle = "#666";
    var text = "Loading " + filename;
    c2.ctx.fillText(text, w/2, h/2);

  }

  function updateRulerLength(recalculate) {
   
    ruler.promptLength();
    if (recalculate) {
      markers.setScale(ruler.getScale());
      markers.recalculate(video.inv_fps);
    }
    updateIfNotPlaying("updateruler");
  
  }

  function drawInfo(from) {
    /*
      Draw info on the top of the screen.
    */

    // console.log("DRAW: INFO - " + from);

    c2.ctx.clearRect(0, 0, w, 22);

    // Set styling and clear everything
    var text = "";
    c2.ctx.font = "12px Arial";
    c2.ctx.textBaseline = "top";
    c2.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    c2.ctx.fillRect(0, 0, w, 22);
    c2.ctx.fillStyle = "#f5f5f5";

    // Left text
    c2.ctx.textAlign = "left";
    if (mouse.is_inside) {
      text = "x: " + markers.getRealX(mouse.pos.x) + " y: " + markers.getRealY(mouse.pos.y);
      // text = "x: " + Math.round(mouse.pos.x-axis.x) + " y: " + Math.round(axis.y-mouse.pos.y);
    } else {
      text = "x: 0 y: 0";
    }
    c2.ctx.fillText(text, 10, 5);

    // Middle text
    c2.ctx.textAlign = "center";
    text = video.current_frame + " / " + video.total_frames;
    c2.ctx.fillText(text, w/2-c2.ctx.measureText(text).width/2+20, 5);

    // Right text
    c2.ctx.textAlign = "right";
    text = "FPS: " + video.fps;
    c2.ctx.fillText(text, w-10, 5);

  }

  function update(from) {

    
    c.ctx.clearRect(0, 0, w, h);

    if ((state == 'axis' || state == 'ruler' || state == 'marker') && (mouse.is_inside && zoom)) {
      var sample_size = 15; // Size to crop
      var zoom_size = 80; // Zoomed image size
      var cross = 7;  // Pixes in length of the cross
      var margin = 15; // Separation from the pointer
      var zoom_x0, zoom_y0;
      if (mouse.pos.x + margin + zoom_size > w) {
        zoom_x0 = mouse.pos.x - margin - zoom_size;
      } else {
        zoom_x0 = mouse.pos.x + margin;
      }
      if (mouse.pos.y + margin + zoom_size > h) {
        zoom_y0 = mouse.pos.y - margin - zoom_size;
      } else {
        zoom_y0 = mouse.pos.y + margin;
      }
      c.ctx.drawImage(video._canvas, Math.abs(mouse.pos.x - sample_size/2), Math.abs(mouse.pos.y - sample_size/2), sample_size, sample_size, zoom_x0, zoom_y0, zoom_size, zoom_size)
      c.ctx.beginPath();
      switch (state) {
        case 'axis': c.ctx.strokeStyle = "magenta"; break;
        case 'ruler': c.ctx.strokeStyle = "cyan"; break;
        case 'marker': c.ctx.strokeStyle = "red"; break;
      }
      c.ctx.moveTo(zoom_x0 + zoom_size/2 - cross, zoom_y0 + zoom_size/2);
      c.ctx.lineTo(zoom_x0 + zoom_size/2 + cross, zoom_y0 + zoom_size/2);
      c.ctx.moveTo(zoom_x0 + zoom_size/2, zoom_y0 + zoom_size/2 - cross);
      c.ctx.lineTo(zoom_x0 + zoom_size/2, zoom_y0 + zoom_size/2 + cross);
      c.ctx.closePath();
      c.ctx.stroke();
      c.ctx.strokeStyle = "#666";
      c.ctx.strokeRect(zoom_x0, zoom_y0, zoom_size, zoom_size);

    }
    
    axis.update();
    ruler.update();
    markers.update(video.current_frame);

    drawInfo("Update - " + from + " State - " + state);

    if (state == 'marker') {

      buttons.forward.disable();
      buttons.backward.disable();
      buttons.play.disable();
      buttons.pause.disable();

      timeline.hide();

    } else {

      timeline.show();

      if (video.current_frame == 0) {
        buttons.forward.enable();
        buttons.backward.disable();
        timeline.update(0);
      } else if (video.current_frame == video.total_frames) {
        buttons.forward.disable();
        buttons.backward.enable();
        timeline.update(1);
      } else {
        buttons.forward.enable();
        buttons.backward.enable();
        timeline.update(video.current_time/video.total_time);
      }

      if (video.is_playing) {
        buttons.play.disable();
        buttons.pause.enable();
      } else {
        buttons.play.enable();
        buttons.pause.disable();
      }

    }

    if (ruler.p1.is_set && ruler.p2.is_set) {
      if (markers.isMarkerOnFrame()) {
        buttons.add_marker.disable();
        buttons.delete_marker.enable();
      } else {
        buttons.add_marker.enable();
        buttons.delete_marker.disable();
      }
    }

  }

  init();

});
