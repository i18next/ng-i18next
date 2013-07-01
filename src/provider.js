//hey, we can configure a provider!
// angular.module('i18next').config(function ($i18next) {
// });

angular.module('jm.i18next', ['ng']);
angular.module('jm.i18next').provider('$i18next', function () {

	'use strict';

	var /**
		 * This will be our translation function (see code below)
		 */
		t = null,
		translations = {}
		self = this;

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

				$rootScope.$broadcast('languageChange');

			});

		}

		$rootScope.$watch(self.options, function () {
			console.log(self.options);
			init(self.options);
		});


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

		$i18nextTanslate.changeConfig = function(new_config){
	        self.options = new_config;
	        console.log(self.options);
            init(self.options);
	    };

		return $i18nextTanslate;

	};

});

