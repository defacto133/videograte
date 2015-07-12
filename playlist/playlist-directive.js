(function () {
	'use strict';

	angular.module('videograte.playlist')

	.directive('playlistWidget', 
		[
			'youTubePlayerVideo',
			'playlistAPI',
			'configs',
			'dialogService',
			playlistWidget
		]
	);

	function playlistWidget(youTubePlayerVideo, playlistAPI, configs, dialogService) {
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
			 templateUrl: 'playlist/playlist-widget.html',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				var playerId = configs.mainPlayerId,
					playlistDialogId = '#playlist-dialog';

				dialogService.init(playlistDialogId);
				
				$scope.videos = [];
				$scope.videoIndex = undefined;

				$scope.enlargePlaylist = enlargePlaylist;
				$scope.playPreviousPlaylistVideo = playPreviousPlaylistVideo;
				$scope.playNextPlaylistVideo = playNextPlaylistVideo;
				$scope.isCurrentVideo = isCurrentVideo;
				$scope.playVideo = playVideo;

				$scope.$watch(function () {
					return playlistAPI.videos;
				}, function (videos) {
					if (videos && videos.length) {
						$scope.videos = videos;
						playVideo(0);
					}
				});

				$scope.$watch(function () {
					return playlistAPI.playlist;
				}, function (playlist) {
					$scope.playlist = playlist;
				});

				$scope.$watch(function () {
					return youTubePlayerVideo.states[playerId];
				}, function (state) {
					var video;
					switch (state) {
						case youTubePlayerVideo.ENDED:
							video = youTubePlayerVideo.videos[playerId];
							if (video.kind === "youtube#playlistItem"
									&& video.id.videoId === $scope.videos[$scope.videoIndex].id.videoId) {
								playNextPlaylistVideo();
							}
							break;
						default:
							break;
					}
				});

				function isCurrentVideo($index) {
					return $scope.videoIndex == $index;
				};

				function enlargePlaylist() {
					dialogService.open(playlistDialogId);
				};

				function playPreviousPlaylistVideo() {
					if ($scope.videoIndex > 0) {
						playVideo($scope.videoIndex - 1);
					}
				}

				function playNextPlaylistVideo() {
					if ($scope.videoIndex < $scope.videos.length - 1) {
						playVideo($scope.videoIndex + 1);
					}
				}

				function playVideo(index) {
					$scope.videoIndex = index;
					playlistAPI.video = $scope.videos[index];
				}
			}
		};
	};
})();