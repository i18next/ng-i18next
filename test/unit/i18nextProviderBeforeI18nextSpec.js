describe('Unit: jm.i18next - Provider behavior before i18next has been initialized', function () {

	'use strict';

	var $i18next, $timeout, $rootScope;
	var i18nextOptions = {
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

		inject(function (_$i18next_, _$timeout_, _$rootScope_) {
			$i18next = _$i18next_;
			$timeout = _$timeout_;
			$rootScope = _$rootScope_;

			$rootScope.$apply();
		});

	});

	describe('global defaultValue', function () {

		beforeEach(function () {
			i18nextOptions.defaultValue = 'A default value!';
		});

		it('should return original key, because translation does not exist', function () {
			$i18next.options = i18nextOptions;
			expect($i18next.t('Key_Not_Found')).toBe('A default value!');
		});

		afterEach(function () {
			delete i18nextOptions.defaultValue;
			$i18next.options = i18nextOptions;
		});

	});

	describe('per-translation defaultValue', function () {

		it('should not return original key if defaultValue is provided', function () {
			expect($i18next.t('Key_Not_Found', { defaultValue: 'My default' })).toBe('My default');
		});

	});

});
