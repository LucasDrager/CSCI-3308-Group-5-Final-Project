function confirmDelete() {
  const confirmation = document.getElementById('confirmDelete').value;
  const userConfirmed = confirm("Are you sure you want to delete your account? This action is irreversible. Type 'DELETE' to confirm. ");
  if (userConfirmed && confirmation === 'DELETE') {
    return true;
  } else {
    alert("Account deletion canceled.");
    return false;
  }
};
// Function to show a success message and hide it after a few seconds
function showSuccessMessage(message) {
  const successMessageElement = document.getElementById('successMessage');
  successMessageElement.textContent = message;
  successMessageElement.style.display = 'block';

  // Hide the message after 3 seconds (adjust the time as needed)
  setTimeout(() => {
    successMessageElement.textContent = '';
    successMessageElement.style.display = 'none';
  }, 3000);
};

// Function to handle API call success and display a message
function handleAPISuccess(apiName) {
  // Customize messages for each API call as needed
  switch (apiName) {
    case 'changeUsername':
      showSuccessMessage('Username updated successfully');
      break;
    case 'changePassword':
      showSuccessMessage('Password changed successfully');
      break;

    default:
    // Do nothing for unknown API calls
  }
};


document.addEventListener('DOMContentLoaded', () => {
  handleAPISuccess('changeUsername');
});