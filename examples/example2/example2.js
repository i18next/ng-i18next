angular.module('jm.i18next').config(function ($i18nextProvider) {
	$i18nextProvider.options = {
		lng: 'de',
		useCookie: false,
		useLocalStorage: false,
		fallbackLng: 'dev',
		resGetPath: '../locales/__lng__/__ns__.json'
	};
});

angular.module('MyApp', ['jm.i18next']).controller('MyCtrl', function ($scope, $timeout) {
	$scope.hello = 'hello';
});
