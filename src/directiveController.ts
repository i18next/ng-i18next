/// <reference path="../typings/index.d.ts" />
/// <reference path="./interfaces.ts" />


interface IParsedKey {
    key: string;
    options: any;
    i18nOptions: I18next.TranslationOptions;
}

export class I18nDirectiveController implements Ii18nDirectiveController {
    argsUnregister: any;
    stringUnregister: any;

    static $inject = ['$scope', '$element', '$compile', '$parse', '$interpolate', '$sanitize', '$i18next'];

    constructor(
        private $scope: ng.IScope,
        private $element: ng.IAugmentedJQuery,
        private $compile: ng.ICompileService,
        private $parse: ng.IParseService,
        private $interpolate: ng.IInterpolateService,
        private $sanitize: ng.sanitize.ISanitizeService,
        private $i18next: Ii18nTranslateService) {
    }

    public localize(key: string, noWatch: boolean): void {
        let keys = key.split(';');

        for (let i = 0; i < keys.length; ++i) {
            key = keys[i].trim();

            if (key === '') {
                continue;
            }

            this.parse(key, noWatch);
        }
    };

    private parse(key: string, noWatch: boolean) {
        let parsedKey: IParsedKey = this.parseKey(key);

        // If there are watched values, unregister them
        if (this.argsUnregister) {
            this.argsUnregister();
        }
        if (this.stringUnregister) {
            this.stringUnregister();
        }

        if (!noWatch) {
            this.argsUnregister = this.$scope.$watch(() => {
                return parsedKey.i18nOptions(this.$scope);
            }, () => this.render(parsedKey, noWatch), true);
        }

        this.render(parsedKey, noWatch);
    }

    private parseKey(key: string): IParsedKey {

        let options: any = {
            attr: 'text'
        },
            i18nOptions: string = '{}',
            tmp: any;

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
    }

    private parseOptions(options: string) {

        let res: any = {
            attr: 'text'
        };

        let optionsSplit: string[] = options.split(':');

        for (let i = 0; i < optionsSplit.length; ++i) {
            if (optionsSplit[i] === 'i18next') {
                res[optionsSplit[i]] = true;
            } else {
                res.attr = optionsSplit[i];
            }
        }

        return res;
    }

    private render(parsedKey: any, noWatch: boolean) {
        if (angular.isDefined(this) && angular.isDefined(this.$scope)) {
            let i18nOptions = parsedKey.i18nOptions(this.$scope);

            if (i18nOptions.sprintf) {
                i18nOptions.postProcess = 'sprintf';
            }

            if (parsedKey.options.attr === 'html') {
                angular.forEach(i18nOptions, function (value, key) {
                    let newValue: any = undefined;
                    let sanitized = this.$sanitize(value);
                    let numeric = Number(value);
                    if (typeof numeric === 'number' && !isNaN(numeric)) {
                        newValue = numeric;
                    } else {
                        newValue = sanitized;
                    }
                    i18nOptions[key] = newValue; // jshint ignore:line
                }, this);
            }

            let localizedString = this.$i18next.t(parsedKey.key, i18nOptions);

            if (angular.isDefined(localizedString)) {
                if (parsedKey.options.attr === 'html') {
                    this.$element.empty().append(localizedString);

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

                let insertText = this.$element.text.bind(this.$element);

                if (parsedKey.options.attr !== 'text') {
                    insertText = this.$element.attr.bind(this.$element, parsedKey.options.attr);
                }

                let localizedStringInterpolation = this.$interpolate(localizedString);
                if (!noWatch) {
                    this.stringUnregister = this.$scope.$watch(localizedStringInterpolation, insertText);
                }
                insertText(localizedStringInterpolation(this.$scope));
            }
        }
    }
}

