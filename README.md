<h1>
    <img src="admin/vistaragorm.png" width="64"/>
    ioBroker.vistaragorm
</h1>

[![NPM version](http://img.shields.io/npm/v/iobroker.vistaragorm.svg)](https://www.npmjs.com/package/iobroker.vistaragorm)
[![Downloads](https://img.shields.io/npm/dm/iobroker.vistaragorm.svg)](https://www.npmjs.com/package/iobroker.vistaragorm)
[![Dependency Status](https://img.shields.io/david/Taragorm/iobroker.vistaragorm.svg)](https://david-dm.org/Taragorm/iobroker.vistaragorm)
[![Known Vulnerabilities](https://snyk.io/test/github/Taragorm/ioBroker.vistaragorm/badge.svg)](https://snyk.io/test/github/Taragorm/ioBroker.vistaragorm)

[![NPM](https://nodei.co/npm/iobroker.vistaragorm.png?downloads=true)](https://nodei.co/npm/iobroker.vistaragorm/)

**Tests:** Linux/Mac: [![Travis-CI](http://img.shields.io/travis/Taragorm/ioBroker.vistaragorm/master.svg)](https://travis-ci.org/Taragorm/ioBroker.vistaragorm)
Windows: [![AppVeyor](https://ci.appveyor.com/api/projects/status/github/Taragorm/ioBroker.vistaragorm?branch=master&svg=true)](https://ci.appveyor.com/project/Taragorm/ioBroker-vistaragorm/)

## vistaragorm adapter for ioBroker

Some simple Visualisations.

These are controls whose background colour changes to represent one or more of the values. While intended for temperatures, they could be used for other purposes.

## nbox

 * Shows 1 to 3 values in a vertical list with title
 * Each value may be individually formatted (sprintf-like syntax)
 * Background colour depends on value of 1st item.
 * Background colour change can have sharp trasitions, or be interpolated


## mvsp
 * Shows 2 values (measured, setpoint) in a vertical list like ``nbox11`` above.
 * Value may be custom formatted (sprintf-like syntax)
 * Background colour depends on value of 1st item.
 * Background colour change can have sharp trasitions, or be interpolated
 * Background is a radial blend, with the mv color being the centre of the widget, and the outer colour being the sp derived colour. 
 * If `offSp` is set, setpoints below this value will be suppressed for two-colour blends, and only the `mv` will be used.


### Colour Generation - `colours` and `interpolate`

Colours are generated from a list of switch points and colour codes, e.g.

```json
    $indoor: [
    	{ t:15, b: 0x1E90FF, f:0x0000 },
    	{ t:18, b: 0x0bb000, f:0x0000 },
    	{ t:21, b: 0xdddd00, f:0x0000 },
    	{ t:24, b: 0xff0000, f:0x0000 }
    ],    

    $outdoor: [
    	{ t:8,  b: 0x1E90FF, f:0x0000 },
    	{ t:12, b: 0x00bb00, f:0x0000 },
    	{ t:18, b: 0xdddd00, f:0x0000 },
    	{ t:22, b: 0xff0000, f:0x0000 }
    ],    

```
Where `t` = temperature, `b` = background colour and `f` = foreground colour. The colours MUST be numeric codes. (You can't use colour names like "green" for instance.)

 * The colours can be configured using the `colours` attribute. You can set `$indoor` (the default) `$outdoor` or a custom vector as described below .
 * Setting the `interpolate` attribute means the widget will try to work out intermediate colours if the temperature lies between two values.
 * The default is `$indoor`

#### Custom Colour Vector

```
10 blue
15 green
30 red white
```

If the `colours` attribute does not start with `$`, then it is assumed to be a list of switchpoints and associated colour(s), one per line, with each line having the format:

```
<SwitchValue> <Background> [<Foreground>]
```

 * The switch value should be a number - rows should be in ascending order
 * The colours may be:
   * A HTML colour name
   * A 6 digit hex colour code e.g. #ff55ff
 * The default foreground is black

## Changelog

### 0.0.1-2
* (Taragorm) Dev

## License
MIT License

Copyright (c) 2019 Taragorm

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.