angular.module('jm.i18next').config(function ($i18nextProvider) {

	'use strict';

	// Use form
	$i18nextProvider
		.use(window.i18nextXHRBackend)
		.use(window.i18nextSprintfPostProcessor);

	// Modules array property
	// $i18nextProvider.modules = [window.i18nextXHRBackend, window.i18nextSprintfPostProcessor];

	// Options property
	$i18nextProvider.options = {
		lng: 'de', // If not given, i18n will detect the browser language.
		fallbackLng: 'dev', // Default is dev
		backend: {
			loadPath: '../locales/{{lng}}/{{ns}}.json'
		},
		useCookie: false,
		useLocalStorage: false,
		postProcess: 'sprintf'
	};

	// Calling init method

	// $i18nextProvider.init({
	// 	lng: 'de', // If not given, i18n will detect the browser language.
	// 	fallbackLng: 'dev', // Default is dev
	// 	backend: {
	// 		loadPath: '../locales/{{lng}}/{{ns}}.json'
	// 	},
	// 	useCookie: false,
	// 	useLocalStorage: false,
	// 	postProcess: 'sprintf'
	// }, [window.i18nextXHRBackend, window.i18nextSprintfPostProcessor]);

	// /*jshint unused:false */
	// window.i18next.addPostProcessor('patrick', function (value, key, options) {
	// 	//https://www.youtube.com/watch?v=YSzOXtXm8p0
	// 	return 'No, this is Patrick!';
	// });

	// window.i18next.addPostProcessor('test', function (value, key, options) {
	// 	return 'PostProcessor is working!';
	// });
	// /*jshint unused:true */
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

	$scope.numbers = ['one', 'two', 'three'];

	$scope.bindingVariable = $scope.dynamicBindingVariable = 'helloHTML';

	$scope.date = new Date();

	$scope.clientsTotal = 2;

	$scope.increaseClients = function () {
		$scope.clientsTotal++;
	};

	$scope.decreaseClients = function () {
		$scope.clientsTotal--;
	};

	$scope.sayHello = function sayHello() {
		alert($i18next.t('hello'));
	};

	$scope.changeLng = function (lng) {
		$i18next.changeLanguage(lng);
	};

	$timeout(function () {
		console.log('Time should change!');
		$scope.date = 'Should change! ' + new Date();
		$scope.dynamicBindingVariable = 'hello';
	}, 3000);

});
