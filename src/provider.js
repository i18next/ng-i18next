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
						translations[key] = localize(key);
					});
				}

				t = localize;

				for (var key in translations) {
					setTranslation(key);
				}

				$rootScope.$broadcast('i18nextLanguageChange');

			});

		}

		function translate(key) {
			if (!t) {
				translations[key] = key;
			} else {
				translations[key] = t(key);
			}
		}

		function $i18nextTanslate(key) {

			translate(key);

			return translations[key];

		}

		optionsObj = $i18nextTanslate.options = self.options;

		$rootScope.$watch(function () { return $i18nextTanslate.options; }, function (newOptions, oldOptions) {

			console.log('i18next options changed: \n', 'old options', oldOptions, 'new options', newOptions);

			optionsObj = $i18nextTanslate.options;

			init(optionsObj);

		}, true);


		return $i18nextTanslate;

	};

});

