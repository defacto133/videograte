angular.module('videograte')

.controller('VideoController', ['youTubeData', 'dialogService', 'youTubePlayerVideo', '$scope', '$timeout',
	function(youTubeData, dialogService, youTubePlayerVideo, $scope, $timeout) {
		var vm = this,
			videoDialogId = '#video-dialog';
		
		// attributes
		vm.searchObj = {
			type: 'video,channel,playlist',
			maxResults: 20,
		};
		vm.videos = [];
		vm.loop = false;

		// functions
		vm.search = search;
		vm.playVideo = playVideo;
		vm.playPlaylist = playPlaylist;
		vm.setSearchType = setSearchType;
		vm.toggleLoop = toggleLoop;
		vm.openChannel = openChannel;
		vm.openChannelFromVideo = openChannelFromVideo;

		$timeout(function () {
			dialogService.init(videoDialogId);
			youTubePlayerVideo.init();
		}, 0);

		// function definitions ---------------------
		function openChannelFromVideo(video, evt) {
			var channel = {
				id: {channelId: video.snippet.channelId},
				snippet: {title: video.snippet.channelTitle}
			}
			openChannel(channel);
			evt.stopPropagation();
		}

		function openChannel(channel) {
			dialogService.close(videoDialogId);
			$scope.$broadcast('openChannel', channel);
		}

		function toggleLoop() {
			vm.loop = youTubePlayerVideo.toggleLoop();
		}

		function setSearchType(type) {
			vm.searchObj.type = type;
		}

		function search() {
			youTubeData.search(vm.searchObj)
				.then(function (videos) {
					vm.videos = videos;
					dialogService.open(videoDialogId);
				});
		};

		function playVideo(video) {
			dialogService.close(videoDialogId);
			youTubePlayerVideo.loadVideoById(video);
		}

		function playPlaylist(playlist) {
			dialogService.close(videoDialogId);
			$scope.$broadcast('playPlaylist', playlist);
		}
		// end function definitions -----------------
	}
])

.controller('VideoDetailTabsCtrl',
		['$rootScope', 'youTubeData', '$scope', 'youTubePlayerVideo', 'dialogService', '$timeout',
	function ($rootScope, youTubeData, $scope, youTubePlayerVideo, dialogService, $timeout) {
		var vm = this;
		var playlistDialogId = '#playlist-dialog';

		vm.playlistVideos = [];
		vm.activeTab = 'info';
		vm.video = {};
		vm.channel = {};
		vm.comments = [];
		vm.relatedVideos = [];
		vm.channelSubtab = '';
		vm.channelVideos = [];
		vm.channelPlaylists = undefined;

		vm.isInfoActive = isInfoActive;
		vm.setActive = setActive;
		vm.playPlaylist = playPlaylist;
		vm.playNextPlaylistVideo = playNextPlaylistVideo;
		vm.playPreviousPlaylistVideo = playPreviousPlaylistVideo;
		vm.enlargePlaylist = enlargePlaylist;
		vm.setChannelTab = setChannelTab;
		vm.openChannelFromVideo = openChannelFromVideo;

		$timeout(function () {
			dialogService.init(playlistDialogId);
		}, 0);

		function openChannelFromVideo(video) {
			var channel = {
				id: {channelId: video.snippet.channelId},
				snippet: {title: video.snippet.channelTitle}
			}
			openChannel(channel);
		}

		function setChannelTab(channelTab) {
			vm.channelSubtab = channelTab;
			switch (channelTab) {
				case 'Videos':
					break;
				case 'Playlists':
					if (!vm.channelPlaylists) {
						youTubeData.getChannelPlaylists(vm.channel)
							.then(function (playlists) {
									vm.channelPlaylists = playlists;
								});
					}
					break
			}
		}

		function enlargePlaylist() {
			dialogService.open(playlistDialogId);
		}

		function playPreviousPlaylistVideo() {
			var prevPlaylistVideo;
			prevPlaylistVideo = youTubeData.getPreviousPlaylistVideo(vm.video);

			if (prevPlaylistVideo) {
				youTubePlayerVideo.loadVideoById(prevPlaylistVideo);
			}
		}

		function playNextPlaylistVideo() {
			var nextPlaylistVideo;
			nextPlaylistVideo = youTubeData.getNextPlaylistVideo(vm.video)

			if (nextPlaylistVideo) {
				youTubePlayerVideo.loadVideoById(nextPlaylistVideo);
			}
		}

		function isInfoActive() {
			return true;
		}

		function setActive(tab) {
			if (vm.activeTab !== tab) {
				vm.activeTab = tab;
				updateActiveTab(vm.video);
			}
		}

		function updateActiveTab(video) {
			switch (vm.activeTab) {
				case 'info':
					break;
				case 'comments':
					vm.comments = [];
					youTubeData.getVideoComments(video, 'relevance')
						.then(function (comments) {
							vm.comments = comments;
						});
					break;
				case 'related':
					vm.relatedVideos = [];
					youTubeData.getRelatedVideos(video)
						.then(function (relatedVideos) {
							vm.relatedVideos = relatedVideos;
						});
					break;
				case 'playlist':
					break;
				case 'channel':
					break;
			}
		}

		function playPlaylist(playlist) {
			setActive('playlist');
			youTubeData.getPlaylistVideos(playlist)
				.then(function (playlistVideos) {
					vm.playlistVideos = playlistVideos;
					if (playlistVideos.length) {
						youTubePlayerVideo.loadVideoById(playlistVideos[0]);
					}
				});
		}

		function openChannel(channel) {
			setActive('channel');
			vm.channelPlaylists = undefined;
			vm.channel = channel;
			vm.channelSubtab = 'Videos';
			youTubeData.getChannelVideos(channel)
				.then(function (videos) {
					vm.channelVideos = videos;
				});
		};

		$scope.$on('openChannel', function (evt, channel) {
			openChannel(channel);
		});

		$scope.$on('playPlaylist', function (evt, playlist) {
			playPlaylist(playlist);
		});

		$rootScope.$on('youTubePlayerEnded', function () {
			playNextPlaylistVideo();
		});

		$rootScope.$on('loadVideoById', function (evt, video) {
			vm.video = video;
			console.log(vm.video.id.videoId);
			if (video.kind !== 'youtube#playlistItem') {
				vm.playlistVideos = [];
			}
			updateActiveTab(video);
		});
	}
])