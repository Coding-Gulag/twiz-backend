const express = require('express');
const mongodb = require('mongodb');
const app = express();

const MongoClient = mongodb.MongoClient;

const url = 'mongodb+srv://rapworldfilms:fon@2124#dds@rap-world-db.fsu4qy1.mongodb.net/?retryWrites=true&w=majority';

// Database Name
const dbName = 'myproject';

// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the server
client.connect(function(err) {
    if (err) throw err;
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    // Close the connection
    client.close();
});

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(3000, () => {
    console.log('Server is up and running on port 3000')
});
