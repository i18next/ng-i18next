if (window.i18next) {
	window.i18next
		.use(window.i18nextXHRBackend);

	window.i18next.init({
		lng: 'de', // If not given, i18n will detect the browser language.
		fallbackLng: 'dev', // Default is dev

		backend: {
			loadPath: '../locales/{{lng}}/{{ns}}.json'
		}
	}, function (err, t) {
		console.log('resources loaded');
	});

	window.i18next.on('initialized', function (options) {
		window.i18nextOptions = options;
	});
}


angular.module('jm.i18next').config(function ($i18nextProvider) {
	'use strict';
});

angular.module('MyApp', ['jm.i18next']).controller('MyFilterCtrl', function ($rootScope, $scope, $timeout, $i18next) {

	'use strict';

	$scope.numbers = ['one', 'two', 'three'];

	$scope.bindingVariable = 'helloHTML';

	$scope.date = new Date();

	$scope.clientsTotal = 2;

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
		console.log('Force $digest!');
		$rootScope.$apply();
	});

	$scope.changeLng = function (lng) {
		$i18next.changeLanguage(lng);
	};
});
