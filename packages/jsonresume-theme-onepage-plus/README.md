# jsonresume-theme-onepage-plus

This theme is basically an update of the onepage theme (https://github.com/ainsleyc/jsonresume-theme-onepage) to work with version 1.0.0 of [JSON Resume](http://jsonresume.org/) specifications.

The project structure was changed based on the boilerplate (https://github.com/jsonresume/jsonresume-theme-boilerplate).

Added certificates and projects sections and some minor chnages.

See <a href="/resume.pdf" download="">resume.pdf</a> for an example

## Instaling the theme

Move to the `resume.json` folder and run:

```
npm install -g resume-cli
npm install jsonresume-theme-onepage-updated
resume serve -t onepage-updated
```

## Developing

```
npm install -g resume-cli
git clone https://github.com/vkcelik/jsonresume-theme-onepage-plus.git
cd jsonresume-theme-onepage-plus
npm install
resume serve --theme .
```

See also [boilerplate project](https://github.com/jsonresume/jsonresume-theme-boilerplate) and [original project](https://github.com/ainsleyc/jsonresume-theme-onepage)

## License

Available under [the MIT license](http://mths.be/mit).
