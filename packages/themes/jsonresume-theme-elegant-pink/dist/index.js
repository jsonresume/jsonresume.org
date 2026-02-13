import { jsx, jsxs } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import o, { useRef, useContext, useState, useMemo, useEffect, useDebugValue, createElement, createContext } from "react";
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
function charat(value, index2) {
  return value.charCodeAt(index2) | 0;
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
function escaping(index2, count) {
  while (--count && next())
    if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97)
      break;
  return slice(index2, caret() + (count < 6 && peek() == 32 && next() == 32));
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
function commenter(type, index2) {
  while (next())
    if (type + character === 47 + 10)
      break;
    else if (type + character === 42 + 42 && peek() === 47)
      break;
  return "/*" + slice(index2, position - 1) + "*" + from(type === 47 ? type : next());
}
function identifier(index2) {
  while (!token(peek()))
    next();
  return slice(index2, position);
}
function compile(value) {
  return dealloc(parse("", null, null, null, [""], value = alloc(value), 0, [0], value));
}
function parse(value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
  var index2 = 0;
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
          if (indexof(characters2 += replace(delimit(character2), "&", "&\f"), "&\f", abs(index2 ? points[index2 - 1] : 0)) != -1)
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
        points[index2++] = strlen(characters2) * ampersand;
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
            append(reference = ruleset(characters2, root, parent, index2, offset, rules, points, type, props = [], children = [], length2, rulesets), rulesets);
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
        index2 = offset = property = 0, variable = ampersand = 1, type = characters2 = "", length2 = pseudo;
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
            points[index2++] = (strlen(characters2) - 1) * ampersand, ampersand = 1;
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
function ruleset(value, root, parent, index2, offset, rules, points, type, props, children, length2, siblings) {
  var post = offset - 1;
  var rule = offset === 0 ? rules : [""];
  var size = sizeof(rule);
  for (var i = 0, j2 = 0, k2 = 0; i < index2; ++i)
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
      if (children && children.some(function(element, index2) {
        return length2 = index2, match(element.props, /grid-\w+-end/);
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
      return replace(value, /(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/, function(_2, a, b2, c, d, e, f2) {
        return MS + a + ":" + b2 + f2 + (c ? MS + a + "-span:" + (d ? e : +e - +b2) + f2 : "") + value;
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
function stringify(element, index2, children, callback) {
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
  return function(element, index2, children, callback) {
    var output = "";
    for (var i = 0; i < length2; i++)
      output += collection[i](element, index2, children, callback) || "";
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
function prefixer(element, index2, children, callback) {
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
var f = "undefined" != typeof process && void 0 !== process.env && (process.env.REACT_APP_SC_ATTR || process.env.SC_ATTR) || "data-styled", m = "active", y = "data-styled-version", v = "6.1.19", g = "/*!sc*/\n", S = "undefined" != typeof window && "undefined" != typeof document, w = Boolean("boolean" == typeof SC_DISABLE_SPEEDY ? SC_DISABLE_SPEEDY : "undefined" != typeof process && void 0 !== process.env && void 0 !== process.env.REACT_APP_SC_DISABLE_SPEEDY && "" !== process.env.REACT_APP_SC_DISABLE_SPEEDY ? "false" !== process.env.REACT_APP_SC_DISABLE_SPEEDY && process.env.REACT_APP_SC_DISABLE_SPEEDY : "undefined" != typeof process && void 0 !== process.env && void 0 !== process.env.SC_DISABLE_SPEEDY && "" !== process.env.SC_DISABLE_SPEEDY ? "false" !== process.env.SC_DISABLE_SPEEDY && process.env.SC_DISABLE_SPEEDY : "production" !== process.env.NODE_ENV), b = {}, E = /invalid hook call/i, N = /* @__PURE__ */ new Set(), P = function(t, n) {
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
    var b2 = a.shouldForwardProp;
    if (r.shouldForwardProp) {
      var E2 = r.shouldForwardProp;
      w2 = function(e2, t) {
        return b2(e2, t) && E2(e2, t);
      };
    } else w2 = b2;
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
      for (var b3 in g3) void 0 === g3[b3] || "$" === b3[0] || "as" === b3 || "theme" === b3 && g3.theme === v2 || ("forwardedAs" === b3 ? w3.as = g3.forwardedAs : y3 && !y3(b3, S3) || (w3[b3] = g3[b3], y3 || "development" !== process.env.NODE_ENV || isPropValid(b3) || st.has(b3) || !A.has(S3) || (st.add(b3), console.warn('styled-components: it looks like an unknown prop "'.concat(b3, '" is being sent through to the DOM, which will likely trigger a React console error. If you would like automatic filtering of unknown props, you can opt-into that behavior via `<StyleSheetManager shouldForwardProp={...}>` (connect an API like `@emotion/is-prop-valid`) or consider using transient props (`$` prefix for automatic filtering.)')))));
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
var ht = (function() {
  function e(e2, t) {
    this.rules = e2, this.componentId = t, this.isStatic = Ze(e2), ke.registerId(this.componentId + 1);
  }
  return e.prototype.createStyles = function(e2, t, n, o2) {
    var r = o2(ae(Xe(this.rules, t, n, o2)), ""), s = this.componentId + e2;
    n.insertRules(s, s, r);
  }, e.prototype.removeStyles = function(e2, t) {
    t.clearRules(this.componentId + e2);
  }, e.prototype.renderStyles = function(e2, t, n, o2) {
    e2 > 2 && ke.registerId(this.componentId + e2), this.removeStyles(e2, n), this.createStyles(e2, t, n, o2);
  }, e;
})();
function ft(n) {
  for (var r = [], s = 1; s < arguments.length; s++) r[s - 1] = arguments[s];
  var i = lt.apply(void 0, __spreadArray([n], r, false)), a = "sc-global-".concat($(JSON.stringify(i))), c = new ht(i, a);
  "production" !== process.env.NODE_ENV && P(a);
  var l = function(e) {
    var n2 = Le(), r2 = o.useContext(et), s2 = o.useRef(n2.styleSheet.allocateGSInstance(a)).current;
    return "production" !== process.env.NODE_ENV && o.Children.count(e.children) && console.warn("The global style component ".concat(a, " was given child JSX. createGlobalStyle does not render children.")), "production" !== process.env.NODE_ENV && i.some(function(e2) {
      return "string" == typeof e2 && -1 !== e2.indexOf("@import");
    }) && console.warn("Please do not use @import CSS syntax in createGlobalStyle at this time, as the CSSOM APIs we use in production do not handle it well. Instead, we recommend using a library such as react-helmet to inject a typical <link> meta tag to the stylesheet, or simply embedding it manually in your index.html <head> section for a simpler app."), n2.styleSheet.server && (function(e2, n3, o2, r3, s3) {
      if (c.isStatic) c.renderStyles(e2, b, o2, s3);
      else {
        var i2 = __assign(__assign({}, n3), { theme: I(n3, r3, l.defaultProps) });
        c.renderStyles(e2, i2, o2, s3);
      }
    })(s2, e, n2.styleSheet, r2, n2.stylis), null;
  };
  return o.memo(l);
}
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
createContext({
  theme: "professional",
  setTheme: () => {
  }
});
ft`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: var(--resume-font-sans);
    font-size: var(--resume-size-body);
    line-height: var(--resume-line-height-normal);
    color: var(--resume-color-primary);
    background: var(--resume-color-background);
  }
`;
const StyledSection = dt.section`
  margin-bottom: ${(props) => props.theme?.spacing?.section || "var(--resume-space-section, 2rem)"};

  @media print {
    page-break-inside: avoid;
  }
`;
function Section({ children, className, id, ...rest }) {
  return /* @__PURE__ */ jsx(
    StyledSection,
    {
      id,
      className: `resume-section ${className || ""}`.trim(),
      ...rest,
      children
    }
  );
}
const StyledTitle = dt.h2`
  font-size: ${(props) => props.theme?.typography?.heading || "var(--resume-size-heading, 16pt)"};
  font-weight: 600;
  color: ${(props) => props.theme?.colors?.primary || "var(--resume-color-primary, #000)"};
  margin: 0 0
    ${(props) => props.theme?.spacing?.item || "var(--resume-space-item, 1rem)"}
    0;
  padding-bottom: 4px;
  border-bottom: 2px solid
    ${(props) => props.theme?.colors?.accent || "var(--resume-color-accent, #0066cc)"};

  @media print {
    page-break-after: avoid;
  }
`;
const Icon = dt.span`
  margin-right: 8px;
  font-size: 1.2em;
`;
function SectionTitle({
  children,
  icon,
  level = 2,
  className,
  ...rest
}) {
  return /* @__PURE__ */ jsxs(
    StyledTitle,
    {
      as: `h${level}`,
      className: `resume-section-title ${className || ""}`.trim(),
      ...rest,
      children: [
        icon && /* @__PURE__ */ jsx(Icon, { "aria-hidden": "true", className: "resume-icon", children: icon }),
        children
      ]
    }
  );
}
dt.div`
  margin-bottom: ${(props) => props.theme?.spacing?.item || "var(--resume-space-item, 1rem)"};

  @media print {
    page-break-inside: avoid;
  }
`;
dt.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
`;
dt.div`
  font-weight: 600;
  color: ${(props) => props.theme?.colors?.primary || "var(--resume-color-primary, #000)"};
  font-size: ${(props) => props.theme?.typography?.body || "var(--resume-size-body, 11pt)"};
`;
dt.div`
  color: ${(props) => props.theme?.colors?.secondary || "var(--resume-color-secondary, #333)"};
  margin-bottom: 4px;
`;
dt.div`
  display: flex;
  gap: 12px;
  font-size: ${(props) => props.theme?.typography?.small || "var(--resume-size-small, 10pt)"};
  color: ${(props) => props.theme?.colors?.tertiary || "var(--resume-color-tertiary, #666)"};
  margin-bottom: 8px;
`;
dt.p`
  margin: 8px 0;
  line-height: 1.6;
`;
dt.ul`
  margin: 8px 0;
  padding-left: 20px;
  list-style-type: disc;

  li {
    margin: 4px 0;
    line-height: 1.5;
  }
`;
function formatDateRange({
  startDate,
  endDate,
  format = "short",
  locale = "en-US",
  numberingSystem,
  presentLabel
}) {
  if (!startDate) return "";
  const getPresentLabel = () => {
    if (presentLabel) return presentLabel;
    const labels = {
      en: "Present",
      "en-US": "Present",
      "en-GB": "Present",
      fr: "Présent",
      "fr-FR": "Présent",
      es: "Presente",
      "es-ES": "Presente",
      de: "Heute",
      "de-DE": "Heute",
      it: "Presente",
      "it-IT": "Presente",
      pt: "Presente",
      "pt-BR": "Presente",
      ja: "現在",
      "ja-JP": "現在",
      zh: "至今",
      "zh-CN": "至今",
      "zh-TW": "至今",
      ko: "현재",
      "ko-KR": "현재",
      ar: "حاضر",
      "ar-SA": "حاضر"
    };
    return labels[locale] || labels[locale.split("-")[0]] || "Present";
  };
  const formatDate = (dateStr) => {
    if (!dateStr) return getPresentLabel();
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) return dateStr;
    const monthFormats = {
      short: { month: "short" },
      long: { month: "long" },
      numeric: { month: "2-digit" }
    };
    const options = {
      ...monthFormats[format],
      year: "numeric"
    };
    if (numberingSystem) {
      options.numberingSystem = numberingSystem;
    }
    const formatter = new Intl.DateTimeFormat(locale, options);
    return formatter.format(date);
  };
  const start = formatDate(startDate);
  if (endDate === void 0) return start;
  const end = formatDate(endDate);
  return `${start} - ${end}`;
}
const StyledDateRange = dt.span`
  font-size: ${(props) => props.theme?.typography?.small || "var(--resume-size-small, 10pt)"};
  color: ${(props) => props.theme?.colors?.tertiary || "var(--resume-color-tertiary, #666)"};
  white-space: nowrap;
`;
function DateRange({
  startDate,
  endDate,
  format = "short",
  locale = "en-US",
  numberingSystem,
  presentLabel,
  className,
  ...rest
}) {
  const formatted = formatDateRange({
    startDate,
    endDate,
    format,
    locale,
    numberingSystem,
    presentLabel
  });
  if (!formatted) return null;
  return /* @__PURE__ */ jsx(
    StyledDateRange,
    {
      className: `resume-date-range ${className || ""}`.trim(),
      ...rest,
      children: formatted
    }
  );
}
dt.span`
  display: inline-block;
  padding: ${(props) => {
  if (props.$size === "sm") return "2px 8px";
  if (props.$size === "lg") return "6px 16px";
  return "4px 12px";
}};
  border-radius: ${(props) => props.theme?.radius?.sm || "var(--resume-radius-sm, 4px)"};
  font-size: ${(props) => {
  if (props.$size === "sm") return "9pt";
  if (props.$size === "lg") return "11pt";
  return "10pt";
}};
  font-weight: 500;
  background: ${(props) => {
  if (props.$variant === "accent") {
    return props.theme?.colors?.accentLight || "var(--resume-color-accent-light, #e6f2ff)";
  }
  if (props.$variant === "secondary") {
    return props.theme?.colors?.muted || "var(--resume-color-muted, #f5f5f5)";
  }
  return props.theme?.colors?.muted || "var(--resume-color-muted, #f5f5f5)";
}};
  color: ${(props) => {
  if (props.$variant === "accent") {
    return props.theme?.colors?.accent || "var(--resume-color-accent, #0066cc)";
  }
  return props.theme?.colors?.primary || "var(--resume-color-primary, #000)";
}};

  @media print {
    background: ${(props) => props.$variant === "accent" ? "#e6f2ff" : "#f5f5f5"};
    color: ${(props) => props.$variant === "accent" ? "#0066cc" : "#000"};
  }
`;
dt.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 8px 0;
`;
function safeUrl(url) {
  if (!url || typeof url !== "string") {
    return null;
  }
  const trimmed = url.trim();
  const dangerousProtocols = /^(javascript|data|vbscript|file|about):/i;
  if (dangerousProtocols.test(trimmed)) {
    console.warn(`[Security] Blocked dangerous URL: ${trimmed.slice(0, 50)}`);
    return null;
  }
  const safeProtocols = /^(https?|mailto|tel|sms|ftp):/i;
  if (safeProtocols.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith("/") || trimmed.startsWith(".")) {
    return trimmed;
  }
  if (/^www\./i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  if (/^[a-z0-9][a-z0-9.-]+\.[a-z]{2,}$/i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  console.warn(`[Security] Uncertain URL safety: ${trimmed.slice(0, 50)}`);
  return trimmed;
}
const ContactContainer = dt.div`
  display: flex;
  justify-content: center;
  gap: ${(props) => props.theme?.spacing?.small || "var(--resume-space-small, 12px)"};
  flex-wrap: wrap;
  font-size: ${(props) => props.theme?.typography?.small || "var(--resume-size-small, 10pt)"};
  color: ${(props) => props.theme?.colors?.text || "var(--resume-color-text, #333)"};

  a {
    color: ${(props) => props.theme?.colors?.link || "var(--resume-color-link, #0066cc)"};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
const ContactItem = dt.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;
const Separator = dt.span`
  color: ${(props) => props.theme?.colors?.muted || "var(--resume-color-muted, #999)"};
`;
function ContactInfo({ basics = {}, separator = "•", className }) {
  const { email, phone, url, location, profiles = [] } = basics;
  const items = [];
  if (email) {
    items.push(
      /* @__PURE__ */ jsx(ContactItem, { children: /* @__PURE__ */ jsx("a", { href: safeUrl(`mailto:${email}`), "aria-label": "Email", children: email }) }, "email")
    );
  }
  if (phone) {
    items.push(
      /* @__PURE__ */ jsx(ContactItem, { children: /* @__PURE__ */ jsx("a", { href: safeUrl(`tel:${phone}`), "aria-label": "Phone", children: phone }) }, "phone")
    );
  }
  if (location) {
    const locationStr = [location.city, location.region, location.countryCode].filter(Boolean).join(", ");
    if (locationStr) {
      items.push(
        /* @__PURE__ */ jsx(ContactItem, { "aria-label": "Location", children: locationStr }, "location")
      );
    }
  }
  if (url) {
    const displayUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
    items.push(
      /* @__PURE__ */ jsx(ContactItem, { children: /* @__PURE__ */ jsx(
        "a",
        {
          href: safeUrl(url),
          target: "_blank",
          rel: "noopener noreferrer",
          "aria-label": "Website",
          children: displayUrl
        }
      ) }, "url")
    );
  }
  profiles.forEach((profile, index2) => {
    if (profile.url) {
      items.push(
        /* @__PURE__ */ jsx(ContactItem, { children: /* @__PURE__ */ jsx(
          "a",
          {
            href: safeUrl(profile.url),
            target: "_blank",
            rel: "noopener noreferrer",
            "aria-label": profile.network,
            children: profile.network || profile.username
          }
        ) }, `profile-${index2}`)
      );
    }
  });
  if (items.length === 0) return null;
  return /* @__PURE__ */ jsx(ContactContainer, { className: `resume-contact ${className || ""}`.trim(), children: items.map((item, index2) => /* @__PURE__ */ jsxs(o.Fragment, { children: [
    index2 > 0 && /* @__PURE__ */ jsx(Separator, { "aria-hidden": "true", children: separator }),
    item
  ] }, index2)) });
}
dt.a`
  color: ${(props) => props.theme?.colors?.link || "var(--resume-color-link, #0066cc)"};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:visited {
    color: ${(props) => props.theme?.colors?.linkVisited || "var(--resume-color-link-visited, #551a8b)"};
  }

  @media print {
    color: inherit;
    text-decoration: underline;
  }
`;
dt.span`
  /* Thin space (U+2009) + pipe + thin space for balanced spacing */
  &::before {
    content: '\u2009|\u2009';
    opacity: 0.5;
    color: ${(props) => props.$color || "currentColor"};
    font-weight: normal;
  }

  /* Ensure consistent spacing across browsers */
  display: inline;
  white-space: pre;

  @media print {
    &::before {
      content: '\u2009|\u2009';
      opacity: 0.6;
    }
  }
`;
dt.hr`
  border: none;
  border-top: 0.5pt solid
    ${(props) => props.color || props.theme?.colors?.border || "var(--resume-color-border, #e5e7eb)"};
  margin-left: ${(props) => props.inset || "0"};
  margin-right: ${(props) => props.inset || "0"};
  margin-top: ${(props) => props.theme?.spacing?.tight || "var(--resume-space-tight, 0.5rem)"};
  margin-bottom: ${(props) => props.theme?.spacing?.tight || "var(--resume-space-tight, 0.5rem)"};

  @media print {
    /* Ensure minimum stroke weight for print visibility */
    border-top-width: 0.3pt;
    /* Prevent page breaks */
    page-break-inside: avoid;
    /* Ensure border renders in all print modes */
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;
dt.hr`
  border: none;
  border-top: ${(props) => props.dotSize || "2px"} dotted
    ${(props) => props.color || props.theme?.colors?.border || "var(--resume-color-border, #e5e7eb)"};
  margin-top: ${(props) => props.theme?.spacing?.tight || "var(--resume-space-tight, 0.5rem)"};
  margin-bottom: ${(props) => props.theme?.spacing?.tight || "var(--resume-space-tight, 0.5rem)"};

  /* Override default border-top-width to use fixed spacing */
  ${(props) => props.spacing && `
    background-image: radial-gradient(
      circle,
      ${props.color || props.theme?.colors?.border || "var(--resume-color-border, #e5e7eb)"} ${props.dotSize || "2px"},
      transparent ${props.dotSize || "2px"}
    );
    background-size: ${props.spacing} 1px;
    background-repeat: repeat-x;
    background-position: center;
    border: none;
    height: 1px;
  `}

  @media print {
    /* Ensure dots render in all print modes */
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    /* Prevent page breaks */
    page-break-inside: avoid;
    /* Fixed dot rendering for PDF generation */
    border-top-width: ${(props) => props.dotSize || "2px"};
  }
`;
dt.div`
  position: absolute;
  ${(props) => props.position === "right" ? "right: 0;" : "left: 0;"}
  top: ${(props) => props.top || "0"};
  width: ${(props) => props.width || "4mm"};
  max-width: 6mm; /* ATS-safe maximum */
  height: ${(props) => props.height || "100%"};
  background-color: ${(props) => props.color || props.theme?.colors?.accent || "var(--resume-color-accent, #2563eb)"};
  pointer-events: none; /* Prevent interaction */

  @media print {
    /* Ensure color renders in print */
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    /* Prevent page breaks inside stripe */
    page-break-inside: avoid;
  }

  @media screen and (max-width: 768px) {
    /* Reduce width on mobile */
    width: ${(props) => props.width ? `calc(${props.width} * 0.75)` : "3mm"};
  }
`;
dt.div`
  width: ${(props) => props.width || "30%"};
  max-width: 40%; /* Design constraint: max 40% */
  min-width: 25%; /* Design constraint: min 25% */
  height: ${(props) => props.thickness || "2.5pt"};
  background-color: ${(props) => props.color || props.theme?.colors?.accent || "var(--resume-color-accent, #2563eb)"};
  margin-bottom: ${(props) => props.theme?.spacing?.tight || "var(--resume-space-tight, 0.5rem)"};
  margin-left: ${(props) => {
  if (props.align === "center") return "auto";
  if (props.align === "right") return "auto";
  return "0";
}};
  margin-right: ${(props) => {
  if (props.align === "center") return "auto";
  if (props.align === "right") return "0";
  return "auto";
}};

  @media print {
    /* Ensure color renders in print */
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    /* Prevent page breaks */
    page-break-inside: avoid;
    /* Ensure minimum thickness for print visibility */
    min-height: 2pt;
  }

  @media screen and (max-width: 768px) {
    /* Increase width slightly on mobile for better visibility */
    width: ${(props) => props.width ? `calc(${props.width} * 1.2)` : "36%"};
  }
`;
dt.div`
  display: flex;
  flex-direction: column;
  margin-top: ${(props) => props.theme?.spacing?.tight || "var(--resume-space-tight, 0.5rem)"};
  margin-bottom: ${(props) => props.theme?.spacing?.tight || "var(--resume-space-tight, 0.5rem)"};

  @media print {
    page-break-inside: avoid;
  }
`;
dt.div`
  width: 100%;
  height: ${(props) => props.thickness || "0.4pt"};
  background-color: ${(props) => props.color || props.theme?.colors?.border || "var(--resume-color-border, #e5e7eb)"};
  margin-bottom: ${(props) => props.gapSize};

  &:last-child {
    margin-bottom: 0;
  }

  @media print {
    /* Ensure minimum stroke weight for print visibility */
    min-height: 0.3pt;
    /* Ensure color renders in print */
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;
dt.div`
  display: grid;
  grid-template-columns: ${(props) => props.$columns === 1 ? "1fr" : `repeat(${props.$columns}, 1fr)`};
  gap: ${(props) => props.$gap || "var(--resume-column-gap)"};
  margin-bottom: ${(props) => props.$spacing || "var(--resume-space-section)"};

  @media print {
    gap: ${(props) => props.$gap || "16px"};
    page-break-inside: avoid;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
dt.div`
  display: grid;
  grid-template-columns: ${(props) => props.$sidebarPosition === "right" ? `1fr ${props.$sidebarWidth || "30%"}` : `${props.$sidebarWidth || "30%"} 1fr`};
  gap: ${(props) => props.$gap || "var(--resume-column-gap)"};

  @media print {
    gap: ${(props) => props.$gap || "16px"};
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
dt.aside`
  grid-area: ${(props) => props.$position === "right" ? "1 / 2" : "1 / 1"};

  @media (max-width: 768px) {
    grid-area: auto;
  }
`;
dt.main`
  grid-area: ${(props) => props.$sidebarPosition === "right" ? "1 / 1" : "1 / 2"};

  @media (max-width: 768px) {
    grid-area: auto;
  }
`;
dt.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.$spacing || "var(--resume-space-item)"};

  @media print {
    gap: ${(props) => props.$spacing || "12px"};
  }
`;
dt.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(${(props) => props.$minCardWidth || "250px"}, 1fr)
  );
  gap: ${(props) => props.$gap || "var(--resume-space-item)"};
  margin-bottom: ${(props) => props.$spacing || "var(--resume-space-section)"};

  @media print {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${(props) => props.$gap || "12px"};
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
dt.div`
  display: flex;
  flex-direction: ${(props) => props.$direction || "row"};
  justify-content: ${(props) => props.$justify || "flex-start"};
  align-items: ${(props) => props.$align || "stretch"};
  flex-wrap: ${(props) => props.$wrap ? "wrap" : "nowrap"};
  gap: ${(props) => props.$gap || "var(--resume-space-tight)"};

  @media print {
    gap: ${(props) => props.$gap || "8px"};
  }

  @media (max-width: 768px) {
    flex-direction: ${(props) => props.$responsiveDirection || props.$direction === "row" ? "column" : props.$direction};
  }
`;
dt.div`
  /* Use CSS columns for visual two-column layout */
  column-count: 2;
  column-gap: ${(props) => props.$columnGap || "16px"};

  /* Prevent column breaks inside items */
  & > * {
    break-inside: avoid;
    page-break-inside: avoid;
    margin-bottom: ${(props) => props.$gap || "8px"};
    display: block;
  }

  /* Last item in each column shouldn't have bottom margin */
  & > *:last-child {
    margin-bottom: 0;
  }

  @media print {
    column-count: 2;
    column-gap: 12pt;

    & > * {
      margin-bottom: 6pt;
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }

  /* Collapse to single column on small screens */
  @media (max-width: 768px) {
    column-count: 1;
    column-gap: 0;

    & > * {
      margin-bottom: ${(props) => props.$gap || "8px"};
    }
  }
`;
dt.div`
  margin-bottom: var(--resume-space-tight);
`;
dt.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: var(--resume-size-body);
  color: var(--resume-color-primary);
`;
dt.div`
  width: 100%;
  height: ${(props) => props.$height || "8px"};
  background-color: var(--resume-color-border);
  border-radius: var(--resume-radius-sm);
  overflow: hidden;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;
dt.div`
  width: ${(props) => props.$level}%;
  height: 100%;
  background-color: ${(props) => props.$color || "var(--resume-color-accent)"};
  transition: width 0.3s ease;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;
dt.span`
  display: inline-block;
  padding: ${(props) => props.$size === "small" ? "4px 8px" : "6px 12px"};
  margin: 4px;
  background-color: ${(props) => props.$variant === "filled" ? "var(--resume-color-accent)" : "var(--resume-color-background)"};
  color: ${(props) => props.$variant === "filled" ? "#ffffff" : "var(--resume-color-primary)"};
  border: ${(props) => props.$variant === "outlined" ? "1px solid var(--resume-color-border)" : "none"};
  border-radius: ${(props) => props.$rounded ? "999px" : "var(--resume-radius-sm)"};
  font-size: ${(props) => props.$size === "small" ? "var(--resume-size-small)" : "var(--resume-size-body)"};
  font-weight: var(--resume-weight-medium);

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    margin: 2px;
  }
`;
dt.div`
  display: flex;
  align-items: center;
  gap: var(--resume-space-tight);
  margin-bottom: var(--resume-space-tight);
`;
dt.span`
  flex: 1;
  font-size: var(--resume-size-body);
  color: var(--resume-color-primary);
`;
dt.div`
  display: flex;
  gap: 4px;
`;
dt.span`
  width: ${(props) => props.$size || "10px"};
  height: ${(props) => props.$size || "10px"};
  border-radius: 50%;
  background-color: ${(props) => props.$filled ? "var(--resume-color-accent)" : "var(--resume-color-border)"};

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;
dt.div`
  margin-bottom: var(--resume-space-item);
`;
dt.h4`
  font-size: var(--resume-size-subheading);
  font-weight: var(--resume-weight-semibold);
  color: var(--resume-color-primary);
  margin-bottom: var(--resume-space-tight);
`;
dt.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;
dt.span`
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);

  &:not(:last-child)::after {
    content: '${(props) => props.$separator || "•"}';
    margin-left: 6px;
    color: var(--resume-color-border);
  }
`;
dt.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;
dt.span`
  display: inline-block;
  padding: 4px 12px;
  font-size: ${(props) => {
  if (props.$weight >= 80) return "var(--resume-size-subheading)";
  if (props.$weight >= 50) return "var(--resume-size-body)";
  return "var(--resume-size-small)";
}};
  font-weight: ${(props) => props.$weight >= 70 ? "var(--resume-weight-semibold)" : "var(--resume-weight-normal)"};
  color: var(--resume-color-primary);
  background-color: ${(props) => `color-mix(in srgb, var(--resume-color-accent) ${props.$weight}%, transparent)`};
  border-radius: var(--resume-radius-sm);

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;
dt.div`
  margin-bottom: var(--resume-space-item);
`;
dt.h4`
  font-size: var(--resume-size-subheading);
  font-weight: var(--resume-weight-semibold);
  color: var(--resume-color-primary);
  margin-bottom: var(--resume-space-tight);
  border-bottom: 1px solid var(--resume-color-border);
  padding-bottom: 4px;
`;
dt.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
dt.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
`;
dt.span`
  flex: 1;
`;
dt.span`
  font-size: var(--resume-size-small);
  color: var(--resume-color-accent);
  font-weight: var(--resume-weight-medium);
`;
dt.div`
  position: relative;
  margin-bottom: var(--resume-space-section);

  @media print {
    page-break-inside: avoid;
  }
`;
dt.div`
  position: relative;
  padding-left: ${(props) => props.$showLine ? "32px" : "0"};
  margin-bottom: var(--resume-space-item);

  ${(props) => props.$showLine && `
    &::before {
      content: '';
      position: absolute;
      left: 8px;
      top: 8px;
      bottom: -16px;
      width: 2px;
      background-color: var(--resume-color-border);
    }

    &:last-child::before {
      display: none;
    }
  `}

  @media print {
    break-inside: avoid;
  }
`;
dt.div`
  position: absolute;
  left: 0;
  top: 6px;
  width: ${(props) => props.$size || "16px"};
  height: ${(props) => props.$size || "16px"};
  border-radius: 50%;
  background-color: ${(props) => props.$color || "var(--resume-color-accent)"};
  border: 2px solid var(--resume-color-background);

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;
dt.div`
  display: flex;
  flex-direction: column;
`;
dt.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
  flex-wrap: wrap;
`;
dt.h3`
  font-size: var(--resume-size-subheading);
  font-weight: var(--resume-weight-semibold);
  color: var(--resume-color-primary);
  margin: 0;
`;
dt.div`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
`;
dt.div`
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
`;
dt.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--resume-space-item, 12pt);

  @media print {
    break-inside: avoid;
  }
`;
dt.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: ${(props) => props.$lineColor || "var(--resume-color-border, #ddd)"};

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;
dt.div`
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding-left: 20px;
`;
dt.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: ${(props) => props.$width || "8px"};
  height: ${(props) => {
  const height = props.$height || "2pt";
  const value = parseFloat(height);
  const unit = height.replace(/[\d.]/g, "");
  return value < 2 && unit === "pt" ? "2pt" : height;
}};
  background-color: ${(props) => props.$color || "var(--resume-color-border, #ddd)"};

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    min-height: 2pt; /* Ensure visibility in print */
  }
`;
dt.span`
  font-size: var(--resume-size-small, 10pt);
  color: var(--resume-color-secondary, #666);
  font-weight: var(--resume-weight-normal, 400);
  white-space: nowrap;
  flex-shrink: 0;
`;
dt.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;
dt.span`
  font-size: var(--resume-size-body, 11pt);
  color: var(--resume-color-primary, #000);
  font-weight: var(--resume-weight-medium, 500);
`;
dt.span`
  font-size: var(--resume-size-small, 10pt);
  color: var(--resume-color-tertiary, #999);
`;
dt.span`
  font-size: var(--resume-size-small, 10pt);
  color: var(--resume-color-secondary, #666);
  white-space: nowrap;
  font-variant-numeric: tabular-nums; /* Consistent number width */

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;
dt.span`
  font-weight: var(--resume-weight-normal, 400);
`;
dt.span`
  /* En dash with narrow no-break spaces for proper typography */
  margin: 0;
  padding: 0;
`;
dt.img`
  width: ${(props) => props.$size || "80px"};
  height: ${(props) => props.$size || "80px"};
  border-radius: ${(props) => props.$rounded ? "50%" : "var(--resume-radius-md)"};
  object-fit: cover;
  border: ${(props) => props.$border ? `2px solid var(--resume-color-border)` : "none"};

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;
dt.div`
  width: ${(props) => props.$size || "80px"};
  height: ${(props) => props.$size || "80px"};
  border-radius: ${(props) => props.$rounded ? "50%" : "var(--resume-radius-md)"};
  background-color: var(--resume-color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(${(props) => props.$size || "80px"} / 2);
  color: var(--resume-color-secondary);
  font-weight: var(--resume-weight-semibold);
`;
dt.div`
  display: flex;
  flex-direction: ${(props) => props.$direction || "column"};
  align-items: ${(props) => props.$direction === "row" ? "center" : "flex-start"};
  gap: var(--resume-space-item);
  padding: var(--resume-space-item);
  background-color: var(--resume-color-background);
  border: 1px solid var(--resume-color-border);
  border-radius: var(--resume-radius-md);
  margin-bottom: var(--resume-space-section);

  @media print {
    border: 1px solid var(--resume-color-border);
    break-inside: avoid;
  }
`;
dt.div`
  flex: 1;
`;
dt.h1`
  font-size: var(--resume-size-name);
  font-weight: var(--resume-weight-bold);
  color: var(--resume-color-primary);
  margin: 0 0 4px 0;
`;
dt.h2`
  font-size: var(--resume-size-heading);
  font-weight: var(--resume-weight-normal);
  color: var(--resume-color-secondary);
  margin: 0 0 var(--resume-space-tight) 0;
`;
dt.p`
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
  margin: 0;
`;
dt.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--resume-space-tight);
  margin-bottom: var(--resume-space-section);

  @media print {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
`;
dt.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
`;
dt.span`
  color: var(--resume-color-accent);
`;
dt.a`
  color: inherit;
  text-decoration: none;

  &:hover {
    color: var(--resume-color-accent);
  }

  @media print {
    color: var(--resume-color-secondary);
  }
`;
dt.div`
  display: flex;
  gap: var(--resume-space-tight);
  flex-wrap: wrap;
`;
dt.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  font-size: var(--resume-size-body);
  color: var(--resume-color-primary);
  text-decoration: none;
  border: 1px solid var(--resume-color-border);
  border-radius: var(--resume-radius-sm);
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--resume-color-accent);
    color: #ffffff;
    border-color: var(--resume-color-accent);
  }

  @media print {
    border: 1px solid var(--resume-color-border);
    color: var(--resume-color-primary);
  }
`;
dt.span`
  display: inline-flex;
`;
dt.h1`
  font-size: ${(props) => {
  const sizes = {
    1: "var(--resume-size-name)",
    2: "var(--resume-size-heading)",
    3: "var(--resume-size-subheading)",
    4: "var(--resume-size-body)"
  };
  return sizes[props.$level] || sizes[2];
}};
  font-weight: ${(props) => props.$weight || "var(--resume-weight-semibold)"};
  color: ${(props) => props.$color || "var(--resume-color-primary)"};
  margin: 0 0 ${(props) => props.$spacing || "var(--resume-space-tight)"} 0;
  line-height: var(--resume-line-height-tight);
`;
dt.p`
  font-size: ${(props) => props.$size || "var(--resume-size-body)"};
  font-weight: ${(props) => props.$weight || "var(--resume-weight-normal)"};
  color: ${(props) => props.$color || "var(--resume-color-secondary)"};
  line-height: ${(props) => props.$lineHeight || "var(--resume-line-height-normal)"};
  margin: 0 0 ${(props) => props.$spacing || "0"} 0;
`;
dt.span`
  display: inline-block;
  font-size: var(--resume-size-small);
  font-weight: ${(props) => props.$weight || "var(--resume-weight-medium)"};
  color: ${(props) => props.$color || "var(--resume-color-secondary)"};
  text-transform: ${(props) => props.$uppercase ? "uppercase" : "none"};
  letter-spacing: ${(props) => props.$uppercase ? "0.05em" : "normal"};
`;
dt.p`
  font-size: var(--resume-size-body);
  font-weight: var(--resume-weight-normal);
  color: ${(props) => props.$color || "var(--resume-color-secondary)"};
  line-height: var(--resume-line-height-relaxed);
  margin: 0 0 var(--resume-space-item) 0;
  max-width: ${(props) => props.$maxWidth || "100%"};

  /* Softer appearance for intro text */
  opacity: 0.95;

  /* Print optimization - maintain readability */
  @media print {
    line-height: var(--resume-line-height-normal);
    opacity: 1;
    page-break-inside: avoid;
  }
`;
dt.blockquote`
  margin: 0 0 var(--resume-space-item) 0;
  padding: 2px 0 2px ${(props) => props.$paddingLeft || "16px"};
  border-left: ${(props) => props.$borderWidth || "3px"} solid
    ${(props) => props.$accentColor || "var(--resume-color-accent)"};

  font-size: var(--resume-size-body);
  font-style: ${(props) => props.$fontStyle || "italic"};
  font-weight: var(--resume-weight-normal);
  color: var(--resume-color-primary);
  line-height: var(--resume-line-height-normal);

  /* Prevent quote clipping with subtle padding */
  padding-right: 2px;

  /* Single-line constraint */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  /* Print optimization */
  @media print {
    page-break-inside: avoid;
    color: #000;
    border-left-color: ${(props) => props.$accentColor || "#000"};
  }
`;
dt.p`
  font-size: var(--resume-size-body);
  font-weight: var(--resume-weight-normal);
  color: ${(props) => props.$color || "var(--resume-color-secondary)"};
  line-height: var(--resume-line-height-normal);
  text-align: ${(props) => props.$textAlign || "left"};
  margin: 0 0 var(--resume-space-tight) 0;

  /* Enable hyphenation for better text flow */
  hyphens: auto;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;

  /* Prevent orphans and widows */
  orphans: 2;
  widows: 2;

  /* Balanced text wrapping */
  text-wrap: balance;

  /* Optional line clamping */
  ${(props) => props.$maxLines && `
    display: -webkit-box;
    -webkit-line-clamp: ${props.$maxLines};
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  `}

  /* Print optimization - disable hyphenation for cleaner output */
  @media print {
    hyphens: none;
    -webkit-hyphens: none;
    page-break-inside: avoid;
    text-wrap: pretty;
  }
`;
dt.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;
dt.svg`
  transform: rotate(-90deg);
`;
dt.span`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
  font-weight: var(--resume-weight-medium);
`;
dt.div`
  padding: var(--resume-space-item);
  background-color: var(--resume-color-background);
  border: 1px solid var(--resume-color-border);
  border-radius: var(--resume-radius-md);
  text-align: ${(props) => props.$align || "left"};

  @media print {
    border: 1px solid var(--resume-color-border);
    break-inside: avoid;
  }
`;
dt.div`
  font-size: ${(props) => props.$size || "var(--resume-size-name)"};
  font-weight: var(--resume-weight-bold);
  color: ${(props) => props.$color || "var(--resume-color-accent)"};
  line-height: 1;
  margin-bottom: 4px;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;
dt.div`
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
`;
dt.div`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
  margin-top: 4px;
`;
dt.div`
  margin-bottom: var(--resume-space-tight);
`;
dt.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
`;
dt.span`
  font-size: var(--resume-size-body);
  color: var(--resume-color-primary);
  font-weight: var(--resume-weight-medium);
`;
dt.span`
  font-size: var(--resume-size-small);
  color: var(--resume-color-accent);
  font-weight: var(--resume-weight-semibold);
`;
dt.div`
  width: 100%;
  height: ${(props) => props.$height || "24px"};
  background-color: var(--resume-color-border);
  border-radius: var(--resume-radius-sm);
  overflow: hidden;
  position: relative;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;
dt.div`
  width: ${(props) => props.$percentage}%;
  height: 100%;
  background-color: ${(props) => props.$color || "var(--resume-color-accent)"};
  display: flex;
  align-items: center;
  padding: 0 8px;
  transition: width 0.3s ease;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;
dt.span`
  font-size: var(--resume-size-small);
  color: #ffffff;
  font-weight: var(--resume-weight-medium);
  white-space: nowrap;
`;
dt.strong`
  font-weight: ${(props) => {
  if (props.$size === "sm") return "var(--resume-weight-semibold, 600)";
  if (props.$size === "lg") return "var(--resume-weight-extrabold, 800)";
  return "var(--resume-weight-bold, 700)";
}};
  font-size: ${(props) => {
  if (props.$size === "sm") return "0.95em";
  if (props.$size === "lg") return "1.1em";
  return "1em";
}};
  color: inherit;
  white-space: nowrap;

  @media print {
    font-weight: ${(props) => {
  if (props.$size === "sm") return "600";
  if (props.$size === "lg") return "800";
  return "700";
}};
    color: inherit;
  }
`;
dt.li`
  display: flex;
  align-items: baseline;
  margin-bottom: ${(props) => props.$spacing === "tight" ? "4px" : "8px"};
  line-height: 1.5;
  list-style: none;

  @media print {
    page-break-inside: avoid;
  }
`;
dt.span`
  font-weight: var(--resume-weight-bold, 700);
  color: var(--resume-color-primary, #000);
  min-width: ${(props) => props.$align === "right" ? "auto" : "60px"};
  max-width: ${(props) => props.$align === "right" ? "80px" : "auto"};
  margin-right: ${(props) => props.$align === "right" ? "12px" : "0"};
  margin-left: ${(props) => props.$align === "right" ? "0" : "12px"};
  text-align: ${(props) => props.$align === "right" ? "right" : "left"};
  flex-shrink: 0;
  white-space: nowrap;

  ${(props) => props.$align === "right" ? `
    order: -1;
  ` : ""}

  @media print {
    font-weight: 700;
    color: #000;
  }
`;
dt.span`
  flex: 1;
  color: var(--resume-color-primary, #000);
`;
dt.span`
  margin-right: 8px;
  color: var(--resume-color-accent, #0066cc);
  font-weight: var(--resume-weight-bold, 700);

  @media print {
    color: #333;
  }
`;
dt.ul`
  margin: 8px 0;
  padding-left: 0;
  list-style: none;
`;
dt.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.$gap || "8px"};
  align-items: center;
  margin: ${(props) => props.$margin || "8px 0"};

  @media print {
    gap: 6px;
  }
`;
dt.span`
  display: inline-flex;
  align-items: center;
  padding: ${(props) => {
  if (props.$size === "xs") return "2px 8px";
  if (props.$size === "md") return "4px 12px";
  return "3px 10px";
}};
  border-radius: ${(props) => props.theme?.radius?.full || "var(--resume-radius-full, 999px)"};
  border: 1px solid
    ${(props) => props.theme?.colors?.border || "var(--resume-color-border, #ddd)"};
  background: transparent;
  font-size: ${(props) => {
  if (props.$size === "xs") return "8pt";
  if (props.$size === "md") return "10pt";
  return "9pt";
}};
  font-weight: ${(props) => props.theme?.typography?.weightMedium || "var(--resume-weight-medium, 500)"};
  color: ${(props) => props.theme?.colors?.secondary || "var(--resume-color-secondary, #333)"};
  white-space: nowrap;
  line-height: 1.2;

  @media print {
    border: 1px solid #ccc;
    background: transparent;
    color: #000;
    padding: ${(props) => {
  if (props.$size === "xs") return "2px 6px";
  if (props.$size === "md") return "3px 10px";
  return "2px 8px";
}};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;
dt.span`
  color: ${(props) => props.theme?.colors?.border || "var(--resume-color-border, #ddd)"};
  font-size: ${(props) => {
  if (props.$size === "xs") return "8pt";
  if (props.$size === "md") return "10pt";
  return "9pt";
}};
  user-select: none;

  @media print {
    color: #ccc;
  }
`;
dt.span`
  display: inline;
  font-size: ${(props) => {
  if (props.$size === "xs") return "9pt";
  if (props.$size === "md") return "11pt";
  return "10pt";
}};
  color: ${(props) => props.theme?.colors?.secondary || "var(--resume-color-secondary, #333)"};
  line-height: 1.5;

  @media print {
    color: #333;
  }
`;
dt.span`
  display: inline;
  white-space: normal;
`;
dt.span`
  font-weight: ${(props) => props.theme?.typography?.weightMedium || "var(--resume-weight-medium, 500)"};
  color: ${(props) => props.theme?.colors?.primary || "var(--resume-color-primary, #000)"};

  @media print {
    font-weight: 500;
    color: #000;
  }
`;
dt.span`
  /* Prevent wrap between key and colon */
  white-space: nowrap;

  &::after {
    content: ':';
    margin-right: 0.25em;
  }
`;
dt.span`
  /* Prevent wrap immediately after colon */
  display: inline-block;
  color: inherit;
`;
dt.span`
  &::before {
    content: ', ';
    white-space: pre;
  }
`;
dt.hr`
  width: 100%;
  height: ${(props) => props.$thickness || "1px"};
  background-color: ${(props) => props.$color || "var(--resume-color-border)"};
  border: none;
  margin: ${(props) => props.$spacing || "var(--resume-space-item)"} 0;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;
dt.div`
  width: ${(props) => props.$width || "100%"};
  height: ${(props) => props.$height || "var(--resume-space-item)"};
  flex-shrink: 0;
`;
dt.div`
  padding: var(--resume-space-item);
  background-color: var(--resume-color-background);
  border: 1px solid var(--resume-color-border);
  border-radius: var(--resume-radius-md);
  margin-bottom: var(--resume-space-item);

  @media print {
    border: 1px solid var(--resume-color-border);
    break-inside: avoid;
  }
`;
dt.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--resume-space-tight);
  flex-wrap: wrap;
  gap: 8px;
`;
dt.h3`
  font-size: var(--resume-size-subheading);
  font-weight: var(--resume-weight-semibold);
  color: var(--resume-color-primary);
  margin: 0;
`;
dt.div`
  font-size: var(--resume-size-body);
  color: var(--resume-color-accent);
  font-weight: var(--resume-weight-medium);
`;
dt.div`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
  margin-bottom: var(--resume-space-tight);
`;
dt.p`
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
  margin: 0;
`;
dt.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--resume-space-item);
  margin-bottom: var(--resume-space-section);

  @media print {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
dt.div`
  padding: var(--resume-space-item);
  border: 1px solid var(--resume-color-border);
  border-radius: var(--resume-radius-md);

  @media print {
    break-inside: avoid;
  }
`;
dt.h4`
  font-size: var(--resume-size-subheading);
  font-weight: var(--resume-weight-semibold);
  color: var(--resume-color-primary);
  margin: 0 0 4px 0;
`;
dt.div`
  font-size: var(--resume-size-body);
  color: var(--resume-color-accent);
  margin-bottom: 4px;
`;
dt.div`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
`;
dt.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
dt.li`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 8px 0;
  border-bottom: 1px solid var(--resume-color-border);
  gap: var(--resume-space-tight);

  &:last-child {
    border-bottom: none;
  }

  @media print {
    break-inside: avoid;
  }
`;
dt.div`
  flex: 1;
`;
dt.span`
  font-size: var(--resume-size-body);
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
`;
dt.span`
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);

  &::before {
    content: ' at ';
  }
`;
dt.div`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
  white-space: nowrap;
`;
dt.header`
  text-align: center;
  margin-bottom: var(--resume-space-section);

  @media print {
    break-after: avoid;
  }
`;
dt.h1`
  font-size: var(--resume-size-name);
  font-weight: var(--resume-weight-bold);
  color: var(--resume-color-primary);
  margin: 0 0 4px 0;
`;
dt.h2`
  font-size: var(--resume-size-heading);
  font-weight: var(--resume-weight-normal);
  color: var(--resume-color-secondary);
  margin: 0 0 var(--resume-space-item) 0;
`;
dt.div`
  display: flex;
  justify-content: center;
  gap: var(--resume-space-tight);
  flex-wrap: wrap;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
`;
dt.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--resume-space-section);
  gap: var(--resume-space-item);

  @media print {
    break-after: avoid;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
dt.div`
  flex: 1;
`;
dt.h1`
  font-size: var(--resume-size-name);
  font-weight: var(--resume-weight-bold);
  color: var(--resume-color-primary);
  margin: 0 0 4px 0;
`;
dt.h2`
  font-size: var(--resume-size-heading);
  font-weight: var(--resume-weight-normal);
  color: var(--resume-color-secondary);
  margin: 0;
`;
dt.div`
  text-align: right;

  @media (max-width: 768px) {
    text-align: left;
  }
`;
dt.header`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: var(--resume-space-item);
  border-bottom: 2px solid var(--resume-color-border);
  margin-bottom: var(--resume-space-section);
  gap: var(--resume-space-item);

  @media print {
    border-bottom: 2px solid var(--resume-color-border);
    break-after: avoid;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
dt.h1`
  font-size: var(--resume-size-heading);
  font-weight: var(--resume-weight-bold);
  color: var(--resume-color-primary);
  margin: 0;
`;
dt.div`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
`;
dt.div`
  position: ${(props) => props.$position === "absolute" ? "absolute" : "relative"};
  ${(props) => props.$corner === "top-left" && "top: 0; left: 0;"}
  ${(props) => props.$corner === "top-right" && "top: 0; right: 0;"}
  ${(props) => props.$corner === "bottom-left" && "bottom: 0; left: 0;"}
  ${(props) => props.$corner === "bottom-right" && "bottom: 0; right: 0;"}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.$size || "48px"};
  height: ${(props) => props.$size || "48px"};

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;
dt.div`
  font-family: ${(props) => props.$serif ? 'Georgia, "Times New Roman", serif' : "inherit"};
  font-size: ${(props) => props.$fontSize || "calc(var(--resume-size-heading) * 0.8)"};
  font-weight: ${(props) => props.$outline ? "var(--resume-weight-normal)" : "var(--resume-weight-bold)"};
  color: ${(props) => props.$color || "var(--resume-color-primary)"};
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: ${(props) => props.$outline ? "1px" : "0"};

  ${(props) => props.$outline && `
    -webkit-text-stroke: 1px ${props.$color || "var(--resume-color-primary)"};
    -webkit-text-fill-color: transparent;
    text-stroke: 1px ${props.$color || "var(--resume-color-primary)"};
    text-fill-color: transparent;
  `}

  ${(props) => props.$bordered && `
    border: 2px solid ${props.$color || "var(--resume-color-primary)"};
    border-radius: ${props.$rounded ? "50%" : "var(--resume-radius-sm)"};
    padding: ${props.$padding || "8px"};
    width: ${props.$size || "48px"};
    height: ${props.$size || "48px"};
    display: flex;
    align-items: center;
    justify-content: center;
  `}

  @media print {
    ${(props) => props.$outline && `
      color: ${props.$color || "var(--resume-color-primary)"};
      -webkit-text-stroke: none;
      -webkit-text-fill-color: ${props.$color || "var(--resume-color-primary)"};
      font-weight: var(--resume-weight-normal);
    `}
  }
`;
dt.footer`
  margin-top: var(--resume-space-section);
  padding-top: var(--resume-space-item);
  border-top: 1px solid var(--resume-color-border);
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
  text-align: ${(props) => props.$align || "center"};

  @media print {
    border-top: 1px solid var(--resume-color-border);
    position: running(footer);
  }
`;
dt.span`
  @media print {
    &::after {
      content: counter(page);
    }
  }
`;
dt.div`
  @media print {
    page-break-before: ${(props) => props.$before ? "always" : "auto"};
    page-break-after: ${(props) => props.$after ? "always" : "auto"};
    break-before: ${(props) => props.$before ? "page" : "auto"};
    break-after: ${(props) => props.$after ? "page" : "auto"};
  }

  @media screen {
    display: none;
  }
`;
dt.header`
  text-align: center;
  margin-bottom: var(--resume-space-section, 24px);

  @media print {
    break-after: avoid;
  }
`;
dt.div`
  font-size: var(--resume-size-small, 10px);
  font-weight: var(--resume-weight-medium, 500);
  color: var(--resume-color-secondary, #4a4a4a);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--resume-space-tight, 8px);

  @media print {
    color: #4a4a4a; /* Ensure print visibility */
  }
`;
dt.h1`
  font-size: var(--resume-size-name, 36px);
  font-weight: var(--resume-weight-bold, 700);
  color: var(--resume-color-primary, #1a1a1a);
  letter-spacing: -0.02em; /* Subtle negative tracking, avoid excessive spacing */
  margin: 0 auto;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--resume-color-border, #e5e7eb);
  max-width: fit-content;
  line-height: var(--resume-line-height-tight, 1.2);

  /* Ensure 4.5:1 contrast ratio */
  @media print {
    color: #000000;
    border-bottom-color: #999999;
  }
`;
dt.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: var(--resume-size-body, 11px);
  color: var(--resume-color-secondary, #4a4a4a);
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  /* Prevent wrapping to maintain single-line layout */
  flex-wrap: nowrap;

  @media print {
    color: #333333; /* Ensure 4.5:1 contrast for print */
  }

  /* Handle overflow gracefully on very narrow screens */
  @media (max-width: 480px) {
    font-size: 10px;
    gap: 8px;
  }
`;
dt.span`
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
`;
dt.a`
  color: inherit;
  text-decoration: none;

  &:hover {
    color: var(--resume-color-accent, #2563eb);
    text-decoration: underline;
  }

  @media print {
    color: #333333;
    text-decoration: none;
  }
`;
dt.span`
  color: var(--resume-color-border, #e5e7eb);
  user-select: none;
  font-weight: var(--resume-weight-normal, 400);

  @media print {
    color: #999999;
  }
`;
dt.div`
  margin-bottom: var(--resume-space-item, 16px);

  @media print {
    page-break-after: avoid;
  }
`;
dt.h2`
  font-size: var(--resume-size-heading, 16px);
  font-weight: var(--resume-weight-semibold, 600);
  color: var(--resume-color-primary, #1a1a1a);
  margin: 0 0 8px 0;
  line-height: var(--resume-line-height-tight, 1.2);

  @media print {
    color: #000000; /* Ensure 4.5:1 contrast */
  }
`;
dt.hr`
  width: ${(props) => props.$width || "100%"};
  height: 0;
  border: none;
  border-top: 0.5px solid
    ${(props) => props.$color || "var(--resume-color-border, #e5e7eb)"};
  margin: 0;

  /* Ensure visibility in print */
  @media print {
    border-top-width: 1px;
    border-top-color: ${(props) => props.$color || "#cccccc"};
  }
`;
dt.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: var(--resume-space-item, 16px);

  @media print {
    page-break-after: avoid;
  }
`;
dt.div`
  width: ${(props) => props.$width || "4px"};
  height: 0.7em; /* Match x-height of text, not full line-height */
  background-color: ${(props) => props.$color || "var(--resume-color-accent, #2563eb)"};
  border-radius: 2px;
  flex-shrink: 0;

  /* Ensure visibility in print */
  @media print {
    background-color: ${(props) => props.$color || "#000000"};
  }
`;
dt.h2`
  font-size: var(--resume-size-heading, 16px);
  font-weight: var(--resume-weight-semibold, 600);
  color: var(--resume-color-primary, #1a1a1a);
  margin: 0;
  line-height: var(--resume-line-height-tight, 1.2);

  @media print {
    color: #000000; /* Ensure 4.5:1 contrast */
  }
`;
dt.header`
  text-align: ${(props) => props.$align || "center"};
  margin-bottom: var(--resume-space-section, 24px);

  @media print {
    break-after: avoid;
  }
`;
dt.h1`
  font-size: var(--resume-size-name, 36px);
  font-weight: var(--resume-weight-bold, 700);
  color: var(--resume-color-primary, #1a1a1a);
  margin: 0 0 4px 0;
  line-height: var(--resume-line-height-tight, 1.2);
  letter-spacing: -0.02em;

  @media print {
    color: #000000; /* Ensure 4.5:1 contrast */
  }
`;
dt.div`
  font-size: var(--resume-size-heading, 16px);
  font-weight: var(--resume-weight-medium, 500); /* Avoid thin weights */
  color: var(--resume-color-secondary, #4a4a4a);
  margin: 0 0 8px 0;
  line-height: var(--resume-line-height-normal, 1.5);

  @media print {
    color: #333333; /* Ensure 4.5:1 contrast */
  }
`;
dt.div`
  font-size: var(--resume-size-body, 11px);
  font-weight: var(--resume-weight-normal, 400);
  color: var(--resume-color-secondary, #4a4a4a);
  margin: 0;
  line-height: var(--resume-line-height-relaxed, 1.75);
  max-width: 600px;
  margin-left: ${(props) => props.$align === "center" ? "auto" : "0"};
  margin-right: ${(props) => props.$align === "center" ? "auto" : props.$align === "right" ? "0" : "auto"};

  @media print {
    color: #4a4a4a;
  }
`;
dt.blockquote`
  margin: var(--resume-space-section) 0;
  padding: var(--resume-space-item);
  border-left: 4px solid var(--resume-color-accent);
  background-color: var(--resume-color-muted);
  break-inside: avoid;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border-left: 4px solid var(--resume-color-accent);
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;
dt.p`
  font-size: var(--resume-size-subheading);
  font-style: italic;
  color: var(--resume-color-primary);
  line-height: var(--resume-line-height-relaxed);
  margin: 0 0 var(--resume-space-tight) 0;
`;
dt.footer`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
  text-align: right;
`;
dt.cite`
  font-style: normal;
  font-weight: var(--resume-weight-medium);
`;
dt.span`
  display: block;
  font-size: var(--resume-size-tiny);
  margin-top: 2px;
`;
dt.div`
  display: flex;
  flex-direction: column;
  gap: var(--resume-space-tight);
  padding: var(--resume-space-item);
  background-color: var(--resume-color-background);
  border: 1px solid var(--resume-color-border);
  border-radius: var(--resume-radius-md);
  break-inside: avoid;

  @media print {
    border: 1px solid var(--resume-color-border);
    break-inside: avoid;
    page-break-inside: avoid;
  }

  @media (max-width: 768px) {
    padding: var(--resume-space-tight);
  }
`;
dt.div`
  display: flex;
  align-items: center;
  gap: var(--resume-space-tight);
`;
dt.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;
dt.div`
  flex: 1;
`;
dt.div`
  font-size: var(--resume-size-body);
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
`;
dt.div`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
`;
dt.blockquote`
  margin: 0;
  font-size: var(--resume-size-body);
  font-style: italic;
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
`;
dt.blockquote`
  margin: var(--resume-space-item) 0;
  padding: var(--resume-space-tight) var(--resume-space-item);
  border-left: 3px solid var(--resume-color-border);
  font-style: italic;
  color: var(--resume-color-secondary);
  background-color: ${(props) => props.$highlight ? "var(--resume-color-muted)" : "transparent"};
  break-inside: avoid;

  @media print {
    border-left: 3px solid var(--resume-color-border);
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;
dt.p`
  margin: 0;
  font-size: var(--resume-size-body);
  line-height: var(--resume-line-height-normal);
`;
dt.cite`
  display: block;
  margin-top: var(--resume-space-tight);
  font-size: var(--resume-size-small);
  font-style: normal;
  color: var(--resume-color-tertiary);
`;
dt.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: ${(props) => props.$variant === "filled" ? "var(--resume-color-accent)" : "var(--resume-color-background)"};
  color: ${(props) => props.$variant === "filled" ? "white" : "var(--resume-color-primary)"};
  border: 1px solid
    ${(props) => props.$variant === "filled" ? "var(--resume-color-accent)" : "var(--resume-color-border)"};
  border-radius: var(--resume-radius-full);
  font-size: var(--resume-size-small);
  font-weight: var(--resume-weight-medium);
  break-inside: avoid;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 1px solid var(--resume-color-border);
    background-color: ${(props) => props.$variant === "filled" ? "var(--resume-color-accent)" : "transparent"};
  }

  @media (max-width: 768px) {
    font-size: var(--resume-size-tiny);
    padding: 6px 12px;
  }
`;
dt.span`
  display: flex;
  align-items: center;
  font-size: 16px;
`;
dt.span`
  white-space: nowrap;
`;
dt.span`
  opacity: 0.8;
  font-size: var(--resume-size-tiny);
  font-weight: var(--resume-weight-normal);
`;
dt.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5em;
  margin-bottom: 0.5em;
  font-size: var(--resume-size-body);
  line-height: var(--resume-line-height-normal);
  break-inside: avoid;

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  @media (max-width: 768px) {
    font-size: var(--resume-size-small);
  }
`;
dt.span`
  font-weight: var(--resume-weight-semibold);
  color: var(--resume-color-primary);
`;
dt.span`
  color: var(--resume-color-primary);
`;
dt.span`
  font-family: 'Courier New', Courier, monospace;
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
  background-color: var(--resume-color-background);
  padding: 2px 6px;
  border-radius: var(--resume-radius-sm);
  border: 1px solid var(--resume-color-border);

  @media print {
    background-color: transparent;
    border: 1px solid var(--resume-color-border);
    padding: 1px 4px;
  }
`;
dt.span`
  font-size: var(--resume-size-small);
  color: var(--resume-color-tertiary);
  font-style: italic;
`;
dt.a`
  color: var(--resume-color-accent);
  text-decoration: none;
  font-size: var(--resume-size-small);

  &:hover {
    text-decoration: underline;
  }

  @media print {
    color: var(--resume-color-primary);
    text-decoration: none;

    &::after {
      content: ' [' attr(href) ']';
      font-size: var(--resume-size-tiny);
    }
  }
`;
dt.span`
  color: var(--resume-color-tertiary);

  &::before {
    content: '·';
  }
`;
dt.div`
  padding: var(--resume-space-item);
  background-color: var(--resume-color-background);
  border: 1px solid var(--resume-color-border);
  border-radius: var(--resume-radius-md);
  margin-bottom: var(--resume-space-tight);
  break-inside: avoid;

  @media print {
    border: 1px solid var(--resume-color-border);
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;
dt.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--resume-space-tight);
  margin-bottom: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 4px;
  }
`;
dt.h3`
  margin: 0;
  font-size: var(--resume-size-subheading);
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
`;
dt.time`
  font-size: var(--resume-size-small);
  color: var(--resume-color-tertiary);
  white-space: nowrap;
`;
dt.div`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
  margin-bottom: 8px;
`;
dt.p`
  margin: 0;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
`;
dt.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;
dt.li`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--resume-space-tight);
  padding: 8px 0;
  border-bottom: 1px solid var(--resume-color-border);
  break-inside: avoid;

  &:last-child {
    border-bottom: none;
  }

  @media print {
    border-bottom: 1px solid var(--resume-color-border);
    break-inside: avoid;
    page-break-inside: avoid;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 4px;
  }
`;
dt.div`
  flex: 1;
`;
dt.div`
  font-size: var(--resume-size-body);
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
  margin-bottom: 2px;
`;
dt.div`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
`;
dt.time`
  font-size: var(--resume-size-small);
  color: var(--resume-color-tertiary);
  white-space: nowrap;
`;
dt.div`
  margin-bottom: var(--resume-space-tight);
`;
dt.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: var(--resume-size-body);
  color: var(--resume-color-primary);
`;
dt.span`
  font-weight: var(--resume-weight-medium);
`;
dt.span`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
`;
dt.div`
  width: 100%;
  height: 10px;
  background-color: var(--resume-color-border);
  border-radius: var(--resume-radius-sm);
  overflow: hidden;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;
dt.div`
  width: ${(props) => props.$level}%;
  height: 100%;
  background-color: ${(props) => props.$color || "var(--resume-color-accent)"};
  transition: width 0.3s ease;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;
dt.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
  margin-bottom: 0.5em;
  font-size: var(--resume-size-body);
  line-height: var(--resume-line-height-normal);
  break-inside: avoid;

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  @media (max-width: 768px) {
    font-size: var(--resume-size-small);
    gap: 0.5em;
  }
`;
dt.div`
  display: flex;
  align-items: baseline;
  gap: 0.5em;
  flex: 1;
`;
dt.span`
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
`;
dt.span`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
`;
dt.span`
  font-family: 'Courier New', Courier, monospace;
  font-size: var(--resume-size-body);
  color: var(--resume-color-primary);
  letter-spacing: 2px;
  white-space: nowrap;

  @media print {
    letter-spacing: 3px;
  }
`;
dt.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--resume-space-tight);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  @media print {
    break-inside: avoid;
  }
`;
dt.div`
  padding: var(--resume-space-tight);
  background-color: var(--resume-color-background);
  border: 1px solid var(--resume-color-border);
  border-radius: var(--resume-radius-sm);
  break-inside: avoid;

  @media print {
    border: 1px solid var(--resume-color-border);
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;
dt.div`
  font-size: var(--resume-size-body);
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
  margin-bottom: 8px;
`;
dt.div`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
`;
dt.div`
  display: flex;
  gap: 4px;
  margin-top: 8px;
`;
dt.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => props.$filled ? "var(--resume-color-accent)" : "var(--resume-color-border)"};

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 1px solid
      ${(props) => props.$filled ? "var(--resume-color-accent)" : "var(--resume-color-border)"};
  }
`;
dt.div`
  display: flex;
  align-items: center;
  gap: var(--resume-space-tight);
  margin-bottom: 8px;
`;
dt.span`
  min-width: 120px;
  font-size: var(--resume-size-body);
  color: var(--resume-color-primary);

  @media (max-width: 768px) {
    min-width: 100px;
    font-size: var(--resume-size-small);
  }
`;
dt.div`
  display: flex;
  gap: 4px;
  flex: 1;
`;
dt.div`
  flex: 1;
  height: ${(props) => props.$size || "12px"};
  background-color: ${(props) => props.$filled ? props.$color || "var(--resume-color-accent)" : "var(--resume-color-border)"};
  border-radius: var(--resume-radius-xs);
  transition: background-color 0.3s ease;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 1px solid
      ${(props) => props.$filled ? props.$color || "var(--resume-color-accent)" : "var(--resume-color-border)"};
  }
`;
dt.span`
  min-width: 80px;
  text-align: right;
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);

  @media (max-width: 768px) {
    display: none;
  }
`;
dt.div`
  padding: var(--resume-space-tight) 0;
  border-bottom: 1px solid var(--resume-color-border);
  break-inside: avoid;

  &:last-child {
    border-bottom: none;
  }

  @media print {
    border-bottom: 1px solid var(--resume-color-border);
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;
dt.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--resume-space-tight);
  margin-bottom: 4px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 4px;
  }
`;
dt.h3`
  margin: 0;
  font-size: var(--resume-size-subheading);
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
`;
dt.time`
  font-size: var(--resume-size-small);
  color: var(--resume-color-tertiary);
  white-space: nowrap;
`;
dt.div`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
  font-style: italic;
  margin-bottom: 8px;
`;
dt.p`
  margin: 0;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
`;
dt.a`
  display: inline-block;
  margin-top: 8px;
  font-size: var(--resume-size-small);
  color: var(--resume-color-accent);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  @media print {
    color: var(--resume-color-primary);
    text-decoration: none;

    &::after {
      content: ' (' attr(href) ')';
      font-size: var(--resume-size-tiny);
    }
  }
`;
dt.div`
  margin-bottom: var(--resume-space-tight);
  padding-left: 1.5em;
  text-indent: -1.5em;
  break-inside: avoid;
  line-height: var(--resume-line-height-relaxed);

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;
const Text = dt.span`
  font-size: var(--resume-size-body);
  color: var(--resume-color-primary);
`;
dt(Text)`
  font-weight: var(--resume-weight-medium);
`;
dt(Text)`
  color: var(--resume-color-secondary);
`;
dt(Text)`
  font-style: italic;
`;
dt(Text)`
  color: var(--resume-color-secondary);
`;
dt.span`
  margin: 0 0.5em;
  color: var(--resume-color-tertiary);
`;
dt.a`
  color: var(--resume-color-accent);
  text-decoration: none;
  margin-left: 0.5em;

  &:hover {
    text-decoration: underline;
  }

  @media print {
    color: var(--resume-color-primary);
    text-decoration: none;

    &::after {
      content: ' [' attr(href) ']';
      font-size: var(--resume-size-tiny);
    }
  }
`;
dt.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--resume-space-item);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  @media print {
    break-inside: avoid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--resume-space-tight);
  }
`;
dt.div`
  background-color: var(--resume-color-background);
  border: 1px solid var(--resume-color-border);
  border-radius: var(--resume-radius-md);
  overflow: hidden;
  break-inside: avoid;

  @media print {
    border: 1px solid var(--resume-color-border);
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;
dt.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  display: block;

  @media print {
    height: 100px;
  }
`;
dt.div`
  padding: var(--resume-space-tight);
`;
dt.h3`
  margin: 0 0 4px 0;
  font-size: var(--resume-size-subheading);
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
`;
dt.p`
  margin: 0 0 8px 0;
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
`;
dt.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;
dt.span`
  padding: 2px 8px;
  font-size: var(--resume-size-tiny);
  background-color: var(--resume-color-muted);
  color: var(--resume-color-secondary);
  border-radius: var(--resume-radius-sm);

  @media print {
    border: 1px solid var(--resume-color-border);
    background-color: transparent;
  }
`;
dt.div`
  padding: var(--resume-space-item);
  background-color: var(--resume-color-background);
  border: 1px solid var(--resume-color-border);
  border-radius: var(--resume-radius-md);
  margin-bottom: var(--resume-space-tight);
  break-inside: avoid;

  @media print {
    border: 1px solid var(--resume-color-border);
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;
dt.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--resume-space-tight);
  margin-bottom: 8px;
`;
dt.h3`
  margin: 0;
  font-size: var(--resume-size-subheading);
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
`;
dt.time`
  font-size: var(--resume-size-small);
  color: var(--resume-color-tertiary);
  white-space: nowrap;
`;
dt.p`
  margin: 0 0 var(--resume-space-tight) 0;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
`;
dt.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: var(--resume-space-tight);
`;
dt.span`
  padding: 4px 10px;
  font-size: var(--resume-size-small);
  background-color: var(--resume-color-muted);
  color: var(--resume-color-secondary);
  border-radius: var(--resume-radius-sm);

  @media print {
    border: 1px solid var(--resume-color-border);
    background-color: transparent;
  }
`;
dt.div`
  display: flex;
  gap: var(--resume-space-tight);
`;
dt.a`
  font-size: var(--resume-size-small);
  color: var(--resume-color-accent);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  @media print {
    color: var(--resume-color-primary);
    text-decoration: none;

    &::after {
      content: ' (' attr(href) ')';
      font-size: var(--resume-size-tiny);
    }
  }
`;
dt.table`
  width: 100%;
  border-collapse: collapse;
  font-size: var(--resume-size-body);
  margin: var(--resume-space-item) 0;

  @media print {
    break-inside: avoid;
  }

  @media (max-width: 768px) {
    font-size: var(--resume-size-small);
  }
`;
dt.thead`
  background-color: var(--resume-color-muted);

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;
dt.th`
  padding: 10px;
  text-align: left;
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
  border: 1px solid var(--resume-color-border);

  @media print {
    border: 1px solid var(--resume-color-border);
  }
`;
dt.tbody``;
dt.tr`
  &:nth-child(even) {
    background-color: var(--resume-color-background);
  }

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;
dt.td`
  padding: 10px;
  border: 1px solid var(--resume-color-border);
  color: var(--resume-color-secondary);

  @media print {
    border: 1px solid var(--resume-color-border);
  }
`;
dt.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
dt.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => {
  if (props.$level === "expert") return "var(--resume-color-accent)";
  if (props.$level === "advanced") return "var(--resume-color-success)";
  if (props.$level === "intermediate") return "var(--resume-color-warning)";
  return "var(--resume-color-border)";
}};

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 2px solid
      ${(props) => {
  if (props.$level === "expert") return "var(--resume-color-accent)";
  if (props.$level === "advanced") return "var(--resume-color-success)";
  if (props.$level === "intermediate")
    return "var(--resume-color-warning)";
  return "var(--resume-color-border)";
}};
  }
`;
dt.table`
  width: 100%;
  border-collapse: collapse;
  font-size: var(--resume-size-body);
  margin: var(--resume-space-item) 0;

  @media print {
    break-inside: avoid;
  }

  @media (max-width: 768px) {
    font-size: var(--resume-size-small);
  }
`;
dt.thead``;
dt.th`
  padding: 12px;
  text-align: ${(props) => props.$align || "left"};
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
  background-color: var(--resume-color-muted);
  border: 1px solid var(--resume-color-border);

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 1px solid var(--resume-color-border);
  }
`;
dt.tbody``;
dt.tr`
  &:nth-child(even) {
    background-color: var(--resume-color-background);
  }

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;
dt.td`
  padding: 10px 12px;
  border: 1px solid var(--resume-color-border);
  color: var(--resume-color-secondary);
  text-align: ${(props) => props.$align || "left"};
  vertical-align: top;

  @media print {
    border: 1px solid var(--resume-color-border);
  }
`;
dt.td`
  padding: 10px 12px;
  border: 1px solid var(--resume-color-border);
  color: var(--resume-color-primary);
  font-weight: var(--resume-weight-medium);
  background-color: var(--resume-color-muted);

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 1px solid var(--resume-color-border);
  }
`;
dt.table`
  width: 100%;
  border-collapse: collapse;
  font-size: var(--resume-size-body);
  margin: var(--resume-space-item) 0;

  @media print {
    break-inside: avoid;
  }

  @media (max-width: 768px) {
    font-size: var(--resume-size-small);
    display: block;
    overflow-x: auto;
  }
`;
dt.thead`
  background-color: var(--resume-color-muted);

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;
dt.th`
  padding: 12px;
  text-align: ${(props) => props.$align || "left"};
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
  border: 1px solid var(--resume-color-border);
  white-space: nowrap;

  @media print {
    border: 1px solid var(--resume-color-border);
  }
`;
dt.tbody``;
dt.tr`
  &:nth-child(even) {
    background-color: ${(props) => props.$striped ? "var(--resume-color-background)" : "transparent"};
  }

  &:hover {
    background-color: var(--resume-color-muted);
  }

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;

    &:hover {
      background-color: transparent;
    }
  }
`;
dt.td`
  padding: 10px 12px;
  border: 1px solid var(--resume-color-border);
  color: var(--resume-color-secondary);
  text-align: ${(props) => props.$align || "left"};
  vertical-align: top;

  @media print {
    border: 1px solid var(--resume-color-border);
  }
`;
dt.tfoot`
  background-color: var(--resume-color-muted);
  font-weight: var(--resume-weight-medium);

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;
dt.div`
  padding: var(--resume-space-item);
  margin: var(--resume-space-item) 0;
  background-color: ${(props) => {
  if (props.$variant === "success")
    return "var(--resume-color-success-bg, #d4edda)";
  if (props.$variant === "warning")
    return "var(--resume-color-warning-bg, #fff3cd)";
  if (props.$variant === "error")
    return "var(--resume-color-error-bg, #f8d7da)";
  return "var(--resume-color-muted)";
}};
  border-left: 4px solid
    ${(props) => {
  if (props.$variant === "success")
    return "var(--resume-color-success, #28a745)";
  if (props.$variant === "warning")
    return "var(--resume-color-warning, #ffc107)";
  if (props.$variant === "error")
    return "var(--resume-color-error, #dc3545)";
  return "var(--resume-color-accent)";
}};
  border-radius: var(--resume-radius-sm);
  break-inside: avoid;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border-left: 4px solid
      ${(props) => {
  if (props.$variant === "success")
    return "var(--resume-color-success, #28a745)";
  if (props.$variant === "warning")
    return "var(--resume-color-warning, #ffc107)";
  if (props.$variant === "error")
    return "var(--resume-color-error, #dc3545)";
  return "var(--resume-color-accent)";
}};
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;
dt.div`
  font-size: var(--resume-size-subheading);
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
  margin-bottom: 8px;
`;
dt.div`
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
`;
dt.div`
  display: flex;
  gap: var(--resume-space-tight);
  padding: var(--resume-space-tight);
  background-color: var(--resume-color-background);
  border: 1px solid var(--resume-color-border);
  border-radius: var(--resume-radius-md);
  margin: var(--resume-space-tight) 0;
  break-inside: avoid;

  @media print {
    border: 1px solid var(--resume-color-border);
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;
dt.div`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${(props) => props.$color || "var(--resume-color-accent)"};
  color: white;
  font-size: 14px;
  font-weight: var(--resume-weight-bold);

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 2px solid ${(props) => props.$color || "var(--resume-color-accent)"};
  }
`;
dt.div`
  flex: 1;
`;
dt.div`
  font-size: var(--resume-size-body);
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
  margin-bottom: 4px;
`;
dt.div`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
`;
dt.div`
  padding: var(--resume-space-item);
  background-color: ${(props) => props.$color || "var(--resume-color-accent)"};
  color: white;
  border-radius: var(--resume-radius-md);
  margin: var(--resume-space-item) 0;
  break-inside: avoid;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 2px solid ${(props) => props.$color || "var(--resume-color-accent)"};
    background-color: transparent;
    color: var(--resume-color-primary);
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;
dt.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--resume-space-tight);
  margin-bottom: var(--resume-space-tight);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;
dt.h3`
  margin: 0;
  font-size: var(--resume-size-heading);
  font-weight: var(--resume-weight-bold);
  color: inherit;

  @media print {
    color: var(--resume-color-primary);
  }
`;
dt.div`
  padding: 4px 12px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: var(--resume-radius-full);
  font-size: var(--resume-size-small);
  white-space: nowrap;

  @media print {
    background-color: transparent;
    border: 1px solid currentColor;
  }
`;
dt.div`
  font-size: var(--resume-size-body);
  line-height: var(--resume-line-height-normal);

  @media print {
    color: var(--resume-color-secondary);
  }
`;
dt.div`
  margin-top: var(--resume-space-tight);
  padding-top: var(--resume-space-tight);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  font-size: var(--resume-size-small);

  @media print {
    border-top: 1px solid var(--resume-color-border);
    color: var(--resume-color-tertiary);
  }
`;
dt.ul`
  margin: var(--resume-space-tight) 0;
  padding: 0;
  list-style: none;
`;
dt.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 6px 0;
  break-inside: avoid;

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;
dt.span`
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${(props) => props.$checked ? "var(--resume-color-accent)" : "var(--resume-color-border)"};
  color: white;
  font-size: 12px;
  margin-top: 2px;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 2px solid
      ${(props) => props.$checked ? "var(--resume-color-accent)" : "var(--resume-color-border)"};
  }
`;
dt.span`
  flex: 1;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
  text-decoration: ${(props) => props.$checked && props.$strikethrough ? "line-through" : "none"};
  opacity: ${(props) => props.$checked && props.$strikethrough ? 0.7 : 1};
`;
dt.ul`
  margin: var(--resume-space-tight) 0;
  padding: 0;
  list-style: none;
`;
dt.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 6px 0;
  break-inside: avoid;

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;
dt.span`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: ${(props) => props.$color || "var(--resume-color-accent)"};
  margin-top: 2px;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;
dt.span`
  flex: 1;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
`;
dt.ol`
  margin: var(--resume-space-tight) 0;
  padding-left: 28px;
  counter-reset: list-counter;
  list-style: none;
`;
dt.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 6px 0;
  counter-increment: list-counter;
  break-inside: avoid;

  &::before {
    content: counter(list-counter) '.';
    flex-shrink: 0;
    width: 24px;
    font-weight: var(--resume-weight-medium);
    color: ${(props) => props.$color || "var(--resume-color-accent)"};
  }

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;

    &::before {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;
dt.span`
  flex: 1;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
`;
dt.ul`
  margin: var(--resume-space-tight) 0;
  padding-left: 24px;
  list-style: none;
`;
dt.li`
  position: relative;
  padding: 4px 0 4px 16px;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
  break-inside: avoid;

  &::before {
    content: '${(props) => props.$bullet || "•"}';
    position: absolute;
    left: 0;
    color: ${(props) => props.$color || "var(--resume-color-accent)"};
    font-weight: var(--resume-weight-bold);
  }

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;

    &::before {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;
dt.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;
dt.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 0;
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
  break-inside: avoid;

  &:not(:last-child) {
    border-bottom: ${(props) => props.$divider ? "1px solid var(--resume-color-border)" : "none"};
    padding-bottom: ${(props) => props.$divider ? "6px" : "2px"};
    margin-bottom: ${(props) => props.$divider ? "6px" : "0"};
  }

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
    border-bottom: ${(props) => props.$divider ? "1px solid var(--resume-color-border)" : "none"};
  }
`;
dt.span`
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${(props) => props.$color || "var(--resume-color-accent)"};

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 1px solid ${(props) => props.$color || "var(--resume-color-accent)"};
  }
`;
dt.span`
  flex: 1;
  line-height: 1.4;
`;
dt.ul`
  margin: var(--resume-space-tight) 0;
  padding-left: 20px;
  list-style: none;
`;
dt.li`
  position: relative;
  padding: 2px 0;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: 1.4;
  break-inside: avoid;
  orphans: 2;
  widows: 2;
  max-height: 4.2em; /* Enforce 2-3 line max (1.4 line-height × 3 lines) */
  overflow: hidden;
  text-overflow: ellipsis;

  &::before {
    content: '${(props) => props.$bullet || "•"}';
    position: absolute;
    left: -16px;
    color: ${(props) => props.$color || "var(--resume-color-accent)"};
    font-weight: var(--resume-weight-semibold);
  }

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
    orphans: 2;
    widows: 2;

    &::before {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;
dt.ul`
  margin: var(--resume-space-comfortable) 0;
  padding-left: 24px;
  list-style: none;
`;
dt.li`
  position: relative;
  padding: 6px 0; /* 6pt baseline grid */
  margin-bottom: 8px; /* 8pt baseline grid */
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: 1.6; /* 1.6 × 16px = 25.6px ≈ 26px (multiple of 6pt baseline) */
  break-inside: avoid;

  &:last-child {
    margin-bottom: 0;
  }

  &::before {
    content: '${(props) => props.$bullet || "•"}';
    position: absolute;
    left: -20px;
    color: ${(props) => props.$color || "var(--resume-color-accent)"};
    font-weight: var(--resume-weight-semibold);
    line-height: inherit;
  }

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
    orphans: 2;
    widows: 2;

    &::before {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;
dt.ul`
  margin: var(--resume-space-tight) 0;
  padding-left: 0;
  list-style: none;
`;
dt.li`
  position: relative;
  padding: 4px 0 4px 20px; /* Left padding for bullet space */
  text-indent: -20px; /* Negative indent to hang bullet outside */
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
  break-inside: avoid;

  &::before {
    content: '${(props) => props.$bullet || "•"}';
    color: ${(props) => props.$color || "var(--resume-color-accent)"};
    font-weight: var(--resume-weight-semibold);
    display: inline-block;
    width: 20px;
    text-indent: 0; /* Reset indent for bullet */
  }

  /* Reset text-indent for child elements */
  > * {
    text-indent: 0;
  }

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
    orphans: 2;
    widows: 2;

    &::before {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;
dt.ul`
  margin: var(--resume-space-tight) 0;
  padding-left: 0;
  list-style: none;
`;
dt.li`
  position: relative;
  padding: 2px 0 2px 16px;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: 1.5;
  break-inside: avoid;

  &::before {
    content: '–'; /* En-dash (U+2013), not hyphen */
    position: absolute;
    left: 0;
    color: ${(props) => props.$color || "var(--resume-color-text)"};
    font-weight: var(--resume-weight-normal);
  }

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
    orphans: 2;
    widows: 2;

    &::before {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;
dt.ul`
  margin: var(--resume-space-tight) 0;
  padding-left: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;
dt.li`
  display: inline-flex;
  align-items: center;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);

  &:not(:last-child)::after {
    content: '·'; /* Midline dot (U+00B7) */
    margin-left: 8px;
    color: ${(props) => props.$color || "var(--resume-color-accent)"};
    font-weight: var(--resume-weight-semibold);
  }

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;

    &:not(:last-child)::after {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;
dt.dl`
  margin: var(--resume-space-tight) 0;
  display: grid;
  grid-template-columns: ${(props) => props.$layout === "inline" ? "auto 1fr" : "1fr"};
  gap: ${(props) => props.$layout === "inline" ? "8px 16px" : "4px"};
`;
dt.dt`
  font-size: var(--resume-size-body);
  color: var(--resume-color-text);
  font-weight: var(--resume-weight-semibold);
  line-height: var(--resume-line-height-normal);

  ${(props) => props.$layout === "stacked" && `
    margin-top: 8px;
    &:first-child {
      margin-top: 0;
    }
  `}

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;
dt.dd`
  margin: 0;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);

  ${(props) => props.$layout === "inline" && `
    display: flex;
    align-items: baseline;
  `}

  ${(props) => props.$layout === "stacked" && `
    margin-left: 16px;
    &::before {
      content: '—'; /* Em-dash (U+2014) */
      margin-right: 8px;
      color: ${props.$color || "var(--resume-color-accent)"};
    }
  `}

  ${(props) => props.$layout === "inline" && `
    &::before {
      content: '—'; /* Em-dash (U+2014) */
      margin: 0 8px;
      color: ${props.$color || "var(--resume-color-accent)"};
      flex-shrink: 0;
    }
  `}

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;

    &::before {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;
dt.time`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background-color: ${(props) => props.$variant === "filled" ? "var(--resume-color-accent)" : "var(--resume-color-background)"};
  color: ${(props) => props.$variant === "filled" ? "white" : "var(--resume-color-secondary)"};
  border: 1px solid
    ${(props) => props.$variant === "filled" ? "var(--resume-color-accent)" : "var(--resume-color-border)"};
  border-radius: var(--resume-radius-full);
  font-size: var(--resume-size-small);
  white-space: nowrap;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 1px solid var(--resume-color-border);
    background-color: ${(props) => props.$variant === "filled" ? "var(--resume-color-accent)" : "transparent"};
  }

  @media (max-width: 768px) {
    font-size: var(--resume-size-tiny);
    padding: 3px 10px;
  }
`;
dt.span`
  display: flex;
  align-items: center;
  font-size: 14px;
`;
dt.time`
  font-size: ${(props) => props.$size || "var(--resume-size-small)"};
  color: ${(props) => props.$color || "var(--resume-color-tertiary)"};
  white-space: nowrap;
`;
dt.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: ${(props) => props.$opacity || 0.05};
  z-index: 0;
  background-image: ${(props) => {
  if (props.$pattern === "dots") {
    return `radial-gradient(circle, var(--resume-color-primary) 1px, transparent 1px)`;
  }
  if (props.$pattern === "grid") {
    return `
        linear-gradient(var(--resume-color-border) 1px, transparent 1px),
        linear-gradient(90deg, var(--resume-color-border) 1px, transparent 1px)
      `;
  }
  if (props.$pattern === "diagonal") {
    return `repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        var(--resume-color-border) 10px,
        var(--resume-color-border) 11px
      )`;
  }
  return "none";
}};
  background-size: ${(props) => {
  if (props.$pattern === "dots") return "20px 20px";
  if (props.$pattern === "grid") return "20px 20px";
  return "auto";
}};

  @media print {
    display: none;
  }
`;
dt.div`
  padding: var(--resume-space-section);
  background-color: ${(props) => props.$color || "var(--resume-color-muted)"};
  border-radius: ${(props) => props.$rounded ? "var(--resume-radius-md)" : "0"};
  margin: ${(props) => props.$margin || "var(--resume-space-section) 0"};
  break-inside: avoid;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  @media (max-width: 768px) {
    padding: var(--resume-space-item);
  }
`;
dt.div`
  position: relative;
  z-index: 1;
`;
dt.hr`
  border: none;
  margin: ${(props) => props.$spacing || "var(--resume-space-item) 0"};
  height: ${(props) => {
  if (props.$variant === "thick") return "3px";
  if (props.$variant === "gradient") return "2px";
  return "1px";
}};
  background: ${(props) => {
  if (props.$variant === "gradient") {
    return `linear-gradient(
        to right,
        transparent,
        ${props.$color || "var(--resume-color-border)"},
        transparent
      )`;
  }
  if (props.$variant === "dotted") {
    return `repeating-linear-gradient(
        to right,
        ${props.$color || "var(--resume-color-border)"} 0,
        ${props.$color || "var(--resume-color-border)"} 4px,
        transparent 4px,
        transparent 8px
      )`;
  }
  if (props.$variant === "dashed") {
    return `repeating-linear-gradient(
        to right,
        ${props.$color || "var(--resume-color-border)"} 0,
        ${props.$color || "var(--resume-color-border)"} 12px,
        transparent 12px,
        transparent 20px
      )`;
  }
  return props.$color || "var(--resume-color-border)";
}};

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    background: ${(props) => props.$color || "var(--resume-color-border)"};
  }
`;
dt.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${(props) => props.$spacing || "var(--resume-space-item) 0"};
  gap: var(--resume-space-tight);

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${(props) => props.$color || "var(--resume-color-border)"};
  }

  @media print {
    &::before,
    &::after {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;
dt.span`
  color: ${(props) => props.$color || "var(--resume-color-accent)"};
  font-size: 16px;
`;
dt.div`
  position: relative;
  padding: ${(props) => props.$padding || "var(--resume-space-item)"};
  border: ${(props) => {
  const color = props.$color || "var(--resume-color-accent)";
  if (props.$position === "all") return `2px solid ${color}`;
  return "none";
}};
  border-left: ${(props) => {
  if (props.$position === "left" || props.$position === "all") {
    return `4px solid ${props.$color || "var(--resume-color-accent)"}`;
  }
  return "none";
}};
  border-right: ${(props) => {
  if (props.$position === "right") {
    return `4px solid ${props.$color || "var(--resume-color-accent)"}`;
  }
  return "none";
}};
  border-top: ${(props) => {
  if (props.$position === "top" || props.$position === "all") {
    return `4px solid ${props.$color || "var(--resume-color-accent)"}`;
  }
  return "none";
}};
  border-bottom: ${(props) => {
  if (props.$position === "bottom" || props.$position === "all") {
    return `4px solid ${props.$color || "var(--resume-color-accent)"}`;
  }
  return "none";
}};
  border-radius: ${(props) => props.$rounded ? "var(--resume-radius-md)" : "0"};
  break-inside: avoid;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;
dt.div`
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: ${(props) => props.$color || "var(--resume-color-accent)"};
  border-style: solid;
  border-width: 0;

  ${(props) => {
  if (props.$corner === "top-left") {
    return `
        top: -2px;
        left: -2px;
        border-top-width: 3px;
        border-left-width: 3px;
      `;
  }
  if (props.$corner === "top-right") {
    return `
        top: -2px;
        right: -2px;
        border-top-width: 3px;
        border-right-width: 3px;
      `;
  }
  if (props.$corner === "bottom-left") {
    return `
        bottom: -2px;
        left: -2px;
        border-bottom-width: 3px;
        border-left-width: 3px;
      `;
  }
  if (props.$corner === "bottom-right") {
    return `
        bottom: -2px;
        right: -2px;
        border-bottom-width: 3px;
        border-right-width: 3px;
      `;
  }
}}

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;
dt.div`
  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;
dt.div`
  @media print {
    ${(props) => {
  if (props.$type === "page") {
    return `
          page-break-after: always;
          break-after: page;
        `;
  }
  if (props.$type === "column") {
    return `
          column-break-after: always;
          break-after: column;
        `;
  }
  return `
        page-break-after: always;
        break-after: page;
      `;
}}
  }

  @media screen {
    display: none;
  }
`;
dt.div`
  display: ${(props) => props.$hideScreen ? "none" : "block"};

  @media print {
    display: block !important;
  }

  @media screen {
    display: ${(props) => props.$hideScreen ? "none !important" : "block"};
  }
`;
dt.div`
  @media print {
    display: none !important;
  }
`;
dt.div`
  display: none;

  @media print {
    display: block;
    position: running(header);
    padding-bottom: var(--resume-space-xs, 0.5rem);
    border-bottom: 1px solid var(--resume-color-border, #e5e7eb);
    font-size: var(--resume-size-small, 0.875rem);
    color: var(--resume-color-secondary, #6b7280);
  }
`;
dt.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
dt.span`
  font-weight: 600;
  color: var(--resume-color-primary, #111827);
`;
dt.div`
  display: none;

  @media print {
    display: block;
    position: running(footer);
    padding-top: var(--resume-space-xs, 0.5rem);
    border-top: 1px solid var(--resume-color-border, #e5e7eb);
    font-size: var(--resume-size-xs, 0.75rem);
    color: var(--resume-color-secondary, #6b7280);
  }
`;
dt.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
dt.span`
  @media print {
    &::before {
      content: 'Page ';
    }
    &::after {
      content: ' of ' counter(pages);
    }
  }
`;
dt.span`
  @media print {
    &::before {
      content: counter(page);
    }
  }
`;
dt.span`
  font-variant-numeric: tabular-nums;
`;
dt.div`
  @media print {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: var(--resume-space-xs, 0.5rem) var(--resume-space-base, 1rem);
    background: var(--resume-color-accent, #f3f4f6);
    border-bottom: 2px solid var(--resume-color-primary, #111827);
    z-index: 1000;

    /* Reserve space for unprintable area */
    margin-top: 0.25in;
  }

  @media screen {
    padding: var(--resume-space-xs, 0.5rem) var(--resume-space-base, 1rem);
    background: var(--resume-color-accent, #f3f4f6);
    border-bottom: 2px solid var(--resume-color-primary, #111827);
  }
`;
dt.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--resume-size-small, 0.875rem);
`;
dt.div`
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--resume-color-primary, #111827);
  font-size: var(--resume-size-base, 1rem);
`;
dt.div`
  color: var(--resume-color-secondary, #6b7280);
  font-size: var(--resume-size-small, 0.875rem);
`;
dt.div`
  @media print {
    height: 0.75in;
  }

  @media screen {
    height: 3rem;
  }
`;
dt.div`
  position: relative;
  background: var(--resume-color-background, #ffffff);
`;
dt.div`
  position: relative;
  padding: ${(props) => props.$padding || "var(--resume-space-base, 1rem)"};
  background: var(--resume-color-background, #ffffff);

  /* Primary border */
  border: 1px solid var(--resume-color-border, #e5e7eb);

  /* Shadow emulation using pseudo-element */
  &::after {
    content: '';
    position: absolute;
    top: ${(props) => props.$offset || "4px"};
    left: ${(props) => props.$offset || "4px"};
    right: -${(props) => props.$offset || "4px"};
    bottom: -${(props) => props.$offset || "4px"};
    border: 1px solid ${(props) => props.$shadowColor || "rgba(0, 0, 0, 0.08)"};
    border-radius: inherit;
    z-index: -1;

    @media print {
      /* Ensure shadow prints - use solid light gray */
      border-color: ${(props) => props.$printShadowColor || "#f0f0f0"};
    }
  }
`;
dt.span`
  display: inline-block;
  font-size: ${(props) => props.theme?.typography?.sizes?.small || "var(--resume-size-small, 10px)"};
  font-weight: ${(props) => props.theme?.typography?.weights?.semibold || "var(--resume-weight-semibold, 600)"};
  color: ${(props) => props.$color || props.theme?.colors?.secondary || "var(--resume-color-secondary, #4a4a4a)"};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  line-height: 1.2;

  @media print {
    font-size: 9pt;
    color: ${(props) => props.$color || "#4a4a4a"};
    letter-spacing: 0.08em;
  }
`;
dt.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: ${(props) => props.theme?.typography?.sizes?.small || "var(--resume-size-small, 10px)"};
  color: ${(props) => props.theme?.colors?.secondary || "var(--resume-color-secondary, #4a4a4a)"};
  line-height: 1.5;

  /* Ensure 4.5:1 contrast ratio minimum */
  @media screen {
    color: #4a4a4a; /* 9.29:1 contrast on white */
  }

  @media print {
    font-size: 9pt;
    color: #4a4a4a;
    gap: 6px;
  }
`;
dt.span`
  display: inline-flex;
  align-items: center;
  white-space: nowrap;

  &:not(:last-child)::after {
    content: '${(props) => props.$separator}';
    margin-left: 8px;
    opacity: 0.6;

    @media print {
      margin-left: 6px;
    }
  }
`;
dt.div`
  display: block;
  font-size: ${(props) => props.theme?.typography?.sizes?.small || "var(--resume-size-small, 10px)"};
  font-weight: ${(props) => props.theme?.typography?.weights?.semibold || "var(--resume-weight-semibold, 600)"};
  color: ${(props) => props.theme?.colors?.secondary || "var(--resume-color-secondary, #4a4a4a)"};
  margin-bottom: 6px;
  line-height: 1.4;

  /* Tracked uppercase variant */
  ${(props) => props.$variant === "tracked" && `
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-variant: normal;
  `}

  /* Small caps variant */
  ${(props) => props.$variant === "caps" && `
    font-variant: small-caps;
    letter-spacing: 0.05em;
    text-transform: lowercase;
  `}

  @media print {
    font-size: 9pt;
    color: #4a4a4a;
    margin-bottom: 4px;

    ${(props) => props.$variant === "tracked" && `
      text-transform: uppercase;
      letter-spacing: 0.1em;
    `}

    ${(props) => props.$variant === "caps" && `
      font-variant: small-caps;
      letter-spacing: 0.05em;
    `}
  }
`;
dt.span`
  display: inline-block;
  font-size: ${(props) => {
  if (props.$size === "xs") return "8pt";
  return "9pt";
}};
  font-weight: ${(props) => props.theme?.typography?.weights?.medium || "var(--resume-weight-medium, 500)"};
  /* Ensure 4.5:1 contrast minimum - #767676 provides 4.54:1 on white */
  color: #767676;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  line-height: 1.3;

  @media print {
    font-size: ${(props) => {
  if (props.$size === "xs") return "8pt";
  return "9pt";
}};
    color: #767676;
    letter-spacing: 0.08em;
  }
`;
dt.h2`
  font-size: ${(props) => {
  if (props.$size === "sm") return "11pt";
  if (props.$size === "lg") return "13pt";
  return "12pt";
}};
  font-weight: ${(props) => props.theme?.typography?.weights?.semibold || "var(--resume-weight-semibold, 600)"};
  color: ${(props) => props.theme?.colors?.primary || "var(--resume-color-primary, #1a1a1a)"};
  font-variant: small-caps;
  letter-spacing: 0.06em;
  line-height: 1.3;
  margin: 0 0 12px 0;
  text-transform: lowercase; /* Allows font-variant to work properly */

  @media print {
    font-size: ${(props) => {
  if (props.$size === "sm") return "11pt";
  if (props.$size === "lg") return "13pt";
  return "12pt";
}};
    color: #1a1a1a;
    letter-spacing: 0.06em;
    margin: 0 0 10px 0;
    font-variant: small-caps;
    page-break-after: avoid;
  }
`;
dt.div`
  background: ${(props) => {
  if (props.$tint === "accent") {
    return props.theme?.colors?.accentMuted || "var(--resume-color-accent-muted, rgba(0, 102, 204, 0.06))";
  }
  if (props.$tint === "warm") {
    return "var(--resume-color-warm-muted, rgba(102, 51, 0, 0.05))";
  }
  if (props.$tint === "cool") {
    return "var(--resume-color-cool-muted, rgba(0, 51, 102, 0.05))";
  }
  return props.theme?.colors?.muted || "var(--resume-color-muted, #f5f5f5)";
}};

  color: ${(props) => props.theme?.colors?.primary || "var(--resume-color-primary, #000)"};

  padding: ${(props) => {
  if (props.$padding === "sm") return "12px";
  if (props.$padding === "lg") return "24px";
  return "16px";
}};

  border-radius: ${(props) => props.theme?.radius?.md || "var(--resume-radius-md, 6px)"};

  margin: ${(props) => {
  if (props.$margin === "sm") return "8px 0";
  if (props.$margin === "lg") return "24px 0";
  if (props.$margin === "none") return "0";
  return "16px 0";
}};

  /* High text contrast for readability */
  line-height: 1.6;
  font-size: 10pt;

  /* Ensure content spacing */
  > *:first-child {
    margin-top: 0;
  }

  > *:last-child {
    margin-bottom: 0;
  }

  @media print {
    /* Use subtle backgrounds that print well */
    background: ${(props) => {
  if (props.$tint === "accent") return "rgba(0, 102, 204, 0.05)";
  if (props.$tint === "warm") return "rgba(102, 51, 0, 0.04)";
  if (props.$tint === "cool") return "rgba(0, 51, 102, 0.04)";
  return "#f8f8f8";
}};

    /* Ensure high contrast text for printing */
    color: #000;

    /* Remove border radius for cleaner print appearance */
    border-radius: 0;

    /* Adjust spacing for print density */
    padding: ${(props) => {
  if (props.$padding === "sm") return "10px";
  if (props.$padding === "lg") return "20px";
  return "14px";
}};

    /* Prevent orphaned panels */
    page-break-inside: avoid;
  }
`;
dt.div`
  border-left: 4px solid
    ${(props) => {
  if (props.$variant === "success")
    return "var(--resume-color-success, #22c55e)";
  if (props.$variant === "warning")
    return "var(--resume-color-warning, #f59e0b)";
  if (props.$variant === "info") return "var(--resume-color-info, #3b82f6)";
  return props.theme?.colors?.accent || "var(--resume-color-accent, #0066cc)";
}};

  background: ${(props) => {
  if (props.$variant === "success")
    return "var(--resume-color-success-light, rgba(34, 197, 94, 0.08))";
  if (props.$variant === "warning")
    return "var(--resume-color-warning-light, rgba(245, 158, 11, 0.08))";
  if (props.$variant === "info")
    return "var(--resume-color-info-light, rgba(59, 130, 246, 0.08))";
  return props.theme?.colors?.accentLight || "var(--resume-color-accent-light, rgba(0, 102, 204, 0.08))";
}};

  padding: ${(props) => props.$size === "sm" ? "12px 16px" : "16px 20px"}; /* default md */

  margin: 16px 0;
  border-radius: ${(props) => props.theme?.radius?.md || "var(--resume-radius-md, 6px)"};

  /* Ensure high contrast text, no reversed text */
  color: ${(props) => props.theme?.colors?.primary || "var(--resume-color-primary, #000)"};

  @media print {
    /* Solid border for print clarity */
    border-left: 3pt solid
      ${(props) => {
  if (props.$variant === "success") return "#22c55e";
  if (props.$variant === "warning") return "#f59e0b";
  if (props.$variant === "info") return "#3b82f6";
  return "#0066cc";
}};

    /* Lighter background for print */
    background: ${(props) => {
  if (props.$variant === "success") return "rgba(34, 197, 94, 0.05)";
  if (props.$variant === "warning") return "rgba(245, 158, 11, 0.05)";
  if (props.$variant === "info") return "rgba(59, 130, 246, 0.05)";
  return "rgba(0, 102, 204, 0.05)";
}};

    /* Remove border radius */
    border-radius: 0;

    /* Ensure black text for maximum contrast */
    color: #000;

    /* Prevent splitting across pages */
    page-break-inside: avoid;
  }
`;
dt.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  /* Icon styling */
  .callout-icon {
    font-size: 16pt;
    line-height: 1;
  }
`;
dt.div`
  /* Bold, larger title for emphasis (as per design constraints) */
  font-size: ${(props) => props.$size === "sm" ? "11pt" : "12pt"};
  font-weight: 700;
  color: ${(props) => {
  if (props.$variant === "success")
    return "var(--resume-color-success-dark, #16a34a)";
  if (props.$variant === "warning")
    return "var(--resume-color-warning-dark, #d97706)";
  if (props.$variant === "info")
    return "var(--resume-color-info-dark, #2563eb)";
  return props.theme?.colors?.accent || "var(--resume-color-accent, #0066cc)";
}};

  @media print {
    /* Maintain weight and bump size slightly for print */
    font-weight: 700;
    font-size: ${(props) => props.$size === "sm" ? "11pt" : "12pt"};
    color: #000;
  }
`;
dt.div`
  font-size: 10pt;
  line-height: 1.6;

  > *:first-child {
    margin-top: 0;
  }

  > *:last-child {
    margin-bottom: 0;
  }

  @media print {
    font-size: 10pt;
    line-height: 1.5;
  }
`;
dt.div`
  /* 1pt stroke as specified */
  border: 1px solid
    ${(props) => {
  if (props.$variant === "accent") {
    return props.theme?.colors?.accentBorder || "var(--resume-color-accent-border, #cce5ff)";
  }
  if (props.$variant === "muted") {
    return props.theme?.colors?.border || "var(--resume-color-border, #e5e5e5)";
  }
  return props.theme?.colors?.borderLight || "var(--resume-color-border-light, #d4d4d4)";
}};

  /* Rounded corners for softness */
  border-radius: ${(props) => {
  if (props.$rounded === "sm") return "4px";
  if (props.$rounded === "lg") return "12px";
  return props.theme?.radius?.md || "var(--resume-radius-md, 8px)";
}};

  /* No shadows - clean outline only */
  box-shadow: none;

  /* Padding options */
  padding: ${(props) => {
  if (props.$padding === "sm") return "12px";
  if (props.$padding === "lg") return "24px";
  return "16px";
}};

  margin: ${(props) => {
  if (props.$margin === "sm") return "8px 0";
  if (props.$margin === "lg") return "24px 0";
  if (props.$margin === "none") return "0";
  return "16px 0";
}};

  /* Optional subtle background */
  background: ${(props) => {
  if (props.$background === "accent") {
    return props.theme?.colors?.accentMuted || "var(--resume-color-accent-muted, rgba(0, 102, 204, 0.03))";
  }
  if (props.$background === "muted") {
    return "var(--resume-color-background-muted, rgba(0, 0, 0, 0.02))";
  }
  return "transparent";
}};

  /* Text styling */
  color: ${(props) => props.theme?.colors?.primary || "var(--resume-color-primary, #000)"};

  /* Content spacing */
  > *:first-child {
    margin-top: 0;
  }

  > *:last-child {
    margin-bottom: 0;
  }

  @media print {
    /* Ensure border prints clearly */
    border: 1pt solid
      ${(props) => {
  if (props.$variant === "accent") return "#b3d9ff";
  if (props.$variant === "muted") return "#d4d4d4";
  return "#c0c0c0";
}};

    /* Remove border radius for print (cleaner appearance) */
    border-radius: 0;

    /* Remove background fills for print */
    background: transparent;

    /* Ensure high contrast text */
    color: #000;

    /* Adjust padding for print density */
    padding: ${(props) => {
  if (props.$padding === "sm") return "10px";
  if (props.$padding === "lg") return "20px";
  return "14px";
}};

    /* Prevent splitting card across pages */
    page-break-inside: avoid;

    /* Ensure no page edge collision */
    margin-left: 0;
    margin-right: 0;
  }
`;
dt.div`
  /* Light frame - subtle border */
  border: 1px solid
    ${(props) => {
  if (props.$variant === "accent") {
    return props.theme?.colors?.accentBorder || "var(--resume-color-accent-border, #e0e0e0)";
  }
  if (props.$variant === "minimal") {
    return "transparent";
  }
  return props.theme?.colors?.borderLight || "var(--resume-color-border-light, #e5e5e5)";
}};

  /* Optional background tint */
  background: ${(props) => {
  if (props.$variant === "accent") {
    return props.theme?.colors?.accentMuted || "var(--resume-color-accent-muted, rgba(0, 102, 204, 0.02))";
  }
  if (props.$variant === "tinted") {
    return "var(--resume-color-background-muted, rgba(0, 0, 0, 0.01))";
  }
  return "transparent";
}};

  /* Consistent padding to prevent edge collision */
  padding: ${(props) => {
  if (props.$padding === "sm") return "12px 16px";
  if (props.$padding === "lg") return "20px 24px";
  return "16px 20px";
}};

  /* Spacing between role blocks */
  margin: ${(props) => {
  if (props.$spacing === "sm") return "12px 0";
  if (props.$spacing === "lg") return "24px 0";
  if (props.$spacing === "none") return "0";
  return "16px 0";
}};

  /* Subtle rounding */
  border-radius: ${(props) => props.theme?.radius?.sm || "var(--resume-radius-sm, 4px)"};

  /* Text styling */
  color: ${(props) => props.theme?.colors?.primary || "var(--resume-color-primary, #000)"};

  /* Content spacing */
  > *:first-child {
    margin-top: 0;
  }

  > *:last-child {
    margin-bottom: 0;
  }

  /* Ensure proper spacing for nested elements */
  h3,
  h4 {
    margin-bottom: 8px;
  }

  p {
    margin: 4px 0;
  }

  ul,
  ol {
    margin: 8px 0;
    padding-left: 20px;
  }

  li {
    margin: 4px 0;
  }

  @media print {
    /* Ensure border prints clearly */
    border: ${(props) => {
  if (props.$variant === "minimal") return "none";
  if (props.$variant === "accent") return "0.5pt solid #d0d0d0";
  return "0.5pt solid #e0e0e0";
}};

    /* Remove background for clean print */
    background: transparent;

    /* Remove border radius for print */
    border-radius: 0;

    /* Adjust padding for print density */
    padding: ${(props) => {
  if (props.$padding === "sm") return "10px 12px";
  if (props.$padding === "lg") return "16px 20px";
  return "12px 16px";
}};

    /* Prevent page edge collision - ensure margins */
    margin-left: 0;
    margin-right: 0;

    /* Prevent splitting role blocks across pages */
    page-break-inside: avoid;

    /* Add small gap after each block for readability */
    margin-bottom: ${(props) => {
  if (props.$spacing === "sm") return "10px";
  if (props.$spacing === "lg") return "20px";
  if (props.$spacing === "none") return "0";
  return "14px";
}};

    /* Ensure high contrast text */
    color: #000;

    /* Optimize nested element spacing for print */
    h3,
    h4 {
      margin-bottom: 6px;
    }

    ul,
    ol {
      margin: 6px 0;
    }

    li {
      margin: 3px 0;
    }
  }
`;
dt.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: ${(props) => props.$size === "small" ? "6px" : "8px"};
  margin: ${(props) => props.$size === "small" ? "4px 0" : "6px 0"};
  line-height: ${(props) => props.theme?.typography?.lineHeight || "var(--resume-line-height, 1.5)"};

  @media print {
    gap: ${(props) => props.$size === "small" ? "4px" : "6px"};
    margin: 3pt 0;
  }
`;
dt.span`
  display: inline-block;
  font-size: ${(props) => {
  if (props.$size === "small") return "8.5pt";
  if (props.$size === "large") return "10.5pt";
  return "9.5pt";
}};
  font-weight: 500;
  color: ${(props) => props.theme?.colors?.secondary || "var(--resume-color-secondary, #444444)"};
  white-space: nowrap;

  /* Preserve baseline grid */
  vertical-align: baseline;

  @media print {
    color: #444444;
    font-size: ${(props) => {
  if (props.$size === "small") return "8pt";
  if (props.$size === "large") return "10pt";
  return "9pt";
}};
  }
`;
dt.span`
  display: inline-block;
  font-size: ${(props) => {
  if (props.$size === "small") return "8.5pt";
  if (props.$size === "large") return "10.5pt";
  return "9.5pt";
}};
  color: ${(props) => props.theme?.colors?.border || "var(--resume-color-border, #cccccc)"};
  user-select: none;
  vertical-align: baseline;

  @media print {
    color: #cccccc;
  }
`;
dt.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.$size === "small" ? "6px" : "8px"};
  margin: ${(props) => props.$size === "small" ? "6px 0" : "8px 0"};

  @media print {
    gap: ${(props) => props.$size === "small" ? "4px" : "6px"};
    margin: 4pt 0;
  }
`;
dt.span`
  display: inline-flex;
  align-items: center;
  padding: ${(props) => {
  if (props.$size === "small") return "3px 10px";
  if (props.$size === "large") return "7px 16px";
  return "5px 12px";
}};
  border: ${(props) => props.$strokeWidth || "0.5pt"} solid
    ${(props) => props.theme?.colors?.border || "var(--resume-color-border, #666666)"};
  border-radius: ${(props) => props.$rounded ? "999px" : props.theme?.radius?.sm || "var(--resume-radius-sm, 4px)"};
  font-size: ${(props) => {
  if (props.$size === "small") return "8.5pt";
  if (props.$size === "large") return "10.5pt";
  return "9.5pt";
}};
  font-weight: 500;
  color: ${(props) => props.theme?.colors?.primary || "var(--resume-color-primary, #000000)"};
  background: transparent;
  white-space: nowrap;
  line-height: 1.2;

  /* Prevent scalloping on low-DPI displays */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @media print {
    /* Ensure minimum stroke width for print clarity */
    border-width: ${(props) => {
  const width = props.$strokeWidth || "0.5pt";
  return width;
}};
    border-color: #666666;
    color: #000000;
    padding: ${(props) => {
  if (props.$size === "small") return "2pt 8pt";
  if (props.$size === "large") return "5pt 12pt";
  return "3pt 10pt";
}};
    font-size: ${(props) => {
  if (props.$size === "small") return "8pt";
  if (props.$size === "large") return "10pt";
  return "9pt";
}};

    /* Force exact colors for print */
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;
const Layout = dt.div`
  max-width: 950px;
  margin: 0 auto;
  padding: 0;
  background: linear-gradient(to bottom, #fff1f2 0%, #ffffff 400px);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  color: #1f2937;
  font-size: 11pt;
  line-height: 1.6;
  min-height: 100vh;

  @media print {
    background: white;
    min-height: auto;
  }
`;
const Header = dt.header`
  background: linear-gradient(135deg, #9f1239 0%, #be123c 50%, #e11d48 100%);
  color: white;
  padding: 70px 60px 90px;
  position: relative;
  clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);

  @media print {
    padding: 50px 40px 70px;
    clip-path: none;
  }
`;
const HeaderContent = dt.div`
  max-width: 850px;
  margin: 0 auto;
`;
const Name = dt.h1`
  font-size: 56px;
  font-weight: 800;
  color: white;
  margin: 0 0 16px 0;
  letter-spacing: -1px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  @media print {
    font-size: 48px;
  }
`;
const Tagline = dt.div`
  font-size: 22px;
  color: #fecdd3;
  margin-bottom: 24px;
  font-weight: 500;
  letter-spacing: 0.3px;
`;
const StyledContactInfo = dt(ContactInfo)`
  font-size: 15px;
  justify-content: flex-start;
  color: #fecdd3;

  a {
    font-size: 15px;
    color: white;
    text-decoration: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    transition: border-color 0.2s;

    &:hover {
      border-bottom-color: white;
    }
  }

  @media print {
    a {
      border-bottom: none;
    }
  }
`;
const Content = dt.div`
  padding: 60px 60px 80px;
  max-width: 850px;
  margin: 0 auto;

  @media print {
    padding: 40px;
  }
`;
const Summary = dt.div`
  font-size: 18px;
  line-height: 1.8;
  color: #374151;
  margin: 0 0 50px 0;
  padding: 35px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(159, 18, 57, 0.08);
  border-left: 5px solid #e11d48;
  position: relative;

  &::before {
    content: '"';
    position: absolute;
    top: 10px;
    left: 15px;
    font-size: 80px;
    color: #fecdd3;
    font-family: Georgia, serif;
    line-height: 1;
  }

  p {
    margin: 0;
    padding-left: 20px;
  }

  @media print {
    box-shadow: none;
    border: 1px solid #e5e7eb;
  }
`;
const StyledSectionTitle = dt(SectionTitle)`
  font-size: 26px;
  font-weight: 700;
  color: #9f1239;
  margin: 0 0 30px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 16px;

  &::after {
    content: '';
    flex: 1;
    height: 3px;
    background: linear-gradient(to right, #e11d48, transparent);
    border-radius: 2px;
  }
`;
const WorkItem = dt.div`
  margin-bottom: 35px;
  padding-bottom: 35px;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }
`;
const WorkHeader = dt.div`
  margin-bottom: 12px;
`;
const Position = dt.h3`
  font-size: 20px;
  font-weight: 700;
  color: #9f1239;
  margin: 0 0 6px 0;
`;
const CompanyMeta = dt.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 8px;
`;
const Company = dt.div`
  font-size: 17px;
  color: #374151;
  font-weight: 600;
`;
const DateText = dt.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;

  &::before {
    content: '•';
    margin-right: 8px;
    color: #e11d48;
  }
`;
const WorkSummary = dt.p`
  margin: 14px 0;
  color: #374151;
  line-height: 1.8;
  font-size: 15px;
  font-style: italic;
  border-left: 3px solid #fecdd3;
  padding-left: 16px;
`;
const Highlights = dt.ul`
  margin: 14px 0 0 0;
  padding-left: 20px;
  list-style-type: none;

  li {
    margin: 10px 0;
    color: #4b5563;
    line-height: 1.7;
    padding-left: 8px;
    position: relative;

    &::before {
      content: '▸';
      position: absolute;
      left: -12px;
      color: #e11d48;
      font-weight: bold;
    }
  }
`;
const EducationGrid = dt.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`;
const EducationCard = dt.div`
  padding: 24px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(159, 18, 57, 0.06);
  border-top: 4px solid #e11d48;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(159, 18, 57, 0.12);
    transform: translateY(-2px);
  }

  @media print {
    box-shadow: none;
    border: 1px solid #e5e7eb;
    transform: none !important;
  }
`;
const Institution = dt.h3`
  font-size: 18px;
  font-weight: 700;
  color: #9f1239;
  margin: 0 0 8px 0;
`;
const Degree = dt.div`
  font-size: 16px;
  color: #374151;
  margin-bottom: 6px;
  font-weight: 600;
`;
const EducationMeta = dt.div`
  font-size: 14px;
  color: #6b7280;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;
const Courses = dt.div`
  margin-top: 12px;
  font-size: 13px;
  color: #4b5563;
  line-height: 1.6;

  strong {
    color: #374151;
    display: block;
    margin-bottom: 4px;
  }
`;
const SkillsGrid = dt.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;
const SkillCategory = dt.div`
  padding: 20px;
  background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%);
  border-radius: 10px;
  border-left: 4px solid #e11d48;
`;
const SkillName = dt.h4`
  font-size: 15px;
  font-weight: 700;
  color: #9f1239;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;
const SkillTags = dt.div`
  font-size: 14px;
  color: #4b5563;
  line-height: 1.7;
`;
const ProjectItem = dt(WorkItem)``;
const ProjectTitle = dt(Position)`
  font-size: 18px;
`;
const ProjectMeta = dt.div`
  display: flex;
  gap: 12px;
  margin-top: 6px;
  font-size: 14px;
  color: #6b7280;
  flex-wrap: wrap;
`;
const ProjectLink = dt.a`
  color: #e11d48;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;
const AwardCard = dt(EducationCard)``;
const AwardTitle = dt(Institution)`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  font-size: 17px;
`;
const SimpleList = dt.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
`;
const SimpleItem = dt.div`
  font-size: 15px;
  color: #4b5563;
  padding: 14px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(159, 18, 57, 0.05);

  strong {
    color: #9f1239;
    font-weight: 600;
    display: block;
    margin-bottom: 4px;
  }

  @media print {
    box-shadow: none;
    border: 1px solid #e5e7eb;
  }
`;
function Resume({ resume }) {
  const {
    basics = {},
    work = [],
    education = [],
    skills = [],
    projects = [],
    volunteer = [],
    awards = [],
    publications = [],
    languages = [],
    interests = [],
    references = []
  } = resume;
  return /* @__PURE__ */ jsxs(Layout, { children: [
    /* @__PURE__ */ jsx(Header, { children: /* @__PURE__ */ jsxs(HeaderContent, { children: [
      /* @__PURE__ */ jsx(Name, { children: basics.name }),
      basics.label && /* @__PURE__ */ jsx(Tagline, { children: basics.label }),
      /* @__PURE__ */ jsx(StyledContactInfo, { basics })
    ] }) }),
    /* @__PURE__ */ jsxs(Content, { children: [
      basics.summary && /* @__PURE__ */ jsx(Summary, { children: /* @__PURE__ */ jsx("p", { children: basics.summary }) }),
      work?.length > 0 && /* @__PURE__ */ jsxs(Section, { children: [
        /* @__PURE__ */ jsx(StyledSectionTitle, { children: "Professional Experience" }),
        work.map((job, index2) => /* @__PURE__ */ jsxs(WorkItem, { children: [
          /* @__PURE__ */ jsxs(WorkHeader, { children: [
            /* @__PURE__ */ jsx(Position, { children: job.position }),
            /* @__PURE__ */ jsxs(CompanyMeta, { children: [
              job.name && /* @__PURE__ */ jsx(Company, { children: job.name }),
              (job.startDate || job.endDate) && /* @__PURE__ */ jsx(DateText, { children: /* @__PURE__ */ jsx(
                DateRange,
                {
                  startDate: job.startDate,
                  endDate: job.endDate
                }
              ) })
            ] })
          ] }),
          job.summary && /* @__PURE__ */ jsx(WorkSummary, { children: job.summary }),
          job.highlights?.length > 0 && /* @__PURE__ */ jsx(Highlights, { children: job.highlights.map((highlight, i) => /* @__PURE__ */ jsx("li", { children: highlight }, i)) })
        ] }, index2))
      ] }),
      education?.length > 0 && /* @__PURE__ */ jsxs(Section, { children: [
        /* @__PURE__ */ jsx(StyledSectionTitle, { children: "Education" }),
        /* @__PURE__ */ jsx(EducationGrid, { children: education.map((edu, index2) => /* @__PURE__ */ jsxs(EducationCard, { children: [
          /* @__PURE__ */ jsx(Institution, { children: edu.institution }),
          /* @__PURE__ */ jsxs(Degree, { children: [
            edu.studyType,
            " in ",
            edu.area
          ] }),
          /* @__PURE__ */ jsxs(EducationMeta, { children: [
            /* @__PURE__ */ jsx(DateText, { children: /* @__PURE__ */ jsx(
              DateRange,
              {
                startDate: edu.startDate,
                endDate: edu.endDate
              }
            ) }),
            edu.score && /* @__PURE__ */ jsxs("span", { children: [
              "GPA: ",
              edu.score
            ] })
          ] }),
          edu.courses?.length > 0 && /* @__PURE__ */ jsxs(Courses, { children: [
            /* @__PURE__ */ jsx("strong", { children: "Key Coursework:" }),
            edu.courses.join(", ")
          ] })
        ] }, index2)) })
      ] }),
      skills?.length > 0 && /* @__PURE__ */ jsxs(Section, { children: [
        /* @__PURE__ */ jsx(StyledSectionTitle, { children: "Core Competencies" }),
        /* @__PURE__ */ jsx(SkillsGrid, { children: skills.map((skill, index2) => /* @__PURE__ */ jsxs(SkillCategory, { children: [
          /* @__PURE__ */ jsx(SkillName, { children: skill.name }),
          skill.keywords?.length > 0 && /* @__PURE__ */ jsx(SkillTags, { children: skill.keywords.join(" • ") })
        ] }, index2)) })
      ] }),
      projects?.length > 0 && /* @__PURE__ */ jsxs(Section, { children: [
        /* @__PURE__ */ jsx(StyledSectionTitle, { children: "Featured Projects" }),
        projects.map((project, index2) => /* @__PURE__ */ jsxs(ProjectItem, { children: [
          /* @__PURE__ */ jsx(ProjectTitle, { children: project.name }),
          /* @__PURE__ */ jsxs(ProjectMeta, { children: [
            project.startDate && /* @__PURE__ */ jsx(DateText, { children: /* @__PURE__ */ jsx(
              DateRange,
              {
                startDate: project.startDate,
                endDate: project.endDate
              }
            ) }),
            project.url && /* @__PURE__ */ jsx(
              ProjectLink,
              {
                href: project.url,
                target: "_blank",
                rel: "noopener noreferrer",
                children: "View Project →"
              }
            )
          ] }),
          project.description && /* @__PURE__ */ jsx(WorkSummary, { children: project.description }),
          project.highlights?.length > 0 && /* @__PURE__ */ jsx(Highlights, { children: project.highlights.map((highlight, i) => /* @__PURE__ */ jsx("li", { children: highlight }, i)) })
        ] }, index2))
      ] }),
      volunteer?.length > 0 && /* @__PURE__ */ jsxs(Section, { children: [
        /* @__PURE__ */ jsx(StyledSectionTitle, { children: "Community Involvement" }),
        volunteer.map((vol, index2) => /* @__PURE__ */ jsxs(WorkItem, { children: [
          /* @__PURE__ */ jsxs(WorkHeader, { children: [
            /* @__PURE__ */ jsx(Position, { children: vol.position }),
            /* @__PURE__ */ jsxs(CompanyMeta, { children: [
              vol.organization && /* @__PURE__ */ jsx(Company, { children: vol.organization }),
              (vol.startDate || vol.endDate) && /* @__PURE__ */ jsx(DateText, { children: /* @__PURE__ */ jsx(
                DateRange,
                {
                  startDate: vol.startDate,
                  endDate: vol.endDate
                }
              ) })
            ] })
          ] }),
          vol.summary && /* @__PURE__ */ jsx(WorkSummary, { children: vol.summary }),
          vol.highlights?.length > 0 && /* @__PURE__ */ jsx(Highlights, { children: vol.highlights.map((highlight, i) => /* @__PURE__ */ jsx("li", { children: highlight }, i)) })
        ] }, index2))
      ] }),
      awards?.length > 0 && /* @__PURE__ */ jsxs(Section, { children: [
        /* @__PURE__ */ jsx(StyledSectionTitle, { children: "Recognition & Awards" }),
        /* @__PURE__ */ jsx(EducationGrid, { children: awards.map((award, index2) => /* @__PURE__ */ jsxs(AwardCard, { children: [
          /* @__PURE__ */ jsx(AwardTitle, { children: award.title }),
          award.awarder && /* @__PURE__ */ jsxs(Degree, { children: [
            "Awarded by ",
            award.awarder
          ] }),
          award.date && /* @__PURE__ */ jsx(DateText, { children: award.date }),
          award.summary && /* @__PURE__ */ jsx(WorkSummary, { children: award.summary })
        ] }, index2)) })
      ] }),
      publications?.length > 0 && /* @__PURE__ */ jsxs(Section, { children: [
        /* @__PURE__ */ jsx(StyledSectionTitle, { children: "Publications" }),
        /* @__PURE__ */ jsx(EducationGrid, { children: publications.map((pub, index2) => /* @__PURE__ */ jsxs(AwardCard, { children: [
          /* @__PURE__ */ jsx(AwardTitle, { children: pub.name }),
          pub.publisher && /* @__PURE__ */ jsxs(Degree, { children: [
            "Published by ",
            pub.publisher
          ] }),
          pub.releaseDate && /* @__PURE__ */ jsx(DateText, { children: pub.releaseDate }),
          pub.summary && /* @__PURE__ */ jsx(WorkSummary, { children: pub.summary })
        ] }, index2)) })
      ] }),
      languages?.length > 0 && /* @__PURE__ */ jsxs(Section, { children: [
        /* @__PURE__ */ jsx(StyledSectionTitle, { children: "Languages" }),
        /* @__PURE__ */ jsx(SimpleList, { children: languages.map((lang, index2) => /* @__PURE__ */ jsxs(SimpleItem, { children: [
          /* @__PURE__ */ jsx("strong", { children: lang.language }),
          lang.fluency && /* @__PURE__ */ jsx("span", { children: lang.fluency })
        ] }, index2)) })
      ] }),
      interests?.length > 0 && /* @__PURE__ */ jsxs(Section, { children: [
        /* @__PURE__ */ jsx(StyledSectionTitle, { children: "Interests" }),
        /* @__PURE__ */ jsx(SkillsGrid, { children: interests.map((interest, index2) => /* @__PURE__ */ jsxs(SkillCategory, { children: [
          /* @__PURE__ */ jsx(SkillName, { children: interest.name }),
          interest.keywords?.length > 0 && /* @__PURE__ */ jsx(SkillTags, { children: interest.keywords.join(" • ") })
        ] }, index2)) })
      ] }),
      references?.length > 0 && /* @__PURE__ */ jsxs(Section, { children: [
        /* @__PURE__ */ jsx(StyledSectionTitle, { children: "Testimonials" }),
        references.map((ref, index2) => /* @__PURE__ */ jsxs(WorkItem, { children: [
          /* @__PURE__ */ jsx(AwardTitle, { children: ref.name }),
          ref.reference && /* @__PURE__ */ jsx(WorkSummary, { children: ref.reference })
        ] }, index2))
      ] })
    ] })
  ] });
}
function render(resume, options = {}) {
  const {
    locale = "en",
    dir = "ltr",
    title = resume.basics?.name || "Resume"
  } = options;
  const sheet = new gt();
  try {
    const html = renderToString(
      sheet.collectStyles(/* @__PURE__ */ jsx(Resume, { resume }))
    );
    const styles = sheet.getStyleTags();
    const designTokens = `
    :root {
      --resume-color-primary: #9f1239;
      --resume-color-secondary: #be123c;
      --resume-color-accent: #e11d48;
      --resume-color-bg: #fff1f2;
      --resume-color-card: #ffffff;
    }
  `;
    const globalStyles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      margin: 0;
      background: linear-gradient(to bottom, #fff1f2 0%, #ffffff 400px);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    @media print {
      body {
        background: white;
      }

      @page {
        size: A4;
        margin: 0.5in;
      }
    }
  `;
    return `<!DOCTYPE html>
<html lang="${locale}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>

  <style>
    ${designTokens}
  </style>

  ${styles}

  <style>
    ${globalStyles}
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
  } finally {
    sheet.seal();
  }
}
const index = { render };
export {
  Resume,
  index as default,
  render
};
