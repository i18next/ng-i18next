describe('jm.i18next', function () {

	'use strict';

	describe('$i18nextFilter', function () {

		beforeEach(module('jm.i18next', function ($i18nextProvider) {

			$i18nextProvider.options = {
				lng: 'de',
				useCookie: false,
				useLocalStorage: false,
				fallbackLng: 'dev',
				resGetPath: '../../examples/locales/__lng__/__ns__.json'
			};

		}));

		it('should be a function object', function () {
			inject(function ($filter) {
				expect(typeof $filter('i18next')).toBe('function');
			});
		});

		it('should return original key if translation doesn\'t exist', function () {
			inject(function ($filter) {
				expect($filter('i18next')('dontKnowThis')).toEqual('dontKnowThis');
			});
		});

	});
});
