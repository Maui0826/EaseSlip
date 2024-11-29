$(document).ready(function() {
    // Handle the form submission
    $('#registration-form').submit(function(e) {
        e.preventDefault(); // Prevent the default form submission

        // Gather form data
        var formData = {
            username: $('#username').val(),
            email: $('#email').val(),
            password: $('#password').val(),
            conPassword: $('#conPassword').val()
        };

        // Send data to PHP script via AJAX
        $.ajax({
            url: 'register.php',  // The PHP file where the data is sent
            type: 'POST',
            data: formData,
            success: function(response) {
                console.log(response);
                // The PHP script should return an error message or success message
                if (response === 'success') {
                    window.location.href = '/LOGIN/login-1.html';  // Redirect on successful registration
                } else {
                    // Display the error message in an alert
                    alert(response);
                }
            }
        });
    });
});