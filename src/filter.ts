import * as angular from 'angular';
import * as i18next from 'i18next';
import { Ii18nTranslateService } from 'interfaces';

export class I18nFilter {
	public static factory() {
		let filter = ($i18next: Ii18nTranslateService) => {
			function i18nextFilter(key: string, options: i18next.TranslationOptions) {
				let localOptions = angular.isDefined(options) ? options : {};
				return $i18next.t(key, localOptions);
			}
			(i18nextFilter as any).$stateful = true;
			return i18nextFilter;
		};
		filter.$inject = ['$i18next'];
		return filter;
	}
}


