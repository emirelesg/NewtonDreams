import * as utils from "../Utils";
import * as constants from "../Constants";

/**
 * Class used to handle the sliders and their labels. 
 * @public
 * @class Slider
 */
export default class Slider {

  /**
   * @constructor
   * @param {object} [opts] Object that contains valid Slider properties with values. Their values will be assigned at the end of the constructor. If an invalid property is passed then the value will be ignored.
   */
  constructor(opts) {

    /**
     * Sets the HTML base id of the slider and label element.
     * In order for the slider to match with a label, the id must be the same for both elements.
     * The ending changes depending if it is a slider or a label.
     * This class will look for the id: {id}_slider and {id}_label, where id is this value.
     * Default value is "".
     * @type {string} Base id of the slider and label.
     */
    this.id = "";

    /**
     * Sets the color in HEX format of the slider.
     * Default value is {@link COLORS}.RED.
     * @type {string}
     */
    this.color = constants.COLORS.RED;

    /**
     * Stores a copy of the current color. Used when the slider is disabled and
     * the color must be later restored when the slider is enabled again.
     * Default value is {@link COLORS}.RED.
     * @type {string}
     */
    this.prevColor = this.color;

    /**
     * Sets the units that the slider will use.
     * Default value is "".
     * @type {string}
     */
    this.units = "";

    /**
     * Sets the starting position of the slider.
     * Default value is 0.
     * @type {number}
     */
    this.start = 0;

    /**
     * Sets the minimum value of the slider.
     * Default value is 0.
     * @type {number}
     */
    this.min = 0;

    /**
     * Sets the maximum value of the slider.
     * Default value is 1.
     * @type {number}
     */
    this.max = 1;

    /**
     * Sets the amount of decimal places displayed on the label.
     * Default value is 1.
     * @type {number}
     */
    this.decPlaces = 1;

    /**
     * Flag for fixing the decimal places to the amount set in {@link Slider.decPlaces}.
     * Default value is false.
     * @type {boolean}
     */
    this.fixPlaces = false;

    /**
     * Sets a callback for when the slider changes value.
     * Default value is undefined.
     * @type {function}
     */
    this.callback = undefined;
 
    /**
     * Sets the arguments passed to the callback function set in {@link Slider.callback}.
     * Default value is undefined.
     * @type {*}
     */
    this.callbackArgs = undefined;

    // Apply user settings.
    utils.loadOptions(this, opts);

    /**
     * Sets the current value of the slider.
     * Default value is {@link Slider.start}.
     * @type {number}
     */
    this.value = this.start;

    /**
     * Raw slider element obtained by document.getElementById.
     * @type {object}
     */
    this.slider = document.getElementById(`${this.id}_slider`);

    /**
     * Raw label element obtained by jQuery.
     * @type {object}
     */
    this.label = $(utils.fixId(`${this.id}_label`));

    // Set the current color to the slider.
    this.setColor();
    this.setLabel(this.start);

    // Init slider using the provided values.
    const self = this;
    /* eslint-disable-next-line no-undef */
    noUiSlider.create(this.slider, {
      start: this.start,
      connect: "lower",
      range: {
        min: this.min,
        max: this.max
      }
    });

    // Configure the callback for when the slider changes value.
    this.slider.noUiSlider.on("slide", values => {
      self.value = utils.round(values[0], self.decPlaces);
      self.setLabel(values[0]);
      if (utils.isFunction(self.callback)) {
        self.callback(self.callbackArgs);
      }
    });
  }

  /**
   * Sets a value in the label. This value is formatted accoding to the settings in the element.
   * @public
   * @param {number} value Desired value to set in the label.
   */
  setLabel(value) {
    this.label.val(
      utils.formatValue(value, this.units, this.decPlaces, this.fixPlaces)
    );
  }

  /**
   * Sets a value in the slider. This modifies the value in the label.
   * @public
   * @param {number} value Desired value to set in the slider.
   */
  set(value) {
    const parsed = utils.clamp(value, this.min, this.max);
    this.slider.noUiSlider.set(parsed);
    this.setLabel(parsed);
    this.value = utils.round(parsed, this.decPlaces);
    if (utils.isFunction(this.callback)) {
      this.callback(this.callbackArgs);
    }
  }

  /**
   * Get the current value of the slider.
   * @public
   * @returns {number} The current value of the slider.
   */
  get() {
    return this.value;
  }

  /**
   * Enable or disable the slider. When the slider is disabled the color changes to {@link COLORS}.GRAY.
   * Once it changes back to enabled, its previous color is restored.
   * @public
   * @param {boolean} state Desired state of the slider.
   */
  enabled(state) {
    this.slider.setAttribute("disabled", state);
    if (state) {
      this.setColor(this.prevColor);
    } else {
      this.prevColor = this.color;
      this.setColor(constants.COLORS.GRAY);
    }
  }

  /**
   * Change the color of the slider.
   * @public
   * @param {string} color Desired HEX color.
   */
  setColor(color) {
    if (color !== undefined) this.color = color;
    $(`#${this.id}_slider`).css("background", this.color);
  }
}
