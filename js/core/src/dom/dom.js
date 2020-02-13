import * as utils from "../Utils";

/**
 * Parent class for handling DOM elements.
 * @private
 * @class DOMElement
 */
export default class DOMElement {

  /**
   * @constructor
   * @param {string} id HTML Id of the element.
   */
  constructor(id) {

    /**
     * jQuery reference to the element.
     * @type {object}
     */
    this.obj = $(utils.fixId(id));

    /**
     * Stores if the element is enabled or disabled.
     * @type {boolean}
     */
    this.isEnabled = !this.obj.prop("disabled");

  }

  /**
   * Enable or disable the DOM element.
   * @param {boolean} state Desired state of the element.
   */
  enabled(state) {
    if (this.isEnabled !== state) {
      this.isEnabled = state;
      this.obj.prop("disabled", !this.isEnabled);
    }
  }

}


/**
 * Class used to handle a checkbox (<input type="checkbox">).
 * @public
 * @class Option
 * @example
 * // Given the following HTML checkbox:
 * //   <input type="checkbox" id="showPoints">
 * var showPoints = new Option("showPoints", function(val) {
 *  console.log(val);
 * });
 */
export class Option extends DOMElement {

  /**
   * @constructor
   * @param {string} id HTML id of the checkbox.
   * @param {function} onClick Callback function for when the checkbox changes state.
   */
  constructor(id, onClick) {

    // Extend DOMElement.
    super(id);
    
    /**
     * Callback function for when the checkbox changes state. The new state of the 
     * checkbox is passed to the callback function as a parameter.
     * @type {function}
     */
    this.onClick = onClick;

    /**
     * State of the option.
     * @type {boolean}
     */
    this.value = this.obj.prop("checked");

    // Set the callback.
    this.obj.on("click", () => {
      this.value = this.obj.prop("checked");
      if (utils.isFunction(this.onClick)) this.onClick(this.obj.prop("checked"));
    });

  }

}

/**
 * Class used to handle a button (<button>).
 * @public
 * @class Button
 * @example
 * // Given the following HTML button:
 * //   <button type="button" id="start"></button>
 * var start = new Button("start", function() {
 *  console.log("clicked");
 * });
 */
export class Button extends DOMElement {

  /**
   * @constructor
   * @param {string} id HTML id of the button.
   * @param {function} onClick Callback function for when button is pressed.
   */
  constructor(id, onClick) {

    // Extend DOMElement.
    super(id);

    /**
     * Callback function for when the button gets pressed.
     * @type {function}
     */
    this.onClick = onClick;

    // Set the callback.
    this.obj.on("click", () => {
      if (utils.isFunction(this.onClick)) this.onClick();
    });

  }

}

/**
 * Class used to handle an Input (<input>).
 * @public
 * @class Input
 * @example
 * // Given the following HTML input element:
 * //   <input id="value"></button>
 * var value = new Input("value", function(val) {
 *  console.log(val);
 * });
 */
export class Input extends DOMElement {

  /**
   * @constructor
   * @param {string} id HTML id of the input.
   * @param {function} onChange Callback function for when input value changes.
   */
  constructor(id, onChange, opts) {

    // Extend DOMElement.
    super(id);

    /**
     * Callback function for when the input value changes.
     * @type {function}
     */
    this.onChange = onChange;

    /**
     * Callback function for when the focus is lost.
     * @type {function}
     */
    this.onFocusout = undefined;

    /**
     * Defines if the parsed value must be casted to a number, otherwise the input is invalid.
     * @type {boolean}
     */
    this.isNumber = false;

    /**
     * Flag for remembering if the input is invalid.
     * @type {boolean}
     */
    this.isInvalid = false;

    /**
     * Stores the parsed value of the input.
     * @type {(number|string)}
     */
    this.value = '';

    /**
     * Default value for the input.
     * @type {(number|string)}
     */
    this.default = '';

    // Apply user settings.
    utils.loadOptions(this, opts);
    this.set(this.default);

    // Callback whenever the input is changed by the user.
    this.obj.on("input", (e) => {
      const rawValue = this.obj.val();
      if (this.isNumber) {
        if (rawValue === '') {
          this.value = this.default;
          this.invalid(false);
        } else {
          const parsedValue = parseFloat(rawValue);
          this.invalid(isNaN(parsedValue));
          if (!isNaN(parsedValue)) this.value = parsedValue;
        }
      } else {
        this.value = rawValue;
      }
      if (utils.isFunction(this.onChange)) this.onChange(this.value);
    });

    // Watch for the focusout event.
    // After the user leaves the input, set the value to the parsed one.
    this.obj.on('focusout', () => {
      if (this.isNumber) {
        this.set(this.value);
        if (utils.isFunction(this.onChange)) this.onChange(this.value);
        if (utils.isFunction(this.onFocusout)) this.onFocusout();
      }
    });

    // When the user presses enter, focusout.
    this.obj.on('keyup', (e) => {
      if (e.keyCode === 13) {
        this.obj.blur();
      }
    })

  }

  set(value) {
    this.value = value || this.default;
    this.obj.val(this.value);
    this.invalid(false);
  }

  invalid(state) {
    if (this.isInvalid !== state) {
      this.isInvalid = state;
      if (this.isInvalid) {
        this.obj.addClass('invalid');
      } else {
        this.obj.removeClass('invalid');
      }
    }
  }

}

/**
 * Class used to handle select elements (<select>).
 * @public
 * @class Select
 * @example
 * // Given the following HTML select element:
 * //   <select id="fx" name="fx">
 * //     <option value="1">Option 1</option>
 * //     <option value="2">Option 2</option>
 * //     <option value="3">Option 3</option>
 * //   </select>
 * var fx = new Select("fx", function(val) {
 *  console.log(val);
 * });
 */
export class Select extends DOMElement {

  /**
   * @constructor
   * @param {string} id HTML id of the select element.
   * @param {function} onChange Callback function for when the selected option changes.
   */
  constructor(id, onChange) {

    // Extend DOMElement.
    super(id);

    /**
     * Callback function for when the selected option changes. The value of the selected 
     * option is passed to the callback function as a parameter.
     * @type {function}
     */
    this.onChange = onChange;

    /**
     * Current option selected.
     * @type {number}
     */
    this.value = 0;

    // Set the callback.
    this.obj.on('change', () => {
      this.value = this.obj.find(":selected").val();
      if (utils.isFunction(this.onChange)) this.onChange(this.value);
    });

  }

  /**
   * Sets the options for the select element.
   * @param {Object} options Object that will define the options in the select element.
   * @param {Number} select Key of the option to select.
   */
  setOptions(options, select) {
    // Remove old options.
    this.obj.empty();
    // Add new options.
    for (let [key, value] of Object.entries(options)) {
      this.obj.append(
        $('<option></option>').attr('value', value).attr('selected', value === select).text(key)
      );
    }
    this.obj.trigger('change');
  }
  
}

/**
 * Class used to handle a set of multiple radio buttons (<input type="radio">).
 * @public
 * @class Options
 * @example
 * // Given the following set of HTML radio buttons:
 * //   <input type="radio" name="graph_type" value="pos">
 * //   <input type="radio" name="graph_type" value="vel">
 * //   <input type="radio" name="graph_type" value="accel">
 * var graph_type = new Options("graph_type", function(val) {
 *    console.log(val);
 * });
 */
export class Options {

  /**
   * @constructor
   * @param {string} name Name of the radio buttons.
   * @param {function} onChange Callback function for when any of the radio buttons changes state.
   */
  constructor(name, onChange) {

    /**
     * Sets the id of the input using the name as an argument. This id is then used to obtain the
     * jQuery object of the input.
     * @type {string}
     */
    this.name = `input[name="${name}"]`;

    /**
     * jQuery reference to the input.
     * @type {object}
     */
    this.obj = $(this.name);

    /**
     * Value of the currently selected radio option.
     * @type {string}
     */
    this.value = $(`${this.name}:checked`).val();

    /**
     * Callback function for when a radio button is selected. The value of the selected 
     * radio button is passed to the callback function as a parameter.
     * @type {function}
     */
    this.onChange = onChange;

    // Set the callback.
    this.obj.change(() => {
      this.value = $(`${this.name}:checked`).val();
      if (utils.isFunction(this.onChange)) {
        this.onChange(this.value);
      }
    });
  
  }

  /**
   * Selects a radio button using its value.
   * @param {string} value Value of the radio button to select.
   */
  select(value) {
    this.value = value;
    this.obj.each(function() {
      if ($(this).val() === value) {
        $(this).parent().addClass('active');
        $(this).prop('checked', true);
      } else {
        $(this).parent().removeClass('active');
        $(this).prop('checked', false);
      }
    });
  }

  /**
   * Enables or disables the radio options.
   * @param {boolean} state Desired state of the element.
   */
  enabled(state) {
    if (state) {
      this.obj.parent().removeClass('disabled')
    } else {
      this.obj.parent().addClass('disabled')     
    }
  }

}