import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { CiGlobe, CiMail, CiPhone } from "react-icons/ci";
import { FaTwitter, FaGithub } from "react-icons/fa";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Root,
  {
    ref,
    className: cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-xl",
      className
    ),
    ...props
  }
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-xl bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const socials = {
  github: FaGithub,
  twitter: FaTwitter
};
const HeroComponent = ({ basics }) => {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-1.5", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: basics.name }),
      /* @__PURE__ */ jsx("p", { className: "max-w-md text-pretty font-mono text-sm text-muted-foreground", children: basics.label }),
      basics.location?.city && /* @__PURE__ */ jsx("p", { className: "max-w-md items-center text-pretty font-mono text-xs text-muted-foreground", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex gap-x-1.5 align-baseline leading-none", children: [
        /* @__PURE__ */ jsx(CiGlobe, {}),
        basics.location.city
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-x-1 pt-1 font-mono text-sm text-muted-foreground print:hidden", children: [
        basics.email ? /* @__PURE__ */ jsx(Button, { className: "size-8", variant: "outline", size: "icon", asChild: true, children: /* @__PURE__ */ jsx("a", { href: `mailto:${basics.email}`, children: /* @__PURE__ */ jsx(CiMail, { className: "size-4" }) }) }) : null,
        basics.phone ? /* @__PURE__ */ jsx(Button, { className: "size-8", variant: "outline", size: "icon", asChild: true, children: /* @__PURE__ */ jsx("a", { href: `tel:${basics.phone}`, children: /* @__PURE__ */ jsx(CiPhone, { className: "size-4" }) }) }) : null,
        basics.profiles?.map((social) => {
          const SocialIcon = socials[social.network];
          return /* @__PURE__ */ jsx(
            Button,
            {
              className: "size-8",
              variant: "outline",
              size: "icon",
              asChild: true,
              children: /* @__PURE__ */ jsx("a", { href: social.url, children: /* @__PURE__ */ jsx(SocialIcon, { className: "size-4" }) })
            },
            social.username
          );
        })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hidden flex-col gap-x-1 font-mono text-sm text-muted-foreground print:flex", children: [
        basics.email ? /* @__PURE__ */ jsx("a", { href: `mailto:${basics.email}`, children: /* @__PURE__ */ jsx("span", { className: "underline", children: basics.email }) }) : null,
        basics.phone ? /* @__PURE__ */ jsx("a", { href: `tel:${basics.phone}`, children: /* @__PURE__ */ jsx("span", { className: "underline", children: basics.phone }) }) : null
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Avatar, { className: "size-28", children: [
      /* @__PURE__ */ jsx(AvatarImage, { alt: basics.name, src: basics.image }),
      /* @__PURE__ */ jsx(AvatarFallback, { children: "TD" })
    ] })
  ] });
};
function Section({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "section",
    {
      className: cn("flex min-h-0 flex-col gap-y-3", className),
      ...props
    }
  );
}
const About = ({ basics }) => {
  return /* @__PURE__ */ jsxs(Section, { children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: "About" }),
    /* @__PURE__ */ jsx("p", { className: "text-pretty font-mono text-sm text-muted-foreground", children: basics.summary })
  ] });
};
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("rounded-lg bg-card text-card-foreground", className),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h3",
  {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "text-pretty font-mono text-sm text-muted-foreground",
      className
    ),
    ...props
  }
));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex items-center", className), ...props }));
CardFooter.displayName = "CardFooter";
const Work = ({ work }) => {
  return /* @__PURE__ */ jsxs(Section, { children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: "Work Experience" }),
    work.map((w, index) => {
      return /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-x-2 text-base", children: [
            /* @__PURE__ */ jsx("h3", { className: "inline-flex items-center justify-center gap-x-1 font-semibold leading-none", children: /* @__PURE__ */ jsx("a", { className: "hover:underline", href: w.url, children: w.name }) }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm tabular-nums text-gray-500", children: [
              w.startDate,
              " - ",
              w.endDate ?? "Present"
            ] })
          ] }),
          /* @__PURE__ */ jsx("h4", { className: "font-mono text-sm leading-none", children: w.title })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "mt-2 text-xs", children: [
          w.summary,
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("ul", { children: w.highlights?.map((h, index2) => {
            return /* @__PURE__ */ jsxs("li", { children: [
              "- ",
              h
            ] }, index2);
          }) })
        ] })
      ] }, index);
    })
  ] });
};
function ProjectCard({ title, description, link }) {
  return /* @__PURE__ */ jsxs(Card, { className: "flex flex-col overflow-hidden border border-muted p-3", children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: link ? /* @__PURE__ */ jsxs(
        "a",
        {
          href: link,
          target: "_blank",
          className: "inline-flex items-center gap-1 hover:underline",
          children: [
            title,
            " ",
            /* @__PURE__ */ jsx("span", { className: "size-1 rounded-full bg-green-500" })
          ]
        }
      ) : title }),
      /* @__PURE__ */ jsx("div", { className: "hidden font-mono text-xs underline print:visible", children: link?.replace("https://", "").replace("www.", "").replace("/", "") }),
      /* @__PURE__ */ jsx(CardDescription, { className: "font-mono text-xs", children: description })
    ] }) }),
    /* @__PURE__ */ jsx(CardContent, { className: "mt-auto flex", children: /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-wrap gap-1" }) })
  ] });
}
const Projects = ({ projects }) => {
  return /* @__PURE__ */ jsxs(Section, { className: "print-force-new-page scroll-mb-16", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: "Projects" }),
    /* @__PURE__ */ jsx("div", { className: "-mx-3 grid grid-cols-1 gap-3 print:grid-cols-3 print:gap-2 md:grid-cols-2 lg:grid-cols-3", children: projects?.map((project) => {
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        "asd",
        /* @__PURE__ */ jsx(
          ProjectCard,
          {
            title: project.title,
            description: project.description,
            tags: project.techStack,
            link: "link" in project ? project.link.href : void 0
          },
          project.title
        )
      ] });
    }) })
  ] });
};
const Education = ({ education }) => {
  return /* @__PURE__ */ jsxs(Section, { children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: "Education" }),
    education.map((e) => {
      return /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-x-2 text-base", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold leading-none", children: e.institution }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm tabular-nums text-gray-500", children: [
            e.startDate,
            " - ",
            e.endDate
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "mt-2", children: e.area })
      ] }, e.institution);
    })
  ] });
};
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-nowrap",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/80 text-primary-foreground hover:bg-primary/60",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/60",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const Skills = ({ skills }) => {
  return /* @__PURE__ */ jsxs(Section, { children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: "Skills" }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: skills.map((skill) => {
      return /* @__PURE__ */ jsx(Badge, { children: skill.name }, skill.name);
    }) })
  ] });
};
const Resume = ({ resume }) => {
  return /* @__PURE__ */ jsx("div", { style: { fontFamily: "'Inter', sans-serif" }, children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("main", { className: "container relative mx-auto scroll-my-12 overflow-auto p-4 print:p-12 md:p-16", children: /* @__PURE__ */ jsxs("section", { className: "mx-auto w-full max-w-2xl space-y-8 bg-white print:space-y-6", children: [
    /* @__PURE__ */ jsx(HeroComponent, { basics: resume.basics }),
    /* @__PURE__ */ jsx(About, { basics: resume.basics }),
    /* @__PURE__ */ jsx(Work, { work: resume.work }),
    /* @__PURE__ */ jsx(Education, { education: resume.education }),
    /* @__PURE__ */ jsx(Skills, { skills: resume.skills }),
    /* @__PURE__ */ jsx(Projects, { projects: resume.projects })
  ] }) }) }) });
};
var i = /* @__PURE__ */ new Map([["align-self", "-ms-grid-row-align"], ["color-adjust", "-webkit-print-color-adjust"], ["column-gap", "grid-column-gap"], ["forced-color-adjust", "-ms-high-contrast-adjust"], ["gap", "grid-gap"], ["grid-template-columns", "-ms-grid-columns"], ["grid-template-rows", "-ms-grid-rows"], ["justify-self", "-ms-grid-column-align"], ["margin-inline-end", "-webkit-margin-end"], ["margin-inline-start", "-webkit-margin-start"], ["mask-border", "-webkit-mask-box-image"], ["mask-border-outset", "-webkit-mask-box-image-outset"], ["mask-border-slice", "-webkit-mask-box-image-slice"], ["mask-border-source", "-webkit-mask-box-image-source"], ["mask-border-repeat", "-webkit-mask-box-image-repeat"], ["mask-border-width", "-webkit-mask-box-image-width"], ["overflow-wrap", "word-wrap"], ["padding-inline-end", "-webkit-padding-end"], ["padding-inline-start", "-webkit-padding-start"], ["print-color-adjust", "color-adjust"], ["row-gap", "grid-row-gap"], ["scroll-margin-bottom", "scroll-snap-margin-bottom"], ["scroll-margin-left", "scroll-snap-margin-left"], ["scroll-margin-right", "scroll-snap-margin-right"], ["scroll-margin-top", "scroll-snap-margin-top"], ["scroll-margin", "scroll-snap-margin"], ["text-combine-upright", "-ms-text-combine-horizontal"]]);
function r(r2) {
  return i.get(r2);
}
function a(i2) {
  var r2 = /^(?:(text-(?:decoration$|e|or|si)|back(?:ground-cl|d|f)|box-d|mask(?:$|-[ispro]|-cl)|pr|hyphena|flex-d)|(tab-|column(?!-s)|text-align-l)|(ap)|u|hy)/i.exec(i2);
  return r2 ? r2[1] ? 1 : r2[2] ? 2 : r2[3] ? 3 : 5 : 0;
}
function t(i2, r2) {
  var a2 = /^(?:(pos)|(cli)|(background-i)|(flex(?:$|-b)|(?:max-|min-)?(?:block-s|inl|he|widt))|dis)/i.exec(i2);
  return a2 ? a2[1] ? /^sti/i.test(r2) ? 1 : 0 : a2[2] ? /^pat/i.test(r2) ? 1 : 0 : a2[3] ? /^image-/i.test(r2) ? 1 : 0 : a2[4] ? "-" === r2[3] ? 2 : 0 : /^(?:inline-)?grid$/i.test(r2) ? 4 : 0 : 0;
}
var includes = (value, search) => !!~value.indexOf(search);
var join = (parts, separator = "-") => parts.join(separator);
var joinTruthy = (parts, separator) => join(parts.filter(Boolean), separator);
var tail = (array, startIndex = 1) => array.slice(startIndex);
var identity = (value) => value;
var noop$1 = () => {
};
var capitalize = (value) => value[0].toUpperCase() + tail(value);
var hyphenate = (value) => value.replace(/[A-Z]/g, "-$&").toLowerCase();
var evalThunk = (value, context) => {
  while (typeof value == "function") {
    value = value(context);
  }
  return value;
};
var ensureMaxSize = (map2, max) => {
  if (map2.size > max) {
    map2.delete(map2.keys().next().value);
  }
};
var isCSSProperty = (key, value) => !includes("@:&", key[0]) && (includes("rg", (typeof value)[5]) || Array.isArray(value));
var merge = (target2, source, context) => source ? Object.keys(source).reduce((target22, key) => {
  const value = evalThunk(source[key], context);
  if (isCSSProperty(key, value)) {
    target22[hyphenate(key)] = value;
  } else {
    target22[key] = key[0] == "@" && includes("figa", key[1]) ? (target22[key] || []).concat(value) : merge(target22[key] || {}, value, context);
  }
  return target22;
}, target2) : target2;
var escape = typeof CSS !== "undefined" && CSS.escape || ((className) => className.replace(/[!"'`*+.,;:\\/<=>?@#$%&^|~()[\]{}]/g, "\\$&").replace(/^\d/, "\\3$& "));
var buildMediaQuery = (screen) => {
  if (!Array.isArray(screen)) {
    screen = [screen];
  }
  return "@media " + join(screen.map((screen2) => {
    if (typeof screen2 == "string") {
      screen2 = { min: screen2 };
    }
    return screen2.raw || join(Object.keys(screen2).map((feature) => `(${feature}-width:${screen2[feature]})`), " and ");
  }), ",");
};
var cyrb32 = (value) => {
  for (var h = 9, index = value.length; index--; ) {
    h = Math.imul(h ^ value.charCodeAt(index), 1597334677);
  }
  return "tw-" + ((h ^ h >>> 9) >>> 0).toString(36);
};
var sortedInsertionIndex = (array, element) => {
  for (var low = 0, high = array.length; low < high; ) {
    const pivot = high + low >> 1;
    if (array[pivot] <= element) {
      low = pivot + 1;
    } else {
      high = pivot;
    }
  }
  return high;
};
var groupings;
var rules;
var startGrouping = (value = "") => {
  groupings.push(value);
  return "";
};
var endGrouping = (isWhitespace) => {
  groupings.length = Math.max(groupings.lastIndexOf("") + ~~isWhitespace, 0);
};
var onlyPrefixes = (s) => s && !includes("!:", s[0]);
var onlyVariants = (s) => s[0] == ":";
var addRule = (directive2, negate) => {
  rules.push({
    v: groupings.filter(onlyVariants),
    d: directive2,
    n: negate,
    i: includes(groupings, "!"),
    $: ""
  });
};
var saveRule = (buffer) => {
  const negate = buffer[0] == "-";
  if (negate) {
    buffer = tail(buffer);
  }
  const prefix = join(groupings.filter(onlyPrefixes));
  addRule(buffer == "&" ? prefix : (prefix && prefix + "-") + buffer, negate);
  return "";
};
var parseString = (token, isVariant) => {
  let buffer = "";
  for (let char, dynamic = false, position2 = 0; char = token[position2++]; ) {
    if (dynamic || char == "[") {
      buffer += char;
      dynamic = char != "]";
      continue;
    }
    switch (char) {
      case ":":
        buffer = buffer && startGrouping(":" + (token[position2] == char ? token[position2++] : "") + buffer);
        break;
      case "(":
        buffer = buffer && startGrouping(buffer);
        startGrouping();
        break;
      case "!":
        startGrouping(char);
        break;
      case ")":
      case " ":
      case "	":
      case "\n":
      case "\r":
        buffer = buffer && saveRule(buffer);
        endGrouping(char !== ")");
        break;
      default:
        buffer += char;
    }
  }
  if (buffer) {
    if (isVariant) {
      startGrouping(":" + buffer);
    } else if (buffer.slice(-1) == "-") {
      startGrouping(buffer.slice(0, -1));
    } else {
      saveRule(buffer);
    }
  }
};
var parseGroupedToken = (token) => {
  startGrouping();
  parseToken(token);
  endGrouping();
};
var parseGroup = (key, token) => {
  if (token) {
    startGrouping();
    const isVariant = includes("tbu", (typeof token)[1]);
    parseString(key, isVariant);
    if (isVariant) {
      parseGroupedToken(token);
    }
    endGrouping();
  }
};
var parseToken = (token) => {
  switch (typeof token) {
    case "string":
      parseString(token);
      break;
    case "function":
      addRule(token);
      break;
    case "object":
      if (Array.isArray(token)) {
        token.forEach(parseGroupedToken);
      } else if (token) {
        Object.keys(token).forEach((key) => {
          parseGroup(key, token[key]);
        });
      }
  }
};
var staticsCaches = /* @__PURE__ */ new WeakMap();
var buildStatics = (strings) => {
  let statics = staticsCaches.get(strings);
  if (!statics) {
    let slowModeIndex = NaN;
    let buffer = "";
    statics = strings.map((token, index) => {
      if (slowModeIndex !== slowModeIndex && (token.slice(-1) == "[" || includes(":-(", (strings[index + 1] || "")[0]))) {
        slowModeIndex = index;
      }
      if (index >= slowModeIndex) {
        return (interpolation) => {
          if (index == slowModeIndex) {
            buffer = "";
          }
          buffer += token;
          if (includes("rg", (typeof interpolation)[5])) {
            buffer += interpolation;
          } else if (interpolation) {
            parseString(buffer);
            buffer = "";
            parseToken(interpolation);
          }
          if (index == strings.length - 1) {
            parseString(buffer);
          }
        };
      }
      const staticRules = rules = [];
      parseString(token);
      const activeGroupings = [...groupings];
      rules = [];
      return (interpolation) => {
        rules.push(...staticRules);
        groupings = [...activeGroupings];
        if (interpolation) {
          parseToken(interpolation);
        }
      };
    });
    staticsCaches.set(strings, statics);
  }
  return statics;
};
var parse = (tokens) => {
  groupings = [];
  rules = [];
  if (Array.isArray(tokens[0]) && Array.isArray(tokens[0].raw)) {
    buildStatics(tokens[0]).forEach((apply2, index) => apply2(tokens[index + 1]));
  } else {
    parseToken(tokens);
  }
  return rules;
};
var isFunctionFree;
var detectFunction = (key, value) => {
  if (typeof value == "function") {
    isFunctionFree = false;
  }
  return value;
};
var stringify = (data) => {
  isFunctionFree = true;
  const key = JSON.stringify(data, detectFunction);
  return isFunctionFree && key;
};
var cacheByFactory = /* @__PURE__ */ new WeakMap();
var directive = (factory, data) => {
  const key = stringify(data);
  let directive2;
  if (key) {
    var cache = cacheByFactory.get(factory);
    if (!cache) {
      cacheByFactory.set(factory, cache = /* @__PURE__ */ new Map());
    }
    directive2 = cache.get(key);
  }
  if (!directive2) {
    directive2 = Object.defineProperty((params, context) => {
      context = Array.isArray(params) ? context : params;
      return evalThunk(factory(data, context), context);
    }, "toJSON", {
      value: () => key || data
    });
    if (cache) {
      cache.set(key, directive2);
      ensureMaxSize(cache, 1e4);
    }
  }
  return directive2;
};
var applyFactory = (tokens, { css }) => css(parse(tokens));
var apply = (...tokens) => directive(applyFactory, tokens);
var positions = (resolve) => (value, position2, prefix, suffix) => {
  if (value) {
    const properties = position2 && resolve(position2);
    if (properties && properties.length > 0) {
      return properties.reduce((declarations, property2) => {
        declarations[joinTruthy([prefix, property2, suffix])] = value;
        return declarations;
      }, {});
    }
  }
};
var corners = /* @__PURE__ */ positions((key) => ({
  t: ["top-left", "top-right"],
  r: ["top-right", "bottom-right"],
  b: ["bottom-left", "bottom-right"],
  l: ["bottom-left", "top-left"],
  tl: ["top-left"],
  tr: ["top-right"],
  bl: ["bottom-left"],
  br: ["bottom-right"]
})[key]);
var expandEdges = (key) => {
  const parts = ({ x: "lr", y: "tb" }[key] || key || "").split("").sort();
  for (let index = parts.length; index--; ) {
    if (!(parts[index] = {
      t: "top",
      r: "right",
      b: "bottom",
      l: "left"
    }[parts[index]]))
      return;
  }
  if (parts.length)
    return parts;
};
var edges = /* @__PURE__ */ positions(expandEdges);
var stringifyVariant = (selector, variant) => selector + (variant[1] == ":" ? tail(variant, 2) + ":" : tail(variant)) + ":";
var stringifyRule = (rule, directive2 = rule.d) => typeof directive2 == "function" ? "" : rule.v.reduce(stringifyVariant, "") + (rule.i ? "!" : "") + (rule.n ? "-" : "") + directive2;
var _;
var __;
var $;
var toColumnsOrRows = (x) => x == "cols" ? "columns" : "rows";
var property = (property2) => (params, context, id) => ({
  [property2]: id + ((_ = join(params)) && "-" + _)
});
var propertyValue = (property2, separator) => (params, context, id) => (_ = join(params, separator)) && {
  [property2 || id]: _
};
var themeProperty = (section) => (params, { theme: theme2 }, id) => (_ = theme2(section || id, params)) && {
  [section || id]: _
};
var themePropertyFallback = (section, separator) => (params, { theme: theme2 }, id) => (_ = theme2(section || id, params, join(params, separator))) && {
  [section || id]: _
};
var alias = (handler, name) => (params, context) => handler(params, context, name);
var display = property("display");
var position = property("position");
var textTransform = property("textTransform");
var textDecoration = property("textDecoration");
var fontStyle = property("fontStyle");
var fontVariantNumeric = (key) => (params, context, id) => ({
  ["--tw-" + key]: id,
  fontVariantNumeric: "var(--tw-ordinal,/*!*/ /*!*/) var(--tw-slashed-zero,/*!*/ /*!*/) var(--tw-numeric-figure,/*!*/ /*!*/) var(--tw-numeric-spacing,/*!*/ /*!*/) var(--tw-numeric-fraction,/*!*/ /*!*/)"
});
var inset = (params, { theme: theme2 }, id) => (_ = theme2("inset", params)) && { [id]: _ };
var opacityProperty = (params, theme2, id, section = id) => (_ = theme2(section + "Opacity", tail(params))) && {
  [`--tw-${id}-opacity`]: _
};
var parseColorComponent = (chars, factor) => Math.round(parseInt(chars, 16) * factor);
var asRGBA = (color, opacityProperty2, opacityDefault) => {
  if (color && color[0] == "#" && (_ = (color.length - 1) / 3) && ($ = [17, 1, 0.062272][_ - 1])) {
    return `rgba(${parseColorComponent(color.substr(1, _), $)},${parseColorComponent(color.substr(1 + _, _), $)},${parseColorComponent(color.substr(1 + 2 * _, _), $)},${opacityProperty2 ? `var(--tw-${opacityProperty2}${opacityDefault ? "," + opacityDefault : ""})` : opacityDefault || 1})`;
  }
  return color;
};
var withOpacityFallback = (property2, kind, color) => color && typeof color == "string" ? (_ = asRGBA(color, kind + "-opacity")) && _ !== color ? {
  [`--tw-${kind}-opacity`]: "1",
  [property2]: [color, _]
} : { [property2]: color } : void 0;
var transparentTo = (color) => ($ = asRGBA(color, "", "0")) == _ ? "transparent" : $;
var reversableEdge = (params, { theme: theme2 }, id, section, prefix, suffix) => (_ = { x: ["right", "left"], y: ["bottom", "top"] }[params[0]]) && ($ = `--tw-${id}-${params[0]}-reverse`) ? params[1] == "reverse" ? {
  [$]: "1"
} : {
  [$]: "0",
  [joinTruthy([prefix, _[0], suffix])]: (__ = theme2(section, tail(params))) && `calc(${__} * var(${$}))`,
  [joinTruthy([prefix, _[1], suffix])]: __ && [__, `calc(${__} * calc(1 - var(${$})))`]
} : void 0;
var placeHelper = (property2, params) => params[0] && {
  [property2]: (includes("wun", (params[0] || "")[3]) ? "space-" : "") + params[0]
};
var contentPluginFor = (property2) => (params) => includes(["start", "end"], params[0]) ? { [property2]: "flex-" + params[0] } : placeHelper(property2, params);
var gridPlugin = (kind) => (params, { theme: theme2 }) => {
  if (_ = theme2("grid" + capitalize(kind), params, "")) {
    return { ["grid-" + kind]: _ };
  }
  switch (params[0]) {
    case "span":
      return params[1] && {
        ["grid-" + kind]: `span ${params[1]} / span ${params[1]}`
      };
    case "start":
    case "end":
      return (_ = theme2("grid" + capitalize(kind) + capitalize(params[0]), tail(params), join(tail(params)))) && {
        [`grid-${kind}-${params[0]}`]: _
      };
  }
};
var border = (params, { theme: theme2 }, id) => {
  switch (params[0]) {
    case "solid":
    case "dashed":
    case "dotted":
    case "double":
    case "none":
      return propertyValue("borderStyle")(params);
    case "collapse":
    case "separate":
      return propertyValue("borderCollapse")(params);
    case "opacity":
      return opacityProperty(params, theme2, id);
  }
  return (_ = theme2(id + "Width", params, "")) ? { borderWidth: _ } : withOpacityFallback("borderColor", id, theme2(id + "Color", params));
};
var borderEdges = (params, context, id) => {
  var _a;
  const edges2 = (_a = expandEdges(params[0])) == null ? void 0 : _a.map(capitalize);
  if (edges2) {
    params = tail(params);
  }
  let rules2 = border(params, context, id);
  if (edges2 && rules2 && typeof rules2 === "object") {
    rules2 = Object.entries(rules2).reduce((newRules, [key, value]) => {
      if (key.startsWith("border")) {
        for (const edge of edges2) {
          newRules[key.slice(0, 6) + edge + key.slice(6)] = value;
        }
      } else {
        newRules[key] = value;
      }
      return newRules;
    }, {});
  }
  return rules2;
};
var transform = (gpu) => (gpu ? "translate3d(var(--tw-translate-x,0),var(--tw-translate-y,0),0)" : "translateX(var(--tw-translate-x,0)) translateY(var(--tw-translate-y,0))") + " rotate(var(--tw-rotate,0)) skewX(var(--tw-skew-x,0)) skewY(var(--tw-skew-y,0)) scaleX(var(--tw-scale-x,1)) scaleY(var(--tw-scale-y,1))";
var transformXYFunction = (params, context, id) => params[0] && (_ = context.theme(id, params[1] || params[0])) && {
  [`--tw-${id}-x`]: params[0] !== "y" && _,
  [`--tw-${id}-y`]: params[0] !== "x" && _,
  transform: [`${id}${params[1] ? params[0].toUpperCase() : ""}(${_})`, transform()]
};
var edgesPluginFor = (key) => (params, context, id) => id[1] ? edges(context.theme(key, params), id[1], key) : themeProperty(key)(params, context, id);
var padding = edgesPluginFor("padding");
var margin = edgesPluginFor("margin");
var minMax = (params, { theme: theme2 }, id) => (_ = { w: "width", h: "height" }[params[0]]) && {
  [_ = `${id}${capitalize(_)}`]: theme2(_, tail(params))
};
var filter = (params, { theme: theme2 }, id) => {
  const parts = id.split("-");
  const prefix = parts[0] == "backdrop" ? parts[0] + "-" : "";
  if (!prefix) {
    params.unshift(...parts);
  }
  if (params[0] == "filter") {
    const filters = [
      "blur",
      "brightness",
      "contrast",
      "grayscale",
      "hue-rotate",
      "invert",
      prefix && "opacity",
      "saturate",
      "sepia",
      !prefix && "drop-shadow"
    ].filter(Boolean);
    return params[1] == "none" ? { [prefix + "filter"]: "none" } : filters.reduce((css, key) => {
      css["--tw-" + prefix + key] = "var(--tw-empty,/*!*/ /*!*/)";
      return css;
    }, {
      [prefix + "filter"]: filters.map((key) => `var(--tw-${prefix}${key})`).join(" ")
    });
  }
  $ = params.shift();
  if (includes(["hue", "drop"], $))
    $ += capitalize(params.shift());
  return (_ = theme2(prefix ? "backdrop" + capitalize($) : $, params)) && {
    ["--tw-" + prefix + $]: (Array.isArray(_) ? _ : [_]).map((_4) => `${hyphenate($)}(${_4})`).join(" ")
  };
};
var corePlugins = {
  group: (params, { tag }, id) => tag(join([id, ...params])),
  hidden: alias(display, "none"),
  inline: display,
  block: display,
  contents: display,
  flow: display,
  table: (params, context, id) => includes(["auto", "fixed"], params[0]) ? { tableLayout: params[0] } : display(params, context, id),
  flex(params, context, id) {
    switch (params[0]) {
      case "row":
      case "col":
        return {
          flexDirection: join(params[0] == "col" ? ["column", ...tail(params)] : params)
        };
      case "nowrap":
      case "wrap":
        return { flexWrap: join(params) };
      case "grow":
      case "shrink":
        _ = context.theme("flex" + capitalize(params[0]), tail(params), params[1] || 1);
        return _ != null && {
          ["flex-" + params[0]]: "" + _
        };
    }
    return (_ = context.theme("flex", params, "")) ? { flex: _ } : display(params, context, id);
  },
  grid(params, context, id) {
    switch (params[0]) {
      case "cols":
      case "rows":
        return (_ = context.theme("gridTemplate" + capitalize(toColumnsOrRows(params[0])), tail(params), params.length == 2 && Number(params[1]) ? `repeat(${params[1]},minmax(0,1fr))` : join(tail(params)))) && {
          ["gridTemplate-" + toColumnsOrRows(params[0])]: _
        };
      case "flow":
        return params.length > 1 && {
          gridAutoFlow: join(params[1] == "col" ? ["column", ...tail(params, 2)] : tail(params), " ")
        };
    }
    return display(params, context, id);
  },
  auto: (params, { theme: theme2 }) => includes(["cols", "rows"], params[0]) && (_ = theme2("gridAuto" + capitalize(toColumnsOrRows(params[0])), tail(params), join(tail(params)))) && {
    ["gridAuto-" + toColumnsOrRows(params[0])]: _
  },
  static: position,
  fixed: position,
  absolute: position,
  relative: position,
  sticky: position,
  visible: { visibility: "visible" },
  invisible: { visibility: "hidden" },
  antialiased: {
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale"
  },
  "subpixel-antialiased": {
    WebkitFontSmoothing: "auto",
    MozOsxFontSmoothing: "auto"
  },
  truncate: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  "sr-only": {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    clip: "rect(0,0,0,0)",
    borderWidth: "0"
  },
  "not-sr-only": {
    position: "static",
    width: "auto",
    height: "auto",
    padding: "0",
    margin: "0",
    overflow: "visible",
    whiteSpace: "normal",
    clip: "auto"
  },
  resize: (params) => ({
    resize: { x: "horizontal", y: "vertical" }[params[0]] || params[0] || "both"
  }),
  box: (params) => params[0] && { boxSizing: params[0] + "-box" },
  appearance: propertyValue(),
  cursor: themePropertyFallback(),
  float: propertyValue(),
  clear: propertyValue(),
  decoration: propertyValue("boxDecorationBreak"),
  isolate: { isolation: "isolate" },
  isolation: propertyValue(),
  "mix-blend": propertyValue("mixBlendMode"),
  top: inset,
  right: inset,
  bottom: inset,
  left: inset,
  inset: (params, { theme: theme2 }) => (_ = expandEdges(params[0])) ? edges(theme2("inset", tail(params)), params[0]) : (_ = theme2("inset", params)) && {
    top: _,
    right: _,
    bottom: _,
    left: _
  },
  underline: textDecoration,
  "line-through": textDecoration,
  "no-underline": alias(textDecoration, "none"),
  "text-underline": alias(textDecoration, "underline"),
  "text-no-underline": alias(textDecoration, "none"),
  "text-line-through": alias(textDecoration, "line-through"),
  uppercase: textTransform,
  lowercase: textTransform,
  capitalize: textTransform,
  "normal-case": alias(textTransform, "none"),
  "text-normal-case": alias(textTransform, "none"),
  italic: fontStyle,
  "not-italic": alias(fontStyle, "normal"),
  "font-italic": alias(fontStyle, "italic"),
  "font-not-italic": alias(fontStyle, "normal"),
  font: (params, context, id) => (_ = context.theme("fontFamily", params, "")) ? { fontFamily: _ } : themeProperty("fontWeight")(params, context, id),
  items: (params) => params[0] && {
    alignItems: includes(["start", "end"], params[0]) ? "flex-" + params[0] : join(params)
  },
  "justify-self": propertyValue(),
  "justify-items": propertyValue(),
  justify: contentPluginFor("justifyContent"),
  content: contentPluginFor("alignContent"),
  self: contentPluginFor("alignSelf"),
  place: (params) => params[0] && placeHelper("place-" + params[0], tail(params)),
  overscroll: (params) => params[0] && {
    ["overscrollBehavior" + (params[1] ? "-" + params[0] : "")]: params[1] || params[0]
  },
  col: gridPlugin("column"),
  row: gridPlugin("row"),
  duration: themeProperty("transitionDuration"),
  delay: themeProperty("transitionDelay"),
  tracking: themeProperty("letterSpacing"),
  leading: themeProperty("lineHeight"),
  z: themeProperty("zIndex"),
  opacity: themeProperty(),
  ease: themeProperty("transitionTimingFunction"),
  p: padding,
  py: padding,
  px: padding,
  pt: padding,
  pr: padding,
  pb: padding,
  pl: padding,
  m: margin,
  my: margin,
  mx: margin,
  mt: margin,
  mr: margin,
  mb: margin,
  ml: margin,
  w: themeProperty("width"),
  h: themeProperty("height"),
  min: minMax,
  max: minMax,
  fill: themeProperty(),
  order: themeProperty(),
  origin: themePropertyFallback("transformOrigin", " "),
  select: propertyValue("userSelect"),
  "pointer-events": propertyValue(),
  align: propertyValue("verticalAlign"),
  whitespace: propertyValue("whiteSpace"),
  "normal-nums": { fontVariantNumeric: "normal" },
  ordinal: fontVariantNumeric("ordinal"),
  "slashed-zero": fontVariantNumeric("slashed-zero"),
  "lining-nums": fontVariantNumeric("numeric-figure"),
  "oldstyle-nums": fontVariantNumeric("numeric-figure"),
  "proportional-nums": fontVariantNumeric("numeric-spacing"),
  "tabular-nums": fontVariantNumeric("numeric-spacing"),
  "diagonal-fractions": fontVariantNumeric("numeric-fraction"),
  "stacked-fractions": fontVariantNumeric("numeric-fraction"),
  overflow: (params, context, id) => includes(["ellipsis", "clip"], params[0]) ? propertyValue("textOverflow")(params) : params[1] ? { ["overflow-" + params[0]]: params[1] } : propertyValue()(params, context, id),
  transform: (params) => params[0] == "none" ? { transform: "none" } : {
    "--tw-translate-x": "0",
    "--tw-translate-y": "0",
    "--tw-rotate": "0",
    "--tw-skew-x": "0",
    "--tw-skew-y": "0",
    "--tw-scale-x": "1",
    "--tw-scale-y": "1",
    transform: transform(params[0] == "gpu")
  },
  rotate: (params, { theme: theme2 }) => (_ = theme2("rotate", params)) && {
    "--tw-rotate": _,
    transform: [`rotate(${_})`, transform()]
  },
  scale: transformXYFunction,
  translate: transformXYFunction,
  skew: transformXYFunction,
  gap: (params, context, id) => (_ = { x: "column", y: "row" }[params[0]]) ? { [_ + "Gap"]: context.theme("gap", tail(params)) } : themeProperty("gap")(params, context, id),
  stroke: (params, context, id) => (_ = context.theme("stroke", params, "")) ? { stroke: _ } : themeProperty("strokeWidth")(params, context, id),
  outline: (params, { theme: theme2 }) => (_ = theme2("outline", params)) && {
    outline: _[0],
    outlineOffset: _[1]
  },
  "break-normal": {
    wordBreak: "normal",
    overflowWrap: "normal"
  },
  "break-words": { overflowWrap: "break-word" },
  "break-all": { wordBreak: "break-all" },
  text(params, { theme: theme2 }, id) {
    switch (params[0]) {
      case "left":
      case "center":
      case "right":
      case "justify":
        return { textAlign: params[0] };
      case "uppercase":
      case "lowercase":
      case "capitalize":
        return textTransform([], _, params[0]);
      case "opacity":
        return opacityProperty(params, theme2, id);
    }
    const fontSize = theme2("fontSize", params, "");
    if (fontSize) {
      return typeof fontSize == "string" ? { fontSize } : {
        fontSize: fontSize[0],
        ...typeof fontSize[1] == "string" ? { lineHeight: fontSize[1] } : fontSize[1]
      };
    }
    return withOpacityFallback("color", "text", theme2("textColor", params));
  },
  bg(params, { theme: theme2 }, id) {
    switch (params[0]) {
      case "fixed":
      case "local":
      case "scroll":
        return propertyValue("backgroundAttachment", ",")(params);
      case "bottom":
      case "center":
      case "left":
      case "right":
      case "top":
        return propertyValue("backgroundPosition", " ")(params);
      case "no":
        return params[1] == "repeat" && propertyValue("backgroundRepeat")(params);
      case "repeat":
        return includes("xy", params[1]) ? propertyValue("backgroundRepeat")(params) : { backgroundRepeat: params[1] || params[0] };
      case "opacity":
        return opacityProperty(params, theme2, id, "background");
      case "clip":
      case "origin":
        return params[1] && {
          ["background-" + params[0]]: params[1] + (params[1] == "text" ? "" : "-box")
        };
      case "blend":
        return propertyValue("background-blend-mode")(tail(params));
      case "gradient":
        if (params[1] == "to" && (_ = expandEdges(params[2]))) {
          return {
            backgroundImage: `linear-gradient(to ${join(_, " ")},var(--tw-gradient-stops))`
          };
        }
    }
    return (_ = theme2("backgroundPosition", params, "")) ? { backgroundPosition: _ } : (_ = theme2("backgroundSize", params, "")) ? { backgroundSize: _ } : (_ = theme2("backgroundImage", params, "")) ? { backgroundImage: _ } : withOpacityFallback("backgroundColor", "bg", theme2("backgroundColor", params));
  },
  from: (params, { theme: theme2 }) => (_ = theme2("gradientColorStops", params)) && {
    "--tw-gradient-from": _,
    "--tw-gradient-stops": `var(--tw-gradient-from),var(--tw-gradient-to,${transparentTo(_)})`
  },
  via: (params, { theme: theme2 }) => (_ = theme2("gradientColorStops", params)) && {
    "--tw-gradient-stops": `var(--tw-gradient-from),${_},var(--tw-gradient-to,${transparentTo(_)})`
  },
  to: (params, { theme: theme2 }) => (_ = theme2("gradientColorStops", params)) && {
    "--tw-gradient-to": _
  },
  border: borderEdges,
  divide: (params, context, id) => (_ = reversableEdge(params, context, id, "divideWidth", "border", "width") || border(params, context, id)) && {
    "&>:not([hidden])~:not([hidden])": _
  },
  space: (params, context, id) => (_ = reversableEdge(params, context, id, "space", "margin")) && {
    "&>:not([hidden])~:not([hidden])": _
  },
  placeholder: (params, { theme: theme2 }, id) => (_ = params[0] == "opacity" ? opacityProperty(params, theme2, id) : withOpacityFallback("color", "placeholder", theme2("placeholderColor", params))) && {
    "&::placeholder": _
  },
  shadow: (params, { theme: theme2 }) => (_ = theme2("boxShadow", params)) && {
    ":global": {
      "*": {
        "--tw-shadow": "0 0 transparent"
      }
    },
    "--tw-shadow": _ == "none" ? "0 0 transparent" : _,
    boxShadow: [
      _,
      `var(--tw-ring-offset-shadow,0 0 transparent),var(--tw-ring-shadow,0 0 transparent),var(--tw-shadow)`
    ]
  },
  animate: (params, { theme: theme2, tag }) => {
    if ($ = theme2("animation", params)) {
      const parts = $.split(" ");
      if ((_ = theme2("keyframes", parts[0], __ = {})) !== __) {
        return ($ = tag(parts[0])) && {
          animation: $ + " " + join(tail(parts), " "),
          ["@keyframes " + $]: _
        };
      }
      return { animation: $ };
    }
  },
  ring(params, { theme: theme2 }, id) {
    switch (params[0]) {
      case "inset":
        return { "--tw-ring-inset": "inset" };
      case "opacity":
        return opacityProperty(params, theme2, id);
      case "offset":
        return (_ = theme2("ringOffsetWidth", tail(params), "")) ? {
          "--tw-ring-offset-width": _
        } : {
          "--tw-ring-offset-color": theme2("ringOffsetColor", tail(params))
        };
    }
    return (_ = theme2("ringWidth", params, "")) ? {
      "--tw-ring-offset-shadow": `var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)`,
      "--tw-ring-shadow": `var(--tw-ring-inset) 0 0 0 calc(${_} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
      boxShadow: `var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 transparent)`,
      ":global": {
        "*": {
          "--tw-ring-inset": "var(--tw-empty,/*!*/ /*!*/)",
          "--tw-ring-offset-width": theme2("ringOffsetWidth", "", "0px"),
          "--tw-ring-offset-color": theme2("ringOffsetColor", "", "#fff"),
          "--tw-ring-color": asRGBA(theme2("ringColor", "", "#93c5fd"), "ring-opacity", theme2("ringOpacity", "", "0.5")),
          "--tw-ring-offset-shadow": "0 0 transparent",
          "--tw-ring-shadow": "0 0 transparent"
        }
      }
    } : {
      "--tw-ring-opacity": "1",
      "--tw-ring-color": asRGBA(theme2("ringColor", params), "ring-opacity")
    };
  },
  object: (params, context, id) => includes(["contain", "cover", "fill", "none", "scale-down"], join(params)) ? { objectFit: join(params) } : themePropertyFallback("objectPosition", " ")(params, context, id),
  list: (params, context, id) => join(params) == "item" ? display(params, context, id) : includes(["inside", "outside"], join(params)) ? { listStylePosition: params[0] } : themePropertyFallback("listStyleType")(params, context, id),
  rounded: (params, context, id) => corners(context.theme("borderRadius", tail(params), ""), params[0], "border", "radius") || themeProperty("borderRadius")(params, context, id),
  "transition-none": { transitionProperty: "none" },
  transition: (params, { theme: theme2 }) => ({
    transitionProperty: theme2("transitionProperty", params),
    transitionTimingFunction: theme2("transitionTimingFunction", ""),
    transitionDuration: theme2("transitionDuration", "")
  }),
  container: (params, { theme: theme2 }) => {
    const { screens = theme2("screens"), center, padding: padding2 } = theme2("container");
    const paddingFor = (screen) => (_ = padding2 && (typeof padding2 == "string" ? padding2 : padding2[screen] || padding2.DEFAULT)) ? {
      paddingRight: _,
      paddingLeft: _
    } : {};
    return Object.keys(screens).reduce((rules2, screen) => {
      if (($ = screens[screen]) && typeof $ == "string") {
        rules2[buildMediaQuery($)] = {
          "&": {
            "max-width": $,
            ...paddingFor(screen)
          }
        };
      }
      return rules2;
    }, {
      width: "100%",
      ...center ? { marginRight: "auto", marginLeft: "auto" } : {},
      ...paddingFor("xs")
    });
  },
  filter,
  blur: filter,
  brightness: filter,
  contrast: filter,
  grayscale: filter,
  "hue-rotate": filter,
  invert: filter,
  saturate: filter,
  sepia: filter,
  "drop-shadow": filter,
  backdrop: filter
};
var createPreflight = (theme2) => ({
  ":root": { tabSize: 4 },
  "body,blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre,fieldset,ol,ul": { margin: "0" },
  button: { backgroundColor: "transparent", backgroundImage: "none" },
  'button,[type="button"],[type="reset"],[type="submit"]': { WebkitAppearance: "button" },
  "button:focus": { outline: ["1px dotted", "5px auto -webkit-focus-ring-color"] },
  "fieldset,ol,ul,legend": { padding: "0" },
  "ol,ul": { listStyle: "none" },
  html: {
    lineHeight: "1.5",
    WebkitTextSizeAdjust: "100%",
    fontFamily: theme2("fontFamily.sans", "ui-sans-serif,system-ui,sans-serif")
  },
  body: { fontFamily: "inherit", lineHeight: "inherit" },
  "*,::before,::after": {
    boxSizing: "border-box",
    border: `0 solid ${theme2("borderColor.DEFAULT", "currentColor")}`
  },
  hr: { height: "0", color: "inherit", borderTopWidth: "1px" },
  img: { borderStyle: "solid" },
  textarea: { resize: "vertical" },
  "input::placeholder,textarea::placeholder": {
    opacity: "1",
    color: theme2("placeholderColor.DEFAULT", theme2("colors.gray.400", "#a1a1aa"))
  },
  'button,[role="button"]': { cursor: "pointer" },
  table: { textIndent: "0", borderColor: "inherit", borderCollapse: "collapse" },
  "h1,h2,h3,h4,h5,h6": { fontSize: "inherit", fontWeight: "inherit" },
  a: { color: "inherit", textDecoration: "inherit" },
  "button,input,optgroup,select,textarea": {
    fontFamily: "inherit",
    fontSize: "100%",
    margin: "0",
    padding: "0",
    lineHeight: "inherit",
    color: "inherit"
  },
  "button,select": { textTransform: "none" },
  "::-moz-focus-inner": { borderStyle: "none", padding: "0" },
  ":-moz-focusring": { outline: "1px dotted ButtonText" },
  ":-moz-ui-invalid": { boxShadow: "none" },
  progress: { verticalAlign: "baseline" },
  "::-webkit-inner-spin-button,::-webkit-outer-spin-button": { height: "auto" },
  '[type="search"]': { WebkitAppearance: "textfield", outlineOffset: "-2px" },
  "::-webkit-search-decoration": { WebkitAppearance: "none" },
  "::-webkit-file-upload-button": { WebkitAppearance: "button", font: "inherit" },
  summary: { display: "list-item" },
  "abbr[title]": { textDecoration: "underline dotted" },
  "b,strong": { fontWeight: "bolder" },
  "pre,code,kbd,samp": {
    fontFamily: theme2("fontFamily", "mono", "ui-monospace,monospace"),
    fontSize: "1em"
  },
  "sub,sup": { fontSize: "75%", lineHeight: "0", position: "relative", verticalAlign: "baseline" },
  sub: { bottom: "-0.25em" },
  sup: { top: "-0.5em" },
  "img,svg,video,canvas,audio,iframe,embed,object": { display: "block", verticalAlign: "middle" },
  "img,video": { maxWidth: "100%", height: "auto" }
});
var coreVariants = {
  dark: "@media (prefers-color-scheme:dark)",
  sticky: "@supports ((position: -webkit-sticky) or (position:sticky))",
  "motion-reduce": "@media (prefers-reduced-motion:reduce)",
  "motion-safe": "@media (prefers-reduced-motion:no-preference)",
  first: "&:first-child",
  last: "&:last-child",
  even: "&:nth-child(2n)",
  odd: "&:nth-child(odd)",
  children: "&>*",
  siblings: "&~*",
  sibling: "&+*",
  override: "&&"
};
var STYLE_ELEMENT_ID$1 = "__twind";
var getStyleElement = (nonce) => {
  let element = self[STYLE_ELEMENT_ID$1];
  if (!element) {
    element = document.head.appendChild(document.createElement("style"));
    element.id = STYLE_ELEMENT_ID$1;
    nonce && (element.nonce = nonce);
    element.appendChild(document.createTextNode(""));
  }
  return element;
};
var cssomSheet = ({
  nonce,
  target: target2 = getStyleElement(nonce).sheet
} = {}) => {
  const offset = target2.cssRules.length;
  return {
    target: target2,
    insert: (rule, index) => target2.insertRule(rule, offset + index)
  };
};
var voidSheet = () => ({
  target: null,
  insert: noop$1
});
var mode = (report) => ({
  unknown(section, key = [], optional, context) {
    if (!optional) {
      this.report({ id: "UNKNOWN_THEME_VALUE", key: section + "." + join(key) }, context);
    }
  },
  report({ id, ...info }) {
    return report(`[${id}] ${JSON.stringify(info)}`);
  }
});
var warn = /* @__PURE__ */ mode((message) => console.warn(message));
var strict = /* @__PURE__ */ mode((message) => {
  throw new Error(message);
});
var silent = /* @__PURE__ */ mode(noop$1);
var noprefix = (property2, value, important) => `${property2}:${value}${important ? " !important" : ""}`;
var autoprefix = (property2, value, important) => {
  let cssText = "";
  const propertyAlias = r(property2);
  if (propertyAlias)
    cssText += `${noprefix(propertyAlias, value, important)};`;
  let flags = a(property2);
  if (flags & 1)
    cssText += `-webkit-${noprefix(property2, value, important)};`;
  if (flags & 2)
    cssText += `-moz-${noprefix(property2, value, important)};`;
  if (flags & 4)
    cssText += `-ms-${noprefix(property2, value, important)};`;
  flags = t(property2, value);
  if (flags & 1)
    cssText += `${noprefix(property2, `-webkit-${value}`, important)};`;
  if (flags & 2)
    cssText += `${noprefix(property2, `-moz-${value}`, important)};`;
  if (flags & 4)
    cssText += `${noprefix(property2, `-ms-${value}`, important)};`;
  cssText += noprefix(property2, value, important);
  return cssText;
};
var ratios = (start, end) => {
  const result = {};
  do {
    for (let dividend = 1; dividend < start; dividend++) {
      result[`${dividend}/${start}`] = Number((dividend / start * 100).toFixed(6)) + "%";
    }
  } while (++start <= end);
  return result;
};
var exponential = (stop, unit, start = 0) => {
  const result = {};
  for (; start <= stop; start = start * 2 || 1) {
    result[start] = start + unit;
  }
  return result;
};
var linear = (stop, unit = "", divideBy = 1, start = 0, step = 1, result = {}) => {
  for (; start <= stop; start += step) {
    result[start] = start / divideBy + unit;
  }
  return result;
};
var alias2 = (section) => (theme2) => theme2(section);
var defaultTheme = {
  screens: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px"
  },
  colors: {
    transparent: "transparent",
    current: "currentColor",
    black: "#000",
    white: "#fff",
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827"
    },
    red: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d"
    },
    yellow: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f"
    },
    green: {
      50: "#ecfdf5",
      100: "#d1fae5",
      200: "#a7f3d0",
      300: "#6ee7b7",
      400: "#34d399",
      500: "#10b981",
      600: "#059669",
      700: "#047857",
      800: "#065f46",
      900: "#064e3b"
    },
    blue: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a"
    },
    indigo: {
      50: "#eef2ff",
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#6366f1",
      600: "#4f46e5",
      700: "#4338ca",
      800: "#3730a3",
      900: "#312e81"
    },
    purple: {
      50: "#f5f3ff",
      100: "#ede9fe",
      200: "#ddd6fe",
      300: "#c4b5fd",
      400: "#a78bfa",
      500: "#8b5cf6",
      600: "#7c3aed",
      700: "#6d28d9",
      800: "#5b21b6",
      900: "#4c1d95"
    },
    pink: {
      50: "#fdf2f8",
      100: "#fce7f3",
      200: "#fbcfe8",
      300: "#f9a8d4",
      400: "#f472b6",
      500: "#ec4899",
      600: "#db2777",
      700: "#be185d",
      800: "#9d174d",
      900: "#831843"
    }
  },
  spacing: {
    px: "1px",
    0: "0px",
    .../* @__PURE__ */ linear(4, "rem", 4, 0.5, 0.5),
    .../* @__PURE__ */ linear(12, "rem", 4, 5),
    14: "3.5rem",
    .../* @__PURE__ */ linear(64, "rem", 4, 16, 4),
    72: "18rem",
    80: "20rem",
    96: "24rem"
  },
  durations: {
    75: "75ms",
    100: "100ms",
    150: "150ms",
    200: "200ms",
    300: "300ms",
    500: "500ms",
    700: "700ms",
    1e3: "1000ms"
  },
  animation: {
    none: "none",
    spin: "spin 1s linear infinite",
    ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
    pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    bounce: "bounce 1s infinite"
  },
  backdropBlur: /* @__PURE__ */ alias2("blur"),
  backdropBrightness: /* @__PURE__ */ alias2("brightness"),
  backdropContrast: /* @__PURE__ */ alias2("contrast"),
  backdropGrayscale: /* @__PURE__ */ alias2("grayscale"),
  backdropHueRotate: /* @__PURE__ */ alias2("hueRotate"),
  backdropInvert: /* @__PURE__ */ alias2("invert"),
  backdropOpacity: /* @__PURE__ */ alias2("opacity"),
  backdropSaturate: /* @__PURE__ */ alias2("saturate"),
  backdropSepia: /* @__PURE__ */ alias2("sepia"),
  backgroundColor: /* @__PURE__ */ alias2("colors"),
  backgroundImage: {
    none: "none"
  },
  backgroundOpacity: /* @__PURE__ */ alias2("opacity"),
  backgroundSize: {
    auto: "auto",
    cover: "cover",
    contain: "contain"
  },
  blur: {
    0: "0",
    sm: "4px",
    DEFAULT: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "40px",
    "3xl": "64px"
  },
  brightness: {
    .../* @__PURE__ */ linear(200, "", 100, 0, 50),
    .../* @__PURE__ */ linear(110, "", 100, 90, 5),
    75: "0.75",
    125: "1.25"
  },
  borderColor: (theme2) => ({
    ...theme2("colors"),
    DEFAULT: theme2("colors.gray.200", "currentColor")
  }),
  borderOpacity: /* @__PURE__ */ alias2("opacity"),
  borderRadius: {
    none: "0px",
    sm: "0.125rem",
    DEFAULT: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    "1/2": "50%",
    full: "9999px"
  },
  borderWidth: {
    DEFAULT: "1px",
    .../* @__PURE__ */ exponential(8, "px")
  },
  boxShadow: {
    sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
    DEFAULT: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)",
    md: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
    lg: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
    xl: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
    "2xl": "0 25px 50px -12px rgba(0,0,0,0.25)",
    inner: "inset 0 2px 4px 0 rgba(0,0,0,0.06)",
    none: "none"
  },
  contrast: {
    .../* @__PURE__ */ linear(200, "", 100, 0, 50),
    75: "0.75",
    125: "1.25"
  },
  divideColor: /* @__PURE__ */ alias2("borderColor"),
  divideOpacity: /* @__PURE__ */ alias2("borderOpacity"),
  divideWidth: /* @__PURE__ */ alias2("borderWidth"),
  dropShadow: {
    sm: "0 1px 1px rgba(0,0,0,0.05)",
    DEFAULT: ["0 1px 2px rgba(0,0,0,0.1)", "0 1px 1px rgba(0,0,0,0.06)"],
    md: ["0 4px 3px rgba(0,0,0,0.07)", "0 2px 2px rgba(0,0,0,0.06)"],
    lg: ["0 10px 8px rgba(0,0,0,0.04)", "0 4px 3px rgba(0,0,0,0.1)"],
    xl: ["0 20px 13px rgba(0,0,0,0.03)", "0 8px 5px rgba(0,0,0,0.08)"],
    "2xl": "0 25px 25px rgba(0,0,0,0.15)",
    none: "0 0 #0000"
  },
  fill: { current: "currentColor" },
  grayscale: {
    0: "0",
    DEFAULT: "100%"
  },
  hueRotate: {
    0: "0deg",
    15: "15deg",
    30: "30deg",
    60: "60deg",
    90: "90deg",
    180: "180deg"
  },
  invert: {
    0: "0",
    DEFAULT: "100%"
  },
  flex: {
    1: "1 1 0%",
    auto: "1 1 auto",
    initial: "0 1 auto",
    none: "none"
  },
  fontFamily: {
    sans: 'ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"'.split(","),
    serif: 'ui-serif,Georgia,Cambria,"Times New Roman",Times,serif'.split(","),
    mono: 'ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace'.split(",")
  },
  fontSize: {
    xs: ["0.75rem", "1rem"],
    sm: ["0.875rem", "1.25rem"],
    base: ["1rem", "1.5rem"],
    lg: ["1.125rem", "1.75rem"],
    xl: ["1.25rem", "1.75rem"],
    "2xl": ["1.5rem", "2rem"],
    "3xl": ["1.875rem", "2.25rem"],
    "4xl": ["2.25rem", "2.5rem"],
    "5xl": ["3rem", "1"],
    "6xl": ["3.75rem", "1"],
    "7xl": ["4.5rem", "1"],
    "8xl": ["6rem", "1"],
    "9xl": ["8rem", "1"]
  },
  fontWeight: {
    thin: "100",
    extralight: "200",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900"
  },
  gridTemplateColumns: {},
  gridTemplateRows: {},
  gridAutoColumns: {
    min: "min-content",
    max: "max-content",
    fr: "minmax(0,1fr)"
  },
  gridAutoRows: {
    min: "min-content",
    max: "max-content",
    fr: "minmax(0,1fr)"
  },
  gridColumn: {
    auto: "auto",
    "span-full": "1 / -1"
  },
  gridRow: {
    auto: "auto",
    "span-full": "1 / -1"
  },
  gap: /* @__PURE__ */ alias2("spacing"),
  gradientColorStops: /* @__PURE__ */ alias2("colors"),
  height: (theme2) => ({
    auto: "auto",
    ...theme2("spacing"),
    ...ratios(2, 6),
    full: "100%",
    screen: "100vh"
  }),
  inset: (theme2) => ({
    auto: "auto",
    ...theme2("spacing"),
    ...ratios(2, 4),
    full: "100%"
  }),
  keyframes: {
    spin: {
      from: {
        transform: "rotate(0deg)"
      },
      to: {
        transform: "rotate(360deg)"
      }
    },
    ping: {
      "0%": {
        transform: "scale(1)",
        opacity: "1"
      },
      "75%,100%": {
        transform: "scale(2)",
        opacity: "0"
      }
    },
    pulse: {
      "0%,100%": {
        opacity: "1"
      },
      "50%": {
        opacity: ".5"
      }
    },
    bounce: {
      "0%, 100%": {
        transform: "translateY(-25%)",
        animationTimingFunction: "cubic-bezier(0.8,0,1,1)"
      },
      "50%": {
        transform: "none",
        animationTimingFunction: "cubic-bezier(0,0,0.2,1)"
      }
    }
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em"
  },
  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
    .../* @__PURE__ */ linear(10, "rem", 4, 3)
  },
  margin: (theme2) => ({
    auto: "auto",
    ...theme2("spacing")
  }),
  maxHeight: (theme2) => ({
    ...theme2("spacing"),
    full: "100%",
    screen: "100vh"
  }),
  maxWidth: (theme2, { breakpoints }) => ({
    none: "none",
    0: "0rem",
    xs: "20rem",
    sm: "24rem",
    md: "28rem",
    lg: "32rem",
    xl: "36rem",
    "2xl": "42rem",
    "3xl": "48rem",
    "4xl": "56rem",
    "5xl": "64rem",
    "6xl": "72rem",
    "7xl": "80rem",
    full: "100%",
    min: "min-content",
    max: "max-content",
    prose: "65ch",
    ...breakpoints(theme2("screens"))
  }),
  minHeight: {
    0: "0px",
    full: "100%",
    screen: "100vh"
  },
  minWidth: {
    0: "0px",
    full: "100%",
    min: "min-content",
    max: "max-content"
  },
  opacity: {
    .../* @__PURE__ */ linear(100, "", 100, 0, 10),
    5: "0.05",
    25: "0.25",
    75: "0.75",
    95: "0.95"
  },
  order: {
    first: "-9999",
    last: "9999",
    none: "0",
    .../* @__PURE__ */ linear(12, "", 1, 1)
  },
  outline: {
    none: ["2px solid transparent", "2px"],
    white: ["2px dotted white", "2px"],
    black: ["2px dotted black", "2px"]
  },
  padding: /* @__PURE__ */ alias2("spacing"),
  placeholderColor: /* @__PURE__ */ alias2("colors"),
  placeholderOpacity: /* @__PURE__ */ alias2("opacity"),
  ringColor: (theme2) => ({
    DEFAULT: theme2("colors.blue.500", "#3b82f6"),
    ...theme2("colors")
  }),
  ringOffsetColor: /* @__PURE__ */ alias2("colors"),
  ringOffsetWidth: /* @__PURE__ */ exponential(8, "px"),
  ringOpacity: (theme2) => ({
    DEFAULT: "0.5",
    ...theme2("opacity")
  }),
  ringWidth: {
    DEFAULT: "3px",
    .../* @__PURE__ */ exponential(8, "px")
  },
  rotate: {
    .../* @__PURE__ */ exponential(2, "deg"),
    .../* @__PURE__ */ exponential(12, "deg", 3),
    .../* @__PURE__ */ exponential(180, "deg", 45)
  },
  saturate: /* @__PURE__ */ linear(200, "", 100, 0, 50),
  scale: {
    .../* @__PURE__ */ linear(150, "", 100, 0, 50),
    .../* @__PURE__ */ linear(110, "", 100, 90, 5),
    75: "0.75",
    125: "1.25"
  },
  sepia: {
    0: "0",
    DEFAULT: "100%"
  },
  skew: {
    .../* @__PURE__ */ exponential(2, "deg"),
    .../* @__PURE__ */ exponential(12, "deg", 3)
  },
  space: /* @__PURE__ */ alias2("spacing"),
  stroke: {
    current: "currentColor"
  },
  strokeWidth: /* @__PURE__ */ linear(2),
  textColor: /* @__PURE__ */ alias2("colors"),
  textOpacity: /* @__PURE__ */ alias2("opacity"),
  transitionDuration: (theme2) => ({
    DEFAULT: "150ms",
    ...theme2("durations")
  }),
  transitionDelay: /* @__PURE__ */ alias2("durations"),
  transitionProperty: {
    none: "none",
    all: "all",
    DEFAULT: "background-color,border-color,color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter",
    colors: "background-color,border-color,color,fill,stroke",
    opacity: "opacity",
    shadow: "box-shadow",
    transform: "transform"
  },
  transitionTimingFunction: {
    DEFAULT: "cubic-bezier(0.4,0,0.2,1)",
    linear: "linear",
    in: "cubic-bezier(0.4,0,1,1)",
    out: "cubic-bezier(0,0,0.2,1)",
    "in-out": "cubic-bezier(0.4,0,0.2,1)"
  },
  translate: (theme2) => ({
    ...theme2("spacing"),
    ...ratios(2, 4),
    full: "100%"
  }),
  width: (theme2) => ({
    auto: "auto",
    ...theme2("spacing"),
    ...ratios(2, 6),
    ...ratios(12, 12),
    screen: "100vw",
    full: "100%",
    min: "min-content",
    max: "max-content"
  }),
  zIndex: {
    auto: "auto",
    .../* @__PURE__ */ linear(50, "", 1, 0, 10)
  }
};
var flattenColorPalette = (colors, target2 = {}, prefix = []) => {
  Object.keys(colors).forEach((property2) => {
    const value = colors[property2];
    if (property2 == "DEFAULT") {
      target2[join(prefix)] = value;
      target2[join(prefix, ".")] = value;
    }
    const key = [...prefix, property2];
    target2[join(key)] = value;
    target2[join(key, ".")] = value;
    if (value && typeof value == "object") {
      flattenColorPalette(value, target2, key);
    }
  }, target2);
  return target2;
};
var resolveContext = {
  negative: () => ({}),
  breakpoints: (screens) => Object.keys(screens).filter((key) => typeof screens[key] == "string").reduce((target2, key) => {
    target2["screen-" + key] = screens[key];
    return target2;
  }, {})
};
var handleArbitraryValues = (section, key) => (key = key[0] == "[" && key.slice(-1) == "]" && key.slice(1, -1)) && includes(section, "olor") == /^(#|(hsl|rgb)a?\(|[a-z]+$)/.test(key) && (includes(key, "calc(") ? key.replace(/(-?\d*\.?\d(?!\b-.+[,)](?![^+\-/*])\D)(?:%|[a-z]+)?|\))([+\-/*])/g, "$1 $2 ") : key);
var makeThemeResolver = (config) => {
  const cache = /* @__PURE__ */ new Map();
  const theme2 = { ...defaultTheme, ...config };
  const deref = (theme3, section) => {
    const base = theme3 && theme3[section];
    const value = typeof base == "function" ? base(resolve, resolveContext) : base;
    return value && section == "colors" ? flattenColorPalette(value) : value;
  };
  const resolve = (section, key, defaultValue) => {
    const keypath = section.split(".");
    section = keypath[0];
    if (keypath.length > 1) {
      defaultValue = key;
      key = join(tail(keypath), ".");
    }
    let base = cache.get(section);
    if (!base) {
      cache.set(section, base = { ...deref(theme2, section) });
      Object.assign(base, deref(theme2.extend, section));
    }
    if (key != null) {
      key = (Array.isArray(key) ? join(key) : key) || "DEFAULT";
      const value = handleArbitraryValues(section, key) || base[key];
      return value == null ? defaultValue : Array.isArray(value) && !includes(["fontSize", "outline", "dropShadow"], section) ? join(value, ",") : value;
    }
    return base;
  };
  return resolve;
};
var translate = (plugins, context) => (rule, isTranslating) => {
  if (typeof rule.d == "function") {
    return rule.d(context);
  }
  const parameters = rule.d.split(/-(?![^[]*])/g);
  if (!isTranslating && parameters[0] == "tw" && rule.$ == rule.d) {
    return rule.$;
  }
  for (let index = parameters.length; index; index--) {
    const id = join(parameters.slice(0, index));
    if (Object.prototype.hasOwnProperty.call(plugins, id)) {
      const plugin = plugins[id];
      return typeof plugin == "function" ? plugin(tail(parameters, index), context, id) : typeof plugin == "string" ? context[isTranslating ? "css" : "tw"](plugin) : plugin;
    }
  }
};
var _2;
var GROUP_RE = /^:(group(?:(?!-focus).+?)*)-(.+)$/;
var NOT_PREFIX_RE = /^(:not)-(.+)/;
var prepareVariantSelector = (variant) => variant[1] == "[" ? tail(variant) : variant;
var decorate = (darkMode, variants, { theme: theme2, tag }) => {
  const applyVariant = (translation, variant) => {
    if (_2 = theme2("screens", tail(variant), "")) {
      return { [buildMediaQuery(_2)]: translation };
    }
    if (variant == ":dark" && darkMode == "class") {
      return { ".dark &": translation };
    }
    if (_2 = GROUP_RE.exec(variant)) {
      return { [`.${escape(tag(_2[1]))}:${_2[2]} &`]: translation };
    }
    return {
      [variants[tail(variant)] || "&" + variant.replace(NOT_PREFIX_RE, (_4, not2, variant2) => not2 + "(" + prepareVariantSelector(":" + variant2) + ")")]: translation
    };
  };
  return (translation, rule) => rule.v.reduceRight(applyVariant, translation);
};
var _3;
var responsivePrecedence = (css) => (((_3 = /(?:^|min-width: *)(\d+(?:.\d+)?)(p)?/.exec(css)) ? +_3[1] / (_3[2] ? 15 : 1) / 10 : 0) & 31) << 22;
var seperatorPrecedence = (string) => {
  _3 = 0;
  for (let index = string.length; index--; ) {
    _3 += includes("-:,", string[index]);
  }
  return _3;
};
var atRulePresedence = (css) => (seperatorPrecedence(css) & 15) << 18;
var PRECEDENCES_BY_PSEUDO_CLASS = [
  "rst",
  "st",
  "en",
  "d",
  "nk",
  "sited",
  "pty",
  "ecked",
  "cus-w",
  "ver",
  "cus",
  "cus-v",
  "tive",
  "sable",
  "ad-on",
  "tiona",
  "quire"
];
var pseudoPrecedence = (pseudoClass) => 1 << (~(_3 = PRECEDENCES_BY_PSEUDO_CLASS.indexOf(pseudoClass.replace(GROUP_RE, ":$2").slice(3, 8))) ? _3 : 17);
var makeVariantPresedenceCalculator = (theme2, variants) => (presedence, variant) => presedence | ((_3 = theme2("screens", tail(variant), "")) ? 1 << 27 | responsivePrecedence(buildMediaQuery(_3)) : variant == ":dark" ? 1 << 30 : (_3 = variants[variant] || variant.replace(NOT_PREFIX_RE, ":$2"))[0] == "@" ? atRulePresedence(_3) : pseudoPrecedence(variant));
var declarationPropertyPrecedence = (property2) => property2[0] == "-" ? 0 : seperatorPrecedence(property2) + ((_3 = /^(?:(border-(?!w|c|sty)|[tlbr].{2,4}m?$|c.{7}$)|([fl].{5}l|g.{8}$|pl))/.exec(property2)) ? +!!_3[1] || -!!_3[2] : 0) + 1;
var stringifyBlock = (body, selector) => selector + "{" + body + "}";
var serialize = (prefix, variants, context) => {
  const { theme: theme2, tag } = context;
  const tagVar = (_4, property2) => "--" + tag(property2);
  const tagVars = (value) => `${value}`.replace(/--(tw-[\w-]+)\b/g, tagVar);
  const stringifyDeclaration = (property2, value, important) => {
    property2 = tagVars(property2);
    return Array.isArray(value) ? join(value.filter(Boolean).map((value2) => prefix(property2, tagVars(value2), important)), ";") : prefix(property2, tagVars(value), important);
  };
  let rules2;
  const stringify2 = (atRules, selector, presedence, css, important) => {
    if (Array.isArray(css)) {
      css.forEach((css2) => css2 && stringify2(atRules, selector, presedence, css2, important));
      return;
    }
    let declarations = "";
    let maxPropertyPresedence = 0;
    let numberOfDeclarations = 0;
    if (css["@apply"]) {
      css = merge(evalThunk(apply(css["@apply"]), context), { ...css, "@apply": void 0 }, context);
    }
    Object.keys(css).forEach((key) => {
      const value = evalThunk(css[key], context);
      if (isCSSProperty(key, value)) {
        if (value !== "" && key.length > 1) {
          const property2 = hyphenate(key);
          numberOfDeclarations += 1;
          maxPropertyPresedence = Math.max(maxPropertyPresedence, declarationPropertyPrecedence(property2));
          declarations = (declarations && declarations + ";") + stringifyDeclaration(property2, value, important);
        }
      } else if (value) {
        if (key == ":global") {
          key = "@global";
        }
        if (key[0] == "@") {
          if (key[1] == "g") {
            stringify2([], "", 0, value, important);
          } else if (key[1] == "f") {
            stringify2([], key, 0, value, important);
          } else if (key[1] == "k") {
            const currentSize = rules2.length;
            stringify2([], "", 0, value, important);
            const waypoints = rules2.splice(currentSize, rules2.length - currentSize);
            rules2.push({
              r: stringifyBlock(join(waypoints.map((p) => p.r), ""), key),
              p: waypoints.reduce((sum2, p) => sum2 + p.p, 0)
            });
          } else if (key[1] == "i") {
            (Array.isArray(value) ? value : [value]).forEach((value2) => value2 && rules2.push({ p: 0, r: `${key} ${value2};` }));
          } else {
            if (key[2] == "c") {
              key = buildMediaQuery(context.theme("screens", tail(key, 8).trim()));
            }
            stringify2([...atRules, key], selector, presedence | responsivePrecedence(key) | atRulePresedence(key), value, important);
          }
        } else {
          stringify2(atRules, selector ? selector.replace(/ *((?:\(.+?\)|\[.+?\]|[^,])+) *(,|$)/g, (_4, selectorPart, comma2) => key.replace(/ *((?:\(.+?\)|\[.+?\]|[^,])+) *(,|$)/g, (_5, keyPart, comma22) => (includes(keyPart, "&") ? keyPart.replace(/&/g, selectorPart) : (selectorPart && selectorPart + " ") + keyPart) + comma22) + comma2) : key, presedence, value, important);
        }
      }
    });
    if (numberOfDeclarations) {
      rules2.push({
        r: atRules.reduceRight(stringifyBlock, stringifyBlock(declarations, selector)),
        p: presedence * (1 << 8) + ((Math.max(0, 15 - numberOfDeclarations) & 15) << 4 | (maxPropertyPresedence || 15) & 15)
      });
    }
  };
  const variantPresedence = makeVariantPresedenceCalculator(theme2, variants);
  return (css, className, rule, layer = 0) => {
    layer <<= 28;
    rules2 = [];
    stringify2([], className ? "." + escape(className) : "", rule ? rule.v.reduceRight(variantPresedence, layer) : layer, css, rule && rule.i);
    return rules2;
  };
};
var inject = (sheet, mode2, init, context) => {
  let sortedPrecedences;
  init((value = []) => sortedPrecedences = value);
  let insertedRules;
  init((value = /* @__PURE__ */ new Set()) => insertedRules = value);
  return ({ r: css, p: presedence }) => {
    if (!insertedRules.has(css)) {
      insertedRules.add(css);
      const index = sortedInsertionIndex(sortedPrecedences, presedence);
      try {
        sheet.insert(css, index);
        sortedPrecedences.splice(index, 0, presedence);
      } catch (error) {
        if (!/:-[mwo]/.test(css)) {
          mode2.report({ id: "INJECT_CSS_ERROR", css, error }, context);
        }
      }
    }
  };
};
var sanitize = (value, defaultValue, disabled, enabled = defaultValue) => value === false ? disabled : value === true ? enabled : value || defaultValue;
var loadMode = (mode2) => (typeof mode2 == "string" ? { t: strict, a: warn, i: silent }[mode2[1]] : mode2) || warn;
var COMPONENT_PROPS = { _: { value: "", writable: true } };
var configure = (config = {}) => {
  const theme2 = makeThemeResolver(config.theme);
  const mode2 = loadMode(config.mode);
  const hash = sanitize(config.hash, false, false, cyrb32);
  const important = config.important;
  let activeRule = { v: [] };
  let translateDepth = 0;
  const lastTranslations = [];
  const context = {
    tw: (...tokens) => process(tokens),
    theme: (section, key, defaultValue) => {
      var _a;
      const value = (_a = theme2(section, key, defaultValue)) != null ? _a : mode2.unknown(section, key == null || Array.isArray(key) ? key : key.split("."), defaultValue != null, context);
      return activeRule.n && value && includes("rg", (typeof value)[5]) ? `calc(${value} * -1)` : value;
    },
    tag: (value) => hash ? hash(value) : value,
    css: (rules2) => {
      translateDepth++;
      const lastTranslationsIndex = lastTranslations.length;
      try {
        ;
        (typeof rules2 == "string" ? parse([rules2]) : rules2).forEach(convert);
        const css = Object.create(null, COMPONENT_PROPS);
        for (let index = lastTranslationsIndex; index < lastTranslations.length; index++) {
          const translation = lastTranslations[index];
          if (translation) {
            switch (typeof translation) {
              case "object":
                merge(css, translation, context);
                break;
              case "string":
                css._ += (css._ && " ") + translation;
            }
          }
        }
        return css;
      } finally {
        lastTranslations.length = lastTranslationsIndex;
        translateDepth--;
      }
    }
  };
  const translate2 = translate({ ...corePlugins, ...config.plugins }, context);
  const doTranslate = (rule) => {
    const parentRule = activeRule;
    activeRule = rule;
    try {
      return evalThunk(translate2(rule), context);
    } finally {
      activeRule = parentRule;
    }
  };
  const variants = { ...coreVariants, ...config.variants };
  const decorate2 = decorate(config.darkMode || "media", variants, context);
  const serialize2 = serialize(sanitize(config.prefix, autoprefix, noprefix), variants, context);
  const sheet = config.sheet || (typeof window == "undefined" ? voidSheet() : cssomSheet(config));
  const { init = (callback) => callback() } = sheet;
  const inject2 = inject(sheet, mode2, init, context);
  let idToClassName;
  init((value = /* @__PURE__ */ new Map()) => idToClassName = value);
  const inlineDirectiveName = /* @__PURE__ */ new WeakMap();
  const evaluateFunctions = (key, value) => key == "_" ? void 0 : typeof value == "function" ? JSON.stringify(evalThunk(value, context), evaluateFunctions) : value;
  const convert = (rule) => {
    if (!translateDepth && activeRule.v.length) {
      rule = { ...rule, v: [...activeRule.v, ...rule.v], $: "" };
    }
    if (!rule.$) {
      rule.$ = stringifyRule(rule, inlineDirectiveName.get(rule.d));
    }
    let className = translateDepth ? null : idToClassName.get(rule.$);
    if (className == null) {
      let translation = doTranslate(rule);
      if (!rule.$) {
        rule.$ = cyrb32(JSON.stringify(translation, evaluateFunctions));
        inlineDirectiveName.set(rule.d, rule.$);
        rule.$ = stringifyRule(rule, rule.$);
      }
      if (translation && typeof translation == "object") {
        rule.v = rule.v.map(prepareVariantSelector);
        if (important)
          rule.i = important;
        translation = decorate2(translation, rule);
        if (translateDepth) {
          lastTranslations.push(translation);
        } else {
          const layer = typeof rule.d == "function" ? typeof translation._ == "string" ? 1 : 3 : 2;
          className = hash || typeof rule.d == "function" ? (hash || cyrb32)(layer + rule.$) : rule.$;
          serialize2(translation, className, rule, layer).forEach(inject2);
          if (translation._) {
            className += " " + translation._;
          }
        }
      } else {
        if (typeof translation == "string") {
          className = translation;
        } else {
          className = rule.$;
          mode2.report({ id: "UNKNOWN_DIRECTIVE", rule: className }, context);
        }
        if (translateDepth && typeof rule.d !== "function") {
          lastTranslations.push(className);
        }
      }
      if (!translateDepth) {
        idToClassName.set(rule.$, className);
        ensureMaxSize(idToClassName, 3e4);
      }
    }
    return className;
  };
  const process = (tokens) => join(parse(tokens).map(convert).filter(Boolean), " ");
  const preflight = sanitize(config.preflight, identity, false);
  if (preflight) {
    const css = createPreflight(theme2);
    const styles = serialize2(typeof preflight == "function" ? evalThunk(preflight(css, context), context) || css : { ...css, ...preflight });
    init((injected = (styles.forEach(inject2), true)) => injected);
  }
  return {
    init: () => mode2.report({ id: "LATE_SETUP_CALL" }, context),
    process
  };
};
var create = (config) => {
  let process = (tokens) => {
    init();
    return process(tokens);
  };
  let init = (config2) => {
    ({ process, init } = configure(config2));
  };
  let context;
  const fromContext = (key) => () => {
    if (!context) {
      process([
        (_4) => {
          context = _4;
          return "";
        }
      ]);
    }
    return context[key];
  };
  return {
    tw: Object.defineProperties((...tokens) => process(tokens), {
      theme: {
        get: fromContext("theme")
      }
    }),
    setup: (config2) => init(config2)
  };
};
var { tw, setup } = /* @__PURE__ */ create();
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var Tokenizer$2 = {};
var decode_codepoint = {};
const require$$0 = {
  "0": 65533,
  "128": 8364,
  "130": 8218,
  "131": 402,
  "132": 8222,
  "133": 8230,
  "134": 8224,
  "135": 8225,
  "136": 710,
  "137": 8240,
  "138": 352,
  "139": 8249,
  "140": 338,
  "142": 381,
  "145": 8216,
  "146": 8217,
  "147": 8220,
  "148": 8221,
  "149": 8226,
  "150": 8211,
  "151": 8212,
  "152": 732,
  "153": 8482,
  "154": 353,
  "155": 8250,
  "156": 339,
  "158": 382,
  "159": 376
};
var __importDefault$1 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(decode_codepoint, "__esModule", { value: true });
var decode_json_1 = __importDefault$1(require$$0);
var fromCodePoint = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  String.fromCodePoint || function(codePoint) {
    var output = "";
    if (codePoint > 65535) {
      codePoint -= 65536;
      output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    output += String.fromCharCode(codePoint);
    return output;
  }
);
function decodeCodePoint(codePoint) {
  if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
    return "�";
  }
  if (codePoint in decode_json_1.default) {
    codePoint = decode_json_1.default[codePoint];
  }
  return fromCodePoint(codePoint);
}
decode_codepoint.default = decodeCodePoint;
const Aacute$1 = "Á";
const aacute$1 = "á";
const Abreve = "Ă";
const abreve = "ă";
const ac = "∾";
const acd = "∿";
const acE = "∾̳";
const Acirc$1 = "Â";
const acirc$1 = "â";
const acute$1 = "´";
const Acy = "А";
const acy = "а";
const AElig$1 = "Æ";
const aelig$1 = "æ";
const af = "⁡";
const Afr = "𝔄";
const afr = "𝔞";
const Agrave$1 = "À";
const agrave$1 = "à";
const alefsym = "ℵ";
const aleph = "ℵ";
const Alpha = "Α";
const alpha = "α";
const Amacr = "Ā";
const amacr = "ā";
const amalg = "⨿";
const amp$2 = "&";
const AMP$1 = "&";
const andand = "⩕";
const And = "⩓";
const and = "∧";
const andd = "⩜";
const andslope = "⩘";
const andv = "⩚";
const ang = "∠";
const ange = "⦤";
const angle = "∠";
const angmsdaa = "⦨";
const angmsdab = "⦩";
const angmsdac = "⦪";
const angmsdad = "⦫";
const angmsdae = "⦬";
const angmsdaf = "⦭";
const angmsdag = "⦮";
const angmsdah = "⦯";
const angmsd = "∡";
const angrt = "∟";
const angrtvb = "⊾";
const angrtvbd = "⦝";
const angsph = "∢";
const angst = "Å";
const angzarr = "⍼";
const Aogon = "Ą";
const aogon = "ą";
const Aopf = "𝔸";
const aopf = "𝕒";
const apacir = "⩯";
const ap = "≈";
const apE = "⩰";
const ape = "≊";
const apid = "≋";
const apos$1 = "'";
const ApplyFunction = "⁡";
const approx = "≈";
const approxeq = "≊";
const Aring$1 = "Å";
const aring$1 = "å";
const Ascr = "𝒜";
const ascr = "𝒶";
const Assign = "≔";
const ast = "*";
const asymp = "≈";
const asympeq = "≍";
const Atilde$1 = "Ã";
const atilde$1 = "ã";
const Auml$1 = "Ä";
const auml$1 = "ä";
const awconint = "∳";
const awint = "⨑";
const backcong = "≌";
const backepsilon = "϶";
const backprime = "‵";
const backsim = "∽";
const backsimeq = "⋍";
const Backslash = "∖";
const Barv = "⫧";
const barvee = "⊽";
const barwed = "⌅";
const Barwed = "⌆";
const barwedge = "⌅";
const bbrk = "⎵";
const bbrktbrk = "⎶";
const bcong = "≌";
const Bcy = "Б";
const bcy = "б";
const bdquo = "„";
const becaus = "∵";
const because = "∵";
const Because = "∵";
const bemptyv = "⦰";
const bepsi = "϶";
const bernou = "ℬ";
const Bernoullis = "ℬ";
const Beta = "Β";
const beta = "β";
const beth = "ℶ";
const between = "≬";
const Bfr = "𝔅";
const bfr = "𝔟";
const bigcap = "⋂";
const bigcirc = "◯";
const bigcup = "⋃";
const bigodot = "⨀";
const bigoplus = "⨁";
const bigotimes = "⨂";
const bigsqcup = "⨆";
const bigstar = "★";
const bigtriangledown = "▽";
const bigtriangleup = "△";
const biguplus = "⨄";
const bigvee = "⋁";
const bigwedge = "⋀";
const bkarow = "⤍";
const blacklozenge = "⧫";
const blacksquare = "▪";
const blacktriangle = "▴";
const blacktriangledown = "▾";
const blacktriangleleft = "◂";
const blacktriangleright = "▸";
const blank = "␣";
const blk12 = "▒";
const blk14 = "░";
const blk34 = "▓";
const block = "█";
const bne = "=⃥";
const bnequiv = "≡⃥";
const bNot = "⫭";
const bnot = "⌐";
const Bopf = "𝔹";
const bopf = "𝕓";
const bot = "⊥";
const bottom = "⊥";
const bowtie = "⋈";
const boxbox = "⧉";
const boxdl = "┐";
const boxdL = "╕";
const boxDl = "╖";
const boxDL = "╗";
const boxdr = "┌";
const boxdR = "╒";
const boxDr = "╓";
const boxDR = "╔";
const boxh = "─";
const boxH = "═";
const boxhd = "┬";
const boxHd = "╤";
const boxhD = "╥";
const boxHD = "╦";
const boxhu = "┴";
const boxHu = "╧";
const boxhU = "╨";
const boxHU = "╩";
const boxminus = "⊟";
const boxplus = "⊞";
const boxtimes = "⊠";
const boxul = "┘";
const boxuL = "╛";
const boxUl = "╜";
const boxUL = "╝";
const boxur = "└";
const boxuR = "╘";
const boxUr = "╙";
const boxUR = "╚";
const boxv = "│";
const boxV = "║";
const boxvh = "┼";
const boxvH = "╪";
const boxVh = "╫";
const boxVH = "╬";
const boxvl = "┤";
const boxvL = "╡";
const boxVl = "╢";
const boxVL = "╣";
const boxvr = "├";
const boxvR = "╞";
const boxVr = "╟";
const boxVR = "╠";
const bprime = "‵";
const breve = "˘";
const Breve = "˘";
const brvbar$1 = "¦";
const bscr = "𝒷";
const Bscr = "ℬ";
const bsemi = "⁏";
const bsim = "∽";
const bsime = "⋍";
const bsolb = "⧅";
const bsol = "\\";
const bsolhsub = "⟈";
const bull = "•";
const bullet = "•";
const bump = "≎";
const bumpE = "⪮";
const bumpe = "≏";
const Bumpeq = "≎";
const bumpeq = "≏";
const Cacute = "Ć";
const cacute = "ć";
const capand = "⩄";
const capbrcup = "⩉";
const capcap = "⩋";
const cap = "∩";
const Cap = "⋒";
const capcup = "⩇";
const capdot = "⩀";
const CapitalDifferentialD = "ⅅ";
const caps = "∩︀";
const caret = "⁁";
const caron = "ˇ";
const Cayleys = "ℭ";
const ccaps = "⩍";
const Ccaron = "Č";
const ccaron = "č";
const Ccedil$1 = "Ç";
const ccedil$1 = "ç";
const Ccirc = "Ĉ";
const ccirc = "ĉ";
const Cconint = "∰";
const ccups = "⩌";
const ccupssm = "⩐";
const Cdot = "Ċ";
const cdot = "ċ";
const cedil$1 = "¸";
const Cedilla = "¸";
const cemptyv = "⦲";
const cent$1 = "¢";
const centerdot = "·";
const CenterDot = "·";
const cfr = "𝔠";
const Cfr = "ℭ";
const CHcy = "Ч";
const chcy = "ч";
const check = "✓";
const checkmark = "✓";
const Chi = "Χ";
const chi = "χ";
const circ = "ˆ";
const circeq = "≗";
const circlearrowleft = "↺";
const circlearrowright = "↻";
const circledast = "⊛";
const circledcirc = "⊚";
const circleddash = "⊝";
const CircleDot = "⊙";
const circledR = "®";
const circledS = "Ⓢ";
const CircleMinus = "⊖";
const CirclePlus = "⊕";
const CircleTimes = "⊗";
const cir = "○";
const cirE = "⧃";
const cire = "≗";
const cirfnint = "⨐";
const cirmid = "⫯";
const cirscir = "⧂";
const ClockwiseContourIntegral = "∲";
const CloseCurlyDoubleQuote = "”";
const CloseCurlyQuote = "’";
const clubs = "♣";
const clubsuit = "♣";
const colon = ":";
const Colon = "∷";
const Colone = "⩴";
const colone = "≔";
const coloneq = "≔";
const comma = ",";
const commat = "@";
const comp = "∁";
const compfn = "∘";
const complement = "∁";
const complexes = "ℂ";
const cong = "≅";
const congdot = "⩭";
const Congruent = "≡";
const conint = "∮";
const Conint = "∯";
const ContourIntegral = "∮";
const copf = "𝕔";
const Copf = "ℂ";
const coprod = "∐";
const Coproduct = "∐";
const copy$1 = "©";
const COPY$1 = "©";
const copysr = "℗";
const CounterClockwiseContourIntegral = "∳";
const crarr = "↵";
const cross = "✗";
const Cross = "⨯";
const Cscr = "𝒞";
const cscr = "𝒸";
const csub = "⫏";
const csube = "⫑";
const csup = "⫐";
const csupe = "⫒";
const ctdot = "⋯";
const cudarrl = "⤸";
const cudarrr = "⤵";
const cuepr = "⋞";
const cuesc = "⋟";
const cularr = "↶";
const cularrp = "⤽";
const cupbrcap = "⩈";
const cupcap = "⩆";
const CupCap = "≍";
const cup = "∪";
const Cup = "⋓";
const cupcup = "⩊";
const cupdot = "⊍";
const cupor = "⩅";
const cups = "∪︀";
const curarr = "↷";
const curarrm = "⤼";
const curlyeqprec = "⋞";
const curlyeqsucc = "⋟";
const curlyvee = "⋎";
const curlywedge = "⋏";
const curren$1 = "¤";
const curvearrowleft = "↶";
const curvearrowright = "↷";
const cuvee = "⋎";
const cuwed = "⋏";
const cwconint = "∲";
const cwint = "∱";
const cylcty = "⌭";
const dagger = "†";
const Dagger = "‡";
const daleth = "ℸ";
const darr = "↓";
const Darr = "↡";
const dArr = "⇓";
const dash = "‐";
const Dashv = "⫤";
const dashv = "⊣";
const dbkarow = "⤏";
const dblac = "˝";
const Dcaron = "Ď";
const dcaron = "ď";
const Dcy = "Д";
const dcy = "д";
const ddagger = "‡";
const ddarr = "⇊";
const DD = "ⅅ";
const dd = "ⅆ";
const DDotrahd = "⤑";
const ddotseq = "⩷";
const deg$1 = "°";
const Del = "∇";
const Delta = "Δ";
const delta = "δ";
const demptyv = "⦱";
const dfisht = "⥿";
const Dfr = "𝔇";
const dfr = "𝔡";
const dHar = "⥥";
const dharl = "⇃";
const dharr = "⇂";
const DiacriticalAcute = "´";
const DiacriticalDot = "˙";
const DiacriticalDoubleAcute = "˝";
const DiacriticalGrave = "`";
const DiacriticalTilde = "˜";
const diam = "⋄";
const diamond = "⋄";
const Diamond = "⋄";
const diamondsuit = "♦";
const diams = "♦";
const die = "¨";
const DifferentialD = "ⅆ";
const digamma = "ϝ";
const disin = "⋲";
const div = "÷";
const divide$1 = "÷";
const divideontimes = "⋇";
const divonx = "⋇";
const DJcy = "Ђ";
const djcy = "ђ";
const dlcorn = "⌞";
const dlcrop = "⌍";
const dollar = "$";
const Dopf = "𝔻";
const dopf = "𝕕";
const Dot = "¨";
const dot = "˙";
const DotDot = "⃜";
const doteq = "≐";
const doteqdot = "≑";
const DotEqual = "≐";
const dotminus = "∸";
const dotplus = "∔";
const dotsquare = "⊡";
const doublebarwedge = "⌆";
const DoubleContourIntegral = "∯";
const DoubleDot = "¨";
const DoubleDownArrow = "⇓";
const DoubleLeftArrow = "⇐";
const DoubleLeftRightArrow = "⇔";
const DoubleLeftTee = "⫤";
const DoubleLongLeftArrow = "⟸";
const DoubleLongLeftRightArrow = "⟺";
const DoubleLongRightArrow = "⟹";
const DoubleRightArrow = "⇒";
const DoubleRightTee = "⊨";
const DoubleUpArrow = "⇑";
const DoubleUpDownArrow = "⇕";
const DoubleVerticalBar = "∥";
const DownArrowBar = "⤓";
const downarrow = "↓";
const DownArrow = "↓";
const Downarrow = "⇓";
const DownArrowUpArrow = "⇵";
const DownBreve = "̑";
const downdownarrows = "⇊";
const downharpoonleft = "⇃";
const downharpoonright = "⇂";
const DownLeftRightVector = "⥐";
const DownLeftTeeVector = "⥞";
const DownLeftVectorBar = "⥖";
const DownLeftVector = "↽";
const DownRightTeeVector = "⥟";
const DownRightVectorBar = "⥗";
const DownRightVector = "⇁";
const DownTeeArrow = "↧";
const DownTee = "⊤";
const drbkarow = "⤐";
const drcorn = "⌟";
const drcrop = "⌌";
const Dscr = "𝒟";
const dscr = "𝒹";
const DScy = "Ѕ";
const dscy = "ѕ";
const dsol = "⧶";
const Dstrok = "Đ";
const dstrok = "đ";
const dtdot = "⋱";
const dtri = "▿";
const dtrif = "▾";
const duarr = "⇵";
const duhar = "⥯";
const dwangle = "⦦";
const DZcy = "Џ";
const dzcy = "џ";
const dzigrarr = "⟿";
const Eacute$1 = "É";
const eacute$1 = "é";
const easter = "⩮";
const Ecaron = "Ě";
const ecaron = "ě";
const Ecirc$1 = "Ê";
const ecirc$1 = "ê";
const ecir = "≖";
const ecolon = "≕";
const Ecy = "Э";
const ecy = "э";
const eDDot = "⩷";
const Edot = "Ė";
const edot = "ė";
const eDot = "≑";
const ee = "ⅇ";
const efDot = "≒";
const Efr = "𝔈";
const efr = "𝔢";
const eg = "⪚";
const Egrave$1 = "È";
const egrave$1 = "è";
const egs = "⪖";
const egsdot = "⪘";
const el = "⪙";
const Element = "∈";
const elinters = "⏧";
const ell = "ℓ";
const els = "⪕";
const elsdot = "⪗";
const Emacr = "Ē";
const emacr = "ē";
const empty = "∅";
const emptyset = "∅";
const EmptySmallSquare = "◻";
const emptyv = "∅";
const EmptyVerySmallSquare = "▫";
const emsp13 = " ";
const emsp14 = " ";
const emsp = " ";
const ENG = "Ŋ";
const eng = "ŋ";
const ensp = " ";
const Eogon = "Ę";
const eogon = "ę";
const Eopf = "𝔼";
const eopf = "𝕖";
const epar = "⋕";
const eparsl = "⧣";
const eplus = "⩱";
const epsi = "ε";
const Epsilon = "Ε";
const epsilon = "ε";
const epsiv = "ϵ";
const eqcirc = "≖";
const eqcolon = "≕";
const eqsim = "≂";
const eqslantgtr = "⪖";
const eqslantless = "⪕";
const Equal = "⩵";
const equals = "=";
const EqualTilde = "≂";
const equest = "≟";
const Equilibrium = "⇌";
const equiv = "≡";
const equivDD = "⩸";
const eqvparsl = "⧥";
const erarr = "⥱";
const erDot = "≓";
const escr = "ℯ";
const Escr = "ℰ";
const esdot = "≐";
const Esim = "⩳";
const esim = "≂";
const Eta = "Η";
const eta = "η";
const ETH$1 = "Ð";
const eth$1 = "ð";
const Euml$1 = "Ë";
const euml$1 = "ë";
const euro = "€";
const excl = "!";
const exist = "∃";
const Exists = "∃";
const expectation = "ℰ";
const exponentiale = "ⅇ";
const ExponentialE = "ⅇ";
const fallingdotseq = "≒";
const Fcy = "Ф";
const fcy = "ф";
const female = "♀";
const ffilig = "ﬃ";
const fflig = "ﬀ";
const ffllig = "ﬄ";
const Ffr = "𝔉";
const ffr = "𝔣";
const filig = "ﬁ";
const FilledSmallSquare = "◼";
const FilledVerySmallSquare = "▪";
const fjlig = "fj";
const flat = "♭";
const fllig = "ﬂ";
const fltns = "▱";
const fnof = "ƒ";
const Fopf = "𝔽";
const fopf = "𝕗";
const forall = "∀";
const ForAll = "∀";
const fork = "⋔";
const forkv = "⫙";
const Fouriertrf = "ℱ";
const fpartint = "⨍";
const frac12$1 = "½";
const frac13 = "⅓";
const frac14$1 = "¼";
const frac15 = "⅕";
const frac16 = "⅙";
const frac18 = "⅛";
const frac23 = "⅔";
const frac25 = "⅖";
const frac34$1 = "¾";
const frac35 = "⅗";
const frac38 = "⅜";
const frac45 = "⅘";
const frac56 = "⅚";
const frac58 = "⅝";
const frac78 = "⅞";
const frasl = "⁄";
const frown = "⌢";
const fscr = "𝒻";
const Fscr = "ℱ";
const gacute = "ǵ";
const Gamma = "Γ";
const gamma = "γ";
const Gammad = "Ϝ";
const gammad = "ϝ";
const gap = "⪆";
const Gbreve = "Ğ";
const gbreve = "ğ";
const Gcedil = "Ģ";
const Gcirc = "Ĝ";
const gcirc = "ĝ";
const Gcy = "Г";
const gcy = "г";
const Gdot = "Ġ";
const gdot = "ġ";
const ge = "≥";
const gE = "≧";
const gEl = "⪌";
const gel = "⋛";
const geq = "≥";
const geqq = "≧";
const geqslant = "⩾";
const gescc = "⪩";
const ges = "⩾";
const gesdot = "⪀";
const gesdoto = "⪂";
const gesdotol = "⪄";
const gesl = "⋛︀";
const gesles = "⪔";
const Gfr = "𝔊";
const gfr = "𝔤";
const gg = "≫";
const Gg = "⋙";
const ggg = "⋙";
const gimel = "ℷ";
const GJcy = "Ѓ";
const gjcy = "ѓ";
const gla = "⪥";
const gl = "≷";
const glE = "⪒";
const glj = "⪤";
const gnap = "⪊";
const gnapprox = "⪊";
const gne = "⪈";
const gnE = "≩";
const gneq = "⪈";
const gneqq = "≩";
const gnsim = "⋧";
const Gopf = "𝔾";
const gopf = "𝕘";
const grave = "`";
const GreaterEqual = "≥";
const GreaterEqualLess = "⋛";
const GreaterFullEqual = "≧";
const GreaterGreater = "⪢";
const GreaterLess = "≷";
const GreaterSlantEqual = "⩾";
const GreaterTilde = "≳";
const Gscr = "𝒢";
const gscr = "ℊ";
const gsim = "≳";
const gsime = "⪎";
const gsiml = "⪐";
const gtcc = "⪧";
const gtcir = "⩺";
const gt$2 = ">";
const GT$1 = ">";
const Gt = "≫";
const gtdot = "⋗";
const gtlPar = "⦕";
const gtquest = "⩼";
const gtrapprox = "⪆";
const gtrarr = "⥸";
const gtrdot = "⋗";
const gtreqless = "⋛";
const gtreqqless = "⪌";
const gtrless = "≷";
const gtrsim = "≳";
const gvertneqq = "≩︀";
const gvnE = "≩︀";
const Hacek = "ˇ";
const hairsp = " ";
const half = "½";
const hamilt = "ℋ";
const HARDcy = "Ъ";
const hardcy = "ъ";
const harrcir = "⥈";
const harr = "↔";
const hArr = "⇔";
const harrw = "↭";
const Hat = "^";
const hbar = "ℏ";
const Hcirc = "Ĥ";
const hcirc = "ĥ";
const hearts = "♥";
const heartsuit = "♥";
const hellip = "…";
const hercon = "⊹";
const hfr = "𝔥";
const Hfr = "ℌ";
const HilbertSpace = "ℋ";
const hksearow = "⤥";
const hkswarow = "⤦";
const hoarr = "⇿";
const homtht = "∻";
const hookleftarrow = "↩";
const hookrightarrow = "↪";
const hopf = "𝕙";
const Hopf = "ℍ";
const horbar = "―";
const HorizontalLine = "─";
const hscr = "𝒽";
const Hscr = "ℋ";
const hslash = "ℏ";
const Hstrok = "Ħ";
const hstrok = "ħ";
const HumpDownHump = "≎";
const HumpEqual = "≏";
const hybull = "⁃";
const hyphen = "‐";
const Iacute$1 = "Í";
const iacute$1 = "í";
const ic = "⁣";
const Icirc$1 = "Î";
const icirc$1 = "î";
const Icy = "И";
const icy = "и";
const Idot = "İ";
const IEcy = "Е";
const iecy = "е";
const iexcl$1 = "¡";
const iff = "⇔";
const ifr = "𝔦";
const Ifr = "ℑ";
const Igrave$1 = "Ì";
const igrave$1 = "ì";
const ii = "ⅈ";
const iiiint = "⨌";
const iiint = "∭";
const iinfin = "⧜";
const iiota = "℩";
const IJlig = "Ĳ";
const ijlig = "ĳ";
const Imacr = "Ī";
const imacr = "ī";
const image = "ℑ";
const ImaginaryI = "ⅈ";
const imagline = "ℐ";
const imagpart = "ℑ";
const imath = "ı";
const Im = "ℑ";
const imof = "⊷";
const imped = "Ƶ";
const Implies = "⇒";
const incare = "℅";
const infin = "∞";
const infintie = "⧝";
const inodot = "ı";
const intcal = "⊺";
const int = "∫";
const Int = "∬";
const integers = "ℤ";
const Integral = "∫";
const intercal = "⊺";
const Intersection = "⋂";
const intlarhk = "⨗";
const intprod = "⨼";
const InvisibleComma = "⁣";
const InvisibleTimes = "⁢";
const IOcy = "Ё";
const iocy = "ё";
const Iogon = "Į";
const iogon = "į";
const Iopf = "𝕀";
const iopf = "𝕚";
const Iota = "Ι";
const iota = "ι";
const iprod = "⨼";
const iquest$1 = "¿";
const iscr = "𝒾";
const Iscr = "ℐ";
const isin = "∈";
const isindot = "⋵";
const isinE = "⋹";
const isins = "⋴";
const isinsv = "⋳";
const isinv = "∈";
const it = "⁢";
const Itilde = "Ĩ";
const itilde = "ĩ";
const Iukcy = "І";
const iukcy = "і";
const Iuml$1 = "Ï";
const iuml$1 = "ï";
const Jcirc = "Ĵ";
const jcirc = "ĵ";
const Jcy = "Й";
const jcy = "й";
const Jfr = "𝔍";
const jfr = "𝔧";
const jmath = "ȷ";
const Jopf = "𝕁";
const jopf = "𝕛";
const Jscr = "𝒥";
const jscr = "𝒿";
const Jsercy = "Ј";
const jsercy = "ј";
const Jukcy = "Є";
const jukcy = "є";
const Kappa = "Κ";
const kappa = "κ";
const kappav = "ϰ";
const Kcedil = "Ķ";
const kcedil = "ķ";
const Kcy = "К";
const kcy = "к";
const Kfr = "𝔎";
const kfr = "𝔨";
const kgreen = "ĸ";
const KHcy = "Х";
const khcy = "х";
const KJcy = "Ќ";
const kjcy = "ќ";
const Kopf = "𝕂";
const kopf = "𝕜";
const Kscr = "𝒦";
const kscr = "𝓀";
const lAarr = "⇚";
const Lacute = "Ĺ";
const lacute = "ĺ";
const laemptyv = "⦴";
const lagran = "ℒ";
const Lambda = "Λ";
const lambda = "λ";
const lang = "⟨";
const Lang = "⟪";
const langd = "⦑";
const langle = "⟨";
const lap = "⪅";
const Laplacetrf = "ℒ";
const laquo$1 = "«";
const larrb = "⇤";
const larrbfs = "⤟";
const larr = "←";
const Larr = "↞";
const lArr = "⇐";
const larrfs = "⤝";
const larrhk = "↩";
const larrlp = "↫";
const larrpl = "⤹";
const larrsim = "⥳";
const larrtl = "↢";
const latail = "⤙";
const lAtail = "⤛";
const lat = "⪫";
const late = "⪭";
const lates = "⪭︀";
const lbarr = "⤌";
const lBarr = "⤎";
const lbbrk = "❲";
const lbrace = "{";
const lbrack = "[";
const lbrke = "⦋";
const lbrksld = "⦏";
const lbrkslu = "⦍";
const Lcaron = "Ľ";
const lcaron = "ľ";
const Lcedil = "Ļ";
const lcedil = "ļ";
const lceil = "⌈";
const lcub = "{";
const Lcy = "Л";
const lcy = "л";
const ldca = "⤶";
const ldquo = "“";
const ldquor = "„";
const ldrdhar = "⥧";
const ldrushar = "⥋";
const ldsh = "↲";
const le = "≤";
const lE = "≦";
const LeftAngleBracket = "⟨";
const LeftArrowBar = "⇤";
const leftarrow = "←";
const LeftArrow = "←";
const Leftarrow = "⇐";
const LeftArrowRightArrow = "⇆";
const leftarrowtail = "↢";
const LeftCeiling = "⌈";
const LeftDoubleBracket = "⟦";
const LeftDownTeeVector = "⥡";
const LeftDownVectorBar = "⥙";
const LeftDownVector = "⇃";
const LeftFloor = "⌊";
const leftharpoondown = "↽";
const leftharpoonup = "↼";
const leftleftarrows = "⇇";
const leftrightarrow = "↔";
const LeftRightArrow = "↔";
const Leftrightarrow = "⇔";
const leftrightarrows = "⇆";
const leftrightharpoons = "⇋";
const leftrightsquigarrow = "↭";
const LeftRightVector = "⥎";
const LeftTeeArrow = "↤";
const LeftTee = "⊣";
const LeftTeeVector = "⥚";
const leftthreetimes = "⋋";
const LeftTriangleBar = "⧏";
const LeftTriangle = "⊲";
const LeftTriangleEqual = "⊴";
const LeftUpDownVector = "⥑";
const LeftUpTeeVector = "⥠";
const LeftUpVectorBar = "⥘";
const LeftUpVector = "↿";
const LeftVectorBar = "⥒";
const LeftVector = "↼";
const lEg = "⪋";
const leg = "⋚";
const leq = "≤";
const leqq = "≦";
const leqslant = "⩽";
const lescc = "⪨";
const les = "⩽";
const lesdot = "⩿";
const lesdoto = "⪁";
const lesdotor = "⪃";
const lesg = "⋚︀";
const lesges = "⪓";
const lessapprox = "⪅";
const lessdot = "⋖";
const lesseqgtr = "⋚";
const lesseqqgtr = "⪋";
const LessEqualGreater = "⋚";
const LessFullEqual = "≦";
const LessGreater = "≶";
const lessgtr = "≶";
const LessLess = "⪡";
const lesssim = "≲";
const LessSlantEqual = "⩽";
const LessTilde = "≲";
const lfisht = "⥼";
const lfloor = "⌊";
const Lfr = "𝔏";
const lfr = "𝔩";
const lg = "≶";
const lgE = "⪑";
const lHar = "⥢";
const lhard = "↽";
const lharu = "↼";
const lharul = "⥪";
const lhblk = "▄";
const LJcy = "Љ";
const ljcy = "љ";
const llarr = "⇇";
const ll = "≪";
const Ll = "⋘";
const llcorner = "⌞";
const Lleftarrow = "⇚";
const llhard = "⥫";
const lltri = "◺";
const Lmidot = "Ŀ";
const lmidot = "ŀ";
const lmoustache = "⎰";
const lmoust = "⎰";
const lnap = "⪉";
const lnapprox = "⪉";
const lne = "⪇";
const lnE = "≨";
const lneq = "⪇";
const lneqq = "≨";
const lnsim = "⋦";
const loang = "⟬";
const loarr = "⇽";
const lobrk = "⟦";
const longleftarrow = "⟵";
const LongLeftArrow = "⟵";
const Longleftarrow = "⟸";
const longleftrightarrow = "⟷";
const LongLeftRightArrow = "⟷";
const Longleftrightarrow = "⟺";
const longmapsto = "⟼";
const longrightarrow = "⟶";
const LongRightArrow = "⟶";
const Longrightarrow = "⟹";
const looparrowleft = "↫";
const looparrowright = "↬";
const lopar = "⦅";
const Lopf = "𝕃";
const lopf = "𝕝";
const loplus = "⨭";
const lotimes = "⨴";
const lowast = "∗";
const lowbar = "_";
const LowerLeftArrow = "↙";
const LowerRightArrow = "↘";
const loz = "◊";
const lozenge = "◊";
const lozf = "⧫";
const lpar = "(";
const lparlt = "⦓";
const lrarr = "⇆";
const lrcorner = "⌟";
const lrhar = "⇋";
const lrhard = "⥭";
const lrm = "‎";
const lrtri = "⊿";
const lsaquo = "‹";
const lscr = "𝓁";
const Lscr = "ℒ";
const lsh = "↰";
const Lsh = "↰";
const lsim = "≲";
const lsime = "⪍";
const lsimg = "⪏";
const lsqb = "[";
const lsquo = "‘";
const lsquor = "‚";
const Lstrok = "Ł";
const lstrok = "ł";
const ltcc = "⪦";
const ltcir = "⩹";
const lt$2 = "<";
const LT$1 = "<";
const Lt = "≪";
const ltdot = "⋖";
const lthree = "⋋";
const ltimes = "⋉";
const ltlarr = "⥶";
const ltquest = "⩻";
const ltri = "◃";
const ltrie = "⊴";
const ltrif = "◂";
const ltrPar = "⦖";
const lurdshar = "⥊";
const luruhar = "⥦";
const lvertneqq = "≨︀";
const lvnE = "≨︀";
const macr$1 = "¯";
const male = "♂";
const malt = "✠";
const maltese = "✠";
const map = "↦";
const mapsto = "↦";
const mapstodown = "↧";
const mapstoleft = "↤";
const mapstoup = "↥";
const marker = "▮";
const mcomma = "⨩";
const Mcy = "М";
const mcy = "м";
const mdash = "—";
const mDDot = "∺";
const measuredangle = "∡";
const MediumSpace = " ";
const Mellintrf = "ℳ";
const Mfr = "𝔐";
const mfr = "𝔪";
const mho = "℧";
const micro$1 = "µ";
const midast = "*";
const midcir = "⫰";
const mid = "∣";
const middot$1 = "·";
const minusb = "⊟";
const minus = "−";
const minusd = "∸";
const minusdu = "⨪";
const MinusPlus = "∓";
const mlcp = "⫛";
const mldr = "…";
const mnplus = "∓";
const models = "⊧";
const Mopf = "𝕄";
const mopf = "𝕞";
const mp = "∓";
const mscr = "𝓂";
const Mscr = "ℳ";
const mstpos = "∾";
const Mu = "Μ";
const mu = "μ";
const multimap = "⊸";
const mumap = "⊸";
const nabla = "∇";
const Nacute = "Ń";
const nacute = "ń";
const nang = "∠⃒";
const nap = "≉";
const napE = "⩰̸";
const napid = "≋̸";
const napos = "ŉ";
const napprox = "≉";
const natural = "♮";
const naturals = "ℕ";
const natur = "♮";
const nbsp$1 = " ";
const nbump = "≎̸";
const nbumpe = "≏̸";
const ncap = "⩃";
const Ncaron = "Ň";
const ncaron = "ň";
const Ncedil = "Ņ";
const ncedil = "ņ";
const ncong = "≇";
const ncongdot = "⩭̸";
const ncup = "⩂";
const Ncy = "Н";
const ncy = "н";
const ndash = "–";
const nearhk = "⤤";
const nearr = "↗";
const neArr = "⇗";
const nearrow = "↗";
const ne = "≠";
const nedot = "≐̸";
const NegativeMediumSpace = "​";
const NegativeThickSpace = "​";
const NegativeThinSpace = "​";
const NegativeVeryThinSpace = "​";
const nequiv = "≢";
const nesear = "⤨";
const nesim = "≂̸";
const NestedGreaterGreater = "≫";
const NestedLessLess = "≪";
const NewLine = "\n";
const nexist = "∄";
const nexists = "∄";
const Nfr = "𝔑";
const nfr = "𝔫";
const ngE = "≧̸";
const nge = "≱";
const ngeq = "≱";
const ngeqq = "≧̸";
const ngeqslant = "⩾̸";
const nges = "⩾̸";
const nGg = "⋙̸";
const ngsim = "≵";
const nGt = "≫⃒";
const ngt = "≯";
const ngtr = "≯";
const nGtv = "≫̸";
const nharr = "↮";
const nhArr = "⇎";
const nhpar = "⫲";
const ni = "∋";
const nis = "⋼";
const nisd = "⋺";
const niv = "∋";
const NJcy = "Њ";
const njcy = "њ";
const nlarr = "↚";
const nlArr = "⇍";
const nldr = "‥";
const nlE = "≦̸";
const nle = "≰";
const nleftarrow = "↚";
const nLeftarrow = "⇍";
const nleftrightarrow = "↮";
const nLeftrightarrow = "⇎";
const nleq = "≰";
const nleqq = "≦̸";
const nleqslant = "⩽̸";
const nles = "⩽̸";
const nless = "≮";
const nLl = "⋘̸";
const nlsim = "≴";
const nLt = "≪⃒";
const nlt = "≮";
const nltri = "⋪";
const nltrie = "⋬";
const nLtv = "≪̸";
const nmid = "∤";
const NoBreak = "⁠";
const NonBreakingSpace = " ";
const nopf = "𝕟";
const Nopf = "ℕ";
const Not = "⫬";
const not$1 = "¬";
const NotCongruent = "≢";
const NotCupCap = "≭";
const NotDoubleVerticalBar = "∦";
const NotElement = "∉";
const NotEqual = "≠";
const NotEqualTilde = "≂̸";
const NotExists = "∄";
const NotGreater = "≯";
const NotGreaterEqual = "≱";
const NotGreaterFullEqual = "≧̸";
const NotGreaterGreater = "≫̸";
const NotGreaterLess = "≹";
const NotGreaterSlantEqual = "⩾̸";
const NotGreaterTilde = "≵";
const NotHumpDownHump = "≎̸";
const NotHumpEqual = "≏̸";
const notin = "∉";
const notindot = "⋵̸";
const notinE = "⋹̸";
const notinva = "∉";
const notinvb = "⋷";
const notinvc = "⋶";
const NotLeftTriangleBar = "⧏̸";
const NotLeftTriangle = "⋪";
const NotLeftTriangleEqual = "⋬";
const NotLess = "≮";
const NotLessEqual = "≰";
const NotLessGreater = "≸";
const NotLessLess = "≪̸";
const NotLessSlantEqual = "⩽̸";
const NotLessTilde = "≴";
const NotNestedGreaterGreater = "⪢̸";
const NotNestedLessLess = "⪡̸";
const notni = "∌";
const notniva = "∌";
const notnivb = "⋾";
const notnivc = "⋽";
const NotPrecedes = "⊀";
const NotPrecedesEqual = "⪯̸";
const NotPrecedesSlantEqual = "⋠";
const NotReverseElement = "∌";
const NotRightTriangleBar = "⧐̸";
const NotRightTriangle = "⋫";
const NotRightTriangleEqual = "⋭";
const NotSquareSubset = "⊏̸";
const NotSquareSubsetEqual = "⋢";
const NotSquareSuperset = "⊐̸";
const NotSquareSupersetEqual = "⋣";
const NotSubset = "⊂⃒";
const NotSubsetEqual = "⊈";
const NotSucceeds = "⊁";
const NotSucceedsEqual = "⪰̸";
const NotSucceedsSlantEqual = "⋡";
const NotSucceedsTilde = "≿̸";
const NotSuperset = "⊃⃒";
const NotSupersetEqual = "⊉";
const NotTilde = "≁";
const NotTildeEqual = "≄";
const NotTildeFullEqual = "≇";
const NotTildeTilde = "≉";
const NotVerticalBar = "∤";
const nparallel = "∦";
const npar = "∦";
const nparsl = "⫽⃥";
const npart = "∂̸";
const npolint = "⨔";
const npr = "⊀";
const nprcue = "⋠";
const nprec = "⊀";
const npreceq = "⪯̸";
const npre = "⪯̸";
const nrarrc = "⤳̸";
const nrarr = "↛";
const nrArr = "⇏";
const nrarrw = "↝̸";
const nrightarrow = "↛";
const nRightarrow = "⇏";
const nrtri = "⋫";
const nrtrie = "⋭";
const nsc = "⊁";
const nsccue = "⋡";
const nsce = "⪰̸";
const Nscr = "𝒩";
const nscr = "𝓃";
const nshortmid = "∤";
const nshortparallel = "∦";
const nsim = "≁";
const nsime = "≄";
const nsimeq = "≄";
const nsmid = "∤";
const nspar = "∦";
const nsqsube = "⋢";
const nsqsupe = "⋣";
const nsub = "⊄";
const nsubE = "⫅̸";
const nsube = "⊈";
const nsubset = "⊂⃒";
const nsubseteq = "⊈";
const nsubseteqq = "⫅̸";
const nsucc = "⊁";
const nsucceq = "⪰̸";
const nsup = "⊅";
const nsupE = "⫆̸";
const nsupe = "⊉";
const nsupset = "⊃⃒";
const nsupseteq = "⊉";
const nsupseteqq = "⫆̸";
const ntgl = "≹";
const Ntilde$1 = "Ñ";
const ntilde$1 = "ñ";
const ntlg = "≸";
const ntriangleleft = "⋪";
const ntrianglelefteq = "⋬";
const ntriangleright = "⋫";
const ntrianglerighteq = "⋭";
const Nu = "Ν";
const nu = "ν";
const num = "#";
const numero = "№";
const numsp = " ";
const nvap = "≍⃒";
const nvdash = "⊬";
const nvDash = "⊭";
const nVdash = "⊮";
const nVDash = "⊯";
const nvge = "≥⃒";
const nvgt = ">⃒";
const nvHarr = "⤄";
const nvinfin = "⧞";
const nvlArr = "⤂";
const nvle = "≤⃒";
const nvlt = "<⃒";
const nvltrie = "⊴⃒";
const nvrArr = "⤃";
const nvrtrie = "⊵⃒";
const nvsim = "∼⃒";
const nwarhk = "⤣";
const nwarr = "↖";
const nwArr = "⇖";
const nwarrow = "↖";
const nwnear = "⤧";
const Oacute$1 = "Ó";
const oacute$1 = "ó";
const oast = "⊛";
const Ocirc$1 = "Ô";
const ocirc$1 = "ô";
const ocir = "⊚";
const Ocy = "О";
const ocy = "о";
const odash = "⊝";
const Odblac = "Ő";
const odblac = "ő";
const odiv = "⨸";
const odot = "⊙";
const odsold = "⦼";
const OElig = "Œ";
const oelig = "œ";
const ofcir = "⦿";
const Ofr = "𝔒";
const ofr = "𝔬";
const ogon = "˛";
const Ograve$1 = "Ò";
const ograve$1 = "ò";
const ogt = "⧁";
const ohbar = "⦵";
const ohm = "Ω";
const oint = "∮";
const olarr = "↺";
const olcir = "⦾";
const olcross = "⦻";
const oline = "‾";
const olt = "⧀";
const Omacr = "Ō";
const omacr = "ō";
const Omega = "Ω";
const omega = "ω";
const Omicron = "Ο";
const omicron = "ο";
const omid = "⦶";
const ominus = "⊖";
const Oopf = "𝕆";
const oopf = "𝕠";
const opar = "⦷";
const OpenCurlyDoubleQuote = "“";
const OpenCurlyQuote = "‘";
const operp = "⦹";
const oplus = "⊕";
const orarr = "↻";
const Or = "⩔";
const or = "∨";
const ord = "⩝";
const order = "ℴ";
const orderof = "ℴ";
const ordf$1 = "ª";
const ordm$1 = "º";
const origof = "⊶";
const oror = "⩖";
const orslope = "⩗";
const orv = "⩛";
const oS = "Ⓢ";
const Oscr = "𝒪";
const oscr = "ℴ";
const Oslash$1 = "Ø";
const oslash$1 = "ø";
const osol = "⊘";
const Otilde$1 = "Õ";
const otilde$1 = "õ";
const otimesas = "⨶";
const Otimes = "⨷";
const otimes = "⊗";
const Ouml$1 = "Ö";
const ouml$1 = "ö";
const ovbar = "⌽";
const OverBar = "‾";
const OverBrace = "⏞";
const OverBracket = "⎴";
const OverParenthesis = "⏜";
const para$1 = "¶";
const parallel = "∥";
const par = "∥";
const parsim = "⫳";
const parsl = "⫽";
const part = "∂";
const PartialD = "∂";
const Pcy = "П";
const pcy = "п";
const percnt = "%";
const period = ".";
const permil = "‰";
const perp = "⊥";
const pertenk = "‱";
const Pfr = "𝔓";
const pfr = "𝔭";
const Phi = "Φ";
const phi = "φ";
const phiv = "ϕ";
const phmmat = "ℳ";
const phone = "☎";
const Pi = "Π";
const pi = "π";
const pitchfork = "⋔";
const piv = "ϖ";
const planck = "ℏ";
const planckh = "ℎ";
const plankv = "ℏ";
const plusacir = "⨣";
const plusb = "⊞";
const pluscir = "⨢";
const plus = "+";
const plusdo = "∔";
const plusdu = "⨥";
const pluse = "⩲";
const PlusMinus = "±";
const plusmn$1 = "±";
const plussim = "⨦";
const plustwo = "⨧";
const pm = "±";
const Poincareplane = "ℌ";
const pointint = "⨕";
const popf = "𝕡";
const Popf = "ℙ";
const pound$1 = "£";
const prap = "⪷";
const Pr = "⪻";
const pr = "≺";
const prcue = "≼";
const precapprox = "⪷";
const prec = "≺";
const preccurlyeq = "≼";
const Precedes = "≺";
const PrecedesEqual = "⪯";
const PrecedesSlantEqual = "≼";
const PrecedesTilde = "≾";
const preceq = "⪯";
const precnapprox = "⪹";
const precneqq = "⪵";
const precnsim = "⋨";
const pre = "⪯";
const prE = "⪳";
const precsim = "≾";
const prime = "′";
const Prime = "″";
const primes = "ℙ";
const prnap = "⪹";
const prnE = "⪵";
const prnsim = "⋨";
const prod = "∏";
const Product = "∏";
const profalar = "⌮";
const profline = "⌒";
const profsurf = "⌓";
const prop = "∝";
const Proportional = "∝";
const Proportion = "∷";
const propto = "∝";
const prsim = "≾";
const prurel = "⊰";
const Pscr = "𝒫";
const pscr = "𝓅";
const Psi = "Ψ";
const psi = "ψ";
const puncsp = " ";
const Qfr = "𝔔";
const qfr = "𝔮";
const qint = "⨌";
const qopf = "𝕢";
const Qopf = "ℚ";
const qprime = "⁗";
const Qscr = "𝒬";
const qscr = "𝓆";
const quaternions = "ℍ";
const quatint = "⨖";
const quest = "?";
const questeq = "≟";
const quot$2 = '"';
const QUOT$1 = '"';
const rAarr = "⇛";
const race = "∽̱";
const Racute = "Ŕ";
const racute = "ŕ";
const radic = "√";
const raemptyv = "⦳";
const rang = "⟩";
const Rang = "⟫";
const rangd = "⦒";
const range = "⦥";
const rangle = "⟩";
const raquo$1 = "»";
const rarrap = "⥵";
const rarrb = "⇥";
const rarrbfs = "⤠";
const rarrc = "⤳";
const rarr = "→";
const Rarr = "↠";
const rArr = "⇒";
const rarrfs = "⤞";
const rarrhk = "↪";
const rarrlp = "↬";
const rarrpl = "⥅";
const rarrsim = "⥴";
const Rarrtl = "⤖";
const rarrtl = "↣";
const rarrw = "↝";
const ratail = "⤚";
const rAtail = "⤜";
const ratio = "∶";
const rationals = "ℚ";
const rbarr = "⤍";
const rBarr = "⤏";
const RBarr = "⤐";
const rbbrk = "❳";
const rbrace = "}";
const rbrack = "]";
const rbrke = "⦌";
const rbrksld = "⦎";
const rbrkslu = "⦐";
const Rcaron = "Ř";
const rcaron = "ř";
const Rcedil = "Ŗ";
const rcedil = "ŗ";
const rceil = "⌉";
const rcub = "}";
const Rcy = "Р";
const rcy = "р";
const rdca = "⤷";
const rdldhar = "⥩";
const rdquo = "”";
const rdquor = "”";
const rdsh = "↳";
const real = "ℜ";
const realine = "ℛ";
const realpart = "ℜ";
const reals = "ℝ";
const Re = "ℜ";
const rect = "▭";
const reg$1 = "®";
const REG$1 = "®";
const ReverseElement = "∋";
const ReverseEquilibrium = "⇋";
const ReverseUpEquilibrium = "⥯";
const rfisht = "⥽";
const rfloor = "⌋";
const rfr = "𝔯";
const Rfr = "ℜ";
const rHar = "⥤";
const rhard = "⇁";
const rharu = "⇀";
const rharul = "⥬";
const Rho = "Ρ";
const rho = "ρ";
const rhov = "ϱ";
const RightAngleBracket = "⟩";
const RightArrowBar = "⇥";
const rightarrow = "→";
const RightArrow = "→";
const Rightarrow = "⇒";
const RightArrowLeftArrow = "⇄";
const rightarrowtail = "↣";
const RightCeiling = "⌉";
const RightDoubleBracket = "⟧";
const RightDownTeeVector = "⥝";
const RightDownVectorBar = "⥕";
const RightDownVector = "⇂";
const RightFloor = "⌋";
const rightharpoondown = "⇁";
const rightharpoonup = "⇀";
const rightleftarrows = "⇄";
const rightleftharpoons = "⇌";
const rightrightarrows = "⇉";
const rightsquigarrow = "↝";
const RightTeeArrow = "↦";
const RightTee = "⊢";
const RightTeeVector = "⥛";
const rightthreetimes = "⋌";
const RightTriangleBar = "⧐";
const RightTriangle = "⊳";
const RightTriangleEqual = "⊵";
const RightUpDownVector = "⥏";
const RightUpTeeVector = "⥜";
const RightUpVectorBar = "⥔";
const RightUpVector = "↾";
const RightVectorBar = "⥓";
const RightVector = "⇀";
const ring = "˚";
const risingdotseq = "≓";
const rlarr = "⇄";
const rlhar = "⇌";
const rlm = "‏";
const rmoustache = "⎱";
const rmoust = "⎱";
const rnmid = "⫮";
const roang = "⟭";
const roarr = "⇾";
const robrk = "⟧";
const ropar = "⦆";
const ropf = "𝕣";
const Ropf = "ℝ";
const roplus = "⨮";
const rotimes = "⨵";
const RoundImplies = "⥰";
const rpar = ")";
const rpargt = "⦔";
const rppolint = "⨒";
const rrarr = "⇉";
const Rrightarrow = "⇛";
const rsaquo = "›";
const rscr = "𝓇";
const Rscr = "ℛ";
const rsh = "↱";
const Rsh = "↱";
const rsqb = "]";
const rsquo = "’";
const rsquor = "’";
const rthree = "⋌";
const rtimes = "⋊";
const rtri = "▹";
const rtrie = "⊵";
const rtrif = "▸";
const rtriltri = "⧎";
const RuleDelayed = "⧴";
const ruluhar = "⥨";
const rx = "℞";
const Sacute = "Ś";
const sacute = "ś";
const sbquo = "‚";
const scap = "⪸";
const Scaron = "Š";
const scaron = "š";
const Sc = "⪼";
const sc = "≻";
const sccue = "≽";
const sce = "⪰";
const scE = "⪴";
const Scedil = "Ş";
const scedil = "ş";
const Scirc = "Ŝ";
const scirc = "ŝ";
const scnap = "⪺";
const scnE = "⪶";
const scnsim = "⋩";
const scpolint = "⨓";
const scsim = "≿";
const Scy = "С";
const scy = "с";
const sdotb = "⊡";
const sdot = "⋅";
const sdote = "⩦";
const searhk = "⤥";
const searr = "↘";
const seArr = "⇘";
const searrow = "↘";
const sect$1 = "§";
const semi = ";";
const seswar = "⤩";
const setminus = "∖";
const setmn = "∖";
const sext = "✶";
const Sfr = "𝔖";
const sfr = "𝔰";
const sfrown = "⌢";
const sharp = "♯";
const SHCHcy = "Щ";
const shchcy = "щ";
const SHcy = "Ш";
const shcy = "ш";
const ShortDownArrow = "↓";
const ShortLeftArrow = "←";
const shortmid = "∣";
const shortparallel = "∥";
const ShortRightArrow = "→";
const ShortUpArrow = "↑";
const shy$1 = "­";
const Sigma = "Σ";
const sigma = "σ";
const sigmaf = "ς";
const sigmav = "ς";
const sim = "∼";
const simdot = "⩪";
const sime = "≃";
const simeq = "≃";
const simg = "⪞";
const simgE = "⪠";
const siml = "⪝";
const simlE = "⪟";
const simne = "≆";
const simplus = "⨤";
const simrarr = "⥲";
const slarr = "←";
const SmallCircle = "∘";
const smallsetminus = "∖";
const smashp = "⨳";
const smeparsl = "⧤";
const smid = "∣";
const smile = "⌣";
const smt = "⪪";
const smte = "⪬";
const smtes = "⪬︀";
const SOFTcy = "Ь";
const softcy = "ь";
const solbar = "⌿";
const solb = "⧄";
const sol = "/";
const Sopf = "𝕊";
const sopf = "𝕤";
const spades = "♠";
const spadesuit = "♠";
const spar = "∥";
const sqcap = "⊓";
const sqcaps = "⊓︀";
const sqcup = "⊔";
const sqcups = "⊔︀";
const Sqrt = "√";
const sqsub = "⊏";
const sqsube = "⊑";
const sqsubset = "⊏";
const sqsubseteq = "⊑";
const sqsup = "⊐";
const sqsupe = "⊒";
const sqsupset = "⊐";
const sqsupseteq = "⊒";
const square = "□";
const Square = "□";
const SquareIntersection = "⊓";
const SquareSubset = "⊏";
const SquareSubsetEqual = "⊑";
const SquareSuperset = "⊐";
const SquareSupersetEqual = "⊒";
const SquareUnion = "⊔";
const squarf = "▪";
const squ = "□";
const squf = "▪";
const srarr = "→";
const Sscr = "𝒮";
const sscr = "𝓈";
const ssetmn = "∖";
const ssmile = "⌣";
const sstarf = "⋆";
const Star = "⋆";
const star = "☆";
const starf = "★";
const straightepsilon = "ϵ";
const straightphi = "ϕ";
const strns = "¯";
const sub = "⊂";
const Sub = "⋐";
const subdot = "⪽";
const subE = "⫅";
const sube = "⊆";
const subedot = "⫃";
const submult = "⫁";
const subnE = "⫋";
const subne = "⊊";
const subplus = "⪿";
const subrarr = "⥹";
const subset = "⊂";
const Subset = "⋐";
const subseteq = "⊆";
const subseteqq = "⫅";
const SubsetEqual = "⊆";
const subsetneq = "⊊";
const subsetneqq = "⫋";
const subsim = "⫇";
const subsub = "⫕";
const subsup = "⫓";
const succapprox = "⪸";
const succ = "≻";
const succcurlyeq = "≽";
const Succeeds = "≻";
const SucceedsEqual = "⪰";
const SucceedsSlantEqual = "≽";
const SucceedsTilde = "≿";
const succeq = "⪰";
const succnapprox = "⪺";
const succneqq = "⪶";
const succnsim = "⋩";
const succsim = "≿";
const SuchThat = "∋";
const sum = "∑";
const Sum = "∑";
const sung = "♪";
const sup1$1 = "¹";
const sup2$1 = "²";
const sup3$1 = "³";
const sup = "⊃";
const Sup = "⋑";
const supdot = "⪾";
const supdsub = "⫘";
const supE = "⫆";
const supe = "⊇";
const supedot = "⫄";
const Superset = "⊃";
const SupersetEqual = "⊇";
const suphsol = "⟉";
const suphsub = "⫗";
const suplarr = "⥻";
const supmult = "⫂";
const supnE = "⫌";
const supne = "⊋";
const supplus = "⫀";
const supset = "⊃";
const Supset = "⋑";
const supseteq = "⊇";
const supseteqq = "⫆";
const supsetneq = "⊋";
const supsetneqq = "⫌";
const supsim = "⫈";
const supsub = "⫔";
const supsup = "⫖";
const swarhk = "⤦";
const swarr = "↙";
const swArr = "⇙";
const swarrow = "↙";
const swnwar = "⤪";
const szlig$1 = "ß";
const Tab = "	";
const target = "⌖";
const Tau = "Τ";
const tau = "τ";
const tbrk = "⎴";
const Tcaron = "Ť";
const tcaron = "ť";
const Tcedil = "Ţ";
const tcedil = "ţ";
const Tcy = "Т";
const tcy = "т";
const tdot = "⃛";
const telrec = "⌕";
const Tfr = "𝔗";
const tfr = "𝔱";
const there4 = "∴";
const therefore = "∴";
const Therefore = "∴";
const Theta = "Θ";
const theta = "θ";
const thetasym = "ϑ";
const thetav = "ϑ";
const thickapprox = "≈";
const thicksim = "∼";
const ThickSpace = "  ";
const ThinSpace = " ";
const thinsp = " ";
const thkap = "≈";
const thksim = "∼";
const THORN$1 = "Þ";
const thorn$1 = "þ";
const tilde = "˜";
const Tilde = "∼";
const TildeEqual = "≃";
const TildeFullEqual = "≅";
const TildeTilde = "≈";
const timesbar = "⨱";
const timesb = "⊠";
const times$1 = "×";
const timesd = "⨰";
const tint = "∭";
const toea = "⤨";
const topbot = "⌶";
const topcir = "⫱";
const top = "⊤";
const Topf = "𝕋";
const topf = "𝕥";
const topfork = "⫚";
const tosa = "⤩";
const tprime = "‴";
const trade = "™";
const TRADE = "™";
const triangle = "▵";
const triangledown = "▿";
const triangleleft = "◃";
const trianglelefteq = "⊴";
const triangleq = "≜";
const triangleright = "▹";
const trianglerighteq = "⊵";
const tridot = "◬";
const trie = "≜";
const triminus = "⨺";
const TripleDot = "⃛";
const triplus = "⨹";
const trisb = "⧍";
const tritime = "⨻";
const trpezium = "⏢";
const Tscr = "𝒯";
const tscr = "𝓉";
const TScy = "Ц";
const tscy = "ц";
const TSHcy = "Ћ";
const tshcy = "ћ";
const Tstrok = "Ŧ";
const tstrok = "ŧ";
const twixt = "≬";
const twoheadleftarrow = "↞";
const twoheadrightarrow = "↠";
const Uacute$1 = "Ú";
const uacute$1 = "ú";
const uarr = "↑";
const Uarr = "↟";
const uArr = "⇑";
const Uarrocir = "⥉";
const Ubrcy = "Ў";
const ubrcy = "ў";
const Ubreve = "Ŭ";
const ubreve = "ŭ";
const Ucirc$1 = "Û";
const ucirc$1 = "û";
const Ucy = "У";
const ucy = "у";
const udarr = "⇅";
const Udblac = "Ű";
const udblac = "ű";
const udhar = "⥮";
const ufisht = "⥾";
const Ufr = "𝔘";
const ufr = "𝔲";
const Ugrave$1 = "Ù";
const ugrave$1 = "ù";
const uHar = "⥣";
const uharl = "↿";
const uharr = "↾";
const uhblk = "▀";
const ulcorn = "⌜";
const ulcorner = "⌜";
const ulcrop = "⌏";
const ultri = "◸";
const Umacr = "Ū";
const umacr = "ū";
const uml$1 = "¨";
const UnderBar = "_";
const UnderBrace = "⏟";
const UnderBracket = "⎵";
const UnderParenthesis = "⏝";
const Union = "⋃";
const UnionPlus = "⊎";
const Uogon = "Ų";
const uogon = "ų";
const Uopf = "𝕌";
const uopf = "𝕦";
const UpArrowBar = "⤒";
const uparrow = "↑";
const UpArrow = "↑";
const Uparrow = "⇑";
const UpArrowDownArrow = "⇅";
const updownarrow = "↕";
const UpDownArrow = "↕";
const Updownarrow = "⇕";
const UpEquilibrium = "⥮";
const upharpoonleft = "↿";
const upharpoonright = "↾";
const uplus = "⊎";
const UpperLeftArrow = "↖";
const UpperRightArrow = "↗";
const upsi = "υ";
const Upsi = "ϒ";
const upsih = "ϒ";
const Upsilon = "Υ";
const upsilon = "υ";
const UpTeeArrow = "↥";
const UpTee = "⊥";
const upuparrows = "⇈";
const urcorn = "⌝";
const urcorner = "⌝";
const urcrop = "⌎";
const Uring = "Ů";
const uring = "ů";
const urtri = "◹";
const Uscr = "𝒰";
const uscr = "𝓊";
const utdot = "⋰";
const Utilde = "Ũ";
const utilde = "ũ";
const utri = "▵";
const utrif = "▴";
const uuarr = "⇈";
const Uuml$1 = "Ü";
const uuml$1 = "ü";
const uwangle = "⦧";
const vangrt = "⦜";
const varepsilon = "ϵ";
const varkappa = "ϰ";
const varnothing = "∅";
const varphi = "ϕ";
const varpi = "ϖ";
const varpropto = "∝";
const varr = "↕";
const vArr = "⇕";
const varrho = "ϱ";
const varsigma = "ς";
const varsubsetneq = "⊊︀";
const varsubsetneqq = "⫋︀";
const varsupsetneq = "⊋︀";
const varsupsetneqq = "⫌︀";
const vartheta = "ϑ";
const vartriangleleft = "⊲";
const vartriangleright = "⊳";
const vBar = "⫨";
const Vbar = "⫫";
const vBarv = "⫩";
const Vcy = "В";
const vcy = "в";
const vdash = "⊢";
const vDash = "⊨";
const Vdash = "⊩";
const VDash = "⊫";
const Vdashl = "⫦";
const veebar = "⊻";
const vee = "∨";
const Vee = "⋁";
const veeeq = "≚";
const vellip = "⋮";
const verbar = "|";
const Verbar = "‖";
const vert = "|";
const Vert = "‖";
const VerticalBar = "∣";
const VerticalLine = "|";
const VerticalSeparator = "❘";
const VerticalTilde = "≀";
const VeryThinSpace = " ";
const Vfr = "𝔙";
const vfr = "𝔳";
const vltri = "⊲";
const vnsub = "⊂⃒";
const vnsup = "⊃⃒";
const Vopf = "𝕍";
const vopf = "𝕧";
const vprop = "∝";
const vrtri = "⊳";
const Vscr = "𝒱";
const vscr = "𝓋";
const vsubnE = "⫋︀";
const vsubne = "⊊︀";
const vsupnE = "⫌︀";
const vsupne = "⊋︀";
const Vvdash = "⊪";
const vzigzag = "⦚";
const Wcirc = "Ŵ";
const wcirc = "ŵ";
const wedbar = "⩟";
const wedge = "∧";
const Wedge = "⋀";
const wedgeq = "≙";
const weierp = "℘";
const Wfr = "𝔚";
const wfr = "𝔴";
const Wopf = "𝕎";
const wopf = "𝕨";
const wp = "℘";
const wr = "≀";
const wreath = "≀";
const Wscr = "𝒲";
const wscr = "𝓌";
const xcap = "⋂";
const xcirc = "◯";
const xcup = "⋃";
const xdtri = "▽";
const Xfr = "𝔛";
const xfr = "𝔵";
const xharr = "⟷";
const xhArr = "⟺";
const Xi = "Ξ";
const xi = "ξ";
const xlarr = "⟵";
const xlArr = "⟸";
const xmap = "⟼";
const xnis = "⋻";
const xodot = "⨀";
const Xopf = "𝕏";
const xopf = "𝕩";
const xoplus = "⨁";
const xotime = "⨂";
const xrarr = "⟶";
const xrArr = "⟹";
const Xscr = "𝒳";
const xscr = "𝓍";
const xsqcup = "⨆";
const xuplus = "⨄";
const xutri = "△";
const xvee = "⋁";
const xwedge = "⋀";
const Yacute$1 = "Ý";
const yacute$1 = "ý";
const YAcy = "Я";
const yacy = "я";
const Ycirc = "Ŷ";
const ycirc = "ŷ";
const Ycy = "Ы";
const ycy = "ы";
const yen$1 = "¥";
const Yfr = "𝔜";
const yfr = "𝔶";
const YIcy = "Ї";
const yicy = "ї";
const Yopf = "𝕐";
const yopf = "𝕪";
const Yscr = "𝒴";
const yscr = "𝓎";
const YUcy = "Ю";
const yucy = "ю";
const yuml$1 = "ÿ";
const Yuml = "Ÿ";
const Zacute = "Ź";
const zacute = "ź";
const Zcaron = "Ž";
const zcaron = "ž";
const Zcy = "З";
const zcy = "з";
const Zdot = "Ż";
const zdot = "ż";
const zeetrf = "ℨ";
const ZeroWidthSpace = "​";
const Zeta = "Ζ";
const zeta = "ζ";
const zfr = "𝔷";
const Zfr = "ℨ";
const ZHcy = "Ж";
const zhcy = "ж";
const zigrarr = "⇝";
const zopf = "𝕫";
const Zopf = "ℤ";
const Zscr = "𝒵";
const zscr = "𝓏";
const zwj = "‍";
const zwnj = "‌";
const require$$1 = {
  Aacute: Aacute$1,
  aacute: aacute$1,
  Abreve,
  abreve,
  ac,
  acd,
  acE,
  Acirc: Acirc$1,
  acirc: acirc$1,
  acute: acute$1,
  Acy,
  acy,
  AElig: AElig$1,
  aelig: aelig$1,
  af,
  Afr,
  afr,
  Agrave: Agrave$1,
  agrave: agrave$1,
  alefsym,
  aleph,
  Alpha,
  alpha,
  Amacr,
  amacr,
  amalg,
  amp: amp$2,
  AMP: AMP$1,
  andand,
  And,
  and,
  andd,
  andslope,
  andv,
  ang,
  ange,
  angle,
  angmsdaa,
  angmsdab,
  angmsdac,
  angmsdad,
  angmsdae,
  angmsdaf,
  angmsdag,
  angmsdah,
  angmsd,
  angrt,
  angrtvb,
  angrtvbd,
  angsph,
  angst,
  angzarr,
  Aogon,
  aogon,
  Aopf,
  aopf,
  apacir,
  ap,
  apE,
  ape,
  apid,
  apos: apos$1,
  ApplyFunction,
  approx,
  approxeq,
  Aring: Aring$1,
  aring: aring$1,
  Ascr,
  ascr,
  Assign,
  ast,
  asymp,
  asympeq,
  Atilde: Atilde$1,
  atilde: atilde$1,
  Auml: Auml$1,
  auml: auml$1,
  awconint,
  awint,
  backcong,
  backepsilon,
  backprime,
  backsim,
  backsimeq,
  Backslash,
  Barv,
  barvee,
  barwed,
  Barwed,
  barwedge,
  bbrk,
  bbrktbrk,
  bcong,
  Bcy,
  bcy,
  bdquo,
  becaus,
  because,
  Because,
  bemptyv,
  bepsi,
  bernou,
  Bernoullis,
  Beta,
  beta,
  beth,
  between,
  Bfr,
  bfr,
  bigcap,
  bigcirc,
  bigcup,
  bigodot,
  bigoplus,
  bigotimes,
  bigsqcup,
  bigstar,
  bigtriangledown,
  bigtriangleup,
  biguplus,
  bigvee,
  bigwedge,
  bkarow,
  blacklozenge,
  blacksquare,
  blacktriangle,
  blacktriangledown,
  blacktriangleleft,
  blacktriangleright,
  blank,
  blk12,
  blk14,
  blk34,
  block,
  bne,
  bnequiv,
  bNot,
  bnot,
  Bopf,
  bopf,
  bot,
  bottom,
  bowtie,
  boxbox,
  boxdl,
  boxdL,
  boxDl,
  boxDL,
  boxdr,
  boxdR,
  boxDr,
  boxDR,
  boxh,
  boxH,
  boxhd,
  boxHd,
  boxhD,
  boxHD,
  boxhu,
  boxHu,
  boxhU,
  boxHU,
  boxminus,
  boxplus,
  boxtimes,
  boxul,
  boxuL,
  boxUl,
  boxUL,
  boxur,
  boxuR,
  boxUr,
  boxUR,
  boxv,
  boxV,
  boxvh,
  boxvH,
  boxVh,
  boxVH,
  boxvl,
  boxvL,
  boxVl,
  boxVL,
  boxvr,
  boxvR,
  boxVr,
  boxVR,
  bprime,
  breve,
  Breve,
  brvbar: brvbar$1,
  bscr,
  Bscr,
  bsemi,
  bsim,
  bsime,
  bsolb,
  bsol,
  bsolhsub,
  bull,
  bullet,
  bump,
  bumpE,
  bumpe,
  Bumpeq,
  bumpeq,
  Cacute,
  cacute,
  capand,
  capbrcup,
  capcap,
  cap,
  Cap,
  capcup,
  capdot,
  CapitalDifferentialD,
  caps,
  caret,
  caron,
  Cayleys,
  ccaps,
  Ccaron,
  ccaron,
  Ccedil: Ccedil$1,
  ccedil: ccedil$1,
  Ccirc,
  ccirc,
  Cconint,
  ccups,
  ccupssm,
  Cdot,
  cdot,
  cedil: cedil$1,
  Cedilla,
  cemptyv,
  cent: cent$1,
  centerdot,
  CenterDot,
  cfr,
  Cfr,
  CHcy,
  chcy,
  check,
  checkmark,
  Chi,
  chi,
  circ,
  circeq,
  circlearrowleft,
  circlearrowright,
  circledast,
  circledcirc,
  circleddash,
  CircleDot,
  circledR,
  circledS,
  CircleMinus,
  CirclePlus,
  CircleTimes,
  cir,
  cirE,
  cire,
  cirfnint,
  cirmid,
  cirscir,
  ClockwiseContourIntegral,
  CloseCurlyDoubleQuote,
  CloseCurlyQuote,
  clubs,
  clubsuit,
  colon,
  Colon,
  Colone,
  colone,
  coloneq,
  comma,
  commat,
  comp,
  compfn,
  complement,
  complexes,
  cong,
  congdot,
  Congruent,
  conint,
  Conint,
  ContourIntegral,
  copf,
  Copf,
  coprod,
  Coproduct,
  copy: copy$1,
  COPY: COPY$1,
  copysr,
  CounterClockwiseContourIntegral,
  crarr,
  cross,
  Cross,
  Cscr,
  cscr,
  csub,
  csube,
  csup,
  csupe,
  ctdot,
  cudarrl,
  cudarrr,
  cuepr,
  cuesc,
  cularr,
  cularrp,
  cupbrcap,
  cupcap,
  CupCap,
  cup,
  Cup,
  cupcup,
  cupdot,
  cupor,
  cups,
  curarr,
  curarrm,
  curlyeqprec,
  curlyeqsucc,
  curlyvee,
  curlywedge,
  curren: curren$1,
  curvearrowleft,
  curvearrowright,
  cuvee,
  cuwed,
  cwconint,
  cwint,
  cylcty,
  dagger,
  Dagger,
  daleth,
  darr,
  Darr,
  dArr,
  dash,
  Dashv,
  dashv,
  dbkarow,
  dblac,
  Dcaron,
  dcaron,
  Dcy,
  dcy,
  ddagger,
  ddarr,
  DD,
  dd,
  DDotrahd,
  ddotseq,
  deg: deg$1,
  Del,
  Delta,
  delta,
  demptyv,
  dfisht,
  Dfr,
  dfr,
  dHar,
  dharl,
  dharr,
  DiacriticalAcute,
  DiacriticalDot,
  DiacriticalDoubleAcute,
  DiacriticalGrave,
  DiacriticalTilde,
  diam,
  diamond,
  Diamond,
  diamondsuit,
  diams,
  die,
  DifferentialD,
  digamma,
  disin,
  div,
  divide: divide$1,
  divideontimes,
  divonx,
  DJcy,
  djcy,
  dlcorn,
  dlcrop,
  dollar,
  Dopf,
  dopf,
  Dot,
  dot,
  DotDot,
  doteq,
  doteqdot,
  DotEqual,
  dotminus,
  dotplus,
  dotsquare,
  doublebarwedge,
  DoubleContourIntegral,
  DoubleDot,
  DoubleDownArrow,
  DoubleLeftArrow,
  DoubleLeftRightArrow,
  DoubleLeftTee,
  DoubleLongLeftArrow,
  DoubleLongLeftRightArrow,
  DoubleLongRightArrow,
  DoubleRightArrow,
  DoubleRightTee,
  DoubleUpArrow,
  DoubleUpDownArrow,
  DoubleVerticalBar,
  DownArrowBar,
  downarrow,
  DownArrow,
  Downarrow,
  DownArrowUpArrow,
  DownBreve,
  downdownarrows,
  downharpoonleft,
  downharpoonright,
  DownLeftRightVector,
  DownLeftTeeVector,
  DownLeftVectorBar,
  DownLeftVector,
  DownRightTeeVector,
  DownRightVectorBar,
  DownRightVector,
  DownTeeArrow,
  DownTee,
  drbkarow,
  drcorn,
  drcrop,
  Dscr,
  dscr,
  DScy,
  dscy,
  dsol,
  Dstrok,
  dstrok,
  dtdot,
  dtri,
  dtrif,
  duarr,
  duhar,
  dwangle,
  DZcy,
  dzcy,
  dzigrarr,
  Eacute: Eacute$1,
  eacute: eacute$1,
  easter,
  Ecaron,
  ecaron,
  Ecirc: Ecirc$1,
  ecirc: ecirc$1,
  ecir,
  ecolon,
  Ecy,
  ecy,
  eDDot,
  Edot,
  edot,
  eDot,
  ee,
  efDot,
  Efr,
  efr,
  eg,
  Egrave: Egrave$1,
  egrave: egrave$1,
  egs,
  egsdot,
  el,
  Element,
  elinters,
  ell,
  els,
  elsdot,
  Emacr,
  emacr,
  empty,
  emptyset,
  EmptySmallSquare,
  emptyv,
  EmptyVerySmallSquare,
  emsp13,
  emsp14,
  emsp,
  ENG,
  eng,
  ensp,
  Eogon,
  eogon,
  Eopf,
  eopf,
  epar,
  eparsl,
  eplus,
  epsi,
  Epsilon,
  epsilon,
  epsiv,
  eqcirc,
  eqcolon,
  eqsim,
  eqslantgtr,
  eqslantless,
  Equal,
  equals,
  EqualTilde,
  equest,
  Equilibrium,
  equiv,
  equivDD,
  eqvparsl,
  erarr,
  erDot,
  escr,
  Escr,
  esdot,
  Esim,
  esim,
  Eta,
  eta,
  ETH: ETH$1,
  eth: eth$1,
  Euml: Euml$1,
  euml: euml$1,
  euro,
  excl,
  exist,
  Exists,
  expectation,
  exponentiale,
  ExponentialE,
  fallingdotseq,
  Fcy,
  fcy,
  female,
  ffilig,
  fflig,
  ffllig,
  Ffr,
  ffr,
  filig,
  FilledSmallSquare,
  FilledVerySmallSquare,
  fjlig,
  flat,
  fllig,
  fltns,
  fnof,
  Fopf,
  fopf,
  forall,
  ForAll,
  fork,
  forkv,
  Fouriertrf,
  fpartint,
  frac12: frac12$1,
  frac13,
  frac14: frac14$1,
  frac15,
  frac16,
  frac18,
  frac23,
  frac25,
  frac34: frac34$1,
  frac35,
  frac38,
  frac45,
  frac56,
  frac58,
  frac78,
  frasl,
  frown,
  fscr,
  Fscr,
  gacute,
  Gamma,
  gamma,
  Gammad,
  gammad,
  gap,
  Gbreve,
  gbreve,
  Gcedil,
  Gcirc,
  gcirc,
  Gcy,
  gcy,
  Gdot,
  gdot,
  ge,
  gE,
  gEl,
  gel,
  geq,
  geqq,
  geqslant,
  gescc,
  ges,
  gesdot,
  gesdoto,
  gesdotol,
  gesl,
  gesles,
  Gfr,
  gfr,
  gg,
  Gg,
  ggg,
  gimel,
  GJcy,
  gjcy,
  gla,
  gl,
  glE,
  glj,
  gnap,
  gnapprox,
  gne,
  gnE,
  gneq,
  gneqq,
  gnsim,
  Gopf,
  gopf,
  grave,
  GreaterEqual,
  GreaterEqualLess,
  GreaterFullEqual,
  GreaterGreater,
  GreaterLess,
  GreaterSlantEqual,
  GreaterTilde,
  Gscr,
  gscr,
  gsim,
  gsime,
  gsiml,
  gtcc,
  gtcir,
  gt: gt$2,
  GT: GT$1,
  Gt,
  gtdot,
  gtlPar,
  gtquest,
  gtrapprox,
  gtrarr,
  gtrdot,
  gtreqless,
  gtreqqless,
  gtrless,
  gtrsim,
  gvertneqq,
  gvnE,
  Hacek,
  hairsp,
  half,
  hamilt,
  HARDcy,
  hardcy,
  harrcir,
  harr,
  hArr,
  harrw,
  Hat,
  hbar,
  Hcirc,
  hcirc,
  hearts,
  heartsuit,
  hellip,
  hercon,
  hfr,
  Hfr,
  HilbertSpace,
  hksearow,
  hkswarow,
  hoarr,
  homtht,
  hookleftarrow,
  hookrightarrow,
  hopf,
  Hopf,
  horbar,
  HorizontalLine,
  hscr,
  Hscr,
  hslash,
  Hstrok,
  hstrok,
  HumpDownHump,
  HumpEqual,
  hybull,
  hyphen,
  Iacute: Iacute$1,
  iacute: iacute$1,
  ic,
  Icirc: Icirc$1,
  icirc: icirc$1,
  Icy,
  icy,
  Idot,
  IEcy,
  iecy,
  iexcl: iexcl$1,
  iff,
  ifr,
  Ifr,
  Igrave: Igrave$1,
  igrave: igrave$1,
  ii,
  iiiint,
  iiint,
  iinfin,
  iiota,
  IJlig,
  ijlig,
  Imacr,
  imacr,
  image,
  ImaginaryI,
  imagline,
  imagpart,
  imath,
  Im,
  imof,
  imped,
  Implies,
  incare,
  "in": "∈",
  infin,
  infintie,
  inodot,
  intcal,
  int,
  Int,
  integers,
  Integral,
  intercal,
  Intersection,
  intlarhk,
  intprod,
  InvisibleComma,
  InvisibleTimes,
  IOcy,
  iocy,
  Iogon,
  iogon,
  Iopf,
  iopf,
  Iota,
  iota,
  iprod,
  iquest: iquest$1,
  iscr,
  Iscr,
  isin,
  isindot,
  isinE,
  isins,
  isinsv,
  isinv,
  it,
  Itilde,
  itilde,
  Iukcy,
  iukcy,
  Iuml: Iuml$1,
  iuml: iuml$1,
  Jcirc,
  jcirc,
  Jcy,
  jcy,
  Jfr,
  jfr,
  jmath,
  Jopf,
  jopf,
  Jscr,
  jscr,
  Jsercy,
  jsercy,
  Jukcy,
  jukcy,
  Kappa,
  kappa,
  kappav,
  Kcedil,
  kcedil,
  Kcy,
  kcy,
  Kfr,
  kfr,
  kgreen,
  KHcy,
  khcy,
  KJcy,
  kjcy,
  Kopf,
  kopf,
  Kscr,
  kscr,
  lAarr,
  Lacute,
  lacute,
  laemptyv,
  lagran,
  Lambda,
  lambda,
  lang,
  Lang,
  langd,
  langle,
  lap,
  Laplacetrf,
  laquo: laquo$1,
  larrb,
  larrbfs,
  larr,
  Larr,
  lArr,
  larrfs,
  larrhk,
  larrlp,
  larrpl,
  larrsim,
  larrtl,
  latail,
  lAtail,
  lat,
  late,
  lates,
  lbarr,
  lBarr,
  lbbrk,
  lbrace,
  lbrack,
  lbrke,
  lbrksld,
  lbrkslu,
  Lcaron,
  lcaron,
  Lcedil,
  lcedil,
  lceil,
  lcub,
  Lcy,
  lcy,
  ldca,
  ldquo,
  ldquor,
  ldrdhar,
  ldrushar,
  ldsh,
  le,
  lE,
  LeftAngleBracket,
  LeftArrowBar,
  leftarrow,
  LeftArrow,
  Leftarrow,
  LeftArrowRightArrow,
  leftarrowtail,
  LeftCeiling,
  LeftDoubleBracket,
  LeftDownTeeVector,
  LeftDownVectorBar,
  LeftDownVector,
  LeftFloor,
  leftharpoondown,
  leftharpoonup,
  leftleftarrows,
  leftrightarrow,
  LeftRightArrow,
  Leftrightarrow,
  leftrightarrows,
  leftrightharpoons,
  leftrightsquigarrow,
  LeftRightVector,
  LeftTeeArrow,
  LeftTee,
  LeftTeeVector,
  leftthreetimes,
  LeftTriangleBar,
  LeftTriangle,
  LeftTriangleEqual,
  LeftUpDownVector,
  LeftUpTeeVector,
  LeftUpVectorBar,
  LeftUpVector,
  LeftVectorBar,
  LeftVector,
  lEg,
  leg,
  leq,
  leqq,
  leqslant,
  lescc,
  les,
  lesdot,
  lesdoto,
  lesdotor,
  lesg,
  lesges,
  lessapprox,
  lessdot,
  lesseqgtr,
  lesseqqgtr,
  LessEqualGreater,
  LessFullEqual,
  LessGreater,
  lessgtr,
  LessLess,
  lesssim,
  LessSlantEqual,
  LessTilde,
  lfisht,
  lfloor,
  Lfr,
  lfr,
  lg,
  lgE,
  lHar,
  lhard,
  lharu,
  lharul,
  lhblk,
  LJcy,
  ljcy,
  llarr,
  ll,
  Ll,
  llcorner,
  Lleftarrow,
  llhard,
  lltri,
  Lmidot,
  lmidot,
  lmoustache,
  lmoust,
  lnap,
  lnapprox,
  lne,
  lnE,
  lneq,
  lneqq,
  lnsim,
  loang,
  loarr,
  lobrk,
  longleftarrow,
  LongLeftArrow,
  Longleftarrow,
  longleftrightarrow,
  LongLeftRightArrow,
  Longleftrightarrow,
  longmapsto,
  longrightarrow,
  LongRightArrow,
  Longrightarrow,
  looparrowleft,
  looparrowright,
  lopar,
  Lopf,
  lopf,
  loplus,
  lotimes,
  lowast,
  lowbar,
  LowerLeftArrow,
  LowerRightArrow,
  loz,
  lozenge,
  lozf,
  lpar,
  lparlt,
  lrarr,
  lrcorner,
  lrhar,
  lrhard,
  lrm,
  lrtri,
  lsaquo,
  lscr,
  Lscr,
  lsh,
  Lsh,
  lsim,
  lsime,
  lsimg,
  lsqb,
  lsquo,
  lsquor,
  Lstrok,
  lstrok,
  ltcc,
  ltcir,
  lt: lt$2,
  LT: LT$1,
  Lt,
  ltdot,
  lthree,
  ltimes,
  ltlarr,
  ltquest,
  ltri,
  ltrie,
  ltrif,
  ltrPar,
  lurdshar,
  luruhar,
  lvertneqq,
  lvnE,
  macr: macr$1,
  male,
  malt,
  maltese,
  "Map": "⤅",
  map,
  mapsto,
  mapstodown,
  mapstoleft,
  mapstoup,
  marker,
  mcomma,
  Mcy,
  mcy,
  mdash,
  mDDot,
  measuredangle,
  MediumSpace,
  Mellintrf,
  Mfr,
  mfr,
  mho,
  micro: micro$1,
  midast,
  midcir,
  mid,
  middot: middot$1,
  minusb,
  minus,
  minusd,
  minusdu,
  MinusPlus,
  mlcp,
  mldr,
  mnplus,
  models,
  Mopf,
  mopf,
  mp,
  mscr,
  Mscr,
  mstpos,
  Mu,
  mu,
  multimap,
  mumap,
  nabla,
  Nacute,
  nacute,
  nang,
  nap,
  napE,
  napid,
  napos,
  napprox,
  natural,
  naturals,
  natur,
  nbsp: nbsp$1,
  nbump,
  nbumpe,
  ncap,
  Ncaron,
  ncaron,
  Ncedil,
  ncedil,
  ncong,
  ncongdot,
  ncup,
  Ncy,
  ncy,
  ndash,
  nearhk,
  nearr,
  neArr,
  nearrow,
  ne,
  nedot,
  NegativeMediumSpace,
  NegativeThickSpace,
  NegativeThinSpace,
  NegativeVeryThinSpace,
  nequiv,
  nesear,
  nesim,
  NestedGreaterGreater,
  NestedLessLess,
  NewLine,
  nexist,
  nexists,
  Nfr,
  nfr,
  ngE,
  nge,
  ngeq,
  ngeqq,
  ngeqslant,
  nges,
  nGg,
  ngsim,
  nGt,
  ngt,
  ngtr,
  nGtv,
  nharr,
  nhArr,
  nhpar,
  ni,
  nis,
  nisd,
  niv,
  NJcy,
  njcy,
  nlarr,
  nlArr,
  nldr,
  nlE,
  nle,
  nleftarrow,
  nLeftarrow,
  nleftrightarrow,
  nLeftrightarrow,
  nleq,
  nleqq,
  nleqslant,
  nles,
  nless,
  nLl,
  nlsim,
  nLt,
  nlt,
  nltri,
  nltrie,
  nLtv,
  nmid,
  NoBreak,
  NonBreakingSpace,
  nopf,
  Nopf,
  Not,
  not: not$1,
  NotCongruent,
  NotCupCap,
  NotDoubleVerticalBar,
  NotElement,
  NotEqual,
  NotEqualTilde,
  NotExists,
  NotGreater,
  NotGreaterEqual,
  NotGreaterFullEqual,
  NotGreaterGreater,
  NotGreaterLess,
  NotGreaterSlantEqual,
  NotGreaterTilde,
  NotHumpDownHump,
  NotHumpEqual,
  notin,
  notindot,
  notinE,
  notinva,
  notinvb,
  notinvc,
  NotLeftTriangleBar,
  NotLeftTriangle,
  NotLeftTriangleEqual,
  NotLess,
  NotLessEqual,
  NotLessGreater,
  NotLessLess,
  NotLessSlantEqual,
  NotLessTilde,
  NotNestedGreaterGreater,
  NotNestedLessLess,
  notni,
  notniva,
  notnivb,
  notnivc,
  NotPrecedes,
  NotPrecedesEqual,
  NotPrecedesSlantEqual,
  NotReverseElement,
  NotRightTriangleBar,
  NotRightTriangle,
  NotRightTriangleEqual,
  NotSquareSubset,
  NotSquareSubsetEqual,
  NotSquareSuperset,
  NotSquareSupersetEqual,
  NotSubset,
  NotSubsetEqual,
  NotSucceeds,
  NotSucceedsEqual,
  NotSucceedsSlantEqual,
  NotSucceedsTilde,
  NotSuperset,
  NotSupersetEqual,
  NotTilde,
  NotTildeEqual,
  NotTildeFullEqual,
  NotTildeTilde,
  NotVerticalBar,
  nparallel,
  npar,
  nparsl,
  npart,
  npolint,
  npr,
  nprcue,
  nprec,
  npreceq,
  npre,
  nrarrc,
  nrarr,
  nrArr,
  nrarrw,
  nrightarrow,
  nRightarrow,
  nrtri,
  nrtrie,
  nsc,
  nsccue,
  nsce,
  Nscr,
  nscr,
  nshortmid,
  nshortparallel,
  nsim,
  nsime,
  nsimeq,
  nsmid,
  nspar,
  nsqsube,
  nsqsupe,
  nsub,
  nsubE,
  nsube,
  nsubset,
  nsubseteq,
  nsubseteqq,
  nsucc,
  nsucceq,
  nsup,
  nsupE,
  nsupe,
  nsupset,
  nsupseteq,
  nsupseteqq,
  ntgl,
  Ntilde: Ntilde$1,
  ntilde: ntilde$1,
  ntlg,
  ntriangleleft,
  ntrianglelefteq,
  ntriangleright,
  ntrianglerighteq,
  Nu,
  nu,
  num,
  numero,
  numsp,
  nvap,
  nvdash,
  nvDash,
  nVdash,
  nVDash,
  nvge,
  nvgt,
  nvHarr,
  nvinfin,
  nvlArr,
  nvle,
  nvlt,
  nvltrie,
  nvrArr,
  nvrtrie,
  nvsim,
  nwarhk,
  nwarr,
  nwArr,
  nwarrow,
  nwnear,
  Oacute: Oacute$1,
  oacute: oacute$1,
  oast,
  Ocirc: Ocirc$1,
  ocirc: ocirc$1,
  ocir,
  Ocy,
  ocy,
  odash,
  Odblac,
  odblac,
  odiv,
  odot,
  odsold,
  OElig,
  oelig,
  ofcir,
  Ofr,
  ofr,
  ogon,
  Ograve: Ograve$1,
  ograve: ograve$1,
  ogt,
  ohbar,
  ohm,
  oint,
  olarr,
  olcir,
  olcross,
  oline,
  olt,
  Omacr,
  omacr,
  Omega,
  omega,
  Omicron,
  omicron,
  omid,
  ominus,
  Oopf,
  oopf,
  opar,
  OpenCurlyDoubleQuote,
  OpenCurlyQuote,
  operp,
  oplus,
  orarr,
  Or,
  or,
  ord,
  order,
  orderof,
  ordf: ordf$1,
  ordm: ordm$1,
  origof,
  oror,
  orslope,
  orv,
  oS,
  Oscr,
  oscr,
  Oslash: Oslash$1,
  oslash: oslash$1,
  osol,
  Otilde: Otilde$1,
  otilde: otilde$1,
  otimesas,
  Otimes,
  otimes,
  Ouml: Ouml$1,
  ouml: ouml$1,
  ovbar,
  OverBar,
  OverBrace,
  OverBracket,
  OverParenthesis,
  para: para$1,
  parallel,
  par,
  parsim,
  parsl,
  part,
  PartialD,
  Pcy,
  pcy,
  percnt,
  period,
  permil,
  perp,
  pertenk,
  Pfr,
  pfr,
  Phi,
  phi,
  phiv,
  phmmat,
  phone,
  Pi,
  pi,
  pitchfork,
  piv,
  planck,
  planckh,
  plankv,
  plusacir,
  plusb,
  pluscir,
  plus,
  plusdo,
  plusdu,
  pluse,
  PlusMinus,
  plusmn: plusmn$1,
  plussim,
  plustwo,
  pm,
  Poincareplane,
  pointint,
  popf,
  Popf,
  pound: pound$1,
  prap,
  Pr,
  pr,
  prcue,
  precapprox,
  prec,
  preccurlyeq,
  Precedes,
  PrecedesEqual,
  PrecedesSlantEqual,
  PrecedesTilde,
  preceq,
  precnapprox,
  precneqq,
  precnsim,
  pre,
  prE,
  precsim,
  prime,
  Prime,
  primes,
  prnap,
  prnE,
  prnsim,
  prod,
  Product,
  profalar,
  profline,
  profsurf,
  prop,
  Proportional,
  Proportion,
  propto,
  prsim,
  prurel,
  Pscr,
  pscr,
  Psi,
  psi,
  puncsp,
  Qfr,
  qfr,
  qint,
  qopf,
  Qopf,
  qprime,
  Qscr,
  qscr,
  quaternions,
  quatint,
  quest,
  questeq,
  quot: quot$2,
  QUOT: QUOT$1,
  rAarr,
  race,
  Racute,
  racute,
  radic,
  raemptyv,
  rang,
  Rang,
  rangd,
  range,
  rangle,
  raquo: raquo$1,
  rarrap,
  rarrb,
  rarrbfs,
  rarrc,
  rarr,
  Rarr,
  rArr,
  rarrfs,
  rarrhk,
  rarrlp,
  rarrpl,
  rarrsim,
  Rarrtl,
  rarrtl,
  rarrw,
  ratail,
  rAtail,
  ratio,
  rationals,
  rbarr,
  rBarr,
  RBarr,
  rbbrk,
  rbrace,
  rbrack,
  rbrke,
  rbrksld,
  rbrkslu,
  Rcaron,
  rcaron,
  Rcedil,
  rcedil,
  rceil,
  rcub,
  Rcy,
  rcy,
  rdca,
  rdldhar,
  rdquo,
  rdquor,
  rdsh,
  real,
  realine,
  realpart,
  reals,
  Re,
  rect,
  reg: reg$1,
  REG: REG$1,
  ReverseElement,
  ReverseEquilibrium,
  ReverseUpEquilibrium,
  rfisht,
  rfloor,
  rfr,
  Rfr,
  rHar,
  rhard,
  rharu,
  rharul,
  Rho,
  rho,
  rhov,
  RightAngleBracket,
  RightArrowBar,
  rightarrow,
  RightArrow,
  Rightarrow,
  RightArrowLeftArrow,
  rightarrowtail,
  RightCeiling,
  RightDoubleBracket,
  RightDownTeeVector,
  RightDownVectorBar,
  RightDownVector,
  RightFloor,
  rightharpoondown,
  rightharpoonup,
  rightleftarrows,
  rightleftharpoons,
  rightrightarrows,
  rightsquigarrow,
  RightTeeArrow,
  RightTee,
  RightTeeVector,
  rightthreetimes,
  RightTriangleBar,
  RightTriangle,
  RightTriangleEqual,
  RightUpDownVector,
  RightUpTeeVector,
  RightUpVectorBar,
  RightUpVector,
  RightVectorBar,
  RightVector,
  ring,
  risingdotseq,
  rlarr,
  rlhar,
  rlm,
  rmoustache,
  rmoust,
  rnmid,
  roang,
  roarr,
  robrk,
  ropar,
  ropf,
  Ropf,
  roplus,
  rotimes,
  RoundImplies,
  rpar,
  rpargt,
  rppolint,
  rrarr,
  Rrightarrow,
  rsaquo,
  rscr,
  Rscr,
  rsh,
  Rsh,
  rsqb,
  rsquo,
  rsquor,
  rthree,
  rtimes,
  rtri,
  rtrie,
  rtrif,
  rtriltri,
  RuleDelayed,
  ruluhar,
  rx,
  Sacute,
  sacute,
  sbquo,
  scap,
  Scaron,
  scaron,
  Sc,
  sc,
  sccue,
  sce,
  scE,
  Scedil,
  scedil,
  Scirc,
  scirc,
  scnap,
  scnE,
  scnsim,
  scpolint,
  scsim,
  Scy,
  scy,
  sdotb,
  sdot,
  sdote,
  searhk,
  searr,
  seArr,
  searrow,
  sect: sect$1,
  semi,
  seswar,
  setminus,
  setmn,
  sext,
  Sfr,
  sfr,
  sfrown,
  sharp,
  SHCHcy,
  shchcy,
  SHcy,
  shcy,
  ShortDownArrow,
  ShortLeftArrow,
  shortmid,
  shortparallel,
  ShortRightArrow,
  ShortUpArrow,
  shy: shy$1,
  Sigma,
  sigma,
  sigmaf,
  sigmav,
  sim,
  simdot,
  sime,
  simeq,
  simg,
  simgE,
  siml,
  simlE,
  simne,
  simplus,
  simrarr,
  slarr,
  SmallCircle,
  smallsetminus,
  smashp,
  smeparsl,
  smid,
  smile,
  smt,
  smte,
  smtes,
  SOFTcy,
  softcy,
  solbar,
  solb,
  sol,
  Sopf,
  sopf,
  spades,
  spadesuit,
  spar,
  sqcap,
  sqcaps,
  sqcup,
  sqcups,
  Sqrt,
  sqsub,
  sqsube,
  sqsubset,
  sqsubseteq,
  sqsup,
  sqsupe,
  sqsupset,
  sqsupseteq,
  square,
  Square,
  SquareIntersection,
  SquareSubset,
  SquareSubsetEqual,
  SquareSuperset,
  SquareSupersetEqual,
  SquareUnion,
  squarf,
  squ,
  squf,
  srarr,
  Sscr,
  sscr,
  ssetmn,
  ssmile,
  sstarf,
  Star,
  star,
  starf,
  straightepsilon,
  straightphi,
  strns,
  sub,
  Sub,
  subdot,
  subE,
  sube,
  subedot,
  submult,
  subnE,
  subne,
  subplus,
  subrarr,
  subset,
  Subset,
  subseteq,
  subseteqq,
  SubsetEqual,
  subsetneq,
  subsetneqq,
  subsim,
  subsub,
  subsup,
  succapprox,
  succ,
  succcurlyeq,
  Succeeds,
  SucceedsEqual,
  SucceedsSlantEqual,
  SucceedsTilde,
  succeq,
  succnapprox,
  succneqq,
  succnsim,
  succsim,
  SuchThat,
  sum,
  Sum,
  sung,
  sup1: sup1$1,
  sup2: sup2$1,
  sup3: sup3$1,
  sup,
  Sup,
  supdot,
  supdsub,
  supE,
  supe,
  supedot,
  Superset,
  SupersetEqual,
  suphsol,
  suphsub,
  suplarr,
  supmult,
  supnE,
  supne,
  supplus,
  supset,
  Supset,
  supseteq,
  supseteqq,
  supsetneq,
  supsetneqq,
  supsim,
  supsub,
  supsup,
  swarhk,
  swarr,
  swArr,
  swarrow,
  swnwar,
  szlig: szlig$1,
  Tab,
  target,
  Tau,
  tau,
  tbrk,
  Tcaron,
  tcaron,
  Tcedil,
  tcedil,
  Tcy,
  tcy,
  tdot,
  telrec,
  Tfr,
  tfr,
  there4,
  therefore,
  Therefore,
  Theta,
  theta,
  thetasym,
  thetav,
  thickapprox,
  thicksim,
  ThickSpace,
  ThinSpace,
  thinsp,
  thkap,
  thksim,
  THORN: THORN$1,
  thorn: thorn$1,
  tilde,
  Tilde,
  TildeEqual,
  TildeFullEqual,
  TildeTilde,
  timesbar,
  timesb,
  times: times$1,
  timesd,
  tint,
  toea,
  topbot,
  topcir,
  top,
  Topf,
  topf,
  topfork,
  tosa,
  tprime,
  trade,
  TRADE,
  triangle,
  triangledown,
  triangleleft,
  trianglelefteq,
  triangleq,
  triangleright,
  trianglerighteq,
  tridot,
  trie,
  triminus,
  TripleDot,
  triplus,
  trisb,
  tritime,
  trpezium,
  Tscr,
  tscr,
  TScy,
  tscy,
  TSHcy,
  tshcy,
  Tstrok,
  tstrok,
  twixt,
  twoheadleftarrow,
  twoheadrightarrow,
  Uacute: Uacute$1,
  uacute: uacute$1,
  uarr,
  Uarr,
  uArr,
  Uarrocir,
  Ubrcy,
  ubrcy,
  Ubreve,
  ubreve,
  Ucirc: Ucirc$1,
  ucirc: ucirc$1,
  Ucy,
  ucy,
  udarr,
  Udblac,
  udblac,
  udhar,
  ufisht,
  Ufr,
  ufr,
  Ugrave: Ugrave$1,
  ugrave: ugrave$1,
  uHar,
  uharl,
  uharr,
  uhblk,
  ulcorn,
  ulcorner,
  ulcrop,
  ultri,
  Umacr,
  umacr,
  uml: uml$1,
  UnderBar,
  UnderBrace,
  UnderBracket,
  UnderParenthesis,
  Union,
  UnionPlus,
  Uogon,
  uogon,
  Uopf,
  uopf,
  UpArrowBar,
  uparrow,
  UpArrow,
  Uparrow,
  UpArrowDownArrow,
  updownarrow,
  UpDownArrow,
  Updownarrow,
  UpEquilibrium,
  upharpoonleft,
  upharpoonright,
  uplus,
  UpperLeftArrow,
  UpperRightArrow,
  upsi,
  Upsi,
  upsih,
  Upsilon,
  upsilon,
  UpTeeArrow,
  UpTee,
  upuparrows,
  urcorn,
  urcorner,
  urcrop,
  Uring,
  uring,
  urtri,
  Uscr,
  uscr,
  utdot,
  Utilde,
  utilde,
  utri,
  utrif,
  uuarr,
  Uuml: Uuml$1,
  uuml: uuml$1,
  uwangle,
  vangrt,
  varepsilon,
  varkappa,
  varnothing,
  varphi,
  varpi,
  varpropto,
  varr,
  vArr,
  varrho,
  varsigma,
  varsubsetneq,
  varsubsetneqq,
  varsupsetneq,
  varsupsetneqq,
  vartheta,
  vartriangleleft,
  vartriangleright,
  vBar,
  Vbar,
  vBarv,
  Vcy,
  vcy,
  vdash,
  vDash,
  Vdash,
  VDash,
  Vdashl,
  veebar,
  vee,
  Vee,
  veeeq,
  vellip,
  verbar,
  Verbar,
  vert,
  Vert,
  VerticalBar,
  VerticalLine,
  VerticalSeparator,
  VerticalTilde,
  VeryThinSpace,
  Vfr,
  vfr,
  vltri,
  vnsub,
  vnsup,
  Vopf,
  vopf,
  vprop,
  vrtri,
  Vscr,
  vscr,
  vsubnE,
  vsubne,
  vsupnE,
  vsupne,
  Vvdash,
  vzigzag,
  Wcirc,
  wcirc,
  wedbar,
  wedge,
  Wedge,
  wedgeq,
  weierp,
  Wfr,
  wfr,
  Wopf,
  wopf,
  wp,
  wr,
  wreath,
  Wscr,
  wscr,
  xcap,
  xcirc,
  xcup,
  xdtri,
  Xfr,
  xfr,
  xharr,
  xhArr,
  Xi,
  xi,
  xlarr,
  xlArr,
  xmap,
  xnis,
  xodot,
  Xopf,
  xopf,
  xoplus,
  xotime,
  xrarr,
  xrArr,
  Xscr,
  xscr,
  xsqcup,
  xuplus,
  xutri,
  xvee,
  xwedge,
  Yacute: Yacute$1,
  yacute: yacute$1,
  YAcy,
  yacy,
  Ycirc,
  ycirc,
  Ycy,
  ycy,
  yen: yen$1,
  Yfr,
  yfr,
  YIcy,
  yicy,
  Yopf,
  yopf,
  Yscr,
  yscr,
  YUcy,
  yucy,
  yuml: yuml$1,
  Yuml,
  Zacute,
  zacute,
  Zcaron,
  zcaron,
  Zcy,
  zcy,
  Zdot,
  zdot,
  zeetrf,
  ZeroWidthSpace,
  Zeta,
  zeta,
  zfr,
  Zfr,
  ZHcy,
  zhcy,
  zigrarr,
  zopf,
  Zopf,
  Zscr,
  zscr,
  zwj,
  zwnj
};
const Aacute = "Á";
const aacute = "á";
const Acirc = "Â";
const acirc = "â";
const acute = "´";
const AElig = "Æ";
const aelig = "æ";
const Agrave = "À";
const agrave = "à";
const amp$1 = "&";
const AMP = "&";
const Aring = "Å";
const aring = "å";
const Atilde = "Ã";
const atilde = "ã";
const Auml = "Ä";
const auml = "ä";
const brvbar = "¦";
const Ccedil = "Ç";
const ccedil = "ç";
const cedil = "¸";
const cent = "¢";
const copy = "©";
const COPY = "©";
const curren = "¤";
const deg = "°";
const divide = "÷";
const Eacute = "É";
const eacute = "é";
const Ecirc = "Ê";
const ecirc = "ê";
const Egrave = "È";
const egrave = "è";
const ETH = "Ð";
const eth = "ð";
const Euml = "Ë";
const euml = "ë";
const frac12 = "½";
const frac14 = "¼";
const frac34 = "¾";
const gt$1 = ">";
const GT = ">";
const Iacute = "Í";
const iacute = "í";
const Icirc = "Î";
const icirc = "î";
const iexcl = "¡";
const Igrave = "Ì";
const igrave = "ì";
const iquest = "¿";
const Iuml = "Ï";
const iuml = "ï";
const laquo = "«";
const lt$1 = "<";
const LT = "<";
const macr = "¯";
const micro = "µ";
const middot = "·";
const nbsp = " ";
const not = "¬";
const Ntilde = "Ñ";
const ntilde = "ñ";
const Oacute = "Ó";
const oacute = "ó";
const Ocirc = "Ô";
const ocirc = "ô";
const Ograve = "Ò";
const ograve = "ò";
const ordf = "ª";
const ordm = "º";
const Oslash = "Ø";
const oslash = "ø";
const Otilde = "Õ";
const otilde = "õ";
const Ouml = "Ö";
const ouml = "ö";
const para = "¶";
const plusmn = "±";
const pound = "£";
const quot$1 = '"';
const QUOT = '"';
const raquo = "»";
const reg = "®";
const REG = "®";
const sect = "§";
const shy = "­";
const sup1 = "¹";
const sup2 = "²";
const sup3 = "³";
const szlig = "ß";
const THORN = "Þ";
const thorn = "þ";
const times = "×";
const Uacute = "Ú";
const uacute = "ú";
const Ucirc = "Û";
const ucirc = "û";
const Ugrave = "Ù";
const ugrave = "ù";
const uml = "¨";
const Uuml = "Ü";
const uuml = "ü";
const Yacute = "Ý";
const yacute = "ý";
const yen = "¥";
const yuml = "ÿ";
const require$$2 = {
  Aacute,
  aacute,
  Acirc,
  acirc,
  acute,
  AElig,
  aelig,
  Agrave,
  agrave,
  amp: amp$1,
  AMP,
  Aring,
  aring,
  Atilde,
  atilde,
  Auml,
  auml,
  brvbar,
  Ccedil,
  ccedil,
  cedil,
  cent,
  copy,
  COPY,
  curren,
  deg,
  divide,
  Eacute,
  eacute,
  Ecirc,
  ecirc,
  Egrave,
  egrave,
  ETH,
  eth,
  Euml,
  euml,
  frac12,
  frac14,
  frac34,
  gt: gt$1,
  GT,
  Iacute,
  iacute,
  Icirc,
  icirc,
  iexcl,
  Igrave,
  igrave,
  iquest,
  Iuml,
  iuml,
  laquo,
  lt: lt$1,
  LT,
  macr,
  micro,
  middot,
  nbsp,
  not,
  Ntilde,
  ntilde,
  Oacute,
  oacute,
  Ocirc,
  ocirc,
  Ograve,
  ograve,
  ordf,
  ordm,
  Oslash,
  oslash,
  Otilde,
  otilde,
  Ouml,
  ouml,
  para,
  plusmn,
  pound,
  quot: quot$1,
  QUOT,
  raquo,
  reg,
  REG,
  sect,
  shy,
  sup1,
  sup2,
  sup3,
  szlig,
  THORN,
  thorn,
  times,
  Uacute,
  uacute,
  Ucirc,
  ucirc,
  Ugrave,
  ugrave,
  uml,
  Uuml,
  uuml,
  Yacute,
  yacute,
  yen,
  yuml
};
const amp = "&";
const apos = "'";
const gt = ">";
const lt = "<";
const quot = '"';
const require$$3 = {
  amp,
  apos,
  gt,
  lt,
  quot
};
var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(Tokenizer$2, "__esModule", { value: true });
var decode_codepoint_1 = __importDefault(decode_codepoint);
var entities_json_1 = __importDefault(require$$1);
var legacy_json_1 = __importDefault(require$$2);
var xml_json_1 = __importDefault(require$$3);
function whitespace(c) {
  return c === " " || c === "\n" || c === "	" || c === "\f" || c === "\r";
}
function isASCIIAlpha(c) {
  return c >= "a" && c <= "z" || c >= "A" && c <= "Z";
}
function ifElseState(upper, SUCCESS, FAILURE) {
  var lower = upper.toLowerCase();
  if (upper === lower) {
    return function(t2, c) {
      if (c === lower) {
        t2._state = SUCCESS;
      } else {
        t2._state = FAILURE;
        t2._index--;
      }
    };
  }
  return function(t2, c) {
    if (c === lower || c === upper) {
      t2._state = SUCCESS;
    } else {
      t2._state = FAILURE;
      t2._index--;
    }
  };
}
function consumeSpecialNameChar(upper, NEXT_STATE) {
  var lower = upper.toLowerCase();
  return function(t2, c) {
    if (c === lower || c === upper) {
      t2._state = NEXT_STATE;
    } else {
      t2._state = 3;
      t2._index--;
    }
  };
}
var stateBeforeCdata1 = ifElseState(
  "C",
  24,
  16
  /* InDeclaration */
);
var stateBeforeCdata2 = ifElseState(
  "D",
  25,
  16
  /* InDeclaration */
);
var stateBeforeCdata3 = ifElseState(
  "A",
  26,
  16
  /* InDeclaration */
);
var stateBeforeCdata4 = ifElseState(
  "T",
  27,
  16
  /* InDeclaration */
);
var stateBeforeCdata5 = ifElseState(
  "A",
  28,
  16
  /* InDeclaration */
);
var stateBeforeScript1 = consumeSpecialNameChar(
  "R",
  35
  /* BeforeScript2 */
);
var stateBeforeScript2 = consumeSpecialNameChar(
  "I",
  36
  /* BeforeScript3 */
);
var stateBeforeScript3 = consumeSpecialNameChar(
  "P",
  37
  /* BeforeScript4 */
);
var stateBeforeScript4 = consumeSpecialNameChar(
  "T",
  38
  /* BeforeScript5 */
);
var stateAfterScript1 = ifElseState(
  "R",
  40,
  1
  /* Text */
);
var stateAfterScript2 = ifElseState(
  "I",
  41,
  1
  /* Text */
);
var stateAfterScript3 = ifElseState(
  "P",
  42,
  1
  /* Text */
);
var stateAfterScript4 = ifElseState(
  "T",
  43,
  1
  /* Text */
);
var stateBeforeStyle1 = consumeSpecialNameChar(
  "Y",
  45
  /* BeforeStyle2 */
);
var stateBeforeStyle2 = consumeSpecialNameChar(
  "L",
  46
  /* BeforeStyle3 */
);
var stateBeforeStyle3 = consumeSpecialNameChar(
  "E",
  47
  /* BeforeStyle4 */
);
var stateAfterStyle1 = ifElseState(
  "Y",
  49,
  1
  /* Text */
);
var stateAfterStyle2 = ifElseState(
  "L",
  50,
  1
  /* Text */
);
var stateAfterStyle3 = ifElseState(
  "E",
  51,
  1
  /* Text */
);
var stateBeforeSpecialT = consumeSpecialNameChar(
  "I",
  54
  /* BeforeTitle1 */
);
var stateBeforeTitle1 = consumeSpecialNameChar(
  "T",
  55
  /* BeforeTitle2 */
);
var stateBeforeTitle2 = consumeSpecialNameChar(
  "L",
  56
  /* BeforeTitle3 */
);
var stateBeforeTitle3 = consumeSpecialNameChar(
  "E",
  57
  /* BeforeTitle4 */
);
var stateAfterSpecialTEnd = ifElseState(
  "I",
  58,
  1
  /* Text */
);
var stateAfterTitle1 = ifElseState(
  "T",
  59,
  1
  /* Text */
);
var stateAfterTitle2 = ifElseState(
  "L",
  60,
  1
  /* Text */
);
var stateAfterTitle3 = ifElseState(
  "E",
  61,
  1
  /* Text */
);
var stateBeforeEntity = ifElseState(
  "#",
  63,
  64
  /* InNamedEntity */
);
var stateBeforeNumericEntity = ifElseState(
  "X",
  66,
  65
  /* InNumericEntity */
);
var Tokenizer$1 = (
  /** @class */
  (function() {
    function Tokenizer2(options, cbs) {
      var _a;
      this._state = 1;
      this.buffer = "";
      this.sectionStart = 0;
      this._index = 0;
      this.bufferOffset = 0;
      this.baseState = 1;
      this.special = 1;
      this.running = true;
      this.ended = false;
      this.cbs = cbs;
      this.xmlMode = !!(options === null || options === void 0 ? void 0 : options.xmlMode);
      this.decodeEntities = (_a = options === null || options === void 0 ? void 0 : options.decodeEntities) !== null && _a !== void 0 ? _a : true;
    }
    Tokenizer2.prototype.reset = function() {
      this._state = 1;
      this.buffer = "";
      this.sectionStart = 0;
      this._index = 0;
      this.bufferOffset = 0;
      this.baseState = 1;
      this.special = 1;
      this.running = true;
      this.ended = false;
    };
    Tokenizer2.prototype.write = function(chunk) {
      if (this.ended)
        this.cbs.onerror(Error(".write() after done!"));
      this.buffer += chunk;
      this.parse();
    };
    Tokenizer2.prototype.end = function(chunk) {
      if (this.ended)
        this.cbs.onerror(Error(".end() after done!"));
      if (chunk)
        this.write(chunk);
      this.ended = true;
      if (this.running)
        this.finish();
    };
    Tokenizer2.prototype.pause = function() {
      this.running = false;
    };
    Tokenizer2.prototype.resume = function() {
      this.running = true;
      if (this._index < this.buffer.length) {
        this.parse();
      }
      if (this.ended) {
        this.finish();
      }
    };
    Tokenizer2.prototype.getAbsoluteIndex = function() {
      return this.bufferOffset + this._index;
    };
    Tokenizer2.prototype.stateText = function(c) {
      if (c === "<") {
        if (this._index > this.sectionStart) {
          this.cbs.ontext(this.getSection());
        }
        this._state = 2;
        this.sectionStart = this._index;
      } else if (this.decodeEntities && c === "&" && (this.special === 1 || this.special === 4)) {
        if (this._index > this.sectionStart) {
          this.cbs.ontext(this.getSection());
        }
        this.baseState = 1;
        this._state = 62;
        this.sectionStart = this._index;
      }
    };
    Tokenizer2.prototype.isTagStartChar = function(c) {
      return isASCIIAlpha(c) || this.xmlMode && !whitespace(c) && c !== "/" && c !== ">";
    };
    Tokenizer2.prototype.stateBeforeTagName = function(c) {
      if (c === "/") {
        this._state = 5;
      } else if (c === "<") {
        this.cbs.ontext(this.getSection());
        this.sectionStart = this._index;
      } else if (c === ">" || this.special !== 1 || whitespace(c)) {
        this._state = 1;
      } else if (c === "!") {
        this._state = 15;
        this.sectionStart = this._index + 1;
      } else if (c === "?") {
        this._state = 17;
        this.sectionStart = this._index + 1;
      } else if (!this.isTagStartChar(c)) {
        this._state = 1;
      } else {
        this._state = !this.xmlMode && (c === "s" || c === "S") ? 32 : !this.xmlMode && (c === "t" || c === "T") ? 52 : 3;
        this.sectionStart = this._index;
      }
    };
    Tokenizer2.prototype.stateInTagName = function(c) {
      if (c === "/" || c === ">" || whitespace(c)) {
        this.emitToken("onopentagname");
        this._state = 8;
        this._index--;
      }
    };
    Tokenizer2.prototype.stateBeforeClosingTagName = function(c) {
      if (whitespace(c)) ;
      else if (c === ">") {
        this._state = 1;
      } else if (this.special !== 1) {
        if (this.special !== 4 && (c === "s" || c === "S")) {
          this._state = 33;
        } else if (this.special === 4 && (c === "t" || c === "T")) {
          this._state = 53;
        } else {
          this._state = 1;
          this._index--;
        }
      } else if (!this.isTagStartChar(c)) {
        this._state = 20;
        this.sectionStart = this._index;
      } else {
        this._state = 6;
        this.sectionStart = this._index;
      }
    };
    Tokenizer2.prototype.stateInClosingTagName = function(c) {
      if (c === ">" || whitespace(c)) {
        this.emitToken("onclosetag");
        this._state = 7;
        this._index--;
      }
    };
    Tokenizer2.prototype.stateAfterClosingTagName = function(c) {
      if (c === ">") {
        this._state = 1;
        this.sectionStart = this._index + 1;
      }
    };
    Tokenizer2.prototype.stateBeforeAttributeName = function(c) {
      if (c === ">") {
        this.cbs.onopentagend();
        this._state = 1;
        this.sectionStart = this._index + 1;
      } else if (c === "/") {
        this._state = 4;
      } else if (!whitespace(c)) {
        this._state = 9;
        this.sectionStart = this._index;
      }
    };
    Tokenizer2.prototype.stateInSelfClosingTag = function(c) {
      if (c === ">") {
        this.cbs.onselfclosingtag();
        this._state = 1;
        this.sectionStart = this._index + 1;
        this.special = 1;
      } else if (!whitespace(c)) {
        this._state = 8;
        this._index--;
      }
    };
    Tokenizer2.prototype.stateInAttributeName = function(c) {
      if (c === "=" || c === "/" || c === ">" || whitespace(c)) {
        this.cbs.onattribname(this.getSection());
        this.sectionStart = -1;
        this._state = 10;
        this._index--;
      }
    };
    Tokenizer2.prototype.stateAfterAttributeName = function(c) {
      if (c === "=") {
        this._state = 11;
      } else if (c === "/" || c === ">") {
        this.cbs.onattribend(void 0);
        this._state = 8;
        this._index--;
      } else if (!whitespace(c)) {
        this.cbs.onattribend(void 0);
        this._state = 9;
        this.sectionStart = this._index;
      }
    };
    Tokenizer2.prototype.stateBeforeAttributeValue = function(c) {
      if (c === '"') {
        this._state = 12;
        this.sectionStart = this._index + 1;
      } else if (c === "'") {
        this._state = 13;
        this.sectionStart = this._index + 1;
      } else if (!whitespace(c)) {
        this._state = 14;
        this.sectionStart = this._index;
        this._index--;
      }
    };
    Tokenizer2.prototype.handleInAttributeValue = function(c, quote) {
      if (c === quote) {
        this.emitToken("onattribdata");
        this.cbs.onattribend(quote);
        this._state = 8;
      } else if (this.decodeEntities && c === "&") {
        this.emitToken("onattribdata");
        this.baseState = this._state;
        this._state = 62;
        this.sectionStart = this._index;
      }
    };
    Tokenizer2.prototype.stateInAttributeValueDoubleQuotes = function(c) {
      this.handleInAttributeValue(c, '"');
    };
    Tokenizer2.prototype.stateInAttributeValueSingleQuotes = function(c) {
      this.handleInAttributeValue(c, "'");
    };
    Tokenizer2.prototype.stateInAttributeValueNoQuotes = function(c) {
      if (whitespace(c) || c === ">") {
        this.emitToken("onattribdata");
        this.cbs.onattribend(null);
        this._state = 8;
        this._index--;
      } else if (this.decodeEntities && c === "&") {
        this.emitToken("onattribdata");
        this.baseState = this._state;
        this._state = 62;
        this.sectionStart = this._index;
      }
    };
    Tokenizer2.prototype.stateBeforeDeclaration = function(c) {
      this._state = c === "[" ? 23 : c === "-" ? 18 : 16;
    };
    Tokenizer2.prototype.stateInDeclaration = function(c) {
      if (c === ">") {
        this.cbs.ondeclaration(this.getSection());
        this._state = 1;
        this.sectionStart = this._index + 1;
      }
    };
    Tokenizer2.prototype.stateInProcessingInstruction = function(c) {
      if (c === ">") {
        this.cbs.onprocessinginstruction(this.getSection());
        this._state = 1;
        this.sectionStart = this._index + 1;
      }
    };
    Tokenizer2.prototype.stateBeforeComment = function(c) {
      if (c === "-") {
        this._state = 19;
        this.sectionStart = this._index + 1;
      } else {
        this._state = 16;
      }
    };
    Tokenizer2.prototype.stateInComment = function(c) {
      if (c === "-")
        this._state = 21;
    };
    Tokenizer2.prototype.stateInSpecialComment = function(c) {
      if (c === ">") {
        this.cbs.oncomment(this.buffer.substring(this.sectionStart, this._index));
        this._state = 1;
        this.sectionStart = this._index + 1;
      }
    };
    Tokenizer2.prototype.stateAfterComment1 = function(c) {
      if (c === "-") {
        this._state = 22;
      } else {
        this._state = 19;
      }
    };
    Tokenizer2.prototype.stateAfterComment2 = function(c) {
      if (c === ">") {
        this.cbs.oncomment(this.buffer.substring(this.sectionStart, this._index - 2));
        this._state = 1;
        this.sectionStart = this._index + 1;
      } else if (c !== "-") {
        this._state = 19;
      }
    };
    Tokenizer2.prototype.stateBeforeCdata6 = function(c) {
      if (c === "[") {
        this._state = 29;
        this.sectionStart = this._index + 1;
      } else {
        this._state = 16;
        this._index--;
      }
    };
    Tokenizer2.prototype.stateInCdata = function(c) {
      if (c === "]")
        this._state = 30;
    };
    Tokenizer2.prototype.stateAfterCdata1 = function(c) {
      if (c === "]")
        this._state = 31;
      else
        this._state = 29;
    };
    Tokenizer2.prototype.stateAfterCdata2 = function(c) {
      if (c === ">") {
        this.cbs.oncdata(this.buffer.substring(this.sectionStart, this._index - 2));
        this._state = 1;
        this.sectionStart = this._index + 1;
      } else if (c !== "]") {
        this._state = 29;
      }
    };
    Tokenizer2.prototype.stateBeforeSpecialS = function(c) {
      if (c === "c" || c === "C") {
        this._state = 34;
      } else if (c === "t" || c === "T") {
        this._state = 44;
      } else {
        this._state = 3;
        this._index--;
      }
    };
    Tokenizer2.prototype.stateBeforeSpecialSEnd = function(c) {
      if (this.special === 2 && (c === "c" || c === "C")) {
        this._state = 39;
      } else if (this.special === 3 && (c === "t" || c === "T")) {
        this._state = 48;
      } else
        this._state = 1;
    };
    Tokenizer2.prototype.stateBeforeSpecialLast = function(c, special) {
      if (c === "/" || c === ">" || whitespace(c)) {
        this.special = special;
      }
      this._state = 3;
      this._index--;
    };
    Tokenizer2.prototype.stateAfterSpecialLast = function(c, sectionStartOffset) {
      if (c === ">" || whitespace(c)) {
        this.special = 1;
        this._state = 6;
        this.sectionStart = this._index - sectionStartOffset;
        this._index--;
      } else
        this._state = 1;
    };
    Tokenizer2.prototype.parseFixedEntity = function(map2) {
      if (map2 === void 0) {
        map2 = this.xmlMode ? xml_json_1.default : entities_json_1.default;
      }
      if (this.sectionStart + 1 < this._index) {
        var entity = this.buffer.substring(this.sectionStart + 1, this._index);
        if (Object.prototype.hasOwnProperty.call(map2, entity)) {
          this.emitPartial(map2[entity]);
          this.sectionStart = this._index + 1;
        }
      }
    };
    Tokenizer2.prototype.parseLegacyEntity = function() {
      var start = this.sectionStart + 1;
      var limit = Math.min(this._index - start, 6);
      while (limit >= 2) {
        var entity = this.buffer.substr(start, limit);
        if (Object.prototype.hasOwnProperty.call(legacy_json_1.default, entity)) {
          this.emitPartial(legacy_json_1.default[entity]);
          this.sectionStart += limit + 1;
          return;
        }
        limit--;
      }
    };
    Tokenizer2.prototype.stateInNamedEntity = function(c) {
      if (c === ";") {
        this.parseFixedEntity();
        if (this.baseState === 1 && this.sectionStart + 1 < this._index && !this.xmlMode) {
          this.parseLegacyEntity();
        }
        this._state = this.baseState;
      } else if ((c < "0" || c > "9") && !isASCIIAlpha(c)) {
        if (this.xmlMode || this.sectionStart + 1 === this._index) ;
        else if (this.baseState !== 1) {
          if (c !== "=") {
            this.parseFixedEntity(legacy_json_1.default);
          }
        } else {
          this.parseLegacyEntity();
        }
        this._state = this.baseState;
        this._index--;
      }
    };
    Tokenizer2.prototype.decodeNumericEntity = function(offset, base, strict2) {
      var sectionStart = this.sectionStart + offset;
      if (sectionStart !== this._index) {
        var entity = this.buffer.substring(sectionStart, this._index);
        var parsed = parseInt(entity, base);
        this.emitPartial(decode_codepoint_1.default(parsed));
        this.sectionStart = strict2 ? this._index + 1 : this._index;
      }
      this._state = this.baseState;
    };
    Tokenizer2.prototype.stateInNumericEntity = function(c) {
      if (c === ";") {
        this.decodeNumericEntity(2, 10, true);
      } else if (c < "0" || c > "9") {
        if (!this.xmlMode) {
          this.decodeNumericEntity(2, 10, false);
        } else {
          this._state = this.baseState;
        }
        this._index--;
      }
    };
    Tokenizer2.prototype.stateInHexEntity = function(c) {
      if (c === ";") {
        this.decodeNumericEntity(3, 16, true);
      } else if ((c < "a" || c > "f") && (c < "A" || c > "F") && (c < "0" || c > "9")) {
        if (!this.xmlMode) {
          this.decodeNumericEntity(3, 16, false);
        } else {
          this._state = this.baseState;
        }
        this._index--;
      }
    };
    Tokenizer2.prototype.cleanup = function() {
      if (this.sectionStart < 0) {
        this.buffer = "";
        this.bufferOffset += this._index;
        this._index = 0;
      } else if (this.running) {
        if (this._state === 1) {
          if (this.sectionStart !== this._index) {
            this.cbs.ontext(this.buffer.substr(this.sectionStart));
          }
          this.buffer = "";
          this.bufferOffset += this._index;
          this._index = 0;
        } else if (this.sectionStart === this._index) {
          this.buffer = "";
          this.bufferOffset += this._index;
          this._index = 0;
        } else {
          this.buffer = this.buffer.substr(this.sectionStart);
          this._index -= this.sectionStart;
          this.bufferOffset += this.sectionStart;
        }
        this.sectionStart = 0;
      }
    };
    Tokenizer2.prototype.parse = function() {
      while (this._index < this.buffer.length && this.running) {
        var c = this.buffer.charAt(this._index);
        if (this._state === 1) {
          this.stateText(c);
        } else if (this._state === 12) {
          this.stateInAttributeValueDoubleQuotes(c);
        } else if (this._state === 9) {
          this.stateInAttributeName(c);
        } else if (this._state === 19) {
          this.stateInComment(c);
        } else if (this._state === 20) {
          this.stateInSpecialComment(c);
        } else if (this._state === 8) {
          this.stateBeforeAttributeName(c);
        } else if (this._state === 3) {
          this.stateInTagName(c);
        } else if (this._state === 6) {
          this.stateInClosingTagName(c);
        } else if (this._state === 2) {
          this.stateBeforeTagName(c);
        } else if (this._state === 10) {
          this.stateAfterAttributeName(c);
        } else if (this._state === 13) {
          this.stateInAttributeValueSingleQuotes(c);
        } else if (this._state === 11) {
          this.stateBeforeAttributeValue(c);
        } else if (this._state === 5) {
          this.stateBeforeClosingTagName(c);
        } else if (this._state === 7) {
          this.stateAfterClosingTagName(c);
        } else if (this._state === 32) {
          this.stateBeforeSpecialS(c);
        } else if (this._state === 21) {
          this.stateAfterComment1(c);
        } else if (this._state === 14) {
          this.stateInAttributeValueNoQuotes(c);
        } else if (this._state === 4) {
          this.stateInSelfClosingTag(c);
        } else if (this._state === 16) {
          this.stateInDeclaration(c);
        } else if (this._state === 15) {
          this.stateBeforeDeclaration(c);
        } else if (this._state === 22) {
          this.stateAfterComment2(c);
        } else if (this._state === 18) {
          this.stateBeforeComment(c);
        } else if (this._state === 33) {
          this.stateBeforeSpecialSEnd(c);
        } else if (this._state === 53) {
          stateAfterSpecialTEnd(this, c);
        } else if (this._state === 39) {
          stateAfterScript1(this, c);
        } else if (this._state === 40) {
          stateAfterScript2(this, c);
        } else if (this._state === 41) {
          stateAfterScript3(this, c);
        } else if (this._state === 34) {
          stateBeforeScript1(this, c);
        } else if (this._state === 35) {
          stateBeforeScript2(this, c);
        } else if (this._state === 36) {
          stateBeforeScript3(this, c);
        } else if (this._state === 37) {
          stateBeforeScript4(this, c);
        } else if (this._state === 38) {
          this.stateBeforeSpecialLast(
            c,
            2
            /* Script */
          );
        } else if (this._state === 42) {
          stateAfterScript4(this, c);
        } else if (this._state === 43) {
          this.stateAfterSpecialLast(c, 6);
        } else if (this._state === 44) {
          stateBeforeStyle1(this, c);
        } else if (this._state === 29) {
          this.stateInCdata(c);
        } else if (this._state === 45) {
          stateBeforeStyle2(this, c);
        } else if (this._state === 46) {
          stateBeforeStyle3(this, c);
        } else if (this._state === 47) {
          this.stateBeforeSpecialLast(
            c,
            3
            /* Style */
          );
        } else if (this._state === 48) {
          stateAfterStyle1(this, c);
        } else if (this._state === 49) {
          stateAfterStyle2(this, c);
        } else if (this._state === 50) {
          stateAfterStyle3(this, c);
        } else if (this._state === 51) {
          this.stateAfterSpecialLast(c, 5);
        } else if (this._state === 52) {
          stateBeforeSpecialT(this, c);
        } else if (this._state === 54) {
          stateBeforeTitle1(this, c);
        } else if (this._state === 55) {
          stateBeforeTitle2(this, c);
        } else if (this._state === 56) {
          stateBeforeTitle3(this, c);
        } else if (this._state === 57) {
          this.stateBeforeSpecialLast(
            c,
            4
            /* Title */
          );
        } else if (this._state === 58) {
          stateAfterTitle1(this, c);
        } else if (this._state === 59) {
          stateAfterTitle2(this, c);
        } else if (this._state === 60) {
          stateAfterTitle3(this, c);
        } else if (this._state === 61) {
          this.stateAfterSpecialLast(c, 5);
        } else if (this._state === 17) {
          this.stateInProcessingInstruction(c);
        } else if (this._state === 64) {
          this.stateInNamedEntity(c);
        } else if (this._state === 23) {
          stateBeforeCdata1(this, c);
        } else if (this._state === 62) {
          stateBeforeEntity(this, c);
        } else if (this._state === 24) {
          stateBeforeCdata2(this, c);
        } else if (this._state === 25) {
          stateBeforeCdata3(this, c);
        } else if (this._state === 30) {
          this.stateAfterCdata1(c);
        } else if (this._state === 31) {
          this.stateAfterCdata2(c);
        } else if (this._state === 26) {
          stateBeforeCdata4(this, c);
        } else if (this._state === 27) {
          stateBeforeCdata5(this, c);
        } else if (this._state === 28) {
          this.stateBeforeCdata6(c);
        } else if (this._state === 66) {
          this.stateInHexEntity(c);
        } else if (this._state === 65) {
          this.stateInNumericEntity(c);
        } else if (this._state === 63) {
          stateBeforeNumericEntity(this, c);
        } else {
          this.cbs.onerror(Error("unknown _state"), this._state);
        }
        this._index++;
      }
      this.cleanup();
    };
    Tokenizer2.prototype.finish = function() {
      if (this.sectionStart < this._index) {
        this.handleTrailingData();
      }
      this.cbs.onend();
    };
    Tokenizer2.prototype.handleTrailingData = function() {
      var data = this.buffer.substr(this.sectionStart);
      if (this._state === 29 || this._state === 30 || this._state === 31) {
        this.cbs.oncdata(data);
      } else if (this._state === 19 || this._state === 21 || this._state === 22) {
        this.cbs.oncomment(data);
      } else if (this._state === 64 && !this.xmlMode) {
        this.parseLegacyEntity();
        if (this.sectionStart < this._index) {
          this._state = this.baseState;
          this.handleTrailingData();
        }
      } else if (this._state === 65 && !this.xmlMode) {
        this.decodeNumericEntity(2, 10, false);
        if (this.sectionStart < this._index) {
          this._state = this.baseState;
          this.handleTrailingData();
        }
      } else if (this._state === 66 && !this.xmlMode) {
        this.decodeNumericEntity(3, 16, false);
        if (this.sectionStart < this._index) {
          this._state = this.baseState;
          this.handleTrailingData();
        }
      } else if (this._state !== 3 && this._state !== 8 && this._state !== 11 && this._state !== 10 && this._state !== 9 && this._state !== 13 && this._state !== 12 && this._state !== 14 && this._state !== 6) {
        this.cbs.ontext(data);
      }
    };
    Tokenizer2.prototype.getSection = function() {
      return this.buffer.substring(this.sectionStart, this._index);
    };
    Tokenizer2.prototype.emitToken = function(name) {
      this.cbs[name](this.getSection());
      this.sectionStart = -1;
    };
    Tokenizer2.prototype.emitPartial = function(value) {
      if (this.baseState !== 1) {
        this.cbs.onattribdata(value);
      } else {
        this.cbs.ontext(value);
      }
    };
    return Tokenizer2;
  })()
);
var _default = Tokenizer$2.default = Tokenizer$1;
var STYLE_ELEMENT_ID = "__twind";
var createStorage = () => {
  const callbacks = [];
  let state = [];
  const invoke = (callback, index) => state[index] = callback(state[index]);
  return {
    init: (callback) => invoke(callback, callbacks.push(callback) - 1),
    reset: (snapshot = []) => {
      [snapshot, state] = [state, snapshot];
      callbacks.forEach(invoke);
      return snapshot;
    }
  };
};
var virtualSheet = () => {
  const storage = createStorage();
  let target2;
  storage.init((value = []) => target2 = value);
  return Object.defineProperties({
    get target() {
      return [...target2];
    },
    insert: (rule, index) => target2.splice(index, 0, rule)
  }, Object.getOwnPropertyDescriptors(storage));
};
var getStyleTagProperties = (sheet) => ({
  id: STYLE_ELEMENT_ID,
  textContent: (Array.isArray(sheet) ? sheet : sheet.target).join("")
});
var getStyleTag = (sheet, attributes) => {
  const { id, textContent } = getStyleTagProperties(sheet);
  attributes = { ...attributes, id };
  return `<style${Object.keys(attributes).reduce((attrs, key) => `${attrs} ${key}=${JSON.stringify(attributes[key])}`, "")}>${textContent}</style>`;
};
var Tokenizer = _default.default || _default;
var noop = () => void 0;
var shim = (markup, options = {}) => {
  const { tw: tw$1 = tw } = typeof options == "function" ? { tw: options } : options;
  let lastAttribName = "";
  let lastChunkStart = 0;
  const chunks = [];
  const tokenizer = new Tokenizer({
    decodeEntities: false,
    xmlMode: false
  }, {
    onattribend: noop,
    onattribdata: (value) => {
      if (lastAttribName == "class") {
        const currentIndex = tokenizer.getAbsoluteIndex();
        const startIndex = currentIndex - value.length;
        const parsedClassNames = tw$1(value);
        if (parsedClassNames !== value) {
          chunks.push(markup.slice(lastChunkStart, startIndex));
          chunks.push(parsedClassNames);
          lastChunkStart = currentIndex;
        }
      }
      lastAttribName = "";
    },
    onattribname: (name) => {
      lastAttribName = name;
    },
    oncdata: noop,
    onclosetag: noop,
    oncomment: noop,
    ondeclaration: noop,
    onend: noop,
    onerror: noop,
    onopentagend: noop,
    onopentagname: noop,
    onprocessinginstruction: noop,
    onselfclosingtag: noop,
    ontext: noop
  });
  tokenizer.end(markup);
  if (!chunks.length) {
    return markup;
  }
  return chunks.join("") + markup.slice(lastChunkStart || 0, markup.length);
};
const render = (resume) => {
  const sheet = virtualSheet();
  setup({ sheet });
  sheet.reset();
  const html = shim(renderToString(/* @__PURE__ */ jsx(Resume, { resume })));
  const styleTag = getStyleTag(sheet);
  return `<!DOCTYPE html>
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume - ${resume.basics.name}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      ${styleTag}
    </head>
    <body>${html}</body>
  </html>`;
};
export {
  Resume,
  render
};
