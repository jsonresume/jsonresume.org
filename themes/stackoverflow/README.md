# Stack Overflow theme for jsonresume [![npm version](https://badge.fury.io/js/jsonresume-theme-stackoverflow.svg)](http://badge.fury.io/js/jsonresume-theme-stackoverflow)

**Printable version with custom CSS**

[DEMO](https://themes.jsonresume.org/stackoverflow)

## Getting started

### Install the command line

Create your resume in json on [jsonresume](https://jsonresume.org)

The official [resume-cli](https://github.com/jsonresume/resume-cli) to run the development server.

Go ahead and install it:

```
sudo npm install -g resume-cli
```
### Install and serve theme

This is a theme for JSON Resume. It is available via npm:

```
npm install jsonresume-theme-stackoverflow
```

then change directory: 

`cd node_modules/jsonresume-theme-stackoverflow/`

And simply run:

```
resume serve
```

You should now see this message:

```
Preview: http://localhost:4000
Press ctrl-c to stop
```

### Social Profiles Icons

**Profiles supported with brand colors:**

github, stack overflow, linkedin, dribbble, twitter, facebook, pinterest, instagram, soundcloud, wordpress, youtube, flickr, google plus, tumblr, foursquare.

To have a social icon close the social link profile (or username) it is enough to set a `network` the name of the Social Network (es: 'Stack Overflow').

#### Support to extra fields

With stackoverflow theme it is possible to add:

- `keywords` to each 'work', 'publication' and 'volunteer' item
- `summary` to each 'interests' and 'education' item
- `location` to each 'work', 'education' and 'volunteer' item
- `birth` to 'basics'

example of the extra `location` object: 

```
"location": {
	"city": "Zürich",
	"countryCode": "CH",
	"region": "Switzerland"
} 
```
example of the extra `birth` object:

```
"birth": {
  "place": "New York",
  "state": "USA",
  "date": "1988"
}
```

## Contribution

Fork the project, add your feature (or fix your bug) and open a pull request OR

[Open an issue](https://github.com/francescoes/jsonresume-theme-stackoverflow/issues/new) if you find find or if you would like to have extra fields or changes 

## License

Available under the [MIT license](http://opensource.org/licenses/mit-license.php).
