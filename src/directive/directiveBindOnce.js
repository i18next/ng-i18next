angular.module('jm.i18next').directive('boI18next', ['$i18next', '$compile', function ($i18next, $compile) {

	'use strict';

	return {

		// 'A': only as attribute
		restrict: 'A',

		scope: false,

		link: function postLink(scope, element, attrs) {

			var newElement = element.clone();

			newElement.attr('ng-i18next', '__once__' + attrs.boI18next);
			newElement.removeAttr('bo-i18next');

			element.replaceWith($compile(newElement)(scope));

		}

	};

}]);
