(function(doc, $, undefined){
	var $body = $('body'), $window = $(window);

	$.fn.floatable = function($reference, callableFunction, repin){
		var repin = (repin !== undefined) ? repin : true;
		return this.each(function(){
			var $self = $(this), delay;
			
			if(!$self.data('isFloatable')){
				
				if(repin){
					$self.remove();
					$body.append($self);
				}

				function pinIt(){
					if(!$reference.is(':visible')) return;
					var $referenceOffset = $reference.offset(),
						sw = parseInt($self.width()),
						sh = parseInt($self.height());

					l = //leftMarginCorrection = 
						$window.width() + $window.scrollLeft() - (
							$referenceOffset.left + sw + 15
						);
					t = //topMarginCorrection
						$window.height() + $window.scrollTop() - (
							$referenceOffset.top + $reference.outerHeight() + sh + 15
						);
					$self.css({
						top: (function(){
							return (t >= 0) && $referenceOffset.top+$reference.outerHeight() || $referenceOffset.top - sh -15;
						}),
						left: $referenceOffset.left + (l < 0 && l || 0)
					});
					if($self.is(':visible') && typeof callableFunction === 'function')
						callableFunction();
				}

				function latePinIt () {
					clearTimeout(delay);
					delay = setTimeout(pinIt, 10);
				}
				
				$reference.bind('click', pinIt);
				$window.bind({'resize': pinIt, 'scroll': latePinIt});
				pinIt();

				$self.data('isFloatable', true);
			}
		});
	}
})(document, jQuery);
