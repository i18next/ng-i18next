describe('Unit: jm.i18next - Filter', function () {

	'use strict';

	var $filter, filter, $rootScope;

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
					"helloName": "Herzlich Willkommen, {{name}}!",
					"helloNesting": "Weißt du was? Du bist $t(hello)",
					"woman": "Frau",
					"woman_plural": "Frauen",
					"woman_plural_0": "Keine Frauen",
					"friend": "Freund",
					"friend_male": "Fester Freund",
					"friend_female": "Feste Freundin",
				}
			},
			dev: {
				translation: {
					'hello': 'Welcome!',
					'helloName': 'Welcome, {{name}}!',
					'helloNesting': 'You know what? You\'re $t(hello)',
					'woman': 'Woman',
					'woman_plural': 'Women',
					'woman_plural_0': 'No women',
					'friend': 'Friend',
					'friend_male': 'Boyfriend',
					'friend_female': 'Girlfriend'
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

		inject(function (_$filter_, _$rootScope_) {
			$filter = _$filter_;
			$rootScope = _$rootScope_;

			// This gets locales loaded, promise is resolved??
			filter = $filter('i18next');
			$rootScope.$apply();
		});
	});

	/*
	 * Tests
	 *  - simple strings
	 *  - passing options
	 *  - using $scope (coming soon)
	 *  - plurals
	 *  - context
	 */

	it('should be a function object', function () {
		expect(typeof $filter('i18next')).toBe('function');
	});

	describe('simple strings', function () {

		it('should return original key, because translation does not exist', function () {
			expect($filter('i18next')('Key_Not_Found')).toBe('Key_Not_Found');
		});

		it('should translate "hello" into German ("de-DE"; default language)', function () {
			expect($filter('i18next')('hello')).toBe('Herzlich Willkommen!');
		});

	});

	describe('passing options', function () {

		it('should translate "hello" into language passed by options ("dev")', function () {
			expect($filter('i18next')('hello', { lng: 'dev' })).toEqual('Welcome!');
		});

		it('should replace "{{name}}" in the translation string with name given by options', function () {
			expect($filter('i18next')('helloName', { name: 'Andre' })).toEqual('Herzlich Willkommen, Andre!');
		});

		it('should replace "{{name}}" in the translation string with name given by options and should use "dev" as language', function () {
			expect($filter('i18next')('helloName', { name: 'Andre', lng: 'dev' })).toEqual('Welcome, Andre!');
		});

	});

	describe('using $scope', function () {

		// coming soon

	});

	describe('plurals', function () {

		it('should use the single form', function () {
			expect($filter('i18next')('woman', { count: 1 })).toEqual('Frau');
		});

		it('should use the plural form', function () {
			expect($filter('i18next')('woman', { count: 5 })).toEqual('Frauen');
		});

	});

	describe('context', function () {
		it('should use the "normal" form', function () {
			expect($filter('i18next')('friend')).toEqual('Freund');
		});

		it('should use the male form', function () {
			expect($filter('i18next')('friend', { context: 'male' })).toEqual('Fester Freund');
		});

		it('should use the female form', function () {
			expect($filter('i18next')('friend', { context: 'female' })).toEqual('Feste Freundin');
		});
	});

	describe('nesting translations', function () {
		it('should include another translation', function () {
			expect($filter('i18next')('helloNesting')).toEqual('Weißt du was? Du bist Herzlich Willkommen!');
		});

		it('should include another translation and should use "dev" as language', function () {
			expect($filter('i18next')('helloNesting', { lng: 'dev' })).toEqual('You know what? You\'re Welcome!');
		});
	});
});
