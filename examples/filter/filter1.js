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

angular.module('MyApp', ['jm.i18next']).controller('MyFilterCtrl', function ($rootScope, $scope, $timeout) {

	'use strict';

	$scope.numbers =  ['one', 'two', 'three'];

	$scope.bindingVariable = 'helloHTML';

	$scope.date = new Date();

	$scope.sayHello = function sayHello() {
		alert('hello');
	};

	$timeout(function () {
		console.log('Time should change!');
		$scope.date = 'Should change!';
	}, 3000);

});
