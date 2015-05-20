# ng-i18next - use i18next with [AngularJS](https://www.angularjs.org/) [![Build Status](https://travis-ci.org/i18next/ng-i18next.svg?branch=master)](https://travis-ci.org/i18next/ng-i18next) #

Project goal is to provide an easy way to use [i18next](http://i18next.com/) with [AngularJS](http://angularjs.org/):

- `ng-i18next` directive
- `i18next` filter

First check out the [documentation](http://i18next.com) by Jan Mühlemann.

# Features #
- AngularJS provider, directive and filter
- variable binding (translates again when variable changes)
- nested translations (`$t('hello')`; see [i18next documentation](http://i18next.com/pages/doc_features.html))
- scope variables in translations (if the translation contains directives of variables like `{{hello}}`, they'll get compiled)
- sprintf support (directive and provider)
- support for default values to be displayed before i18next engine is initialized

# Installation #
You can install `ng-i18next` as a bower dependency:

	bower install ng-i18next


# Usage #
First add

- `AngularJS`
- `i18next`
- `ng-i18next`

to your HTML file. `AngularJS` and `i18next` have to be loaded **before** `ng-i18next`!

Make sure you require `jm.i18next` as a dependency of your AngularJS module. Also configurate the provider first:

```js
angular.module('jm.i18next').config(['$i18nextProvider', function ($i18nextProvider) {
	$i18nextProvider.options = {
		lng: 'de',
		useCookie: false,
		useLocalStorage: false,
		fallbackLng: 'dev',
		resGetPath: '../locales/__lng__/__ns__.json',
		defaultLoadingValue: '' // ng-i18next option, *NOT* directly supported by i18next
	};
}]);
```

For testing purposes set up a server. Don't open your files directly because `i18next` then fails to load the language files!

For more options visit the [i18next documentation](http://i18next.com/pages/doc_init.html).

There are two ways to use `ng-i18next`:

## filter ##

```html
<p>{{'hello' | i18next}}</p>
```

=> translates `hello`
```html
<p>{{hello | i18next}}</p>
```

=> translates `$scope.hello`

## directive ##

### Basics ###

```html
<p ng-i18next="hello"></p>
```
=> translates `hello`

```html
<p ng-i18next="{{hello}}"></p>
```
=> translates `$scope.hello`

```html
<p ng-i18next>hello</p>
```
=> translates `hello` (uses the content of the p-tag)

```html
<p ng-i18next>{{hello}}</p>
```
=> translates `$scope.hello` (uses the content of the p-tag)

Note, that HTML isn't compiled!

### HTML ###

```html
<p ng-i18next="[html]hello"></p>
```

=> translates `hello` and compiles HTML

```html
<p ng-i18next="[html]{{hello}}"></p>
```

=> translates `$scope.hello` and compiles HTML

### Attributes ###

```html
<a href="#" ng-i18next="[title]hello">This is a link.</a>
```

=> translates `hello` and sets it as the title

```html
<a href="#" ng-i18next="[title]{{hello}}">This is a link.</a>
```

=> translates `$scope.hello` and sets it as the title

You can combine both, too!

### Attributes + text content ###

```html
<a href="#" ng-i18next="[title]hello;content"></a>
```

=> translates `hello` and sets it as the title
=> translates `content` and sets it as the text of the link.

```html
<a href="#" ng-i18next="[title]{{hello}};{{content}}"></a>
```
=> translates `$scope.hello` and sets it as the title
=> translates `$scope.content` and sets it as the text of the link.

### Attributes + HTML content ###

```html
<a href="#" ng-i18next="[title]hello;[html]content"></a>
```
=> translates `hello` and sets it as the title
=> translates `content` and compiles the HTML as the content of the link.

```html
<a href="#" ng-i18next="[title]{{hello}};[html]{{content}}"></a>
```
=> translates `$scope.hello` and sets it as the title
=> translates `$scope.content` and compiles the HTML as the content of the link.

### Passing Options ###
You can also pass options:

```html
<p ng-i18next="[i18next]({lng:'de'})hello"></p>
```
=> translates `hello` in German (`de`)

### Passing Options + HTML ###
Also options work perfectly together with html:

```html
<p ng-i18next="[html:i18next]({lng:'de'})hello"></p>
```
=> translates `hello` in German (`de`) and compiles it to HTML code.

### Passing Options - sprintf
You can use i18next sprintf feature:

```html
<p ng-i18next="[i18next]({sprintf:['a','b','c','d']})sprintfString">
```

where `sprintfString` could be `The first 4 letters of the english alphabet are: %s, %s, %s and %s` in your translation file.

Using the directive, `postProcess:'sprintf'` isn't neccassary. The directive will add it automatically when using `sprintf` in the options.

---------

For more, see examples.

There are two ways to run the examples:

```sh
gulp serve
```

Run this inside your `ng-i18next` directory.
(This requires you to have NodeJS and gulp to be installed.)

```js
python -m SimpleHTTPServer 8000
```

Create a simple pyhton HTTP server. Run this inside the `ng-i18next` folder.
You must have python installed, of course.

Then go to [`http://localhost:8000`](http://localhost:8000).

---------

# Default values while i18next is initializing #

`i18next` supports providing a `defaultValue` when requesting any translation. But what happens when i18next hasn't been fully initialized yet?

`ng-i18next` adds a `defaultLoadingValue` option, which can be provided either in `$i18nextProvider.options` or with any individual
translation request just like you would `defaultValue`. If i18n strings need to be rendered before i18next is initialized,
these special loading values will be used instead.

## Default values - Examples ##
```js
$i18nextProvider.options = {
	/* ... */
	defaultLoadingValue: ''
};
```

(in template)

```html
<p>{{'hello' | i18next}}</p>
```

=> displays an empty string (visually nothing) until i18next is initialized, then translates `hello`

```html
<p>{{'hello' | i18next:{'defaultLoadingValue':'Loading...'} }}</p>
```

=> displays "Loading..." until i18next is loaded, then translates `hello`

```html
<p>{{'not-translated-welcome-key' | i18next:{'defaultLoadingValue':'Loading...', 'defaultValue':'Welcome!'} }}</p>
```

=> displays "Loading..." until i18next is loaded, then translates `not-translated-welcome-key` with default of "Welcome!"
if the key is not defined in your i18n file

---------

# Contribute #

To contribute, you must have:

- [Node.js](http://nodejs.org/)
- [bower](http://bower.io/)
- [Gulp](http://gulpjs.com/)

installed.

Load all dependencies using [`npm`](https://npmjs.org/) and [`bower`](http://bower.io/):

	npm install
	bower install

Build `ng-i18next.js` using Gulp:

	gulp build

Test `ng-i18next.js` using Gulp:

	gulp test

---------

# Examples #

You can run the examples using:

	gulp serve

_(note that you have to be in the root directory of this project)_

Do not just open the HTML files. That won't work.

---------

# Supported browsers #

`ng-i18next` is tested with these browsers:

 - latest Firefox
 - latest Chrome
 - IE9 and above

IE8 isn't supported.
`ng-i18next` should work with every browser that is supported by AngularJS.

However, last time we checked, just adding polyfills do the job on IE8.

---------

# Changelog #

For changelog file please see CHANGELOG.md

---------

# License #

[MIT License](https://github.com/i18next/ng-i18next/blob/master/LICENSE)
