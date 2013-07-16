(function() {
		// initializes touch and scroll events
		var supportTouch = 'ontouchstart' in document.documentElement,
		touchStartEvent = supportTouch ? "touchstart" : "mousedown",
				touchStopEvent = supportTouch ? "touchend" : "mouseup",
						touchMoveEvent = supportTouch ? "touchmove" : "mousemove";


		/*
		 * Add vertical and horizontal swiping
		 */
		$.event.special.swipe = {

				scrollSuppressionThreshold	:	10,		// If displacement is more than this, then scrolling will be disabled
				durationThreshold			:	1000,	//
				horizontalDistanceThresholdForVerticalSwipe		: 75,	// In case of vertical swipe horizontal displacement should be LESS than this
				verticalDistanceThresholdForVerticalSwipe		: 30,	// In case of vertical swipe vertical displacement should be MORE than this
				horizontalDistanceThresholdForHorizontalSwipe	: 30,	// In case of vertical swipe vertical displacement should be MORE than this
				verticalDistanceThresholdForHorizontalSwipe		: 75,	// In case of vertical swipe vertical displacement should be LESS than this


				setup: function() {
					var thisObject = this;
					var $this = $(thisObject);

					$this.bind(touchStartEvent, function(event) {
						var data = event.originalEvent.touches ?
								event.originalEvent.touches[ 0 ] :
									event,
									start = {
										time: (new Date).getTime(),
										coords: [ data.pageX, data.pageY ],
										origin: $(event.target)
								},
								stop;

								/*
								 * Touch Move 
								 */
								 function moveHandler(event) {
									if (!start) {
										return;
									}

									var data = event.originalEvent.touches ?
											event.originalEvent.touches[ 0 ] :
												event;
											stop = {
													time: (new Date).getTime(),
													coords: [ data.pageX, data.pageY ]
											};

											// prevent scrolling
											if (Math.abs(start.coords[1] - stop.coords[1]) > $.event.special.swipe.scrollSuppressionThreshold ) {
												event.preventDefault();
											}
								 }

								 $this
								 .bind(touchMoveEvent, moveHandler)
								 .one(touchStopEvent, function(event) {
									 $this.unbind(touchMoveEvent, moveHandler);
									 if (start && stop) {

										 if (stop.time - start.time < $.event.special.swipe.durationThreshold ){
											 if ( Math.abs(start.coords[1] - stop.coords[1]) > $.event.special.swipe.verticalDistanceThresholdForVerticalSwipe &&
													 Math.abs(start.coords[0] - stop.coords[0]) < $.event.special.swipe.horizontalDistanceThresholdForVerticalSwipe ) {
												 //Vertical swipe
												 start.origin
												 .trigger("swipe").trigger('swipevertical')
												 .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
											 }else if ( Math.abs(start.coords[0] - stop.coords[0]) > $.event.special.swipe.horizontalDistanceThresholdForHorizontalSwipe &&
													 Math.abs(start.coords[1] - stop.coords[1]) < $.event.special.swipe.verticalDistanceThresholdForHorizontalSwipe ) {
												 //Horizontal swipe
												 start.origin
												 .trigger("swipe").trigger('swipehorizontal')
												 .trigger(start.coords[0] > stop.coords[0] ? "swipeleft" : "swiperight" );
											 }else{
												 // No swipe
												 console.log ( 'Math.abs(start.coords[0] - stop.coords[0]) :' + Math.abs(start.coords[0] - stop.coords[0]) );
												 console.log ( 'Math.abs(start.coords[1] - stop.coords[1]) :' + Math.abs(start.coords[1] - stop.coords[1]) );
											 }
										 }
									 }
									 start = stop = undefined;
								 });
					});
				}
		};



		$.each({
			swipedown		:	"swipe",
			swipeup			: 	"swipe",
			swipeleft		:	"swipe",
			swiperight		:	"swipe",
			swipehorizontal	:	"swipe",
			swipevertical	:	"swipe",
		}, function(event, sourceEvent){
			$.event.special[event] = {
					setup: function(){
						$(this).bind(sourceEvent, $.noop);
					}
			};
		});

	})();
