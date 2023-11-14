function confirmDelete(){
    const confirmation = document.getElementById('confirmDelete').value;
    const userConfirmed = confirm("Are you sure you want to delete your account? This action is irreversible. Type 'DELETE' to confirm. ");
    if(userConfirmed && confirmation === 'DELETE'){
        return true;
    } else {
        alert("Account deletion canceled.");
        return false;
    }
}