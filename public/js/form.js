$(function() {
	// client-side validation
	$('form').submit(function(e) {
		$(this)
			.find('input')
			.each(function() {
				const field = `${$(this).attr('name')}`
				if (check.hasOwnProperty(field)) {
					const error = check[field]($(this).val())
					if (error) {
						swal({ text: error, icon: 'error' })
						e.preventDefault()
					}
				}
			})
	})
})
