"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const server = require("react-dom/server");
const o = require("react");
const fa = require("react-icons/fa");
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
var shallowequal;
var hasRequiredShallowequal;
function requireShallowequal() {
  if (hasRequiredShallowequal) return shallowequal;
  hasRequiredShallowequal = 1;
  shallowequal = function shallowEqual(objA, objB, compare, compareContext) {
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
  return shallowequal;
}
var shallowequalExports = requireShallowequal();
const p = /* @__PURE__ */ getDefaultExportFromCjs(shallowequalExports);
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
var f = "undefined" != typeof process && void 0 !== process.env && (process.env.REACT_APP_SC_ATTR || process.env.SC_ATTR) || "data-styled", m$1 = "active", y$1 = "data-styled-version", v$1 = "6.1.19", g = "/*!sc*/\n", S$1 = "undefined" != typeof window && "undefined" != typeof document, w$1 = Boolean("boolean" == typeof SC_DISABLE_SPEEDY ? SC_DISABLE_SPEEDY : "undefined" != typeof process && void 0 !== process.env && void 0 !== process.env.REACT_APP_SC_DISABLE_SPEEDY && "" !== process.env.REACT_APP_SC_DISABLE_SPEEDY ? "false" !== process.env.REACT_APP_SC_DISABLE_SPEEDY && process.env.REACT_APP_SC_DISABLE_SPEEDY : "undefined" != typeof process && void 0 !== process.env && void 0 !== process.env.SC_DISABLE_SPEEDY && "" !== process.env.SC_DISABLE_SPEEDY ? "false" !== process.env.SC_DISABLE_SPEEDY && process.env.SC_DISABLE_SPEEDY : "production" !== process.env.NODE_ENV), E$1 = /invalid hook call/i, N$1 = /* @__PURE__ */ new Set(), P$1 = function(t, n) {
  if ("production" !== process.env.NODE_ENV) {
    var o$1 = n ? ' with the id of "'.concat(n, '"') : "", s = "The component ".concat(t).concat(o$1, " has been created dynamically.\n") + "You may see this warning because you've called styled inside another component.\nTo resolve this only create new StyledComponents outside of any render method and function component.\nSee https://styled-components.com/docs/basics#define-styled-components-outside-of-the-render-method for more info.\n", i = console.error;
    try {
      var a = true;
      console.error = function(t2) {
        for (var n2 = [], o2 = 1; o2 < arguments.length; o2++) n2[o2 - 1] = arguments[o2];
        E$1.test(t2) ? (a = false, N$1.delete(s)) : i.apply(void 0, __spreadArray([t2], n2, false));
      }, o.useRef(), a && !N$1.has(s) && (console.warn(s), N$1.add(s));
    } catch (e) {
      E$1.test(e.message) && N$1.delete(s);
    } finally {
      console.error = i;
    }
  }
}, _$1 = Object.freeze([]), C$1 = Object.freeze({});
function I$1(e, t, n) {
  return void 0 === n && (n = C$1), e.theme !== n.theme && e.theme || t || n.theme;
}
var A = /* @__PURE__ */ new Set(["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "u", "ul", "use", "var", "video", "wbr", "circle", "clipPath", "defs", "ellipse", "foreignObject", "g", "image", "line", "linearGradient", "marker", "mask", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "stop", "svg", "text", "tspan"]), O = /[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g, D$1 = /(^-|-$)/g;
function R(e) {
  return e.replace(O, "-").replace(D$1, "");
}
var T$1 = /(a)(d)/gi, k$1 = 52, j$1 = function(e) {
  return String.fromCharCode(e + (e > 25 ? 39 : 97));
};
function x$1(e) {
  var t, n = "";
  for (t = Math.abs(e); t > k$1; t = t / k$1 | 0) n = j$1(t % k$1) + n;
  return (j$1(t % k$1) + n).replace(T$1, "$1-$2");
}
var V$1, F$1 = 5381, z$1 = function(e, t) {
  for (var n = t.length; n; ) e = 33 * e ^ t.charCodeAt(--n);
  return e;
}, M$1 = function(e) {
  return z$1(F$1, e);
};
function $$1(e) {
  return x$1(M$1(e) >>> 0);
}
function B$1(e) {
  return "production" !== process.env.NODE_ENV && "string" == typeof e && e || e.displayName || e.name || "Component";
}
function G$1(e) {
  return "string" == typeof e && ("production" === process.env.NODE_ENV || e.charAt(0) === e.charAt(0).toLowerCase());
}
var L$1 = "function" == typeof Symbol && Symbol.for, Y = L$1 ? Symbol.for("react.memo") : 60115, q$1 = L$1 ? Symbol.for("react.forward_ref") : 60112, W$1 = { childContextTypes: true, contextType: true, contextTypes: true, defaultProps: true, displayName: true, getDefaultProps: true, getDerivedStateFromError: true, getDerivedStateFromProps: true, mixins: true, propTypes: true, type: true }, H = { name: true, length: true, prototype: true, caller: true, callee: true, arguments: true, arity: true }, U$1 = { $$typeof: true, compare: true, defaultProps: true, displayName: true, propTypes: true, type: true }, J$1 = ((V$1 = {})[q$1] = { $$typeof: true, render: true, defaultProps: true, displayName: true, propTypes: true }, V$1[Y] = U$1, V$1);
function X$1(e) {
  return ("type" in (t = e) && t.type.$$typeof) === Y ? U$1 : "$$typeof" in e ? J$1[e.$$typeof] : W$1;
  var t;
}
var Z = Object.defineProperty, K$1 = Object.getOwnPropertyNames, Q$1 = Object.getOwnPropertySymbols, ee = Object.getOwnPropertyDescriptor, te = Object.getPrototypeOf, ne = Object.prototype;
function oe$1(e, t, n) {
  if ("string" != typeof t) {
    if (ne) {
      var o2 = te(t);
      o2 && o2 !== ne && oe$1(e, o2, n);
    }
    var r = K$1(t);
    Q$1 && (r = r.concat(Q$1(t)));
    for (var s = X$1(e), i = X$1(t), a = 0; a < r.length; ++a) {
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
function re$1(e) {
  return "function" == typeof e;
}
function se$1(e) {
  return "object" == typeof e && "styledComponentId" in e;
}
function ie$1(e, t) {
  return e && t ? "".concat(e, " ").concat(t) : e || t || "";
}
function ae$1(e, t) {
  if (0 === e.length) return "";
  for (var n = e[0], o2 = 1; o2 < e.length; o2++) n += t ? t + e[o2] : e[o2];
  return n;
}
function ce$1(e) {
  return null !== e && "object" == typeof e && e.constructor.name === Object.name && !("props" in e && e.$$typeof);
}
function le$1(e, t, n) {
  if (void 0 === n && (n = false), !n && !ce$1(e) && !Array.isArray(e)) return t;
  if (Array.isArray(t)) for (var o2 = 0; o2 < t.length; o2++) e[o2] = le$1(e[o2], t[o2]);
  else if (ce$1(t)) for (var o2 in t) e[o2] = le$1(e[o2], t[o2]);
  return e;
}
function ue$1(e, t) {
  Object.defineProperty(e, "toString", { value: t });
}
var pe$1 = "production" !== process.env.NODE_ENV ? { 1: "Cannot create styled-component for component: %s.\n\n", 2: "Can't collect styles once you've consumed a `ServerStyleSheet`'s styles! `ServerStyleSheet` is a one off instance for each server-side render cycle.\n\n- Are you trying to reuse it across renders?\n- Are you accidentally calling collectStyles twice?\n\n", 3: "Streaming SSR is only supported in a Node.js environment; Please do not try to call this method in the browser.\n\n", 4: "The `StyleSheetManager` expects a valid target or sheet prop!\n\n- Does this error occur on the client and is your target falsy?\n- Does this error occur on the server and is the sheet falsy?\n\n", 5: "The clone method cannot be used on the client!\n\n- Are you running in a client-like environment on the server?\n- Are you trying to run SSR on the client?\n\n", 6: "Trying to insert a new style tag, but the given Node is unmounted!\n\n- Are you using a custom target that isn't mounted?\n- Does your document not have a valid head element?\n- Have you accidentally removed a style tag manually?\n\n", 7: 'ThemeProvider: Please return an object from your "theme" prop function, e.g.\n\n```js\ntheme={() => ({})}\n```\n\n', 8: 'ThemeProvider: Please make your "theme" prop an object.\n\n', 9: "Missing document `<head>`\n\n", 10: "Cannot find a StyleSheet instance. Usually this happens if there are multiple copies of styled-components loaded at once. Check out this issue for how to troubleshoot and fix the common cases where this situation can happen: https://github.com/styled-components/styled-components/issues/1941#issuecomment-417862021\n\n", 11: "_This error was replaced with a dev-time warning, it will be deleted for v4 final._ [createGlobalStyle] received children which will not be rendered. Please use the component without passing children elements.\n\n", 12: "It seems you are interpolating a keyframe declaration (%s) into an untagged string. This was supported in styled-components v3, but is not longer supported in v4 as keyframes are now injected on-demand. Please wrap your string in the css\\`\\` helper which ensures the styles are injected correctly. See https://www.styled-components.com/docs/api#css\n\n", 13: "%s is not a styled component and cannot be referred to via component selector. See https://www.styled-components.com/docs/advanced#referring-to-other-components for more details.\n\n", 14: 'ThemeProvider: "theme" prop is required.\n\n', 15: "A stylis plugin has been supplied that is not named. We need a name for each plugin to be able to prevent styling collisions between different stylis configurations within the same app. Before you pass your plugin to `<StyleSheetManager stylisPlugins={[]}>`, please make sure each plugin is uniquely-named, e.g.\n\n```js\nObject.defineProperty(importedPlugin, 'name', { value: 'some-unique-name' });\n```\n\n", 16: "Reached the limit of how many styled components may be created at group %s.\nYou may only create up to 1,073,741,824 components. If you're creating components dynamically,\nas for instance in your render method then you may be running into this limitation.\n\n", 17: "CSSStyleSheet could not be found on HTMLStyleElement.\nHas styled-components' style tag been unmounted or altered by another script?\n", 18: "ThemeProvider: Please make sure your useTheme hook is within a `<ThemeProvider>`" } : {};
function de$1() {
  for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
  for (var n = e[0], o2 = [], r = 1, s = e.length; r < s; r += 1) o2.push(e[r]);
  return o2.forEach(function(e2) {
    n = n.replace(/%[a-z]/, e2);
  }), n;
}
function he$1(t) {
  for (var n = [], o2 = 1; o2 < arguments.length; o2++) n[o2 - 1] = arguments[o2];
  return "production" === process.env.NODE_ENV ? new Error("An error occurred. See https://github.com/styled-components/styled-components/blob/main/packages/styled-components/src/utils/errors.md#".concat(t, " for more information.").concat(n.length > 0 ? " Args: ".concat(n.join(", ")) : "")) : new Error(de$1.apply(void 0, __spreadArray([pe$1[t]], n, false)).trim());
}
var fe$1 = (function() {
  function e(e2) {
    this.groupSizes = new Uint32Array(512), this.length = 512, this.tag = e2;
  }
  return e.prototype.indexOfGroup = function(e2) {
    for (var t = 0, n = 0; n < e2; n++) t += this.groupSizes[n];
    return t;
  }, e.prototype.insertRules = function(e2, t) {
    if (e2 >= this.groupSizes.length) {
      for (var n = this.groupSizes, o2 = n.length, r = o2; e2 >= r; ) if ((r <<= 1) < 0) throw he$1(16, "".concat(e2));
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
})(), me$1 = 1 << 30, ye$1 = /* @__PURE__ */ new Map(), ve$1 = /* @__PURE__ */ new Map(), ge$1 = 1, Se$1 = function(e) {
  if (ye$1.has(e)) return ye$1.get(e);
  for (; ve$1.has(ge$1); ) ge$1++;
  var t = ge$1++;
  if ("production" !== process.env.NODE_ENV && ((0 | t) < 0 || t > me$1)) throw he$1(16, "".concat(t));
  return ye$1.set(e, t), ve$1.set(t, e), t;
}, we$1 = function(e, t) {
  ge$1 = t + 1, ye$1.set(e, t), ve$1.set(t, e);
}, be$1 = "style[".concat(f, "][").concat(y$1, '="').concat(v$1, '"]'), Ee$1 = new RegExp("^".concat(f, '\\.g(\\d+)\\[id="([\\w\\d-]+)"\\].*?"([^"]*)')), Ne$1 = function(e, t, n) {
  for (var o2, r = n.split(","), s = 0, i = r.length; s < i; s++) (o2 = r[s]) && e.registerName(t, o2);
}, Pe$1 = function(e, t) {
  for (var n, o2 = (null !== (n = t.textContent) && void 0 !== n ? n : "").split(g), r = [], s = 0, i = o2.length; s < i; s++) {
    var a = o2[s].trim();
    if (a) {
      var c = a.match(Ee$1);
      if (c) {
        var l = 0 | parseInt(c[1], 10), u3 = c[2];
        0 !== l && (we$1(u3, l), Ne$1(e, u3, c[3]), e.getTag().insertRules(l, r)), r.length = 0;
      } else r.push(a);
    }
  }
}, _e$1 = function(e) {
  for (var t = document.querySelectorAll(be$1), n = 0, o2 = t.length; n < o2; n++) {
    var r = t[n];
    r && r.getAttribute(f) !== m$1 && (Pe$1(e, r), r.parentNode && r.parentNode.removeChild(r));
  }
};
function Ce$1() {
  return "undefined" != typeof __webpack_nonce__ ? __webpack_nonce__ : null;
}
var Ie$1 = function(e) {
  var t = document.head, n = e || t, o2 = document.createElement("style"), r = (function(e2) {
    var t2 = Array.from(e2.querySelectorAll("style[".concat(f, "]")));
    return t2[t2.length - 1];
  })(n), s = void 0 !== r ? r.nextSibling : null;
  o2.setAttribute(f, m$1), o2.setAttribute(y$1, v$1);
  var i = Ce$1();
  return i && o2.setAttribute("nonce", i), n.insertBefore(o2, s), o2;
}, Ae$1 = (function() {
  function e(e2) {
    this.element = Ie$1(e2), this.element.appendChild(document.createTextNode("")), this.sheet = (function(e3) {
      if (e3.sheet) return e3.sheet;
      for (var t = document.styleSheets, n = 0, o2 = t.length; n < o2; n++) {
        var r = t[n];
        if (r.ownerNode === e3) return r;
      }
      throw he$1(17);
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
})(), Oe$1 = (function() {
  function e(e2) {
    this.element = Ie$1(e2), this.nodes = this.element.childNodes, this.length = 0;
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
})(), De$1 = (function() {
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
})(), Re$1 = S$1, Te$1 = { isServer: !S$1, useCSSOMInjection: !w$1 }, ke$1 = (function() {
  function e(e2, n, o2) {
    void 0 === e2 && (e2 = C$1), void 0 === n && (n = {});
    var r = this;
    this.options = __assign(__assign({}, Te$1), e2), this.gs = n, this.names = new Map(o2), this.server = !!e2.isServer, !this.server && S$1 && Re$1 && (Re$1 = false, _e$1(this)), ue$1(this, function() {
      return (function(e3) {
        for (var t = e3.getTag(), n2 = t.length, o3 = "", r2 = function(n3) {
          var r3 = (function(e4) {
            return ve$1.get(e4);
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
    return Se$1(e2);
  }, e.prototype.rehydrate = function() {
    !this.server && S$1 && _e$1(this);
  }, e.prototype.reconstructWithOptions = function(n, o2) {
    return void 0 === o2 && (o2 = true), new e(__assign(__assign({}, this.options), n), this.gs, o2 && this.names || void 0);
  }, e.prototype.allocateGSInstance = function(e2) {
    return this.gs[e2] = (this.gs[e2] || 0) + 1;
  }, e.prototype.getTag = function() {
    return this.tag || (this.tag = (e2 = (function(e3) {
      var t = e3.useCSSOMInjection, n = e3.target;
      return e3.isServer ? new De$1(n) : t ? new Ae$1(n) : new Oe$1(n);
    })(this.options), new fe$1(e2)));
    var e2;
  }, e.prototype.hasNameForId = function(e2, t) {
    return this.names.has(e2) && this.names.get(e2).has(t);
  }, e.prototype.registerName = function(e2, t) {
    if (Se$1(e2), this.names.has(e2)) this.names.get(e2).add(t);
    else {
      var n = /* @__PURE__ */ new Set();
      n.add(t), this.names.set(e2, n);
    }
  }, e.prototype.insertRules = function(e2, t, n) {
    this.registerName(e2, t), this.getTag().insertRules(Se$1(e2), n);
  }, e.prototype.clearNames = function(e2) {
    this.names.has(e2) && this.names.get(e2).clear();
  }, e.prototype.clearRules = function(e2) {
    this.getTag().clearGroup(Se$1(e2)), this.clearNames(e2);
  }, e.prototype.clearTag = function() {
    this.tag = void 0;
  }, e;
})(), je$1 = /&/g, xe = /^\s*\/\/.*$/gm;
function Ve$1(e, t) {
  return e.map(function(e2) {
    return "rule" === e2.type && (e2.value = "".concat(t, " ").concat(e2.value), e2.value = e2.value.replaceAll(",", ",".concat(t, " ")), e2.props = e2.props.map(function(e3) {
      return "".concat(t, " ").concat(e3);
    })), Array.isArray(e2.children) && "@keyframes" !== e2.type && (e2.children = Ve$1(e2.children, t)), e2;
  });
}
function Fe$1(e) {
  var t, n, o2, r = void 0 === e ? C$1 : e, s = r.options, i = void 0 === s ? C$1 : s, a = r.plugins, c = void 0 === a ? _$1 : a, l = function(e2, o3, r2) {
    return r2.startsWith(n) && r2.endsWith(n) && r2.replaceAll(n, "").length > 0 ? ".".concat(t) : e2;
  }, u3 = c.slice();
  u3.push(function(e2) {
    e2.type === RULESET && e2.value.includes("&") && (e2.props[0] = e2.props[0].replace(je$1, n).replace(o2, l));
  }), i.prefix && u3.push(prefixer), u3.push(stringify);
  var p2 = function(e2, r2, s2, a2) {
    void 0 === r2 && (r2 = ""), void 0 === s2 && (s2 = ""), void 0 === a2 && (a2 = "&"), t = a2, n = r2, o2 = new RegExp("\\".concat(n, "\\b"), "g");
    var c2 = e2.replace(xe, ""), l2 = compile(s2 || r2 ? "".concat(s2, " ").concat(r2, " { ").concat(c2, " }") : c2);
    i.namespace && (l2 = Ve$1(l2, i.namespace));
    var p3 = [];
    return serialize(l2, middleware(u3.concat(rulesheet(function(e3) {
      return p3.push(e3);
    })))), p3;
  };
  return p2.hash = c.length ? c.reduce(function(e2, t2) {
    return t2.name || he$1(15), z$1(e2, t2.name);
  }, F$1).toString() : "", p2;
}
var ze$1 = new ke$1(), Me$1 = Fe$1(), $e$1 = o.createContext({ shouldForwardProp: void 0, styleSheet: ze$1, stylis: Me$1 });
$e$1.Consumer;
var Ge$1 = o.createContext(void 0);
function Le$1() {
  return o.useContext($e$1);
}
function Ye(e) {
  var t = o.useState(e.stylisPlugins), n = t[0], r = t[1], c = Le$1().styleSheet, l = o.useMemo(function() {
    var t2 = c;
    return e.sheet ? t2 = e.sheet : e.target && (t2 = t2.reconstructWithOptions({ target: e.target }, false)), e.disableCSSOMInjection && (t2 = t2.reconstructWithOptions({ useCSSOMInjection: false })), t2;
  }, [e.disableCSSOMInjection, e.sheet, e.target, c]), u3 = o.useMemo(function() {
    return Fe$1({ options: { namespace: e.namespace, prefix: e.enableVendorPrefixes }, plugins: n });
  }, [e.enableVendorPrefixes, e.namespace, n]);
  o.useEffect(function() {
    p(n, e.stylisPlugins) || r(e.stylisPlugins);
  }, [e.stylisPlugins]);
  var d = o.useMemo(function() {
    return { shouldForwardProp: e.shouldForwardProp, styleSheet: l, stylis: u3 };
  }, [e.shouldForwardProp, l, u3]);
  return o.createElement($e$1.Provider, { value: d }, o.createElement(Ge$1.Provider, { value: u3 }, e.children));
}
var qe$1 = (function() {
  function e(e2, t) {
    var n = this;
    this.inject = function(e3, t2) {
      void 0 === t2 && (t2 = Me$1);
      var o2 = n.name + t2.hash;
      e3.hasNameForId(n.id, o2) || e3.insertRules(n.id, o2, t2(n.rules, o2, "@keyframes"));
    }, this.name = e2, this.id = "sc-keyframes-".concat(e2), this.rules = t, ue$1(this, function() {
      throw he$1(12, String(n.name));
    });
  }
  return e.prototype.getName = function(e2) {
    return void 0 === e2 && (e2 = Me$1), this.name + e2.hash;
  }, e;
})(), We$1 = function(e) {
  return e >= "A" && e <= "Z";
};
function He$1(e) {
  for (var t = "", n = 0; n < e.length; n++) {
    var o2 = e[n];
    if (1 === n && "-" === o2 && "-" === e[0]) return e;
    We$1(o2) ? t += "-" + o2.toLowerCase() : t += o2;
  }
  return t.startsWith("ms-") ? "-" + t : t;
}
var Ue$1 = function(e) {
  return null == e || false === e || "" === e;
}, Je$1 = function(t) {
  var n, o2, r = [];
  for (var s in t) {
    var i = t[s];
    t.hasOwnProperty(s) && !Ue$1(i) && (Array.isArray(i) && i.isCss || re$1(i) ? r.push("".concat(He$1(s), ":"), i, ";") : ce$1(i) ? r.push.apply(r, __spreadArray(__spreadArray(["".concat(s, " {")], Je$1(i), false), ["}"], false)) : r.push("".concat(He$1(s), ": ").concat((n = s, null == (o2 = i) || "boolean" == typeof o2 || "" === o2 ? "" : "number" != typeof o2 || 0 === o2 || n in unitlessKeys || n.startsWith("--") ? String(o2).trim() : "".concat(o2, "px")), ";")));
  }
  return r;
};
function Xe$1(e, t, n, o2) {
  if (Ue$1(e)) return [];
  if (se$1(e)) return [".".concat(e.styledComponentId)];
  if (re$1(e)) {
    if (!re$1(s = e) || s.prototype && s.prototype.isReactComponent || !t) return [e];
    var r = e(t);
    return "production" === process.env.NODE_ENV || "object" != typeof r || Array.isArray(r) || r instanceof qe$1 || ce$1(r) || null === r || console.error("".concat(B$1(e), " is not a styled component and cannot be referred to via component selector. See https://www.styled-components.com/docs/advanced#referring-to-other-components for more details.")), Xe$1(r, t, n, o2);
  }
  var s;
  return e instanceof qe$1 ? n ? (e.inject(n, o2), [e.getName(o2)]) : [e] : ce$1(e) ? Je$1(e) : Array.isArray(e) ? Array.prototype.concat.apply(_$1, e.map(function(e2) {
    return Xe$1(e2, t, n, o2);
  })) : [e.toString()];
}
function Ze$1(e) {
  for (var t = 0; t < e.length; t += 1) {
    var n = e[t];
    if (re$1(n) && !se$1(n)) return false;
  }
  return true;
}
var Ke$1 = M$1(v$1), Qe$1 = (function() {
  function e(e2, t, n) {
    this.rules = e2, this.staticRulesId = "", this.isStatic = "production" === process.env.NODE_ENV && (void 0 === n || n.isStatic) && Ze$1(e2), this.componentId = t, this.baseHash = z$1(Ke$1, t), this.baseStyle = n, ke$1.registerId(t);
  }
  return e.prototype.generateAndInjectStyles = function(e2, t, n) {
    var o2 = this.baseStyle ? this.baseStyle.generateAndInjectStyles(e2, t, n) : "";
    if (this.isStatic && !n.hash) if (this.staticRulesId && t.hasNameForId(this.componentId, this.staticRulesId)) o2 = ie$1(o2, this.staticRulesId);
    else {
      var r = ae$1(Xe$1(this.rules, e2, t, n)), s = x$1(z$1(this.baseHash, r) >>> 0);
      if (!t.hasNameForId(this.componentId, s)) {
        var i = n(r, ".".concat(s), void 0, this.componentId);
        t.insertRules(this.componentId, s, i);
      }
      o2 = ie$1(o2, s), this.staticRulesId = s;
    }
    else {
      for (var a = z$1(this.baseHash, n.hash), c = "", l = 0; l < this.rules.length; l++) {
        var u3 = this.rules[l];
        if ("string" == typeof u3) c += u3, "production" !== process.env.NODE_ENV && (a = z$1(a, u3));
        else if (u3) {
          var p2 = ae$1(Xe$1(u3, e2, t, n));
          a = z$1(a, p2 + l), c += p2;
        }
      }
      if (c) {
        var d = x$1(a >>> 0);
        t.hasNameForId(this.componentId, d) || t.insertRules(this.componentId, d, n(c, ".".concat(d), void 0, this.componentId)), o2 = ie$1(o2, d);
      }
    }
    return o2;
  }, e;
})(), et = o.createContext(void 0);
et.Consumer;
var rt = {}, st = /* @__PURE__ */ new Set();
function it(e, r, s) {
  var i = se$1(e), a = e, c = !G$1(e), p2 = r.attrs, d = void 0 === p2 ? _$1 : p2, h2 = r.componentId, f2 = void 0 === h2 ? (function(e2, t) {
    var n = "string" != typeof e2 ? "sc" : R(e2);
    rt[n] = (rt[n] || 0) + 1;
    var o2 = "".concat(n, "-").concat($$1(v$1 + n + rt[n]));
    return t ? "".concat(t, "-").concat(o2) : o2;
  })(r.displayName, r.parentComponentId) : h2, m2 = r.displayName, y2 = void 0 === m2 ? (function(e2) {
    return G$1(e2) ? "styled.".concat(e2) : "Styled(".concat(B$1(e2), ")");
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
  var N2 = new Qe$1(s, g2, i ? a.componentStyle : void 0);
  function O2(e2, r2) {
    return (function(e3, r3, s2) {
      var i2 = e3.attrs, a2 = e3.componentStyle, c2 = e3.defaultProps, p3 = e3.foldedComponentIds, d2 = e3.styledComponentId, h3 = e3.target, f3 = o.useContext(et), m3 = Le$1(), y3 = e3.shouldForwardProp || m3.shouldForwardProp;
      "production" !== process.env.NODE_ENV && o.useDebugValue(d2);
      var v2 = I$1(r3, f3, c2) || C$1, g3 = (function(e4, n, o2) {
        for (var r4, s3 = __assign(__assign({}, n), { className: void 0, theme: o2 }), i3 = 0; i3 < e4.length; i3 += 1) {
          var a3 = re$1(r4 = e4[i3]) ? r4(s3) : r4;
          for (var c3 in a3) s3[c3] = "className" === c3 ? ie$1(s3[c3], a3[c3]) : "style" === c3 ? __assign(__assign({}, s3[c3]), a3[c3]) : a3[c3];
        }
        return n.className && (s3.className = ie$1(s3.className, n.className)), s3;
      })(i2, r3, v2), S3 = g3.as || h3, w3 = {};
      for (var b3 in g3) void 0 === g3[b3] || "$" === b3[0] || "as" === b3 || "theme" === b3 && g3.theme === v2 || ("forwardedAs" === b3 ? w3.as = g3.forwardedAs : y3 && !y3(b3, S3) || (w3[b3] = g3[b3], y3 || "development" !== process.env.NODE_ENV || isPropValid(b3) || st.has(b3) || !A.has(S3) || (st.add(b3), console.warn('styled-components: it looks like an unknown prop "'.concat(b3, '" is being sent through to the DOM, which will likely trigger a React console error. If you would like automatic filtering of unknown props, you can opt-into that behavior via `<StyleSheetManager shouldForwardProp={...}>` (connect an API like `@emotion/is-prop-valid`) or consider using transient props (`$` prefix for automatic filtering.)')))));
      var E3 = (function(e4, t) {
        var n = Le$1(), o$1 = e4.generateAndInjectStyles(t, n.styleSheet, n.stylis);
        return "production" !== process.env.NODE_ENV && o.useDebugValue(o$1), o$1;
      })(a2, g3);
      "production" !== process.env.NODE_ENV && e3.warnTooManyClasses && e3.warnTooManyClasses(E3);
      var N3 = ie$1(p3, d2);
      return E3 && (N3 += " " + E3), g3.className && (N3 += " " + g3.className), w3[G$1(S3) && !A.has(S3) ? "class" : "className"] = N3, s2 && (w3.ref = s2), o.createElement(S3, w3);
    })(D2, e2, r2);
  }
  O2.displayName = y2;
  var D2 = o.forwardRef(O2);
  return D2.attrs = S2, D2.componentStyle = N2, D2.displayName = y2, D2.shouldForwardProp = w2, D2.foldedComponentIds = i ? ie$1(a.foldedComponentIds, a.styledComponentId) : "", D2.styledComponentId = g2, D2.target = i ? a.target : e, Object.defineProperty(D2, "defaultProps", { get: function() {
    return this._foldedDefaultProps;
  }, set: function(e2) {
    this._foldedDefaultProps = i ? (function(e3) {
      for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
      for (var o2 = 0, r2 = t; o2 < r2.length; o2++) le$1(e3, r2[o2], true);
      return e3;
    })({}, a.defaultProps, e2) : e2;
  } }), "production" !== process.env.NODE_ENV && (P$1(y2, g2), D2.warnTooManyClasses = /* @__PURE__ */ (function(e2, t) {
    var n = {}, o2 = false;
    return function(r2) {
      if (!o2 && (n[r2] = true, Object.keys(n).length >= 200)) {
        var s2 = t ? ' with the id of "'.concat(t, '"') : "";
        console.warn("Over ".concat(200, " classes were generated for component ").concat(e2).concat(s2, ".\n") + "Consider using the attrs method, together with a style object for frequently changed styles.\nExample:\n  const Component = styled.div.attrs(props => ({\n    style: {\n      background: props.background,\n    },\n  }))`width: 100%;`\n\n  <Component />"), o2 = true, n = {};
      }
    };
  })(y2, g2)), ue$1(D2, function() {
    return ".".concat(D2.styledComponentId);
  }), c && oe$1(D2, e, { attrs: true, componentStyle: true, displayName: true, foldedComponentIds: true, shouldForwardProp: true, styledComponentId: true, target: true }), D2;
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
  if (re$1(t) || ce$1(t)) return ct(Xe$1(at(_$1, __spreadArray([t], n, true))));
  var r = t;
  return 0 === n.length && 1 === r.length && "string" == typeof r[0] ? Xe$1(r) : ct(Xe$1(at(r, n)));
}
function ut(n, o2, r) {
  if (void 0 === r && (r = C$1), !o2) throw he$1(1, o2);
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
      var n = Ce$1(), o2 = ae$1([n && 'nonce="'.concat(n, '"'), "".concat(f, '="true"'), "".concat(y$1, '="').concat(v$1, '"')].filter(Boolean), " ");
      return "<style ".concat(o2, ">").concat(t, "</style>");
    }, this.getStyleTags = function() {
      if (e2.sealed) throw he$1(2);
      return e2._emitSheetCSS();
    }, this.getStyleElement = function() {
      var n;
      if (e2.sealed) throw he$1(2);
      var r = e2.instance.toString();
      if (!r) return [];
      var s = ((n = {})[f] = "", n[y$1] = v$1, n.dangerouslySetInnerHTML = { __html: r }, n), i = Ce$1();
      return i && (s.nonce = i), [o.createElement("style", __assign({}, s, { key: "sc-0-0" }))];
    }, this.seal = function() {
      e2.sealed = true;
    }, this.instance = new ke$1({ isServer: true }), this.sealed = false;
  }
  return e.prototype.collectStyles = function(e2) {
    if (this.sealed) throw he$1(2);
    return o.createElement(Ye, { sheet: this.instance }, e2);
  }, e.prototype.interleaveWithNodeStream = function(e2) {
    if (S$1) throw he$1(3);
    if (this.sealed) throw he$1(2);
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
const CSS_RESET = "<style>*,*::before,*::after{box-sizing:border-box}html,body{margin:0;padding:0}body{-webkit-font-smoothing:antialiased}</style>";
const TOKENS_CSS_HREF = "https://unpkg.com/@jsonresume/core/dist/tokens.css";
const FONTS_PRECONNECT = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
function isHref(value) {
  return /^(https?:)?\/\//.test(value) || value.trim().startsWith("<link");
}
function familyParam(family) {
  const [name, ...rest] = String(family).split(":");
  const encodedName = name.trim().replace(/\s+/g, "+");
  return rest.length ? `${encodedName}:${rest.join(":")}` : encodedName;
}
function googleFontsLinks(families) {
  if (!Array.isArray(families) || families.length === 0) return "";
  const passthrough = [];
  const names = [];
  for (const entry of families) {
    if (entry == null || entry === "") continue;
    if (isHref(entry)) passthrough.push(entry);
    else names.push(entry);
  }
  const links = passthrough.map(
    (href) => href.trim().startsWith("<link") ? href : `<link href="${href}" rel="stylesheet">`
  );
  if (names.length > 0) {
    const query = names.map(familyParam).join("&family=");
    links.unshift(
      `<link href="https://fonts.googleapis.com/css2?family=${query}&display=swap" rel="stylesheet">`
    );
  }
  if (links.length === 0) return "";
  return FONTS_PRECONNECT + links.join("");
}
function renderResumeDocument(element, options = {}) {
  const {
    fonts,
    title,
    lang = "en",
    dir = "ltr",
    reset = false,
    head = "",
    headAfterStyles = "",
    includeTokensCss = true,
    bodyClass
  } = options;
  const sheet = new gt();
  let html;
  let styleTags;
  try {
    html = server.renderToStaticMarkup(sheet.collectStyles(element));
    styleTags = sheet.getStyleTags();
  } finally {
    sheet.seal();
  }
  const fontLinks = googleFontsLinks(fonts);
  const tokensLink = includeTokensCss ? `<link rel="stylesheet" href="${TOKENS_CSS_HREF}">` : "";
  const resetTag = reset ? CSS_RESET : "";
  const titleTag = title ? `<title>${title}</title>` : "";
  const bodyAttr = bodyClass ? ` class="${bodyClass}"` : "";
  return `<!DOCTYPE html><html lang="${lang}" dir="${dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">` + fontLinks + tokensLink + resetTag + head + styleTags + headAfterStyles + titleTag + `</head><body${bodyAttr}>${html}</body></html>`;
}
const Section = dt.div`
  max-width: 700px;
  margin: 0 auto 18px;

  h2 {
    margin: 0;
    padding: 0;
    margin-bottom: 3px;
    font-weight: 600;
  }

  hr {
    margin: 0;
    padding: 0;
    margin-top: 7px;
    margin-bottom: 3px;
  }
`;
const Container$2 = dt.div`
  margin: 0 8px;
`;
const SectionComponent = ({ children, title }) => {
  return /* @__PURE__ */ jsxRuntime.jsxs(Section, { children: [
    title && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsx("h2", { children: title }),
      /* @__PURE__ */ jsxRuntime.jsx("hr", {})
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(Container$2, { children })
  ] });
};
function L() {
  return { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
}
var T = L();
function G(u3) {
  T = u3;
}
var I = { exec: () => null };
function h(u3, e = "") {
  let t = typeof u3 == "string" ? u3 : u3.source, n = { replace: (r, i) => {
    let s = typeof i == "string" ? i : i.source;
    return s = s.replace(m.caret, "$1"), t = t.replace(r, s), n;
  }, getRegex: () => new RegExp(t, e) };
  return n;
}
var m = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceTabs: /^\t+/, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] /, listReplaceTask: /^\[[ xX]\] +/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (u3) => new RegExp(`^( {0,3}${u3})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}#`), htmlBeginRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}<(?:[a-z].*>|!--)`, "i") }, be = /^(?:[ \t]*(?:\n|$))+/, Re = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Te = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, E = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Oe = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, F = /(?:[*+-]|\d{1,9}[.)])/, ie = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, oe = h(ie).replace(/bull/g, F).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), we = h(ie).replace(/bull/g, F).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), j = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, ye = /^[^\n]+/, Q = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Pe = h(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Q).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Se = h(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, F).getRegex(), v = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", U = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, $e = h("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", U).replace("tag", v).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), ae = h(j).replace("hr", E).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex(), _e = h(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", ae).getRegex(), K = { blockquote: _e, code: Re, def: Pe, fences: Te, heading: Oe, hr: E, html: $e, lheading: oe, list: Se, newline: be, paragraph: ae, table: I, text: ye }, re = h("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", E).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex(), Le = { ...K, lheading: we, table: re, paragraph: h(j).replace("hr", E).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", re).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex() }, Me = { ...K, html: h(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", U).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: I, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: h(j).replace("hr", E).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", oe).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, ze = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Ae = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, le = /^( {2,}|\\)\n(?!\s*$)/, Ie = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, D = /[\p{P}\p{S}]/u, W = /[\s\p{P}\p{S}]/u, ue = /[^\s\p{P}\p{S}]/u, Ee = h(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, W).getRegex(), pe = /(?!~)[\p{P}\p{S}]/u, Ce = /(?!~)[\s\p{P}\p{S}]/u, Be = /(?:[^\s\p{P}\p{S}]|~)/u, qe = h(/link|code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<!`)(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("code", /(?<!`)(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), ce = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, ve = h(ce, "u").replace(/punct/g, D).getRegex(), De = h(ce, "u").replace(/punct/g, pe).getRegex(), he = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", He = h(he, "gu").replace(/notPunctSpace/g, ue).replace(/punctSpace/g, W).replace(/punct/g, D).getRegex(), Ze = h(he, "gu").replace(/notPunctSpace/g, Be).replace(/punctSpace/g, Ce).replace(/punct/g, pe).getRegex(), Ge = h("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, ue).replace(/punctSpace/g, W).replace(/punct/g, D).getRegex(), Ne = h(/\\(punct)/, "gu").replace(/punct/g, D).getRegex(), Fe = h(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), je = h(U).replace("(?:-->|$)", "-->").getRegex(), Qe = h("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", je).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), q = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, Ue = h(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", q).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), de = h(/^!?\[(label)\]\[(ref)\]/).replace("label", q).replace("ref", Q).getRegex(), ke = h(/^!?\[(ref)\](?:\[\])?/).replace("ref", Q).getRegex(), Ke = h("reflink|nolink(?!\\()", "g").replace("reflink", de).replace("nolink", ke).getRegex(), se = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, X = { _backpedal: I, anyPunctuation: Ne, autolink: Fe, blockSkip: qe, br: le, code: Ae, del: I, emStrongLDelim: ve, emStrongRDelimAst: He, emStrongRDelimUnd: Ge, escape: ze, link: Ue, nolink: ke, punctuation: Ee, reflink: de, reflinkSearch: Ke, tag: Qe, text: Ie, url: I }, We = { ...X, link: h(/^!?\[(label)\]\((.*?)\)/).replace("label", q).getRegex(), reflink: h(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", q).getRegex() }, N = { ...X, emStrongRDelimAst: Ze, emStrongLDelim: De, url: h(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", se).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: h(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", se).getRegex() }, Xe = { ...N, br: h(le).replace("{2,}", "*").getRegex(), text: h(N.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, C = { normal: K, gfm: Le, pedantic: Me }, M = { normal: X, gfm: N, breaks: Xe, pedantic: We };
var Je = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, ge = (u3) => Je[u3];
function w(u3, e) {
  if (e) {
    if (m.escapeTest.test(u3)) return u3.replace(m.escapeReplace, ge);
  } else if (m.escapeTestNoEncode.test(u3)) return u3.replace(m.escapeReplaceNoEncode, ge);
  return u3;
}
function J(u3) {
  try {
    u3 = encodeURI(u3).replace(m.percentDecode, "%");
  } catch {
    return null;
  }
  return u3;
}
function V(u3, e) {
  let t = u3.replace(m.findPipe, (i, s, o2) => {
    let a = false, l = s;
    for (; --l >= 0 && o2[l] === "\\"; ) a = !a;
    return a ? "|" : " |";
  }), n = t.split(m.splitPipe), r = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e) if (n.length > e) n.splice(e);
  else for (; n.length < e; ) n.push("");
  for (; r < n.length; r++) n[r] = n[r].trim().replace(m.slashPipe, "|");
  return n;
}
function z(u3, e, t) {
  let n = u3.length;
  if (n === 0) return "";
  let r = 0;
  for (; r < n; ) {
    let i = u3.charAt(n - r - 1);
    if (i === e && true) r++;
    else break;
  }
  return u3.slice(0, n - r);
}
function fe(u3, e) {
  if (u3.indexOf(e[1]) === -1) return -1;
  let t = 0;
  for (let n = 0; n < u3.length; n++) if (u3[n] === "\\") n++;
  else if (u3[n] === e[0]) t++;
  else if (u3[n] === e[1] && (t--, t < 0)) return n;
  return t > 0 ? -2 : -1;
}
function me(u3, e, t, n, r) {
  let i = e.href, s = e.title || null, o2 = u3[1].replace(r.other.outputLinkReplace, "$1");
  n.state.inLink = true;
  let a = { type: u3[0].charAt(0) === "!" ? "image" : "link", raw: t, href: i, title: s, text: o2, tokens: n.inlineTokens(o2) };
  return n.state.inLink = false, a;
}
function Ve(u3, e, t) {
  let n = u3.match(t.other.indentCodeCompensation);
  if (n === null) return e;
  let r = n[1];
  return e.split(`
`).map((i) => {
    let s = i.match(t.other.beginningSpace);
    if (s === null) return i;
    let [o2] = s;
    return o2.length >= r.length ? i.slice(r.length) : i;
  }).join(`
`);
}
var y = class {
  options;
  rules;
  lexer;
  constructor(e) {
    this.options = e || T;
  }
  space(e) {
    let t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0) return { type: "space", raw: t[0] };
  }
  code(e) {
    let t = this.rules.block.code.exec(e);
    if (t) {
      let n = t[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : z(n, `
`) };
    }
  }
  fences(e) {
    let t = this.rules.block.fences.exec(e);
    if (t) {
      let n = t[0], r = Ve(n, t[3] || "", this.rules);
      return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: r };
    }
  }
  heading(e) {
    let t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let r = z(n, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (n = r.trim());
      }
      return { type: "heading", raw: t[0], depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t) return { type: "hr", raw: z(t[0], `
`) };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = z(t[0], `
`).split(`
`), r = "", i = "", s = [];
      for (; n.length > 0; ) {
        let o2 = false, a = [], l;
        for (l = 0; l < n.length; l++) if (this.rules.other.blockquoteStart.test(n[l])) a.push(n[l]), o2 = true;
        else if (!o2) a.push(n[l]);
        else break;
        n = n.slice(l);
        let c = a.join(`
`), p2 = c.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${c}` : c, i = i ? `${i}
${p2}` : p2;
        let g2 = this.lexer.state.top;
        if (this.lexer.state.top = true, this.lexer.blockTokens(p2, s, true), this.lexer.state.top = g2, n.length === 0) break;
        let d = s.at(-1);
        if (d?.type === "code") break;
        if (d?.type === "blockquote") {
          let R2 = d, f2 = R2.raw + `
` + n.join(`
`), O2 = this.blockquote(f2);
          s[s.length - 1] = O2, r = r.substring(0, r.length - R2.raw.length) + O2.raw, i = i.substring(0, i.length - R2.text.length) + O2.text;
          break;
        } else if (d?.type === "list") {
          let R2 = d, f2 = R2.raw + `
` + n.join(`
`), O2 = this.list(f2);
          s[s.length - 1] = O2, r = r.substring(0, r.length - d.raw.length) + O2.raw, i = i.substring(0, i.length - R2.raw.length) + O2.raw, n = f2.substring(s.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: r, tokens: s, text: i };
    }
  }
  list(e) {
    let t = this.rules.block.list.exec(e);
    if (t) {
      let n = t[1].trim(), r = n.length > 1, i = { type: "list", raw: "", ordered: r, start: r ? +n.slice(0, -1) : "", loose: false, items: [] };
      n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
      let s = this.rules.other.listItemRegex(n), o2 = false;
      for (; e; ) {
        let l = false, c = "", p2 = "";
        if (!(t = s.exec(e)) || this.rules.block.hr.test(e)) break;
        c = t[0], e = e.substring(c.length);
        let g2 = t[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (H2) => " ".repeat(3 * H2.length)), d = e.split(`
`, 1)[0], R2 = !g2.trim(), f2 = 0;
        if (this.options.pedantic ? (f2 = 2, p2 = g2.trimStart()) : R2 ? f2 = t[1].length + 1 : (f2 = t[2].search(this.rules.other.nonSpaceChar), f2 = f2 > 4 ? 1 : f2, p2 = g2.slice(f2), f2 += t[1].length), R2 && this.rules.other.blankLine.test(d) && (c += d + `
`, e = e.substring(d.length + 1), l = true), !l) {
          let H2 = this.rules.other.nextBulletRegex(f2), ee2 = this.rules.other.hrRegex(f2), te2 = this.rules.other.fencesBeginRegex(f2), ne2 = this.rules.other.headingBeginRegex(f2), xe2 = this.rules.other.htmlBeginRegex(f2);
          for (; e; ) {
            let Z2 = e.split(`
`, 1)[0], A2;
            if (d = Z2, this.options.pedantic ? (d = d.replace(this.rules.other.listReplaceNesting, "  "), A2 = d) : A2 = d.replace(this.rules.other.tabCharGlobal, "    "), te2.test(d) || ne2.test(d) || xe2.test(d) || H2.test(d) || ee2.test(d)) break;
            if (A2.search(this.rules.other.nonSpaceChar) >= f2 || !d.trim()) p2 += `
` + A2.slice(f2);
            else {
              if (R2 || g2.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || te2.test(g2) || ne2.test(g2) || ee2.test(g2)) break;
              p2 += `
` + d;
            }
            !R2 && !d.trim() && (R2 = true), c += Z2 + `
`, e = e.substring(Z2.length + 1), g2 = A2.slice(f2);
          }
        }
        i.loose || (o2 ? i.loose = true : this.rules.other.doubleBlankLine.test(c) && (o2 = true));
        let O2 = null, Y2;
        this.options.gfm && (O2 = this.rules.other.listIsTask.exec(p2), O2 && (Y2 = O2[0] !== "[ ] ", p2 = p2.replace(this.rules.other.listReplaceTask, ""))), i.items.push({ type: "list_item", raw: c, task: !!O2, checked: Y2, loose: false, text: p2, tokens: [] }), i.raw += c;
      }
      let a = i.items.at(-1);
      if (a) a.raw = a.raw.trimEnd(), a.text = a.text.trimEnd();
      else return;
      i.raw = i.raw.trimEnd();
      for (let l = 0; l < i.items.length; l++) if (this.lexer.state.top = false, i.items[l].tokens = this.lexer.blockTokens(i.items[l].text, []), !i.loose) {
        let c = i.items[l].tokens.filter((g2) => g2.type === "space"), p2 = c.length > 0 && c.some((g2) => this.rules.other.anyLine.test(g2.raw));
        i.loose = p2;
      }
      if (i.loose) for (let l = 0; l < i.items.length; l++) i.items[l].loose = true;
      return i;
    }
  }
  html(e) {
    let t = this.rules.block.html.exec(e);
    if (t) return { type: "html", block: true, raw: t[0], pre: t[1] === "pre" || t[1] === "script" || t[1] === "style", text: t[0] };
  }
  def(e) {
    let t = this.rules.block.def.exec(e);
    if (t) {
      let n = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
      return { type: "def", tag: n, raw: t[0], href: r, title: i };
    }
  }
  table(e) {
    let t = this.rules.block.table.exec(e);
    if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
    let n = V(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], s = { type: "table", raw: t[0], header: [], align: [], rows: [] };
    if (n.length === r.length) {
      for (let o2 of r) this.rules.other.tableAlignRight.test(o2) ? s.align.push("right") : this.rules.other.tableAlignCenter.test(o2) ? s.align.push("center") : this.rules.other.tableAlignLeft.test(o2) ? s.align.push("left") : s.align.push(null);
      for (let o2 = 0; o2 < n.length; o2++) s.header.push({ text: n[o2], tokens: this.lexer.inline(n[o2]), header: true, align: s.align[o2] });
      for (let o2 of i) s.rows.push(V(o2, s.header.length).map((a, l) => ({ text: a, tokens: this.lexer.inline(a), header: false, align: s.align[l] })));
      return s;
    }
  }
  lheading(e) {
    let t = this.rules.block.lheading.exec(e);
    if (t) return { type: "heading", raw: t[0], depth: t[2].charAt(0) === "=" ? 1 : 2, text: t[1], tokens: this.lexer.inline(t[1]) };
  }
  paragraph(e) {
    let t = this.rules.block.paragraph.exec(e);
    if (t) {
      let n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
      return { type: "paragraph", raw: t[0], text: n, tokens: this.lexer.inline(n) };
    }
  }
  text(e) {
    let t = this.rules.block.text.exec(e);
    if (t) return { type: "text", raw: t[0], text: t[0], tokens: this.lexer.inline(t[0]) };
  }
  escape(e) {
    let t = this.rules.inline.escape.exec(e);
    if (t) return { type: "escape", raw: t[0], text: t[1] };
  }
  tag(e) {
    let t = this.rules.inline.tag.exec(e);
    if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = true : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = false), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = true : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = false), { type: "html", raw: t[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: false, text: t[0] };
  }
  link(e) {
    let t = this.rules.inline.link.exec(e);
    if (t) {
      let n = t[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
        if (!this.rules.other.endAngleBracket.test(n)) return;
        let s = z(n.slice(0, -1), "\\");
        if ((n.length - s.length) % 2 === 0) return;
      } else {
        let s = fe(t[2], "()");
        if (s === -2) return;
        if (s > -1) {
          let a = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + s;
          t[2] = t[2].substring(0, s), t[0] = t[0].substring(0, a).trim(), t[3] = "";
        }
      }
      let r = t[2], i = "";
      if (this.options.pedantic) {
        let s = this.rules.other.pedanticHrefTitle.exec(r);
        s && (r = s[1], i = s[3]);
      } else i = t[3] ? t[3].slice(1, -1) : "";
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? r = r.slice(1) : r = r.slice(1, -1)), me(t, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: i && i.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
    }
  }
  reflink(e, t) {
    let n;
    if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
      let r = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), i = t[r.toLowerCase()];
      if (!i) {
        let s = n[0].charAt(0);
        return { type: "text", raw: s, text: s };
      }
      return me(n, i, n[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, n = "") {
    let r = this.rules.inline.emStrongLDelim.exec(e);
    if (!r || r[3] && n.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(r[1] || r[2] || "") || !n || this.rules.inline.punctuation.exec(n)) {
      let s = [...r[0]].length - 1, o2, a, l = s, c = 0, p2 = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (p2.lastIndex = 0, t = t.slice(-1 * e.length + s); (r = p2.exec(t)) != null; ) {
        if (o2 = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !o2) continue;
        if (a = [...o2].length, r[3] || r[4]) {
          l += a;
          continue;
        } else if ((r[5] || r[6]) && s % 3 && !((s + a) % 3)) {
          c += a;
          continue;
        }
        if (l -= a, l > 0) continue;
        a = Math.min(a, a + l + c);
        let g2 = [...r[0]][0].length, d = e.slice(0, s + r.index + g2 + a);
        if (Math.min(s, a) % 2) {
          let f2 = d.slice(1, -1);
          return { type: "em", raw: d, text: f2, tokens: this.lexer.inlineTokens(f2) };
        }
        let R2 = d.slice(2, -2);
        return { type: "strong", raw: d, text: R2, tokens: this.lexer.inlineTokens(R2) };
      }
    }
  }
  codespan(e) {
    let t = this.rules.inline.code.exec(e);
    if (t) {
      let n = t[2].replace(this.rules.other.newLineCharGlobal, " "), r = this.rules.other.nonSpaceChar.test(n), i = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
      return r && i && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: t[0], text: n };
    }
  }
  br(e) {
    let t = this.rules.inline.br.exec(e);
    if (t) return { type: "br", raw: t[0] };
  }
  del(e) {
    let t = this.rules.inline.del.exec(e);
    if (t) return { type: "del", raw: t[0], text: t[2], tokens: this.lexer.inlineTokens(t[2]) };
  }
  autolink(e) {
    let t = this.rules.inline.autolink.exec(e);
    if (t) {
      let n, r;
      return t[2] === "@" ? (n = t[1], r = "mailto:" + n) : (n = t[1], r = n), { type: "link", raw: t[0], text: n, href: r, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  url(e) {
    let t;
    if (t = this.rules.inline.url.exec(e)) {
      let n, r;
      if (t[2] === "@") n = t[0], r = "mailto:" + n;
      else {
        let i;
        do
          i = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
        while (i !== t[0]);
        n = t[0], t[1] === "www." ? r = "http://" + t[0] : r = t[0];
      }
      return { type: "link", raw: t[0], text: n, href: r, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  inlineText(e) {
    let t = this.rules.inline.text.exec(e);
    if (t) {
      let n = this.lexer.state.inRawBlock;
      return { type: "text", raw: t[0], text: t[0], escaped: n };
    }
  }
};
var x = class u {
  tokens;
  options;
  state;
  tokenizer;
  inlineQueue;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || T, this.options.tokenizer = this.options.tokenizer || new y(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: false, inRawBlock: false, top: true };
    let t = { other: m, block: C.normal, inline: M.normal };
    this.options.pedantic ? (t.block = C.pedantic, t.inline = M.pedantic) : this.options.gfm && (t.block = C.gfm, this.options.breaks ? t.inline = M.breaks : t.inline = M.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: C, inline: M };
  }
  static lex(e, t) {
    return new u(t).lex(e);
  }
  static lexInline(e, t) {
    return new u(t).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(m.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      let n = this.inlineQueue[t];
      this.inlineTokens(n.src, n.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], n = false) {
    for (this.options.pedantic && (e = e.replace(m.tabCharGlobal, "    ").replace(m.spaceLine, "")); e; ) {
      let r;
      if (this.options.extensions?.block?.some((s) => (r = s.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), true) : false)) continue;
      if (r = this.tokenizer.space(e)) {
        e = e.substring(r.raw.length);
        let s = t.at(-1);
        r.raw.length === 1 && s !== void 0 ? s.raw += `
` : t.push(r);
        continue;
      }
      if (r = this.tokenizer.code(e)) {
        e = e.substring(r.raw.length);
        let s = t.at(-1);
        s?.type === "paragraph" || s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.at(-1).src = s.text) : t.push(r);
        continue;
      }
      if (r = this.tokenizer.fences(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.heading(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.hr(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.blockquote(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.list(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.html(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.def(e)) {
        e = e.substring(r.raw.length);
        let s = t.at(-1);
        s?.type === "paragraph" || s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.raw, this.inlineQueue.at(-1).src = s.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = { href: r.href, title: r.title }, t.push(r));
        continue;
      }
      if (r = this.tokenizer.table(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.lheading(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      let i = e;
      if (this.options.extensions?.startBlock) {
        let s = 1 / 0, o2 = e.slice(1), a;
        this.options.extensions.startBlock.forEach((l) => {
          a = l.call({ lexer: this }, o2), typeof a == "number" && a >= 0 && (s = Math.min(s, a));
        }), s < 1 / 0 && s >= 0 && (i = e.substring(0, s + 1));
      }
      if (this.state.top && (r = this.tokenizer.paragraph(i))) {
        let s = t.at(-1);
        n && s?.type === "paragraph" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : t.push(r), n = i.length !== e.length, e = e.substring(r.raw.length);
        continue;
      }
      if (r = this.tokenizer.text(e)) {
        e = e.substring(r.raw.length);
        let s = t.at(-1);
        s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : t.push(r);
        continue;
      }
      if (e) {
        let s = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(s);
          break;
        } else throw new Error(s);
      }
    }
    return this.state.top = true, t;
  }
  inline(e, t = []) {
    return this.inlineQueue.push({ src: e, tokens: t }), t;
  }
  inlineTokens(e, t = []) {
    let n = e, r = null;
    if (this.tokens.links) {
      let o2 = Object.keys(this.tokens.links);
      if (o2.length > 0) for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null; ) o2.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null; ) n = n.slice(0, r.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; (r = this.tokenizer.rules.inline.blockSkip.exec(n)) != null; ) n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
    let i = false, s = "";
    for (; e; ) {
      i || (s = ""), i = false;
      let o2;
      if (this.options.extensions?.inline?.some((l) => (o2 = l.call({ lexer: this }, e, t)) ? (e = e.substring(o2.raw.length), t.push(o2), true) : false)) continue;
      if (o2 = this.tokenizer.escape(e)) {
        e = e.substring(o2.raw.length), t.push(o2);
        continue;
      }
      if (o2 = this.tokenizer.tag(e)) {
        e = e.substring(o2.raw.length), t.push(o2);
        continue;
      }
      if (o2 = this.tokenizer.link(e)) {
        e = e.substring(o2.raw.length), t.push(o2);
        continue;
      }
      if (o2 = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(o2.raw.length);
        let l = t.at(-1);
        o2.type === "text" && l?.type === "text" ? (l.raw += o2.raw, l.text += o2.text) : t.push(o2);
        continue;
      }
      if (o2 = this.tokenizer.emStrong(e, n, s)) {
        e = e.substring(o2.raw.length), t.push(o2);
        continue;
      }
      if (o2 = this.tokenizer.codespan(e)) {
        e = e.substring(o2.raw.length), t.push(o2);
        continue;
      }
      if (o2 = this.tokenizer.br(e)) {
        e = e.substring(o2.raw.length), t.push(o2);
        continue;
      }
      if (o2 = this.tokenizer.del(e)) {
        e = e.substring(o2.raw.length), t.push(o2);
        continue;
      }
      if (o2 = this.tokenizer.autolink(e)) {
        e = e.substring(o2.raw.length), t.push(o2);
        continue;
      }
      if (!this.state.inLink && (o2 = this.tokenizer.url(e))) {
        e = e.substring(o2.raw.length), t.push(o2);
        continue;
      }
      let a = e;
      if (this.options.extensions?.startInline) {
        let l = 1 / 0, c = e.slice(1), p2;
        this.options.extensions.startInline.forEach((g2) => {
          p2 = g2.call({ lexer: this }, c), typeof p2 == "number" && p2 >= 0 && (l = Math.min(l, p2));
        }), l < 1 / 0 && l >= 0 && (a = e.substring(0, l + 1));
      }
      if (o2 = this.tokenizer.inlineText(a)) {
        e = e.substring(o2.raw.length), o2.raw.slice(-1) !== "_" && (s = o2.raw.slice(-1)), i = true;
        let l = t.at(-1);
        l?.type === "text" ? (l.raw += o2.raw, l.text += o2.text) : t.push(o2);
        continue;
      }
      if (e) {
        let l = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(l);
          break;
        } else throw new Error(l);
      }
    }
    return t;
  }
};
var P = class {
  options;
  parser;
  constructor(e) {
    this.options = e || T;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    let r = (t || "").match(m.notSpaceStart)?.[0], i = e.replace(m.endingNewline, "") + `
`;
    return r ? '<pre><code class="language-' + w(r) + '">' + (n ? i : w(i, true)) + `</code></pre>
` : "<pre><code>" + (n ? i : w(i, true)) + `</code></pre>
`;
  }
  blockquote({ tokens: e }) {
    return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
  }
  html({ text: e }) {
    return e;
  }
  def(e) {
    return "";
  }
  heading({ tokens: e, depth: t }) {
    return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
  }
  hr(e) {
    return `<hr>
`;
  }
  list(e) {
    let t = e.ordered, n = e.start, r = "";
    for (let o2 = 0; o2 < e.items.length; o2++) {
      let a = e.items[o2];
      r += this.listitem(a);
    }
    let i = t ? "ol" : "ul", s = t && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + i + s + `>
` + r + "</" + i + `>
`;
  }
  listitem(e) {
    let t = "";
    if (e.task) {
      let n = this.checkbox({ checked: !!e.checked });
      e.loose ? e.tokens[0]?.type === "paragraph" ? (e.tokens[0].text = n + " " + e.tokens[0].text, e.tokens[0].tokens && e.tokens[0].tokens.length > 0 && e.tokens[0].tokens[0].type === "text" && (e.tokens[0].tokens[0].text = n + " " + w(e.tokens[0].tokens[0].text), e.tokens[0].tokens[0].escaped = true)) : e.tokens.unshift({ type: "text", raw: n + " ", text: n + " ", escaped: true }) : t += n + " ";
    }
    return t += this.parser.parse(e.tokens, !!e.loose), `<li>${t}</li>
`;
  }
  checkbox({ checked: e }) {
    return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens: e }) {
    return `<p>${this.parser.parseInline(e)}</p>
`;
  }
  table(e) {
    let t = "", n = "";
    for (let i = 0; i < e.header.length; i++) n += this.tablecell(e.header[i]);
    t += this.tablerow({ text: n });
    let r = "";
    for (let i = 0; i < e.rows.length; i++) {
      let s = e.rows[i];
      n = "";
      for (let o2 = 0; o2 < s.length; o2++) n += this.tablecell(s[o2]);
      r += this.tablerow({ text: n });
    }
    return r && (r = `<tbody>${r}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + r + `</table>
`;
  }
  tablerow({ text: e }) {
    return `<tr>
${e}</tr>
`;
  }
  tablecell(e) {
    let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
    return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
  }
  strong({ tokens: e }) {
    return `<strong>${this.parser.parseInline(e)}</strong>`;
  }
  em({ tokens: e }) {
    return `<em>${this.parser.parseInline(e)}</em>`;
  }
  codespan({ text: e }) {
    return `<code>${w(e, true)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    let r = this.parser.parseInline(n), i = J(e);
    if (i === null) return r;
    e = i;
    let s = '<a href="' + e + '"';
    return t && (s += ' title="' + w(t) + '"'), s += ">" + r + "</a>", s;
  }
  image({ href: e, title: t, text: n, tokens: r }) {
    r && (n = this.parser.parseInline(r, this.parser.textRenderer));
    let i = J(e);
    if (i === null) return w(n);
    e = i;
    let s = `<img src="${e}" alt="${n}"`;
    return t && (s += ` title="${w(t)}"`), s += ">", s;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : w(e.text);
  }
};
var $ = class {
  strong({ text: e }) {
    return e;
  }
  em({ text: e }) {
    return e;
  }
  codespan({ text: e }) {
    return e;
  }
  del({ text: e }) {
    return e;
  }
  html({ text: e }) {
    return e;
  }
  text({ text: e }) {
    return e;
  }
  link({ text: e }) {
    return "" + e;
  }
  image({ text: e }) {
    return "" + e;
  }
  br() {
    return "";
  }
};
var b = class u2 {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || T, this.options.renderer = this.options.renderer || new P(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new $();
  }
  static parse(e, t) {
    return new u2(t).parse(e);
  }
  static parseInline(e, t) {
    return new u2(t).parseInline(e);
  }
  parse(e, t = true) {
    let n = "";
    for (let r = 0; r < e.length; r++) {
      let i = e[r];
      if (this.options.extensions?.renderers?.[i.type]) {
        let o2 = i, a = this.options.extensions.renderers[o2.type].call({ parser: this }, o2);
        if (a !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(o2.type)) {
          n += a || "";
          continue;
        }
      }
      let s = i;
      switch (s.type) {
        case "space": {
          n += this.renderer.space(s);
          continue;
        }
        case "hr": {
          n += this.renderer.hr(s);
          continue;
        }
        case "heading": {
          n += this.renderer.heading(s);
          continue;
        }
        case "code": {
          n += this.renderer.code(s);
          continue;
        }
        case "table": {
          n += this.renderer.table(s);
          continue;
        }
        case "blockquote": {
          n += this.renderer.blockquote(s);
          continue;
        }
        case "list": {
          n += this.renderer.list(s);
          continue;
        }
        case "html": {
          n += this.renderer.html(s);
          continue;
        }
        case "def": {
          n += this.renderer.def(s);
          continue;
        }
        case "paragraph": {
          n += this.renderer.paragraph(s);
          continue;
        }
        case "text": {
          let o2 = s, a = this.renderer.text(o2);
          for (; r + 1 < e.length && e[r + 1].type === "text"; ) o2 = e[++r], a += `
` + this.renderer.text(o2);
          t ? n += this.renderer.paragraph({ type: "paragraph", raw: a, text: a, tokens: [{ type: "text", raw: a, text: a, escaped: true }] }) : n += a;
          continue;
        }
        default: {
          let o2 = 'Token with "' + s.type + '" type was not found.';
          if (this.options.silent) return console.error(o2), "";
          throw new Error(o2);
        }
      }
    }
    return n;
  }
  parseInline(e, t = this.renderer) {
    let n = "";
    for (let r = 0; r < e.length; r++) {
      let i = e[r];
      if (this.options.extensions?.renderers?.[i.type]) {
        let o2 = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (o2 !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
          n += o2 || "";
          continue;
        }
      }
      let s = i;
      switch (s.type) {
        case "escape": {
          n += t.text(s);
          break;
        }
        case "html": {
          n += t.html(s);
          break;
        }
        case "link": {
          n += t.link(s);
          break;
        }
        case "image": {
          n += t.image(s);
          break;
        }
        case "strong": {
          n += t.strong(s);
          break;
        }
        case "em": {
          n += t.em(s);
          break;
        }
        case "codespan": {
          n += t.codespan(s);
          break;
        }
        case "br": {
          n += t.br(s);
          break;
        }
        case "del": {
          n += t.del(s);
          break;
        }
        case "text": {
          n += t.text(s);
          break;
        }
        default: {
          let o2 = 'Token with "' + s.type + '" type was not found.';
          if (this.options.silent) return console.error(o2), "";
          throw new Error(o2);
        }
      }
    }
    return n;
  }
};
var S = class {
  options;
  block;
  constructor(e) {
    this.options = e || T;
  }
  static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
  preprocess(e) {
    return e;
  }
  postprocess(e) {
    return e;
  }
  processAllTokens(e) {
    return e;
  }
  emStrongMask(e) {
    return e;
  }
  provideLexer() {
    return this.block ? x.lex : x.lexInline;
  }
  provideParser() {
    return this.block ? b.parse : b.parseInline;
  }
};
var B = class {
  defaults = L();
  options = this.setOptions;
  parse = this.parseMarkdown(true);
  parseInline = this.parseMarkdown(false);
  Parser = b;
  Renderer = P;
  TextRenderer = $;
  Lexer = x;
  Tokenizer = y;
  Hooks = S;
  constructor(...e) {
    this.use(...e);
  }
  walkTokens(e, t) {
    let n = [];
    for (let r of e) switch (n = n.concat(t.call(this, r)), r.type) {
      case "table": {
        let i = r;
        for (let s of i.header) n = n.concat(this.walkTokens(s.tokens, t));
        for (let s of i.rows) for (let o2 of s) n = n.concat(this.walkTokens(o2.tokens, t));
        break;
      }
      case "list": {
        let i = r;
        n = n.concat(this.walkTokens(i.items, t));
        break;
      }
      default: {
        let i = r;
        this.defaults.extensions?.childTokens?.[i.type] ? this.defaults.extensions.childTokens[i.type].forEach((s) => {
          let o2 = i[s].flat(1 / 0);
          n = n.concat(this.walkTokens(o2, t));
        }) : i.tokens && (n = n.concat(this.walkTokens(i.tokens, t)));
      }
    }
    return n;
  }
  use(...e) {
    let t = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return e.forEach((n) => {
      let r = { ...n };
      if (r.async = this.defaults.async || r.async || false, n.extensions && (n.extensions.forEach((i) => {
        if (!i.name) throw new Error("extension name required");
        if ("renderer" in i) {
          let s = t.renderers[i.name];
          s ? t.renderers[i.name] = function(...o2) {
            let a = i.renderer.apply(this, o2);
            return a === false && (a = s.apply(this, o2)), a;
          } : t.renderers[i.name] = i.renderer;
        }
        if ("tokenizer" in i) {
          if (!i.level || i.level !== "block" && i.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let s = t[i.level];
          s ? s.unshift(i.tokenizer) : t[i.level] = [i.tokenizer], i.start && (i.level === "block" ? t.startBlock ? t.startBlock.push(i.start) : t.startBlock = [i.start] : i.level === "inline" && (t.startInline ? t.startInline.push(i.start) : t.startInline = [i.start]));
        }
        "childTokens" in i && i.childTokens && (t.childTokens[i.name] = i.childTokens);
      }), r.extensions = t), n.renderer) {
        let i = this.defaults.renderer || new P(this.defaults);
        for (let s in n.renderer) {
          if (!(s in i)) throw new Error(`renderer '${s}' does not exist`);
          if (["options", "parser"].includes(s)) continue;
          let o2 = s, a = n.renderer[o2], l = i[o2];
          i[o2] = (...c) => {
            let p2 = a.apply(i, c);
            return p2 === false && (p2 = l.apply(i, c)), p2 || "";
          };
        }
        r.renderer = i;
      }
      if (n.tokenizer) {
        let i = this.defaults.tokenizer || new y(this.defaults);
        for (let s in n.tokenizer) {
          if (!(s in i)) throw new Error(`tokenizer '${s}' does not exist`);
          if (["options", "rules", "lexer"].includes(s)) continue;
          let o2 = s, a = n.tokenizer[o2], l = i[o2];
          i[o2] = (...c) => {
            let p2 = a.apply(i, c);
            return p2 === false && (p2 = l.apply(i, c)), p2;
          };
        }
        r.tokenizer = i;
      }
      if (n.hooks) {
        let i = this.defaults.hooks || new S();
        for (let s in n.hooks) {
          if (!(s in i)) throw new Error(`hook '${s}' does not exist`);
          if (["options", "block"].includes(s)) continue;
          let o2 = s, a = n.hooks[o2], l = i[o2];
          S.passThroughHooks.has(s) ? i[o2] = (c) => {
            if (this.defaults.async && S.passThroughHooksRespectAsync.has(s)) return (async () => {
              let g2 = await a.call(i, c);
              return l.call(i, g2);
            })();
            let p2 = a.call(i, c);
            return l.call(i, p2);
          } : i[o2] = (...c) => {
            if (this.defaults.async) return (async () => {
              let g2 = await a.apply(i, c);
              return g2 === false && (g2 = await l.apply(i, c)), g2;
            })();
            let p2 = a.apply(i, c);
            return p2 === false && (p2 = l.apply(i, c)), p2;
          };
        }
        r.hooks = i;
      }
      if (n.walkTokens) {
        let i = this.defaults.walkTokens, s = n.walkTokens;
        r.walkTokens = function(o2) {
          let a = [];
          return a.push(s.call(this, o2)), i && (a = a.concat(i.call(this, o2))), a;
        };
      }
      this.defaults = { ...this.defaults, ...r };
    }), this;
  }
  setOptions(e) {
    return this.defaults = { ...this.defaults, ...e }, this;
  }
  lexer(e, t) {
    return x.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return b.parse(e, t ?? this.defaults);
  }
  parseMarkdown(e) {
    return (n, r) => {
      let i = { ...r }, s = { ...this.defaults, ...i }, o2 = this.onError(!!s.silent, !!s.async);
      if (this.defaults.async === true && i.async === false) return o2(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof n > "u" || n === null) return o2(new Error("marked(): input parameter is undefined or null"));
      if (typeof n != "string") return o2(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
      if (s.hooks && (s.hooks.options = s, s.hooks.block = e), s.async) return (async () => {
        let a = s.hooks ? await s.hooks.preprocess(n) : n, c = await (s.hooks ? await s.hooks.provideLexer() : e ? x.lex : x.lexInline)(a, s), p2 = s.hooks ? await s.hooks.processAllTokens(c) : c;
        s.walkTokens && await Promise.all(this.walkTokens(p2, s.walkTokens));
        let d = await (s.hooks ? await s.hooks.provideParser() : e ? b.parse : b.parseInline)(p2, s);
        return s.hooks ? await s.hooks.postprocess(d) : d;
      })().catch(o2);
      try {
        s.hooks && (n = s.hooks.preprocess(n));
        let l = (s.hooks ? s.hooks.provideLexer() : e ? x.lex : x.lexInline)(n, s);
        s.hooks && (l = s.hooks.processAllTokens(l)), s.walkTokens && this.walkTokens(l, s.walkTokens);
        let p2 = (s.hooks ? s.hooks.provideParser() : e ? b.parse : b.parseInline)(l, s);
        return s.hooks && (p2 = s.hooks.postprocess(p2)), p2;
      } catch (a) {
        return o2(a);
      }
    };
  }
  onError(e, t) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
        let r = "<p>An error occurred:</p><pre>" + w(n.message + "", true) + "</pre>";
        return t ? Promise.resolve(r) : r;
      }
      if (t) return Promise.reject(n);
      throw n;
    };
  }
};
var _ = new B();
function k(u3, e) {
  return _.parse(u3, e);
}
k.options = k.setOptions = function(u3) {
  return _.setOptions(u3), k.defaults = _.defaults, G(k.defaults), k;
};
k.getDefaults = L;
k.defaults = T;
k.use = function(...u3) {
  return _.use(...u3), k.defaults = _.defaults, G(k.defaults), k;
};
k.walkTokens = function(u3, e) {
  return _.walkTokens(u3, e);
};
k.parseInline = _.parseInline;
k.Parser = b;
k.parser = b.parse;
k.Renderer = P;
k.TextRenderer = $;
k.Lexer = x;
k.lexer = x.lex;
k.Tokenizer = y;
k.Hooks = S;
k.parse = k;
k.options;
k.setOptions;
k.use;
k.walkTokens;
k.parseInline;
b.parse;
x.lex;
const ListContainer = dt.ul`
  padding-left: 20px;
  line-height: 16px;
  li::before {
    content: '•';
    display: inline-block;
    width: 1em;
    margin-left: -1em;
    line-height: 10px;
  }
`;
const List$1 = ({ items }) => {
  if (!items) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsx(ListContainer, { children: items.map((item, index) => {
    const htmlContent = k.parseInline(item, { breaks: true });
    return /* @__PURE__ */ jsxRuntime.jsx("li", { dangerouslySetInnerHTML: { __html: htmlContent } }, index);
  }) });
};
const Text = dt.div`
  font-style: italic;
  font-size: 1.4rem;
`;
const DateComponent = ({ date }) => {
  if (!date) {
    return /* @__PURE__ */ jsxRuntime.jsx(Text, { children: "Present" });
  }
  const fullDate = new Date(date);
  const options = { year: "numeric", month: "long" };
  const formattedDate = fullDate.toLocaleDateString("en-US", options);
  return /* @__PURE__ */ jsxRuntime.jsx(Text, { children: formattedDate ?? "Present" });
};
const Range = dt.div`
  display: flex;
  font-style: italic;
  font-size: 13px;
`;
const DateRange = ({ startDate, endDate }) => {
  return /* @__PURE__ */ jsxRuntime.jsxs(Range, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(DateComponent, { date: startDate }),
    " — ",
    /* @__PURE__ */ jsxRuntime.jsx(DateComponent, { date: endDate })
  ] });
};
const Meta = dt.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
`;
const Title$1 = dt.div`
  font-weight: 600;
  font-size: 1.45rem;
  margin-bottom: 3px;
`;
const SubTitle = dt.div`
  font-style: italic;
  font-size: 1.4rem;
  margin-bottom: 3px;
`;
const Container$1 = dt.div`
  margin-bottom: 10px;
`;
const Summary$1 = dt.div`
  margin-bottom: 5px;
`;
const Experience = ({
  title,
  date,
  startDate,
  endDate,
  subTitle,
  summary,
  highlights
}) => {
  const htmlSummary = summary ? k.parse(summary, { breaks: true }) : "";
  return /* @__PURE__ */ jsxRuntime.jsxs(Container$1, { children: [
    /* @__PURE__ */ jsxRuntime.jsxs(Meta, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(Title$1, { children: title }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "secondary", children: date ? /* @__PURE__ */ jsxRuntime.jsx(DateComponent, { date }) : /* @__PURE__ */ jsxRuntime.jsx(DateRange, { startDate, endDate }) })
    ] }),
    subTitle && /* @__PURE__ */ jsxRuntime.jsx(SubTitle, { children: subTitle }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "secondary", children: [
      summary && /* @__PURE__ */ jsxRuntime.jsx(Summary$1, { dangerouslySetInnerHTML: { __html: htmlSummary } }),
      /* @__PURE__ */ jsxRuntime.jsx(List$1, { items: highlights })
    ] })
  ] });
};
const Work$1 = ({ projects }) => {
  if (!projects) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsx("div", { children: /* @__PURE__ */ jsxRuntime.jsx(SectionComponent, { title: "Projects", children: projects.map((w2, key) => {
    return /* @__PURE__ */ jsxRuntime.jsx(
      Experience,
      {
        title: w2.name,
        startDate: w2.startDate,
        endDate: w2.endDate,
        summary: w2.description,
        highlights: w2.highlights
      },
      key
    );
  }) }) });
};
const Title = dt.div`
  font-size: 3rem;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;
const BasicInfo = dt.div`
  display: flex;
  gap: 10px 20px;
  justify-content: center;
  flex-wrap: wrap;
`;
const Info = dt.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  svg {
    color: #000;
    margin-right: 5px;
    width: 10px;
  }

  a {
    color: inherit;
    text-decoration: none;
    &:hover {
      color: #000;
    }
  }
`;
const HeroComponent = ({ basics }) => {
  const { name, url, location, profiles, phone, email } = basics;
  const linkedin = profiles.find(
    ({ network }) => network.toLowerCase() === "linkedin"
  );
  const github = profiles.find(
    ({ network }) => network.toLowerCase() === "github"
  );
  const twitter = profiles.find(
    ({ network }) => network.toLowerCase() === "twitter"
  );
  return /* @__PURE__ */ jsxRuntime.jsxs(SectionComponent, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(Title, { children: name }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "secondary", children: /* @__PURE__ */ jsxRuntime.jsxs(BasicInfo, { children: [
      location && /* @__PURE__ */ jsxRuntime.jsxs(Info, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(fa.FaMapPin, {}),
        location.city,
        ", ",
        location.countryCode
      ] }),
      email && /* @__PURE__ */ jsxRuntime.jsxs(Info, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(fa.FaEnvelope, {}),
        email
      ] }),
      phone && /* @__PURE__ */ jsxRuntime.jsxs(Info, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(fa.FaPhoneAlt, {}),
        phone
      ] }),
      url && /* @__PURE__ */ jsxRuntime.jsxs(Info, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(fa.FaLink, {}),
        /* @__PURE__ */ jsxRuntime.jsx("a", { target: "_blank", href: url, children: url })
      ] }),
      linkedin && /* @__PURE__ */ jsxRuntime.jsxs(Info, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(fa.FaLinkedin, {}),
        /* @__PURE__ */ jsxRuntime.jsx("a", { href: `https://linkedin.com/in/${linkedin.username}`, children: linkedin.username })
      ] }),
      github && /* @__PURE__ */ jsxRuntime.jsxs(Info, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(fa.FaGithub, {}),
        /* @__PURE__ */ jsxRuntime.jsx("a", { href: `https://github.com/${github.username}`, children: github.username })
      ] }),
      twitter && /* @__PURE__ */ jsxRuntime.jsxs(Info, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(fa.FaTwitter, {}),
        /* @__PURE__ */ jsxRuntime.jsx("a", { href: `https://twitter.com/${twitter.username}`, children: twitter.username })
      ] })
    ] }) })
  ] });
};
const Summary = dt.div``;
const SummaryComponent = ({ basics }) => {
  const { summary } = basics;
  const htmlContent = summary ? k.parse(summary, { breaks: true }) : "";
  return /* @__PURE__ */ jsxRuntime.jsx(SectionComponent, { children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "secondary", children: /* @__PURE__ */ jsxRuntime.jsx(Summary, { dangerouslySetInnerHTML: { __html: htmlContent } }) }) });
};
const Education = ({ education }) => {
  if (!education) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsx("div", { children: /* @__PURE__ */ jsxRuntime.jsx(SectionComponent, { title: "Education", children: education.map((e, key) => {
    let subTitle = e.area ? `${e.studyType} in ${e.area}` : e.studyType;
    if (e.score) {
      subTitle = `${subTitle} (${e.score})`;
    }
    return /* @__PURE__ */ jsxRuntime.jsx(
      Experience,
      {
        title: e.institution,
        subTitle,
        startDate: e.startDate,
        endDate: e.endDate,
        highlights: e.courses
      },
      key
    );
  }) }) });
};
const Work = ({ work }) => {
  if (!work) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsx("div", { children: /* @__PURE__ */ jsxRuntime.jsx(SectionComponent, { title: "Experience", children: work.map((w2, key) => {
    return /* @__PURE__ */ jsxRuntime.jsx(
      Experience,
      {
        title: w2.position,
        subTitle: w2.name,
        startDate: w2.startDate,
        endDate: w2.endDate,
        summary: w2.summary,
        highlights: w2.highlights
      },
      key
    );
  }) }) });
};
const Certificates = ({ certificates }) => {
  if (!certificates) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsx("div", { children: /* @__PURE__ */ jsxRuntime.jsx(SectionComponent, { title: "Certificates", children: certificates.map((c, key) => {
    return /* @__PURE__ */ jsxRuntime.jsx(
      Experience,
      {
        title: c.name,
        subTitle: c.issuer,
        date: c.date
      },
      key
    );
  }) }) });
};
const Publications = ({ publications }) => {
  if (!publications) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsx("div", { children: /* @__PURE__ */ jsxRuntime.jsx(SectionComponent, { title: "Publications", children: publications.map((p2, key) => {
    return /* @__PURE__ */ jsxRuntime.jsx(
      Experience,
      {
        title: p2.name,
        subTitle: p2.publisher,
        date: p2.releaseDate,
        summary: p2.summary
      },
      key
    );
  }) }) });
};
const Awards = ({ awards }) => {
  if (!awards) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsx("div", { children: /* @__PURE__ */ jsxRuntime.jsx(SectionComponent, { title: "Awards", children: awards.map((a, key) => {
    return /* @__PURE__ */ jsxRuntime.jsx(
      Experience,
      {
        title: a.title,
        subTitle: a.awarder,
        date: a.date,
        summary: a.summary
      },
      key
    );
  }) }) });
};
const Name$1 = dt.div`
  font-weight: 600;
  font-size: 1.4rem;
`;
const List = dt.div`
  font-size: 1.4rem;
  margin-left: 5px;
`;
const Container = dt.div`
  margin-bottom: 5px;
  display: flex;
  align-items: baseline;
`;
const OneLineList = ({ name, items }) => {
  return /* @__PURE__ */ jsxRuntime.jsxs(Container, { children: [
    /* @__PURE__ */ jsxRuntime.jsxs(Name$1, { children: [
      name,
      ":"
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(List, { children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "secondary", children: items?.join(", ") }) })
  ] });
};
const Skills = ({ skills }) => {
  if (!skills) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsx("div", { children: /* @__PURE__ */ jsxRuntime.jsx(SectionComponent, { title: "Skills", children: skills.map((w2, key) => {
    return /* @__PURE__ */ jsxRuntime.jsx(OneLineList, { name: w2.name, items: w2.keywords }, key);
  }) }) });
};
const Interests = ({ interests }) => {
  if (!interests) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsx("div", { children: /* @__PURE__ */ jsxRuntime.jsx(SectionComponent, { title: "Interests", children: interests.map((w2, key) => {
    return /* @__PURE__ */ jsxRuntime.jsx(OneLineList, { name: w2.name, items: w2.keywords }, key);
  }) }) });
};
const Languages = ({ languages }) => {
  if (!languages) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsx("div", { children: /* @__PURE__ */ jsxRuntime.jsx(SectionComponent, { title: "Languages", children: languages.map((l, key) => {
    return /* @__PURE__ */ jsxRuntime.jsx(OneLineList, { name: l.language, items: [l.fluency] }, key);
  }) }) });
};
const Name = dt.div`
  font-weight: 600;
  font-size: 1.4rem;
  margin-bottom: 5px;
`;
const Reference = dt.p``;
const References = ({ references }) => {
  if (!references) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsx("div", { children: /* @__PURE__ */ jsxRuntime.jsx(SectionComponent, { title: "References", children: references.map((r, key) => {
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { marginBottom: "15px" }, children: [
      /* @__PURE__ */ jsxRuntime.jsx(Name, { children: r.name }),
      /* @__PURE__ */ jsxRuntime.jsx(Reference, { children: r.reference })
    ] }, key);
  }) }) });
};
const Volunteer = ({ volunteer }) => {
  if (!volunteer) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsx("div", { children: /* @__PURE__ */ jsxRuntime.jsx(SectionComponent, { title: "Volunteer", children: volunteer.map((w2, key) => {
    return /* @__PURE__ */ jsxRuntime.jsx(
      Experience,
      {
        title: w2.position,
        subTitle: w2.organization,
        startDate: w2.startDate,
        endDate: w2.endDate,
        summary: w2.summary,
        highlights: w2.highlights
      },
      key
    );
  }) }) });
};
const Layout = dt.div`
  max-width: 660px;
  margin: 0 auto;
  line-height: calc(1ex / 0.32);
  margin-bottom: 40px;
`;
const Resume = ({ resume }) => {
  return /* @__PURE__ */ jsxRuntime.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(HeroComponent, { basics: resume.basics }),
    /* @__PURE__ */ jsxRuntime.jsx(SummaryComponent, { basics: resume.basics }),
    /* @__PURE__ */ jsxRuntime.jsx(Work, { work: resume.work }),
    /* @__PURE__ */ jsxRuntime.jsx(Work$1, { projects: resume.projects }),
    /* @__PURE__ */ jsxRuntime.jsx(Education, { education: resume.education }),
    /* @__PURE__ */ jsxRuntime.jsx(Certificates, { certificates: resume.certificates }),
    /* @__PURE__ */ jsxRuntime.jsx(Publications, { publications: resume.publications }),
    /* @__PURE__ */ jsxRuntime.jsx(Awards, { awards: resume.awards }),
    /* @__PURE__ */ jsxRuntime.jsx(Volunteer, { volunteer: resume.volunteer }),
    /* @__PURE__ */ jsxRuntime.jsx(Languages, { languages: resume.languages }),
    /* @__PURE__ */ jsxRuntime.jsx(Skills, { skills: resume.skills }),
    /* @__PURE__ */ jsxRuntime.jsx(Interests, { interests: resume.interests }),
    /* @__PURE__ */ jsxRuntime.jsx(References, { references: resume.references })
  ] });
};
const render = (resume) => {
  return renderResumeDocument(
    /* @__PURE__ */ jsxRuntime.jsx("main", { children: /* @__PURE__ */ jsxRuntime.jsx(Resume, { resume }) }),
    {
      head: `<style>
    @font-face {
      font-family: LatinModern;
      font-style: normal;
      font-weight: normal;
      font-display: swap;
      src: url("/fonts/lmroman10-regular.otf") format("opentype");
    }

    @font-face {
      font-family: LatinModern;
      font-weight: bold;
      font-display: swap;
      src: url("/fonts/lmroman10-bold.otf") format("opentype");
    }

    @font-face {
      font-family: LatinModern;
      font-style: italic;
      font-display: swap;
      src: url("/fonts/lmroman10-italic.otf") format("opentype");
    }

     @font-face {
      font-family: LatinModernSans;
      font-style: normal;
      font-weight: normal;
      font-display: swap;
      src: url("/fonts/lmsans10-regular.otf") format("opentype");
    }

    @font-face {
      font-family: LatinModernSans;
      font-weight: bold;
      font-display: swap;
      src: url("/fonts/lmsans10-bold.otf") format("opentype");
    }

    @font-face {
      font-family: LatinModernSans;
      font-style: italic;
      font-display: swap;
      src: url("/fonts/lmsans10-italic.otf") format("opentype");
    }

    html {
      font-family:LatinModern, "Courier New", monospace;
      background: #fff;
      font-size: 11px;
    }

    h2 {
      font-size: 1.65rem;
    }

    p {
      padding: 0;
      margin: 0;
    }

    p, li {
      font-size: 1.4rem;
      line-height: 1.5rem;
    }

    .secondary {
      color: #111;
    }

    a {
      text-decoration: none;
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



  </style>`,
      lang: "en",
      dir: "ltr",
      title: `${resume.basics.name} - Resume`,
      includeTokensCss: false
    }
  );
};
exports.Resume = Resume;
exports.render = render;
