$(function() {
	// client-side validation
	$('form').submit(function(e) {
		$(this)
			.find('input')
			.each(function() {
				const error = check[`${$(this).attr('name')}`]($(this).val())
				if (error) {
					swal({ text: error, icon: 'error' })
					e.preventDefault()
				}
			})
	})
})
