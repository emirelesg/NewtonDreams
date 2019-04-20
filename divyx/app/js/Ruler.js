var ruler = {
  p1: {x: 0, y:0, is_set: false},
  p2: {x: 0, y:0, is_set: false},
  display: true,
  is_set: false,
  _length_pos: {x: 0, y: 0, w: 0, t: 0},
  _ctx: undefined,
  _dist: 0,
  length: 0,
  _r: 5
};

/*

  ############ PUBLIC METHODS ############

*/

ruler.clear = function(ctx) {
  /*
    Reset the ruler to its start state.
  */

  this.p1 = {x: 0, y:0, is_set: false};
  this.p2 = {x: 0, y:0, is_set: false};
  this.is_set = false;
  this.length = 0;

}

ruler.init = function(ctx) {
  /*
    Initialize the ruler object.
  */

  this._ctx = ctx;

}

ruler.update = function() {
  /*
    Draws a cross at the end of the line or ruler.
  */

  if (this.display) {

    // Set Styling
    this._setStyling();

    // Draw the first point
    this._ctx.beginPath();
    this._ctx.moveTo(this.p1.x, this.p1.y-this._r);
    this._ctx.lineTo(this.p1.x, this.p1.y+this._r);
    this._ctx.moveTo(this.p1.x-this._r, this.p1.y);
    this._ctx.lineTo(this.p1.x+this._r, this.p1.y);

    if (this.p1.is_set || this.p2.is_set) {

      // Draw the second point
      this._ctx.moveTo(this.p2.x, this.p2.y-this._r);
      this._ctx.lineTo(this.p2.x, this.p2.y+this._r);
      this._ctx.moveTo(this.p2.x-this._r, this.p2.y);
      this._ctx.lineTo(this.p2.x+this._r, this.p2.y);
      this._ctx.moveTo(this.p1.x, this.p1.y);
      this._ctx.lineTo(this.p2.x, this.p2.y);

      // Close drawing
      this._ctx.stroke();
      this._ctx.closePath();

      // Draw the length of the ruler
      if (this.length != 0) {

        // Calculate the middle point of the line and the angle theta of the line
        // in radians
        var dy = this.p2.y-this.p1.y;
        var dx = this.p2.x-this.p1.x;
        var middle_x = this.p1.x+dx/2;
        var middle_y = this.p1.y+dy/2;
        var theta = Math.atan(dy/dx);
        var h = -15;

        // Calculate the position of the text
        var beta = Math.PI/2 - theta;
        this._length_pos.x = middle_x-h*Math.cos(beta);
        this._length_pos.y = middle_y+h*Math.sin(beta);
        this._length_pos.w = this._ctx.measureText(this.length).width;

        // Rotate the canvas to draw the text parallel to it
        this._ctx.save();
        this._ctx.translate(middle_x, middle_y);
        this._ctx.rotate(theta);
        this._ctx.fillText(this.length, 0, h);
        this._ctx.restore();

      }

    } else {

      // Close drawing
      this._ctx.stroke();
      this._ctx.closePath();

    }

  }

};

ruler.isMouseOn = function(x, y) {
  /*
    Return 1 if mouse is on top of point 1, return 2 if it is on top of point 2
  */

  if (Math.abs(this.p1.x - x) <= this._r && Math.abs(this.p1.y - y) <= this._r && this.display) {
    return 1;
  } else if (Math.abs(this.p2.x - x) <= this._r && Math.abs(this.p2.y - y) <= this._r && this.display) {
    return 2;
  } else {
    return 0;
  }

}

ruler.isMouseOnLength = function(x, y) {
  /*
    Return true if the mouse is on top of the length.
  */

  return this.display && Math.abs(this._length_pos.x - x) < this._length_pos.w/2 && Math.abs(this._length_pos.y - y) < this._length_pos.w/2;

}

ruler.set = function(i, x, y) {
  /*
    Set the position of the points depending on the id.
  */

  if (i == 1) {
    this.p1.x = x;
    this.p1.y = y;
  } else if (i == 2) {
    this.p2.x = x;
    this.p2.y = y;
  }

}

ruler.getScale = function() {
  /*
    Return the conversion factor between px and mag.
  */

  this._dist = Math.sqrt(Math.pow(this.p2.x-this.p1.x, 2) + Math.pow(this.p2.y-this.p1.y, 2));
  return this.length/this._dist;

}

ruler.promptLength = function() {
  /*
    Ask the user to enter the ruler magnitude. Make sure it is a number and gt 0.
  */

  var placeholder = (this.length > 0) ? this.length : 100;
  var l = prompt("Please enter the ruler length", placeholder) || placeholder;
  while (!$.isNumeric(l) || l <= 0) {
    l = prompt("Please enter a valid ruler length", "100") || placeholder;
  }
  this.length = l;

}

/*

  ############ PRIVATE METHODS ############

*/

ruler._setStyling = function() {
  /*
    Default styling for the ruler.
  */

  this._ctx.lineWidth = 2;
  this._ctx.strokeStyle = "#00DFFF";
  this._ctx.fillStyle = "#00DFFF";
  this._ctx.font = "16px Arial";
  this._ctx.textAlign = "center";
  this._ctx.textBaseline = "middle";
}
