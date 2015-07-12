(function () {
	'use strict';

	angular.module('videograte.mainview')

	.controller('MainViewCtrl',
		[
			'youTubePlayerVideo',
			'$scope',
			'configs',
			'searchAPI',
			'playlistAPI',
			'channelAPI',
			'videoRelatedAPI',
			'videoInfoAPI',
			'tabsAPI',
		function(youTubePlayerVideo, $scope, configs,
				searchAPI, playlistAPI, channelAPI, videoRelatedAPI, videoInfoAPI, tabsAPI) {
			var vm = this;
			
			// attributes
			vm.videos = [];
			vm.loop = false;
			vm.playerId = configs.mainPlayerId;

			// functions
			vm.toggleLoop = toggleLoop;

			// search API
			$scope.$watch(function() {
			    return searchAPI.selectedVideo;
			}, function (video) {
				if (video) {
				    playVideo(video);
				}
			});

			$scope.$watch(function() {
			    return searchAPI.selectedPlaylist;
			}, function (playlist) {
				if (playlist) {
				    playPlaylist(playlist);
				}
			});

			$scope.$watch(function() {
			    return searchAPI.selectedChannel;
			}, function (channel) {
				if (channel) {
				    openChannel(channel);
				}
			});

			// playlist API
			$scope.$watch(function() {
			    return playlistAPI.video;
			}, function (video) {
				if (video) {
				    playVideo(video);
				}
			});

			// channel API
			$scope.$watch(function () {
				return channelAPI.playlist;
			}, function (playlist) {
				if (playlist) {
					playPlaylist(playlist);
				}
			});

			$scope.$watch(function () {
				return channelAPI.video;
			}, function (video) {
				if (video) {
					playVideo(video);
				}
			});

			// related Videos API
			$scope.$watch(function () {
				return videoRelatedAPI.video;
			}, function (video) {
				playVideo(video);
			});

			// video Info API
			$scope.$watch(function () {
				return videoInfoAPI.channel;
			}, function (channel) {
				if (channel) {
					openChannel(channel);
				}
			});

			// function definitions ---------------------
			function openChannel(channel) {
				tabsAPI.setChannelTabActive();
				channelAPI.channel = channel;
				videoInfoAPI.channel = channel;
				searchAPI.selectedChannel = channel;
			}

			function playVideo(video) {
				youTubePlayerVideo.loadVideoById(vm.playerId, video);
				videoRelatedAPI.video = video;
				channelAPI.video = video;
				searchAPI.selectedVideo = video;
				playlistAPI.video = video;
			};

			function playPlaylist(playlist) {
				tabsAPI.setPlaylistTabActive();
				playlistAPI.playPlaylist(playlist);
				searchAPI.selectedPlaylist = playlist;
				channelAPI.playlist = playlist;
			};

			function toggleLoop() {
				vm.loop = youTubePlayerVideo.toggleLoop();
			};
			// end function definitions -----------------
		}
	]);
})();