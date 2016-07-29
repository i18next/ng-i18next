/// <reference path="../typings/index.d.ts" />

interface Window {
    i18next: I18next.I18n;
}

declare var window: Window;

interface Ii18nTranslateService {
    init: (options: any, modules: Array<any>) => ng.IPromise<any>;
    t: (key: string, options: I18next.TranslationOptions) => string;
    changeLanguage: (lng: string) => void;
    changeOptions: (options: I18next.Options) => void;
}

interface Ii18nDirectiveController {
    localize: (key: string, noWatch: boolean) => void;
}
