if (window.i18next) {
	window.i18next
		.use(window.i18nextXHRBackend)
		.use(window.i18nextSprintfPostProcessor);

	window.i18next.use({
		name: 'patrick',
		type: 'postProcessor',
		process: function (value, key, options) {
			//https://www.youtube.com/watch?v=YSzOXtXm8p0
			return 'No, this is Patrick!';
		}
	});

	window.i18next.init({
		lng: 'de', // If not given, i18n will detect the browser language.
		fallbackLng: 'dev', // Default is dev
		backend: {
			loadPath: '../locales/{{lng}}/{{ns}}.json'
		},
		postProcess: 'patrick'
	});
}

angular.module('MyApp', ['jm.i18next']).controller('MyProviderCtrl', function ($rootScope, $scope, $i18next) {

	'use strict';

	$scope.hello = '';

	$rootScope.$on('i18nextLanguageChange', function () {

		$scope.hello = $i18next.t('hello');
		$scope.sprintf = $i18next.t('both.sprintf', { postProcess: 'sprintf', sprintf: ['a', 'b', 'c', 'd'] });

		console.log($scope.hello);

	});

	$scope.togglePatrick = function () {
		$i18next.options.postProcess = $i18next.options.postProcess === ['patrick'] ? [] : ['patrick'];
	};

});
