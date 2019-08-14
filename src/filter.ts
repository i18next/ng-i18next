import * as angular from 'angular';
import { IFilterI18next, Ii18nTranslateService } from './interfaces';

export class I18nFilter {
	public static factory() {
		const filter = ($i18next: Ii18nTranslateService) => {
			function i18nextFilter(key: string, options?: any) {
				const localOptions = angular.isDefined(options) ? options : {};
				return $i18next.t(key, localOptions);
			}
			(i18nextFilter as IFilterI18next).$stateful = true;
			return i18nextFilter;
		};
		filter.$inject = ['$i18next'];
		return filter;
	}
}
