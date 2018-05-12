$(function() {
	// client-side validation
	$('form').submit(function(e) {
		$(this)
			.find('input')
			.each(function() {
				if ((error = user_validate[`${$(this).attr('name')}`]($(this).val()))) {
					swal({ text: error, icon: 'error' })
					e.preventDefault()
				}
			})
	})
})
