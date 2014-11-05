angular.module('jm.i18next').filter('i18next', ['$i18next', function ($i18next) {

	'use strict';

	function i18nextFilter(string, options) {

		return $i18next(string, options);

	}

	// https://docs.angularjs.org/guide/filter#stateful-filters
	i18nextFilter.$stateful = true;

	return i18nextFilter;

}]);
