var table = {
  _container: undefined,
  _height: 0,
  _body: undefined,
  _header_hight: 0,
  _selected: -1,
  _click_callback: undefined,
  _rows: []
};

/*

  ############ PUBLIC METHODS ############

*/

table.clear = function() {
  /*
    Clear all data in the table.
  */

  for (var i = 0; i < this._rows.length; i++) {
    this._rows[i].row.off('click');
    this._rows[i].row.remove();
  }
  this._rows = [];
  this._selected == -1;

}

table.init = function(body_id, container_id) {
  /*
    Initialize the table object.
  */

  this._container = $("#" + container_id);
  this._body = $("#" + body_id);

}

table.setHeight = function(h) {
  /*
    Set the height of the table.
  */

  // // Get the height of the table header
  // if (!this._header_hight) this._header_hight = this._container.height();

  // // Set the size of the table
  // this._height = h-this._header_hight;
  // this._body.css('height', this._height + 'px');

}

table.add = function(i, p) {
  /*
    Add a marker to the table.
  */

  // Generate html code
  var html = '<tr>';
  html += '<td>' + (p.frame) + '</td>';
  html += '<td>' + (p.time.toFixed(4)) + '</td>';
  html += '<td>' + (p.real_x.toFixed(4)) + '</td>';
  html += '<td>' + (p.real_y.toFixed(4)) + '</td>';
  html += '</tr>';

  // Append to table
  if (this._rows.length > 0) {
    if (i == 0) {
      this._rows[i].row.before(html);
    } else {
      this._rows[i-1].row.after(html);
    }
  } else {
    this._body.append(html);
  }

  // Save the current row in an array
  var _row = this._body.children().eq(i);
  var _td = _row.find('td');
  this._rows.splice(i, 0, {
    row: _row,
    time: _td.eq(1),
    x: _td.eq(2),
    y: _td.eq(3),
    height: _row.height()
  });

  // Bind click event
  var self = this;
  _row.click(function(){
    if (typeof(self._click_callback) === "function") self._click_callback(p.frame);
  });

}

table.delete = function(i) {
  /*
    Remove row from the array and from the DOM.
  */

  if (this._selected == i) this._selected == -1;
  this._rows[i].row.off('click');
  this._rows[i].row.remove();
  this._rows.splice(i, 1);

}

table.select = function(i) {
  /*
    Highlight a row.
  */

  if (i != this._selected) {
    this.deselect();
    this._rows[i].row.addClass('row-selected');
    this._selected = i;
    if (this._rows.length*this._rows[this._selected].height > this._height) this._rows[i].row.scrollintoview({duration: 10});
  }

}

table.deselect = function() {
  /*
    Remove the selection from a row.
  */

  if (this._selected != -1 && this._rows[this._selected] != undefined) {
    this._rows[this._selected].row.removeClass('row-selected');
    this._selected = -1;
  }

}

table.update = function(i, p) {
  /*
    Update the x and y values from the table.
  */

  this._rows[i].time.html(p.time);
  this._rows[i].x.html(p.real_x);
  this._rows[i].y.html(p.real_y);

}

table.onClick = function(callback) {
  /*
    Set the callback for when a row is clicked.
  */

  this._click_callback = callback;

}

/*

  ############ PRIVATE METHODS ############

*/
