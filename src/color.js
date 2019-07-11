import colorString from 'color-string';
import convert from 'color-convert';
import clamp from 'lodash/clamp';
import slice from 'lodash/slice';
import round from 'lodash/round';
import castArray from 'lodash/castArray';
import has from 'lodash/has';
import isNil from 'lodash/isNil';
import toInteger from 'lodash/toInteger';
import includes from 'lodash/includes';
import isSafeInteger from 'lodash/isSafeInteger';

/**
 * Test if a value is a counting number, 1 -> MAX_SAFE_INTEGER.
 *
 * @param {*} value - The value to be tested.
 * @returns {boolean} True if value is a counting number.
 */
const isCountingNumber = function isCountingNumber(value) {
  return isSafeInteger(value) && value > 0;
};

const EMPTY_STRING = '';
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
const rgbKeys = Object.freeze(RGB.split(EMPTY_STRING));
/** @type {ReadonlyArray<string>} */
const skippedModels = Object.freeze([
  /* to be honest, I don't really feel like keyword belongs in color convert, but eh. */
  'keyword',

  /* gray conflicts with some method names, and has its own method defined. */
  'gray',

  /* shouldn't really be in color-convert either... */
  'hex',
]);

/** @type {Readonly<string>} */
export const hashedModelKeys = Object.freeze(
  Object.keys(convert).reduce((hashed, model) => {
    const prop = slice(convert[model].labels)
      .sort()
      .join(EMPTY_STRING);

    hashed[prop] = model;

    return hashed;
  }, Object.create(null)),
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
const minimums = Object.freeze({
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
const isModel = function isModel(value) {
  return typeof value === 'string' && Boolean(value.trim());
};

/**
 * Convert value to appropriate number for rounding places.
 *
 * @param {*} value - The value to convert.
 * @param {number} [defaultTo=1] - The value to use if value is not a number.
 * @returns {number} - The number of places.
 */
const getPlaces = function getPlaces(value, defaultTo = 1) {
  return typeof value === 'number' ? toInteger(value) || 0 : defaultTo;
};

/**
 * Convert a color object to an array.
 *
 * @param {Color} colorObject - The color object.
 * @returns {Array<number>} - The array from the color object.
 */
const getColorArray = function getColorArray(colorObject) {
  const {color, valpha} = colorObject;

  // noinspection JSIncompatibleTypesComparison
  return valpha === 1 ? color : [...color, valpha];
};

/**
 * Get the model.
 *
 * @param {*} value - The value provided as the model.
 * @returns {null|string} - The model.
 * @throws {Error} - If model is invalid.
 */
const getModel = function getModel(value) {
  if (isModel(value)) {
    if (includes(skippedModels, value)) {
      return null;
    }

    if (!has(convert, value)) {
      throw new Error(`Unknown model: ${value}`);
    }
  }

  return value;
};

/**
 * @type {Readonly<{enumerable: boolean, configurable: boolean, writable: boolean}>}
 * */
const instanceLockDescription = Object.freeze({
  configurable: false,
  enumerable: true,
  writable: false,
});

/**
 *
 * @type {Readonly<{color: Readonly<{enumerable: boolean, configurable: boolean, writable: boolean}>, model: Readonly<{enumerable: boolean, configurable: boolean, writable: boolean}>, valpha: Readonly<{enumerable: boolean, configurable: boolean, writable: boolean}>}>}
 */
const colorDescription = Object.freeze({
  color: instanceLockDescription,
  model: instanceLockDescription,
  valpha: instanceLockDescription,
});

const limiters = Object.create(null);

/**
 * The Color class.
 *
 * @class Color
 * @type {object}
 * @property {Array<number>} color - The color represented in the model array.
 * @property {string} model - The color model.
 * @property {number} valpha - The alpha value of the color.
 */
export default class Color {
  /**
   * @param {*} obj - The color definition.
   * @param {string} [modelOption] - The model.
   */
  constructor(obj, modelOption) {
    const model = getModel(modelOption);

    if (isNil(obj)) {
      this.model = RGB;
      this.color = [0, 0, 0];
      this.valpha = 1;
    } else if (obj instanceof Color) {
      this.model = obj.model;
      this.color = [...obj.color];
      this.valpha = obj.valpha;
    } else if (typeof obj === 'string') {
      const result = colorString.get(obj);

      if (result === null) {
        throw new Error(`Unable to parse color from string: ${obj}`);
      }

      this.model = result.model;
      const {channels} = convert[this.model];
      this.color = result.value.slice(0, channels);
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

      const keys = Object.keys(obj);

      if (has(obj, ALPHA)) {
        keys.splice(keys.indexOf(ALPHA), 1);
        this.valpha = typeof obj.alpha === 'number' ? obj.alpha : 0;
      }

      const hashedKeys = keys.sort().join(EMPTY_STRING);

      if (!has(hashedModelKeys, hashedKeys)) {
        throw new Error(`Unable to parse color from object: ${JSON.stringify(obj)}`);
      }

      this.model = hashedModelKeys[hashedKeys];

      const color = convert[this.model].labels.split(EMPTY_STRING).map((label) => obj[label]);

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

    Object.freeze(this.color);
    Object.defineProperties(this, colorDescription);
  }

  /**
   * @returns {string} - The string representation.
   */
  toString() {
    return this.string();
  }

  // toJSON() {
  //   return this[this.model]();
  // }

  /**
   * @param {number} [places] - The number of places to round to.
   * @returns {string} - The string representation.
   */
  string(places) {
    const colorObject = (has(colorString.to, this.model) ? this : this.rgb()).round(getPlaces(places));
    const args = getColorArray(colorObject);

    return colorString.to[colorObject.model](args);
  }

  /**
   * @param {number} [places] - The number of places to round to.
   * @returns {string} - The string representation.
   */
  percentString(places) {
    const colorObject = this.rgb().round(getPlaces(places));
    const args = getColorArray(colorObject);

    return colorString.to.rgb.percent(args);
  }

  /**
   * @returns {Array<number>} - An array representation of the model.
   */
  array() {
    return getColorArray(this);
  }

  /**
   * @returns {object} - The plain object representation of the model.
   */
  object() {
    const {labels} = convert[this.model];
    const result = labels.split(EMPTY_STRING).reduce((obj, key, index) => {
      obj[key] = this.color[index];

      return obj;
    }, {});

    if (this.valpha !== 1) {
      result.alpha = this.valpha;
    }

    return result;
  }

  /**
   * @returns {Array<number>} - An rgb array representation.
   */
  unitArray() {
    const rgb = this.rgb().color.map((value) => value / 255);

    if (this.valpha !== 1) {
      rgb.push(this.valpha);
    }

    return rgb;
  }

  /**
   * @returns {object} - The rgb plain object representation.
   */
  unitObject() {
    const rgb = rgbKeys.reduce((object, key) => {
      object[key] /= 255;

      return object;
    }, this.rgb().object());

    if (this.valpha !== 1) {
      rgb.alpha = this.valpha;
    }

    return rgb;
  }

  /**
   * @param {number} [places] - The number of places to round to.
   * @returns {Color} - A new Color object that has been rounded as specified.
   */
  round(places) {
    const placesMax = Math.max(getPlaces(places, 0), 0);

    // noinspection JSCheckFunctionSignatures
    return new Color(
      [
        ...this.color.map((value) => {
          return round(value, placesMax);
        }),
        this.valpha,
      ],
      this.model,
    );
  }

  /**
   * @param {number} [val] - The value to modify by.
   * @returns {number|Color} - A new Color object if val is specified, or the current alpha.
   */
  alpha(val) {
    if (arguments.length) {
      return new Color([...this.color, clamp(val, 0, 1)], this.model);
    }

    return this.valpha;
  }

  /**
   * @param {*} [val] - A new color definition.
   * @returns {string|Color} - A new Color object if val is specified, or the current keyword.
   */
  keyword(val) {
    if (arguments.length) {
      return new Color(val);
    }

    return convert[this.model].keyword(this.color);
  }

  /**
   * @param {*} [val] - A new color definition.
   * @returns {string|Color} - A new Color object if val is specified, or the current hex.
   */
  hex(val) {
    if (arguments.length) {
      return new Color(val);
    }

    return colorString.to.hex(this.rgb().round().color);
  }

  /**
   * @returns {number} - The current RGB value.
   */
  rgbNumber() {
    const rgb = this.rgb().color;

    /* eslint-disable-next-line no-bitwise */
    return ((rgb[0] & 0xff) << 16) | ((rgb[1] & 0xff) << 8) | (rgb[2] & 0xff);
  }

  /**
   * @returns {number} - The current luminosity value.
   */
  luminosity() {
    /** @see {http://www.w3.org/TR/WCAG20/#relativeluminancedef} */
    const rgb = this.rgb().color;
    const lum = rgb.map((channel) => {
      const chan = channel / 255;

      return chan <= 0.03928 ? chan / 12.92 : ((chan + 0.055) / 1.055) ** 2.4;
    });

    return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
  }

  /**
   * @param {Color} color2 - The color object to contrast this color with.
   * @returns {number} - The contrast value.
   */
  contrast(color2) {
    if (!(color2 instanceof Color)) {
      throw new Error(`Argument to "contrast" was not a Color instance, but rather an instance of ${typeof color2}`);
    }

    /** @see {http://www.w3.org/TR/WCAG20/#contrast-ratiodef} */
    const lum1 = this.luminosity();
    const lum2 = color2.luminosity();

    if (lum1 > lum2) {
      return (lum1 + 0.05) / (lum2 + 0.05);
    }

    return (lum2 + 0.05) / (lum1 + 0.05);
  }

  /**
   * @param {Color} color2 - The color object to contrast this color with.
   * @returns {string} - The WCAG contrast level.
   */
  level(color2) {
    if (!(color2 instanceof Color)) {
      throw new Error(`Argument to "level" was not a Color instance, but rather an instance of ${typeof color2}`);
    }

    const contrastRatio = this.contrast(color2);

    if (contrastRatio >= minimums.aaa) {
      return AAA;
    }

    return contrastRatio >= minimums.aa ? AA : EMPTY_STRING;
  }

  /**
   * @returns {boolean} - True if color is considered dark.
   */
  isDark() {
    const rgb = this.rgb().color;
    /**
     * YIQ equation.
     *
     * @see {http://24ways.org/2010/calculating-color-contrast}
     */
    const yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;

    return yiq < 128;
  }

  /**
   * @returns {boolean} - True if color is considered light.
   */
  isLight() {
    return !this.isDark();
  }

  /**
   * @returns {Color} - The new negated color.
   */
  negate() {
    const rgb = rgbKeys.reduce((object, key) => {
      object[key] = 255 - object[key];

      return object;
    }, this.rgb().object());

    if (this.valpha !== 1) {
      rgb.alpha = this.valpha;
    }

    return new Color(rgb, this.model);
  }

  /**
   * @param {number} ratio - The ratio to lighten by.
   * @returns {Color} - The new lightened color.
   */
  lighten(ratio) {
    const color = [...this.hsl().color];
    const obj = {
      h: color[0],
      l: color[2] + color[2] * ratio,
      s: color[1],
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
  darken(ratio) {
    const color = [...this.hsl().color];
    const obj = {
      h: color[0],
      l: color[2] - color[2] * ratio,
      s: color[1],
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
  saturate(ratio) {
    const color = [...this.hsl().color];
    const obj = {
      h: color[0],
      l: color[2],
      s: color[1] + color[1] * ratio,
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
  desaturate(ratio) {
    const color = [...this.hsl().color];
    const obj = {
      h: color[0],
      l: color[2],
      s: color[1] - color[1] * ratio,
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
  whiten(ratio) {
    const color = [...this.hwb().color];
    const obj = {
      b: color[2],
      h: color[0],
      w: color[1] + color[1] * ratio,
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
  blacken(ratio) {
    const color = [...this.hwb().color];
    const obj = {
      b: color[2] + color[2] * ratio,
      h: color[0],
      w: color[1],
    };

    if (this.valpha !== 1) {
      obj.alpha = this.valpha;
    }

    return new Color(obj, this.model);
  }

  /**
   * @returns {Color} - The new greyscale color.
   */
  grayscale() {
    /** @see {http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale} */
    const rgb = this.rgb().color;
    const val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;

    return Color.rgb(val, val, val);
  }

  /**
   * @param {number} ratio - The ratio to fade by.
   * @returns {Color} - The new faded color.
   */
  fade(ratio) {
    return this.alpha(this.valpha - this.valpha * ratio);
  }

  /**
   * @param {number} ratio - The ratio to modify opacity by.
   * @returns {Color} - The new opacity modified color.
   */
  opaquer(ratio) {
    return this.alpha(this.valpha + this.valpha * ratio);
  }

  /**
   * @param {number} degrees - The number of degrees to rotate by.
   * @returns {Color} - The new rotated color.
   */
  rotate(degrees) {
    const color = [...this.hsl().color];
    const [hue] = color;
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
  }

  /**
   * @param {Color} mixinColor - The color to mix in.
   * @param {number} [weight=0.5] - The mixing weight.
   * @returns {Color} - The new mixed color.
   * @throws {Error} if mixinColor is not a Color object.
   */
  mix(mixinColor, weight) {
    /**
     * Ported from sass implementation in C.
     *
     * @see {https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209}
     */
    if (!(mixinColor instanceof Color)) {
      throw new Error(`Argument to "mix" was not a Color instance, but rather an instance of ${typeof mixinColor}`);
    }

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
  }
}

const maxfn100 = maxfn(100);
const maxfn255 = maxfn(255);

/**
 * @param {string|Array<string>} model - The model(s).
 * @param {number} channel - The channel number.
 * @param {Function} [modifier] - The modifier function.
 * @returns {Function} - The bound getset function.
 */
const getset = function getset(model, channel, modifier) {
  const modelArray = castArray(model);

  modelArray.forEach((m) => {
    if (!Array.isArray(limiters[m])) {
      limiters[m] = [];
    }

    limiters[m][channel] = modifier;
  });

  const [modelValue] = modelArray;

  return function boundGetset(value) {
    if (arguments.length) {
      const val = modifier ? modifier(value) : value;
      /* eslint-disable-next-line babel/no-invalid-this */
      const colorInstance = this[modelValue]();
      const color = [...colorInstance.color];
      color[channel] = val;
      const object = modelValue.split(EMPTY_STRING).reduce((obj, key, index) => {
        obj[key] = color[index];

        return obj;
      }, {});

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

Object.defineProperties(Color.prototype, {
  a: {
    value: getset(LAB, 1),
  },
  b: {
    value: getset(LAB, 2),
  },
  black: {
    value: getset(CMYK, 3, maxfn100),
  },

  blue: {
    value: getset(RGB, 2, maxfn255),
  },

  chroma: {
    value: getset(HCG, 1, maxfn100),
  },
  cyan: {
    value: getset(CMYK, 0, maxfn100),
  },

  gray: {
    value: getset(HCG, 2, maxfn100),
  },
  green: {
    value: getset(RGB, 1, maxfn255),
  },

  hue: {
    value: getset([HSL, HSV, HWB, HCG], 0, (val) => ((val % 360) + 360) % 360),
  },
  l: {
    value: getset(LAB, 0, maxfn100),
  },

  lightness: {
    value: getset(HSL, 2, maxfn100),
  },
  magenta: {
    value: getset(CMYK, 1, maxfn100),
  },

  /* rgb */
  red: {
    value: getset(RGB, 0, maxfn255),
  },
  saturationl: {
    value: getset(HSL, 1, maxfn100),
  },
  saturationv: {
    value: getset(HSV, 1, maxfn100),
  },
  value: {
    value: getset(HSV, 2, maxfn100),
  },

  wblack: {
    value: getset(HWB, 2, maxfn100),
  },
  white: {
    value: getset(HWB, 1, maxfn100),
  },
  x: {
    value: getset(XYZ, 0, maxfn100),
  },

  y: {
    value: getset(XYZ, 1, maxfn100),
  },
  yellow: {
    value: getset(CMYK, 2, maxfn100),
  },
  z: {
    value: getset(XYZ, 2, maxfn100),
  },
});

/* model conversion methods and static constructors */
Object.keys(convert).forEach((model) => {
  if (includes(skippedModels, model)) {
    return;
  }

  const {channels} = convert[model];

  /* conversion methods */
  Object.defineProperty(Color.prototype, model, {
    value: function conversionMethod(...args) {
      if (this.model === model) {
        return new Color(this);
      }

      if (args.length) {
        return new Color(args, model);
      }

      const newAlpha = typeof args[channels] === 'number' ? channels : this.valpha;

      return new Color([...castArray(convert[this.model][model].raw(this.color)), newAlpha], model);
    },
  });

  /* 'static' construction methods */
  Object.defineProperty(Color, model, {
    enumerable: true,
    value: function constructionMethod(...args) {
      const [color] = args;
      const col = typeof color === 'number' ? zeroArray(args, channels) : color;

      return new Color(col, model);
    },
  });
});
