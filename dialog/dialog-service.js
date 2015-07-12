(function () {
	'use strict';
	
	angular.module('videograte.dialog')

	.factory('dialogService', ['configs', dialogService]);

	function dialogService(configs){
		var videograteWidth = configs.width,
			videograteHeight = configs.height,
			videograteMainContainer = configs.videograteMainContainer,
			service = {
						init: init,
						open: open,
						close: close	
					};

		return service;

		function init(dialogId) {
			$(dialogId)
				.dialog({
					autoOpen: false,
					appendTo: videograteMainContainer,
					height: 500,
					width: 500,
					maxHeight: videograteHeight - 30,
					maxWidth: videograteWidth - 30,
					position: { my: "center", at: "center", of: videograteMainContainer },
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
	}
})();