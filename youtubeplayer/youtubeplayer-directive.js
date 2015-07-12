(function () {
	'use strict';

	angular.module('videograte.youtubeplayer')

	.directive('youtubePlayerWidget',
		[
			'youTubePlayerVideo',
			youtubePlayerWidget
		]);

	function youtubePlayerWidget(youTubePlayerVideo) {
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
			// templateUrl: '',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				var playerId = iAttrs.playerId,
					player,
					video;

				iElm[0].id = playerId;

				$scope.$watch(function () {
					return youTubePlayerVideo.videos[playerId];
				}, function (_video) {
					if (_video) {
						video = _video;
						player.loadVideoById(video.id.videoId);
					}
				});

				youTubePlayerVideo.onYouTubeIframeAPIReadyDeferred()
					.then(function () {
						player = new YT.Player(playerId, {
							height: '390',
							width: '640',
							events: {
								'onReady': onPlayerReady,
								'onStateChange': onPlayerStateChange
							}
						});
					});

				// 4. The API will call this function when the video player is ready.
				function onPlayerReady(event) {
					//event.target.playVideo();
				}

				// 5. The API calls this function when the player's state changes.
				//    The function indicates that when playing a video (state=1),
				//    the player should play for six seconds and then stop.
				function onPlayerStateChange(event) {
					var videoId;
					//if (event.data == YT.PlayerState.PLAYING && !done) {
					//}
					switch (event.data) {
						case YT.PlayerState.ENDED:
							if (youTubePlayerVideo.loop) {
								player.loadVideoById(video.id.videoId);
							} else {
								$scope.$apply(function () {
									youTubePlayerVideo.states[playerId] = youTubePlayerVideo.ENDED;
								});
							}
							break;
						case YT.PlayerState.PLAYING:
							youTubePlayerVideo.states[playerId] = youTubePlayerVideo.PLAYING;
							break;
						case YT.PlayerState.PAUSED:
							youTubePlayerVideo.states[playerId] = youTubePlayerVideo.PAUSED;
							break;
						case YT.PlayerState.BUFFERING:
							youTubePlayerVideo.states[playerId] = youTubePlayerVideo.BUFFERING;
							break;
						case YT.PlayerState.CUED:
							youTubePlayerVideo.states[playerId] = youTubePlayerVideo.CUED;
							break;
						case YT.PlayerState.UNSTARTED:
							youTubePlayerVideo.states[playerId] = youTubePlayerVideo.UNSTARTED;
							videoId = player.getVideoUrl().match(/.*(?:\/watch\?v=|\/)([^\s&]+)/)[1];
							if ((video.id && videoId !== video.id.videoId)
									|| (video.snippet.resourceId
										&& videoId !== video.snippet.resourceId.videoId)) {
								youTubeData.getVideoData(videoId)
									.then(function (video) {
										if (video) {
											video = video;
											$rootScope.$emit('loadVideoById', video);
										}
									});
							}
							break;
					}
				}

			}
		};
	};
})();