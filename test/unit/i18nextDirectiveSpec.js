describe('Unit: jm.i18next - Directive', function () {

	'use strict';

	var $rootScope, $compile, $timeout;
	var i18nextOptions = {
		compatibilityAPI: 'v1',
		lng: 'de',
		useCookie: false,
		useLocalStorage: false,
		fallbackLng: 'dev',
		debug: false,
		resGetPath: '/base/test/locales/__lng__/__ns__.json'
	};

	beforeEach(function () {

		module('jm.i18next', function ($i18nextProvider) {
			$i18nextProvider.options = i18nextOptions;
			$i18nextProvider.modules = [window.i18nextXHRBackend, window.i18nextSprintfPostProcessor];
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
			$timeout(function () {
				var c = $compile('<p ng-i18next="Key_Not_Found"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toBe('translation:Key_Not_Found');
			}, 300);
		});

		it('should translate "hello" into German ("de-DE"; default language)', function () {
			$timeout(function () {
				var c = $compile('<p ng-i18next="hello"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toBe('Herzlich Willkommen!');
			});
		});

	});

	describe('passing options', function () {

		it('should translate "hello" into language passed by options ("dev")', function () {
			$timeout(function () {
				var c = $compile('<p ng-i18next="[i18next]({lng:\'dev\'})hello"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toEqual('Welcome!');
			});
		});

		it('should replace "__name__" in the translation string with name given by options', function () {
			$timeout(function () {
				var c = $compile('<p ng-i18next="[i18next]({name:\'Andre\'})helloName"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toEqual('Herzlich Willkommen, Andre!');
			});
		});

		it('should replace "__name__" in the translation string with name given by options and should use "dev" as language', function () {
			$timeout(function () {
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

		describe('as text', function () {

			it('should use the single form', function () {
				$timeout(function () {
					var c = $compile('<p ng-i18next="[i18next]({count: 1})woman"></p>')($rootScope);
					$rootScope.$apply();
					expect(c.text()).toEqual('Frau');
				});
			});

			it('should use the plural form', function () {
				$timeout(function () {
					var c = $compile('<p ng-i18next="[i18next]({count: 5})woman"></p>')($rootScope);
					$rootScope.$apply();
					expect(c.text()).toEqual('Frauen');
				});
			});

		});

		describe('as html', function () {

			it('should use the single form', function () {
				$timeout(function () {
					var c = $compile('<p ng-i18next="[html:i18next]({count: 1})woman"></p>')($rootScope);
					$rootScope.$apply();
					expect(c.text()).toEqual('Frau');
				});
			});

			it('should use the plural form', function () {
				$timeout(function () {
					var c = $compile('<p ng-i18next="[html:i18next]({count: 5})woman"></p>')($rootScope);
					$rootScope.$apply();
					expect(c.text()).toEqual('Frauen');
				});
			});

		});

	});

	describe('context', function () {

		it('should use the "normal" form', function () {
			$timeout(function () {
				var c = $compile('<p ng-i18next="friend"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toEqual('Freund');
			});
		});

		it('should use the male form', function () {
			$timeout(function () {
				var c = $compile('<p ng-i18next="[i18next]({context:\'male\'})friend"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toEqual('Fester Freund');
			});
		});

		it('should use the female form', function () {
			$timeout(function () {
				var c = $compile('<p ng-i18next="[i18next]({context:\'female\'})friend"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toEqual('Feste Freundin');
			});
		});

	});

	describe('nesting translations', function () {

		it('should include another translation', function () {
			$timeout(function () {
				var c = $compile('<p ng-i18next="helloNesting"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toEqual('Weißt du was? Du bist Herzlich Willkommen!');
			});
		});

		it('should include another translation and should use "dev" as language', function () {
			$timeout(function () {
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
			$timeout(function () {
				var c = $compile('<p ng-i18next="[html]helloHTML"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.html()).toBe('<h1 class="ng-scope">Herzlich Willkommen!</h1>');
			});
		});

	});

	describe('simple HTML + options', function () {

		it('should translate "hello" into German ("de-DE"; default language)', function () {
			$timeout(function () {
				var c = $compile('<p ng-i18next="[html:i18next]({name:\'Andre\'})helloNameHTML"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.html()).toBe('<h1 class="ng-scope">Herzlich Willkommen, Andre!</h1>');
			});
		});

		it('should translate "hello" into German and sanitize the substitution ("de-DE"; default language)', function () {
			$timeout(function () {
				var c = $compile('<p ng-i18next="[html:i18next]({name:\'<img src=1 onError=alert()>\'})helloNameHTML"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.html()).toBe('<h1 class="ng-scope">Herzlich Willkommen, <img src="1">!</h1>');
			});
		});

	});

});
