function logout() {
  localStorage.clear();
  window.location.href = "./login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  // Helper function to show the modal with a message
  function showModal(title, message) {
    if (title === 'Success') {
      document.getElementById('result-icon').src = './../assets/images/done.png';
    }
    else {
      document.getElementById('result-icon').src = './../assets/images/note.png';
    }
      const modalTitle = document.getElementById('messageModalLabel');
      const modalBody = document.getElementById('messageModalMessage');
      modalTitle.textContent = title; // Set the modal title
      modalBody.innerHTML = message; // Set the modal message
      const messageModal = new bootstrap.Modal(document.getElementById('messageModal')); // Initialize the Bootstrap modal
      messageModal.show(); // Show the modal
  }

  if (document.getElementById("loginForm")) {
    document
      .getElementById("loginForm")
      .addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent default form submission

        // Collect form data
        const formData = new FormData(this);

        // Convert form data to JSON
        const data = Object.fromEntries(formData.entries());

        // Send data to API using fetch
        fetch(BASE_URL + "/login/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.status) {
              localStorage.setItem("token", result.token);
              localStorage.setItem("data", JSON.stringify(result.data));
              localStorage.setItem(
                "subscription",
                JSON.stringify(result.subscription)
              );
              // Handle successful login
              showModal("Success", result.message); // Show success message
              document.getElementById("section-page").click();
            } else {
              // Handle login error
              this.reset();
              showModal("Error", result.message); // Show error message
            }
          })
          .catch((error) => console.error("Error:", error));
      });
  }

  if (document.getElementById("signupForm")) {
    document
      .getElementById("signupForm")
      .addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent default form submission

        // Collect form data
        const email = document.getElementById("signupEmail").value;
        const password = document.getElementById("signupPassword").value;
        const password2 = document.getElementById("signupPassword2").value;
        const phone = document.getElementById("signupPhone").value;

        // Create a data object
        const data = {
          email: email,
          password: password,
          password2: password2,
          phone: phone,
        };

        // Send data to API using fetch
        fetch(BASE_URL + "/signup/", {
          // Add trailing slash here
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data), // Convert data object to JSON string
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.status) {
              // Check if status is true
              // Handle successful signup
              showModal("Success", result.message); // Show success message
              this.reset(); // Reset form fields on success
            } else {
              // Handle signup error with specific field errors
              let errorMessage = "Signup failed:<br>";
              if (result.errors) {
                if (result.errors.email) {
                  errorMessage +=
                    "Email: " + result.errors.email.join(", ") + "<br>";
                }
                if (result.errors.password) {
                  errorMessage +=
                    "Password: " + result.errors.password.join(", ") + "<br>";
                }
                if (result.errors.password2) {
                  errorMessage +=
                    "Confirm Password: " +
                    result.errors.password2.join(", ") +
                    "<br>";
                }
                if (result.errors.phone) {
                  errorMessage +=
                    "Phone: " + result.errors.phone.join(", ") + "<br>";
                }
                if (result.errors.non_field_errors) {
                  errorMessage +=
                    "Errors: " + result.errors.phone.join(", ") + "\n";
                }
              }
              showModal("Error", errorMessage); // Show error message
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            showModal("Error", "An error occurred. Please try again."); // Show network error message
            this.reset(); // Reset form fields if there is a fetch error
          });
      });
  }

  if (document.getElementById("passwordResetForm")) {
    document
      .getElementById("passwordResetForm")
      .addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent default form submission

        // Collect form data
        const formData = new FormData(this);

        // Convert form data to JSON
        const data = Object.fromEntries(formData.entries());

        console.log(data);

        // Send data to API using fetch
        fetch(BASE_URL + "/forgotPasswordlinkSend/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.status) {
              console.log(result);
              localStorage.setItem('user_id', result.id)
              document.getElementById("id-token").value = result.id;
              $("#passwordReset").modal("hide");
              $("#passwordResetTokenCheck").modal("show");
              showModal("Success", result.message); // Show success message
            } else {
              // Handle login error
              this.reset();
              showModal("Error", result.message); // Show error message
            }
          })
          .catch((error) => console.error("Error:", error));
      });
  }

  // Handle signup form forgot password

  if (document.getElementById("passwordResetTokenCheckForm")) {
    document
      .getElementById("passwordResetTokenCheckForm")
      .addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent default form submission

        // Collect form data
        const formData = new FormData(this);

        // Convert form data to JSON
        const data = Object.fromEntries(formData.entries());

        // Send data to API using fetch
        fetch(BASE_URL + "/forgettokenCheck/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.status) {
              console.log(result);
              document.getElementById('id_token').value = localStorage.getItem('user_id')
              $("#passwordResetTokenCheck").modal('hide')
              $("#passwordUpdate").modal('show')
            } else {
              // Handle login error
              this.reset();
              showModal("Error", result.message); // Show error message
            }
          })
          .catch((error) => console.error("Error:", error));
      });
  }

  
  if (document.getElementById("passwordUpdateForm")) {
    document
      .getElementById("passwordUpdateForm")
      .addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent default form submission

        // Collect form data
        const formData = new FormData(this);

        // Send data to API using fetch
        fetch(BASE_URL + "/forgetConfirmation/", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.status) {
              console.log(result);
              // document.getElementById('id-value').value = result.id
              showModal("Success", result.message); // Show success message
              changeModal()
            } else {
              // Handle login error
              this.reset();
              showModal("Error", result.message); // Show error message
            }
          })
          .catch((error) => console.error("Error:", error));
      });
  }

// Function to handle Google Sign-In
async function googleSignIn() {
  try {
    // Use the exposed API to invoke the Google OAuth flow
    const accessToken = await window.electron.googleOAuth();
    console.log('Google OAuth Token:', accessToken);

    // Send token to your backend for authentication
    const loginData = {
      email: "tryuddipan@gmail.com", // Example email, get from OAuth or user profile
      id_token: accessToken,
    };

    fetch('https://stegsecbackend.onrender.com/api/login_with_google/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
    .then(res => res.json())
    .then(result => {
      if (result.status) {
        showModal('Success', 'Logged in successfully using Google!');
        localStorage.setItem('token', result.token);
        localStorage.setItem('data', JSON.stringify(result.data));
      } else {
        showModal('Error', result.message || 'Failed to log in using Google.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showModal('Error', 'An error occurred. Please try again.');
    });

  } catch (error) {
    console.error('Google Sign-In Error:', error);
    showModal('Error', 'Google Sign-In failed.');
  }
}

// Bind the click event to your Google Sign-In button
document.getElementById('googleSignInBtn').addEventListener('click', googleSignIn);
  // Bind the click event to your Google Sign-In button
  document.getElementById('googleSignInBtn').addEventListener('click', googleSignIn);
});

function changeModal() {
  $("#passwordReset").modal("hide");
  $("#passwordResetTokenCheck").modal("hide");
  $("#passwordUpdate").modal("hide");
  $("#signUp").modal("hide");
  $("#login").modal("show");
}

function passwordResetModal() {
  $("#login").modal("hide");
  $("#passwordReset").modal("show");
}

function showSignUpModal() {
  $("#passwordReset").modal("hide");
  $("#passwordResetTokenCheck").modal("hide");
  $("#login").modal("hide");
  $("#signUp").modal("show");
}