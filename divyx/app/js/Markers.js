var markers = {
  r: 5,
  display_limit: 10,
  count: 0,
  _t0: 0,
  _t0_set: false,
  _inv_fps: 0,
  _zero_x: 0,
  _zero_y: 0,
  _scale: 1,
  _obj: [],
  _ctx: undefined,
  _table: undefined,
  _current_marker: -1
};

/*

  ############ PUBLIC METHODS ############

*/

markers.clear = function() {
  /*
    Clear all the markers in the video.
  */

  this._t0_set = false;
  this._t0 = 0;
  this._obj = [];
  this._current_marker = -1;

}

markers.init = function(ctx, table) {
  /*
    Initialize the marker object.
  */

  this._ctx = ctx;
  this._table = table;

}

markers.add = function(frame, inv_fps) {
  /*
    Add a point to the list. The list is sorted by frame number.
  */

  // Save the fps
  this._inv_fps = inv_fps;

  // Save the first time as t0
  if (!this._t0_set) {
    this._t0_set = true;
    this._t0 = Math.round(frame * this._inv_fps*10000)/10000;
  }

  var p = {
    x: 0,
    y: 0,
    real_x: 0,
    real_y: 0,
    frame: frame,
    time: Math.round((frame * this._inv_fps - this._t0) * 10000)/10000,
    display: false
  };

  // Calculate where to insert the point in the list and insert it
  for (var i = 0; i < this._obj.length; i++) if (this._obj[i].frame > frame) break;
  this._obj.splice(i, 0, p);
  
  // Add to table
  this._table.add(i, p);

  // Return the id of the element
  this.count++;

  // If it is inserted at the start recalculate everything
  if (i == 0) this.recalculate(this._inv_fps);

  return i;

}

markers.delete = function() {
  /*
    Delete the current marker.
  */

  if (this._current_marker >= 0) {
    this.count--;
    this._table.delete(this._current_marker);
    this._obj.splice(this._current_marker, 1);
    this._current_marker = -1;
  }

  if (this.count > 0) {

    // If there are more elements then change t0
    this.recalculate(this._inv_fps);

  } else {
    
    // If there are no more elements reset t0
    this._t0_set = false;

  }

}

markers.update = function(frame) {
  /*
    Determine which points should be displayed depending on the current frame.
  */

  this._current_marker = -1;
  var highest = 0;
  var draw = false;
  for (var i = 0; i < this._obj.length; i++) {

    // Reset all objects display property
    this._obj[i].display = false;

    // Get the id of the marker that corresponds to the frame
    if (this._obj[i].frame == frame) {
      this._current_marker = i;
      this._table.select(this._current_marker);
    }

    // Get the id from the highest frame that can be displayed before the current frame
    if (this._obj[i].frame <= frame) {
      highest = i;
      draw = true;
    }
  }

  // No marker found, deselect row
  if (this._current_marker == -1) this._table.deselect();

  // Display 10 items before the highest frame
  if (draw) {
    this._setStyling();
    var lim = ((highest-(this.display_limit-1))>0) ? (highest-(this.display_limit-1)) : 0;
    for (var j = highest; j >= lim; j--) {
      this._obj[j].display = true;
      this._draw(j);
    }
  }

}

markers.isMarkerOnFrame = function() {
  /*
    Return true if there is a marker of the current frame.
  */

  if (this._current_marker > -1) {
    return true;
  } else {
    return false;
  }

}

markers.isMouseOn = function(x, y) {
  /*
    Return true if the mouse is on top of any marker.
  */

  for (var i = 0; i < this._obj.length; i++) {
    if (Math.abs(this._obj[i].x - x) <= this.r && Math.abs(this._obj[i].y - y) <= this.r && this._obj[i].display) {
      return i;
    }
  }
  return -1;

}

markers.getRealX = function(x) {
  /*
    Returns the real position of the x coordinate.
  */

  return Math.round((x-this._zero_x) * this._scale * 10000) / 10000;

}

markers.getRealY = function(y) {
  /*
    Returns the real position of the y coordinate.
  */

  return Math.round((this._zero_y-y) * this._scale * 10000) / 10000;
  
}

markers.set = function(i, x, y) {
  /*
    Set the position of a marker.
  */

  // Update marker position
  this._obj[i].x = x;
  this._obj[i].y = y;

  // Recalculate the time
  this._obj[i].time = Math.round((this._obj[i].frame * this._inv_fps - this._t0) * 10000)/10000;

  // Calculate the real marker position
  this._obj[i].real_x = this.getRealX(x);
  this._obj[i].real_y = this.getRealY(y);

  // Update the table
  this._table.update(i, this._obj[i]);

}

markers.setZero = function(x, y) {
  /*
    Set the zero coordinate for the points.
  */

  this._zero_x = x;
  this._zero_y = y;

}

markers.setScale = function(k) {
  
  // Set the conversion factor between px and real units.
  

  this._scale = k || 1;

}

markers.getFrame = function(i) {
  /*
    Get the frame of a specific marker.
  */

  return this._obj[i].frame;

}

markers.getCurrentMarkerId = function(i) {
  /*
    Return the id of the current marker.
  */

  return this._current_marker;

}

markers.recalculate = function(inv_fps) {
  /*
    Recalculate the real position of all points.
  */

  this._inv_fps = inv_fps;
  for (var i = 0; i < this._obj.length; i++) {
    if (i == 0) this._t0 = Math.round(this._obj[0].frame * this._inv_fps * 10000)/10000;
    this.set(i, this._obj[i].x, this._obj[i].y);
  }

}

markers.export = function() {
  /*
    Return an string ready to be written to a csv file.
  */

  var arr = ["t,x,t,y"];
  for (var i = 0; i < this._obj.length; i++) {
    arr.push(this._obj[i].time + "," + this._obj[i].real_x + "," + this._obj[i].time + "," + this._obj[i].real_y);
  }
  return arr.join("\r\n");

}

/*

  ############ PRIVATE METHODS ############

*/

markers._setStyling = function() {
  /*
    Default styling for all points.
  */

  this._ctx.lineWidth = 2;
  this._ctx.font = "14px Arial";
  this._ctx.textAlign = "right";
  this._ctx.textBaseline = "middle";
  this._ctx.fillStyle = "#FF0000";
  this._ctx.strokeStyle = "#FF0000";

}

markers._draw = function(index) {
  /*
    Draw a point in the canvas.
  */

  var p = this._obj[index];

  // If it is selected draw a cross, if not draw a rhombus
  this._ctx.beginPath();
  if (index == this._current_marker) {
    this._ctx.moveTo(p.x, p.y-this.r);
    this._ctx.lineTo(p.x, p.y+this.r);
    this._ctx.moveTo(p.x-this.r, p.y);
    this._ctx.lineTo(p.x+this.r, p.y);
  } else {
    this._ctx.moveTo(p.x, p.y-this.r);
    this._ctx.lineTo(p.x+this.r, p.y);
    this._ctx.lineTo(p.x, p.y+this.r);
    this._ctx.lineTo(p.x-this.r, p.y);
  }
  this._ctx.closePath();
  this._ctx.stroke();

  // Draw the id of the point
  this._ctx.fillText(p.frame, p.x-this.r-3, p.y-this.r*2);

}
