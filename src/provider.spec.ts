import * as angular from 'angular';
import { i18n, InitOptions } from 'i18next';

import { Ii18nTranslateService } from './interfaces';
import { TestFactories } from './testFactories';

declare let i18next: i18n;

describe('provider tests', () => {

	describe('Unit: jm.i18next - Provider behavior before i18next has been initialized', () => {

		let $i18next: Ii18nTranslateService;
		let $timeout: ng.ITimeoutService;
		let $rootScope: ng.IRootScopeService;
		let i18nextOptions: InitOptions = {
			debug: false,
			fallbackLng: 'dev',
			lng: 'de-DE',
			resources: {
				'de-DE': {
					translation: {},
				},
				'dev': {
					translation: {},
				},
			},
		};

		const tOptions: any = {};

		beforeEach(() => {

			angular.mock.module('jm.i18next', ($i18nextProvider: ng.IServiceProvider) => {
				spyOn(i18next, 'init');
				i18next.init(i18nextOptions, (err, t) => {
					// console.log('resources loaded');
				});

				i18next.on('initialized', (options) => {
					// console.log('i18next initialized');
					i18nextOptions = options;
				});
			});

			inject((
				_$i18next_: Ii18nTranslateService,
				_$timeout_: ng.ITimeoutService,
				_$rootScope_: ng.IRootScopeService) => {
				$i18next = _$i18next_;
				$timeout = _$timeout_;
				$rootScope = _$rootScope_;

				$rootScope.$apply();
			});

		});

		describe('global defaultValue', () => {

			beforeEach(() => {
				tOptions.defaultValue = 'A default value!';
			});

			it('should return original key, because translation does not exist', () => {
				$i18next.changeOptions(tOptions);
				expect($i18next.t('Key_Not_Found')).toBe('Key_Not_Found');
			});

			afterEach(() => {
				delete tOptions.defaultValue;
				$i18next.tOptions = tOptions;
			});

		});

		describe('per-translation defaultValue', () => {

			it('should not return original key if defaultValue is provided', () => {
				expect($i18next.t('Key_Not_Found', { defaultValue: 'My default' })).toBe('My default');
			});

		});

	});

	describe('Unit: jm.i18next - Provider', () => {

		let $i18next: Ii18nTranslateService;
		let $timeout;
		let $rootScope;

		let i18nextOptions = TestFactories.getOptions();

		beforeEach(() => {

			angular.mock.module('jm.i18next', ($i18nextProvider: ng.IServiceProvider) => {
				i18next.init(i18nextOptions, (err, t) => {
					// console.log('resources loaded');
				});

				i18next.on('initialized', (options) => {
					// console.log('i18next initialized');
					i18nextOptions = options;
				});
			});

			inject((
				_$i18next_: Ii18nTranslateService,
				_$timeout_: ng.ITimeoutService,
				_$rootScope_: ng.IRootScopeService) => {
				$i18next = _$i18next_;
				$timeout = _$timeout_;
				$rootScope = _$rootScope_;

				$rootScope.$apply();
			});

		});

		it('should contain an $i18next service', () => {
			expect($i18next).not.toEqual(null);
		});

		/*
		 * Tests
		 *  - simple strings
		 *  - passing options
		 *  - using $scope (coming soon)
		 *  - plurals
		 *  - context
		 */

		it('should have options passed in "beforeEach"', () => {
			expect($i18next.options.lng).toBe('de-DE');
		});

		describe('simple strings', () => {

			it('should return original key, because translation does not exist', () => {
				expect($i18next.t('Key_Not_Found')).toBe('Key_Not_Found');
			});

			it('should translate "hello" into German ("de-DE"; default language)', () => {
				expect($i18next.t('hello')).toEqual('Herzlich Willkommen!');
			});

			it('should translate "hello" into German in default namespace ("de-DE"; default language)', () => {
				// @TODO: Create test for namespaces
				const originResStore = angular.copy(i18nextOptions.resources);
				i18nextOptions.resources['de-DE'] = {
					a: { hello: 'Herzlich Willkommen Wookie!' },
					b: { helloName: 'Herzlich Willkommen, {{name}}!' }
				};
				i18nextOptions.ns = ['a', 'b'];
				i18nextOptions.defaultNS = 'a';

				i18next.init(i18nextOptions, (err, t) => {
					expect(t('hello')).toEqual('Herzlich Willkommen Wookie!');
				});

				delete i18nextOptions.ns;
				i18nextOptions.resources = originResStore;
				i18nextOptions.defaultNS = 'translation';

				i18next.init(i18nextOptions, (err, t) => {
					expect(t('hello')).toEqual('Herzlich Willkommen!');
				});
				i18next.on('initialized', (options) => {
					i18nextOptions = options;
				});
			});

		});

		describe('passing options', () => {

			it('should translate "hello" into language passed by options ("dev")', () => {
				expect($i18next.t('hello', { lng: 'dev' })).toEqual('Welcome!');
			});

			it('should replace "{{name}}" in the translation string with name given by options', () => {
				expect($i18next.t('helloName', { name: 'Andre' })).toEqual('Herzlich Willkommen, Andre!');
			});

			it('should replace "{{name}}" in the translation string with name given by options and should use "dev" as language', () => {
				expect($i18next.t('helloName', { name: 'Andre', lng: 'dev' })).toEqual('Welcome, Andre!');
			});

		});

		describe('using $scope', () => {

			// coming soon

		});

		describe('plurals', () => {

			it('should use the single form', () => {
				expect($i18next.t('woman', { count: 1 })).toEqual('Frau');
			});

			it('should use the plural form', () => {
				expect($i18next.t('woman', { count: 5 })).toEqual('Frauen');
			});

		});

		describe('context', () => {

			it('should use the "normal" form', () => {
				expect($i18next.t('friend')).toEqual('Freund');
			});

			it('should use the male form', () => {
				expect($i18next.t('friend', { context: 'male' })).toEqual('Fester Freund');
			});

			it('should use the female form', () => {
				expect($i18next.t('friend', { context: 'female' })).toEqual('Feste Freundin');
			});

		});

		describe('nesting translations', () => {

			it('should include another translation', () => {
				expect($i18next.t('helloNesting')).toEqual('Weißt du was? Du bist Herzlich Willkommen!');
			});

			it('should include another translation and should use "dev" as language', () => {
				expect($i18next.t('helloNesting', { lng: 'dev' })).toEqual('You know what? You\'re Welcome!');
			});

		});

	});
});
