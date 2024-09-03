
let data = JSON.parse(localStorage.getItem("data"));
console.log(data, BASE_URL);

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



    
    if (document.getElementById('hideFileInDefaultImageForm')) {
        document.getElementById('hideFileInDefaultImageForm').addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent default form submission

            // Collect form data using FormData
            const formData = new FormData(this);
            
            // Send data to API using fetch with Bearer token
            fetch(STEG_URL + '/hide_file_in_default_image/', {
                method: 'POST', // Change to POST request for file upload
                headers: {
                    'X-API-KEY': `StegSec10ZEE92ze671209hik288juk81762iilk539e3ZS4EDdq213421123`,
                    'Authorization': `Bearer ${token}` // Include Bearer token in the request header
                },
                body: formData // Directly use FormData
            })
            .then(response => response.blob()) // Process the response as a blob
            .then(blob => {
                // Create a URL for the blob and simulate a click to download it
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'hidden-file'; // Set the desired file name
                document.body.appendChild(a);
                a.click(); // Simulate a click to download the file
                document.body.removeChild(a); // Remove the link element
                window.URL.revokeObjectURL(url); // Clean up the URL object
                goToHidePage()
                showModal('Success', 'File saved successfully!');
            })
            .catch(error => {
                console.error('Error:', error);
                showModal('Error', 'An error occurred. Please try again.');
            });
        });
    }
    
    if (document.getElementById('extractDataFromFileForm')) {
        document.getElementById('extractDataFromFileForm').addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent default form submission

            // Collect form data using FormData
            const formData = new FormData(this);
            let api_selection = document.getElementById('api_selection').value
            console.log(api_selection)
            if (api_selection == 'extract_data_from_image') {
                extractDataFromFile(formData)
            }
            
        });
    }

    function extractDataFromFile(formData) {
        // Send data to API using fetch with Bearer token
        fetch(STEG_URL + '/extract_data_from_image/', {
            method: 'POST', // Change to POST request for file upload
            headers: {
                'X-API-KEY': `StegSec10ZEE92ze671209hik288juk81762iilk539e3ZS4EDdq213421123`,
                'Authorization': `Bearer ${token}` // Include Bearer token in the request header
            },
            body: formData // Directly use FormData
        })
        .then(response => response.blob()) // Process the response as a blob
        .then(blob => {
            console.log(blob)
            // Create a URL for the blob and simulate a click to download it
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'extract-file.png'; // Set the desired file name
            document.body.appendChild(a);
            a.click(); // Simulate a click to download the file
            document.body.removeChild(a); // Remove the link element
            window.URL.revokeObjectURL(url); // Clean up the URL object
            showModal('Success', 'File saved successfully!');
            goToHidePage()
        })
        .catch(error => {
            console.error('Error:', error);
            showModal('Error', 'An error occurred. Please try again.');
        });
    }
});
