(function () {
	'use strict';

	angular.module('videograte.preferences')

	.factory('preferencesAPI', [preferencesAPI]);

	function preferencesAPI() {
		var service = {
						theme: 'default',
						setTheme: setTheme,
						setAsDefaultVideo: setAsDefaultVideo,
						getDefaultVideo: getDefaultVideo
					};

		if (localStorage['defaultTheme']) {
			service.theme = localStorage['defaultTheme'];
		}

		return service;

		function setTheme(theme) {
			localStorage['defaultTheme'] = theme;
		}

		function setAsDefaultVideo(video) {
			// TODO: add storage service
			localStorage['defaultVideo'] = JSON.stringify(video);
		};

		function getDefaultVideo() {
			var video;
			// TODO: add storage service
			video = localStorage['defaultVideo'];
			if (video) {
				video = JSON.parse(video);
			}
			return video;
		}
	};
})();