# ng-i18next - use i18next with [AngularJS](https://www.angularjs.org/) [![Build Status](https://travis-ci.org/i18next/ng-i18next.svg?branch=master)](https://travis-ci.org/i18next/ng-i18next) #

Project goal is to provide an easy way to use [i18next](http://i18next.com/) with [AngularJS 1.x](http://angularjs.org/):

- `ng-i18next` directive
- `i18next` filter

First check out the [documentation](http://i18next.com) by Jan Mühlemann.

# Features #
- AngularJS provider, directive and filter
- variable binding (translates again when variable changes)
- nested translations (`$t('hello')`; see [i18next documentation](http://i18next.com/docs/))
- scope variables in translations (if the translation contains directives of variables like `{{hello}}`, they'll get compiled)
- sprintf support (directive and provider)

# Installation #
You can install `ng-i18next` as a bower dependency:

	bower install ng-i18next

# Upgrading from <=0.5.5

You will need to
1. Move initialization of i18next from the ng-i18next provider within Angular to i18next natively before booting Angular
2. Change translations using the $i18next provider in you Angular code. From `$i18next('localeKey')` to `$i18next.t('localeKey')` 

# Usage #
First add

- [`AngularJS >=1.5.0`](https://angularjs.org)
- [`ngSanitize`](https://docs.angularjs.org/api/ngSanitize#!)
- [`i18next`](http://i18next.com/)
- [`i18next-xhr-backend`](https://github.com/i18next/i18next-xhr-backend) or a backend of your choice to load locales.
- `ng-i18next`

to your HTML file. `AngularJS`, `ngSanitize`, `i18next`, and `i18next-xhr-backend` have to be loaded **before** `ng-i18next`!

Before booting angular use i18next configuration system to configure and load your localization resources. Refer to [i18next configuration reference.](http://i18next.com/docs/)

```js
window.i18next
	.use(window.i18nextXHRBackend);

window.i18next.init({
	debug: true,
	lng: 'de', // If not given, i18n will detect the browser language.
	fallbackLng: 'dev', // Default is dev
	backend: {
		loadPath: '../locales/{{lng}}/{{ns}}.json'
	},
	useCookie: false,
	useLocalStorage: false
}, function (err, t) {
	console.log('resources loaded');
});
```
There are three ways to use `ng-i18next`:

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

## provider ##

=> translates `hello`

```js
angular
	.module('MyApp', ['jm.i18next'])
	.controller('MyProviderCtrl', function ($scope, $i18next) {
		'use strict';
		$scope.hello = $i18next.t('hello');
});
```
=> translates `hello` with [translate options](http://i18next.com/docs/options/#t-options)

```js
$scope.sprintf = $i18next.t('both.sprintf', { postProcess: 'sprintf', sprintf: ['a', 'b', 'c', 'd'] });
```

=> translates copyright label and use [interpolation](http://i18next.com/translate/interpolation/) to add the year

locale
```json
{
    "copyrightLabel": "Copyright __year__ Acme, Inc. All rights reserved",
}
```

JavaScript
```js
$i18next.t('copyrightLabel', { year: this.$window.moment().year() });
```

Results

Copyright 2016 Acme, Inc. All rights reserved


---------

For more, see examples.

There are two ways to run the examples:

```sh
gulp serve
```

Run this inside your `ng-i18next` directory.
(This requires you to have NodeJS and gulp to be installed.)

---------

# Contribute #

To contribute, you must have:

- [Node.js](http://nodejs.org/)
- [Gulp](http://gulpjs.com/)
- [bower](http://bower.io/)
- [TypeScript](http://www.typescriptlang.org/)
- [typings](https://www.npmjs.com/package/typings)

installed.

Load all dependencies using [`npm`](https://npmjs.org/),  [`bower`](http://bower.io/) and [`typings`](https://www.npmjs.com/package/typings):

	npm install
	bower install
	typings install

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
