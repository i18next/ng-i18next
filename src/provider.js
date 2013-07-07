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

	self.$get = function ($rootScope) {

		function init(options) {

			window.i18n.init(options, function (localize) {

				function setTranslation(key) {
					$rootScope.$apply(function () {
						translations[options.lng][key] = localize(key);
					});
				}

				t = localize;

				for (var key in translations) {
					setTranslation(key);
				}

				$rootScope.$broadcast('i18nextLanguageChange');

			});

		}

		function translate(key, options) {

			var lng = options.lng;

			if (!translations[lng]) {
				translations[lng] = {};
			}

			if (!t) {
				translations[lng][key] = key;
			} else {
				translations[lng][key] = t(key, options);
			}

		}

		function $i18nextTanslate(key, options) {

			var mergedOptions = angular.extend({}, optionsObj, options);

			translate(key, mergedOptions);

			return translations[mergedOptions.lng][key];

		}

		$i18nextTanslate.debugMsg = [];

		optionsObj = $i18nextTanslate.options = self.options;

		$rootScope.$watch(function () { return $i18nextTanslate.options; }, function (newOptions, oldOptions) {

			$i18nextTanslate.debugMsg.push('i18next options changed: \n', 'old options', oldOptions, 'new options', newOptions);

			optionsObj = $i18nextTanslate.options;

			if (!optionsObj.lng) {
				optionsObj.lng = 'dev';
			}

			init(optionsObj);

		}, true);

		init(optionsObj);

		return $i18nextTanslate;

	};

});

