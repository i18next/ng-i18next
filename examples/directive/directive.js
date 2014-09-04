angular.module('jm.i18next').config(function ($i18nextProvider) {

	'use strict';

	/*jshint unused:false */
	window.i18n.addPostProcessor('patrick', function (value, key, options) {
		//https://www.youtube.com/watch?v=YSzOXtXm8p0
		return 'No, this is Patrick!';
	});

	window.i18n.addPostProcessor('test', function (value, key, options) {
		return 'PostProcessor is working!';
	});
	/*jshint unused:true */

	$i18nextProvider.options = {
		lng: 'de', // If not given, i18n will detect the browser language.
		fallbackLng: 'dev', // Default is dev
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

	$scope.bindingVariable = $scope.dynamicBindingVariable = 'helloHTML';

	$scope.date = new Date();

	$scope.clientsTotal =  2;

	$scope.increaseClients = function () {
		$scope.clientsTotal++;
	};

	$scope.decreaseClients = function () {
		$scope.clientsTotal--;
	};

	$scope.sayHello = function sayHello() {
		alert($i18next('hello'));
	};

	$scope.changeLng = function (lng) {
		if (lng === 'patrick') {
			$i18next.options.postProcess = 'patrick';
		} else {
			$i18next.options.postProcess = '';
			$i18next.options.lng = lng;
			console.log($i18next.debugMsg[$i18next.debugMsg.length - 1]);
		}
	};

	$timeout(function () {
		console.log('Time should change!');
		$scope.date = 'Should change!';
		$scope.dynamicBindingVariable = 'hello';
	}, 3000);

});
