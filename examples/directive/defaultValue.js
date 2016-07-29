angular.module('jm.i18next').config(function ($i18nextProvider) {

	'use strict';

	// Tell i18next to use the XHR backend
	$i18nextProvider.use(window.i18nextXHRBackend);

	$i18nextProvider.options = {
		compatibilityAPI: 'v1',
		lng: 'de', // If not given, i18n will detect the browser language.
		fallbackLng: 'dev', // Default is dev
		backend: {
			loadPath: '../locales/{{lng}}/{{ns}}.json'
		}
	};

	$i18nextProvider.modules = [ window.i18nextXHRBackend ]
});

angular.module('MyApp', ['jm.i18next']).controller('MyDirectiveCtrl', function ($rootScope, $scope, $timeout, $i18next) {

	'use strict';

	$scope.changeLng = function (lng) {
		$i18next.options.lng = lng;
		console.log($i18next.debugMsg[$i18next.debugMsg.length - 1]);
	};

});
