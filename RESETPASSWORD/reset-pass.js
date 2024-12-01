document.addEventListener("DOMContentLoaded", () => {
  const otpButton = document.getElementById("OTP-btn");
  const emailField = document.getElementById("email");
  const otpContainer = document.getElementById("otp-container");
  const passwordContainer = document.getElementById("password-container");

  let isOtpDisplayed = false; // Ensure OTP field is displayed only once

  otpButton.addEventListener("click", () => {
    // Check if the email field is filled
    if (emailField.value.trim() === "") {
      alert("Please enter your email before proceeding.");
      emailField.focus(); // Highlight the email field
      return;
    }

    // Display OTP field only once
    if (!isOtpDisplayed) {
      const otpField = document.createElement("div");
      otpField.innerHTML = `
        <input type="text" id="otp" placeholder="Enter OTP" required />
        <button type="button" id="verify-otp-btn">Verify OTP</button>
      `;
      otpContainer.appendChild(otpField);
      isOtpDisplayed = true;
      otpButton.style.display = "none";
      const verifyOtpButton = document.getElementById("verify-otp-btn");
      verifyOtpButton.addEventListener("click", () => {
        const otpInput = document.getElementById("otp");
        const enteredOtp = otpInput.value.trim();
       
        // Simulate OTP verification (replace with your actual OTP check)
        const correctOtp = "123456"; // Example correct OTP

        if (enteredOtp === correctOtp) {
          alert("OTP verified successfully!");
          
          // Display elements with the class `after-otp`
          const afterOtpElements = document.querySelectorAll(".after-otp");
          afterOtpElements.forEach((element) => {
            element.style.display = "block";
          });
          otpContainer.style.display = "none";
          // Optionally, hide OTP field after verification
          otpButton.style.display = "none";
        } else {
          alert("Invalid OTP. Please try again.");
          otpInput.focus();
        }
      });
    }
  });
});
