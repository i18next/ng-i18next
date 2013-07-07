angular.module('jm.i18next').config(function ($i18nextProvider) {

	'use strict';

	$i18nextProvider.options = {
		lng: 'de',
		useCookie: false,
		useLocalStorage: false,
		fallbackLng: 'dev',
		resGetPath: '../locales/__lng__/__ns__.json'
	};

});

angular.module('MyApp', ['jm.i18next']).controller('MyProviderCtrl', function ($rootScope, $scope, $i18next) {

	'use strict';

	$scope.hello = '';

	$rootScope.$on('i18nextLanguageChange', function () {

		$scope.$apply(function () {
			$scope.hello = $i18next('hello');
		});

		console.log($scope.hello);

	});

});
