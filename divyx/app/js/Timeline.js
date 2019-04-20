var timeline = {
  h: 0,
  _max_h: 15,
  _w: 0,
  _h: 0,
  _ctx: undefined,
  _k: 0
};

/*

  ############ PUBLIC METHODS ############

*/

timeline.clear = function() {
  /*
    Clear the timeline.
  */

  this.h = 0;
  this._k = 0;
  this.update(0, true);

}

timeline.init = function(ctx) {
  /*
    Initialize the timeline object.
  */

  this._ctx = ctx;

}

timeline.setSize = function(w, h) {
  /*
    Save the size of the canvas.
  */

  this._w = w;
  this._h = h;

}

timeline.update = function(k, force) {
  /*
    Draw the timeline.
  */

  // Style 1
  if (this._k != k && k != undefined || force) {
    this._k = k;
    this._ctx.clearRect(0, this._h - this._max_h, this._w, this._h);
    this._ctx.fillStyle = '#b32d3a';
    this._ctx.fillRect(0, this._h - this.h, Math.floor(this._w * this._k), this.h);
    this._ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this._ctx.fillRect(Math.floor(this._w * this._k), this._h - this.h, this._w, this.h);
  }

  // Style 2
  // if (this._k != k && k != undefined || force) {
  //   this._k = k;
  //   this._ctx.clearRect(0, this._h - this._max_h, this._w, this._h);
  //   this._ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  //   this._ctx.fillRect(0, this._h-this.h, this._w, this.h);
  //   var lw = 4;
  //   var h = Math.floor(this._h-(this.h-lw/2)/2);
  //   var padding = 10;
  //   var p = Math.floor((this._w-padding*2)*k)+padding;
  //   this._ctx.lineWidth = lw;
  //   this._ctx.lineCap = 'round';
  //   this._ctx.beginPath();
  //   this._ctx.strokeStyle = '#b32d3a';
  //   this._ctx.moveTo(padding, h);
  //   this._ctx.lineTo(p, h);
  //   this._ctx.stroke();
  //   this._ctx.closePath();
  //   this._ctx.beginPath();
  //   this._ctx.strokeStyle = '#ddd';
  //   this._ctx.moveTo(p, h);
  //   this._ctx.lineTo(this._w-padding, h);
  //   this._ctx.stroke();
  //   this._ctx.closePath();
  //   this._ctx.fillStyle = '#f5f5f5';
  //   this._ctx.arc(p, h, 7, 0, Math.PI*2);
  //   this._ctx.fill();
  // }

}

timeline.isMouseOn = function(x, y) {
  /*
    Return true if the mouse is on top of the timeline.
  */

  return (y > this._h-this.h);

}

timeline.show = function() {
  /*
    Animate the height of the timeline up.
  */

  this.h = 15;
  this.update(this.k, true);

}

timeline.hide = function() {
  /*
    Animate the height of the timeline down.
  */

  this.h = 0;
  this.update(this.k, true);

}
