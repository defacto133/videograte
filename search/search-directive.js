(function () {
	'use strict';

	angular.module('videograte.search')

	.directive('searchWidget',
		[
			'youTubeData',
			'dialogService',
			'$timeout',
			'searchAPI',
			searchWidget]);

	function searchWidget(youTubeData, dialogService, $timeout, searchAPI) {
		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			scope: {}, // {} = isolate, true = child, false/undefined = no change
			// controller: function($scope, $element, $attrs, $transclude) {},
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			templateUrl: 'search/search-widget.html',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				var videoDialogId = '#video-dialog';

				$scope.searchObj = {
					type: 'video,channel,playlist',
					maxResults: 20,
				};

				$scope.search = search;
				$scope.setSearchType = setSearchType;
				$scope.playVideo = playVideo;
				$scope.playPlaylist = playPlaylist;
				$scope.openChannelFromVideo = openChannelFromVideo;
				$scope.openChannel = openChannel;

				dialogService.init(videoDialogId);

				function search() {
					youTubeData.search($scope.searchObj)
						.then(function (items) {
							$scope.items = items;
							dialogService.open(videoDialogId);
						});
				};

				function setSearchType(type) {
					$scope.searchObj.type = type;
				};

				function playVideo(video) {
					dialogService.close(videoDialogId);
					searchAPI.selectedVideo = video;
				};

				function playPlaylist(playlist) {
					dialogService.close(videoDialogId);
					searchAPI.selectedPlaylist = playlist;
				};

				function openChannelFromVideo(video, evt) {
					var channel = {
						id: {channelId: video.snippet.channelId},
						snippet: {title: video.snippet.channelTitle}
					}
					openChannel(channel);
					evt.stopPropagation();
				};

				function openChannel(channel) {
					dialogService.close(videoDialogId);
					searchAPI.selectedChannel = channel;
				};
			}
		}
	};
})();