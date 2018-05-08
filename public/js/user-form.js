$(function() {
    // client-side validation
    $('form').submit(function(e) {
        $(this).find('input').each(function() {
            if (error = user[`validate${_.capitalize($(this).attr('name'))}`]($(this).val())) {
                swal(error)
                e.preventDefault()
            }
        })
    })
})