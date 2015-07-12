(function () {
	'use strict';

	angular.module('videograte.videorelated')

	.directive('videoRelatedWidget',
		[
			'configs',
			'youTubePlayerVideo',
			'youTubeData',
			'videoRelatedAPI',
			videoRelatedWidget]);

	function videoRelatedWidget(configs, youTubePlayerVideo, youTubeData, videoRelatedAPI) {
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
			templateUrl: 'videorelated/video-related.html',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				var playerId = configs.mainPlayerId;

				$scope.videos = [];

				$scope.playVideo = playVideo;

				$scope.$watch(function () {
					return youTubePlayerVideo.videos[playerId];
				}, function (video) {
					if (video) {
						$scope.videos = [];
						youTubeData.getRelatedVideos(video)
							.then(function (relatedVideos) {
								$scope.videos = relatedVideos;
							});
					}
				});

				function playVideo(video) {
					videoRelatedAPI.video = video;
				};
			}
		};
	};
})();