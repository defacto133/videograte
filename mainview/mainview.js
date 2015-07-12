(function () {
	'use strict';

	angular.module('videograte.mainview',
		[
			'videograte.search',
			'videograte.youtubeplayer',
			'videograte.playlist',
			'videograte.videoinfo',
			'videograte.videocomments',
			'videograte.videorelated',
			'videograte.channel',
			'videograte.youtubedata'
		]);
})();