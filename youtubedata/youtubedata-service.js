(function () {
	'use strict';

	angular.module('videograte.youtubedata')

	.factory('youTubeData', ['$q', youTubeData]);

	function youTubeData($q) {
		var comments,
			relatedVideos,
			playlistVideos,
			searchResults,
			searchObj = {},
			service = {
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

		return service;

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
		};

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
		};

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
		};
	};
})();