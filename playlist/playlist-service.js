(function () {
	'use strict';

	angular.module('videograte.playlist')

	.factory('playlistAPI',
		[
			'youTubeData',
			playlistAPI
		]);

	function playlistAPI(youTubeData) {
		var videos = [],
			playlist,
			service = {
						videos: videos,
						video: undefined,
						playPlaylist: playPlaylist
					};
		

		return service;

		function playPlaylist(_playlist) {
			if (service.playlist !== _playlist) {
				service.playlist = _playlist;
				youTubeData.getPlaylistVideos(service.playlist)
					.then(function (playlistVideos) {
						service.videos = playlistVideos;
					});
			}
		};
	}
})();