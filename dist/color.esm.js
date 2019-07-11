var _this = this;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

import colorString from 'color-string';
import convert from 'color-convert';
import clamp from 'lodash/clamp';
import slice from 'lodash/slice';
import _round from 'lodash/round';
import castArray from 'lodash/castArray';
import has from 'lodash/has';
import isNil from 'lodash/isNil';
import toInteger from 'lodash/toInteger';
import includes from 'lodash/includes';
import isCountingNumber from 'Global/Assets/isCountingNumber';
var EMPTY_STRING = '';
var ALPHA = 'alpha';
var RGB = 'rgb';
var HSL = 'hsl';
var HSV = 'hsv';
var HWB = 'hwb';
var HCG = 'hcg';
var XYZ = 'xyz';
var LAB = 'lab';
var CMYK = 'cmyk';
var AA = 'AA';
var AAA = 'AAA';
/** @type {ReadonlyArray<string>} */

var rgbKeys = Object.freeze(RGB.split(EMPTY_STRING));
/** @type {ReadonlyArray<string>} */

var skippedModels = Object.freeze([
/* to be honest, I don't really feel like keyword belongs in color convert, but eh. */
'keyword',
/* gray conflicts with some method names, and has its own method defined. */
'gray',
/* shouldn't really be in color-convert either... */
'hex']);
/** @type {Readonly<string>} */

export var hashedModelKeys = Object.freeze(Object.keys(convert).reduce(function (hashed, model) {
  _newArrowCheck(this, _this);

  var prop = slice(convert[model].labels).sort().join(EMPTY_STRING);
  hashed[prop] = model;
  return hashed;
}.bind(this), Object.create(null)));
/**
 * The minimum values for WCAG rating.
 *
 * @type {Readonly}
 * @property {number} aa - AA minimum value.
 * @property {number} aaa - AAA minimum value.
 * @property {number} aaaLarge - AAA Large minimum value.
 * @property {number} aaLarge - AA Large minimum value.
 */

var minimums = Object.freeze({
  aa: 4.5,
  aaa: 7,
  aaaLarge: 4.5,
  aaLarge: 3
});
/**
 * Create a bound function that clamps the value to between 0 and max inclusive.
 *
 * @param {number} max - The maximum value.
 * @returns {function({value: number}): number} - The bound clamp function.
 */

var maxfn = function maxfn(max) {
  return function boundMaxfn(value) {
    // noinspection JSCheckFunctionSignatures
    return clamp(value, 0, max);
  };
};
/**
 * Partially zeros an array to a specified length.
 *
 * @param {Array} array - The array to be partially zeroed.
 * @param {number} [length=0] - The length to zero to.
 * @returns {Array<*>} - The partially zeroed array.
 */


var zeroArray = function zeroArray(array) {
  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  for (var index = 0; index < length; index += 1) {
    if (typeof array[index] !== 'number') {
      array[index] = 0;
    }
  }

  return array;
};
/**
 * Test if a value is a possible model.
 *
 * @param {*} value - The value to test.
 * @returns {boolean} - Indicates if value is a possible model.
 */


var isModel = function isModel(value) {
  return typeof value === 'string' && Boolean(value.trim());
};
/**
 * Convert value to appropriate number for rounding places.
 *
 * @param {*} value - The value to convert.
 * @param {number} [defaultTo=1] - The value to use if value is not a number.
 * @returns {number} - The number of places.
 */


var getPlaces = function getPlaces(value) {
  var defaultTo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return typeof value === 'number' ? toInteger(value) || 0 : defaultTo;
};
/**
 * Convert a color object to an array.
 *
 * @param {Color} colorObject - The color object.
 * @returns {Array<number>} - The array from the color object.
 */


var getColorArray = function getColorArray(colorObject) {
  var color = colorObject.color,
      valpha = colorObject.valpha; // noinspection JSIncompatibleTypesComparison

  return valpha === 1 ? color : [].concat(_toConsumableArray(color), [valpha]);
};
/**
 * Get the model.
 *
 * @param {*} value - The value provided as the model.
 * @returns {null|string} - The model.
 * @throws {Error} - If model is invalid.
 */


var getModel = function getModel(value) {
  if (isModel(value)) {
    if (includes(skippedModels, value)) {
      return null;
    }

    if (!has(convert, value)) {
      throw new Error("Unknown model: ".concat(value));
    }
  }

  return value;
};
/**
 * @type {Readonly<{enumerable: boolean, configurable: boolean, writable: boolean}>}
 * */


var instanceLockDescription = Object.freeze({
  configurable: false,
  enumerable: true,
  writable: false
});
/**
 *
 * @type {Readonly<{color: Readonly<{enumerable: boolean, configurable: boolean, writable: boolean}>, model: Readonly<{enumerable: boolean, configurable: boolean, writable: boolean}>, valpha: Readonly<{enumerable: boolean, configurable: boolean, writable: boolean}>}>}
 */

var colorDescription = Object.freeze({
  color: instanceLockDescription,
  model: instanceLockDescription,
  valpha: instanceLockDescription
});
var limiters = Object.create(null);
/**
 * The Color class.
 *
 * @class Color
 * @type {object}
 * @property {Array<number>} color - The color represented in the model array.
 * @property {string} model - The color model.
 * @property {number} valpha - The alpha value of the color.
 */

var Color =
/*#__PURE__*/
function () {
  /**
   * @param {*} obj - The color definition.
   * @param {string} [modelOption] - The model.
   */
  function Color(obj, modelOption) {
    var _this2 = this;

    _classCallCheck(this, Color);

    var model = getModel(modelOption);

    if (isNil(obj)) {
      this.model = RGB;
      this.color = [0, 0, 0];
      this.valpha = 1;
    } else if (obj instanceof Color) {
      this.model = obj.model;
      this.color = _toConsumableArray(obj.color);
      this.valpha = obj.valpha;
    } else if (typeof obj === 'string') {
      var result = colorString.get(obj);

      if (result === null) {
        throw new Error("Unable to parse color from string: ".concat(obj));
      }

      this.model = result.model;
      var channels = convert[this.model].channels;
      this.color = result.value.slice(0, channels);
      this.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1;
    } else if (isCountingNumber(obj.length)) {
      this.model = model || RGB;
      var _channels = convert[this.model].channels;
      var newArr = slice(obj, 0, _channels);
      this.color = zeroArray(newArr, _channels);
      this.valpha = typeof obj[_channels] === 'number' ? obj[_channels] : 1;
    } else if (typeof obj === 'number') {
      /* this is always RGB - can be converted later on. */
      this.model = RGB;
      /* eslint-disable-next-line no-bitwise */

      var number = obj & 0xffffff;
      /* eslint-disable-next-line no-bitwise */

      this.color = [number >> 16 & 0xff, number >> 8 & 0xff, number & 0xff];
      this.valpha = 1;
    } else {
      this.valpha = 1;
      var keys = Object.keys(obj);

      if (has(obj, ALPHA)) {
        keys.splice(keys.indexOf(ALPHA), 1);
        this.valpha = typeof obj.alpha === 'number' ? obj.alpha : 0;
      }

      var hashedKeys = keys.sort().join(EMPTY_STRING);

      if (!has(hashedModelKeys, hashedKeys)) {
        throw new Error("Unable to parse color from object: ".concat(JSON.stringify(obj)));
      }

      this.model = hashedModelKeys[hashedKeys];
      var color = convert[this.model].labels.split(EMPTY_STRING).map(function (label) {
        _newArrowCheck(this, _this2);

        return obj[label];
      }.bind(this));
      this.color = zeroArray(color);
    }
    /* perform limitations (clamping, etc.) */


    if (limiters[this.model]) {
      var _channels2 = convert[this.model].channels;
      var limiter = limiters[this.model];

      for (var index = 0; index < _channels2; index += 1) {
        var limit = limiter[index];

        if (limit) {
          this.color[index] = limit(this.color[index]);
        }
      }
    }

    this.valpha = clamp(this.valpha, 0, 1);
    Object.freeze(this.color);
    Object.defineProperties(this, colorDescription);
  }
  /**
   * @returns {string} - The string representation.
   */


  _createClass(Color, [{
    key: "toString",
    value: function toString() {
      return this.string();
    } // toJSON() {
    //   return this[this.model]();
    // }

    /**
     * @param {number} [places] - The number of places to round to.
     * @returns {string} - The string representation.
     */

  }, {
    key: "string",
    value: function string(places) {
      var colorObject = (has(colorString.to, this.model) ? this : this.rgb()).round(getPlaces(places));
      var args = getColorArray(colorObject);
      return colorString.to[colorObject.model](args);
    }
    /**
     * @param {number} [places] - The number of places to round to.
     * @returns {string} - The string representation.
     */

  }, {
    key: "percentString",
    value: function percentString(places) {
      var colorObject = this.rgb().round(getPlaces(places));
      var args = getColorArray(colorObject);
      return colorString.to.rgb.percent(args);
    }
    /**
     * @returns {Array<number>} - An array representation of the model.
     */

  }, {
    key: "array",
    value: function array() {
      return getColorArray(this);
    }
    /**
     * @returns {object} - The plain object representation of the model.
     */

  }, {
    key: "object",
    value: function object() {
      var _this3 = this;

      var labels = convert[this.model].labels;
      var result = labels.split(EMPTY_STRING).reduce(function (obj, key, index) {
        _newArrowCheck(this, _this3);

        obj[key] = this.color[index];
        return obj;
      }.bind(this), {});

      if (this.valpha !== 1) {
        result.alpha = this.valpha;
      }

      return result;
    }
    /**
     * @returns {Array<number>} - An rgb array representation.
     */

  }, {
    key: "unitArray",
    value: function unitArray() {
      var _this4 = this;

      var rgb = this.rgb().color.map(function (value) {
        _newArrowCheck(this, _this4);

        return value / 255;
      }.bind(this));

      if (this.valpha !== 1) {
        rgb.push(this.valpha);
      }

      return rgb;
    }
    /**
     * @returns {object} - The rgb plain object representation.
     */

  }, {
    key: "unitObject",
    value: function unitObject() {
      var _this5 = this;

      var rgb = rgbKeys.reduce(function (object, key) {
        _newArrowCheck(this, _this5);

        object[key] /= 255;
        return object;
      }.bind(this), this.rgb().object());

      if (this.valpha !== 1) {
        rgb.alpha = this.valpha;
      }

      return rgb;
    }
    /**
     * @param {number} [places] - The number of places to round to.
     * @returns {Color} - A new Color object that has been rounded as specified.
     */

  }, {
    key: "round",
    value: function round(places) {
      var _this6 = this;

      var placesMax = Math.max(getPlaces(places, 0), 0); // noinspection JSCheckFunctionSignatures

      return new Color([].concat(_toConsumableArray(this.color.map(function (value) {
        _newArrowCheck(this, _this6);

        return _round(value, placesMax);
      }.bind(this))), [this.valpha]), this.model);
    }
    /**
     * @param {number} [val] - The value to modify by.
     * @returns {number|Color} - A new Color object if val is specified, or the current alpha.
     */

  }, {
    key: "alpha",
    value: function alpha(val) {
      if (arguments.length) {
        return new Color([].concat(_toConsumableArray(this.color), [clamp(val, 0, 1)]), this.model);
      }

      return this.valpha;
    }
    /**
     * @param {*} [val] - A new color definition.
     * @returns {string|Color} - A new Color object if val is specified, or the current keyword.
     */

  }, {
    key: "keyword",
    value: function keyword(val) {
      if (arguments.length) {
        return new Color(val);
      }

      return convert[this.model].keyword(this.color);
    }
    /**
     * @param {*} [val] - A new color definition.
     * @returns {string|Color} - A new Color object if val is specified, or the current hex.
     */

  }, {
    key: "hex",
    value: function hex(val) {
      if (arguments.length) {
        return new Color(val);
      }

      return colorString.to.hex(this.rgb().round().color);
    }
    /**
     * @returns {number} - The current RGB value.
     */

  }, {
    key: "rgbNumber",
    value: function rgbNumber() {
      var rgb = this.rgb().color;
      /* eslint-disable-next-line no-bitwise */

      return (rgb[0] & 0xff) << 16 | (rgb[1] & 0xff) << 8 | rgb[2] & 0xff;
    }
    /**
     * @returns {number} - The current luminosity value.
     */

  }, {
    key: "luminosity",
    value: function luminosity() {
      var _this7 = this;

      /** @see {http://www.w3.org/TR/WCAG20/#relativeluminancedef} */
      var rgb = this.rgb().color;
      var lum = rgb.map(function (channel) {
        _newArrowCheck(this, _this7);

        var chan = channel / 255;
        return chan <= 0.03928 ? chan / 12.92 : Math.pow((chan + 0.055) / 1.055, 2.4);
      }.bind(this));
      return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
    }
    /**
     * @param {Color} color2 - The color object to contrast this color with.
     * @returns {number} - The contrast value.
     */

  }, {
    key: "contrast",
    value: function contrast(color2) {
      if (!(color2 instanceof Color)) {
        throw new Error("Argument to \"contrast\" was not a Color instance, but rather an instance of ".concat(_typeof(color2)));
      }
      /** @see {http://www.w3.org/TR/WCAG20/#contrast-ratiodef} */


      var lum1 = this.luminosity();
      var lum2 = color2.luminosity();

      if (lum1 > lum2) {
        return (lum1 + 0.05) / (lum2 + 0.05);
      }

      return (lum2 + 0.05) / (lum1 + 0.05);
    }
    /**
     * @param {Color} color2 - The color object to contrast this color with.
     * @returns {string} - The WCAG contrast level.
     */

  }, {
    key: "level",
    value: function level(color2) {
      if (!(color2 instanceof Color)) {
        throw new Error("Argument to \"level\" was not a Color instance, but rather an instance of ".concat(_typeof(color2)));
      }

      var contrastRatio = this.contrast(color2);

      if (contrastRatio >= minimums.aaa) {
        return AAA;
      }

      return contrastRatio >= minimums.aa ? AA : EMPTY_STRING;
    }
    /**
     * @returns {boolean} - True if color is considered dark.
     */

  }, {
    key: "isDark",
    value: function isDark() {
      var rgb = this.rgb().color;
      /**
       * YIQ equation.
       *
       * @see {http://24ways.org/2010/calculating-color-contrast}
       */

      var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
      return yiq < 128;
    }
    /**
     * @returns {boolean} - True if color is considered light.
     */

  }, {
    key: "isLight",
    value: function isLight() {
      return !this.isDark();
    }
    /**
     * @returns {Color} - The new negated color.
     */

  }, {
    key: "negate",
    value: function negate() {
      var _this8 = this;

      var rgb = rgbKeys.reduce(function (object, key) {
        _newArrowCheck(this, _this8);

        object[key] = 255 - object[key];
        return object;
      }.bind(this), this.rgb().object());

      if (this.valpha !== 1) {
        rgb.alpha = this.valpha;
      }

      return new Color(rgb, this.model);
    }
    /**
     * @param {number} ratio - The ratio to lighten by.
     * @returns {Color} - The new lightened color.
     */

  }, {
    key: "lighten",
    value: function lighten(ratio) {
      var color = _toConsumableArray(this.hsl().color);

      var obj = {
        h: color[0],
        l: color[2] + color[2] * ratio,
        s: color[1]
      };

      if (this.valpha !== 1) {
        obj.alpha = this.valpha;
      }

      return new Color(obj, this.model);
    }
    /**
     * @param {number} ratio - The ratio to darken by.
     * @returns {Color} - The new darkened color.
     */

  }, {
    key: "darken",
    value: function darken(ratio) {
      var color = _toConsumableArray(this.hsl().color);

      var obj = {
        h: color[0],
        l: color[2] - color[2] * ratio,
        s: color[1]
      };

      if (this.valpha !== 1) {
        obj.alpha = this.valpha;
      }

      return new Color(obj, this.model);
    }
    /**
     * @param {number} ratio - The ratio to saturate by.
     * @returns {Color} - The new saturated color.
     */

  }, {
    key: "saturate",
    value: function saturate(ratio) {
      var color = _toConsumableArray(this.hsl().color);

      var obj = {
        h: color[0],
        l: color[2],
        s: color[1] + color[1] * ratio
      };

      if (this.valpha !== 1) {
        obj.alpha = this.valpha;
      }

      return new Color(obj, this.model);
    }
    /**
     * @param {number} ratio - The ratio to desaturate by.
     * @returns {Color} - The new desaturated color.
     */

  }, {
    key: "desaturate",
    value: function desaturate(ratio) {
      var color = _toConsumableArray(this.hsl().color);

      var obj = {
        h: color[0],
        l: color[2],
        s: color[1] - color[1] * ratio
      };

      if (this.valpha !== 1) {
        obj.alpha = this.valpha;
      }

      return new Color(obj, this.model);
    }
    /**
     * @param {number} ratio - The ratio to whiten by.
     * @returns {Color} - The new whitened color.
     */

  }, {
    key: "whiten",
    value: function whiten(ratio) {
      var color = _toConsumableArray(this.hwb().color);

      var obj = {
        b: color[2],
        h: color[0],
        w: color[1] + color[1] * ratio
      };

      if (this.valpha !== 1) {
        obj.alpha = this.valpha;
      }

      return new Color(obj, this.model);
    }
    /**
     * @param {number} ratio - The ratio to blacken by.
     * @returns {Color} - The new blackened color.
     */

  }, {
    key: "blacken",
    value: function blacken(ratio) {
      var color = _toConsumableArray(this.hwb().color);

      var obj = {
        b: color[2] + color[2] * ratio,
        h: color[0],
        w: color[1]
      };

      if (this.valpha !== 1) {
        obj.alpha = this.valpha;
      }

      return new Color(obj, this.model);
    }
    /**
     * @returns {Color} - The new greyscale color.
     */

  }, {
    key: "grayscale",
    value: function grayscale() {
      /** @see {http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale} */
      var rgb = this.rgb().color;
      var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
      return Color.rgb(val, val, val);
    }
    /**
     * @param {number} ratio - The ratio to fade by.
     * @returns {Color} - The new faded color.
     */

  }, {
    key: "fade",
    value: function fade(ratio) {
      return this.alpha(this.valpha - this.valpha * ratio);
    }
    /**
     * @param {number} ratio - The ratio to modify opacity by.
     * @returns {Color} - The new opacity modified color.
     */

  }, {
    key: "opaquer",
    value: function opaquer(ratio) {
      return this.alpha(this.valpha + this.valpha * ratio);
    }
    /**
     * @param {number} degrees - The number of degrees to rotate by.
     * @returns {Color} - The new rotated color.
     */

  }, {
    key: "rotate",
    value: function rotate(degrees) {
      var color = _toConsumableArray(this.hsl().color);

      var _color = _slicedToArray(color, 1),
          hue = _color[0];

      var hueAngle = (hue + degrees) % 360;
      color[0] = hueAngle < 0 ? 360 + hueAngle : hueAngle;
      var obj = {
        h: color[0],
        l: color[2],
        s: color[1]
      };

      if (this.valpha !== 1) {
        obj.alpha = this.valpha;
      }

      return new Color(obj, this.model);
    }
    /**
     * @param {Color} mixinColor - The color to mix in.
     * @param {number} [weight=0.5] - The mixing weight.
     * @returns {Color} - The new mixed color.
     * @throws {Error} if mixinColor is not a Color object.
     */

  }, {
    key: "mix",
    value: function mix(mixinColor, weight) {
      /**
       * Ported from sass implementation in C.
       *
       * @see {https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209}
       */
      if (!(mixinColor instanceof Color)) {
        throw new Error("Argument to \"mix\" was not a Color instance, but rather an instance of ".concat(_typeof(mixinColor)));
      }

      var color1 = mixinColor.rgb();
      var color2 = this.rgb();
      var p = arguments.length >= 2 ? weight : 0.5;
      var w = 2 * p - 1;
      var a = color1.alpha() - color2.alpha();
      var w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
      var w2 = 1 - w1;
      return Color.rgb(w1 * color1.red() + w2 * color2.red(), w1 * color1.green() + w2 * color2.green(), w1 * color1.blue() + w2 * color2.blue(), color1.alpha() * p + color2.alpha() * (1 - p));
    }
  }]);

  return Color;
}();

export { Color as default };
var maxfn100 = maxfn(100);
var maxfn255 = maxfn(255);
/**
 * @param {string|Array<string>} model - The model(s).
 * @param {number} channel - The channel number.
 * @param {Function} [modifier] - The modifier function.
 * @returns {Function} - The bound getset function.
 */

var getset = function getset(model, channel, modifier) {
  var _this9 = this;

  var modelArray = castArray(model);
  modelArray.forEach(function (m) {
    _newArrowCheck(this, _this9);

    if (!Array.isArray(limiters[m])) {
      limiters[m] = [];
    }

    limiters[m][channel] = modifier;
  }.bind(this));

  var _modelArray = _slicedToArray(modelArray, 1),
      modelValue = _modelArray[0];

  return function boundGetset(value) {
    var _this10 = this;

    if (arguments.length) {
      var val = modifier ? modifier(value) : value;
      /* eslint-disable-next-line babel/no-invalid-this */

      var colorInstance = this[modelValue]();

      var color = _toConsumableArray(colorInstance.color);

      color[channel] = val;
      var object = modelValue.split(EMPTY_STRING).reduce(function (obj, key, index) {
        _newArrowCheck(this, _this10);

        obj[key] = color[index];
        return obj;
      }.bind(this), {});
      /* eslint-disable-next-line babel/no-invalid-this */

      if (this.valpha !== 1) {
        /* eslint-disable-next-line babel/no-invalid-this */
        object.alpha = this.valpha;
      }

      return new Color(object, modelValue);
    }
    /* eslint-disable-next-line babel/no-invalid-this */


    var colorChannel = this[modelValue]().color[channel];
    return modifier ? modifier(colorChannel) : colorChannel;
  };
};

Object.defineProperties(Color.prototype, {
  a: {
    value: getset(LAB, 1)
  },
  b: {
    value: getset(LAB, 2)
  },
  black: {
    value: getset(CMYK, 3, maxfn100)
  },
  blue: {
    value: getset(RGB, 2, maxfn255)
  },
  chroma: {
    value: getset(HCG, 1, maxfn100)
  },
  cyan: {
    value: getset(CMYK, 0, maxfn100)
  },
  gray: {
    value: getset(HCG, 2, maxfn100)
  },
  green: {
    value: getset(RGB, 1, maxfn255)
  },
  hue: {
    value: getset([HSL, HSV, HWB, HCG], 0, function (val) {
      _newArrowCheck(this, _this);

      return (val % 360 + 360) % 360;
    }.bind(this))
  },
  l: {
    value: getset(LAB, 0, maxfn100)
  },
  lightness: {
    value: getset(HSL, 2, maxfn100)
  },
  magenta: {
    value: getset(CMYK, 1, maxfn100)
  },

  /* rgb */
  red: {
    value: getset(RGB, 0, maxfn255)
  },
  saturationl: {
    value: getset(HSL, 1, maxfn100)
  },
  saturationv: {
    value: getset(HSV, 1, maxfn100)
  },
  value: {
    value: getset(HSV, 2, maxfn100)
  },
  wblack: {
    value: getset(HWB, 2, maxfn100)
  },
  white: {
    value: getset(HWB, 1, maxfn100)
  },
  x: {
    value: getset(XYZ, 0, maxfn100)
  },
  y: {
    value: getset(XYZ, 1, maxfn100)
  },
  yellow: {
    value: getset(CMYK, 2, maxfn100)
  },
  z: {
    value: getset(XYZ, 2, maxfn100)
  }
});
/* model conversion methods and static constructors */

Object.keys(convert).forEach(function (model) {
  _newArrowCheck(this, _this);

  if (includes(skippedModels, model)) {
    return;
  }

  var channels = convert[model].channels;
  /* conversion methods */

  Object.defineProperty(Color.prototype, model, {
    value: function conversionMethod() {
      if (this.model === model) {
        return new Color(this);
      }

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args.length) {
        return new Color(args, model);
      }

      var newAlpha = typeof args[channels] === 'number' ? channels : this.valpha;
      return new Color([].concat(_toConsumableArray(castArray(convert[this.model][model].raw(this.color))), [newAlpha]), model);
    }
  });
  /* 'static' construction methods */

  Object.defineProperty(Color, model, {
    enumerable: true,
    value: function constructionMethod() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var color = args[0];
      var col = typeof color === 'number' ? zeroArray(args, channels) : color;
      return new Color(col, model);
    }
  });
}.bind(this));

//# sourceMappingURL=color.esm.js.map