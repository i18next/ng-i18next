/// <reference path="./interfaces.ts" />

export class I18nFilter {
	public static factory() {
		let filter = ($i18next: Ii18nTranslateService) => {
			function i18nextFilter(key: string, options: I18next.TranslationOptions) {
				return $i18next.t(key, options);
			}
			(i18nextFilter as any).$stateful = true;
			return i18nextFilter;
		};
		filter.$inject = ['$i18next'];
		return filter;
	}
}


