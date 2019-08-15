import colorString from 'color-string';
import convert from 'color-convert';
import clamp from 'math-clamp-x';
import slice from 'array-slice-x';
import has from 'has-own-property-x';
import isNil from 'is-nil-x';
import includes from 'array-includes-x';
import isLength from 'is-length-x';
import isArray from 'is-array-x';
import create from 'object-create-x';
import bind from 'bind-x';
import forEach from 'array-for-each-x';
import reduce from 'array-reduce-x';
import map from 'array-map-x';
import objectKeys from 'object-keys-x';
import toNumber from 'to-number-x';
import toBoolean from 'to-boolean-x';
import trim from 'trim-x';
import defineProperties, {defineProperty} from 'object-define-properties-x';
import indexOf from 'index-of-x';
import stable from 'stable';
import renameFunction from 'rename-function-x';
import toLength from 'to-length-x';
import assertIsFunction from 'assert-is-function-x';

const TO_FIXED_MAX = 20;
const TO_FIXED_NORMAL = 6;
const TO_FIXED_MIN = 1;
const EMPTY_STRING = '';
const $call = bind.call;
const split = bind($call, EMPTY_STRING.split);
const EMPTY_ARRAY = [];
const push = bind($call, EMPTY_ARRAY.push);
const concat = bind($call, EMPTY_ARRAY.concat);
const splice = bind($call, EMPTY_ARRAY.splice);
const join = bind($call, EMPTY_ARRAY.join);
const toFixed = bind($call, TO_FIXED_MAX.toFixed);
/* eslint-disable-next-line no-restricted-properties */
const {pow: mathPow} = Math;
const {stringify} = JSON;
const nativeFreeze = {}.constructor.freeze;
const freeze =
  typeof nativeFreeze === 'function'
    ? nativeFreeze
    : function freeze(value) {
        return value;
      };

const castArray = function castArray(value) {
  return isArray(value) ? value : [value];
};

/**
 * Test if a value is a counting number, 1 -> MAX_SAFE_INTEGER.
 *
 * @param {*} value - The value to be tested.
 * @returns {boolean} True if value is a counting number.
 */
const isCountingNumber = function isCountingNumber(value) {
  return isLength(value) && value > 0;
};

const ALPHA = 'alpha';
const RGB = 'rgb';
const HSL = 'hsl';
const HSV = 'hsv';
const HWB = 'hwb';
const HCG = 'hcg';
const XYZ = 'xyz';
const LAB = 'lab';
const CMYK = 'cmyk';
const AA = 'AA';
const AAA = 'AAA';
/** @type {ReadonlyArray<string>} */
const rgbKeys = freeze(split(RGB, EMPTY_STRING));
/** @type {ReadonlyArray<string>} */
const skippedModels = freeze([
  /* to be honest, I don't really feel like keyword belongs in color convert, but eh. */
  'keyword',

  /* gray conflicts with some method names, and has its own method defined. */
  'gray',

  /* shouldn't really be in color-convert either... */
  'hex',
]);

/** @type {Readonly<string>} */
export const hashedModelKeys = freeze(
  reduce(
    objectKeys(convert),
    function iteratee(hashed, model) {
      const prop = join(stable(slice(convert[model].labels)), EMPTY_STRING);

      hashed[prop] = model;

      return hashed;
    },
    create(null),
  ),
);

/**
 * The minimum values for WCAG rating.
 *
 * @type {Readonly}
 * @property {number} aa - AA minimum value.
 * @property {number} aaa - AAA minimum value.
 * @property {number} aaaLarge - AAA Large minimum value.
 * @property {number} aaLarge - AA Large minimum value.
 */
const minimums = freeze({
  aa: 4.5,
  aaa: 7,
  aaaLarge: 4.5,
  aaLarge: 3,
});

/**
 * Create a bound function that clamps the value to between 0 and max inclusive.
 *
 * @param {number} max - The maximum value.
 * @returns {function({value: number}): number} - The bound clamp function.
 */
const maxfn = function maxfn(max) {
  return function boundMaxfn(value) {
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
const zeroArray = function zeroArray(array, length = 0) {
  for (let index = 0; index < length; index += 1) {
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
const isPossibleModel = function isPossibleModel(value) {
  return typeof value === 'string' && toBoolean(trim(value));
};

/**
 * Convert value to appropriate number for rounding places.
 *
 * @param {*} value - The value to convert.
 * @param {number} [defaultTo=1] - The value to use if value is not a number.
 * @returns {number} - The number of places.
 */
const getPlaces = function getPlaces(value, defaultTo = TO_FIXED_MIN) {
  return isNil(value) ? defaultTo : clamp(toLength(value), 0, TO_FIXED_MAX);
};

/**
 * Convert a color object to an array.
 *
 * @param {Color} colorObject - The color object.
 * @returns {Array<number>} - The array from the color object.
 */
const getColorArray = function getColorArray(colorObject) {
  const {color, valpha} = colorObject;

  return valpha === 1 ? color : concat(color, valpha);
};

const assertHas = function assertHas(object, key) {
  if (has(object, key) === false) {
    /* eslint-disable-next-line prefer-rest-params */
    const msg = arguments.length > 2 ? arguments[2] : `Object does not have key "${key}"`;

    throw new Error(msg);
  }

  return object[key];
};

/**
 * Get the model.
 *
 * @param {*} value - The value provided as the model.
 * @returns {null|string} - The model.
 * @throws {Error} - If model is invalid.
 */
const getModel = function getModel(value) {
  if (isPossibleModel(value)) {
    if (includes(skippedModels, value)) {
      return null;
    }

    assertHas(convert, value, `Unknown model: ${value}`);
  }

  return value;
};

/**
 * @type {Readonly<{enumerable: boolean, configurable: boolean, writable: boolean}>}
 * */
const instanceLockDescription = freeze({
  configurable: false,
  enumerable: true,
  writable: false,
});

/**
 *
 * @type {Readonly<{color: Readonly<{enumerable: boolean, configurable: boolean, writable: boolean}>, model: Readonly<{enumerable: boolean, configurable: boolean, writable: boolean}>, valpha: Readonly<{enumerable: boolean, configurable: boolean, writable: boolean}>}>}
 */
const colorDescription = freeze({
  color: instanceLockDescription,
  model: instanceLockDescription,
  valpha: instanceLockDescription,
});

const limiters = create(null);

function roundTo(num, places = TO_FIXED_MAX) {
  return toNumber(toFixed(num, places));
}

function roundToPlaces(places = TO_FIXED_MAX) {
  return function boundRoundTo(num) {
    return roundTo(num, places);
  };
}

/**
 * The Color class.
 *
 * @class Color
 * @param {*} obj - The color definition.
 * @param {string} [modelOption] - The mode.
 * @property {Array<number>} color - The color represented in the model array.
 * @property {string} model - The color model.
 * @property {number} valpha - The alpha value of the color.
 */
const Color = function Color(obj, modelOption) {
  const model = getModel(modelOption);

  if (isNil(obj)) {
    this.model = RGB;
    this.color = [0, 0, 0];
    this.valpha = 1;
  } else if (obj instanceof Color) {
    this.model = obj.model;
    this.color = slice(obj.color);
    this.valpha = obj.valpha;
  } else if (typeof obj === 'string') {
    const result = colorString.get(obj);

    if (result === null) {
      throw new Error(`Unable to parse color from string: ${obj}`);
    }

    this.model = result.model;
    const {channels} = convert[this.model];
    this.color = slice(result.value, 0, channels);
    this.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1;
  } else if (isCountingNumber(obj.length)) {
    this.model = model || RGB;
    const {channels} = convert[this.model];
    const newArr = slice(obj, 0, channels);
    this.color = zeroArray(newArr, channels);
    this.valpha = typeof obj[channels] === 'number' ? obj[channels] : 1;
  } else if (typeof obj === 'number') {
    /* this is always RGB - can be converted later on. */
    this.model = RGB;
    /* eslint-disable-next-line no-bitwise */
    const number = obj & 0xffffff;
    /* eslint-disable-next-line no-bitwise */
    this.color = [(number >> 16) & 0xff, (number >> 8) & 0xff, number & 0xff];
    this.valpha = 1;
  } else {
    this.valpha = 1;

    const keys = objectKeys(obj);

    if (has(obj, ALPHA)) {
      splice(keys, indexOf(keys, ALPHA), 1);
      this.valpha = typeof obj.alpha === 'number' ? obj.alpha : 0;
    }

    const hashedKeys = join(stable(keys), EMPTY_STRING);
    this.model = assertHas(hashedModelKeys, hashedKeys, `Unable to parse color from object: ${stringify(obj)}`);
    const color = map(split(convert[this.model].labels, EMPTY_STRING), function iteratee(label) {
      return obj[label];
    });

    this.color = zeroArray(color);
  }

  /* perform limitations (clamping, etc.) */
  if (limiters[this.model]) {
    const {channels} = convert[this.model];
    const limiter = limiters[this.model];

    for (let index = 0; index < channels; index += 1) {
      const limit = limiter[index];

      if (limit) {
        this.color[index] = limit(this.color[index]);
      }
    }
  }

  this.valpha = clamp(this.valpha, 0, 1);

  freeze(this.color);
  defineProperties(this, colorDescription);
};

const assertInstanceOf = function assertInstanceOf(value, method) {
  if (toBoolean(value instanceof Color) === false) {
    throw new Error(`Argument to "${method}" was not a Color instance.`);
  }
};

const assertThisInstanceOf = function assertThisInstanceOf(value) {
  if (toBoolean(value instanceof Color) === false) {
    throw new Error('"this" is not a Color instance.');
  }
};

defineProperties(Color.prototype, {
  /**
   * @param {number} [places] - The number of places to round to.
   * @returns {string} - The string representation.
   */
  toString: {
    configurable: true,
    value: function $toString(places) {
      assertThisInstanceOf(this);

      return this.string(places);
    },
  },

  /**
   * @param {number} [places] - The number of places to round to.
   * @returns {string} - The string representation.
   */
  string: {
    configurable: true,
    value: function string(places) {
      assertThisInstanceOf(this);
      const colorObject = (has(colorString.to, this.model) ? this : this.rgb()).round(getPlaces(places));
      const args = getColorArray(colorObject);

      return colorString.to[colorObject.model](args);
    },
  },

  /**
   * @param {number} [places] - The number of places to round to.
   * @returns {string} - The string representation.
   */
  percentString: {
    configurable: true,
    value: function percentString(places) {
      assertThisInstanceOf(this);
      const colorObject = this.rgb().round(getPlaces(places));
      const args = getColorArray(colorObject);

      return colorString.to.rgb.percent(args);
    },
  },

  /**
   * @returns {Array<number>} - An array representation of the model.
   */
  array: {
    configurable: true,
    value: function array() {
      assertThisInstanceOf(this);

      return getColorArray(this);
    },
  },

  /**
   * @returns {object} - The plain object representation of the model.
   */
  object: {
    configurable: true,
    value: function object() {
      assertThisInstanceOf(this);
      const {labels} = convert[this.model];
      const iteratee = bind(function iteratee() {
        /* eslint-disable-next-line prefer-rest-params */
        const obj = arguments[0];
        /* eslint-disable-next-line babel/no-invalid-this,prefer-rest-params */
        obj[arguments[1]] = this.color[arguments[2]];

        return obj;
      }, this);

      const result = reduce(split(labels, EMPTY_STRING), iteratee, {});

      if (this.valpha !== 1) {
        result.alpha = this.valpha;
      }

      return result;
    },
  },

  /**
   * @returns {Array<number>} - An rgb array representation.
   */
  unitArray: {
    configurable: true,
    value: function unitArray() {
      assertThisInstanceOf(this);
      const rgb = map(this.rgb().color, function iteratee(value) {
        return value / 255;
      });

      if (this.valpha !== 1) {
        push(rgb, this.valpha);
      }

      return rgb;
    },
  },

  /**
   * @returns {object} - The rgb plain object representation.
   */
  unitObject: {
    configurable: true,
    value: function unitObject() {
      assertThisInstanceOf(this);
      const rgb = reduce(
        rgbKeys,
        function iteratee(object, key) {
          object[key] /= 255;

          return object;
        },
        this.rgb().object(),
      );

      if (this.valpha !== 1) {
        rgb.alpha = this.valpha;
      }

      return rgb;
    },
  },

  /**
   * @param {number} [places] - The number of places to round to.
   * @returns {Color} - A new Color object that has been rounded as specified.
   */
  round: {
    configurable: true,
    value: function round(places) {
      assertThisInstanceOf(this);
      const rounded = map(this.color, roundToPlaces(getPlaces(places, 0)));

      push(rounded, this.valpha);

      return new Color(rounded, this.model);
    },
  },

  /**
   * @param {number} [val] - The value to modify by.
   * @returns {number|Color} - A new Color object if val is specified, or the current alpha.
   */
  alpha: {
    configurable: true,
    value: function alpha(val) {
      assertThisInstanceOf(this);

      if (arguments.length) {
        return new Color(concat(this.color, clamp(val, 0, 1)), this.model);
      }

      return this.valpha;
    },
  },

  /**
   * @param {*} [val] - A new color definition.
   * @returns {string|Color} - A new Color object if val is specified, or the current keyword.
   */
  keyword: {
    configurable: true,
    value: function keyword(val) {
      assertThisInstanceOf(this);

      if (arguments.length) {
        return new Color(val);
      }

      return convert[this.model].keyword(this.color);
    },
  },

  /**
   * @param {*} [val] - A new color definition.
   * @returns {string|Color} - A new Color object if val is specified, or the current hex.
   */
  hex: {
    configurable: true,
    value: function hex(val) {
      assertThisInstanceOf(this);

      if (arguments.length) {
        return new Color(val);
      }

      return colorString.to.hex(this.rgb().round().color);
    },
  },

  /**
   * @returns {number} - The current RGB value.
   */
  rgbNumber: {
    configurable: true,
    value: function rgbNumber() {
      assertThisInstanceOf(this);
      const rgb = this.rgb().color;

      /* eslint-disable-next-line no-bitwise */
      return ((rgb[0] & 0xff) << 16) | ((rgb[1] & 0xff) << 8) | (rgb[2] & 0xff);
    },
  },

  /**
   * @param {number} [places=6] - The number of places to round to.
   * @returns {number} - The current luminosity value.
   */
  luminosity: {
    configurable: true,
    value: function luminosity(places) {
      assertThisInstanceOf(this);
      /** @see {http://www.w3.org/TR/WCAG20/#relativeluminancedef} */
      const rgb = this.rgb().color;
      const lum = map(rgb, function iteratee(channel) {
        const chan = channel / 255;

        return chan <= 0.03928 ? chan / 12.92 : mathPow((chan + 0.055) / 1.055, 2.4);
      });

      return roundTo(0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2], getPlaces(places, TO_FIXED_NORMAL));
    },
  },

  /**
   * @param {number} [places=6] - The number of places to round to.
   * @param {Color} color2 - The color object to contrast this color with.
   * @returns {number} - The contrast value.
   */
  contrast: {
    configurable: true,
    value: function contrast(color2, places) {
      assertThisInstanceOf(this);
      assertInstanceOf(color2, 'contrast');
      /** @see {http://www.w3.org/TR/WCAG20/#contrast-ratiodef} */
      const lum1 = this.luminosity(TO_FIXED_MAX);
      const lum2 = color2.luminosity(TO_FIXED_MAX);
      const value = lum1 > lum2 ? (lum1 + 0.05) / (lum2 + 0.05) : (lum2 + 0.05) / (lum1 + 0.05);

      return roundTo(value, getPlaces(places, TO_FIXED_NORMAL));
    },
  },

  /**
   * @param {Color} color2 - The color object to contrast this color with.
   * @returns {string} - The WCAG contrast level.
   */
  level: {
    configurable: true,
    value: function level(color2) {
      assertThisInstanceOf(this);
      assertInstanceOf(color2, 'level');
      const contrastRatio = this.contrast(color2);

      if (contrastRatio >= minimums.aaa) {
        return AAA;
      }

      return contrastRatio >= minimums.aa ? AA : EMPTY_STRING;
    },
  },

  /**
   * @returns {boolean} - True if color is considered dark.
   */
  isDark: {
    configurable: true,
    value: function isDark() {
      assertThisInstanceOf(this);
      const rgb = this.rgb().color;
      /**
       * YIQ equation.
       *
       * @see {http://24ways.org/2010/calculating-color-contrast}
       */
      const yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;

      return yiq < 128;
    },
  },

  /**
   * @returns {boolean} - True if color is considered light.
   */
  isLight: {
    configurable: true,
    value: function isLight() {
      assertThisInstanceOf(this);

      return this.isDark() === false;
    },
  },

  /**
   * @returns {Color} - The new negated color.
   */
  negate: {
    configurable: true,
    value: function negate() {
      assertThisInstanceOf(this);

      const rgb = reduce(
        rgbKeys,
        function iteratee(object, key) {
          object[key] = 255 - object[key];

          return object;
        },
        this.rgb().object(),
      );

      if (this.valpha !== 1) {
        rgb.alpha = this.valpha;
      }

      return new Color(rgb, this.model);
    },
  },

  /**
   * @param {number} ratio - The ratio to lighten by.
   * @returns {Color} - The new lightened color.
   */
  lighten: {
    configurable: true,
    value: function lighten(ratio) {
      assertThisInstanceOf(this);
      const color = slice(this.hsl().color);
      const obj = {
        h: color[0],
        l: color[2] + color[2] * ratio,
        s: color[1],
      };

      if (this.valpha !== 1) {
        obj.alpha = this.valpha;
      }

      return new Color(obj, this.model);
    },
  },

  /**
   * @param {number} ratio - The ratio to darken by.
   * @returns {Color} - The new darkened color.
   */
  darken: {
    configurable: true,
    value: function darken(ratio) {
      assertThisInstanceOf(this);
      const color = slice(this.hsl().color);
      const obj = {
        h: color[0],
        l: color[2] - color[2] * ratio,
        s: color[1],
      };

      if (this.valpha !== 1) {
        obj.alpha = this.valpha;
      }

      return new Color(obj, this.model);
    },
  },

  /**
   * @param {number} ratio - The ratio to saturate by.
   * @returns {Color} - The new saturated color.
   */
  saturate: {
    configurable: true,
    value: function saturate(ratio) {
      assertThisInstanceOf(this);
      const color = slice(this.hsl().color);
      const obj = {
        h: color[0],
        l: color[2],
        s: color[1] + color[1] * ratio,
      };

      if (this.valpha !== 1) {
        obj.alpha = this.valpha;
      }

      return new Color(obj, this.model);
    },
  },

  /**
   * @param {number} ratio - The ratio to desaturate by.
   * @returns {Color} - The new desaturated color.
   */
  desaturate: {
    configurable: true,
    value: function desaturate(ratio) {
      assertThisInstanceOf(this);
      const color = slice(this.hsl().color);
      const obj = {
        h: color[0],
        l: color[2],
        s: color[1] - color[1] * ratio,
      };

      if (this.valpha !== 1) {
        obj.alpha = this.valpha;
      }

      return new Color(obj, this.model);
    },
  },

  /**
   * @param {number} ratio - The ratio to whiten by.
   * @returns {Color} - The new whitened color.
   */
  whiten: {
    configurable: true,
    value: function whiten(ratio) {
      assertThisInstanceOf(this);
      const color = slice(this.hwb().color);
      const obj = {
        b: color[2],
        h: color[0],
        w: color[1] + color[1] * ratio,
      };

      if (this.valpha !== 1) {
        obj.alpha = this.valpha;
      }

      return new Color(obj, this.model);
    },
  },

  /**
   * @param {number} ratio - The ratio to blacken by.
   * @returns {Color} - The new blackened color.
   */
  blacken: {
    configurable: true,
    value: function blacken(ratio) {
      assertThisInstanceOf(this);
      const color = slice(this.hwb().color);
      const obj = {
        b: color[2] + color[2] * ratio,
        h: color[0],
        w: color[1],
      };

      if (this.valpha !== 1) {
        obj.alpha = this.valpha;
      }

      return new Color(obj, this.model);
    },
  },

  /**
   * @returns {Color} - The new greyscale color.
   */
  grayscale: {
    configurable: true,
    value: function greyscale() {
      assertThisInstanceOf(this);
      /** @see {http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale} */
      const rgb = this.rgb().color;
      const val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;

      return Color.rgb(val, val, val);
    },
  },

  /**
   * @param {number} ratio - The ratio to fade by.
   * @returns {Color} - The new faded color.
   */
  fade: {
    configurable: true,
    value: function fade(ratio) {
      assertThisInstanceOf(this);

      return this.alpha(this.valpha - this.valpha * ratio);
    },
  },

  /**
   * @param {number} ratio - The ratio to modify opacity by.
   * @returns {Color} - The new opacity modified color.
   */
  opaquer: {
    configurable: true,
    value: function opaquer(ratio) {
      assertThisInstanceOf(this);

      return this.alpha(this.valpha + this.valpha * ratio);
    },
  },

  /**
   * @param {number} degrees - The number of degrees to rotate by.
   * @returns {Color} - The new rotated color.
   */
  rotate: {
    configurable: true,
    value: function rotate(degrees) {
      assertThisInstanceOf(this);
      const color = slice(this.hsl().color);
      const hue = color[0];
      const hueAngle = (hue + degrees) % 360;
      color[0] = hueAngle < 0 ? 360 + hueAngle : hueAngle;

      const obj = {
        h: color[0],
        l: color[2],
        s: color[1],
      };

      if (this.valpha !== 1) {
        obj.alpha = this.valpha;
      }

      return new Color(obj, this.model);
    },
  },

  /**
   * @param {Color} mixinColor - The color to mix in.
   * @param {number} [weight=0.5] - The mixing weight.
   * @returns {Color} - The new mixed color.
   * @throws {Error} If mixinColor is not a Color object.
   */
  mix: {
    configurable: true,
    value: function mix(mixinColor, weight) {
      assertThisInstanceOf(this);
      /**
       * Ported from sass implementation in C.
       *
       * @see {https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209}
       */
      assertInstanceOf(mixinColor, 'mix');
      const color1 = mixinColor.rgb();
      const color2 = this.rgb();
      const p = arguments.length >= 2 ? weight : 0.5;

      const w = 2 * p - 1;
      const a = color1.alpha() - color2.alpha();

      const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
      const w2 = 1 - w1;

      return Color.rgb(
        w1 * color1.red() + w2 * color2.red(),
        w1 * color1.green() + w2 * color2.green(),
        w1 * color1.blue() + w2 * color2.blue(),
        color1.alpha() * p + color2.alpha() * (1 - p),
      );
    },
  },
});

renameFunction(Color.prototype.toString, 'toString', true);

const maxfn100 = maxfn(100);
const maxfn255 = maxfn(255);

// eslint-disable jsdoc/check-param-names
// noinspection JSCommentMatchesSignature
/**
 * @function getset
 * @param {string|Array<string>} model - The model(s).
 * @param {number} channel - The channel number.
 * @param {Function} [modifier] - The modifier function.
 * @returns {Function} - The bound getset function.
 */
// eslint-enable jsdoc/check-param-names
const getset = function getset(model, channel) {
  const modelArray = castArray(model);
  /* eslint-disable-next-line prefer-rest-params */
  const modifier = arguments[2];

  forEach(modelArray, function iteratee(m) {
    if (isArray(limiters[m]) === false) {
      limiters[m] = [];
    }

    limiters[m][channel] = modifier;
  });

  const [modelValue] = modelArray;

  return function boundGetset(value) {
    /* eslint-disable-next-line babel/no-invalid-this */
    assertThisInstanceOf(this);

    if (arguments.length) {
      const val = modifier ? modifier(value) : value;
      /* eslint-disable-next-line babel/no-invalid-this */
      const colorInstance = this[modelValue]();
      const color = slice(colorInstance.color);
      color[channel] = val;
      const object = reduce(
        split(modelValue, EMPTY_STRING),
        function iteratee(obj, key, index) {
          obj[key] = color[index];

          return obj;
        },
        {},
      );

      /* eslint-disable-next-line babel/no-invalid-this */
      if (this.valpha !== 1) {
        /* eslint-disable-next-line babel/no-invalid-this */
        object.alpha = this.valpha;
      }

      return new Color(object, modelValue);
    }

    /* eslint-disable-next-line babel/no-invalid-this */
    const colorChannel = this[modelValue]().color[channel];

    return modifier ? modifier(colorChannel) : colorChannel;
  };
};

defineProperties(Color.prototype, {
  a: {
    configurable: true,
    value: getset(LAB, 1),
  },
  b: {
    configurable: true,
    value: getset(LAB, 2),
  },
  black: {
    configurable: true,
    value: getset(CMYK, 3, maxfn100),
  },

  blue: {
    configurable: true,
    value: getset(RGB, 2, maxfn255),
  },

  chroma: {
    configurable: true,
    value: getset(HCG, 1, maxfn100),
  },
  cyan: {
    configurable: true,
    value: getset(CMYK, 0, maxfn100),
  },

  gray: {
    configurable: true,
    value: getset(HCG, 2, maxfn100),
  },
  green: {
    configurable: true,
    value: getset(RGB, 1, maxfn255),
  },

  hue: {
    configurable: true,
    value: getset([HSL, HSV, HWB, HCG], 0, function modifier(val) {
      return ((val % 360) + 360) % 360;
    }),
  },
  l: {
    configurable: true,
    value: getset(LAB, 0, maxfn100),
  },

  lightness: {
    configurable: true,
    value: getset(HSL, 2, maxfn100),
  },
  magenta: {
    configurable: true,
    value: getset(CMYK, 1, maxfn100),
  },

  /* rgb */
  red: {
    configurable: true,
    value: getset(RGB, 0, maxfn255),
  },
  saturationl: {
    configurable: true,
    value: getset(HSL, 1, maxfn100),
  },
  saturationv: {
    configurable: true,
    value: getset(HSV, 1, maxfn100),
  },
  value: {
    configurable: true,
    value: getset(HSV, 2, maxfn100),
  },

  wblack: {
    configurable: true,
    value: getset(HWB, 2, maxfn100),
  },
  white: {
    configurable: true,
    value: getset(HWB, 1, maxfn100),
  },
  x: {
    configurable: true,
    value: getset(XYZ, 0, maxfn100),
  },

  y: {
    configurable: true,
    value: getset(XYZ, 1, maxfn100),
  },
  yellow: {
    configurable: true,
    value: getset(CMYK, 2, maxfn100),
  },
  z: {
    configurable: true,
    value: getset(XYZ, 2, maxfn100),
  },
});

/* model conversion methods and static constructors */
forEach(objectKeys(convert), function iteratee(model) {
  if (includes(skippedModels, model)) {
    return;
  }

  const {channels} = convert[model];

  /* conversion methods */
  defineProperty(Color.prototype, model, {
    configurable: true,
    value: function conversionMethod() {
      assertThisInstanceOf(this);

      if (this.model === model) {
        return new Color(this);
      }

      /* eslint-disable-next-line prefer-rest-params */
      const args = slice(arguments);

      if (args.length) {
        return new Color(args, model);
      }

      const newAlpha = typeof args[channels] === 'number' ? channels : this.valpha;

      return new Color(concat(castArray(convert[this.model][model].raw(this.color)), newAlpha), model);
    },
  });

  renameFunction(Color.prototype[model], `conversionMethod${model.toUpperCase()}`);

  /* 'static' construction methods */
  defineProperty(Color, model, {
    configurable: true,
    enumerable: true,
    value: function constructionMethod() {
      const Ctr = assertIsFunction(this, 'Bad Color constructor');
      /* eslint-disable-next-line prefer-rest-params */
      const args = slice(arguments);
      const color = args[0];
      const col = typeof color === 'number' ? zeroArray(args, channels) : color;

      return new Ctr(col, model);
    },
  });

  renameFunction(Color[model], `constructionMethod${model.toUpperCase()}`);
});

export default Color;
