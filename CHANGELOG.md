# Changelog #

v0.3.2 - 2014/07/02
- Add sprintf support - see #37

v0.3.1 - 2014/03/26
- Fix for IE - invalid argument for .html() - see #32

v0.3.0 - 2014/02/21
- now `ng-i18next` requires options instead of using default options

v0.2.9 - 2014/01/07
- fix error (#28) when using `ng-i18next` directive with options containing parentheses

v0.2.8
- fixed #24 - fixed an error with IE8

v0.2.7
- fixed #21 - fixed error when using `ng-model` and `ng-i18next` on the same element

v0.2.6
- fixed #15 - fixed error "$digest already in progress"
- added docs using ng-docs

v0.2.5
- fixed some minor bugs (in filter)

v0.2.4
- removed unnecessary code in provider.js
- fixed issue #14 where auto detection of language didn't work

v0.2.3
- fixed minification
- not using `ngmin` anymore

v0.2.2
- you can now pass options to a directive
- new tests and Gruntfile (now supports `grunt server`)
- updated dependencies in package.json
- you can now pass options to the filter

v0.2.1
- it is now possible to change options at runtime (and not only in `.config()`)
- the dist folder was added

v0.2
- completly new version
- `i18next` provider, directive and filter

v0.1
- first version
