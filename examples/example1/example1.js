angular.module('MyApp', ['i18next']).config(function () {


}).run(function ($rootScope) {

	'use strict';

	$rootScope.i18nextOptions = {
		lng: 'de',
		useCookie: false,
		useLocalStorage: false,
		fallbackLng: 'dev',
		resGetPath: '../locales/__lng__/__ns__.json'
	};

});

angular.module('MyApp').controller('MyCtrl', function ($rootScope, $scope) {

	$scope.numbers =  ['one', 'two', 'three', 'four'];

	$scope.hello = "content"
	$scope.helloHTML = "<h3>content</h3>"

	$scope.date = new Date();

	$scope.sayHello = function sayHello() {
		alert('hello');
	};

	window.setTimeout(function () {
		console.log('Time should change!');
		$scope.$apply(function () {
			$scope.date = 'Should change!';
		});
	}, 3000);

});
