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
//

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
          //res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect(400,"/register");
        });
      }
    });
  });
});

// Lab 11 test call
app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

app.get("/homepage", (req, res) => {
  res.render("pages/homepage.ejs")
});

// Authentication Middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/login');
  }
  next();
};

// Begin API calls for modifying SQL server
app.post('/createTrip', function (req, res) {
  const tripQuery = 'INSERT INTO tripss (username, review, rating) VALUES ($1, $2, $3) RETURNING review_id;';
  const imageQuery = 'INSERT INTO images (image_url, image_caption) VALUES ($1, $2) RETURNING image_id;';
  const mappingQuery = 'INSERT INTO trips_to_images (image_id, review_id) VALUES ($1, $2);';
  
  db.task('add-trip', async t => {
      const trip = await t.one(tripQuery, [req.body.username, req.body.review, req.body.rating]);
      if (req.body.image_url && req.body.image_caption) {
      const image = await t.one(imageQuery, [req.body.image_url, req.body.image_caption]);
      await t.none(mappingQuery, [image.image_id, review.review_id]);
      return { trip_id: trip.trip_id, image_id: image.image_id };
      }
      return { trip_id: trip.trip_id };
  })
  .then(data => {
      res.status(201).json({
      status: 'success',
      data: data,
      message: 'Data added successfully',
      });
  })
  .catch(err => {
      console.log(err);
  });
  });
  
  app.put('/updateTrip/:trip_id', function (req, res) {
  const tripQuery = 'UPDATE trips SET trip = $1, rating = $2 WHERE trip_id = $3;';
  const imageQuery = 'UPDATE images SET image_url = $1, image_caption = $2 WHERE image_id = $3;';
  
  db.task('update-trip', async t => {
      if (req.body.trip || req.body.rating) {
      await t.none(tripQuery, [req.body.trip, req.body.rating, req.params.trip_id]);
      }
      if (req.body.image_url || req.body.image_caption) {
      await t.none(imageQuery, [req.body.image_url, req.body.image_caption, req.body.image_id]);
      }
  })
  .then(() => {
      res.status(200).json({
      status: 'success',
      message: 'Data updated successfully',
      });
  })
  .catch(err => {
      console.log(err);
  });
  });
  
  app.delete('/deleteReview/:review_id', function (req, res) {
  const query = 'DELETE FROM reviews WHERE review_id = $1;';
  db.none(query, [req.params.review_id])
      .then(() => {
      res.status(200).json({
          status: 'success',
          message: 'Data deleted successfully',
      });
      })
      .catch(err => {
      console.log(err);
      });
  });
  
  app.get('/getLocals', function (req, res) {
      const { difficulty, rating, location, elevation_gain } = req.query;
      let query = 'SELECT * FROM trails WHERE 1=1';
      if(difficulty) {
        query += ` AND difficulty = '${difficulty}'`;
      }
      if(rating) {
        query += ` AND avg_rating >= ${rating}`;
      }
      if(location) {
        query += ` AND location = '${location}'`;
      }
      if(elevation_gain) {
        query += ` AND elevation_gain >= ${elevation_gain}`;
      }
      db.any(query)
        .then(function (data) {
          res.status(200).json({
            status: 'success',
            data: data,
            message: 'Retrieved trails based on filters',
          });
        })
        .catch(function (err) {
          return console.log(err);
      });
  });
  
  app.get('/getReviews/:trail_id', function (req, res) {
      const trail_id = req.params.trail_id;
      const query = 'SELECT r.* FROM reviews r INNER JOIN trails_to_reviews tr ON r.review_id = tr.review_id WHERE tr.trail_id = $1;';
    
      db.any(query, [trail_id])
        .then(function (data) {
          res.status(200).json({
            status: 'success',
            data: data,
            message: 'Retrieved reviews for the selected trail',
          });
        })
        .catch(function (err) {
          return console.log(err);
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