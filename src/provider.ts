/// <reference path="../typings/index.d.ts" />
/// <reference path="./interfaces.ts" />

import { I18nDirective } from './directive';
import { I18nBindOnceDirective } from './directiveBindOnce';
import { I18nDirectiveController } from './directiveController';
import { I18nFilter } from './filter';
import { I18nTranslateService } from './translateService';


class I18nProvider implements Ii18nProvider {
	translationOptions: I18next.TranslationOptions = {};

	constructor() {
		this.$get.$inject = ['$rootScope'];
	}

	$get = ($rootScope: ng.IRootScopeService): I18nTranslateService => {
		if (window.i18next) {
			return new I18nTranslateService($rootScope, this.translationOptions);
		} else {
			throw 'i18next is not loaded';
		}
	};
}

export { I18nProvider };

angular.module('jm.i18next', ['ng', 'ngSanitize'])
    .provider('$i18next', I18nProvider)
    .directive('ngI18next', I18nDirective.factory())
	.directive('boI18next', I18nBindOnceDirective.factory())
    .controller('NgI18nextController', I18nDirectiveController)
    .filter('i18next', I18nFilter.factory());

