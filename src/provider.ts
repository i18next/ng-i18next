/// <reference path="../typings/index.d.ts" />
/// <reference path="./interfaces.ts" />

import I18nTranslateService from './translateService.ts';
import I18nDirective from './directive.ts';
import I18nBindOnceDirective from './directiveBindOnce.ts';
import I18nDirectiveController from './directiveController.ts';
import I18nFilter from './filter.ts';

class I18nProvider implements ng.IServiceProvider {

	private options: {} = {};
	private modules: Array<any> = [];

	constructor() {
		this.$get.$inject = ['$rootScope', '$timeout', '$q'];
	}

	public init(options: I18next.Options, i18nextModules: Array<any>) {
		this.options = options;
		this.modules = i18nextModules;
	}

	$get = ($rootScope: ng.IRootScopeService, $timeout: ng.ITimeoutService, $q: ng.IQService): I18nTranslateService => {
		return new I18nTranslateService($rootScope, $timeout, $q, this.options, this.modules);
	};
}

export default I18nProvider;

angular.module('jm.i18next', ['ng', 'ngSanitize'])
    .provider('$i18next', I18nProvider)
    .directive('ngI18next', I18nDirective.factory())
	.directive('boI18next', I18nBindOnceDirective.factory())
    .controller('NgI18nextController', I18nDirectiveController)
    .filter('i18next', I18nFilter.factory());

