export class I18nBindOnceDirective implements ng.IDirective {
	constructor(
		private $compile: ng.ICompileService) { }

	public restrict: string = 'A';
	public scope: boolean = false;
	public link: ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: any) => {
		let newElement = element.clone();

		newElement.attr('ng-i18next', '__once__' + attrs.boI18next);
		newElement.removeAttr('bo-i18next');

		element.replaceWith(this.$compile(newElement)(scope));
	}

	public static factory() {
		let directive = ($compile: ng.ICompileService) => new I18nBindOnceDirective($compile);
		directive.$inject = ['$compile'];
		return directive;

	}
}
