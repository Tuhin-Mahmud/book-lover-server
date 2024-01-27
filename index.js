const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
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
        await client.connect();

        const authorsCollection = client.db('booksDB').collection('authors')

        const booksCollection = client.db('booksDB').collection('book')
        const orderBookCollection = client.db('booksDB').collection('orderBook')



        app.get('/books/read', async (req, res) => {
            const result = await booksCollection.find().toArray()
            res.send(result)
        })

        app.get('/books/read/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = {
                projection: { image: 1, author_name: 1, quantity: 1, rating: 1 },
            };
            const result = await booksCollection.findOne(query, options)
            res.send(result)
        })


        // order book api 
        app.post('/orderBook', async (req, res) => {
            const order = req.body;
            const result = await orderBookCollection.insertOne(order)
            res.send(result)
        })

        app.get('/orderBook', async (req, res) => {
            let = query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await orderBookCollection.find(query).toArray()
            res.send(result)
        })







        // app.post('/books', async (req, res) => {
        //     const bookOrder = req.body;
        //     console.log(bookOrder);
        //     const result = await submitBookCollection.insertOne(bookOrder)
        //     res.send(result)
        // })










        // authors related api 
        app.get('/authors/read', async (req, res) => {
            const result = await authorsCollection.find().toArray()
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
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