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

// Lab 11 test call
app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
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
      const values = [req.body.username, hash, req.body.first_name, req.body.last_name, req.body.email, new Date()];

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
  res.render("pages/settings")
});

<<<<<<< Updated upstream
// Profile Page GET API call
app.get("/profile", (req, res) => {
  res.render("pages/profile")
=======
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Settings API Calls
app.post("/uploadIMG", upload.single("profileImage"), async (req, res) => {
  try {
    const { username } = req.session; // Assuming you store the username in the session
    const imageBuffer = req.file.buffer;

    // Update or insert user profile image
    await db.query(
      "INSERT INTO users (username, profile_img) VALUES ($1, $2) ON CONFLICT (username) DO UPDATE SET profile_img = $2",
      [username, imageBuffer]
    );
      res.render("/settings");
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

app.post("/change_username", async (req, res) => {
  try {
    const { newUsername } = req.body;
    const { username } = req.session; // Use req.session for accessing the current user's username

    // Update the username in the database
    const result = await db.query(
      "UPDATE users SET username = $1 WHERE username = $2 RETURNING *",
      [newUsername, username]
    );

    if (result.length > 0) {
      const updatedUser = result[0];
      // Update the session with the new username
      req.session.username = updatedUser.username;
      res.redirect("/settings");
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error changing username:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/change_password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { username } = req.session;

    // Fetch the user's data from the database
    const userData = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);

    // If the user exists
    if (userData) {
      const passwordMatch = await bcrypt.compare(currentPassword, userData.password);

      // If the current password matches
      if (passwordMatch) {
        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password in the database
        await db.none('UPDATE users SET password = $1 WHERE username = $2', [hashedNewPassword, username]);

        res.redirect("/settings");
      } else {
        res.status(401).json({ success: false, message: 'Current password is incorrect' });
      }
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

//User page get call
app.get("/users", async (req, res) => {
  try {
    // Fetch the user's data from the database
    const userData = await db.any('SELECT * FROM users');
    // If any users exist
    if (userData) {
      res.render("pages/users.ejs", { users : userData });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error finding profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

async function deleteUser(username) {
  try {
    // Delete related data in the friends table
    await db.none('DELETE FROM friends WHERE user_a = $1 OR user_b = $1', [username]);

    // Delete related data in the trip and passengers tables
    await db.none('DELETE FROM passengers WHERE passenger = $1', [username]);
    await db.none('DELETE FROM trip WHERE driverID = $1', [username]);

    // Delete related data in the messaging table
    await db.none('DELETE FROM messaging WHERE sender_id = $1 OR receiver_id = $1', [username]);

    // Delete related data in the transactions table
    await db.none('DELETE FROM transactions WHERE sender_id = $1 OR receiver_id = $1', [username]);

    // Finally, delete the user from the users table
    await db.none('DELETE FROM users WHERE username = $1', [username]);

    console.log(`User ${username} and related data (excluding ratings) deleted successfully`);
  } catch (error) {
    console.error('Error deleting user and related data:', error);
  }
};

app.post("/deletion", async (req, res) => {
  try {
    const { confirmDelete } = req.body;
    const { username } = req.session; // Assuming you store the username in the session

    // Fetch the user's data from the database
    const userData = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);

    // If the user exists
    if (userData) {
      // Check if the confirmation text matches
      if (confirmDelete === 'DELETE') {
        // Perform deletion actions here (excluding ratings)
        await deleteUser(username);

        // Destroy the session after successful deletion
        req.session.destroy();

        // Redirect to the register page after successful deletion
        res.redirect("/register");
      } else {
        res.status(400).json({ success: false, message: 'Confirmation text is incorrect' });
      }
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
// END Settings API Calls

// Profile Page GET API call
app.get("/profile", async (req, res) => {
  try {
    // Fetch the user's data from the database
    const userData = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [req.session.username]);
    // If the user exists
    if (userData) {
      res.render("pages/profile.ejs", { user : userData });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error finding profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
>>>>>>> Stashed changes
});

// Lab 11 test call
app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

app.get("/homepage", (req, res) => {
  const tripData = `SELECT trip.trip_id,trip.driverid,trip.destination,trip.original_location 
  FROM trip INNER JOIN passengers ON trip.trip_id = passengers.trip_id 
  INNER JOIN users ON users.username = passengers.passenger 
  WHERE trip.active = TRUE 
    AND (passengers.passenger != trip.driverid) 
    AND ((passengers.passenger = $1) OR (trip.driverid = $1));`
  db.any(tripData,[req.session.user])
  .then((data) => {
    res.render("pages/homepage.ejs",{'Data':data,'User':req.session.user});
  })
  .catch((err) => {
    console.log(err);
    res.redirect("homepage");
  });
});

app.delete("/CancelUserTrip/:Trip_id", (req,res) => {
  const deleteQuery = "DELETE FROM passengers WHERE trip_id = $1 AND passenger = $2;";
  db.any(deleteQuery,[req.params.Trip_id,req.session.user])
  .then((data) => {
    console.log("Data deleteed successfully");
  })
  .catch((err) => {
    console.log(err);
    res.redirect("homepage");
  });
});

app.delete("/CancelUserMadeTrip/:Trip_id", (req,res) => {
  const deleteQuery = "DELETE FROM passengers WHERE trip_id = $1; DELETE FROM trip WHERE trip_id = $1;";
  db.any(deleteQuery,[req.params.Trip_id])
  .then((data) => {
    console.log("Data deleteed successfully");
  })
  .catch((err) => {
    console.log(err);
    res.redirect("homepage");
  });
});

app.get("/getPassengers/:Trip_id", (req, res) => {
  const passengerData = "SELECT passenger FROM passengers WHERE trip_id = $1"
  db.any(passengerData,[req.params.Trip_id])
  .then((data) => {
    res.data = data
  })
  .catch((err) => {
    console.log(err);
  });
});

app.get("/tripcreate", (req, res) => {
  res.redirect("")
});
  
// Authentication Middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/login');
  } else {
    return res.redirect("/homepage")
  }
  next();
};

//Go to createTrip page
app.get("/createTrip", (req, res) => {
  res.render("pages/createTrip.ejs")
});

//Create a trip:

app.post("/trip", (req, res) => {
  const query = "INSERT INTO trip (driverID, destination, original_location) VALUES ($1, $2, $3);";
  //REMOVE COMMENT. Attempt to use both session variable and variable from page.
  db.none(query, [req.session.user, req.body.destination, req.body.original_location])
    .then(() => {
      // res.json({ status: 'success', message: 'Trip created successfully' });
      console.log('Trip created successfully');
    })
    .catch(err => {
      console.log(err);
      // res.json({ status: 'error', message: 'Failed to update trip' });
    });
});

//Edit trip details:

app.put("/trip/:trip_id", (req, res) => {
  const query = "UPDATE trip SET driverID = $1, destination = $2, original_location = $3 WHERE trip_id = $4;";
  db.none(query, [req.session.user, req.body.destination, req.body.original_location, req.params.trip_id])
    .then(() => {
      // res.json({ status: 'success', message: 'Trip updated successfully' });
      console.log('Trip updated successfully');
    })
    .catch(err => {
      console.log(err);
      // res.json({ status: 'error', message: 'Failed to update trip' });
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

// Get all trips of the logged in user

app.get("/trips", async (req, res) => {
  const query = "SELECT * FROM trip WHERE driverID = $1;";
  try {
    const trips = await db.any(query, [req.session.user]);
    res.json({ status: 'success', data: trips });
  } catch (err) {
    console.log(err);
    res.json({ status: 'error', message: 'Failed to fetch trips' });
  }
});

// Get all passengers of a specific trip

app.get("/trip/:trip_id/passengers", async (req, res) => {
  const query = "SELECT * FROM passengers WHERE trip_id = $1;";
  try {
    const passengers = await db.any(query, [req.params.trip_id]);
    res.json({ status: 'success', data: passengers });
  } catch (err) {
    console.log(err);
    res.json({ status: 'error', message: 'Failed to fetch passengers' });
  }
});

// Delete a trip

app.delete("/trip/:trip_id", async (req, res) => {
  const query = "DELETE FROM trip WHERE trip_id = $1 AND driverID = $2;";
  try {
    await db.none(query, [req.params.trip_id, req.session.user]);
    res.json({ status: 'success', message: 'Trip deleted successfully' });
  } catch (err) {
    console.log(err);
    res.json({ status: 'error', message: 'Failed to delete trip' });
  }
});

// Authentication Required
app.use(auth);
  
// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');
