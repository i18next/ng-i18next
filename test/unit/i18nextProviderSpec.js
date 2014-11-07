describe('Unit: jm.i18next - Provider', function () {

	'use strict';

	var $i18next;
	var i18nextOptions = {
		defaultLoadingValue: 'A default value!',
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
					'friend_female': 'Feste Freundin'
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
					'friend_female': 'Girlfriend'
				}
			}
		}
		//resGetPath: '/test/locales/__lng__/__ns__.json'
	};

	beforeEach(function () {

		module('jm.i18next', function ($i18nextProvider) {
			$i18nextProvider.options = i18nextOptions;
		});

		inject(function (_$i18next_) {
			$i18next = _$i18next_;
		});

	});

	it('should contain an $i18next service', function () {
		inject(function () {
			expect($i18next).not.toEqual(null);
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

	it('should have options passed in "beforeEach"', function () {
		expect($i18next.options.lng).toBe('de-DE');
	});

	describe('simple strings', function () {

		it('should return original key, because translation does not exist', function () {
			inject(function () {
				expect($i18next('Key_Not_Found')).toBe('Key_Not_Found');
			});
		});

		it('should translate "hello" into German ("de-DE"; default language)', function () {
			inject(function () {
				expect($i18next('hello')).toEqual('Herzlich Willkommen!');
			});
		});

		it('should translate "hello" into German in default namespace ("de-DE"; default language)', function () {
			inject(function () {
				var originResStore = angular.copy(i18nextOptions.resStore);
				i18nextOptions.resStore['de-DE'] = {
					a: { 'hello': 'Herzlich Willkommen!' },
					b: { 'helloName': 'Herzlich Willkommen, __name__!' }
				};
				i18nextOptions.ns = {
					namespaces: ['a', 'b'],
					defaultNs: 'a'
				};

				expect($i18next('hello')).toEqual('Herzlich Willkommen!');

				delete i18nextOptions.ns;
				i18nextOptions.resStore = originResStore;
			});
		});

	});

	describe('passing options', function () {

		it('should translate "hello" into language passed by options ("dev")', function () {
			inject(function () {
				expect($i18next('hello', {lng: 'dev'})).toEqual('Welcome!');
			});
		});

		it('should replace "__name__" in the translation string with name given by options', function () {
			inject(function () {
				expect($i18next('helloName', {name: 'Andre'})).toEqual('Herzlich Willkommen, Andre!');
			});
		});

		it('should replace "__name__" in the translation string with name given by options and should use "dev" as language', function () {
			inject(function () {
				expect($i18next('helloName', {name: 'Andre', lng: 'dev'})).toEqual('Welcome, Andre!');
			});
		});

	});

	describe('using $scope', function () {

		// coming soon

	});

	describe('plurals', function () {

		it('should use the single form', function () {
			inject(function () {
				expect($i18next('woman', {count: 1})).toEqual('Frau');
			});
		});

		it('should use the plural form', function () {
			inject(function () {
				expect($i18next('woman', {count: 5})).toEqual('Frauen');
			});
		});

	});

	describe('context', function () {

		it('should use the "normal" form', function () {
			inject(function () {
				expect($i18next('friend')).toEqual('Freund');
			});
		});

		it('should use the male form', function () {
			inject(function () {
				expect($i18next('friend', {context: 'male'})).toEqual('Fester Freund');
			});
		});

		it('should use the female form', function () {
			inject(function () {
				expect($i18next('friend', {context: 'female'})).toEqual('Feste Freundin');
			});
		});

	});

	describe('nesting translations', function () {

		it('should include another translation', function () {
			inject(function () {
				expect($i18next('helloNesting')).toEqual('Weißt du was? Du bist Herzlich Willkommen!');
			});
		});

		it('should include another translation and should use "dev" as language', function () {
			inject(function () {
				expect($i18next('helloNesting', {lng: 'dev'})).toEqual('You know what? You\'re Welcome!');
			});
		});

	});

});
