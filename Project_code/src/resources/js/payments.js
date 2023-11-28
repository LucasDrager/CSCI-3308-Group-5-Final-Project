const axios = require('axios');

async function makePayment() {
    const recipientId = document.getElementById('recipientId').value;
    const amount = document.getElementById('amount').value;
    const note = document.getElementById('note').value;
    console.log("HERE");
    try {
        // Make a request to your server to initiate the payment process
        const response = await axios.post('/make-payment', {
            recipientId,
            amount,
            note
        });

        // Handle the response (you might want to redirect or show a success message)
        console.log(response.data);
    } catch (error) {
        // Handle errors (show error message to the user)
        console.error(error.message);
    }
}
