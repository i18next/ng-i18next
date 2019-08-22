export class I18nBindOnceDirective implements ng.IDirective {
	public restrict: string = 'A';
	public scope: boolean = false;

	public static factory() {
		const directive = ($compile: ng.ICompileService) => new I18nBindOnceDirective($compile);
		directive.$inject = ['$compile'];
		return directive;
	}

	constructor(
		private $compile: ng.ICompileService) { }

	public link: ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: any) => {
		const newElement = element.clone();

		newElement.attr('ng-i18next', '__once__' + attrs.boI18next);
		newElement.removeAttr('bo-i18next');

		element.replaceWith(this.$compile(newElement)(scope));
	}
}
