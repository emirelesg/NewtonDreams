var axis = {
  x: -1,
  y: -1,
  display: true,
  is_set: false,
  _ctx: undefined,
  _w: 0,
  _h: 0
};

/*

  ############ PUBLIC METHODS ############

*/

axis.clear = function() {
  /*
    Reset the axis.
  */

  this.x = -1;
  this.y = -1;
  this.is_set = false;

}

axis.init = function(ctx) {
  /*
    Initialize the axis object.
  */

  this._ctx = ctx;

}

axis.setSize = function(w, h) {
  /*
    Set the drawing size of the axis.
  */

  this._w = w;
  this._h = h;

}

axis.isMouseOn = function(x, y) {
  /*
    Return true if the mouse is on top of the axis.
  */

  return (Math.abs(this.x - x) <= 5 && Math.abs(this.y - y) <= 5 && this.display);

}

axis.set = function(x, y) {
  /*
    Update the position of the axis.
  */

  this.x = x;
  this.y = y;

}

axis.update = function() {
  /*
    Draw the axis.
  */

  if (this.display && this.x != -1 && this.y != -1) {
    this._setStyling();
    this._ctx.beginPath();
    this._ctx.moveTo(this.x, 0);
    this._ctx.lineTo(this.x, this._h);
    this._ctx.moveTo(0, this.y);
    this._ctx.lineTo(this._w, this.y);
    this._ctx.closePath();
    this._ctx.stroke();
  }

}

/*

  ############ PRIVATE METHODS ############

*/

axis._setStyling = function() {
  /*
    Default styling for the axis.
  */

  this._ctx.lineWidth = 2;
  this._ctx.strokeStyle = "magenta";

}
