/// <reference path="../typings/index.d.ts" />
/// <reference path="./interfaces.ts" />

class I18nTranslateService implements Ii18nTranslateService {
    initOptions: I18next.Options = {};
    tOptions: I18next.TranslationOptions = {};
    interpolationOptions: I18next.InterpolationOptions;

    i18nextModules: Array<any> = [];
    translations: any = {};

    i18n: I18next.I18n = window.i18next;

    constructor(private $rootScope: ng.IRootScopeService, private $timeout: ng.ITimeoutService, private $q: ng.IQService, options: I18next.Options, modules: Array<any>) {
        this.initOptions = options;
        this.i18nextModules = modules;

        this.init(this.initOptions, this.i18nextModules);
    }

    init(options: any, modules: Array<any>) {
        let i18nDeferred = this.$q.defer();

        if (window.i18next && angular.isDefined(modules)) {
            // assign instance of i18next
            this.i18n = window.i18next;

            // register i18next plugin modules
            angular.forEach(modules, (i18nextModule) => {
                this.i18n.use(i18nextModule);
            });

            // initialize i18next
            this.i18n.init(options, (err, localize) => {

                if (typeof (localize) === 'undefined') {
                    localize = err;
                    err = undefined;
                } else if (!!err && typeof (err) !== 'undefined' && err !== null) {
                    console.log('[ng-i18next] i18next error: ' + err);
                }

                this.$rootScope.$broadcast('i18nextLanguageChange', this.i18n.language);

                i18nDeferred.resolve('ng-i18next initialized');
            });
        } else {
            let error = new Error('[ng-i18next] Can\'t find i18next and/or i18next modules! Please refer to i18next.');
            i18nDeferred.reject(error);
        }

        return i18nDeferred.promise;
    }

    i18nextTranslate(key: string, options: I18next.TranslationOptions) {
        let hasOwnOptions: boolean = !!options,
            hasOwnNsOption: boolean = hasOwnOptions && angular.isDefined(options.ns),
            hasInitNsObj: boolean = this.initOptions !== undefined && this.initOptions.ns !== undefined,
            defaultOptions: I18next.Options = this.initOptions,
            mergedOptions: I18next.Options,
            lng: string;

        // https://github.com/i18next/i18next/blob/e47bdb4d5528c752499b0209d829fde4e1cc96e7/src/i18next.translate.js#L232
        // Because of i18next read namespace from `options.ns`
        if (!hasOwnNsOption && hasInitNsObj) {
            defaultOptions = angular.extend({}, this.initOptions);
            defaultOptions.ns = defaultOptions.defaultNS;
        }

        mergedOptions = hasOwnOptions ? angular.extend({}, defaultOptions, options) : defaultOptions;

        // https://github.com/i18next/i18next/blob/7af53d5a01cc9942c0edae361bd2f65361e340c9/src/i18next.translate.js#L289
        // lng will be deleted in some case
        lng = mergedOptions.lng;

        this.translate(key, mergedOptions, hasOwnOptions);

        return !!lng ? this.translations[lng][key] : this.translations['auto'][key];
    }

    translate(key: string, options: I18next.TranslationOptions, hasOwnOptions: boolean) {
        let localOptions: I18next.TranslationOptions = angular.isDefined(options) ? options : this.initOptions;
        let lng = localOptions.lng || 'auto';

        if (!this.translations[lng]) {
            this.translations[lng] = {};
        }

        if (!this.i18n.t) {
            this.translations[lng][key] = 'defaultValue' in localOptions ? localOptions.defaultValue : key;
        } else if (!this.translations[lng][key] || hasOwnOptions) {
            this.translations[lng][key] = this.i18n.t(key, localOptions);
        }
    }

    changeLanguage(lng: string) {
        if (this.initOptions.lng !== lng && this.i18n.language !== lng) {
            this.initOptions.lng = lng;
            this.i18n.changeLanguage(lng, (err, t) => {
                this.$rootScope.$broadcast('i18nextLanguageChange', this.i18n.language);
            });
        }
    }
}

export default I18nTranslateService;
