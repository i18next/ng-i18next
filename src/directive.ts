/// <reference path="../typings/index.d.ts" />
/// <reference path="./interfaces.ts" />


interface I18nttributes extends ng.IAttributes {
	ngI18next: string;
}

interface I18nController {
	localize: (value: string, watch?: boolean) => string;
}


export class I18nDirective implements ng.IDirective {

	constructor(
		private $interpolate: ng.IInterpolateService) {
	}

	public restrict: string = 'A';
	public scope: boolean = false;
	public controller: string = 'NgI18nextController';
	public link: ng.IDirectiveLinkFn = ($scope: ng.IScope, $element: ng.IAugmentedJQuery, $attrs: I18nttributes, ctrl: I18nController) => {
		let self = this;
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
			if (angular.isDefined(value)) {
				translationValue = value.replace(/^\s+|\s+$/g, ''); // RegEx removes whitespace

				if (translationValue === '') {
					return setupWatcher();
				}

				ctrl.localize(translationValue);
			}
		}

		function setupWatcher() {
			// Prevent from executing this method twice
			if (isTransformed) {
				return;
			}

			// interpolate is allowing to transform {{expr}} into text
			let interpolation = self.$interpolate($element.html());

			$scope.$watch(interpolation, observe);

			isTransformed = true;
		}



	}

	public static factory() {
		let directive = ($interpolate: ng.IInterpolateService) => new I18nDirective($interpolate);
		directive.$inject = ['$interpolate'];
		return directive;
	}

}

