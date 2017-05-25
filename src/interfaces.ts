import * as angular from 'angular';
import * as i18next from 'i18next';

interface Window {
    i18next: i18next.I18n;
    i18nextOptions: i18next.Options;
}

declare var window: Window;

export interface Ii18nProvider extends ng.IServiceProvider {
}

export interface Ii18nTranslateService {
    t: (key: string, options: i18next.TranslationOptions) => string;
    changeLanguage: (lng: string) => void;
    changeOptions: (options: i18next.Options) => void;
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

