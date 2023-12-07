// script.js
const cancelTrip = async (cardId,tripId,driver) => {
  try {
    // Implement cancel trip logic here...
    console.log(`Cancel trip with ID ${tripId}`);
    const elementToRemove = document.getElementById(`card-${cardId}`);
    elementToRemove.remove();
    if (driver == false){
      return fetch('/CancelUserMadeTrip/'+tripId, {
        method: 'DELETE',
      })
      .then(response => response.json())
      .catch((err) => {
        console.log(err);
      });
    } else {
      return fetch('/CancelUserTrip/'+tripId, {
        method: 'DELETE',
      })
      .then(response => response.json())
      .catch((err) => {
        console.log(err);
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const searchTrip = () => {
  // Implement search trip logic here...
  console.log('Search for a trip');
};
  
// function payForTrip(username, driverEmail, driverUsername) {
//   // Construct the URL with the driver's username
//   var paymentUrl = `/payment/${username}/?value=${value}&recipient=${driverEmail}`;

//   // Redirect to the payment page
//   window.location.href = paymentUrl;
// }
function payForTrip(username, driverEmail, value) {
  const paymentUrl = '/payment/' + username;

  // Assuming `value` is a global variable or defined elsewhere
  const requestBody = {
    value: value,
    recipient: driverEmail,
  };

  fetch(paymentUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })
  .then(response => {
    if (response.ok) {
      window.location.href = paymentUrl;
    } else {
      console.error('Failed to fetch payment data:', response.statusText);
    }
  })
  .catch(error => {
    console.error('Error fetching payment data:', error);
  });
}
