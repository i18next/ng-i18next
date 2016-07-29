angular.module('jm.i18next').config(function ($i18nextProvider) {

	'use strict';

	// Tell i18next to use the XHR backend
	$i18nextProvider.use(window.i18nextXHRBackend);

	$i18nextProvider.options = {
		lng: 'de', // If not given, i18n will detect the browser language.
		fallbackLng: 'dev', // Default is dev
		backend: {
			loadPath: '../locales/{{lng}}/{{ns}}.json'
		}
	};

});

angular.module('MyApp', ['jm.i18next']).controller('MyDirectiveCtrl', function ($rootScope, $scope, $timeout, $i18next) {

	'use strict';

	$scope.changeLng = function (lng) {
		$i18next.options.lng = lng;
		console.log('language changed: ' + lng);
	};

});
