(function () {
	'use strict';

	angular.module('videograte.videoinfo')
	.directive('videoInfoWidget',
		[
			'youTubePlayerVideo',
			'configs',
			'videoInfoAPI',
			videoInfoWidget
		]);

	function videoInfoWidget(youTubePlayerVideo, configs, videoInfoAPI) {
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
			templateUrl: 'videoinfo/video-info.html',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				var playerId = configs.mainPlayerId;

				$scope.video = undefined;

				$scope.openChannelFromVideo = openChannelFromVideo;

				$scope.$watch(function () {
					return youTubePlayerVideo.videos[playerId];
				}, function (video) {
					if (video) {
						$scope.video = video;
					}
				});

				function openChannelFromVideo() {
					var channel = {
						id: {channelId: $scope.video.snippet.channelId},
						snippet: {title: $scope.video.snippet.channelTitle}
					}
					videoInfoAPI.channel = channel;
				}
			}
		};
	};
})();