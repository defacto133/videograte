(function () {
	'use strict';

	angular.module('videograte.mainview')

	.factory('tabsAPI', [function(){
		var service = {
			setInfoTabActive: setInfoTabActive,
			setCommentsTabActive: setCommentsTabActive,
			setRelatedTabActive: setRelatedTabActive,
			setPlaylistTabActive: setPlaylistTabActive,
			setChannelTabActive: setChannelTabActive,
			tab: 'info'
		};
		return service;

		function setInfoTabActive() {
			service.tab = 'info';
		}

		function setCommentsTabActive() {
			service.tab = 'comments';
		}

		function setRelatedTabActive() {
			service.tab = 'related';
		}

		function setPlaylistTabActive() {
			service.tab = 'playlist';
		}

		function setChannelTabActive() {
			service.tab = 'channel';
		};
	}]);
})();