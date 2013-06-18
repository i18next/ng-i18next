angular.module('jm.i18next').filter('i18next', function ($parse, $timeout, $i18next) {

	'use strict';

	return function (string) {

		return $i18next(string);

	};

});
