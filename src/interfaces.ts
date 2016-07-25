/// <reference path="../typings/index.d.ts" />

interface Window {
    i18next: I18next.I18n;
}

declare var window: Window;

interface Ii18nTranslateService {
    init: (options: any, modules: Array<any>) => ng.IPromise<any>;
    i18nextTranslate: (key: string, options: I18next.TranslationOptions) => string;
    translate: (key: string, options: I18next.TranslationOptions, hasOwnOptions: boolean) => void;
}
