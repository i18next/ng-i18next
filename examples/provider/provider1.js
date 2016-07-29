angular.module('jm.i18next').config(function ($i18nextProvider) {

	'use strict';

	/*jshint unused:false */
	window.i18next.use({
		name: 'patrick',
		type: 'postProcessor',
		process: function (value, key, options) {
			//https://www.youtube.com/watch?v=YSzOXtXm8p0
			return 'No, this is Patrick!';
		}
	});
	/*jshint unused:true */

	// Tell i18next to use the XHR backend
	// $i18nextProvider.use(window.i18nextXHRBackend);
	// $i18nextProvider.use(window.i18nextSprintfPostProcessor);

	$i18nextProvider.options = {
		compatibilityAPI: 'v1',
		lng: 'de', // If not given, i18n will detect the browser language.
		fallbackLng: 'dev', // Default is dev
		backend: {
			loadPath: '../locales/{{lng}}/{{ns}}.json'
		}
	};

	$i18nextProvider.modules = [window.i18nextXHRBackend, window.i18nextSprintfPostProcessor];

});

angular.module('MyApp', ['jm.i18next']).controller('MyProviderCtrl', function ($rootScope, $scope, $i18next) {

	'use strict';

	$scope.hello = '';

	$rootScope.$on('i18nextLanguageChange', function () {

			$scope.hello = $i18next.t('hello');
			$scope.sprintf = $i18next.t('both.sprintf', {postProcess: 'sprintf', sprintf: ['a','b','c','d']});

		console.log($scope.hello);

	});

	$scope.togglePatrick = function () {
		$i18next.options.postProcess = $i18next.options.postProcess === 'patrick' ? '' : 'patrick';
	};

});
