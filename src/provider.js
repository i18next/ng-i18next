angular.module('jm.i18next', ['ng']);
angular.module('jm.i18next').provider('$i18next', function () {

	'use strict';

	var self = this,
		/**
		 * This will be our translation function (see code below)
		 */
		t = null,
		translations = {},
		optionsObj;

	self.options = {};

	self.$get = ['$rootScope', function ($rootScope) {

		function init(options) {

			window.i18n.init(options, function (localize) {

				translations = {};

				if (!$rootScope.$$phase) {
					$rootScope.$digest();
				}

				t = localize;

				$rootScope.$broadcast('i18nextLanguageChange');

			});

		}

		/*
		 * hasOwnOptions means that we are passing options to
		 * $i18next so we can't use previous saved translation.
		 */
		function translate(key, options, hasOwnOptions) {

			var lng = options.lng || 'auto';

			if (!translations[lng]) {
				translations[lng] = {};
			}

			if (!t) {
				translations[lng][key] = key;
			} else if (!translations[lng][key] || hasOwnOptions) {
				translations[lng][key] = t(key, options);
			}

		}

		function $i18nextTanslate(key, options) {

			var mergedOptions = options ? angular.extend({}, optionsObj, options) : optionsObj;

			translate(key, mergedOptions, !!options);

			return (options && options.lng) ? translations[options.lng][key] :
				!!optionsObj.lng ? translations[optionsObj.lng][key] : translations['auto'][key];

		}

		$i18nextTanslate.debugMsg = [];

		optionsObj = $i18nextTanslate.options = self.options;

		$rootScope.$watch(function () { return $i18nextTanslate.options; }, function (newOptions, oldOptions) {

			$i18nextTanslate.debugMsg.push('i18next options changed: \n', 'old options', oldOptions, 'new options', newOptions);

			optionsObj = $i18nextTanslate.options;

			init(optionsObj);

		}, true);

		init(optionsObj);

		return $i18nextTanslate;

	}];

});
