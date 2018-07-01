# mytd
App made during the Development of Server Side Solutions in Jönköping University.

## Installation
1. ```git clone https://github.com/poirot-k/mytd.git```
2. ```cd mytd```
3. ```npm install && npm start```

## Features
a) Allows accounts creation and connection.
b) Allows a registered user to add a new weight (with a date) and a new activity (with description and date)
c) Allows a registered user to see his progression through graphics
d) Allows a registered user to see other's progression.

### Misc
1. A REST API is available with this project. You can currently create a new account, log-in with a single token authentication, and get your own datas.
2. A lot of ternary expressions are used, since an expression is better in term of performance vs if/else segments + we are now in 2018 and functionnal programming should be a thing now, expressions & assignations > iterations & mutables variables.
3. Two types of resources are created through the same endpoint because of the simplicity of the request. Both are simplifiable with ternary operations, and only ask for a couple of lines without it being hard to understand.
4. 
## Patch Notes

1.3
 - Modified several ternary expressions by replacing them with if/else statements.
 - Added /api/create, /api/dashboard as endpoints.
  o You can now login, create and account, access your data and add new resources through the RESTful API via smart devices.

1.1
 - Fixed circular dependency between index & routes files.
 - Now only using a single instance of the database, opening on account login & closing on signout.
 - Removing handlers for sessions.
  o Fixed a bug preventing sessions to persist on refresh. (workaround : set cookies security on false to allow persistance on localhost)
 - Using now user's ID as foreign key instead of user's nickname.

1.0
 - Added the main features.
 
 ### Contact
 [Feel free to email me !](mailto:kevin.poirot@epitech.eu)
