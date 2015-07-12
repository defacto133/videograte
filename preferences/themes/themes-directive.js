(function () {
	'use strict';

	angular.module('videograte.preferences')

	.directive('themesWidget',
		[
			'preferencesAPI',
			themesWidget
		]
	);

	function themesWidget(preferencesAPI) {
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
			templateUrl: 'preferences/themes/themes.html',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				var themesheetBoot = $('<link href="css/default/bootstrap.min.css" rel="stylesheet" />'),
					themesheetApp = $('<link href="css/default/app.css" rel="stylesheet" />');
			    themesheetBoot.appendTo('head');
			    themesheetApp.appendTo('head');

			    $scope.setTheme = setTheme;

			    $scope.$watch(function () {
			    	return preferencesAPI.theme;
			    }, function (theme) {
			    	setTheme(theme);
			    });

			    function setTheme(theme) {
			    	$scope.theme = theme;
			        themesheetBoot.attr('href', 'css/' + theme + '/bootstrap.min.css');
			        themesheetApp.attr('href', 'css/' + theme + '/app.css');
			        preferencesAPI.setTheme(theme);
			    };
			}
		};
	};
})();