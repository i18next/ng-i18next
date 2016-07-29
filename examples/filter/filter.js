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

angular.module('MyApp', ['jm.i18next']).controller('MyFilterCtrl', function ($rootScope, $scope, $timeout) {

	'use strict';

	$scope.numbers =  ['one', 'two', 'three'];

	$scope.bindingVariable = 'helloHTML';

	$scope.date = new Date();

	$scope.clientsTotal =  2;

	$scope.increaseClients = function () {
		$scope.clientsTotal++;
	};

	$scope.decreaseClients = function () {
		$scope.clientsTotal--;
	};

	$scope.sayHello = function sayHello() {
		alert('hello');
	};

	$timeout(function () {
		console.log('Time should change!');
		$scope.date = 'Should change!';
	}, 3000);

});
