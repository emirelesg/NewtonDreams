function Button(id, callback) {
  /*
    Class for handling buttons.
  */

  this.id = id;
  this._button = $(this.id);
  this._state = true;
  this._button.on('click', function(e) { callback(e); });
  this.disable();

}

Button.prototype.constructor = Button;

Button.prototype.get = function() {
  /*
    Return the jquery button object.
  */

  return this._button;

}

Button.prototype.text = function(txt) {
  /*
    Change the text of the button.
  */

  this._button.children().eq(1).text(txt);

}

Button.prototype.enable = function() {
  /*
    Enable the button.
  */

  if (!this._state) {
    this._button.removeClass('disabled');
    this._button.prop('disabled', false);
    this._state = true;
  }

}

Button.prototype.disable = function() {
  /*
    Disable the button.
  */

  if (this._state) {
    this._button.addClass('disabled');
    this._button.prop('disabled', true);
    this._state = false;
  }

}

Button.prototype.isEnabled = function() {
  /*
    Return true if it is enabled.
  */

  return this._state;

}
