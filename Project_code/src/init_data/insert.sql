INSERT INTO users (username,password,first_name,last_name,email,created_at) VALUES ('Testerson','password','Testy','Test','Test@gmail.com',CURRENT_TIMESTAMP);

INSERT INTO trip (trip_id,driverID,destination,original_location) VALUES (1,'Testerson','Test','Test','TRUE');
INSERT INTO trip (trip_id,driverID,destination,original_location) VALUES (2,'Testerson','Test2','Test2','TRUE');
INSERT INTO trip (trip_id,driverID,destination,original_location) VALUES (3,'Testerson','Test3','Test3','FALSE');