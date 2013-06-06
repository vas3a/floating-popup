
n(doc, $, undefined){
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
					var $referenceOffset = $reference.offset(),
						sw = parseInt($self.css('width')),
						sh = parseInt($self.css('height'));

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
					
					if(typeof callableFunction === 'function')
						callableFunction();
				}

				function latePinIt (argument) {
					clearTimeout(delay);
					delay = setTimeout(pinIt, 150);
				}
				
				$window.bind({'resize': pinIt, 'scroll': latePinIt});
				pinIt();

				$self.data('isFloatable', true);
			}
		});
	}
})(document, jQuery);
