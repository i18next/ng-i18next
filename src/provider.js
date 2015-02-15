angular.module('jm.i18next', ['ng']);
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

	self.$get = ['$rootScope', '$timeout', function ($rootScope, $timeout) {

		function init(options) {

			if (window.i18n) {

				window.i18n.init(options, function (localize) {

					translations = {};

					t = localize;

					if (!$rootScope.$$phase) {
						$rootScope.$digest();
					}

					$rootScope.$broadcast('i18nextLanguageChange', window.i18n.lng());

				});

			} else {

				triesToLoadI18next++;
				// only check 4 times for i18next
				if (triesToLoadI18next < 5) {

					$timeout(function () {
						init(options);
					}, 400);

				} else {
					throw new Error('[ng-i18next] Can\'t find i18next!');
				}

			}
		}

		function optionsChange(newOptions, oldOptions) {

			$i18nextTanslate.debugMsg.push(['i18next options changed:', oldOptions, newOptions]);

			globalOptions = newOptions;

			init(globalOptions);

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

		function $i18nextTanslate(key, options) {

			var hasOwnOptions = !!options,
			    hasOwnNsOption = hasOwnOptions && options.ns,
			    hasGlobalNsObj = globalOptions && globalOptions.ns,
			    defaultOptions = globalOptions,
			    mergedOptions;

			// https://github.com/i18next/i18next/blob/e47bdb4d5528c752499b0209d829fde4e1cc96e7/src/i18next.translate.js#L232
			// Because of i18next read namespace from `options.ns`
			if (!hasOwnNsOption && hasGlobalNsObj) {
				defaultOptions = angular.copy(globalOptions);
				defaultOptions.ns = defaultOptions.ns.defaultNs;
			}

			mergedOptions = hasOwnOptions ? angular.extend({}, defaultOptions, options) : defaultOptions;

			translate(key, mergedOptions, hasOwnOptions);

			return !!mergedOptions.lng ? translations[mergedOptions.lng][key] : translations['auto'][key];

		}

		$i18nextTanslate.debugMsg = [];

		$i18nextTanslate.options = self.options;

		if (self.options !== globalOptions) {
			optionsChange(self.options, globalOptions);
		}

		$i18nextTanslate.reInit = function () {
			optionsChange(globalOptions, globalOptions);
		};

		$rootScope.$watch(function () { return $i18nextTanslate.options; }, function (newOptions, oldOptions) {
			// Check whether there are new options and whether the new options are different from the old options.
			// Check if globalOptions
			if (!!newOptions && (oldOptions !== newOptions || globalOptions!== newOptions)) {
				optionsChange(newOptions, oldOptions);
			}
		}, true);

		return $i18nextTanslate;

	}];

});
