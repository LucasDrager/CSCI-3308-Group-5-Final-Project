-- Create the users table
CREATE TABLE users (
  username varchar(50) PRIMARY KEY,
  first_name varchar(50),
  last_name varchar(50),
  email varchar(50),
  created_at timestamp
);

-- Create the friends table
CREATE TABLE friends (
  user_a varchar(50),
  user_b varchar(50),
  FOREIGN KEY (user_a) REFERENCES users(username),
  FOREIGN KEY (user_b) REFERENCES users(username)
);

-- Create the trip table
CREATE TABLE trip (
  tripID serial PRIMARY KEY,
  driverID varchar(50) REFERENCES users(username),
  destination varchar(255),
  original_location varchar(255)
);

-- Create the passengers table
CREATE TABLE passengers (
  tripID integer,
  passenger varchar(50) REFERENCES users(username),
  FOREIGN KEY (tripID) REFERENCES trip(tripID)
);
