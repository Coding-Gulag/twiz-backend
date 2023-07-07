const express = require('express');
const mongodb = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');

const authRoutes = require('./routes/auth');

const uri = `mongodb+srv://rapworldfilms:PnvYM6lLSU5XcpRj@rap-world-db.fsu4qy1.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db;

async function run() {
    try {
        // Connect the client to the server
        await client.connect();
        // Define the database
        db = client.db('rap-world-db');
        console.log("You successfully connected to MongoDB!");
    } catch (err) {
        console.dir(err);
    }
}

run();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    req.app.locals.db = db;
    next();
});

// Routes
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Make sure it listens to port provided by Heroku
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
});
