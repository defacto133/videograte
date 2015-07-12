(function () {
	'use strict';

	angular.module('videograte.channel')

	.factory('channelAPI', [channelAPI]);

	function channelAPI() {
		var service = {
			channel: undefined,
			playlist: undefined,
			video: undefined
		};

		return service;
	};
})();