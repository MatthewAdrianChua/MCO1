

import 'dotenv/config';
//import { connectToMongo, getDb } from './db/conn.js';
import express from 'express';
import exphbs from 'express-handlebars';
import session, { Cookie } from 'express-session';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
const MongoDBStore = connectMongoDBSession(session);
import routes from './routes/routes.js';

const app = express();

app.use(express.json()); //It enables your Express server to automatically parse the JSON data sent in the request body and make it available in req.body as a JavaScript object
app.use(express.urlencoded({extended: true})); // automatically parse data sent in the URL-encoded format (such as form data submitted from HTML forms) and make it available in req.body as a JavaScript object.

/*------------------------------------------------------------------------------------------------------------------------------------------*/

const store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017/MCO1',
    collection: 'sessions',
});

store.on('error', function(error) {
    console.log(error);
});

app.use(session({ //initially a non persistent session is created for a user when they first visit the website and stores it in db sessions, if a user checks remember me when logging in the session will become a persistent session lasting for 3 weeks
    secret: 'ABCDEFG',
    resave: false,
    saveUninitialized: true,
    store: store,
}));

/*------------------------------------------------------------------------------------------------------------------------------------------*/

app.use("/static", express.static("public"));

const hbs = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: './views/layouts',

    helpers:{
        eq: function(a,b){
            return a==b;
        },
        eq2: function(a, b) {
            return a[b];
        },
        eq3: function(a){
            if(a == true)
                return a;
        },
        eq4: function(a,b){
            if(a == b){
                return true;
            }
            else{
                return false;
            }
        },
        eq5: function(a){
            return a;
        }
    }
})

app.engine("handlebars", hbs.engine);

app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(routes);

app.listen(process.env.SERVER_PORT, () => {
    console.log("Server is now listening...");
})