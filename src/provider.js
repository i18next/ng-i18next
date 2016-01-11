angular.module('jm.i18next', ['ng', 'ngSanitize']);
angular.module('jm.i18next').provider('$i18next', function () {

	'use strict';

	var self = this,
		/**
		 * This will be our translation function (see code below)
		 */
		t = null,
		translations = {},
		globalOptions = {},
		triesToLoadI18next = 0;

	self.options = globalOptions;

	self.$get = ['$rootScope', '$timeout', '$q', function ($rootScope, $timeout, $q) {

		var i18nDeferred;

		function init(options) {

			if (options.noConflict && window.i18n) {
				window.i18n.noConflict();
			}

			var i18n = self.i18next || window.i18next || window.i18n;

			if (i18n) {

				i18nDeferred = $q.defer();

				i18n.init(options, function (err, localize) {

					translations = {};

					if (typeof(localize) === 'undefined') {
						localize = err;
						err = undefined;
					} else if (!!err && typeof(err) !== 'undefined' && err !== null) {
						console.log('[ng-i18next] i18next error: ' + err);
					}

					t = localize;

					if (!$rootScope.$$phase) {
						$rootScope.$digest();
					}

					$rootScope.$broadcast('i18nextLanguageChange', i18n.lng());

					i18nDeferred.resolve();

				});

				return i18nDeferred.promise;

			} else {

				triesToLoadI18next++;
				// only check 4 times for i18next
				if (triesToLoadI18next < 5) {

					$timeout(function () {
						return init(options);
					}, 400);

				} else {
					throw new Error('[ng-i18next] Can\'t find i18next!');
				}

			}
		}

		function optionsChange(newOptions, oldOptions) {

			t = null;

			$i18nextTranslate.debugMsg.push(['i18next options changed:', oldOptions, newOptions]);

			globalOptions = newOptions;

			return init(globalOptions);

		}

		/**
		 * Translates `key` with given options and puts the translation into `translations`.
		 * @param {Boolean} hasOwnOptions hasOwnOptions means that we are passing options to
		 *                                $i18next so we can't use previous saved translation.
		 */
		function translate(key, options, hasOwnOptions) {

			var lng = options.lng || 'auto';

			if (!translations[lng]) {
				translations[lng] = {};
			}

			if (!t) {

				translations[lng][key] = 'defaultLoadingValue' in options ? options.defaultLoadingValue :
					'defaultValue' in options ? options.defaultValue :
					'defaultLoadingValue' in globalOptions ? globalOptions.defaultLoadingValue : key;

			} else if (!translations[lng][key] || hasOwnOptions) {

				translations[lng][key] = t(key, options);

			}

		}

		function $i18nextTranslate(key, options) {

			var hasOwnOptions = !!options,
				hasOwnNsOption = hasOwnOptions && options.ns,
				hasGlobalNsObj = globalOptions && globalOptions.ns,
				defaultOptions = globalOptions,
				mergedOptions,
				lng;

			// https://github.com/i18next/i18next/blob/e47bdb4d5528c752499b0209d829fde4e1cc96e7/src/i18next.translate.js#L232
			// Because of i18next read namespace from `options.ns`
			if (!hasOwnNsOption && hasGlobalNsObj) {
				defaultOptions = angular.extend({}, globalOptions);
				defaultOptions.ns = defaultOptions.ns.defaultNs;
			}

			mergedOptions = hasOwnOptions ? angular.extend({}, defaultOptions, options) : defaultOptions;

			// https://github.com/i18next/i18next/blob/7af53d5a01cc9942c0edae361bd2f65361e340c9/src/i18next.translate.js#L289
			// lng will be deleted in some case
			lng = mergedOptions.lng;

			translate(key, mergedOptions, hasOwnOptions);

			return !!lng ? translations[lng][key] : translations['auto'][key];

		}

		$i18nextTranslate.debugMsg = [];

		$i18nextTranslate.options = self.options;

		if (self.options !== globalOptions) {
			optionsChange(self.options, globalOptions);
		}

		$i18nextTranslate.reInit = function () {
			return optionsChange(globalOptions, globalOptions);
		};

		$rootScope.$watch(function () { return $i18nextTranslate.options; }, function (newOptions, oldOptions) {
			// Check whether there are new options and whether the new options are different from the old options.
			// Check if globalOptions
			if (!!newOptions && (oldOptions !== newOptions || globalOptions!== newOptions)) {
				optionsChange(newOptions, oldOptions);
			}
		}, true);

		return $i18nextTranslate;

	}];

});
