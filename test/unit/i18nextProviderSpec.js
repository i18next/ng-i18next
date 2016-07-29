describe('Unit: jm.i18next - Provider', function () {

	'use strict';

	var $i18next, $timeout;
	var i18nextOptions = {
		compatibilityAPI: 'v1',
		lng: 'de',
		useCookie: false,
		useLocalStorage: false,
		fallbackLng: 'dev',
		resources: {
			'de-DE': {
				translation: {
					'hello': 'Herzlich Willkommen!',
					'helloName': 'Herzlich Willkommen, {{name}}!',
					'helloNesting': 'Weißt du was? Du bist $t(hello)',
					'woman': 'Frau',
					'woman_plural': 'Frauen',
					'woman_plural_0': 'Keine Frauen',
					'friend': 'Freund',
					'friend_male': 'Fester Freund',
					'friend_female': 'Feste Freundin'
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
			$i18nextProvider.options = i18nextOptions;
			$i18nextProvider.modules = [window.i18nextSprintfPostProcessor];
		});

		inject(function (_$i18next_, _$timeout_) {
			$i18next = _$i18next_;
			$timeout = _$timeout_;
		});

	});

	it('should contain an $i18next service', function () {
		$timeout(function () {
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
		$timeout(function () {
			expect($i18next.options.lng).toBe('de-DE');
		});
	});

	describe('simple strings', function () {

		it('should return original key, because translation does not exist', function () {
			$timeout(function () {
				expect($i18next.t('Key_Not_Found')).toBe('Key_Not_Found');
			});
		});

		it('should translate "hello" into German ("de-DE"; default language)', function () {
			$timeout(function () {
				expect($i18next.t('hello')).toEqual('Herzlich Willkommen!');
			});
		});

		it('should translate "hello" into German in default namespace ("de-DE"; default language)', function () {
			// @TODO: Create test for namespaces
				var originResStore = angular.copy(i18nextOptions.resStore);
				i18nextOptions.resStore['de-DE'] = {
					a: { 'hello': 'Herzlich Willkommen!' },
					b: { 'helloName': 'Herzlich Willkommen, __name__!' }
				};
				i18nextOptions.ns = {
					namespaces: ['a', 'b'],
					defaultNs: 'a'
				};

				expect($i18next.t('hello')).toEqual('Herzlich Willkommen!');

				delete i18nextOptions.ns;
				i18nextOptions.resStore = originResStore;
		});

	});

	describe('passing options', function () {

		it('should translate "hello" into language passed by options ("dev")', function () {
			$timeout(function () {
				expect($i18next.t('hello', { lng: 'dev' })).toEqual('Welcome!');
			});
		});

		it('should replace "{{name}}" in the translation string with name given by options', function () {
			inject(function () {
				expect($i18next.t('helloName', {name: 'Andre'})).toEqual('Herzlich Willkommen, Andre!');
			});
		});

		it('should replace "{{name}}" in the translation string with name given by options and should use "dev" as language', function () {
			inject(function () {
				expect($i18next.t('helloName', {name: 'Andre', lng: 'dev'})).toEqual('Welcome, Andre!');
			});
		});

	});

	describe('using $scope', function () {

		// coming soon

	});

	describe('plurals', function () {

		it('should use the single form', function () {
			$timeout(function () {
				expect($i18next.t('woman', { count: 1 })).toEqual('Frau');
			});
		});

		it('should use the plural form', function () {
			$timeout(function () {
				expect($i18next.t('woman', { count: 5 })).toEqual('Frauen');
			});
		});

	});

	describe('context', function () {

		it('should use the "normal" form', function () {
			$timeout(function () {
				expect($i18next.t('friend')).toEqual('Freund');
			});
		});

		it('should use the male form', function () {
			$timeout(function () {
				expect($i18next.t('friend', { context: 'male' })).toEqual('Fester Freund');
			});
		});

		it('should use the female form', function () {
			$timeout(function () {
				expect($i18next.t('friend', { context: 'female' })).toEqual('Feste Freundin');
			});
		});

	});

	describe('nesting translations', function () {

		it('should include another translation', function () {
			$timeout(function () {
				expect($i18next.t('helloNesting')).toEqual('Weißt du was? Du bist Herzlich Willkommen!');
			});
		});

		it('should include another translation and should use "dev" as language', function () {
			$timeout(function () {
				expect($i18next.t('helloNesting', { lng: 'dev' })).toEqual('You know what? You\'re Welcome!');
			});
		});

	});

});
