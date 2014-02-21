angular.module('jm.i18next').config(function ($i18nextProvider) {

	'use strict';

	$i18nextProvider.options = {
		useCookie: false,
		useLocalStorage: false,
		resGetPath: '../locales/__lng__/__ns__.json'
	};

});

angular.module('MyApp', ['jm.i18next']).controller('MyDirectiveCtrl', function ($rootScope, $scope, $timeout, $i18next) {

	'use strict';

	$scope.i18nextReady = false;

	$scope.$on('i18nextLanguageChange', function () {
		console.log('Language has changed!');
		if (!$scope.i18nextReady) {
			$timeout(function () {
				$scope.i18nextReady = true;
			}, 500);
		}
	});

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

	$scope.changeLng = function (lng) {
		$i18next.options.lng = lng;
		console.log($i18next.debugMsg[$i18next.debugMsg.length - 1]);
	};

	$timeout(function () {
		console.log('Time should change!');
		$scope.date = 'Should change!';
	}, 3000);

});
