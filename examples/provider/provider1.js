angular.module('jm.i18next').config(function ($i18nextProvider) {

	'use strict';

	window.i18n.addPostProcessor('patrick', function (value, key, options) {
		//https://www.youtube.com/watch?v=YSzOXtXm8p0
		return 'No, this is Patrick!';
	});

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
			$scope.sprintf = $i18next('both.sprintf', { postProcess: 'sprintf', sprintf:['a','b','c','d']});
		});

		console.log($scope.hello);

	});

	$scope.togglePatrick = function () {
		$i18next.options.postProcess = $i18next.options.postProcess == 'patrick' ? '' : 'patrick';
	};

});
