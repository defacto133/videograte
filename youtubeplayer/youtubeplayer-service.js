(function () {
	'use strict';

	angular.module('videograte.youtubeplayer')

	.factory('youTubePlayerVideo',
		[
			'$window',
			'$rootScope',
			'$log',
			'youTubeData',
			'$q',
			youTubePlayerVideo
		]);

	function youTubePlayerVideo($window, $rootScope, $log, youTubeData, $q) {
		var player,
			playerReadyDeferred = $q.defer(),
			states = {},
			videos = {},
			service = {
						loadVideoById: loadVideoById,
						stopVideo: stopVideo,

						loop: false,

						videos: videos,
						states: states,

						toggleLoop: toggleLoop,

						onYouTubeIframeAPIReadyDeferred: onYouTubeIframeAPIReadyDeferred,

						ENDED: 'ended',
						PLAYING: 'playing',
						PAUSED: 'paused',
						BUFFERING: 'buffering',
						CUED: 'cued',
						UNSTARTED: 'unstarted'
					};

		
		$window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

		init();

		return service;

		// 3. This function creates an <iframe> (and YouTube player)
		//    after the API code downloads.
		function onYouTubeIframeAPIReady() {
			playerReadyDeferred.resolve();
		}

		function init() {
			// 2. This code loads the IFrame Player API code asynchronously.
			var tag = document.createElement('script');

			tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		};

		function onYouTubeIframeAPIReadyDeferred() {
			return playerReadyDeferred.promise;
		}

		function stopVideo() {
			//player.stopVideo();
		}

		function loadVideoById(playerId, video) {
			if (video
					&& video.snippet
					&& video.snippet.resourceId
					&& video.snippet.resourceId.videoId) {
				video.id = {};
				video.id.videoId = video.snippet.resourceId.videoId;
			} else if (!video || !video.id || !video.id.videoId) {
				return;
			}
			
			videos[playerId] = video;
		}

		function toggleLoop() {
			service.loop = !service.loop;
			return service.loop;
		}
	}
})();