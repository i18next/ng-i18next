angular.module('jm.i18next').directive('ngI18next', ['$i18next', '$compile', '$parse', '$interpolate', '$sanitize', function ($i18next, $compile, $parse, $interpolate, $sanitize) {

	'use strict';

	function parseOptions(options) {

		var res = {
			attr: 'text'
		};

		options = options.split(':');

		for (var i = 0; i < options.length; ++i) {
			if (options[i] === 'i18next') {
				res[options[i]] = true;
			} else {
				res.attr = options[i];
			}
		}

		return res;
	}

	function parseKey(key) {

		var options = {
				attr: 'text'
			},
			i18nOptions = '{}',
			tmp;

		key = key.trim();

		if (key.indexOf('[') === 0) {
			tmp = key.split(']');
			options = parseOptions(tmp.shift().substr(1).trim());
			key = tmp.join(']');
		}

		if (options.i18next && key.indexOf('(') === 0 && key.indexOf(')') >= 0) {
			tmp = key.split(')');
			key = tmp.pop().trim();
			i18nOptions = tmp.join(')').substr(1).trim();
		}

		return {
			key: key,
			options: options,
			i18nOptions: $parse(i18nOptions)
		};
	}

	function I18nextCtrl($scope, $element) {
		var argsUnregister;
		var stringUnregister;

		function parse(key) {
			var parsedKey = parseKey(key);

			// If there are watched values, unregister them
			if (argsUnregister) {
				argsUnregister();
			}
			if (stringUnregister) {
				stringUnregister();
			}

			function render(i18nOptions) {
				if (i18nOptions.sprintf) {
					i18nOptions.postProcess = 'sprintf';
				}

				if (parsedKey.options.attr === 'html') {
					angular.forEach(i18nOptions, function(value, key) {
						i18nOptions[key] = $sanitize(value);
					});
				}

				var string = $i18next(parsedKey.key, i18nOptions);

				if (parsedKey.options.attr === 'html') {
					$element.empty().append(string);

					/*
					 * Now compile the content of the element and bind the variables to
					 * the scope
					 */
					$compile($element.contents())($scope);

					return;
				}

				if (stringUnregister) {
					stringUnregister();
				}

				var insertText = $element.text.bind($element);

				if (parsedKey.options.attr !== 'text') {
					insertText = $element.attr.bind($element, parsedKey.options.attr);
				}

				string = $interpolate(string);
				stringUnregister = $scope.$watch(string, insertText);
				insertText(string($scope));
			}

			argsUnregister = $scope.$watch(parsedKey.i18nOptions, render, true);
			render(parsedKey.i18nOptions($scope));
		}

		this.localize = function localize(key) {
			var keys = key.split(';');

			for (var i = 0; i < keys.length; ++i) {
				key = keys[i].trim();

				if (key === '') {
					continue;
				}

				parse(key);
			}

		};
	}

	return {

		// 'A': only as attribute
		restrict: 'A',

		scope: false,

		controller: ['$scope', '$element', I18nextCtrl],

		require: 'ngI18next',

		link: function postLink(scope, element, attrs, ctrl) {
			var translationValue = '';

			function observe(value) {
				translationValue = value.replace(/^\s+|\s+$/g, ''); // RegEx removes whitespace

				if (translationValue === '') {
					return setupWatcher();
				}

				ctrl.localize(translationValue);
			}

			function setupWatcher() {
				// Prevent from executing this method twice
				if (setupWatcher.done) {
					return;
				}

				// interpolate is allowing to transform {{expr}} into text
				var interpolation = $interpolate(element.html());

				scope.$watch(interpolation, observe);

				setupWatcher.done = true;
			}

			attrs.$observe('ngI18next', observe);

			scope.$on('i18nextLanguageChange', function () {
				ctrl.localize(translationValue);
			});
		}

	};

}]);
