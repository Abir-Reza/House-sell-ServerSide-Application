const express = require('express');
require('dotenv').config();
var cors = require('cors');
const app = express();
const { MongoClient } = require('mongodb');

const ObjectId = require('mongodb').ObjectId;

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
        const ordersCollection = database.collection('orders');
        const reviewsCollection = database.collection('reviews');

        // get first six product for homepage
        app.get('/houseshomepage', async(req,res) => {
            const cursor = housesCollection.find({}).limit(6);
            try{
                const houses = await cursor.toArray();
                res.send(houses);
            }
            catch(error) {
                return res.send(error.message);
            }
        })

        // get all products from database
        app.get('/allhouses', async(req,res) => {
            const cursor = housesCollection.find({});
            try {
                const houses = await cursor.toArray();
                res.send(houses);
            }
            catch(error) {

            }
        })


        app.post('/houses', async(req,res) => {
            const house = req.body;
            const result = await housesCollection.insertOne(house);
            res.send("post hitted");
        })

        // Delete house by id
        app.delete('/houses/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await housesCollection.deleteOne(query);
            res.json(result);
            
        })

        // app.get('/purchase/:id', async(req,res) =>{
        //     const id = req.params._id;
        //     const query = { id:id};
        //     const house = await housesCollection.findOne(query);
        //     res.json(house);
        // })

            // GET Single house
            app.get('/houses/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const house = await housesCollection.findOne(query);
            res.json(house);
        })


        // orders collection
        app.post('/orders', async(req,res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        })

          // get orders 
          app.get('/orders', async(req,res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })

        // users orders
        app.get('/myorders/:email', async(req,res) => {
            const email = req.params.email;
            const query = {clientEmail: email} ;

            const cursor = ordersCollection.find(query);
            const myorders= await cursor.toArray();

            res.send(myorders);
        })

        // delete order
        app.delete('/myorders/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })


      



        // Add review to collection
        app.post('/addreview', async (req, res) => {
            const review = req.body;
            try {
                const result = await reviewsCollection.insertOne(review);
                console.log(result);
                res.json(result);
                console.log(' post review working');
            }
            catch(error) {
                res.send(error);
            }
        });

        // get all reviews
        app.get('/reviews', async(req,res) => {
            const cursor = reviewsCollection.find({});
            try {
                const reviews = await cursor.toArray();
                res.send(reviews);
            }
            catch(error) {

            }
        })

        // add user 
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
            try {
                const result = await usersCollection.updateOne(filter, updateDoc, options);
                res.json(result);
            }
            catch(error) {
                res.send(error);
            }
        });

        // admin role 
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

