# CSCI-3308-Group-5-Final-Project
The final project repository for CSCI 3308

Brief Application description:
This application is a ride share app that is designed to help users find trips that are more cost effect than other existing ride share applications such as Uber. the focus is that multiple people can join one "ride" to help reduce the both monetary and eviormental cost. "Riders" will have the pay the driver but mainly just for gas. The objective of the application is to connect people going to similar locations and hopefully improve their travel!

Contributors -
Adithya Narayanan
Brain Avner
Kyle Griffin
Lucas Drager
Nasir Naqvi
Phillip Kononenko

Technology Stack used for the project:

Prerequisites to run the application:
In order to run this application locally the user must have a terminal and the docker engine software. 
The application uses docker to build it's necissary parts. In order to view the application the user must also have some web based
plat form to view the application. (Something like google crome, microsoft edge, ect...) The user will also need to be able to run terminal commands
that are to be listed below.

Instructions on how to run the application locally:
In order to run the machine locally the user must have the docker engine running and some sort of terminal to run docker commands.
Once those two things are complete to start up the application, the user must enter this docker comand into the terminal:
```docker-compose up```
which will start the program. In order to succesfully teardown the application for local machines the user must enter this command inot the terminal:
```docker-compse down -v```

How to run the tests:
Simply run the the previous commands for how to run the machine locally and the tests will run automatically before start up of the application.

Link to the deployed application: http://recitation-013-team-05.eastus.cloudapp.azure.com:3000/