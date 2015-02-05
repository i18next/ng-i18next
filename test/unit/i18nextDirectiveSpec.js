describe('Unit: jm.i18next - Directive', function () {

	'use strict';

	var $rootScope, $compile;
	var i18nextOptions = {
		lng: 'de-DE',
		useCookie: false,
		useLocalStorage: false,
		fallbackLng: 'dev',
		resStore: {
			'de-DE': {
				translation: {
					'hello': 'Herzlich Willkommen!',
					'helloName': 'Herzlich Willkommen, __name__!',
					'helloNesting': 'Weißt du was? Du bist $t(hello)',
					'woman': 'Frau',
					'woman_plural': 'Frauen',
					'woman_plural_0': 'Keine Frauen',
					'friend': 'Freund',
					'friend_male': 'Fester Freund',
					'friend_female': 'Feste Freundin',

					'helloHTML': '<h1>Herzlich Willkommen!</h1>',
					'helloNameHTML': '<h1>Herzlich Willkommen, __name__!</h1>'
				}
			},
			'dev': {
				translation: {
					'hello': 'Welcome!',
					'helloName': 'Welcome, __name__!',
					'helloNesting': 'You know what? You\'re $t(hello)',
					'woman': 'Woman',
					'woman_plural': 'Women',
					'woman_plural_0': 'No women',
					'friend': 'Friend',
					'friend_male': 'Boyfriend',
					'friend_female': 'Girlfriend',

					'helloHTML': '<h1>Welcome!</h1>',
					'helloNameHTML': '<h1>Welcome, __name__!</h1>'
				}
			}
		}
		//resGetPath: '/test/locales/__lng__/__ns__.json'
	};

	beforeEach(function () {

		module('jm.i18next', function ($i18nextProvider) {
			$i18nextProvider.options = i18nextOptions;
		});

		inject(function (_$compile_, _$rootScope_) {
			$compile = _$compile_;
			$rootScope = _$rootScope_;
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
			inject(function ($rootScope, $compile) {
				var c = $compile('<p ng-i18next="Key_Not_Found"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toBe('Key_Not_Found');
			});
		});

		it('should translate "hello" into German ("de-DE"; default language)', function () {
			inject(function ($rootScope, $compile) {
				var c = $compile('<p ng-i18next="hello"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toBe('Herzlich Willkommen!');
			});
		});

	});

	describe('passing options', function () {

		it('should translate "hello" into language passed by options ("dev")', function () {
			inject(function ($rootScope, $compile) {
				var c = $compile('<p ng-i18next="[i18next]({lng:\'dev\'})hello"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toEqual('Welcome!');
			});
		});

		it('should replace "__name__" in the translation string with name given by options', function () {
			inject(function ($rootScope, $compile) {
				var c = $compile('<p ng-i18next="[i18next]({name:\'Andre\'})helloName"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toEqual('Herzlich Willkommen, Andre!');
			});
		});

		it('should replace "__name__" in the translation string with name given by options and should use "dev" as language', function () {
			inject(function ($rootScope, $compile) {
				var c = $compile('<p ng-i18next="[i18next]({name:\'Andre\',lng:\'dev\'})helloName"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toEqual('Welcome, Andre!');
			});
		});

	});

	describe('using $scope', function () {

		// coming soon

	});

	describe('plurals', function () {

		it('should use the single form', function () {
			inject(function ($rootScope, $compile) {
				var c = $compile('<p ng-i18next="[i18next]({count: 1})woman"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toEqual('Frau');
			});
		});

		it('should use the plural form', function () {
			inject(function ($rootScope, $compile) {
				var c = $compile('<p ng-i18next="[i18next]({count: 5})woman"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toEqual('Frauen');
			});
		});

	});

	describe('context', function () {

		it('should use the "normal" form', function () {
			inject(function ($rootScope, $compile) {
				var c = $compile('<p ng-i18next="friend"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toEqual('Freund');
			});
		});

		it('should use the male form', function () {
			inject(function ($rootScope, $compile) {
				var c = $compile('<p ng-i18next="[i18next]({context:\'male\'})friend"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toEqual('Fester Freund');
			});
		});

		it('should use the female form', function () {
			inject(function ($rootScope, $compile) {
				var c = $compile('<p ng-i18next="[i18next]({context:\'female\'})friend"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toEqual('Feste Freundin');
			});
		});

	});

	describe('nesting translations', function () {

		it('should include another translation', function () {
			inject(function ($rootScope, $compile) {
				var c = $compile('<p ng-i18next="helloNesting"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toEqual('Weißt du was? Du bist Herzlich Willkommen!');
			});
		});

		it('should include another translation and should use "dev" as language', function () {
			inject(function ($rootScope, $compile) {
				var c = $compile('<p ng-i18next="[i18next]({lng:\'dev\'})helloNesting"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toEqual('You know what? You\'re Welcome!');
			});
		});

	});

	/***********************************************************
	 *
	 *                           HTML
	 *
	 ***********************************************************/

	describe('simple HTML', function () {

		it('should return original key, because translation does not exist', function () {
			inject(function ($rootScope, $compile) {
				var c = $compile('<p ng-i18next="[html]helloHTML"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.html()).toBe('<h1 class="ng-scope">Herzlich Willkommen!</h1>');
			});
		});

	});

	describe('simple HTML + options', function () {

		it('should translate "hello" into German ("de-DE"; default language)', function () {
			inject(function ($rootScope, $compile) {
				var c = $compile('<p ng-i18next="[html:i18next]({name:\'Andre\'})helloNameHTML"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.html()).toBe('<h1 class="ng-scope">Herzlich Willkommen, Andre!</h1>');
			});
		});

		it('should translate "hello" into German and sanitize the substitution ("de-DE"; default language)', function () {
			inject(function ($rootScope, $compile) {
				var c = $compile('<p ng-i18next="[html:i18next]({name:\'<img src=1 onError=alert()>\'})helloNameHTML"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.html()).toBe('<h1 class="ng-scope">Herzlich Willkommen, <img src="1">!</h1>');
			});
		});
	});

});
