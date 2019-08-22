import { InitOptions, InterpolationOptions } from 'i18next';

interface Window {
	i18next: InitOptions;
	i18nextOptions: InitOptions;
}

declare var window: Window;

export interface Ii18nTranslateService {
	options: InitOptions;
	tOptions: any;
	interpolationOptions: InterpolationOptions;

	modules: any[];

	t: (key: string, options?: any) => string;
	changeLanguage: (lng: string) => void;
	changeOptions: (options: InitOptions) => void;
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
	(value: string, params?: any): string;
	$stateful: boolean;
}
