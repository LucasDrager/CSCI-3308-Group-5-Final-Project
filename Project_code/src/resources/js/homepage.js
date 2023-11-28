// script.js
const getAllTrips = async () => {
  const result = await pool.query('SELECT * FROM trip');
  return result.rows;
};

// module.exports = {
//   getAllTrips,
// };


document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayTrips();
  });
  
  const fetchAndDisplayTrips = async () => {
    // try {
    //   const response = await fetch('http://localhost:3000/trips');
    //   const trips = await response.json();
  
    //   const tripsContainer = document.getElementById('trips-container');
    //   tripsContainer.innerHTML = '';
  
    //   trips.forEach((trip) => {
    //     const tripCard = createTripCard(trip);
    //     tripsContainer.appendChild(tripCard);
    //   });
    // } catch (error) {
    //   console.error(error);
    // }
  };
  
  const createTripCard = (trip) => {
    // const tripCard = document.createElement('div');
    // tripCard.className = 'trip-card';
  
    // const tripTitle = document.createElement('h3');
    // tripTitle.textContent = trip.destination;
  
    // const fromDate = document.createElement('p');
    // fromDate.innerHTML = `<strong>From:</strong> ${trip.original_location}`;
  
    // // Add other trip details here...
  
    // const cancelButton = document.createElement('button');
    // cancelButton.textContent = 'Cancel Trip';
    // cancelButton.addEventListener('click', () => cancelTrip(trip.trip_id));
  
    // tripCard.appendChild(tripTitle);
    // tripCard.appendChild(fromDate);
    // // Add other trip details here...
  
    // tripCard.appendChild(cancelButton);
  
    // return tripCard;
  };
  
  const cancelTrip = async (cardId,tripId,driver) => {
    try {
      // Implement cancel trip logic here...
      console.log(`Cancel trip with ID ${tripId}`);
      const elementToRemove = document.getElementById(`card-${cardId}`);
      elementToRemove.remove();
      if (driver == false){
        return fetch('/CancelUserTrip/'+tripId, {
          method: 'DELETE',
        })
        .then(response => response.json())
        .catch((err) => {
          console.log(err);
        });
      } else {
        return fetch('/CancelUserMadeTrip/'+tripId, {
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
  