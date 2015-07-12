(function () {
	'use strict';

	angular.module('videograte.mainview')

	.directive('tabsWidget',
		[
			'tabsAPI',
			tabsWidget
		]);

	function tabsWidget(tabsAPI) {
		// Runs during compile
		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			scope: {}, // {} = isolate, true = child, false/undefined = no change
			// controller: function($scope, $element, $attrs, $transclude) {},
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			templateUrl: 'mainview/tabs/mainview-tabs.html',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				$scope.activeTab = 'info';

				$scope.isActive = isActive;
				$scope.setActive = setActive;

				$scope.$watch(function () {
					return tabsAPI.tab;
				}, function (tab) {
					setActive(tab);
				});

				function setActive(tab) {
					$scope.activeTab = tab;
					tabsAPI.tab = tab;
				}

				function isActive(tab) {
					return $scope.activeTab === tab;
				}
			}
		};
	}
})();