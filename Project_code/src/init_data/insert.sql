INSERT INTO users (username,password,first_name,last_name,email,created_at) VALUES ('Testerson','$2b$10$95B0Fuh5CUBEVEZQANdehu0Rqw/qBGjI2cNR8UufPf2YJtogRnaKq','Testy','Test','Test@gmail.com',CURRENT_TIMESTAMP);
INSERT INTO users (username,password,first_name,last_name,email,created_at) VALUES ('Tester','$2b$10$95B0Fuh5CUBEVEZQANdehu0Rqw/qBGjI2cNR8UufPf2YJtogRnaKq','Testy','Test','Test1@gmail.com',CURRENT_TIMESTAMP);

INSERT INTO trip (trip_id,driverID,destination,original_location,active) VALUES (1,'Tester','Breckenridge, CO','Boulder, CO',TRUE);
INSERT INTO trip (trip_id,driverID,destination,original_location,active) VALUES (2,'Testerson','Boulder, CO','San Francisco, CA',TRUE);
INSERT INTO trip (trip_id,driverID,destination,original_location,active) VALUES (3,'Testerson','Test3','Test3',FALSE);

INSERT INTO passengers (trip_id,passenger,passengerNum) VALUES (1,'Testerson',1);
INSERT INTO passengers (trip_id,passenger,passengerNum) VALUES (2,'Tester',1);
INSERT INTO passengers (trip_id,passenger,passengerNum) VALUES (3,'Tester',1);