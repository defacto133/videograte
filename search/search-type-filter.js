(function () {
	'use strict';

	angular.module('videograte.search')
	
	.filter('formatSearchType', function () {
		return function (input) {
			switch (input) {
				case 'video,channel,playlist':
					return 'All';
				case 'video':
					return 'Video';
				case 'playlist':
					return 'Playlist';
				case 'channel':
					return 'Channel';
			}
		};
	});
})();