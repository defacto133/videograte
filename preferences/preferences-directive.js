(function () {
	'use strict';

	angular.module('videograte.preferences')

	.directive('preferencesWidget',
		[
			'configs',
			'youTubePlayerVideo',
			'preferencesAPI',
			preferencesWidget
		]
	);

	function preferencesWidget(configs, youTubePlayerVideo, preferencesAPI) {
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
			templateUrl: 'preferences/preferences.html',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				var playerId = configs.mainPlayerId;

				$scope.setDefaultVideo = setDefaultVideo;
				$scope.defaultVideo = undefined;

				$scope.$watch(function () {
					return youTubePlayerVideo.ready[playerId];
				}, function (ready) {
					var defaultVideo;
					if (ready) {
						$scope.defaultVideo = preferencesAPI.getDefaultVideo();
					}
				});


				function setDefaultVideo() {
					var video = youTubePlayerVideo.videos[playerId];
					if (video) {
						$scope.defaultVideo = video;
						preferencesAPI.setAsDefaultVideo(video);
					}
				};
			}
		};
	};
})();