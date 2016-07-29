/// <reference path="../typings/index.d.ts" />
/// <reference path="./interfaces.ts" />

export class I18nTranslateService implements Ii18nTranslateService {
    public options: I18next.Options = {};
    tOptions: I18next.TranslationOptions = {};
    interpolationOptions: I18next.InterpolationOptions;

    public modules: Array<any> = [];

    localesLoaded: boolean = false;
    translations: any = {};

    i18n: I18next.I18n = window.i18next;

    constructor(private $rootScope: ng.IRootScopeService, private $timeout: ng.ITimeoutService, private $q: ng.IQService, options: I18next.Options, modules: Array<any>) {
        this.options = options;
        this.modules = modules;

        this.initializeI18next(this.options, this.modules)
            .then((response: ng.IPromise<{}>) => { this.initializeI18nextComplete(response); })

        this.$rootScope.$watch(() => { return this.options }, (newOptions: I18next.Options, oldOptions: I18next.Options) => {
            if (newOptions !== oldOptions) {
                this.initializeI18next(newOptions, this.modules)
                    .then((response: ng.IPromise<{}>) => { this.initializeI18nextComplete(response) });
            }
        });
    }

    private initializeI18next(options: any, modules: Array<any>) {
        let i18nDeferred = this.$q.defer();

        if (window.i18next && angular.isDefined(modules)) {
            // assign instance of i18next
            this.i18n = window.i18next;

            // register i18next plugin modules
            angular.forEach(modules, (i18nextModule) => {
                if (angular.isDefined(i18nextModule)) {
                    this.i18n.use(i18nextModule);
                } else {
                    let error = new Error('[ng-i18next] Can\'t find one or more  of the requested i18next modules! Please refer to i18next.');
                    this.handleError(error);
                    i18nDeferred.reject(error);
                }
            });

            // initialize i18next
            this.i18n.init(options, (err, localize) => {
                if (typeof (localize) === 'undefined') {
                    localize = err;
                    err = undefined;
                } else if (angular.isDefined(err) && typeof (err) !== 'undefined' && err !== null) {
                    this.handleError(err);
                }

                i18nDeferred.resolve('ng-i18next initialized');
            });
        } else {
            let error = new Error('[ng-i18next] Can\'t find i18next and/or i18next modules! Please refer to i18next.');
            this.handleError(error);
            i18nDeferred.reject(error);
        }

        return i18nDeferred.promise;
    }

    private initializeI18nextComplete(response: ng.IPromise<{}>) {
        this.$timeout(() => {
            this.$rootScope.$broadcast('i18nextLanguageChange', this.options.lng);
            this.$rootScope.$apply();
        });
    }

    public t(key: string, ownOptions: I18next.TranslationOptions) {
        let hasOwnOptions: boolean = angular.isDefined(ownOptions);
        let hasOwnNsOption: boolean = hasOwnOptions && angular.isDefined(ownOptions.ns);
        let hasInitNsObj: boolean = angular.isDefined(this.options) && angular.isDefined(this.options.ns);
        let defaultOptions: I18next.Options = this.options;
        let mergedOptions: I18next.Options;
        let lng: string;

        // https://github.com/i18next/i18next/blob/e47bdb4d5528c752499b0209d829fde4e1cc96e7/src/i18next.translate.js#L232
        // Because of i18next read namespace from `options.ns`
        if (angular.isUndefined(hasOwnNsOption) && hasInitNsObj) {
            defaultOptions = angular.extend({}, this.options);
            defaultOptions.ns = defaultOptions.defaultNS;
        }

        mergedOptions = hasOwnOptions ? angular.extend({}, defaultOptions, ownOptions) : defaultOptions;

        // https://github.com/i18next/i18next/blob/7af53d5a01cc9942c0edae361bd2f65361e340c9/src/i18next.translate.js#L289
        // lng will be deleted in some case
        lng = mergedOptions.lng;

        this.translate(key, mergedOptions, hasOwnOptions);

        return angular.isDefined(lng) ? this.translations[lng][key] : this.translations['auto'][key];
    }

        public changeLanguage(lng: string) {
        if (this.options.lng !== lng && this.i18n.language !== lng) {
            this.options.lng = lng;
            this.i18n.changeLanguage(lng, (err, t) => {
                this.$rootScope.$broadcast('i18nextLanguageChange', this.i18n.language);
            });
        }
    }

    public changeOptions(options: I18next.Options) {
        if (angular.isDefined(options)) {
            this.options = options;
        }
    }


    private translate(key: string, options: I18next.TranslationOptions, hasOwnOptions: boolean) {
        let localOptions: I18next.TranslationOptions = angular.isDefined(options) && hasOwnOptions ? options : this.options;
        let lng = localOptions.lng || 'auto';

        if (angular.isUndefined(this.translations[lng])) {
            this.translations[lng] = {};
        }

        if (angular.isUndefined(this.i18n)) {
            this.translations[lng][key] = angular.isDefined(localOptions.defaultValue) ? localOptions.defaultValue : key;
        } else if (angular.isUndefined(this.translations[lng][key]) || hasOwnOptions) {
            this.translations[lng][key] = this.i18n.t(key, localOptions);
        }
    }

    private handleError(error: any) {
        let message = angular.isDefined(error.message) ? error.message : error[0];
        console.log(message);
    }
}

