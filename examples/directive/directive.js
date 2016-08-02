
if (window.i18next) {
	window.i18next
		.use(window.i18nextXHRBackend)
		.use(window.i18nextSprintfPostProcessor);

	window.i18next.use({
		name: 'patrick',
		type: 'postProcessor',
		process: function (value, key, options) {
			if (!options.patrick) {
				return value;
			}

			return 'No, this is Patrick!';

		}
	});

	window.i18next.init({
		debug: true,
		lng: 'de', // If not given, i18n will detect the browser language.
		fallbackLng: 'dev', // Default is dev
		backend: {
			loadPath: '../locales/{{lng}}/{{ns}}.json'
		},
		useCookie: false,
		useLocalStorage: false,
		postProcess: ['sprintf', 'patrick']
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

angular.module('MyApp', ['jm.i18next']).controller('MyDirectiveCtrl', function ($rootScope, $scope, $timeout, $i18next, $filter) {

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

	$scope.date = new Date().toString();

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
