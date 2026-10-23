---
title: Theme development
description: Build a JSON Resume theme as an npm module named jsonresume-theme-{name} that exports a pure render function returning HTML.
---

Remember, JSON Resume is just a schema. Our method of theming is only a recommendation, for when you want to be compatible with the official tooling and hosting.

## Getting started

The basic philosophy is that you create a new npm module that follows the naming convention `jsonresume-theme-{name}`.

The module should export a function called `render` that takes a `resume.json`.

The `render` function should return a `string`, which is generally HTML.

In its most basic form it looks like this:

```js
const render = (resume) => {
  return '<h1>' + resume.basics.name + '</h1>';
};

export { render };
```

## Considerations

- All assets and CSS have to be inlined in the output.
- You need to base64-encode your images and other assets.
- The `render` function should be pure: it should have no side effects, which means it shouldn't read or write from disk or the network. So do not import `fs` or `http` (or any modules that depend on them) into your theme.
- Your theme is in control of its build process, so do whatever you like there.
- Feel free to share any opinions on this process in the [repository](https://github.com/jsonresume/jsonresume.org).

## Examples

Here are some good example repositories to see how others have built themes:

- [https://github.com/jsonresume/jsonresume.org/tree/master/packages/themes/stackoverflow](https://github.com/jsonresume/jsonresume.org/tree/master/packages/themes/stackoverflow)
- [https://github.com/kelyvin/jsonresume-theme-caffeine](https://github.com/kelyvin/jsonresume-theme-caffeine)
- [https://github.com/davcd/jsonresume-theme-actual](https://github.com/davcd/jsonresume-theme-actual)
- Use this maintained reference theme as a starting point: [packages/themes/jsonresume-theme-reference](https://github.com/jsonresume/jsonresume.org/tree/master/packages/themes/jsonresume-theme-reference)

If there are any official [themes](/themes) you like, find their source and see what you can learn from them.

## Publishing and hosting

If you want to add a theme to the official list, you need to publish an npm module named `jsonresume-theme-{name}`. That module needs to export a function called `render` that takes a `resume.json` and returns a plain HTML string.
