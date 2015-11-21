/**
 * Watcher leaks for jQuery
 * RubaXa <trash@rubaxa.org>
 * MIT Licensed.
 *
 * API:
 * 	$.leaks.get();
 * 	$.leaks.watch();
 * 	$.leaks.unwatch();
 * 	$.leaks.remove();
 */
(function ($){
	"use strict";

	var
		  timeoutId
		, expando = $.expando
		, console = window.console
		// Events, that can lead to changes in DOM
		, events = 'mousedown mouseup keyup keypress DOMNodeRemoved DOMNodeInserted'.split(' ').join('.leaks ')+'.leaks'
		, count = 0 // previous
	;


	function _get(){
		var cache = $.cache; // Get jQuery cache
		var leaked = [];  // Leaked DOM elements

		for( var id in cache ){
			var item = cache[id][expando] || cache[id];

			if( item && item.handle ){
				var el = item.handle.elem; // Get DOM Element

				// Check parents
				if( el.nodeType == 1 && !_inDOM(el) ){
					leaked.push(el);
				}
			}
		}

		return	leaked;
	}


	function _watch(){
		var n = _get().length, txt = 'jQuery leaks: ' + n;
		if( n && count !== n && console ){
			if( console.warn ){
				console.warn(txt);
			} else if( console.info ){
				console.info(txt);
			} else {
				console.log('[WARN]', txt);
			}
		}
		count = n;
	}


	function _inDOM(el){
		do {
			if( el === document.body ){
				return	true;
			}
		} while( el = el.parentNode );

		return	false;
	}


	// @export
	$.leaks = $.extend({
		delay: 3000,

		/**
		 * Start to monitor leakage
		 */
		watch: function (){
			$(document).bind(events, function (){
				clearTimeout(timeoutId);
				timeoutId = setTimeout(_watch, $.leaks.delay);
			});
		},

		/**
		 * Stop to monitor leakage
		 */
		unwatch: function (){
			$(document).unbind('.leaks');
		},

		/**
		 * Get leaked DOM elements
		 * @return {Array}
		 */
		get: function (){
			return	_get();
		},

		/**
		 * Remove leak
		 */
		remove: function (){
			$.cleanData(_get());
		}
	}, $.leaks);
})(jQuery);
