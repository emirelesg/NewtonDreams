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

  }

  /**
   * Enable or disable the DOM element.
   * @param {boolean} state Desired state of the element.
   */
  enabled(state) {
    this.obj.prop("disabled", !state);
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

    // Set the callback.
    const self = this;
    this.obj.on("click", () => {
      if (utils.isFunction(self.onClick)) {
        if (utils.isFunction(self.onClick)) self.onClick(self.obj.prop("checked"));
      }
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
    const self = this;
    this.obj.on("click", () => {
      if (utils.isFunction(self.onClick)) self.onClick();
    });

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

    // Set the callback.
    const self = this;
    this.obj.on('change', function() {
      if (utils.isFunction(self.onChange)) self.onChange(self.obj.find(":selected").val());
    });

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
     * Callback function for when a radio button is selected. The value of the selected 
     * radio button is passed to the callback function as a parameter.
     * @type {function}
     */
    this.onChange = onChange;

    // Set the callback.
    const self = this;
    this.obj.change(() => {
      if (utils.isFunction(self.onChange)) {
        self.onChange($(`${self.name}:checked`).val());
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