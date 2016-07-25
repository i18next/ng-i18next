/// <reference path="../typings/index.d.ts" />
/// <reference path="./interfaces.ts" />


export interface I18nttributes extends ng.IAttributes {
	ngI18next: string;
}

interface I18nController {
	localize: (value: string, watch?: boolean) => string;
}


export class I18nDirective implements ng.IDirective {

	constructor(
		private $compile: ng.ICompileService,
		private $parse: ng.IParseService,
		private $interpolate: ng.IInterpolateService,
		private $sanitize: ng.sanitize.ISanitizeService) {
	}

	public restrict: string = 'A';
	public scope: boolean = false;
	public controller: string = 'NgI18nextController';
	public link: ng.IDirectiveLinkFn = ($scope: ng.IScope, $element: ng.IAugmentedJQuery, $attrs: I18nttributes, ctrl: I18nController) => {
		let translationValue = '';
		let isTransformed = false;

		translationValue = $attrs.ngI18next.replace(/^\s+|\s+$/g, '');

		if (translationValue.indexOf('__once__') < 0) {

			$attrs.$observe('ngI18next', observe);

		} else {
			// Remove '__once__'
			translationValue = translationValue.split('__once__').join('');

			ctrl.localize(translationValue, true);
		}

		$scope.$on('i18nextLanguageChange', function () {
			ctrl.localize(translationValue);
		});

		function observe(value: any) {
			translationValue = value.replace(/^\s+|\s+$/g, ''); // RegEx removes whitespace

			if (translationValue === '') {
				return setupWatcher();
			}

			ctrl.localize(translationValue);
		}

		function setupWatcher() {
			// Prevent from executing this method twice
			if (isTransformed) {
				return;
			}

			// interpolate is allowing to transform {{expr}} into text
			let interpolation = this.$interpolate($element.html());

			$scope.$watch(interpolation, observe);

			isTransformed = true;
		}



	}

	public static factory() {
		let directive = ($compile: ng.ICompileService, $parse: ng.IParseService, $interpolate: ng.IInterpolateService, $sanitize: ng.sanitize.ISanitizeService) => new I18nDirective($compile, $parse, $interpolate, $sanitize);
		directive.$inject = ['$i18next', '$compile', '$parse', '$interpolate', '$sanitize'];
		return directive;
	}

}

export default I18nDirective;
