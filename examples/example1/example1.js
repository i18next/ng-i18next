angular.module('jm.i18next').config(function ($i18nextProvider) {
	$i18nextProvider.options = {
		lng: 'de',
		useCookie: false,
		useLocalStorage: false,
		fallbackLng: 'dev',
		resGetPath: '../locales/__lng__/__ns__.json'
	};
});

angular.module('MyApp', ['jm.i18next']).controller('MyCtrl', function ($rootScope, $scope, $timeout) {

	$scope.numbers =  ['one', 'two', 'three', 'four'];

	$scope.hello = "content"
	$scope.helloHTML = "<h2>content</h2>"

	$scope.date = new Date();

	$scope.sayHello = function sayHello() {
		alert('hello');
	};

	$timeout(function () {
		console.log('Time should change!');
		$scope.date = 'Should change!';
	}, 3000);

});
