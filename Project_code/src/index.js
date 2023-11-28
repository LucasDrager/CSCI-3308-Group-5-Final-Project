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



const { JSDOM } = require("jsdom");

// Create a virtual DOM
const dom = new JSDOM();

// Extract the document object
const document = dom.window.document;



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
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM is fully loaded');

  // Select all elements in the DOM
  var allElements = document.querySelectorAll('*');
  console.log('Total number of elements:', allElements.length);
  console.log('All elements:', allElements);
  
  // Iterate through the elements and log their IDs
  allElements.forEach(function(element) {
    console.log(element.id);
  });

  // document.getElementById("messagingLink").addEventListener("click", function (event) {
  //   event.preventDefault(); 
  //   window.location.href = "/messaging/:user_id"; 
  //   console.log("happening");
  // });

});

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

      const query = "INSERT INTO users (username, password, first_name, last_name, email, created_at) VALUES ($1, $2, $3, $4, $5, $6);";
      const values = [req.body.username.trim(), hash, req.body.first_name.trim(), req.body.last_name.trim(), req.body.email.trim(), new Date()];

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

app.get("/messaging", (req,res) =>{
  res.redirect(`/messaging/${req.session.user}`);
});


app.get("/get_messages/:conversation_id", (req, res) => {
  const conversationId = req.params.conversation_id;

  const query = "SELECT * FROM messaging WHERE conversation_id = $1;";
  db.manyOrNone(query, [conversationId])
    .then((messages) => {
      res.json({ status: 'success', messages: messages || [] });
    })
    .catch((err) => {
      console.log(err);
      res.json({ status: 'error', message: 'Failed to retrieve messages' });
    });
});

app.get("/messaging/:user_id", (req, res) => {
  const userId = req.session.user;

  const query = "SELECT * FROM conversations WHERE $1 = ANY(participants);";
  db.manyOrNone(query, [userId])
    .then((conversations) => {
      res.json({ status: 'success', conversations: conversations || [] });
    })
    .catch((err) => {
      console.log(err);
      res.json({ status: 'error', message: 'Failed to retrieve conversations' });
    });
});

app.post("/create_conversation", (req, res) => {
  const participants = [req.session.user, req.body.receiver_id];
  
  const conversationCheckQuery = "SELECT conversation_id FROM conversations WHERE participants = $1;";
  db.oneOrNone(conversationCheckQuery, [participants])
    .then((existingConversation) => {
      if (existingConversation) {
        res.json({ status: 'success', message: 'Conversation already exists', conversation_id: existingConversation.conversation_id });
      } else {
        const insertConversationQuery = "INSERT INTO conversations (participants) VALUES ($1) RETURNING conversation_id;";
        return db.one(insertConversationQuery, [participants]);
      }
    })
    .then((result) => {
      const conversationId = result.conversation_id;


      res.json({ status: 'success', message: 'Conversation created successfully', conversation_id: conversationId });
    })
    .catch((err) => {
      console.log(err);
      res.json({ status: 'error', message: 'Failed to create conversation' });
    });
});

app.post("/send_message/:conversation_id", (req, res) => {
  const conversationId = req.params.conversation_id;
  const { sender_id, message_text } = req.body;

  const insertMessageQuery = "INSERT INTO messaging (conversation_id, sender_id, message_text) VALUES ($1, $2, $3) RETURNING message_id;";
  db.one(insertMessageQuery, [conversationId, sender_id, message_text])
    .then((result) => {
      const messageId = result.message_id;

      res.json({ status: 'success', message: 'Message sent successfully', message_id: messageId });
    })
    .catch((err) => {
      console.log(err);
      res.json({ status: 'error', message: 'Failed to send message' });
    });
});



// Authentication Required
app.use(auth);

  
// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');