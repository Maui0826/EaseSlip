function checkOTP() {
  // Prevent form submission when the button is clicked
  event.preventDefault();

  const emailField = document.getElementById("email");
  const emailValue = emailField.value.trim();
  const afterOtpElements = document.querySelectorAll(".after-otp");
  const otpButton = document.getElementById("OTP-btn");

  // Simple email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailPattern.test(emailValue)) {
    // Email is valid, display after-otp elements
    afterOtpElements.forEach((element) => {
      element.style.display = "block";
    });
    // Hide the OTP button
    otpButton.style.display = "none";
  } else {
    // Email is invalid, display an error message
    alert("Please enter a valid email address.");
    emailField.focus();
  }
}
