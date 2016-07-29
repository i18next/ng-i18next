describe('Unit: jm.i18next - Provider behavior before i18next has been initialized', function () {

	'use strict';

	var $i18next, $timeout;
	var i18nextOptions = {
		compatibilityAPI: 'v1',
		lng: 'de-DE',
		useCookie: false,
		useLocalStorage: false,
		fallbackLng: 'dev',
		debug: false,
		resources: {
			'de-DE': {
				translation: {}
			},
			'dev': {
				translation: {}
			}
		}
	};

	beforeEach(function () {

		module('jm.i18next', function ($i18nextProvider) {
			spyOn(jasmine.getGlobal().i18next, 'init');
			$i18nextProvider.options = i18nextOptions;
		});

		inject(function (_$i18next_, _$timeout_) {
			$i18next = _$i18next_;
			$timeout = _$timeout_;
		});

	});

	describe('global defaultLoadingValue', function () {

		beforeEach(function () {
			i18nextOptions.defaultValue = 'A default value!';
			$i18next.options = i18nextOptions;
		});

		it('should return original key, because translation does not exist', function () {
			inject(function () {
				$i18next.options = i18nextOptions;
				expect($i18next('Key_Not_Found')).toBe('A default value!');
			});
		});

		afterEach(function () {
			delete i18nextOptions.defaultLoadingValue;
			$i18next.options = i18nextOptions;
		});

	});

	describe('per-translation defaultLoadingValue', function () {

		it('should not return original key if defaultLoadingValue is provided', function () {
			$timeout(function () {
				expect($i18next.t('Key_Not_Found', { defaultLoadingValue: 'My default' })).toBe('My default');
			});
		});

	});

});
