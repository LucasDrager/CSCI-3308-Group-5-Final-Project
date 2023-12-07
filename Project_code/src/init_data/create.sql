-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  username varchar(50) PRIMARY KEY,
  password varchar(256),
  first_name varchar(50),
  last_name varchar(50),
  email varchar(50),
  profile_img BYTEA,
  created_at timestamp,
  trips_taken integer
);

-- Create the friends table
CREATE TABLE IF NOT EXISTS friends (
  user_a varchar(50),
  user_b varchar(50),
  FOREIGN KEY (user_a) REFERENCES users(username),
  FOREIGN KEY (user_b) REFERENCES users(username)
);

-- Create the trip table
CREATE TABLE IF NOT EXISTS trip (
  trip_id serial PRIMARY KEY,
  driverID varchar(50) REFERENCES users(username),
  destination varchar(255),
  original_location varchar(255),
  active boolean,
  payment_req boolean,
  leaving_time timestamp,
  nickname varchar(255)
);

-- Create the passengers table
CREATE TABLE IF NOT EXISTS passengers (
  trip_id integer,
  passenger varchar(50) REFERENCES users(username),
  passengerNum integer,
  FOREIGN KEY (trip_id) REFERENCES trip(trip_id)
);

-- Create the messaging table
CREATE TABLE IF NOT EXISTS messaging (
  message_id serial PRIMARY KEY,
  sender_id varchar(50) REFERENCES users(username),
  receiver_id varchar(50) REFERENCES users(username),
  message_text text,
  sent_at timestamp
);

-- Create the ratings table
CREATE TABLE IF NOT EXISTS ratings (
  rating_id serial PRIMARY KEY,
  rater_id varchar(50) REFERENCES users(username),
  ratee_id varchar(50) REFERENCES users(username),
  rating_value real, 
  rated_at timestamp,
  review text
);

-- Create the transactions table
CREATE TABLE IF NOT EXISTS transactions (
  transaction_id serial PRIMARY KEY,
  sender_id varchar(50) REFERENCES users(username),
  receiver_id varchar(50) REFERENCES users(username),
  amount numeric(10, 2), 
  description varchar(255),
  transaction_date timestamp
);

-- Create the trip_to_users table
CREATE TABLE IF NOT EXISTS trip_to_users (
    user_id varchar(50),
    trip_id integer,
    FOREIGN KEY (user_id) REFERENCES users(username),
    FOREIGN KEY (trip_id) REFERENCES trip(trip_id)
);

CREATE TABLE IF NOT EXISTS messages (
  chatID varchar(50),
  sender varchar(50) REFERENCES users(username),
  reciever varchar(50) REFERENCES users(username),
  message_text text,
  sent_at timestamp
);

CREATE TABLE IF NOT EXISTS chats (
  chatID varchar(50),
  user1 varchar(50),
  user2 varchar(50),
  FOREIGN KEY (user1) REFERENCES users(username),
  FOREIGN KEY (user2) REFERENCES users(username)
);

-- ALTER TABLE messages
-- ADD chats_ID int;

-- ALTER TABLE messages
-- DROP COLUMN chatID;