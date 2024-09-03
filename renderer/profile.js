let data = JSON.parse(localStorage.getItem("data"));
console.log(data, BASE_URL);
if (data.fname) {
  document.getElementById("fname").value = data.fname;
}
if (data.lname) {
  document.getElementById("lname").value = data.lname;
}
if (data.email) {
  document.getElementById("email").value = data.email;
}



document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

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

    if (document.getElementById('profileForm')) {
        document.getElementById('profileForm').addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent default form submission
        
            // Collect form data
            const formData = new FormData(this);
        
            // Convert form data to JSON
            const data = Object.fromEntries(formData.entries());
        
            // Send data to API using fetch with Bearer token
            fetch(BASE_URL + '/profile/update', { // Use PUT method for updating profile
              method: 'PUT', // Change to PUT request
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include Bearer token in the request header
              },
              body: JSON.stringify(data) // Convert data object to JSON string
            })
              .then(response => response.json())
              .then(result => {
                if (result.status) {
                    localStorage.setItem('data', JSON.stringify(result.data))
                    localStorage.setItem('subscription', JSON.stringify(result.subscription))

                    showModal('Success', result.message); // Show success message

                } else {
                    showModal('Error', result.message); // Show error message
                }
              })
              .catch(error => console.error('Error:', error));
          });
    }
    
    if (document.getElementById('passwordUpdateForm')) {
      document.getElementById('passwordUpdateForm').addEventListener('submit', function (e) {
          e.preventDefault(); // Prevent default form submission
      
          // Collect form data
          const formData = new FormData(this);
      
          // Convert form data to JSON
          const data = Object.fromEntries(formData.entries());
      
          // Send data to API using fetch with Bearer token
          fetch(BASE_URL + '/changepassword/', { // Use PUT method for updating profile
            method: 'POST', // Change to PUT request
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // Include Bearer token in the request header
            },
            body: JSON.stringify(data) // Convert data object to JSON string
          })
            .then(response => response.json())
            .then(result => {
              if (result.status) {
                
                  // localStorage.setItem("token", result.token);
                  showModal('Success', result.message); // Show success message
                  this.reset();
                } else {
                  showModal('Error', result.message); // Show error message
              }
            })
            .catch(error => console.error('Error:', error));
        });
  }
});

function closeModal() {
  // $('#messageModal').modal('close');

}
