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
  