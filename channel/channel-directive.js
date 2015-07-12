(function () {
	'use strict';

	angular.module('videograte.channel')

	.directive('channelWidget',
		[
			'channelAPI',
			'youTubeData',
			channelWidget
		]);

	function channelWidget(channelAPI, youTubeData) {
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
			templateUrl: 'channel/channel.html',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				$scope.channel = {};
				$scope.channelPlaylists = {};
				$scope.channelTab = 'videos';

				$scope.isActiveTab = isActiveTab;
				$scope.show = show;
				$scope.playPlaylist = playPlaylist;
				$scope.playVideo = playVideo;
				
				$scope.$watch(function () {
					return channelAPI.channel;
				}, function (channel) {
					if (channel) {
						$scope.channelPlaylists = [];
						$scope.channel = channel;
						$scope.channelSubtab = 'Videos';
						youTubeData.getChannelVideos(channel)
							.then(function (videos) {
								$scope.channelVideos = videos;
							});
						youTubeData.getChannelPlaylists(channel)
							.then(function (playlists) {
								$scope.channelPlaylists = playlists;
							});
					}
				});

				function show(tab) {
					$scope.channelTab = tab;
				};

				function isActiveTab(tab) {
					return $scope.channelTab === tab;
				};

				function playPlaylist(playlist) {
					channelAPI.playlist = playlist;
				};

				function playVideo(video) {
					channelAPI.video = video;
				}
			}
		};
	}
})();