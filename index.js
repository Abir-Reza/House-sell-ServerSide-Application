const express = require('express');
require('dotenv').config();
var cors = require('cors');
const app = express();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;

// use middlewire
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mflix.feluh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('dreamHouseDb');
        const housesCollection = database.collection('houses');
        const usersCollection = database.collection('users');

        app.get('/houseshomepage', async(req,res) => {
            const cursor = housesCollection.find({}).limit(6);
            const houses = await cursor.toArray();

            res.send(houses);
        })

        app.get('/allhouses', async(req,res) => {
            const cursor = housesCollection.find({});
            const houses = await cursor.toArray();

            res.send(houses);
        })


        app.post('/houses', async(req,res) => {
            const house = req.body;
            const result = await housesCollection.insertOne(house);
            res.send("post hitted");
        })

        // app.get('/purchase', async(req,res) =>{
        //     const email = req.query.email;
        //     const query = { email:email};
        // })

        // app.post('/purchase', async(req,res) =>{
        //     const email = req.query.email;
        //     const query = { email:email};
        // })


        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });


        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result); 

        });



        // check admin
        app.get('/users/:email', async(req,res) => {
            const email = req.params.email;
            const query = {email: email};
            const user = await usersCollection.findOne(query);
            let isAdmin = false;

            
            if (user.role === 'admin') {
                isAdmin = true;
            }

            res.json({admin : isAdmin});
        })


     
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req,res)=> {
    res.send("Hello from express Dream House project");
})


app.listen(port, () => {
    console.log("Listening from port : ",port);
})

