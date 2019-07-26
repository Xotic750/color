<a
  href="https://travis-ci.org/Xotic750/color"
  title="Travis status">
<img
  src="https://travis-ci.org/Xotic750/color.svg?branch=master"
  alt="Travis status" height="18">
</a>
<a
  href="https://david-dm.org/Xotic750/color"
  title="Dependency status">
<img src="https://david-dm.org/Xotic750/color/status.svg"
  alt="Dependency status" height="18"/>
</a>
<a
  href="https://david-dm.org/Xotic750/color?type=dev"
  title="devDependency status">
<img src="https://david-dm.org/Xotic750/color/dev-status.svg"
  alt="devDependency status" height="18"/>
</a>
<a
  href="https://badge.fury.io/js/%40xotic750%2color"
  title="npm version">
<img src="https://badge.fury.io/js/%40xotic750%2color.svg"
  alt="npm version" height="18">
</a>
<a
  href="https://www.jsdelivr.com/package/npm/@xotic750/color"
  title="jsDelivr hits">
<img src="https://data.jsdelivr.com/v1/package/npm/@xotic750/color/badge?style=rounded"
  alt="jsDelivr hits" height="18">
</a>
<a
  href="https://bettercodehub.com/results/Xotic750/color"
  title="bettercodehub score">
<img src="https://bettercodehub.com/edge/badge/Xotic750/color?branch=master"
  alt="bettercodehub score" height="18">
</a>

# @xotic750/color

> JavaScript library for immutable color conversion and manipulation with support for CSS color strings.

```js
const color = Color('#7743CE')
  .alpha(0.5)
  .lighten(0.5);
console.log(color.hsl().string()); // 'hsla(262, 59%, 81%, 0.5)'

console.log(
  color
    .cmyk()
    .round()
    .array(),
); // [ 16, 25, 0, 8, 0.5 ]

console.log(color.ansi256().object()); // { ansi256: 183, alpha: 0.5 }
```

## Install

```console
$ npm install color
```

## Usage

```js
import Color from 'color';
```

### Constructors

```js
const color = Color('rgb(255, 255, 255)');
const color = Color({r: 255, g: 255, b: 255});
const color = Color.rgb(255, 255, 255);
const color = Color.rgb([255, 255, 255]);
```

Set the values for individual channels with `alpha`, `red`, `green`, `blue`, `hue`, `saturationl` (hsl), `saturationv` (hsv), `lightness`, `whiteness`, `blackness`, `cyan`, `magenta`, `yellow`, `black`

String constructors are handled by [color-string](https://www.npmjs.com/package/color-string)

### Getters

```js
color.hsl();
```

Convert a color to a different space (`hsl()`, `cmyk()`, etc.).

```js
color.object(); // {r: 255, g: 255, b: 255}
```

Get a hash of the color value. Reflects the color's current model (see above).

```js
color.rgb().array(); // [255, 255, 255]
```

Get an array of the values with `array()`. Reflects the color's current model (see above).

```js
color.rgbNumber(); // 16777215 (0xffffff)
```

Get the rgb number value.

```js
color.hex(); // 0xffffff
```

Get the hex value.

```js
color.red(); // 255
```

Get the value for an individual channel.

### CSS Strings

```js
color.hsl().string(); // 'hsl(320, 50%, 100%)'
```

Calling `.string()` with a number rounds the numbers to that decimal place. It defaults to 1.

### Luminosity

```js
color.luminosity(); // 0.412
```

The [WCAG luminosity](http://www.w3.org/TR/WCAG20/#relativeluminancedef) of the color. 0 is black, 1 is white.

```js
color.contrast(Color('blue')); // 12
```

The [WCAG contrast ratio](http://www.w3.org/TR/WCAG20/#contrast-ratiodef) to another color, from 1 (same color) to 21 (contrast b/w white and black).

```js
color.isLight(); // true
color.isDark(); // false
```

Get whether the color is "light" or "dark", useful for deciding text color.

### Manipulation

Returns a new instance of Color.

```js
color.negate(); // rgb(0, 100, 255) -> rgb(255, 155, 0)

color.lighten(0.5); // hsl(100, 50%, 50%) -> hsl(100, 50%, 75%)
color.darken(0.5); // hsl(100, 50%, 50%) -> hsl(100, 50%, 25%)

color.saturate(0.5); // hsl(100, 50%, 50%) -> hsl(100, 75%, 50%)
color.desaturate(0.5); // hsl(100, 50%, 50%) -> hsl(100, 25%, 50%)
color.grayscale(); // #5CBF54 -> #969696

color.whiten(0.5); // hwb(100, 50%, 50%) -> hwb(100, 75%, 50%)
color.blacken(0.5); // hwb(100, 50%, 50%) -> hwb(100, 50%, 75%)

color.fade(0.5); // rgba(10, 10, 10, 0.8) -> rgba(10, 10, 10, 0.4)
color.opaquer(0.5); // rgba(10, 10, 10, 0.8) -> rgba(10, 10, 10, 1.0)

color.rotate(180); // hsl(60, 20%, 20%) -> hsl(240, 20%, 20%)
color.rotate(-90); // hsl(60, 20%, 20%) -> hsl(330, 20%, 20%)

color.mix(Color('yellow')); // cyan -> rgb(128, 255, 128)
color.mix(Color('yellow'), 0.3); // cyan -> rgb(77, 255, 179)

// chaining
color
  .green(100)
  .grayscale()
  .lighten(0.6);
```
