/// <reference path="../typings/index.d.ts" />

interface Window {
    i18next: I18next.I18n;
}

declare var window: Window;

interface Ii18nProvider extends ng.IServiceProvider {
    init: (options: I18next.Options, i18nextModules: Array<any>) => void;
    use: (module: any) => void;
}

interface Ii18nTranslateService {
    t: (key: string, options: I18next.TranslationOptions) => string;
    options: I18next.Options;
    modules: Array<any>;    
    changeLanguage: (lng: string) => void;
    changeOptions: (options: I18next.Options) => void;
}

interface Ii18nDirectiveController {
    localize: (key: string, noWatch: boolean) => void;
}
