angular.module('videograte')

.factory('youTubeData', ['$q', function($q) {
	var comments,
		relatedVideos,
		playlistVideos,
		searchResults;
	var searchObj = {};

	function getRelatedVideos(video) {
		var deferred = $q.defer();

		var request = gapi.client.youtube.search.list({
			relatedToVideoId: video.id.videoId,
			type: 'video',
		    part: 'snippet',
		    maxResults: 25
		  });

		if (relatedVideos && relatedVideos.videoId === video.id.videoId) {
			deferred.resolve(relatedVideos.items);
		} else {
			request.execute(function(response) {
				relatedVideos = response.result;
				relatedVideos.videoId = video.id.videoId;
				deferred.resolve(relatedVideos.items);
			  });
		}

		return deferred.promise;
	};

	function getVideoComments(video, order) {
		var deferred = $q.defer();
		var request;

		if (!video || !video.id) {
			comments = [];
			deferred.resolve([]);
			return deferred.promise;
		}

		request = gapi.client.youtube.commentThreads.list({
			videoId: video.id.videoId,
			order: order,
		    part: 'snippet'
		  });

		if (comments && comments.videoId === video.id.videoId) {
			deferred.resolve(comments.items);
		} else {
			request.execute(function(response) {
				comments = response.result;
				try {
					comments.videoId = video.id.videoId;
					deferred.resolve(comments.items);
				} catch (e) {
					comments = []
					deferred.resolve(comments);
				}
			  });
		}
		return deferred.promise;
	};

	function isEqual(searchObj1, searchObj2) {
		return searchObj1.q === searchObj2.q
			&& searchObj1.type === searchObj2.type
			&& searchObj1.maxResults === searchObj2.maxResults;
	}

	function search(newSearchObj) {
		var deferred = $q.defer();
		var request;

		if (isEqual(newSearchObj, searchObj)) {
			if (searchResults) {
				deferred.resolve(searchResults.items);
			} else {
				deferred.resolve([]);
			}
		} else {
			searchObj = jQuery.extend(true, {}, newSearchObj);

			request = gapi.client.youtube.search.list({
			    q: newSearchObj.q,
			    type: newSearchObj.type,
			    maxResults: newSearchObj.maxResults,
			    part: 'snippet'
			  });

			request.execute(function(response) {
				searchResults = response.result;
				deferred.resolve(response.result.items);
			  });
		}

		return deferred.promise;
	};

	function getPlaylistVideos(playlist, _deferred, pageToken) {
		var deferred = _deferred || $q.defer();
		var params = {
			playlistId: playlist.id.playlistId ? playlist.id.playlistId : playlist.id,
		    part: 'snippet',
		    maxResults: 50
		  };
		var request;

		if (pageToken) {
			params.pageToken = pageToken;
		} else {
			playlistVideos = [];
		}

		request = gapi.client.youtube.playlistItems.list(params);

		request.execute(function(response) {
				playlistVideos = playlistVideos.concat(response.result.items);
				if (response.result.nextPageToken) {
					return getPlaylistVideos(playlist, deferred, response.result.nextPageToken);
				} else {
					deferred.resolve(playlistVideos);
				}
			  });

		return deferred.promise;
	};

	function getNextPlaylistVideo(video) {
		var i,
			nextPlaylistVideo;
		if (!playlistVideos) {
			return undefined;
		}
		for (i = 0; i < playlistVideos.length; i++) {
			if (playlistVideos[i].snippet.resourceId.videoId === video.id.videoId) {
				break;
			}
		}
		if (i < playlistVideos.length - 1) {
			nextPlaylistVideo = playlistVideos[i + 1];
			nextPlaylistVideo.id = {
				videoId: nextPlaylistVideo.snippet.resourceId.videoId
			}
		}
		return nextPlaylistVideo;
	};

	function getPreviousPlaylistVideo(video) {
		var i,
			prevPlaylistVideo;
		if (!playlistVideos) {
			return undefined;
		}
		for (i = 0; i < playlistVideos.length; i++) {
			if (playlistVideos[i].snippet.resourceId.videoId === video.id.videoId) {
				break;
			}
		}
		if (i > 0) {
			prevPlaylistVideo = playlistVideos[i - 1];
		}
		return prevPlaylistVideo;
	};

	function getVideoData(videoId) {
		var deferred = $q.defer(),
			params = {
				id: videoId,
				part: 'snippet'
			},
			request;

		request = gapi.client.youtube.videos.list(params);

		request.execute(function (response) {
			var video;
			if (response.result) {
				video = response.result.items[0];
				if (video) {
					videoId = video.id;
					video.id = {videoId: video.id};
				}
			}
			deferred.resolve(video);
		})

		return deferred.promise;
	};

	function getChannelVideos(channel) {
		var deferred = $q.defer(),
			params = {
				part: 'contentDetails',
				id: channel.id.channelId,
			},
			request;

		request = gapi.client.youtube.channels.list(params);

		request.execute(function (response) {
			if (response.items && response.items[0] && response.items[0].contentDetails
					&& response.items[0].contentDetails.relatedPlaylists
					&& response.items[0].contentDetails.relatedPlaylists.uploads) {
				params = {
					part: 'snippet',
					playlistId: response.items[0].contentDetails.relatedPlaylists.uploads,
					maxResults: 50
				};
				request = gapi.client.youtube.playlistItems.list(params);

				request.execute(function (response) {
					var videos = [];
					if (response.items) {
						videos = response.items;
					}
					deferred.resolve(videos);
				});
			} else {
				deferred.resolve([]);
			}
		});

		return deferred.promise;
	}

	function getChannelPlaylists(channel) {
		var deferred = $q.defer(),
			params = {
				part: 'snippet',
				channelId: channel.id.channelId,
				maxResults: 50
			},
			request;

		request = gapi.client.youtube.playlists.list(params);

		request.execute(function (response) {
			var playlists = [];
			if (response.items) {
				playlists = response.items;
			}
			deferred.resolve(playlists);
		});

		return deferred.promise;
	}

	return {
		search: search,
		getVideoComments: getVideoComments,
		getRelatedVideos: getRelatedVideos,

		getPlaylistVideos: getPlaylistVideos,
		getNextPlaylistVideo: getNextPlaylistVideo,
		getPreviousPlaylistVideo: getPreviousPlaylistVideo,

		getChannelVideos: getChannelVideos,
		getChannelPlaylists: getChannelPlaylists,

		getVideoData: getVideoData
	};
}])

.factory('dialogService', [function(){
	var videograteWidth = 800,
		videograteHeight = 630,
		videograteMainContainer = '#videograte-main-container';

	function init(dialogId) {
		$(dialogId)
			.dialog({
				autoOpen: false,
				appendTo: videograteMainContainer,
				height: 500,
				width: 500,
				maxHeight: videograteHeight - 30,
				maxWidth: videograteWidth - 30,
				position: { my: "center", at: "center", of: $(videograteMainContainer) },
			})
			.parent().draggable({
				containment: false,
	        	opacity: 0.70 
	    	});
	};

	function open(dialogId) {
		$(dialogId).dialog( "open" );
	};

	function isOpen(dialogId) {
		return $(dialogId).dialog( "isOpen" );
	};

	function close(dialogId) {
		$(dialogId).dialog( "close" );
	}

	return {
		init: init,
		open: open,
		close: close	
	};
}])

.factory('youTubePlayerVideo', ['$window', '$rootScope', '$log', 'youTubeData',
	function ($window, $rootScope, $log, youTubeData) {
	var player;
	var loop = false;
	var _video;

	// 3. This function creates an <iframe> (and YouTube player)
	//    after the API code downloads.
	$window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
		player = new YT.Player('player', {
			height: '390',
			width: '640',
			events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
			}
		});
	}

	// 4. The API will call this function when the video player is ready.
	function onPlayerReady(event) {
		//event.target.playVideo();
	}

	// 5. The API calls this function when the player's state changes.
	//    The function indicates that when playing a video (state=1),
	//    the player should play for six seconds and then stop.
	function onPlayerStateChange(event) {
		var videoId;
		//if (event.data == YT.PlayerState.PLAYING && !done) {
		//}
		switch (event.data) {
			case YT.PlayerState.ENDED:
				if (loop) {
					loadVideoById(_video);
				} else {
					$rootScope.$apply(function () {
						$rootScope.$emit('youTubePlayerEnded');
					});
				}
				break;
			case YT.PlayerState.UNSTARTED:
				videoId = player.getVideoUrl().match(/.*(?:\/watch\?v=|\/)([^\s&]+)/)[1];
				if ((_video.id && videoId !== _video.id.videoId)
						|| (_video.snippet.resourceId
							&& videoId !== _video.snippet.resourceId.videoId)) {
					youTubeData.getVideoData(videoId)
						.then(function (video) {
							if (video) {
								_video = video;
								$rootScope.$emit('loadVideoById', video);
							}
						});
				}
				break;
		}
	}

	function stopVideo() {
		//player.stopVideo();
	}

	function init() {
		// 2. This code loads the IFrame Player API code asynchronously.
		var tag = document.createElement('script');

		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	};

	function loadVideoById(video) {
		var videoId;
		if (video.id.videoId) {
			videoId = video.id.videoId;
		} else if (video.snippet.resourceId.videoId) {
			video.id = {};
			video.id.videoId = video.snippet.resourceId.videoId;
		} else {
			return;
		}
		console.log(video.id.videoId);
		_video = video;
		player.loadVideoById(video.id.videoId);
		$rootScope.$emit('loadVideoById', video);
	}

	function toggleLoop() {
		return loop = !loop;
	}

	return {
		init: init,

		loadVideoById: loadVideoById,
		stopVideo: stopVideo,

		toggleLoop: toggleLoop
	};
}])