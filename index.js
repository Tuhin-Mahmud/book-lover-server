const express = require('express');
const app = express()
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// middleWare 
app.use(cors())
app.use(express.json())







// MONGODB OPERATION
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tpqoiya.mongodb.net/?retryWrites=true&w=majority`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const authorsCollection = client.db('booksDB').collection('authors')
        const booksCollection = client.db('booksDB').collection('books')
        const categoriesBookCollection = client.db('booksDB').collection('categoriesBook')
        const borrowedCollection = client.db('booksDB').collection('borrowed')


        // books collection api
        app.get('/books', async (req, res) => {
            const result = await booksCollection.find().toArray()
            res.send(result)
        })

        // categories book related api

        app.get('/categories-book', async (req, res) => {
            const result = await categoriesBookCollection.find().toArray()
            res.send(result)
        })
        // -------------------
        app.get('/books/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await categoriesBookCollection.findOne(query)
            res.send(result)
        })


        // add book 
        app.post('/books', async (req, res) => {
            const order = req.body;
            const result = await booksCollection.insertOne(order)
            res.send(result)
        })

        app.put('/books/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const updateBook = req.body;
            const updateDoc = {
                $set: {
                    ...updateBook
                },
            };
            const result = await booksCollection.updateOne(query, updateDoc)
            res.send(result)
        })

        // borrowed 
        app.get('/borrowed', async (req, res) => {
            // console.log(req.query.email);
            // let query = {}
            // if (req.query?.email) {
            //     query = { email: req.query?.email }
            // }
            const email = req.query.email;
            let query = {}
            if (email) {
                query = { email: email }
            }
            const result = await borrowedCollection.find(query).toArray()
            res.send(result)
        })

        app.post('/borrowed', async (req, res) => {
            const borrowed = req.body;
            const result = await borrowedCollection.insertOne(borrowed)
            res.send(result)
        })

        app.delete('/borrowed/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await borrowedCollection.deleteOne(query)
            res.send(result)
        })




        // authors related api 
        app.get('/api/v1/authors', async (req, res) => {
            const result = await authorsCollection.find().toArray()
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('book lovers read')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})