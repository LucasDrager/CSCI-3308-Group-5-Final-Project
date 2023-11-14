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

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

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
  res.redirect("/login"); //sent user to log in page
});

//Login Get call
app.get("/login", (req,res) => {
  res.render("pages/login.ejs")
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
      res.render("pages/login.ejs", { user, error: "Invalid username or password" });
    }
  } catch (err) {
    console.error(err);
    res.render("pages/login.ejs", { user, error: "An error occurred. Please try again." });
  }
});

//log out get call
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.render("pages/login.ejs");
});

//Register get call
app.get("/register", (req, res) => {
  res.render("pages/register.ejs")
});

//Register post call
app.post("/register", async (req, res) => {
  try {
    // Hash the password using bcrypt
    const hash = await bcrypt.hash(req.body.password, 10);

    const query = "INSERT INTO users (username, password, first_name, last_name, email, created_at) VALUES ($1, $2, $3, $4, $5, $6);";
    const values = [req.body.username.trim(), hash, req.body.first_name.trim(), req.body.last_name.trim(), req.body.email.trim(), new Date()];

    await db.none(query, values);

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.redirect("/register");
  }
});

// Lab 11 test call
app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

app.get("/homepage", (req, res) => {
  res.render("pages/homepage.ejs")
});

// Authentication and security
app.set('view engine', 'ejs'); // set the view engine to EJS
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.
  
// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');