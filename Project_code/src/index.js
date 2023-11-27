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

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

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

app.use("/resources", express.static('./resources/'));


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
app.post("/login", async (req,res) => {
  usernameQuery = `SELECT password FROM users WHERE users.username = $1`
  var password = ""
  await db.one(usernameQuery,[req.body.username])
  .then((data) => {
    password = data.password
  })
  .catch((err) => {
    console.log(err)
    res.redirect("/login");
  });
  const match = await bcrypt.compare(req.body.password, password);
  console.log(match)
  //save user details in session like in lab 8
  if(match == false){ 
    console.log('error');
  } else {
    req.session.user = req.body.username;
    req.session.save();
    res.redirect("/homepage");
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
  //hash the password using bcrypt library //{status: 200, message: 'Failure'}
  let hash;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, passHash) {
      hash = passHash
      if (err) { 
        res.redirect(400,"/register");
      } else { 
        console.log('fetched response');
        const query = "INSERT INTO users (username, password) VALUES ($1,$2);";
        db.any(query,[req.body.username,hash])
        .then((data) => {
          res.redirect("/login")
        })
        .catch((err) => {
          console.log(err);
          res.redirect(400,"/register");
        });
      }
    });
  });
});

app.get("/popup", (req, res) => {
  const tripData = "SELECT * FROM trip WHERE ;"
  db.any(tripData)
  .then((data) => {
    console.log(data);
    res.render("pages/tripdisplay.ejs",{'Data':data});
  })
  .catch((err) => {
    console.log(err);
    res.redirect(400);
  });
});

app.get("/homepage", (req, res) => {
  res.render("pages/homepage.ejs")
});

// Lab 11 test call
app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

// Authentication Middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/login');
  }
  next();
};

// Authentication Required
app.use(auth);
  
// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');