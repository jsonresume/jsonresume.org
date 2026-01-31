import { jsxs, jsx } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import o, { useState, useMemo, useEffect, useContext, useDebugValue, createElement, useRef } from "react";
import { marked } from "marked";
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p2 in s) if (Object.prototype.hasOwnProperty.call(s, p2)) t[p2] = s[p2];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __spreadArray(to, from2, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from2.length, ar; i < l; i++) {
    if (ar || !(i in from2)) {
      if (!ar) ar = Array.prototype.slice.call(from2, 0, i);
      ar[i] = from2[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from2));
}
typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
function memoize(fn) {
  var cache = /* @__PURE__ */ Object.create(null);
  return function(arg) {
    if (cache[arg] === void 0) cache[arg] = fn(arg);
    return cache[arg];
  };
}
var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|disableRemotePlayback|download|draggable|encType|enterKeyHint|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/;
var isPropValid = /* @__PURE__ */ memoize(
  function(prop) {
    return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111 && prop.charCodeAt(1) === 110 && prop.charCodeAt(2) < 91;
  }
  /* Z+1 */
);
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var shallowequal = function shallowEqual(objA, objB, compare, compareContext) {
  var ret = compare ? compare.call(compareContext, objA, objB) : void 0;
  if (ret !== void 0) {
    return !!ret;
  }
  if (objA === objB) {
    return true;
  }
  if (typeof objA !== "object" || !objA || typeof objB !== "object" || !objB) {
    return false;
  }
  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) {
    return false;
  }
  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  for (var idx = 0; idx < keysA.length; idx++) {
    var key = keysA[idx];
    if (!bHasOwnProperty(key)) {
      return false;
    }
    var valueA = objA[key];
    var valueB = objB[key];
    ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;
    if (ret === false || ret === void 0 && valueA !== valueB) {
      return false;
    }
  }
  return true;
};
const p = /* @__PURE__ */ getDefaultExportFromCjs(shallowequal);
var MS = "-ms-";
var MOZ = "-moz-";
var WEBKIT = "-webkit-";
var COMMENT = "comm";
var RULESET = "rule";
var DECLARATION = "decl";
var IMPORT = "@import";
var KEYFRAMES = "@keyframes";
var LAYER = "@layer";
var abs = Math.abs;
var from = String.fromCharCode;
var assign = Object.assign;
function hash(value, length2) {
  return charat(value, 0) ^ 45 ? (((length2 << 2 ^ charat(value, 0)) << 2 ^ charat(value, 1)) << 2 ^ charat(value, 2)) << 2 ^ charat(value, 3) : 0;
}
function trim(value) {
  return value.trim();
}
function match(value, pattern) {
  return (value = pattern.exec(value)) ? value[0] : value;
}
function replace(value, pattern, replacement) {
  return value.replace(pattern, replacement);
}
function indexof(value, search, position2) {
  return value.indexOf(search, position2);
}
function charat(value, index) {
  return value.charCodeAt(index) | 0;
}
function substr(value, begin, end) {
  return value.slice(begin, end);
}
function strlen(value) {
  return value.length;
}
function sizeof(value) {
  return value.length;
}
function append(value, array) {
  return array.push(value), value;
}
function combine(array, callback) {
  return array.map(callback).join("");
}
function filter(array, pattern) {
  return array.filter(function(value) {
    return !match(value, pattern);
  });
}
var line = 1;
var column = 1;
var length = 0;
var position = 0;
var character = 0;
var characters = "";
function node(value, root, parent, type, props, children, length2, siblings) {
  return { value, root, parent, type, props, children, line, column, length: length2, return: "", siblings };
}
function copy(root, props) {
  return assign(node("", null, null, "", null, null, 0, root.siblings), root, { length: -root.length }, props);
}
function lift(root) {
  while (root.root)
    root = copy(root.root, { children: [root] });
  append(root, root.siblings);
}
function char() {
  return character;
}
function prev() {
  character = position > 0 ? charat(characters, --position) : 0;
  if (column--, character === 10)
    column = 1, line--;
  return character;
}
function next() {
  character = position < length ? charat(characters, position++) : 0;
  if (column++, character === 10)
    column = 1, line++;
  return character;
}
function peek() {
  return charat(characters, position);
}
function caret() {
  return position;
}
function slice(begin, end) {
  return substr(characters, begin, end);
}
function token(type) {
  switch (type) {
    // \0 \t \n \r \s whitespace token
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5;
    // ! + , / > @ ~ isolate token
    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    // ; { } breakpoint token
    case 59:
    case 123:
    case 125:
      return 4;
    // : accompanied token
    case 58:
      return 3;
    // " ' ( [ opening delimit token
    case 34:
    case 39:
    case 40:
    case 91:
      return 2;
    // ) ] closing delimit token
    case 41:
    case 93:
      return 1;
  }
  return 0;
}
function alloc(value) {
  return line = column = 1, length = strlen(characters = value), position = 0, [];
}
function dealloc(value) {
  return characters = "", value;
}
function delimit(type) {
  return trim(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)));
}
function whitespace(type) {
  while (character = peek())
    if (character < 33)
      next();
    else
      break;
  return token(type) > 2 || token(character) > 3 ? "" : " ";
}
function escaping(index, count) {
  while (--count && next())
    if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97)
      break;
  return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32));
}
function delimiter(type) {
  while (next())
    switch (character) {
      // ] ) " '
      case type:
        return position;
      // " '
      case 34:
      case 39:
        if (type !== 34 && type !== 39)
          delimiter(character);
        break;
      // (
      case 40:
        if (type === 41)
          delimiter(type);
        break;
      // \
      case 92:
        next();
        break;
    }
  return position;
}
function commenter(type, index) {
  while (next())
    if (type + character === 47 + 10)
      break;
    else if (type + character === 42 + 42 && peek() === 47)
      break;
  return "/*" + slice(index, position - 1) + "*" + from(type === 47 ? type : next());
}
function identifier(index) {
  while (!token(peek()))
    next();
  return slice(index, position);
}
function compile(value) {
  return dealloc(parse("", null, null, null, [""], value = alloc(value), 0, [0], value));
}
function parse(value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
  var index = 0;
  var offset = 0;
  var length2 = pseudo;
  var atrule = 0;
  var property = 0;
  var previous = 0;
  var variable = 1;
  var scanning = 1;
  var ampersand = 1;
  var character2 = 0;
  var type = "";
  var props = rules;
  var children = rulesets;
  var reference = rule;
  var characters2 = type;
  while (scanning)
    switch (previous = character2, character2 = next()) {
      // (
      case 40:
        if (previous != 108 && charat(characters2, length2 - 1) == 58) {
          if (indexof(characters2 += replace(delimit(character2), "&", "&\f"), "&\f", abs(index ? points[index - 1] : 0)) != -1)
            ampersand = -1;
          break;
        }
      // " ' [
      case 34:
      case 39:
      case 91:
        characters2 += delimit(character2);
        break;
      // \t \n \r \s
      case 9:
      case 10:
      case 13:
      case 32:
        characters2 += whitespace(previous);
        break;
      // \
      case 92:
        characters2 += escaping(caret() - 1, 7);
        continue;
      // /
      case 47:
        switch (peek()) {
          case 42:
          case 47:
            append(comment(commenter(next(), caret()), root, parent, declarations), declarations);
            break;
          default:
            characters2 += "/";
        }
        break;
      // {
      case 123 * variable:
        points[index++] = strlen(characters2) * ampersand;
      // } ; \0
      case 125 * variable:
      case 59:
      case 0:
        switch (character2) {
          // \0 }
          case 0:
          case 125:
            scanning = 0;
          // ;
          case 59 + offset:
            if (ampersand == -1) characters2 = replace(characters2, /\f/g, "");
            if (property > 0 && strlen(characters2) - length2)
              append(property > 32 ? declaration(characters2 + ";", rule, parent, length2 - 1, declarations) : declaration(replace(characters2, " ", "") + ";", rule, parent, length2 - 2, declarations), declarations);
            break;
          // @ ;
          case 59:
            characters2 += ";";
          // { rule/at-rule
          default:
            append(reference = ruleset(characters2, root, parent, index, offset, rules, points, type, props = [], children = [], length2, rulesets), rulesets);
            if (character2 === 123)
              if (offset === 0)
                parse(characters2, root, reference, reference, props, rulesets, length2, points, children);
              else
                switch (atrule === 99 && charat(characters2, 3) === 110 ? 100 : atrule) {
                  // d l m s
                  case 100:
                  case 108:
                  case 109:
                  case 115:
                    parse(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length2, children), children), rules, children, length2, points, rule ? props : children);
                    break;
                  default:
                    parse(characters2, reference, reference, reference, [""], children, 0, points, children);
                }
        }
        index = offset = property = 0, variable = ampersand = 1, type = characters2 = "", length2 = pseudo;
        break;
      // :
      case 58:
        length2 = 1 + strlen(characters2), property = previous;
      default:
        if (variable < 1) {
          if (character2 == 123)
            --variable;
          else if (character2 == 125 && variable++ == 0 && prev() == 125)
            continue;
        }
        switch (characters2 += from(character2), character2 * variable) {
          // &
          case 38:
            ampersand = offset > 0 ? 1 : (characters2 += "\f", -1);
            break;
          // ,
          case 44:
            points[index++] = (strlen(characters2) - 1) * ampersand, ampersand = 1;
            break;
          // @
          case 64:
            if (peek() === 45)
              characters2 += delimit(next());
            atrule = peek(), offset = length2 = strlen(type = characters2 += identifier(caret())), character2++;
            break;
          // -
          case 45:
            if (previous === 45 && strlen(characters2) == 2)
              variable = 0;
        }
    }
  return rulesets;
}
function ruleset(value, root, parent, index, offset, rules, points, type, props, children, length2, siblings) {
  var post = offset - 1;
  var rule = offset === 0 ? rules : [""];
  var size = sizeof(rule);
  for (var i = 0, j2 = 0, k2 = 0; i < index; ++i)
    for (var x2 = 0, y2 = substr(value, post + 1, post = abs(j2 = points[i])), z2 = value; x2 < size; ++x2)
      if (z2 = trim(j2 > 0 ? rule[x2] + " " + y2 : replace(y2, /&\f/g, rule[x2])))
        props[k2++] = z2;
  return node(value, root, parent, offset === 0 ? RULESET : type, props, children, length2, siblings);
}
function comment(value, root, parent, siblings) {
  return node(value, root, parent, COMMENT, from(char()), substr(value, 2, -2), 0, siblings);
}
function declaration(value, root, parent, length2, siblings) {
  return node(value, root, parent, DECLARATION, substr(value, 0, length2), substr(value, length2 + 1, -1), length2, siblings);
}
function prefix(value, length2, children) {
  switch (hash(value, length2)) {
    // color-adjust
    case 5103:
      return WEBKIT + "print-" + value + value;
    // animation, animation-(delay|direction|duration|fill-mode|iteration-count|name|play-state|timing-function)
    case 5737:
    case 4201:
    case 3177:
    case 3433:
    case 1641:
    case 4457:
    case 2921:
    // text-decoration, filter, clip-path, backface-visibility, column, box-decoration-break
    case 5572:
    case 6356:
    case 5844:
    case 3191:
    case 6645:
    case 3005:
    // mask, mask-image, mask-(mode|clip|size), mask-(repeat|origin), mask-position, mask-composite,
    case 6391:
    case 5879:
    case 5623:
    case 6135:
    case 4599:
    case 4855:
    // background-clip, columns, column-(count|fill|gap|rule|rule-color|rule-style|rule-width|span|width)
    case 4215:
    case 6389:
    case 5109:
    case 5365:
    case 5621:
    case 3829:
      return WEBKIT + value + value;
    // tab-size
    case 4789:
      return MOZ + value + value;
    // appearance, user-select, transform, hyphens, text-size-adjust
    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return WEBKIT + value + MOZ + value + MS + value + value;
    // writing-mode
    case 5936:
      switch (charat(value, length2 + 11)) {
        // vertical-l(r)
        case 114:
          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb") + value;
        // vertical-r(l)
        case 108:
          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb-rl") + value;
        // horizontal(-)tb
        case 45:
          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "lr") + value;
      }
    // flex, flex-direction, scroll-snap-type, writing-mode
    case 6828:
    case 4268:
    case 2903:
      return WEBKIT + value + MS + value + value;
    // order
    case 6165:
      return WEBKIT + value + MS + "flex-" + value + value;
    // align-items
    case 5187:
      return WEBKIT + value + replace(value, /(\w+).+(:[^]+)/, WEBKIT + "box-$1$2" + MS + "flex-$1$2") + value;
    // align-self
    case 5443:
      return WEBKIT + value + MS + "flex-item-" + replace(value, /flex-|-self/g, "") + (!match(value, /flex-|baseline/) ? MS + "grid-row-" + replace(value, /flex-|-self/g, "") : "") + value;
    // align-content
    case 4675:
      return WEBKIT + value + MS + "flex-line-pack" + replace(value, /align-content|flex-|-self/g, "") + value;
    // flex-shrink
    case 5548:
      return WEBKIT + value + MS + replace(value, "shrink", "negative") + value;
    // flex-basis
    case 5292:
      return WEBKIT + value + MS + replace(value, "basis", "preferred-size") + value;
    // flex-grow
    case 6060:
      return WEBKIT + "box-" + replace(value, "-grow", "") + WEBKIT + value + MS + replace(value, "grow", "positive") + value;
    // transition
    case 4554:
      return WEBKIT + replace(value, /([^-])(transform)/g, "$1" + WEBKIT + "$2") + value;
    // cursor
    case 6187:
      return replace(replace(replace(value, /(zoom-|grab)/, WEBKIT + "$1"), /(image-set)/, WEBKIT + "$1"), value, "") + value;
    // background, background-image
    case 5495:
    case 3959:
      return replace(value, /(image-set\([^]*)/, WEBKIT + "$1$`$1");
    // justify-content
    case 4968:
      return replace(replace(value, /(.+:)(flex-)?(.*)/, WEBKIT + "box-pack:$3" + MS + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + WEBKIT + value + value;
    // justify-self
    case 4200:
      if (!match(value, /flex-|baseline/)) return MS + "grid-column-align" + substr(value, length2) + value;
      break;
    // grid-template-(columns|rows)
    case 2592:
    case 3360:
      return MS + replace(value, "template-", "") + value;
    // grid-(row|column)-start
    case 4384:
    case 3616:
      if (children && children.some(function(element, index) {
        return length2 = index, match(element.props, /grid-\w+-end/);
      })) {
        return ~indexof(value + (children = children[length2].value), "span", 0) ? value : MS + replace(value, "-start", "") + value + MS + "grid-row-span:" + (~indexof(children, "span", 0) ? match(children, /\d+/) : +match(children, /\d+/) - +match(value, /\d+/)) + ";";
      }
      return MS + replace(value, "-start", "") + value;
    // grid-(row|column)-end
    case 4896:
    case 4128:
      return children && children.some(function(element) {
        return match(element.props, /grid-\w+-start/);
      }) ? value : MS + replace(replace(value, "-end", "-span"), "span ", "") + value;
    // (margin|padding)-inline-(start|end)
    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return replace(value, /(.+)-inline(.+)/, WEBKIT + "$1$2") + value;
    // (min|max)?(width|height|inline-size|block-size)
    case 8116:
    case 7059:
    case 5753:
    case 5535:
    case 5445:
    case 5701:
    case 4933:
    case 4677:
    case 5533:
    case 5789:
    case 5021:
    case 4765:
      if (strlen(value) - 1 - length2 > 6)
        switch (charat(value, length2 + 1)) {
          // (m)ax-content, (m)in-content
          case 109:
            if (charat(value, length2 + 4) !== 45)
              break;
          // (f)ill-available, (f)it-content
          case 102:
            return replace(value, /(.+:)(.+)-([^]+)/, "$1" + WEBKIT + "$2-$3$1" + MOZ + (charat(value, length2 + 3) == 108 ? "$3" : "$2-$3")) + value;
          // (s)tretch
          case 115:
            return ~indexof(value, "stretch", 0) ? prefix(replace(value, "stretch", "fill-available"), length2, children) + value : value;
        }
      break;
    // grid-(column|row)
    case 5152:
    case 5920:
      return replace(value, /(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/, function(_2, a, b, c, d, e, f2) {
        return MS + a + ":" + b + f2 + (c ? MS + a + "-span:" + (d ? e : +e - +b) + f2 : "") + value;
      });
    // position: sticky
    case 4949:
      if (charat(value, length2 + 6) === 121)
        return replace(value, ":", ":" + WEBKIT) + value;
      break;
    // display: (flex|inline-flex|grid|inline-grid)
    case 6444:
      switch (charat(value, charat(value, 14) === 45 ? 18 : 11)) {
        // (inline-)?fle(x)
        case 120:
          return replace(value, /(.+:)([^;\s!]+)(;|(\s+)?!.+)?/, "$1" + WEBKIT + (charat(value, 14) === 45 ? "inline-" : "") + "box$3$1" + WEBKIT + "$2$3$1" + MS + "$2box$3") + value;
        // (inline-)?gri(d)
        case 100:
          return replace(value, ":", ":" + MS) + value;
      }
      break;
    // scroll-margin, scroll-margin-(top|right|bottom|left)
    case 5719:
    case 2647:
    case 2135:
    case 3927:
    case 2391:
      return replace(value, "scroll-", "scroll-snap-") + value;
  }
  return value;
}
function serialize(children, callback) {
  var output = "";
  for (var i = 0; i < children.length; i++)
    output += callback(children[i], i, children, callback) || "";
  return output;
}
function stringify(element, index, children, callback) {
  switch (element.type) {
    case LAYER:
      if (element.children.length) break;
    case IMPORT:
    case DECLARATION:
      return element.return = element.return || element.value;
    case COMMENT:
      return "";
    case KEYFRAMES:
      return element.return = element.value + "{" + serialize(element.children, callback) + "}";
    case RULESET:
      if (!strlen(element.value = element.props.join(","))) return "";
  }
  return strlen(children = serialize(element.children, callback)) ? element.return = element.value + "{" + children + "}" : "";
}
function middleware(collection) {
  var length2 = sizeof(collection);
  return function(element, index, children, callback) {
    var output = "";
    for (var i = 0; i < length2; i++)
      output += collection[i](element, index, children, callback) || "";
    return output;
  };
}
function rulesheet(callback) {
  return function(element) {
    if (!element.root) {
      if (element = element.return)
        callback(element);
    }
  };
}
function prefixer(element, index, children, callback) {
  if (element.length > -1) {
    if (!element.return)
      switch (element.type) {
        case DECLARATION:
          element.return = prefix(element.value, element.length, children);
          return;
        case KEYFRAMES:
          return serialize([copy(element, { value: replace(element.value, "@", "@" + WEBKIT) })], callback);
        case RULESET:
          if (element.length)
            return combine(children = element.props, function(value) {
              switch (match(value, callback = /(::plac\w+|:read-\w+)/)) {
                // :read-(only|write)
                case ":read-only":
                case ":read-write":
                  lift(copy(element, { props: [replace(value, /:(read-\w+)/, ":" + MOZ + "$1")] }));
                  lift(copy(element, { props: [value] }));
                  assign(element, { props: filter(children, callback) });
                  break;
                // :placeholder
                case "::placeholder":
                  lift(copy(element, { props: [replace(value, /:(plac\w+)/, ":" + WEBKIT + "input-$1")] }));
                  lift(copy(element, { props: [replace(value, /:(plac\w+)/, ":" + MOZ + "$1")] }));
                  lift(copy(element, { props: [replace(value, /:(plac\w+)/, MS + "input-$1")] }));
                  lift(copy(element, { props: [value] }));
                  assign(element, { props: filter(children, callback) });
                  break;
              }
              return "";
            });
      }
  }
}
var unitlessKeys = {
  animationIterationCount: 1,
  aspectRatio: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};
var f = "undefined" != typeof process && void 0 !== process.env && (process.env.REACT_APP_SC_ATTR || process.env.SC_ATTR) || "data-styled", m = "active", y = "data-styled-version", v = "6.1.19", g = "/*!sc*/\n", S = "undefined" != typeof window && "undefined" != typeof document, w = Boolean("boolean" == typeof SC_DISABLE_SPEEDY ? SC_DISABLE_SPEEDY : "undefined" != typeof process && void 0 !== process.env && void 0 !== process.env.REACT_APP_SC_DISABLE_SPEEDY && "" !== process.env.REACT_APP_SC_DISABLE_SPEEDY ? "false" !== process.env.REACT_APP_SC_DISABLE_SPEEDY && process.env.REACT_APP_SC_DISABLE_SPEEDY : "undefined" != typeof process && void 0 !== process.env && void 0 !== process.env.SC_DISABLE_SPEEDY && "" !== process.env.SC_DISABLE_SPEEDY ? "false" !== process.env.SC_DISABLE_SPEEDY && process.env.SC_DISABLE_SPEEDY : "production" !== process.env.NODE_ENV), E = /invalid hook call/i, N = /* @__PURE__ */ new Set(), P = function(t, n) {
  if ("production" !== process.env.NODE_ENV) {
    var o2 = n ? ' with the id of "'.concat(n, '"') : "", s = "The component ".concat(t).concat(o2, " has been created dynamically.\n") + "You may see this warning because you've called styled inside another component.\nTo resolve this only create new StyledComponents outside of any render method and function component.\nSee https://styled-components.com/docs/basics#define-styled-components-outside-of-the-render-method for more info.\n", i = console.error;
    try {
      var a = true;
      console.error = function(t2) {
        for (var n2 = [], o3 = 1; o3 < arguments.length; o3++) n2[o3 - 1] = arguments[o3];
        E.test(t2) ? (a = false, N.delete(s)) : i.apply(void 0, __spreadArray([t2], n2, false));
      }, useRef(), a && !N.has(s) && (console.warn(s), N.add(s));
    } catch (e) {
      E.test(e.message) && N.delete(s);
    } finally {
      console.error = i;
    }
  }
}, _ = Object.freeze([]), C = Object.freeze({});
function I(e, t, n) {
  return void 0 === n && (n = C), e.theme !== n.theme && e.theme || t || n.theme;
}
var A = /* @__PURE__ */ new Set(["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "u", "ul", "use", "var", "video", "wbr", "circle", "clipPath", "defs", "ellipse", "foreignObject", "g", "image", "line", "linearGradient", "marker", "mask", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "stop", "svg", "text", "tspan"]), O = /[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g, D = /(^-|-$)/g;
function R(e) {
  return e.replace(O, "-").replace(D, "");
}
var T = /(a)(d)/gi, k = 52, j = function(e) {
  return String.fromCharCode(e + (e > 25 ? 39 : 97));
};
function x(e) {
  var t, n = "";
  for (t = Math.abs(e); t > k; t = t / k | 0) n = j(t % k) + n;
  return (j(t % k) + n).replace(T, "$1-$2");
}
var V, F = 5381, z = function(e, t) {
  for (var n = t.length; n; ) e = 33 * e ^ t.charCodeAt(--n);
  return e;
}, M = function(e) {
  return z(F, e);
};
function $(e) {
  return x(M(e) >>> 0);
}
function B(e) {
  return "production" !== process.env.NODE_ENV && "string" == typeof e && e || e.displayName || e.name || "Component";
}
function G(e) {
  return "string" == typeof e && ("production" === process.env.NODE_ENV || e.charAt(0) === e.charAt(0).toLowerCase());
}
var L = "function" == typeof Symbol && Symbol.for, Y = L ? Symbol.for("react.memo") : 60115, q = L ? Symbol.for("react.forward_ref") : 60112, W = { childContextTypes: true, contextType: true, contextTypes: true, defaultProps: true, displayName: true, getDefaultProps: true, getDerivedStateFromError: true, getDerivedStateFromProps: true, mixins: true, propTypes: true, type: true }, H = { name: true, length: true, prototype: true, caller: true, callee: true, arguments: true, arity: true }, U = { $$typeof: true, compare: true, defaultProps: true, displayName: true, propTypes: true, type: true }, J = ((V = {})[q] = { $$typeof: true, render: true, defaultProps: true, displayName: true, propTypes: true }, V[Y] = U, V);
function X(e) {
  return ("type" in (t = e) && t.type.$$typeof) === Y ? U : "$$typeof" in e ? J[e.$$typeof] : W;
  var t;
}
var Z = Object.defineProperty, K = Object.getOwnPropertyNames, Q = Object.getOwnPropertySymbols, ee = Object.getOwnPropertyDescriptor, te = Object.getPrototypeOf, ne = Object.prototype;
function oe(e, t, n) {
  if ("string" != typeof t) {
    if (ne) {
      var o2 = te(t);
      o2 && o2 !== ne && oe(e, o2, n);
    }
    var r = K(t);
    Q && (r = r.concat(Q(t)));
    for (var s = X(e), i = X(t), a = 0; a < r.length; ++a) {
      var c = r[a];
      if (!(c in H || n && n[c] || i && c in i || s && c in s)) {
        var l = ee(t, c);
        try {
          Z(e, c, l);
        } catch (e2) {
        }
      }
    }
  }
  return e;
}
function re(e) {
  return "function" == typeof e;
}
function se(e) {
  return "object" == typeof e && "styledComponentId" in e;
}
function ie(e, t) {
  return e && t ? "".concat(e, " ").concat(t) : e || t || "";
}
function ae(e, t) {
  if (0 === e.length) return "";
  for (var n = e[0], o2 = 1; o2 < e.length; o2++) n += t ? t + e[o2] : e[o2];
  return n;
}
function ce(e) {
  return null !== e && "object" == typeof e && e.constructor.name === Object.name && !("props" in e && e.$$typeof);
}
function le(e, t, n) {
  if (void 0 === n && (n = false), !n && !ce(e) && !Array.isArray(e)) return t;
  if (Array.isArray(t)) for (var o2 = 0; o2 < t.length; o2++) e[o2] = le(e[o2], t[o2]);
  else if (ce(t)) for (var o2 in t) e[o2] = le(e[o2], t[o2]);
  return e;
}
function ue(e, t) {
  Object.defineProperty(e, "toString", { value: t });
}
var pe = "production" !== process.env.NODE_ENV ? { 1: "Cannot create styled-component for component: %s.\n\n", 2: "Can't collect styles once you've consumed a `ServerStyleSheet`'s styles! `ServerStyleSheet` is a one off instance for each server-side render cycle.\n\n- Are you trying to reuse it across renders?\n- Are you accidentally calling collectStyles twice?\n\n", 3: "Streaming SSR is only supported in a Node.js environment; Please do not try to call this method in the browser.\n\n", 4: "The `StyleSheetManager` expects a valid target or sheet prop!\n\n- Does this error occur on the client and is your target falsy?\n- Does this error occur on the server and is the sheet falsy?\n\n", 5: "The clone method cannot be used on the client!\n\n- Are you running in a client-like environment on the server?\n- Are you trying to run SSR on the client?\n\n", 6: "Trying to insert a new style tag, but the given Node is unmounted!\n\n- Are you using a custom target that isn't mounted?\n- Does your document not have a valid head element?\n- Have you accidentally removed a style tag manually?\n\n", 7: 'ThemeProvider: Please return an object from your "theme" prop function, e.g.\n\n```js\ntheme={() => ({})}\n```\n\n', 8: 'ThemeProvider: Please make your "theme" prop an object.\n\n', 9: "Missing document `<head>`\n\n", 10: "Cannot find a StyleSheet instance. Usually this happens if there are multiple copies of styled-components loaded at once. Check out this issue for how to troubleshoot and fix the common cases where this situation can happen: https://github.com/styled-components/styled-components/issues/1941#issuecomment-417862021\n\n", 11: "_This error was replaced with a dev-time warning, it will be deleted for v4 final._ [createGlobalStyle] received children which will not be rendered. Please use the component without passing children elements.\n\n", 12: "It seems you are interpolating a keyframe declaration (%s) into an untagged string. This was supported in styled-components v3, but is not longer supported in v4 as keyframes are now injected on-demand. Please wrap your string in the css\\`\\` helper which ensures the styles are injected correctly. See https://www.styled-components.com/docs/api#css\n\n", 13: "%s is not a styled component and cannot be referred to via component selector. See https://www.styled-components.com/docs/advanced#referring-to-other-components for more details.\n\n", 14: 'ThemeProvider: "theme" prop is required.\n\n', 15: "A stylis plugin has been supplied that is not named. We need a name for each plugin to be able to prevent styling collisions between different stylis configurations within the same app. Before you pass your plugin to `<StyleSheetManager stylisPlugins={[]}>`, please make sure each plugin is uniquely-named, e.g.\n\n```js\nObject.defineProperty(importedPlugin, 'name', { value: 'some-unique-name' });\n```\n\n", 16: "Reached the limit of how many styled components may be created at group %s.\nYou may only create up to 1,073,741,824 components. If you're creating components dynamically,\nas for instance in your render method then you may be running into this limitation.\n\n", 17: "CSSStyleSheet could not be found on HTMLStyleElement.\nHas styled-components' style tag been unmounted or altered by another script?\n", 18: "ThemeProvider: Please make sure your useTheme hook is within a `<ThemeProvider>`" } : {};
function de() {
  for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
  for (var n = e[0], o2 = [], r = 1, s = e.length; r < s; r += 1) o2.push(e[r]);
  return o2.forEach(function(e2) {
    n = n.replace(/%[a-z]/, e2);
  }), n;
}
function he(t) {
  for (var n = [], o2 = 1; o2 < arguments.length; o2++) n[o2 - 1] = arguments[o2];
  return "production" === process.env.NODE_ENV ? new Error("An error occurred. See https://github.com/styled-components/styled-components/blob/main/packages/styled-components/src/utils/errors.md#".concat(t, " for more information.").concat(n.length > 0 ? " Args: ".concat(n.join(", ")) : "")) : new Error(de.apply(void 0, __spreadArray([pe[t]], n, false)).trim());
}
var fe = (function() {
  function e(e2) {
    this.groupSizes = new Uint32Array(512), this.length = 512, this.tag = e2;
  }
  return e.prototype.indexOfGroup = function(e2) {
    for (var t = 0, n = 0; n < e2; n++) t += this.groupSizes[n];
    return t;
  }, e.prototype.insertRules = function(e2, t) {
    if (e2 >= this.groupSizes.length) {
      for (var n = this.groupSizes, o2 = n.length, r = o2; e2 >= r; ) if ((r <<= 1) < 0) throw he(16, "".concat(e2));
      this.groupSizes = new Uint32Array(r), this.groupSizes.set(n), this.length = r;
      for (var s = o2; s < r; s++) this.groupSizes[s] = 0;
    }
    for (var i = this.indexOfGroup(e2 + 1), a = (s = 0, t.length); s < a; s++) this.tag.insertRule(i, t[s]) && (this.groupSizes[e2]++, i++);
  }, e.prototype.clearGroup = function(e2) {
    if (e2 < this.length) {
      var t = this.groupSizes[e2], n = this.indexOfGroup(e2), o2 = n + t;
      this.groupSizes[e2] = 0;
      for (var r = n; r < o2; r++) this.tag.deleteRule(n);
    }
  }, e.prototype.getGroup = function(e2) {
    var t = "";
    if (e2 >= this.length || 0 === this.groupSizes[e2]) return t;
    for (var n = this.groupSizes[e2], o2 = this.indexOfGroup(e2), r = o2 + n, s = o2; s < r; s++) t += "".concat(this.tag.getRule(s)).concat(g);
    return t;
  }, e;
})(), me = 1 << 30, ye = /* @__PURE__ */ new Map(), ve = /* @__PURE__ */ new Map(), ge = 1, Se = function(e) {
  if (ye.has(e)) return ye.get(e);
  for (; ve.has(ge); ) ge++;
  var t = ge++;
  if ("production" !== process.env.NODE_ENV && ((0 | t) < 0 || t > me)) throw he(16, "".concat(t));
  return ye.set(e, t), ve.set(t, e), t;
}, we = function(e, t) {
  ge = t + 1, ye.set(e, t), ve.set(t, e);
}, be = "style[".concat(f, "][").concat(y, '="').concat(v, '"]'), Ee = new RegExp("^".concat(f, '\\.g(\\d+)\\[id="([\\w\\d-]+)"\\].*?"([^"]*)')), Ne = function(e, t, n) {
  for (var o2, r = n.split(","), s = 0, i = r.length; s < i; s++) (o2 = r[s]) && e.registerName(t, o2);
}, Pe = function(e, t) {
  for (var n, o2 = (null !== (n = t.textContent) && void 0 !== n ? n : "").split(g), r = [], s = 0, i = o2.length; s < i; s++) {
    var a = o2[s].trim();
    if (a) {
      var c = a.match(Ee);
      if (c) {
        var l = 0 | parseInt(c[1], 10), u = c[2];
        0 !== l && (we(u, l), Ne(e, u, c[3]), e.getTag().insertRules(l, r)), r.length = 0;
      } else r.push(a);
    }
  }
}, _e = function(e) {
  for (var t = document.querySelectorAll(be), n = 0, o2 = t.length; n < o2; n++) {
    var r = t[n];
    r && r.getAttribute(f) !== m && (Pe(e, r), r.parentNode && r.parentNode.removeChild(r));
  }
};
function Ce() {
  return "undefined" != typeof __webpack_nonce__ ? __webpack_nonce__ : null;
}
var Ie = function(e) {
  var t = document.head, n = e || t, o2 = document.createElement("style"), r = (function(e2) {
    var t2 = Array.from(e2.querySelectorAll("style[".concat(f, "]")));
    return t2[t2.length - 1];
  })(n), s = void 0 !== r ? r.nextSibling : null;
  o2.setAttribute(f, m), o2.setAttribute(y, v);
  var i = Ce();
  return i && o2.setAttribute("nonce", i), n.insertBefore(o2, s), o2;
}, Ae = (function() {
  function e(e2) {
    this.element = Ie(e2), this.element.appendChild(document.createTextNode("")), this.sheet = (function(e3) {
      if (e3.sheet) return e3.sheet;
      for (var t = document.styleSheets, n = 0, o2 = t.length; n < o2; n++) {
        var r = t[n];
        if (r.ownerNode === e3) return r;
      }
      throw he(17);
    })(this.element), this.length = 0;
  }
  return e.prototype.insertRule = function(e2, t) {
    try {
      return this.sheet.insertRule(t, e2), this.length++, true;
    } catch (e3) {
      return false;
    }
  }, e.prototype.deleteRule = function(e2) {
    this.sheet.deleteRule(e2), this.length--;
  }, e.prototype.getRule = function(e2) {
    var t = this.sheet.cssRules[e2];
    return t && t.cssText ? t.cssText : "";
  }, e;
})(), Oe = (function() {
  function e(e2) {
    this.element = Ie(e2), this.nodes = this.element.childNodes, this.length = 0;
  }
  return e.prototype.insertRule = function(e2, t) {
    if (e2 <= this.length && e2 >= 0) {
      var n = document.createTextNode(t);
      return this.element.insertBefore(n, this.nodes[e2] || null), this.length++, true;
    }
    return false;
  }, e.prototype.deleteRule = function(e2) {
    this.element.removeChild(this.nodes[e2]), this.length--;
  }, e.prototype.getRule = function(e2) {
    return e2 < this.length ? this.nodes[e2].textContent : "";
  }, e;
})(), De = (function() {
  function e(e2) {
    this.rules = [], this.length = 0;
  }
  return e.prototype.insertRule = function(e2, t) {
    return e2 <= this.length && (this.rules.splice(e2, 0, t), this.length++, true);
  }, e.prototype.deleteRule = function(e2) {
    this.rules.splice(e2, 1), this.length--;
  }, e.prototype.getRule = function(e2) {
    return e2 < this.length ? this.rules[e2] : "";
  }, e;
})(), Re = S, Te = { isServer: !S, useCSSOMInjection: !w }, ke = (function() {
  function e(e2, n, o2) {
    void 0 === e2 && (e2 = C), void 0 === n && (n = {});
    var r = this;
    this.options = __assign(__assign({}, Te), e2), this.gs = n, this.names = new Map(o2), this.server = !!e2.isServer, !this.server && S && Re && (Re = false, _e(this)), ue(this, function() {
      return (function(e3) {
        for (var t = e3.getTag(), n2 = t.length, o3 = "", r2 = function(n3) {
          var r3 = (function(e4) {
            return ve.get(e4);
          })(n3);
          if (void 0 === r3) return "continue";
          var s2 = e3.names.get(r3), i = t.getGroup(n3);
          if (void 0 === s2 || !s2.size || 0 === i.length) return "continue";
          var a = "".concat(f, ".g").concat(n3, '[id="').concat(r3, '"]'), c = "";
          void 0 !== s2 && s2.forEach(function(e4) {
            e4.length > 0 && (c += "".concat(e4, ","));
          }), o3 += "".concat(i).concat(a, '{content:"').concat(c, '"}').concat(g);
        }, s = 0; s < n2; s++) r2(s);
        return o3;
      })(r);
    });
  }
  return e.registerId = function(e2) {
    return Se(e2);
  }, e.prototype.rehydrate = function() {
    !this.server && S && _e(this);
  }, e.prototype.reconstructWithOptions = function(n, o2) {
    return void 0 === o2 && (o2 = true), new e(__assign(__assign({}, this.options), n), this.gs, o2 && this.names || void 0);
  }, e.prototype.allocateGSInstance = function(e2) {
    return this.gs[e2] = (this.gs[e2] || 0) + 1;
  }, e.prototype.getTag = function() {
    return this.tag || (this.tag = (e2 = (function(e3) {
      var t = e3.useCSSOMInjection, n = e3.target;
      return e3.isServer ? new De(n) : t ? new Ae(n) : new Oe(n);
    })(this.options), new fe(e2)));
    var e2;
  }, e.prototype.hasNameForId = function(e2, t) {
    return this.names.has(e2) && this.names.get(e2).has(t);
  }, e.prototype.registerName = function(e2, t) {
    if (Se(e2), this.names.has(e2)) this.names.get(e2).add(t);
    else {
      var n = /* @__PURE__ */ new Set();
      n.add(t), this.names.set(e2, n);
    }
  }, e.prototype.insertRules = function(e2, t, n) {
    this.registerName(e2, t), this.getTag().insertRules(Se(e2), n);
  }, e.prototype.clearNames = function(e2) {
    this.names.has(e2) && this.names.get(e2).clear();
  }, e.prototype.clearRules = function(e2) {
    this.getTag().clearGroup(Se(e2)), this.clearNames(e2);
  }, e.prototype.clearTag = function() {
    this.tag = void 0;
  }, e;
})(), je = /&/g, xe = /^\s*\/\/.*$/gm;
function Ve(e, t) {
  return e.map(function(e2) {
    return "rule" === e2.type && (e2.value = "".concat(t, " ").concat(e2.value), e2.value = e2.value.replaceAll(",", ",".concat(t, " ")), e2.props = e2.props.map(function(e3) {
      return "".concat(t, " ").concat(e3);
    })), Array.isArray(e2.children) && "@keyframes" !== e2.type && (e2.children = Ve(e2.children, t)), e2;
  });
}
function Fe(e) {
  var t, n, o2, r = void 0 === e ? C : e, s = r.options, i = void 0 === s ? C : s, a = r.plugins, c = void 0 === a ? _ : a, l = function(e2, o3, r2) {
    return r2.startsWith(n) && r2.endsWith(n) && r2.replaceAll(n, "").length > 0 ? ".".concat(t) : e2;
  }, u = c.slice();
  u.push(function(e2) {
    e2.type === RULESET && e2.value.includes("&") && (e2.props[0] = e2.props[0].replace(je, n).replace(o2, l));
  }), i.prefix && u.push(prefixer), u.push(stringify);
  var p2 = function(e2, r2, s2, a2) {
    void 0 === r2 && (r2 = ""), void 0 === s2 && (s2 = ""), void 0 === a2 && (a2 = "&"), t = a2, n = r2, o2 = new RegExp("\\".concat(n, "\\b"), "g");
    var c2 = e2.replace(xe, ""), l2 = compile(s2 || r2 ? "".concat(s2, " ").concat(r2, " { ").concat(c2, " }") : c2);
    i.namespace && (l2 = Ve(l2, i.namespace));
    var p3 = [];
    return serialize(l2, middleware(u.concat(rulesheet(function(e3) {
      return p3.push(e3);
    })))), p3;
  };
  return p2.hash = c.length ? c.reduce(function(e2, t2) {
    return t2.name || he(15), z(e2, t2.name);
  }, F).toString() : "", p2;
}
var ze = new ke(), Me = Fe(), $e = o.createContext({ shouldForwardProp: void 0, styleSheet: ze, stylis: Me });
$e.Consumer;
var Ge = o.createContext(void 0);
function Le() {
  return useContext($e);
}
function Ye(e) {
  var t = useState(e.stylisPlugins), n = t[0], r = t[1], c = Le().styleSheet, l = useMemo(function() {
    var t2 = c;
    return e.sheet ? t2 = e.sheet : e.target && (t2 = t2.reconstructWithOptions({ target: e.target }, false)), e.disableCSSOMInjection && (t2 = t2.reconstructWithOptions({ useCSSOMInjection: false })), t2;
  }, [e.disableCSSOMInjection, e.sheet, e.target, c]), u = useMemo(function() {
    return Fe({ options: { namespace: e.namespace, prefix: e.enableVendorPrefixes }, plugins: n });
  }, [e.enableVendorPrefixes, e.namespace, n]);
  useEffect(function() {
    p(n, e.stylisPlugins) || r(e.stylisPlugins);
  }, [e.stylisPlugins]);
  var d = useMemo(function() {
    return { shouldForwardProp: e.shouldForwardProp, styleSheet: l, stylis: u };
  }, [e.shouldForwardProp, l, u]);
  return o.createElement($e.Provider, { value: d }, o.createElement(Ge.Provider, { value: u }, e.children));
}
var qe = (function() {
  function e(e2, t) {
    var n = this;
    this.inject = function(e3, t2) {
      void 0 === t2 && (t2 = Me);
      var o2 = n.name + t2.hash;
      e3.hasNameForId(n.id, o2) || e3.insertRules(n.id, o2, t2(n.rules, o2, "@keyframes"));
    }, this.name = e2, this.id = "sc-keyframes-".concat(e2), this.rules = t, ue(this, function() {
      throw he(12, String(n.name));
    });
  }
  return e.prototype.getName = function(e2) {
    return void 0 === e2 && (e2 = Me), this.name + e2.hash;
  }, e;
})(), We = function(e) {
  return e >= "A" && e <= "Z";
};
function He(e) {
  for (var t = "", n = 0; n < e.length; n++) {
    var o2 = e[n];
    if (1 === n && "-" === o2 && "-" === e[0]) return e;
    We(o2) ? t += "-" + o2.toLowerCase() : t += o2;
  }
  return t.startsWith("ms-") ? "-" + t : t;
}
var Ue = function(e) {
  return null == e || false === e || "" === e;
}, Je = function(t) {
  var n, o2, r = [];
  for (var s in t) {
    var i = t[s];
    t.hasOwnProperty(s) && !Ue(i) && (Array.isArray(i) && i.isCss || re(i) ? r.push("".concat(He(s), ":"), i, ";") : ce(i) ? r.push.apply(r, __spreadArray(__spreadArray(["".concat(s, " {")], Je(i), false), ["}"], false)) : r.push("".concat(He(s), ": ").concat((n = s, null == (o2 = i) || "boolean" == typeof o2 || "" === o2 ? "" : "number" != typeof o2 || 0 === o2 || n in unitlessKeys || n.startsWith("--") ? String(o2).trim() : "".concat(o2, "px")), ";")));
  }
  return r;
};
function Xe(e, t, n, o2) {
  if (Ue(e)) return [];
  if (se(e)) return [".".concat(e.styledComponentId)];
  if (re(e)) {
    if (!re(s = e) || s.prototype && s.prototype.isReactComponent || !t) return [e];
    var r = e(t);
    return "production" === process.env.NODE_ENV || "object" != typeof r || Array.isArray(r) || r instanceof qe || ce(r) || null === r || console.error("".concat(B(e), " is not a styled component and cannot be referred to via component selector. See https://www.styled-components.com/docs/advanced#referring-to-other-components for more details.")), Xe(r, t, n, o2);
  }
  var s;
  return e instanceof qe ? n ? (e.inject(n, o2), [e.getName(o2)]) : [e] : ce(e) ? Je(e) : Array.isArray(e) ? Array.prototype.concat.apply(_, e.map(function(e2) {
    return Xe(e2, t, n, o2);
  })) : [e.toString()];
}
function Ze(e) {
  for (var t = 0; t < e.length; t += 1) {
    var n = e[t];
    if (re(n) && !se(n)) return false;
  }
  return true;
}
var Ke = M(v), Qe = (function() {
  function e(e2, t, n) {
    this.rules = e2, this.staticRulesId = "", this.isStatic = "production" === process.env.NODE_ENV && (void 0 === n || n.isStatic) && Ze(e2), this.componentId = t, this.baseHash = z(Ke, t), this.baseStyle = n, ke.registerId(t);
  }
  return e.prototype.generateAndInjectStyles = function(e2, t, n) {
    var o2 = this.baseStyle ? this.baseStyle.generateAndInjectStyles(e2, t, n) : "";
    if (this.isStatic && !n.hash) if (this.staticRulesId && t.hasNameForId(this.componentId, this.staticRulesId)) o2 = ie(o2, this.staticRulesId);
    else {
      var r = ae(Xe(this.rules, e2, t, n)), s = x(z(this.baseHash, r) >>> 0);
      if (!t.hasNameForId(this.componentId, s)) {
        var i = n(r, ".".concat(s), void 0, this.componentId);
        t.insertRules(this.componentId, s, i);
      }
      o2 = ie(o2, s), this.staticRulesId = s;
    }
    else {
      for (var a = z(this.baseHash, n.hash), c = "", l = 0; l < this.rules.length; l++) {
        var u = this.rules[l];
        if ("string" == typeof u) c += u, "production" !== process.env.NODE_ENV && (a = z(a, u));
        else if (u) {
          var p2 = ae(Xe(u, e2, t, n));
          a = z(a, p2 + l), c += p2;
        }
      }
      if (c) {
        var d = x(a >>> 0);
        t.hasNameForId(this.componentId, d) || t.insertRules(this.componentId, d, n(c, ".".concat(d), void 0, this.componentId)), o2 = ie(o2, d);
      }
    }
    return o2;
  }, e;
})(), et = o.createContext(void 0);
et.Consumer;
var rt = {}, st = /* @__PURE__ */ new Set();
function it(e, r, s) {
  var i = se(e), a = e, c = !G(e), p2 = r.attrs, d = void 0 === p2 ? _ : p2, h = r.componentId, f2 = void 0 === h ? (function(e2, t) {
    var n = "string" != typeof e2 ? "sc" : R(e2);
    rt[n] = (rt[n] || 0) + 1;
    var o2 = "".concat(n, "-").concat($(v + n + rt[n]));
    return t ? "".concat(t, "-").concat(o2) : o2;
  })(r.displayName, r.parentComponentId) : h, m2 = r.displayName, y2 = void 0 === m2 ? (function(e2) {
    return G(e2) ? "styled.".concat(e2) : "Styled(".concat(B(e2), ")");
  })(e) : m2, g2 = r.displayName && r.componentId ? "".concat(R(r.displayName), "-").concat(r.componentId) : r.componentId || f2, S2 = i && a.attrs ? a.attrs.concat(d).filter(Boolean) : d, w2 = r.shouldForwardProp;
  if (i && a.shouldForwardProp) {
    var b = a.shouldForwardProp;
    if (r.shouldForwardProp) {
      var E2 = r.shouldForwardProp;
      w2 = function(e2, t) {
        return b(e2, t) && E2(e2, t);
      };
    } else w2 = b;
  }
  var N2 = new Qe(s, g2, i ? a.componentStyle : void 0);
  function O2(e2, r2) {
    return (function(e3, r3, s2) {
      var i2 = e3.attrs, a2 = e3.componentStyle, c2 = e3.defaultProps, p3 = e3.foldedComponentIds, d2 = e3.styledComponentId, h2 = e3.target, f3 = o.useContext(et), m3 = Le(), y3 = e3.shouldForwardProp || m3.shouldForwardProp;
      "production" !== process.env.NODE_ENV && useDebugValue(d2);
      var v2 = I(r3, f3, c2) || C, g3 = (function(e4, n, o2) {
        for (var r4, s3 = __assign(__assign({}, n), { className: void 0, theme: o2 }), i3 = 0; i3 < e4.length; i3 += 1) {
          var a3 = re(r4 = e4[i3]) ? r4(s3) : r4;
          for (var c3 in a3) s3[c3] = "className" === c3 ? ie(s3[c3], a3[c3]) : "style" === c3 ? __assign(__assign({}, s3[c3]), a3[c3]) : a3[c3];
        }
        return n.className && (s3.className = ie(s3.className, n.className)), s3;
      })(i2, r3, v2), S3 = g3.as || h2, w3 = {};
      for (var b2 in g3) void 0 === g3[b2] || "$" === b2[0] || "as" === b2 || "theme" === b2 && g3.theme === v2 || ("forwardedAs" === b2 ? w3.as = g3.forwardedAs : y3 && !y3(b2, S3) || (w3[b2] = g3[b2], y3 || "development" !== process.env.NODE_ENV || isPropValid(b2) || st.has(b2) || !A.has(S3) || (st.add(b2), console.warn('styled-components: it looks like an unknown prop "'.concat(b2, '" is being sent through to the DOM, which will likely trigger a React console error. If you would like automatic filtering of unknown props, you can opt-into that behavior via `<StyleSheetManager shouldForwardProp={...}>` (connect an API like `@emotion/is-prop-valid`) or consider using transient props (`$` prefix for automatic filtering.)')))));
      var E3 = (function(e4, t) {
        var n = Le(), o2 = e4.generateAndInjectStyles(t, n.styleSheet, n.stylis);
        return "production" !== process.env.NODE_ENV && useDebugValue(o2), o2;
      })(a2, g3);
      "production" !== process.env.NODE_ENV && e3.warnTooManyClasses && e3.warnTooManyClasses(E3);
      var N3 = ie(p3, d2);
      return E3 && (N3 += " " + E3), g3.className && (N3 += " " + g3.className), w3[G(S3) && !A.has(S3) ? "class" : "className"] = N3, s2 && (w3.ref = s2), createElement(S3, w3);
    })(D2, e2, r2);
  }
  O2.displayName = y2;
  var D2 = o.forwardRef(O2);
  return D2.attrs = S2, D2.componentStyle = N2, D2.displayName = y2, D2.shouldForwardProp = w2, D2.foldedComponentIds = i ? ie(a.foldedComponentIds, a.styledComponentId) : "", D2.styledComponentId = g2, D2.target = i ? a.target : e, Object.defineProperty(D2, "defaultProps", { get: function() {
    return this._foldedDefaultProps;
  }, set: function(e2) {
    this._foldedDefaultProps = i ? (function(e3) {
      for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
      for (var o2 = 0, r2 = t; o2 < r2.length; o2++) le(e3, r2[o2], true);
      return e3;
    })({}, a.defaultProps, e2) : e2;
  } }), "production" !== process.env.NODE_ENV && (P(y2, g2), D2.warnTooManyClasses = /* @__PURE__ */ (function(e2, t) {
    var n = {}, o2 = false;
    return function(r2) {
      if (!o2 && (n[r2] = true, Object.keys(n).length >= 200)) {
        var s2 = t ? ' with the id of "'.concat(t, '"') : "";
        console.warn("Over ".concat(200, " classes were generated for component ").concat(e2).concat(s2, ".\n") + "Consider using the attrs method, together with a style object for frequently changed styles.\nExample:\n  const Component = styled.div.attrs(props => ({\n    style: {\n      background: props.background,\n    },\n  }))`width: 100%;`\n\n  <Component />"), o2 = true, n = {};
      }
    };
  })(y2, g2)), ue(D2, function() {
    return ".".concat(D2.styledComponentId);
  }), c && oe(D2, e, { attrs: true, componentStyle: true, displayName: true, foldedComponentIds: true, shouldForwardProp: true, styledComponentId: true, target: true }), D2;
}
function at(e, t) {
  for (var n = [e[0]], o2 = 0, r = t.length; o2 < r; o2 += 1) n.push(t[o2], e[o2 + 1]);
  return n;
}
var ct = function(e) {
  return Object.assign(e, { isCss: true });
};
function lt(t) {
  for (var n = [], o2 = 1; o2 < arguments.length; o2++) n[o2 - 1] = arguments[o2];
  if (re(t) || ce(t)) return ct(Xe(at(_, __spreadArray([t], n, true))));
  var r = t;
  return 0 === n.length && 1 === r.length && "string" == typeof r[0] ? Xe(r) : ct(Xe(at(r, n)));
}
function ut(n, o2, r) {
  if (void 0 === r && (r = C), !o2) throw he(1, o2);
  var s = function(t) {
    for (var s2 = [], i = 1; i < arguments.length; i++) s2[i - 1] = arguments[i];
    return n(o2, r, lt.apply(void 0, __spreadArray([t], s2, false)));
  };
  return s.attrs = function(e) {
    return ut(n, o2, __assign(__assign({}, r), { attrs: Array.prototype.concat(r.attrs, e).filter(Boolean) }));
  }, s.withConfig = function(e) {
    return ut(n, o2, __assign(__assign({}, r), e));
  }, s;
}
var pt = function(e) {
  return ut(it, e);
}, dt = pt;
A.forEach(function(e) {
  dt[e] = pt(e);
});
var vt = /^\s*<\/[a-z]/i, gt = (function() {
  function e() {
    var e2 = this;
    this._emitSheetCSS = function() {
      var t = e2.instance.toString();
      if (!t) return "";
      var n = Ce(), o2 = ae([n && 'nonce="'.concat(n, '"'), "".concat(f, '="true"'), "".concat(y, '="').concat(v, '"')].filter(Boolean), " ");
      return "<style ".concat(o2, ">").concat(t, "</style>");
    }, this.getStyleTags = function() {
      if (e2.sealed) throw he(2);
      return e2._emitSheetCSS();
    }, this.getStyleElement = function() {
      var n;
      if (e2.sealed) throw he(2);
      var r = e2.instance.toString();
      if (!r) return [];
      var s = ((n = {})[f] = "", n[y] = v, n.dangerouslySetInnerHTML = { __html: r }, n), i = Ce();
      return i && (s.nonce = i), [o.createElement("style", __assign({}, s, { key: "sc-0-0" }))];
    }, this.seal = function() {
      e2.sealed = true;
    }, this.instance = new ke({ isServer: true }), this.sealed = false;
  }
  return e.prototype.collectStyles = function(e2) {
    if (this.sealed) throw he(2);
    return o.createElement(Ye, { sheet: this.instance }, e2);
  }, e.prototype.interleaveWithNodeStream = function(e2) {
    if (S) throw he(3);
    if (this.sealed) throw he(2);
    this.seal();
    var t = require("stream").Transform, n = e2, o2 = this.instance, r = this._emitSheetCSS, s = new t({ transform: function(e3, t2, n2) {
      var s2 = e3.toString(), i = r();
      if (o2.clearTag(), vt.test(s2)) {
        var a = s2.indexOf(">") + 1, c = s2.slice(0, a), l = s2.slice(a);
        this.push(c + i + l);
      } else this.push(i + s2);
      n2();
    } });
    return n.on("error", function(e3) {
      s.emit("error", e3);
    }), n.pipe(s);
  }, e;
})();
"production" !== process.env.NODE_ENV && "undefined" != typeof navigator && "ReactNative" === navigator.product && console.warn("It looks like you've imported 'styled-components' on React Native.\nPerhaps you're looking to import 'styled-components/native'?\nRead more about this at https://www.styled-components.com/docs/basics#react-native");
var wt = "__sc-".concat(f, "__");
"production" !== process.env.NODE_ENV && "test" !== process.env.NODE_ENV && "undefined" != typeof window && (window[wt] || (window[wt] = 0), 1 === window[wt] && console.warn("It looks like there are several instances of 'styled-components' initialized in this application. This may cause dynamic styles to not render properly, errors during the rehydration process, a missing theme prop, and makes your application bigger without good reason.\n\nSee https://s-c.sh/2BAXzed for more info."), window[wt] += 1);
const Header$6 = dt.header`
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #0b1f3a;
`;
const Name$3 = dt.h1`
  font-size: 2.5rem;
  color: #0b1f3a;
  margin-bottom: 0.5rem;
`;
const Label = dt.p`
  font-size: 1.125rem;
  color: #555;
  margin-bottom: 1.5rem;
  font-weight: 400;
`;
const ContactInfo = dt.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-size: 0.95rem;
  color: #666;
`;
const ContactItem = dt.div`
  a {
    color: #0b1f3a;
    text-decoration: none;

    &:hover {
      border-bottom: 1px solid #0b1f3a;
    }
  }
`;
const Hero = ({ basics }) => {
  if (!basics) return null;
  return /* @__PURE__ */ jsxs(Header$6, { children: [
    /* @__PURE__ */ jsx(Name$3, { children: basics.name }),
    basics.label && /* @__PURE__ */ jsx(Label, { children: basics.label }),
    /* @__PURE__ */ jsxs(ContactInfo, { children: [
      basics.email && /* @__PURE__ */ jsx(ContactItem, { children: /* @__PURE__ */ jsx("a", { href: `mailto:${basics.email}`, children: basics.email }) }),
      basics.phone && /* @__PURE__ */ jsx(ContactItem, { children: basics.phone }),
      basics.location?.city && /* @__PURE__ */ jsxs(ContactItem, { children: [
        basics.location.city,
        basics.location.region && `, ${basics.location.region}`
      ] }),
      basics.url && /* @__PURE__ */ jsx(ContactItem, { children: /* @__PURE__ */ jsx("a", { href: basics.url, target: "_blank", rel: "noopener noreferrer", children: basics.url.replace(/^https?:\/\//, "") }) }),
      basics.profiles?.map((profile, i) => /* @__PURE__ */ jsx(ContactItem, { children: /* @__PURE__ */ jsx("a", { href: profile.url, target: "_blank", rel: "noopener noreferrer", children: profile.network }) }, i))
    ] })
  ] });
};
const SectionContainer = dt.section`
  margin-bottom: 2.5rem;
`;
const SectionTitle = dt.h2`
  font-size: 1.5rem;
  color: #0b1f3a;
  margin-bottom: 1.25rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
`;
const Section = ({ title, children }) => {
  if (!children) return null;
  return /* @__PURE__ */ jsxs(SectionContainer, { children: [
    title && /* @__PURE__ */ jsx(SectionTitle, { children: title }),
    children
  ] });
};
const SummaryText = dt.p`
  font-size: 1.0625rem;
  line-height: 1.7;
  color: #333;
  margin: 0;
`;
const Summary$2 = ({ basics }) => {
  if (!basics?.summary) return null;
  return /* @__PURE__ */ jsx(Section, { title: "Profile", children: /* @__PURE__ */ jsx(SummaryText, { children: basics.summary }) });
};
const WorkItem = dt.div`
  margin-bottom: 2rem;
`;
const WorkHeader = dt.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
const Position$1 = dt.h3`
  font-size: 1.125rem;
  color: #0b1f3a;
  margin: 0;
`;
const DateRange$3 = dt.div`
  font-size: 0.9rem;
  color: #666;
  font-weight: 400;
`;
const Company = dt.div`
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.75rem;
`;
const Description$2 = dt.div`
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
  margin-bottom: 0.5rem;

  p {
    margin-bottom: 0.5rem;
  }
`;
const Highlights$2 = dt.ul`
  margin-top: 0.75rem;
  padding-left: 1.5rem;
  list-style: disc;

  li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
    color: #444;
  }
`;
const formatDate$6 = (date) => {
  if (!date) return "Present";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};
const Work = ({ work }) => {
  if (!work || work.length === 0) return null;
  return /* @__PURE__ */ jsx(Section, { title: "Experience", children: work.map((item, i) => /* @__PURE__ */ jsxs(WorkItem, { children: [
    /* @__PURE__ */ jsxs(WorkHeader, { children: [
      /* @__PURE__ */ jsx(Position$1, { children: item.position }),
      /* @__PURE__ */ jsxs(DateRange$3, { children: [
        formatDate$6(item.startDate),
        " - ",
        formatDate$6(item.endDate)
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Company, { children: [
      item.name,
      item.location && ` • ${item.location}`
    ] }),
    item.summary && /* @__PURE__ */ jsx(
      Description$2,
      {
        dangerouslySetInnerHTML: { __html: marked(item.summary) }
      }
    ),
    item.highlights && item.highlights.length > 0 && /* @__PURE__ */ jsx(Highlights$2, { children: item.highlights.map((highlight, j2) => /* @__PURE__ */ jsx("li", { children: highlight }, j2)) })
  ] }, i)) });
};
const ProjectItem = dt.div`
  margin-bottom: 1.75rem;
`;
const Header$5 = dt.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
const ProjectName = dt.h3`
  font-size: 1.0625rem;
  color: #0b1f3a;
  margin: 0;
`;
const DateRange$2 = dt.div`
  font-size: 0.9rem;
  color: #666;
`;
const Entity = dt.div`
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 0.5rem;
`;
const Description$1 = dt.div`
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
  margin-bottom: 0.5rem;

  p {
    margin-bottom: 0.5rem;
  }
`;
const Highlights$1 = dt.ul`
  margin-top: 0.5rem;
  padding-left: 1.5rem;
  list-style: disc;

  li {
    margin-bottom: 0.4rem;
    line-height: 1.6;
    color: #444;
  }
`;
const formatDate$5 = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};
const Projects = ({ projects }) => {
  if (!projects || projects.length === 0) return null;
  return /* @__PURE__ */ jsx(Section, { title: "Projects", children: projects.map((project, i) => /* @__PURE__ */ jsxs(ProjectItem, { children: [
    /* @__PURE__ */ jsxs(Header$5, { children: [
      /* @__PURE__ */ jsx(ProjectName, { children: project.url ? /* @__PURE__ */ jsx("a", { href: project.url, target: "_blank", rel: "noopener noreferrer", children: project.name }) : project.name }),
      (project.startDate || project.endDate) && /* @__PURE__ */ jsxs(DateRange$2, { children: [
        formatDate$5(project.startDate),
        project.endDate && ` - ${formatDate$5(project.endDate)}`
      ] })
    ] }),
    project.entity && /* @__PURE__ */ jsx(Entity, { children: project.entity }),
    project.description && /* @__PURE__ */ jsx(
      Description$1,
      {
        dangerouslySetInnerHTML: { __html: marked(project.description) }
      }
    ),
    project.highlights && project.highlights.length > 0 && /* @__PURE__ */ jsx(Highlights$1, { children: project.highlights.map((highlight, j2) => /* @__PURE__ */ jsx("li", { children: highlight }, j2)) })
  ] }, i)) });
};
const EducationItem = dt.div`
  margin-bottom: 1.5rem;
`;
const Header$4 = dt.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
const Degree = dt.h3`
  font-size: 1.0625rem;
  color: #0b1f3a;
  margin: 0;
`;
const DateRange$1 = dt.div`
  font-size: 0.9rem;
  color: #666;
`;
const Institution = dt.div`
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.5rem;
`;
const Details = dt.div`
  font-size: 0.95rem;
  color: #666;
`;
const formatDate$4 = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { year: "numeric" });
};
const Education = ({ education }) => {
  if (!education || education.length === 0) return null;
  return /* @__PURE__ */ jsx(Section, { title: "Education", children: education.map((item, i) => /* @__PURE__ */ jsxs(EducationItem, { children: [
    /* @__PURE__ */ jsxs(Header$4, { children: [
      /* @__PURE__ */ jsxs(Degree, { children: [
        item.studyType,
        " ",
        item.area && `in ${item.area}`
      ] }),
      /* @__PURE__ */ jsxs(DateRange$1, { children: [
        item.startDate && formatDate$4(item.startDate),
        item.endDate && ` - ${formatDate$4(item.endDate)}`
      ] })
    ] }),
    /* @__PURE__ */ jsx(Institution, { children: item.institution }),
    (item.score || item.courses) && /* @__PURE__ */ jsxs(Details, { children: [
      item.score && /* @__PURE__ */ jsxs("div", { children: [
        "GPA: ",
        item.score
      ] }),
      item.courses && item.courses.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
        "Relevant Coursework: ",
        item.courses.join(", ")
      ] })
    ] })
  ] }, i)) });
};
const CertificateItem = dt.div`
  margin-bottom: 1.25rem;
`;
const Header$3 = dt.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
const Name$2 = dt.h3`
  font-size: 1rem;
  color: #0b1f3a;
  margin: 0;
`;
const Date$2 = dt.div`
  font-size: 0.9rem;
  color: #666;
`;
const Issuer = dt.div`
  font-size: 0.95rem;
  color: #555;
`;
const formatDate$3 = (date) => {
  if (!date) return "";
  const d = new Date$2(date);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};
const Certificates = ({ certificates }) => {
  if (!certificates || certificates.length === 0) return null;
  return /* @__PURE__ */ jsx(Section, { title: "Certifications", children: certificates.map((cert, i) => /* @__PURE__ */ jsxs(CertificateItem, { children: [
    /* @__PURE__ */ jsxs(Header$3, { children: [
      /* @__PURE__ */ jsx(Name$2, { children: cert.url ? /* @__PURE__ */ jsx("a", { href: cert.url, target: "_blank", rel: "noopener noreferrer", children: cert.name }) : cert.name }),
      cert.date && /* @__PURE__ */ jsx(Date$2, { children: formatDate$3(cert.date) })
    ] }),
    cert.issuer && /* @__PURE__ */ jsx(Issuer, { children: cert.issuer })
  ] }, i)) });
};
const PublicationItem = dt.div`
  margin-bottom: 1.25rem;
`;
const Header$2 = dt.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
const Name$1 = dt.h3`
  font-size: 1rem;
  color: #0b1f3a;
  margin: 0;
  font-style: italic;
`;
const Date$1 = dt.div`
  font-size: 0.9rem;
  color: #666;
`;
const Publisher = dt.div`
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 0.25rem;
`;
const Summary$1 = dt.div`
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
`;
const formatDate$2 = (date) => {
  if (!date) return "";
  const d = new Date$1(date);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};
const Publications = ({ publications }) => {
  if (!publications || publications.length === 0) return null;
  return /* @__PURE__ */ jsx(Section, { title: "Publications", children: publications.map((pub, i) => /* @__PURE__ */ jsxs(PublicationItem, { children: [
    /* @__PURE__ */ jsxs(Header$2, { children: [
      /* @__PURE__ */ jsx(Name$1, { children: pub.url ? /* @__PURE__ */ jsx("a", { href: pub.url, target: "_blank", rel: "noopener noreferrer", children: pub.name }) : pub.name }),
      pub.releaseDate && /* @__PURE__ */ jsx(Date$1, { children: formatDate$2(pub.releaseDate) })
    ] }),
    pub.publisher && /* @__PURE__ */ jsx(Publisher, { children: pub.publisher }),
    pub.summary && /* @__PURE__ */ jsx(Summary$1, { children: pub.summary })
  ] }, i)) });
};
const AwardItem = dt.div`
  margin-bottom: 1.25rem;
`;
const Header$1 = dt.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
const Title = dt.h3`
  font-size: 1rem;
  color: #0b1f3a;
  margin: 0;
`;
const DateText = dt.div`
  font-size: 0.9rem;
  color: #666;
`;
const Awarder = dt.div`
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 0.25rem;
`;
const Summary = dt.div`
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
`;
const formatDate$1 = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};
const Awards = ({ awards }) => {
  if (!awards || awards.length === 0) return null;
  return /* @__PURE__ */ jsx(Section, { title: "Awards & Honors", children: awards.map((award, i) => /* @__PURE__ */ jsxs(AwardItem, { children: [
    /* @__PURE__ */ jsxs(Header$1, { children: [
      /* @__PURE__ */ jsx(Title, { children: award.title }),
      award.date && /* @__PURE__ */ jsx(DateText, { children: formatDate$1(award.date) })
    ] }),
    award.awarder && /* @__PURE__ */ jsx(Awarder, { children: award.awarder }),
    award.summary && /* @__PURE__ */ jsx(Summary, { children: award.summary })
  ] }, i)) });
};
const SkillsGrid = dt.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;
const SkillCategory = dt.div`
  margin-bottom: 1rem;
`;
const CategoryName = dt.h3`
  font-size: 1rem;
  color: #0b1f3a;
  margin-bottom: 0.5rem;
`;
const KeywordList = dt.div`
  font-size: 0.95rem;
  color: #555;
  line-height: 1.5;
`;
const Skills = ({ skills }) => {
  if (!skills || skills.length === 0) return null;
  return /* @__PURE__ */ jsx(Section, { title: "Skills", children: /* @__PURE__ */ jsx(SkillsGrid, { children: skills.map((skill, i) => /* @__PURE__ */ jsxs(SkillCategory, { children: [
    /* @__PURE__ */ jsx(CategoryName, { children: skill.name }),
    skill.keywords && skill.keywords.length > 0 && /* @__PURE__ */ jsx(KeywordList, { children: skill.keywords.join(" • ") })
  ] }, i)) }) });
};
const InterestList = dt.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;
const InterestItem = dt.div`
  margin-bottom: 0.75rem;
`;
const InterestName = dt.h3`
  font-size: 1rem;
  color: #0b1f3a;
  margin-bottom: 0.25rem;
`;
const Keywords = dt.div`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
`;
const Interests = ({ interests }) => {
  if (!interests || interests.length === 0) return null;
  return /* @__PURE__ */ jsx(Section, { title: "Interests", children: /* @__PURE__ */ jsx(InterestList, { children: interests.map((interest, i) => /* @__PURE__ */ jsxs(InterestItem, { children: [
    /* @__PURE__ */ jsx(InterestName, { children: interest.name }),
    interest.keywords && interest.keywords.length > 0 && /* @__PURE__ */ jsx(Keywords, { children: interest.keywords.join(", ") })
  ] }, i)) }) });
};
const LanguageList = dt.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;
const LanguageItem = dt.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;
const LanguageName = dt.span`
  font-size: 1rem;
  color: #333;
`;
const Fluency = dt.span`
  font-size: 0.9rem;
  color: #666;
`;
const Languages = ({ languages }) => {
  if (!languages || languages.length === 0) return null;
  return /* @__PURE__ */ jsx(Section, { title: "Languages", children: /* @__PURE__ */ jsx(LanguageList, { children: languages.map((lang, i) => /* @__PURE__ */ jsxs(LanguageItem, { children: [
    /* @__PURE__ */ jsx(LanguageName, { children: lang.language }),
    lang.fluency && /* @__PURE__ */ jsx(Fluency, { children: lang.fluency })
  ] }, i)) }) });
};
const ReferenceItem = dt.div`
  margin-bottom: 1.25rem;
`;
const Name = dt.h3`
  font-size: 1rem;
  color: #0b1f3a;
  margin-bottom: 0.25rem;
`;
const Reference = dt.div`
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  font-style: italic;
`;
const References = ({ references }) => {
  if (!references || references.length === 0) return null;
  return /* @__PURE__ */ jsx(Section, { title: "References", children: references.map((ref, i) => /* @__PURE__ */ jsxs(ReferenceItem, { children: [
    /* @__PURE__ */ jsx(Name, { children: ref.name }),
    ref.reference && /* @__PURE__ */ jsxs(Reference, { children: [
      '"',
      ref.reference,
      '"'
    ] })
  ] }, i)) });
};
const VolunteerItem = dt.div`
  margin-bottom: 1.75rem;
`;
const Header = dt.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
const Position = dt.h3`
  font-size: 1.0625rem;
  color: #0b1f3a;
  margin: 0;
`;
const DateRange = dt.div`
  font-size: 0.9rem;
  color: #666;
`;
const Organization = dt.div`
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.5rem;
`;
const Description = dt.div`
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
  margin-bottom: 0.5rem;

  p {
    margin-bottom: 0.5rem;
  }
`;
const Highlights = dt.ul`
  margin-top: 0.5rem;
  padding-left: 1.5rem;
  list-style: disc;

  li {
    margin-bottom: 0.4rem;
    line-height: 1.6;
    color: #444;
  }
`;
const formatDate = (date) => {
  if (!date) return "Present";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};
const Volunteer = ({ volunteer }) => {
  if (!volunteer || volunteer.length === 0) return null;
  return /* @__PURE__ */ jsx(Section, { title: "Volunteer Work", children: volunteer.map((item, i) => /* @__PURE__ */ jsxs(VolunteerItem, { children: [
    /* @__PURE__ */ jsxs(Header, { children: [
      /* @__PURE__ */ jsx(Position, { children: item.position }),
      /* @__PURE__ */ jsxs(DateRange, { children: [
        formatDate(item.startDate),
        " - ",
        formatDate(item.endDate)
      ] })
    ] }),
    /* @__PURE__ */ jsx(Organization, { children: item.organization }),
    item.summary && /* @__PURE__ */ jsx(
      Description,
      {
        dangerouslySetInnerHTML: { __html: marked(item.summary) }
      }
    ),
    item.highlights && item.highlights.length > 0 && /* @__PURE__ */ jsx(Highlights, { children: item.highlights.map((highlight, j2) => /* @__PURE__ */ jsx("li", { children: highlight }, j2)) })
  ] }, i)) });
};
const Layout = dt.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem;

  @media print {
    padding: 0;
  }
`;
const Resume = ({ resume }) => {
  return /* @__PURE__ */ jsxs(Layout, { children: [
    /* @__PURE__ */ jsx(Hero, { basics: resume.basics }),
    /* @__PURE__ */ jsx(Summary$2, { basics: resume.basics }),
    /* @__PURE__ */ jsx(Work, { work: resume.work }),
    /* @__PURE__ */ jsx(Projects, { projects: resume.projects }),
    /* @__PURE__ */ jsx(Education, { education: resume.education }),
    /* @__PURE__ */ jsx(Certificates, { certificates: resume.certificates }),
    /* @__PURE__ */ jsx(Publications, { publications: resume.publications }),
    /* @__PURE__ */ jsx(Awards, { awards: resume.awards }),
    /* @__PURE__ */ jsx(Volunteer, { volunteer: resume.volunteer }),
    /* @__PURE__ */ jsx(Skills, { skills: resume.skills }),
    /* @__PURE__ */ jsx(Languages, { languages: resume.languages }),
    /* @__PURE__ */ jsx(Interests, { interests: resume.interests }),
    /* @__PURE__ */ jsx(References, { references: resume.references })
  ] });
};
const render = (resume) => {
  const sheet = new gt();
  const html = renderToString(sheet.collectStyles(/* @__PURE__ */ jsx(Resume, { resume })));
  const styles = sheet.getStyleTags();
  return `<!DOCTYPE html><head>
  <title>${resume.basics.name} - Resume</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <style>
    html {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
      background: #fff;
      font-size: 16px;
      line-height: 1.6;
      color: #1a1a1a;
    }

    body {
      margin: 0;
      padding: 0;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: Georgia, 'Times New Roman', serif;
      font-weight: 600;
      color: #0b1f3a;
      margin: 0;
      line-height: 1.3;
    }

    h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      letter-spacing: 0.01em;
    }

    h3 {
      font-size: 1.125rem;
      margin-bottom: 0.5rem;
    }

    p {
      padding: 0;
      margin: 0 0 0.75rem 0;
      font-size: 1rem;
    }

    a {
      color: #0b1f3a;
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s ease;
    }

    a:hover {
      border-bottom-color: #0b1f3a;
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }
  </style>
  ${styles}</head><body>${html}</body></html>`;
};
export {
  Resume,
  render
};
