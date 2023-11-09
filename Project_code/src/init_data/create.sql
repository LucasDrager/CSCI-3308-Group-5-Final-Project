-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  username varchar(50) PRIMARY KEY,
  password varchar(50),
  first_name varchar(50),
  last_name varchar(50),
  email varchar(50),
  created_at timestamp
);

-- -- Create the friends table
-- CREATE TABLE IF NOT EXISTS friends (
--   user_a varchar(50),
--   user_b varchar(50),
--   FOREIGN KEY (user_a) REFERENCES users(username),
--   FOREIGN KEY (user_b) REFERENCES users(username)
-- );

-- -- Create the trip table
-- CREATE TABLE IF NOT EXISTS trip (
--   tripID serial PRIMARY KEY,
--   driverID varchar(50) REFERENCES users(username),
--   destination varchar(255),
--   original_location varchar(255)
-- );

-- -- Create the passengers table
-- CREATE TABLE IF NOT EXISTS passengers (
--   tripID integer,
--   passenger varchar(50) REFERENCES users(username),
--   FOREIGN KEY (tripID) REFERENCES trip(tripID)
-- );

-- -- Create the messaging table
-- CREATE TABLE IF NOT EXISTS messaging (
--   message_id serial PRIMARY KEY,
--   sender_id integer REFERENCES users(id),
--   receiver_id integer REFERENCES users(id),
--   message_text text,
--   sent_at timestamp
-- );

-- -- Create the ratings table
-- CREATE TABLE IF NOT EXISTS ratings (
--   rating_id serial PRIMARY KEY,
--   rater_id integer REFERENCES users(id),
--   ratee_id integer REFERENCES users(id),
--   rating_value real, 
--   rated_at timestamp,
--   review text
-- );

-- -- Create the transactions table
-- CREATE TABLE IF NOT EXISTS transactions (
--   transaction_id serial PRIMARY KEY,
--   sender_id integer REFERENCES users(id),
--   receiver_id integer REFERENCES users(id),
--   amount numeric(10, 2), 
--   description varchar(255),
--   transaction_date timestamp
-- );
