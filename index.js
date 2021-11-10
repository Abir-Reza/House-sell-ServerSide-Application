const express = require('express');
require('dotenv').config();
var cors = require('cors');
const app = express();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5050;

// use middlewire
app.use(cors());
app.use(express.json());


app.get('./', (req,res) => {
    res.send("Hello from express");
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mflix.feluh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('dreamHouseDb');
        const housesCollection = database.collection('houses');

     

     
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log("Listening from port : ",port);
})

