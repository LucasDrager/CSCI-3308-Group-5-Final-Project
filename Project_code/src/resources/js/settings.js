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


function displayMessage(message, isSuccess = true) {
  const messageContainer = document.getElementById('message-container');

  // Create a new div element for the message
  const messageDiv = document.createElement('div');

  // Set the message text
  messageDiv.innerText = message;

  // Add a CSS class based on success or failure
  messageDiv.className = isSuccess ? 'success-message' : 'error-message';

  // Append the message div to the container
  messageContainer.appendChild(messageDiv);

  // Automatically remove the message after a few seconds (adjust as needed)
  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

function handleChangeUsername() {
  
  displayMessage('Username updated successfully', true);

  return false;
}

function handleChangePassword() {

  displayMessage('Password updated successfully', true);

  return false;
}

function handleDeleteAccount() {

  displayMessage('Account deleted successfully', true);

  return false;
}
