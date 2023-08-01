Last Edited: 24/07/2023 9:00pm

install monngodb from 
"https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/"

install the optional mongodb compass

in mongodb compass create these 5 collections: comments, fs.chunks, fs.files, posts, users

import each of the db JSON files to its respective collection based of the name after the MCO1. i.e. MC01.users should be imported in the users collection

in the terminal run these commands:
npm i mongodb
npm i express
npm i express-handlebars
npm i express-session
npm i dotenv
npm i multer

then if the .env file is not present create a .env file with and copy paste this block of code:
"
MONGO_URI=mongodb://127.0.0.1:27017
SERVER_PORT=3000
DB_NAME=MCO1
"

MONGI_URI can be mongodb://localhost:27017, however in some machines it does not work if it does not stick to 127.0.0.1

save the .env file in the package folder outside it should not be in any folder it should be in the same location as "index.js"

To start the server open a terminal and type "npm start"

After the server has started open a browser then type "localhost:3000/" in the url