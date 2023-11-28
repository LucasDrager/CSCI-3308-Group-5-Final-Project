// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************
app.set('view engine', 'ejs'); // set the view engine to EJS
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);
app.use('/resources', express.static('resources'));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const user = {
  username: undefined,
  first_name: undefined,
  last_name: undefined,
  email: undefined,
  timestamp: undefined
};

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

app.get("/", (req, res) => {
  res.render("pages/login", { showSignUpPanel: false });
});


//Login Get call
app.get("/login", (req,res) => {
  res.render("pages/login", { showSignUpPanel: false });
});

//Login Get call
app.get("/register", (req,res) => {
  res.render("pages/login", { showSignUpPanel: true });
});


//Login post call
app.post("/login", async (req, res) => {
  try {
    const usernameQuery = `SELECT password FROM users WHERE users.username = $1`;
    const data = await db.one(usernameQuery, [req.body.username]);
    const password = data.password;

    const match = await bcrypt.compare(req.body.password, password);

    if (match) {
      // Authentication successful
      req.session.user = req.body.username;
      req.session.save();
      res.redirect("/homepage"); 
    } else {
      // Authentication failed
      res.render("pages/login", { user, showSignUpPanel: false, error: "Invalid username or password" });
    }
  } catch (err) {
    console.error(err);
    res.render("pages/login", { user, showSignUpPanel: false, error: "An error occurred. Please try again." });

  }
});

//log out get call
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.render("pages/login", { showSignUpPanel: false });
});



//Register post call
app.post("/register", async (req, res) => {
  let hash;

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, passHash) {
      hash = passHash;

      const query = "INSERT INTO users (username, password, first_name, last_name, email, created_at, venmo_id) VALUES ($1, $2, $3, $4, $5, $6, $7);";
      const values = [req.body.username.trim(), hash, req.body.first_name.trim(), req.body.last_name.trim(), req.body.email.trim(), new Date(), req.body.venmo_id.trim()];

      if (err) {
        res.render("pages/login", { showSignUpPanel: true });
      } else {
        db.any(query, values)
          .then((data) => {
            res.redirect("/login");
          })
          .catch((err) => {
            console.log(err);
            res.render("pages/login", { showSignUpPanel: false });
          });
      }
    });
  });
});


// Settings GET API call
app.get("/settings", (req, res) => {
  res.render("pages/settings.ejs")
});

//Settings POST API call
// app.post("/settings", (req, res) => {
//    // To be worked on soon...
// });

// Lab 11 test call
app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

app.get("/homepage", (req, res) => {
  res.render("pages/homepage.ejs")
});
// app.get('/trips', async (req, res) => {
//   try {
//     const trips = await db.getAllTrips();
//     res.json(trips);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// const getAllTrips = async () => {
//   const result = await pool.query('SELECT * FROM trip');
//   return result.rows;
// };

// module.exports = {
//   getAllTrips,
// };


// document.addEventListener('DOMContentLoaded', () => {
//     fetchAndDisplayTrips();
//   });
  
//   const fetchAndDisplayTrips = async () => {
//     try {
//       const response = await fetch('http://localhost:3000/trips');
//       const trips = await response.json();
  
//       const tripsContainer = document.getElementById('trips-container');
//       tripsContainer.innerHTML = '';
  
//       trips.forEach((trip) => {
//         const tripCard = createTripCard(trip);
//         tripsContainer.appendChild(tripCard);
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   };
  
//   const createTripCard = (trip) => {
//     const tripCard = document.createElement('div');
//     tripCard.className = 'trip-card';
  
//     const tripTitle = document.createElement('h3');
//     tripTitle.textContent = trip.destination;
  
//     const fromDate = document.createElement('p');
//     fromDate.innerHTML = `<strong>From:</strong> ${trip.original_location}`;
  
//     // Add other trip details here...
  
//     const cancelButton = document.createElement('button');
//     cancelButton.textContent = 'Cancel Trip';
//     cancelButton.addEventListener('click', () => cancelTrip(trip.trip_id));
  
//     tripCard.appendChild(tripTitle);
//     tripCard.appendChild(fromDate);
//     // Add other trip details here...
  
//     tripCard.appendChild(cancelButton);
  
//     return tripCard;
//   };
  
//   const cancelTrip = async (tripId) => {
//     try {
//       // Implement cancel trip logic here...
//       console.log(`Cancel trip with ID ${tripId}`);
//     } catch (error) {
//       console.error(error);
//     }
//   };
  
//   const searchTrip = () => {
//     // Implement search trip logic here...
//     console.log('Search for a trip');
//   };
  
// Authentication Middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/login');
  }
  next();
};

//Create a trip:

app.post("/trip", (req, res) => {
  const query = "INSERT INTO trip (driverID, destination, original_location) VALUES ($1, $2, $3);";
  db.none(query, [req.body.driverID, req.body.destination, req.body.original_location])
    .then(() => {
      res.json({ status: 'success', message: 'Trip created successfully' });
    })
    .catch(err => {
      console.log(err);
      res.json({ status: 'error', message: 'Failed to create trip' });
    });
});

//Edit trip details:

app.put("/trip/:trip_id", (req, res) => {
  const query = "UPDATE trip SET driverID = $1, destination = $2, original_location = $3 WHERE trip_id = $4;";
  db.none(query, [req.body.driverID, req.body.destination, req.body.original_location, req.params.trip_id])
    .then(() => {
      res.json({ status: 'success', message: 'Trip updated successfully' });
    })
    .catch(err => {
      console.log(err);
      res.json({ status: 'error', message: 'Failed to update trip' });
    });
});


//Add passengers to trip:

app.post("/trip/:trip_id/passenger", (req, res) => {
  const query = "INSERT INTO passengers (trip_id, passenger) VALUES ($1, $2);";
  db.none(query, [req.params.trip_id, req.body.passenger])
    .then(() => {
      res.json({ status: 'success', message: 'Passenger added successfully' });
    })
    .catch(err => {
      console.log(err);
      res.json({ status: 'error', message: 'Failed to add passenger' });
    });
});


app.get("/payments", async (req, res) => {
  const username = req.session.user; // Use req.session.user instead of req.body.user
  if(username == undefined){
    res.render("pages/login", {showSignUpPanel: false, message: "You must login first!"});
    return;
  }


  const query = `
    SELECT DISTINCT t.trip_id, t.driverID, t.destination, t.original_location
    FROM trip t
    INNER JOIN passengers p ON t.trip_id = p.trip_id
    WHERE p.passenger = $1;
  `;

  try {
    const data1 = await db.any(query, username);

    // Extract unique driver IDs
    const uniqueDrivers = [...new Set(data1.map(item => item.driverID))];
    console.log("Unique Drivers:", uniqueDrivers);

    // Create placeholders for the IN clause
    if (uniqueDrivers.length === 0) {
      throw new Error('uniqueDrivers is empty');
    }
    
    const placeholders = uniqueDrivers.map((_, index) => `$${index + 1}`).join(',');
    const query2 = `SELECT * FROM users WHERE username IN (${placeholders})`;
    const params2 = uniqueDrivers;
    
    const data2 = await db.any(query2, params2);

    // Combine data from both queries
    const combinedData = {
      trips: data1,
      driverInfo: data2,
    };

    res.render("pages/payment.ejs", combinedData);
  } catch (error) {
    console.error(error);

    // Provide default data in case of an error
    const combinedData = {
      trips: {},
      driverInfo: {},
    };

    res.render("pages/payment.ejs", combinedData);
  }
});









// app.post('/make-payment', async (req, res) => {
//   const { recipientId, amount, note } = req.body;

//   try {
//       // Simulating authentication and obtaining an access token
//       const accessToken = 'your_venmo_access_token';

//       // Simulating making a payment using the Venmo API
//       const venmoResponse = await axios.post('https://api.venmo.com/v1/payments', {
//           user_id: recipientId,
//           amount,
//           note,
//       }, {
//           headers: {
//               'Authorization': `Bearer ${accessToken}`
//           }
//       });

//       // Handle the response from the Venmo API
//       if (venmoResponse.data && venmoResponse.data.status === 'success') {
//           // Payment successful, proceed with inserting into the transactions table
//           const transactionQuery = `
//               INSERT INTO transactions (sender_id, receiver_id, amount, description, transaction_date)
//               VALUES ($1, $2, $3, $4, $5)
//               RETURNING transaction_id;`;

//           const transactionValues = ['sender_id_placeholder', recipientId, amount, note, new Date()];

//           // Assuming db object is configured for PostgreSQL with pg-promise
//           const transactionResult = await db.one(transactionQuery, transactionValues);

//           // You can access the transaction ID from transactionResult.transaction_id

//           res.json({ status: 'success', message: 'Payment successful!' });
//       } else {
//           // Payment failed
//           res.status(500).json({ status: 'error', message: 'Payment failed.' });
//       }
//   } catch (error) {
//       // Handle errors and send an appropriate response
//       console.error(error.message);
//       res.status(500).json({ status: 'error', message: 'Payment failed.' });
//   }
// });






// Authentication Required
app.use(auth);

  
// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');