describe('Unit: jm.i18next - Directive', function () {

	'use strict';

	var $rootScope, $compile, $timeout;
	var i18nextOptions = {
		lng: 'de',
		useCookie: false,
		useLocalStorage: false,
		fallbackLng: 'dev',
		debug: false,
		resources: {
			de: {
				translation: {
					"hello": "Herzlich Willkommen!",
					"content": "Dies ist Inhalt.",
					"contentHTML": "Dies ist <strong>Inhalt</strong>.",
					"dynamicDate": "Aktuelles Datum: {{date}}",
					"helloName": "Herzlich Willkommen, {{name}}!",
					"helloNesting": "Weißt du was? Du bist $t(hello)",
					"woman": "Frau",
					"woman_plural": "Frauen",
					"woman_plural_0": "Keine Frauen",
					"friend": "Freund",
					"friend_male": "Fester Freund",
					"friend_female": "Feste Freundin",
					"helloNameHTML": "<h1>Herzlich Willkommen, {{name}}!</h1>"
				}
			},
			dev: {
				translation: {
					"hello": "Welcome!",
					"content": "This is content.",
					"contentHTML": "This is <strong>content</strong>.",
					"dynamicDate": "Current date: {{date}}",
					"helloName": "Welcome, {{name}}!",
					"helloNesting": "You know what? You\'re $t(hello)",
					"woman": "Woman",
					"woman_plural": "Women",
					"woman_plural_0": "No women",
					"friend": "Friend",
					"friend_male": "Boyfriend",
					"friend_female": "Girlfriend",
					"helloNameHTML": "<h1>Welcome, {{name}}!</h1>"
				}
			}
		}
	};

	beforeEach(function () {

		module('jm.i18next', function ($i18nextProvider) {
			jasmine.getGlobal().i18next.init(i18nextOptions, function (err, t) {
				// console.log('resources loaded');
			});

			jasmine.getGlobal().i18next.on('initialized', function (options) {
				// console.log('i18next initialized');
				jasmine.getGlobal().i18nextOptions = options;
			});
		});

		inject(function (_$compile_, _$rootScope_, _$timeout_) {
			$compile = _$compile_;
			$rootScope = _$rootScope_;
			$timeout = _$timeout_;
		});

	});

	/*
	 * Tests
	 *  - simple strings
	 *  - passing options
	 *  - using $scope (coming soon)
	 *  - plurals
	 *  - context
	 *  - HTML
	 *    - simple
	 *    - with options
	 */

	describe('simple strings', function () {

		it('should return original key, because translation does not exist', function () {
			var c = $compile('<p ng-i18next="Key_Not_Found"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.text()).toBe('Key_Not_Found');
		});

		it('should translate "hello" into German ("de-DE"; default language)', function () {
			var c = $compile('<p ng-i18next="hello"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.text()).toBe('Herzlich Willkommen!');
		});

	});

	describe('passing options', function () {

		it('should translate "hello" into language passed by options ("dev")', function () {
			var c = $compile('<p ng-i18next="[i18next]({lng:\'dev\'})hello"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.text()).toEqual('Welcome!');
		});

		it('should replace "{{name}}" in the translation string with name given by options', function () {
			var c = $compile('<p ng-i18next="[i18next]({name:\'Andre\'})helloName"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.text()).toEqual('Herzlich Willkommen, Andre!');
		});

		it('should replace "{{name}}" in the translation string with scope variable', function () {
			$rootScope.name = "Wax";
			var c = $compile('<p ng-i18next="[i18next]({name: name})helloName"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.text()).toEqual('Herzlich Willkommen, Wax!');
		});

		it('should update "{{name}}" in the translation string when scope variable changes', function () {
			$rootScope.name = "Wax";
			var c = $compile('<p ng-i18next="[i18next]({name: name})helloName"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.text()).toEqual('Herzlich Willkommen, Wax!');
			$rootScope.name = "Wayne";
			$rootScope.$apply();
			expect(c.text()).toEqual('Herzlich Willkommen, Wayne!');
		});

		it('should replace "{{name}}" in the translation string with name given by options and should use "dev" as language', function () {
			var c = $compile('<p ng-i18next="[i18next]({name:\'Andre\',lng:\'dev\'})helloName"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.text()).toEqual('Welcome, Andre!');
		});

	});

	describe('using $scope', function () {

		// coming soon

	});

	describe('plurals', function () {

		describe('as text', function () {

			it('should use the single form', function () {
				var c = $compile('<p ng-i18next="[i18next]({count: 1})woman"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toEqual('Frau');
			});

			it('should use the plural form', function () {
				var c = $compile('<p ng-i18next="[i18next]({count: 5})woman"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toEqual('Frauen');
			});

		});

		describe('as html', function () {

			it('should use the single form', function () {
				var c = $compile('<p ng-i18next="[html:i18next]({count: 1})woman"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toEqual('Frau');
			});

			it('should use the plural form', function () {
				var c = $compile('<p ng-i18next="[html:i18next]({count: 5})woman"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toEqual('Frauen');
			});

		});

	});

	describe('context', function () {

		it('should use the "normal" form', function () {
			var c = $compile('<p ng-i18next="friend"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.text()).toEqual('Freund');
		});

		it('should use the male form', function () {
			var c = $compile('<p ng-i18next="[i18next]({context:\'male\'})friend"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.text()).toEqual('Fester Freund');
		});

		it('should use the female form', function () {
			var c = $compile('<p ng-i18next="[i18next]({context:\'female\'})friend"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.text()).toEqual('Feste Freundin');
		});

	});

	describe('nesting translations', function () {

		it('should include another translation', function () {
			var c = $compile('<p ng-i18next="helloNesting"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.text()).toEqual('Weißt du was? Du bist Herzlich Willkommen!');
		});

		it('should include another translation and should use "dev" as language', function () {
			var c = $compile('<p ng-i18next="[i18next]({lng:\'dev\'})helloNesting"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.text()).toEqual('You know what? You\'re Welcome!');
		});

	});

	/***********************************************************
	 *
	 *                           HTML
	 *
	 ***********************************************************/

	describe('simple HTML', function () {

		it('should return original key, because translation does not exist', function () {
			var c = $compile('<p ng-i18next="[html]helloHTML"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.html()).toBe('helloHTML');
		});

	});

	describe('simple HTML + options', function () {

		it('should translate "hello" into German ("de"; default language)', function () {
			var c = $compile('<p ng-i18next="[html:i18next]({name:\'Andre\'})helloNameHTML"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.html()).toBe('<h1 class="ng-scope">Herzlich Willkommen, Andre!</h1>');
		});

		it('should translate "hello" into German and sanitize the substitution ("de"; default language)', function () {
			var c = $compile('<p ng-i18next="[html:i18next]({name:\'<img src=1 onError=alert()>\'})helloNameHTML"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.html()).toBe('<h1 class="ng-scope">Herzlich Willkommen, &lt;img src="1"&gt;!</h1>');
		});

	});

});
