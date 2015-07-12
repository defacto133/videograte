(function () {
	'use strict';

	angular.module('videograte.search')

	.factory('searchAPI', [function(){
		var video,
			playlist,
			channel,
			service = {
				selectedVideo: video,
				selectedPlaylist: playlist,
				selectedChannel: channel
			};

		return service;
	}])
})();