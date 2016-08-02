/// <reference path="../typings/index.d.ts" />

interface Window {
    i18next: I18next.I18n;
    i18nextOptions: I18next.Options;
}

declare var window: Window;

interface Ii18nProvider extends ng.IServiceProvider {
}

interface Ii18nTranslateService {
    t: (key: string, options: I18next.TranslationOptions) => string;
    changeLanguage: (lng: string) => void;
    changeOptions: (options: I18next.Options) => void;
}

interface Ii18nDirectiveController {
    localize: (key: string, noWatch: boolean) => void;
}
