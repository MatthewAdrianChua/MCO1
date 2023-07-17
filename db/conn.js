import { MongoClient } from "mongodb";

const mongoURI = process.env.MONGO_URI;
const client = new MongoClient(mongoURI);

export function connectToMongo (callback) {
    client.connect().then( (client) => {
        return callback();
    }).catch( err => {
        callback(err);
    })
}

export function getDb(dbname = process.env.DB_NAME){
    return client.db(dbname);
}

function signalHandler(){
    console.log("Closing MongoDB connection...")
    client.close();
    process.exit();
}

process.on("SIGINT", signalHandler);
process.on("SIGTERM", signalHandler);
process.on("SIGQUIT", signalHandler);