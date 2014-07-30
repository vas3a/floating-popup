do (doc = document, $ = jQuery) ->
	$body = null
	$window = $ window

	position = ($reference, $self, _callback) ->
		return unless $reference.is ':visible'

		self_width  = parseInt $self.width()
		self_height = parseInt $self.height()

		offset = $reference.offset()
		ref_height = parseInt $reference.outerHeight()
		ref_width = parseInt $reference.outerWidth()

		left = $window.width() + $window.scrollLeft() - (offset.left + self_width + 15)
		left = offset.left + Math.min 0, left
		left = Math.max left, offset.left + ref_width - self_width

		top  = $window.height() + $window.scrollTop() - (offset.top + ref_height + self_height + 15)
		top  = top >= 0 and (offset.top + ref_height) or (offset.top - self_height - 15)

		$self.css {top, left}

		_callback?() if $self.is ':visible'

	_debounce = (fn, t = 10) -> 
		_delay = null
		-> 
			clearTimeout _delay
			_delay = setTimeout fn, t

	###
	# @param boolean repin - 
	###
	$.fn.floatable = ($reference, _callback, repin = true) -> @each ->
		$self = $ this
		$body or= $ 'body'
		_position = position.bind null, $reference, $self, _callback

		return do _position if $self.data 'floatable'

		$body.append $self.remove() if repin
		$reference.bind 'click', _position
		$window.bind 'resize': _position, 'scroll': _debounce _position
		_position()

		$self.data 'floatable', true