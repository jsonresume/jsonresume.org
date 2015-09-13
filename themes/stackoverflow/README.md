# Stack Overflow theme for jsonresume [![npm version](https://badge.fury.io/js/jsonresume-theme-stackoverflow.svg)](http://badge.fury.io/js/jsonresume-theme-stackoverflow)

This is a theme for JSON Resume. It is available via npm:
```
npm install jsonresume-theme-stackoverflow
```
[DEMO](https://themes.jsonresume.org/stackoverflow)

**Printable version with custom CSS**

### Social Profiles Icons

**Profiles supported with brand colors:**

github, stack overflow, linkedin, dribbble, twitter, facebook, pinterest, instagram, soundcloud, wordpress, youtube, flickr, google plus, tumblr, foursquare.

To have a social icon close the social link profile (or username) it is enough to set a `network` the name of the Social Network (es: 'Stack Overflow').

#### Support to extra fields

With stackowerflow theme it is possible to add:

- `keywords` to each 'work', 'publication' and 'volunteer' item
- `summary`to each 'interests' and 'education' item
- `location` to each 'work', 'education' and 'volunteer' item

example of the extra `location` object: 

```
"location": {
	"city": "Zürich",
	"countryCode": "CH",
	"region": "Switzerland"
} 
```

## Getting started

### Install the command line

Create your resume in json on [jsonresume](https://jsonresume.org)

The official [resume-cli](https://github.com/jsonresume/resume-cli) to run the development server.

Go ahead and install it:

```
sudo npm install -g resume-cli
```
### Serve theme

While inside the theme folder, simply run:

```
resume serve
```

You should now see this message:

```
Preview: http://localhost:4000
Press ctrl-c to stop
```

## Contribution

[Open an issue](https://github.com/francescoes/jsonresume-theme-stackoverflow/issues/new) or fork the project, add your feature (or fix your bug) 
and open a pull request 

## License

Available under the [MIT license](http://opensource.org/licenses/mit-license.php).
