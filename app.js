angular.module('videograte',
	[
		'ngRoute',
		'ngSanitize',
		'ngtimeago'
	])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/',
		{
			templateUrl: 'videos/videos.html',
			controller: 'VideoController',
			controllerAs: 'videoCtrl'
		});
}])

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