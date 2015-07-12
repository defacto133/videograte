angular.module('videograte',
	[
		'ngRoute',
		'ngSanitize',
		'ngtimeago',

		'videograte.mainview'
	])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/',
		{
			templateUrl: 'mainview/main-view.html',
			controller: 'MainViewCtrl',
			controllerAs: 'mainViewCtrl'
		});
}])

.value('configs', {
	videograteMainContainer: $('#videograte-main-container'),
	width: 800,
	height: 630,

	mainPlayerId: 'main-player'
});