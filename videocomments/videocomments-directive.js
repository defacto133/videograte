(function () {
	'use strict';

	angular.module('videograte.videocomments')

	.directive('videoCommentsWidget',
		[
			'youTubePlayerVideo',
			'configs',
			'youTubeData',
			videoCommentsWidget
		]);

	function videoCommentsWidget(youTubePlayerVideo, configs, youTubeData){
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
			templateUrl: 'videocomments/video-comments.html',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				var playerId = configs.mainPlayerId;

				$scope.comments = [];

				$scope.$watch(function () {
					return youTubePlayerVideo.videos[playerId];
				}, function (video) {
					if (video) {
						$scope.comments = [];
						youTubeData.getVideoComments(video, 'relevance')
							.then(function (comments) {
								$scope.comments = comments;
							});
					}
				});
			}
		};
	}
})();