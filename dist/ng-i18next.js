(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.ngI18next = factory());
}(this, function () { 'use strict';

    /// <reference path="../typings/index.d.ts" />
    /// <reference path="./interfaces.ts" />
    var I18nTranslateService = (function () {
        function I18nTranslateService($rootScope, $timeout, $q, options, modules) {
            this.$rootScope = $rootScope;
            this.$timeout = $timeout;
            this.$q = $q;
            this.initOptions = {};
            this.tOptions = {};
            this.i18nextModules = [];
            this.translations = {};
            this.i18n = window.i18next;
            this.initOptions = options;
            this.i18nextModules = modules;
            this.init(this.initOptions, this.i18nextModules);
        }
        I18nTranslateService.prototype.init = function (options, modules) {
            var _this = this;
            var i18nDeferred = this.$q.defer();
            if (window.i18next && angular.isDefined(modules)) {
                // assign instance of i18next
                this.i18n = window.i18next;
                // register i18next plugin modules
                angular.forEach(modules, function (i18nextModule) {
                    _this.i18n.use(i18nextModule);
                });
                // initialize i18next
                this.i18n.init(options, function (err, localize) {
                    if (typeof (localize) === 'undefined') {
                        localize = err;
                        err = undefined;
                    }
                    else if (!!err && typeof (err) !== 'undefined' && err !== null) {
                        console.log('[ng-i18next] i18next error: ' + err);
                    }
                    _this.$rootScope.$broadcast('i18nextLanguageChange', _this.i18n.language);
                    i18nDeferred.resolve('ng-i18next initialized');
                });
            }
            else {
                var error = new Error('[ng-i18next] Can\'t find i18next and/or i18next modules! Please refer to i18next.');
                i18nDeferred.reject(error);
            }
            return i18nDeferred.promise;
        };
        I18nTranslateService.prototype.i18nextTranslate = function (key, options) {
            var hasOwnOptions = !!options, hasOwnNsOption = hasOwnOptions && angular.isDefined(options.ns), hasInitNsObj = this.initOptions !== undefined && this.initOptions.ns !== undefined, defaultOptions = this.initOptions, mergedOptions, lng;
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
        };
        I18nTranslateService.prototype.translate = function (key, options, hasOwnOptions) {
            var localOptions = angular.isDefined(options) ? options : this.initOptions;
            var lng = localOptions.lng || 'auto';
            if (!this.translations[lng]) {
                this.translations[lng] = {};
            }
            if (!this.i18n.t) {
                this.translations[lng][key] = 'defaultValue' in localOptions ? localOptions.defaultValue : key;
            }
            else if (!this.translations[lng][key] || hasOwnOptions) {
                this.translations[lng][key] = this.i18n.t(key, localOptions);
            }
        };
        I18nTranslateService.prototype.changeLanguage = function (lng) {
            var _this = this;
            if (this.initOptions.lng !== lng && this.i18n.language !== lng) {
                this.initOptions.lng = lng;
                this.i18n.changeLanguage(lng, function (err, t) {
                    _this.$rootScope.$broadcast('i18nextLanguageChange', _this.i18n.language);
                });
            }
        };
        return I18nTranslateService;
    }());

    /// <reference path="../typings/index.d.ts" />
    /// <reference path="./interfaces.ts" />
    var I18nDirective = (function () {
        function I18nDirective($compile, $parse, $interpolate, $sanitize) {
            this.$compile = $compile;
            this.$parse = $parse;
            this.$interpolate = $interpolate;
            this.$sanitize = $sanitize;
            this.restrict = 'A';
            this.scope = false;
            this.controller = 'NgI18nextController';
            this.link = function ($scope, $element, $attrs, ctrl) {
                var translationValue = '';
                var isTransformed = false;
                translationValue = $attrs.ngI18next.replace(/^\s+|\s+$/g, '');
                if (translationValue.indexOf('__once__') < 0) {
                    $attrs.$observe('ngI18next', observe);
                }
                else {
                    // Remove '__once__'
                    translationValue = translationValue.split('__once__').join('');
                    ctrl.localize(translationValue, true);
                }
                $scope.$on('i18nextLanguageChange', function () {
                    ctrl.localize(translationValue);
                });
                function observe(value) {
                    translationValue = value.replace(/^\s+|\s+$/g, ''); // RegEx removes whitespace
                    if (translationValue === '') {
                        return setupWatcher();
                    }
                    ctrl.localize(translationValue);
                }
                function setupWatcher() {
                    // Prevent from executing this method twice
                    if (isTransformed) {
                        return;
                    }
                    // interpolate is allowing to transform {{expr}} into text
                    var interpolation = this.$interpolate($element.html());
                    $scope.$watch(interpolation, observe);
                    isTransformed = true;
                }
            };
        }
        I18nDirective.factory = function () {
            var directive = function ($compile, $parse, $interpolate, $sanitize) { return new I18nDirective($compile, $parse, $interpolate, $sanitize); };
            directive.$inject = ['$i18next', '$compile', '$parse', '$interpolate', '$sanitize'];
            return directive;
        };
        return I18nDirective;
    }());

    /// <reference path="./interfaces.ts" />
    var I18nBindOnceDirective = (function () {
        function I18nBindOnceDirective($compile) {
            var _this = this;
            this.$compile = $compile;
            this.restrict = 'A';
            this.scope = false;
            this.link = function (scope, element, attrs) {
                var newElement = element.clone();
                newElement.attr('ng-i18next', '__once__' + attrs.boI18next);
                newElement.removeAttr('bo-i18next');
                element.replaceWith(_this.$compile(newElement)(scope));
            };
        }
        I18nBindOnceDirective.factory = function () {
            var directive = function ($compile) { return new I18nBindOnceDirective($compile); };
            directive.$inject = ['$compile'];
            return directive;
        };
        return I18nBindOnceDirective;
    }());

    /// <reference path="../typings/index.d.ts" />
    /// <reference path="./interfaces.ts" />
    var I18nDirectiveController = (function () {
        function I18nDirectiveController($scope, $element, $compile, $parse, $interpolate, $sanitize) {
            this.$scope = $scope;
            this.$element = $element;
            this.$compile = $compile;
            this.$parse = $parse;
            this.$interpolate = $interpolate;
            this.$sanitize = $sanitize;
        }
        I18nDirectiveController.prototype.parseOptions = function (options) {
            var res = {
                attr: 'text'
            };
            var optionsSplit = options.split(':');
            for (var i = 0; i < optionsSplit.length; ++i) {
                if (optionsSplit[i] === 'i18next') {
                    res[optionsSplit[i]] = true;
                }
                else {
                    res.attr = options;
                }
            }
            return res;
        };
        I18nDirectiveController.prototype.parseKey = function (key) {
            var options = {
                attr: 'text'
            }, i18nOptions = '{}', tmp;
            key = key.trim();
            if (key.indexOf('[') === 0) {
                tmp = key.split(']');
                options = this.parseOptions(tmp.shift().substr(1).trim());
                key = tmp.join(']');
            }
            if (key.indexOf('(') === 0 && key.indexOf(')') >= 0) {
                tmp = key.split(')');
                key = tmp.pop().trim();
                i18nOptions = tmp.join(')').substr(1).trim();
            }
            return {
                key: key,
                options: options,
                i18nOptions: this.$parse(i18nOptions)
            };
        };
        I18nDirectiveController.prototype.parse = function (key, noWatch) {
            var parsedKey = this.parseKey(key);
            // If there are watched values, unregister them
            if (this.argsUnregister) {
                this.argsUnregister();
            }
            if (this.stringUnregister) {
                this.stringUnregister();
            }
            if (!noWatch) {
                this.argsUnregister = this.$scope.$watch(parsedKey.i18nOptions, this.render, true);
            }
            this.render(parsedKey, noWatch);
        };
        I18nDirectiveController.prototype.localize = function (key, noWatch) {
            var keys = key.split(';');
            for (var i = 0; i < keys.length; ++i) {
                key = keys[i].trim();
                if (key === '') {
                    continue;
                }
                this.parse(key, noWatch);
            }
        };
        ;
        I18nDirectiveController.prototype.render = function (parsedKey, noWatch) {
            if (angular.isDefined(this.$scope)) {
                var i18nOptions_1 = parsedKey.i18nOptions(this.$scope);
                if (i18nOptions_1.sprintf) {
                    i18nOptions_1.postProcess = 'sprintf';
                }
                if (parsedKey.options.attr === 'html') {
                    angular.forEach(i18nOptions_1, function (value, key) {
                        var sanitized = this.$sanitize(value);
                        var numeric = Number(value);
                        i18nOptions_1[key] = sanitized === numeric ? numeric : sanitized; // jshint ignore:line
                    });
                }
                var localizeString = window.i18next.t(parsedKey.key, i18nOptions_1);
                if (parsedKey.options.attr === 'html') {
                    this.$element.empty().append(localizeString);
                    /*
                     * Now compile the content of the element and bind the variables to
                     * the scope
                     */
                    this.$compile(this.$element.contents())(this.$scope);
                    return;
                }
                if (this.stringUnregister) {
                    this.stringUnregister();
                }
                var insertText = this.$element.text.bind(this.$element);
                if (parsedKey.options.attr !== 'text') {
                    insertText = this.$element.attr.bind(this.$element, parsedKey.options.attr);
                }
                localizeString = this.$interpolate(localizeString);
                if (!noWatch) {
                    this.stringUnregister = this.$scope.$watch(localizeString, insertText);
                }
                insertText(localizeString(this.$scope));
            }
        };
        I18nDirectiveController.$inject = ['$scope', '$element', '$compile', '$parse', '$interpolate', '$sanitize'];
        return I18nDirectiveController;
    }());

    /// <reference path="./interfaces.ts" />
    var I18nFilter = (function () {
        function I18nFilter() {
            this.$stateful = true;
        }
        I18nFilter.factory = function () {
            var filter = function ($i18next) {
                function i18nextFilter(key, options) {
                    var hasOptions = angular.isDefined(options);
                    return $i18next.i18nextTranslate(key, options);
                }
                i18nextFilter.$stateful = true;
                return i18nextFilter;
            };
            filter.$inject = ['$i18next'];
            return filter;
        };
        return I18nFilter;
    }());

    var I18nProvider = (function () {
        function I18nProvider() {
            var _this = this;
            this.options = {};
            this.modules = [];
            this.$get = function ($rootScope, $timeout, $q) {
                return new I18nTranslateService($rootScope, $timeout, $q, _this.options, _this.modules);
            };
            this.$get.$inject = ['$rootScope', '$timeout', '$q'];
        }
        I18nProvider.prototype.init = function (options, i18nextModules) {
            this.options = options;
            this.modules = i18nextModules;
        };
        return I18nProvider;
    }());
    angular.module('jm.i18next', ['ng', 'ngSanitize'])
        .provider('$i18next', I18nProvider)
        .directive('ngI18next', I18nDirective.factory())
        .directive('ngI18nextBindOnce', I18nBindOnceDirective.factory())
        .controller('NgI18nextController', I18nDirectiveController)
        .filter('i18next', I18nFilter.factory());

    return I18nProvider;

}));