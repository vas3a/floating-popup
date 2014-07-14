do (doc = document, $ = jQuery) ->
	$body = null
	$window = $ window

	position = ->
		{$reference, $self} = this

		return unless $reference.is ':visible'

		offset = $reference.offset()
		self_width  = parseInt $self.width()
		self_height = parseInt $self.height()
		ref_height = parseInt $reference.outerHeight()

		left = $window.width() + $window.scrollLeft() - (offset.left + self_width + 15)
		top  = $window.height() + $window.scrollTop() - (offset.top + ref_height + self_height + 15)

		$self.css
			top: top >= 0 and (offset.top + ref_height) or (offset.top - self_height - 15)
			left: offset.left + Math.min 0, left

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

		return if $self.data 'floatable'

		$body.append $self.remove() if repin
		$reference.bind 'click', _position = position.bind {$reference, $self}
		$window.bind 'resize': _position, 'scroll': _debounce _position
		_position()

		$self.data 'floatable', true