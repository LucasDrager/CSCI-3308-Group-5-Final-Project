// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store. 
const bcrypt = require('bcrypt'); //  To hash passwords
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

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
const secretKey = 'yourSecretKey'; 

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

const storage = multer.memoryStorage(); // Store files in memory NEEDED for uploadIMG api
const upload = multer({ storage: storage });
app.use(cookieParser());

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

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

// Lab 11 test call
app.get('/welcome', (req, res) => {
  res.json({ status: 'success', message: 'Welcome!' });
});

app.get("/", (req, res) => {
  const authToken = req.cookies.authtoken;
  if (authToken) {
    return res.redirect("/homepage");
  }
  res.render("pages/login", { showSignUpPanel: false });
});

//Login Get call
app.get("/login", (req, res) => {
  if (req.query.message) {
    res.render("pages/login", { showSignUpPanel: false, message: req.query.message });
    return;
  }
  res.render("pages/login", { showSignUpPanel: false });
});

//Login Get call
app.get("/register", (req, res) => {
  res.render("pages/login", { showSignUpPanel: true });
});
 
 app.get("/username", async (req, res) => {
  await db.oneOrNone('SELECT * FROM users WHERE username = $1', [req.params.username]);
  res.json({ status: 'success', data: userData });
 });
 app.get("/messageLoad", async (req, res) => {
  res.render("pages/messaging.ejs");
 });
 
 app.post('/messages1', async (req, res) => {
 
   const { chats_id, sender, message_text,reciever,sent_at } = req.body;
   
   // SQL query to insert the message into the database

   const query = `INSERT INTO messages (chats_id, sender, message_text,reciever,sent_at) VALUES ('${chats_id}', '${req.session.username}', '${message_text}','${reciever}','${sent_at}');`
   // Execute the query
   await db.any(query).then((data) => {
    // res.redirect("/messages");
   })
 });
 
 // Route to fetch messages for a specific chat
 app.get("/messages/1", async (req, res) => {
   //console.log('fetched response');
 
   
   
 
 
 
   const messageData = `SELECT * FROM messages WHERE messages.chats_id = 1;`;
   await db.any(messageData,[req.session.user])
   .then((messageData) => {
 
     res.json(messageData);
    // return res.status(200);
   })
   .catch((err) => {
     console.log(err);
     res.status(500).json({ error: 'Internal Server Error' });
     //console.log('fetched response 3');
    // res.redirect("/messages");
   });
 });

  // Route to fetch messages for a specific chat
  app.get("/messages/2", async (req, res) => {
    //console.log('fetched response');
  
  
    
  
  
  
    const messageData = `SELECT * FROM messages WHERE messages.chats_id = 2;`;
    await db.any(messageData,[req.session.user])
    .then((messageData) => {
  
      console.log(messageData);
      res.json(messageData);
     // return res.status(200);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
      //console.log('fetched response 3');
     // res.redirect("/messages");
    });
  });
  
  app.get("/messages/3", async (req, res) => {
    //console.log('fetched response');
  
    const chatID = req.query.chats_id;
  
    console.log(chatID);
    
  
  
  
    const messageData = `SELECT * FROM messages WHERE messages.chats_id = 3;`;
    await db.any(messageData,[req.session.user])
    .then((messageData) => {
  
      res.json(messageData);
     // return res.status(200);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
      //console.log('fetched response 3');
     // res.redirect("/messages");
    });
  });

  app.get("/messages/4", async (req, res) => {
    //console.log('fetched response');
  
    const chatID = req.query.chats_id;
  
    
  
  
  
    const messageData = `SELECT * FROM messages WHERE messages.chats_id = 4;`;
    await db.any(messageData,[req.session.user])
    .then((messageData) => {
  
      console.log(messageData);
      res.json(messageData);
     // return res.status(200);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
      //console.log('fetched response 3');
     // res.redirect("/messages");
    });
  });

  app.get("/messages/5", async (req, res) => {
    //console.log('fetched response');
  
    const chatID = req.query.chats_id;
  
    
  
  
  
    const messageData = `SELECT * FROM messages WHERE messages.chats_id = 5;`;
    await db.any(messageData,[req.session.user])
    .then((messageData) => {
  
      res.json(messageData);
     // return res.status(200);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
      //console.log('fetched response 3');
     // res.redirect("/messages");
    });
  });

  app.get("/messages/6", async (req, res) => {
    //console.log('fetched response');
  
    const chatID = req.query.chats_id;
  
    
  
  
  
    const messageData = `SELECT * FROM messages WHERE messages.chats_id = 6;`;
    await db.any(messageData,[req.session.user])
    .then((messageData) => {
  
      res.json(messageData);
     // return res.status(200);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
      //console.log('fetched response 3');
     // res.redirect("/messages");
    });
  });

  app.get("/messages/7", async (req, res) => {
    //console.log('fetched response');
  
    const chatID = req.query.chats_id;
  
    
  
  
  
    const messageData = `SELECT * FROM messages WHERE messages.chats_id = 7;`;
    await db.any(messageData,[req.session.user])
    .then((messageData) => {
  
      res.json(messageData);
     // return res.status(200);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
      //console.log('fetched response 3');
     // res.redirect("/messages");
    });
  });

  app.get("/messages/8", async (req, res) => {
    //console.log('fetched response');
  
    const chatID = req.query.chats_id;
  
    
  
  
  
    const messageData = `SELECT * FROM messages WHERE messages.chats_id = 8;`;
    await db.any(messageData,[req.session.user])
    .then((messageData) => {
  
      res.json(messageData);
     // return res.status(200);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
      //console.log('fetched response 3');
     // res.redirect("/messages");
    });
  });

  app.get("/messages/9", async (req, res) => {
    //console.log('fetched response');
  
    const chatID = req.query.chats_id;
  
    
  
  
  
    const messageData = `SELECT * FROM messages WHERE messages.chats_id = 9;`;
    await db.any(messageData,[req.session.user])
    .then((messageData) => {
  
      res.json(messageData);
     // return res.status(200);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
      //console.log('fetched response 3');
     // res.redirect("/messages");
    });
  });
 
 

//Login post call

app.post("/login", async (req, res) => {
  try {
    const usernameQuery = `SELECT * FROM users WHERE users.username = $1`;
    const data = await db.one(usernameQuery, [req.body.username]);
    const password = data.password;
    const match = await bcrypt.compare(req.body.password, password);

    if (match) {
      // Authentication successful
      const tokenPayload = {
        username: req.body.username,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        keepSignedIn: req.body.keepSignedIn,
      };

      const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '1h' }); // Set your own secret key and expiration time
      res.cookie('authtoken', token, { httpOnly: true });

      req.session.keepSignedIn = req.body.keepSignedIn;

      res.redirect("/homepage");
    } else {
      // Authentication failed
      res.render("pages/login", {showSignUpPanel: false, message: "Invalid password" });
    }
  } catch (err) {
    console.error(err);
    res.render("pages/login", { showSignUpPanel: false, message: "User does not exist" });
  }
});


//Register post call
app.post("/register", async (req, res) => {
  let hash;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, passHash) {
      hash = passHash;

      const query = "INSERT INTO users (username, password, first_name, last_name, email, created_at, trips_taken) VALUES ($1, $2, $3, $4, $5, $6, 0);";
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

app.get('/keep-signed-in', (req, res) => {
  const token = req.cookies.authtoken;

  if (!token) {
    return res.json({ keepSignedIn: false });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    res.json({ keepSignedIn: decoded.keepSignedIn });
  } catch (error) {
    res.json({ keepSignedIn: false });
  }
});

const verifyToken = (req, res, next) => {
  const token = req.cookies.authtoken;

  if (!token) {
    return res.redirect('/login?message=Please%20log%20in%20to%20access%20this%20page');
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.redirect('/login?message=Invalid%20token');
    }

    req.session.username = decoded.username;
    req.session.first_name = decoded.first_name;
    req.session.last_name = decoded.last_name;
    req.session.email = decoded.email;
    req.session.save();
    next();
  });
};

app.use(verifyToken);

// const auth = (req, res, next) => {
//   if (!req.session.username) {
//     // Default to login page.
//     return res.redirect('/login?message=Please%20log%20in%20to%20access%20this%20page');
//   }
//   next();
// };

// app.use(auth);

//log out get call
app.get("/logout", (req, res) => {
  res.clearCookie('authtoken');
  req.session.destroy();
  res.render("pages/login", { showSignUpPanel: false });
});

app.get("/chats", async (req, res) => {
  // const chatsData = `SELECT * FROM chats WHERE chats.user1 = ${req.session.user};`;
  const chatsData2 = `SELECT * FROM chats WHERE chats.user2 = 'a';`;


  await db.any(chatsData2, [req.session.username])
    .then((chatsData2) => {
      res.json(chatsData2);
      // return res.status(200);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
      //console.log('fetched response 3');
      // res.redirect("/messages");
    });



});

app.get("/messageLoad", async (req, res) => {

  res.render("pages/messaging.ejs");
}


);

app.post('/messages1', async (req, res) => {
  console.log(req.body);
  const { chats_id, sender, message_text } = req.body;

  console.log('fetched response 100');
  console.log('fetched response');
  // SQL query to insert the message into the database
  const query = `INSERT INTO messages (chatID, sender, message_text) VALUES ('${chats_id}', '${sender}', '${message_text}');`
  // Execute the query
  console.log('fetched response 123');
  await db.any(query).then((data) => {
    console.log('fetched response 1234');
    console.log(data);
    console.log('fetched response 12345');
    res.redirect("/messages");
  }).catch((err) => {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
    console.log('fetched response 3');
    res.redirect("/messages");
  });
});

// Route to fetch messages for a specific chat
app.get("/messages", async (req, res) => {
  //console.log('fetched response');

  const chatID = req.query.chats_id;

  console.log('fetched response 1000');
  console.log(chatID);




  const messageData = `SELECT * FROM messages WHERE messages.chatid = $1;`;
  console.log('fetched response 1');
  await db.any(messageData, [req.session.username])
    .then((messageData) => {
      console.log('fetched response 2');

      console.log(messageData);
      console.log('fetched response 3');
      res.json(messageData);
      // return res.status(200);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
      //console.log('fetched response 3');
      // res.redirect("/messages");
    });
});

app.get("/chats", async (req, res) => {

  // const chatsData = `SELECT * FROM chats WHERE chats.user1 = ${req.session.user};`;
  const chatsData2 = `SELECT * FROM chats WHERE chats.user2 = 'a';`;


  await db.any(chatsData2, [req.session.username])
    .then((chatsData2) => {
      res.json(chatsData2);
      // return res.status(200);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
      //console.log('fetched response 3');
      // res.redirect("/messages");
    });



});

app.get('/recent-transactions', async (req, res) => {
  try {
    const query = `
      SELECT * 
      FROM transactions 
      WHERE sender_id = $1 OR receiver_id = $1 
      ORDER BY transaction_date DESC 
      LIMIT 10
    `;

    const result = await db.query(query, [req.session.username]);
    console.log(result);

    if (result == undefined) {
      return res.render('pages/transactions', { result: undefined, error: 'No recent transactions found.' });
    }

    res.render('pages/transactions', { transactions: result, error: undefined });
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    res.status(500).send('Internal Server Error');
  }
});


// app.post('/payment/:username', (req, res) => {
//   console.log("post function");
//   const data = {
//     value: req.body.value || '10.00',
//     client_id: process.env.client_id,
//     recipient: req.body.recipient || 'recipient@example.com',
//     username: req.params.username,
//   };
//   res.render('pages/payment', { data });
// });


app.get('/payment/:driverid', (req, res) => {
  const data = {
    value: req.query.value || '10.00',
    client_id: process.env.client_id,
    recipient: req.query.recipient || 'example@example.com',
    username: req.params.driverid, 
  };
  res.render('pages/payment', { data });
});




app.post('/add_transaction', async (req, res) => {
  const transaction_date = new Date();

  try {
    const senderQuery = 'SELECT password FROM users WHERE username = $1';
    const senderResult = await db.oneOrNone(senderQuery, [req.session.username]);

    if (!senderResult) {
      res.status(404).send('Sender not found');
      return;
    }
    const isPasswordMatch = await bcrypt.compare(req.body.sender_password, senderResult.password);

    if (!isPasswordMatch) {
      res.status(401).send('Invalid password');
      return;
    }

    const query = `
      INSERT INTO transactions (sender_id, receiver_id, amount, description, transaction_date)
      VALUES ($1, $2, $3, $4, $5)
    `;

    await db.none(query, [sender_username, receiver_id, amount, description, transaction_date]);

    res.status(200).send('Transaction added successfully');
  } catch (error) {
    console.error('Error adding transaction', error);
    res.status(500).send('Error adding transaction');
  }
});

// Settings GET API call
app.get("/settings", (req, res) => {
  res.render("pages/settings")
});

// Settings API Calls
app.post("/uploadIMG", upload.single("profileImage"), async (req, res) => {
  try {
    const { username } = req.session;
    const imageBuffer = req.file.buffer;

    // Update or insert user profile image
    await db.query(
      "INSERT INTO users (username, profile_img) VALUES ($1, $2) ON CONFLICT (username) DO UPDATE SET profile_img = $2",
      [username, imageBuffer]
    ).catch(error => console.error('Error executing SQL query:', error));
    console.log("Uploaded image file");
    res.redirect("/settings");
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
    console.log('Updating username:', username, 'to', newUsername);
    const result = await db.query(
      "UPDATE users SET username = $1 WHERE username = $2 RETURNING *",
      [newUsername, username]
    );
    console.log('Database Update Result:', result);
    if (result.length > 0) {
      const updatedUser = result[0];
      // Update the session with the new username
      console.log('Before Update - Session:', req.session);
      req.session.username = updatedUser.username;
      console.log('After Update - Session:', req.session);
      res.redirect("/logout");
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
        console.log('Password updated redirecting to /settings');
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
      res.render("pages/users.ejs", { users: userData });
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

// Profile Page GET API Redirect
app.get("/profile", (req, res) => {
  res.redirect("/profile/" + req.session.username);
});

// Profile Page GET API call
app.get("/profile/:username", async (req, res) => {
  try {
      // Fetch the user's data from the database
      const userSession = req.session.username;
      const userData = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [req.params.username]);
      const userRatings = await db.any('SELECT * FROM ratings WHERE ratee_id = $1', [req.params.username]);

      // Log user data and profile image data
      console.log("User Data:", userData);
      if (userData && userData.profile_img) {
          console.log("Profile Image Data (length):", userData.profile_img.length);
      }
      if (userData) {
          res.render("pages/profile.ejs", { user: userData, ratings: userRatings, activeUser: userSession });
      } else {
          console.log("User not found");
          res.status(404).json({ success: false, message: 'User not found' });
      }
  } catch (error) {
      console.error('Error finding profile:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Add Review POST Call
app.post('/add_review', async (req, res) => {
  try {
    const values = [req.session.username, req.body.ratee_id, req.body.rating_value, req.body.review];
    await db.none('INSERT INTO ratings (rater_id, ratee_id, rating_value, rated_at, review) VALUES ($1, $2, $3, NOW(), $4)', values);
    res.redirect('/profile/' + req.body.ratee_id);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Lab 11 test call
app.get('/welcome', (req, res) => {
  res.json({ status: 'success', message: 'Welcome!' });
});

app.get("/homepage", (req, res) => {
  // const tripData = `SELECT trip.trip_id,trip.driverid,trip.destination,trip.original_location 
  // FROM trip INNER JOIN passengers ON trip.trip_id = passengers.trip_id 
  // INNER JOIN users ON users.username = passengers.passenger 
  // WHERE trip.active = TRUE 
  //   AND (passengers.passenger != trip.driverid) 
  //   AND ((passengers.passenger = $1) OR (trip.driverid = $1));`
  const usertrips = `
    SELECT trip.*, users.username as driver_username, users.first_name as driver_first_name, users.last_name as driver_last_name, users.email as driver_email
    FROM trip
    INNER JOIN users ON trip.driverid = users.username
    WHERE trip.driverid = $1;
  `;
  const userJoinedTrips = `SELECT * FROM trip WHERE trip.trip_id IN (SELECT trip_id FROM passengers WHERE passengers.passenger = $1);`;
  db.task('get-everything', task => {
    return task.batch([task.any(usertrips, [req.session.username]), task.any(userJoinedTrips, [req.session.username])]);
  })
    .then((data) => {
      console.log(data);
      res.render("pages/homepage.ejs", { 'Data': data, 'User': req.session.username });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("homepage");
    });
});

app.delete("/CancelUserTrip/:Trip_id", (req,  res) => {
  const deleteQuery = "DELETE FROM passengers WHERE trip_id = $1 AND passenger = $2;";
  db.any(deleteQuery,  [req.params.Trip_id,  req.session.username])
      .then((data) => {
        console.log("Data deleted successfully");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("homepage");
      });
});

app.delete("/CancelUserMadeTrip/:Trip_id", (req, res) => {
  const deleteQuery = "DELETE FROM passengers WHERE trip_id = $1; DELETE FROM trip WHERE trip_id = $1;";
  db.any(deleteQuery, [req.params.Trip_id])
    .then((data) => {
      console.log("Data deleted successfully");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("homepage");
    });
});

app.get("/tripcreate", (req, res) => {
  res.redirect("")
});

// Authentication Middleware.


//Go to createTrip page
app.get("/createTrip", (req, res) => {
  res.render("pages/createTrip.ejs")
});

//Create a trip:

app.post("/trip", (req, res) => {

  const query = "INSERT INTO trip (driverID, destination, original_location, active, payment_req, leaving_time, nickname) VALUES ($1, $2, $3, $4, $5, $6, $7);";
  db.none(query, [req.session.username, req.body.destination, req.body.original_location, req.body.active, req.body.payment_req, req.body.leaving_time, req.body.nickname])
    .then(() => {
      console.log('Trip created successfully');
    })
    .catch(err => {
      console.log(err);
    });
});

//Edit trip details:

app.put("/trip/:trip_id", (req, res) => {
  const query = "UPDATE trip SET driverID = $1, destination = $2, original_location = $3, active = $4, payment_req = $5, leaving_time = $6, nickname = $7 WHERE trip_id = $8;"; 
  db.none(query, [req.session.username, req.body.destination, req.body.original_location, req.body.active, req.body.payment_req, req.body.leaving_time, req.body.nickname, req.params.trip_id])
    .then(() => {
      console.log('Trip updated successfully');
    })
    .catch(err => {
      console.log(err);
    });
});


//Add passengers to trip:

app.post("/trip/:trip_id/passenger", (req, res) => {
  const query = "INSERT INTO passengers (trip_id, passenger) VALUES ($1, $2);";
  db.none(query, [req.params.trip_id, req.body.passenger])
    .then(() => {
      console.log('Trip joined successfully');
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
    const trips = await db.any(query, [req.session.username]);
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
    await db.none(query, [req.params.trip_id, req.session.username]);
    res.json({ status: 'success', message: 'Trip deleted successfully' });
  } catch (err) {
    console.log(err);
    res.json({ status: 'error', message: 'Failed to delete trip' });
  }
});

// Get all trips

app.get("/alltrips", async (req, res) => {
  const query = "SELECT * FROM trip;";
  try {
    const trips = await db.any(query);
    res.json({ status: 'success', data: trips });
  } catch (err) {
    console.log(err);
    res.json({ status: 'error', message: 'Failed to fetch trips' });
  }
});

// Render joinTrip page

app.get("/joinTrip", async (req, res) => {
  const query = "SELECT * FROM trip;";
  try {
    const trips = await db.any(query);
    res.render("pages/joinTrip.ejs", { trips: trips, username: req.session.username });
  } catch (err) {
    console.log(err);
    res.redirect("homepage");
  }
});
// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');
