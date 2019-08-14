import * as angular from 'angular';
import { i18n, InitOptions } from 'i18next';

import { IFilterI18next } from './interfaces';
import { TestFactories } from './testFactories';

declare let i18next: i18n;

describe('Unit: jm.i18next - Filter', () => {

	let $filter: ng.IFilterService;
	let filter: IFilterI18next;
	let $rootScope: ng.IRootScopeService;

	let i18nextOptions: InitOptions = TestFactories.getOptions();

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

		inject((_$filter_: ng.IFilterService, _$rootScope_: ng.IRootScopeService) => {
			$filter = _$filter_;
			$rootScope = _$rootScope_;

			// This gets locales loaded, promise is resolved??
			filter = $filter<IFilterI18next>('i18next');
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

	it('should be a function object', () => {
		expect(typeof $filter('i18next')).toBe('function');
	});

	describe('simple strings', () => {

		it('should return original key, because translation does not exist', () => {
			expect(filter('Key_Not_Found')).toBe('Key_Not_Found');
		});

		it('should translate "hello" into German ("de-DE"; default language)', () => {
			expect(filter('hello')).toBe('Herzlich Willkommen!');
		});

	});

	describe('passing options', () => {

		it('should translate "hello" into language passed by options ("dev")', () => {
			expect(filter('hello', { lng: 'dev' })).toEqual('Welcome!');
		});

		it('should replace "{{name}}" in the translation string with name given by options', () => {
			expect(filter('helloName', { name: 'Andre' })).toEqual('Herzlich Willkommen, Andre!');
		});

		it('should replace "{{name}}" in the translation string with name given by options and should use "dev" as language', () => {
			expect(filter('helloName', { name: 'Andre', lng: 'dev' })).toEqual('Welcome, Andre!');
		});

	});

	describe('using $scope', () => {

		// coming soon

	});

	describe('plurals', () => {

		it('should use the single form', () => {
			expect(filter('woman', { count: 1 })).toEqual('Frau');
		});

		it('should use the plural form', () => {
			expect(filter('woman', { count: 5 })).toEqual('Frauen');
		});

	});

	describe('context', () => {
		it('should use the "normal" form', () => {
			expect(filter('friend')).toEqual('Freund');
		});

		it('should use the male form', () => {
			expect(filter('friend', { context: 'male' })).toEqual('Fester Freund');
		});

		it('should use the female form', () => {
			expect(filter('friend', { context: 'female' })).toEqual('Feste Freundin');
		});
	});

	describe('nesting translations', () => {
		it('should include another translation', () => {
			expect(filter('helloNesting')).toEqual('Weißt du was? Du bist Herzlich Willkommen!');
		});

		it('should include another translation and should use "dev" as language', () => {
			expect(filter('helloNesting', { lng: 'dev' })).toEqual('You know what? You\'re Welcome!');
		});
	});
});
