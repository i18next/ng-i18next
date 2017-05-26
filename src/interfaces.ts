import * as i18n from 'i18next';

interface Window {
    i18next: i18n.I18n;
    i18nextOptions: i18n.Options;
}

declare var window: Window;

export interface Ii18nProvider extends ng.IServiceProvider {
}

export interface Ii18nTranslateService {
    options: i18n.Options;
    tOptions: i18n.TranslationOptions;
    interpolationOptions: i18n.InterpolationOptions;

    modules: Array<any>;

    t: (key: string, options?: i18n.TranslationOptions) => string;
    changeLanguage: (lng: string) => void;
    changeOptions: (options: i18n.Options) => void;
}

export interface Ii18nDirectiveController {
    localize: (key: string, noWatch: boolean) => void;
}

export interface I18nAttributes extends ng.IAttributes {
    ngI18next: string;
}

export interface I18nController {
    localize: (value: string, watch?: boolean) => string;
}

export interface IFilterI18next {
    (value: string, params?: Object): string;
    $stateful: boolean;
}


