const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000
require('dotenv').config()


app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.n58ahyf.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoryCollection = client.db("IdealBlogs").collection("categories");
        const postCollection = client.db("IdealBlogs").collection("posts");
        const userCollection = client.db("IdealBlogs").collection("users");

        // get all categories  
        app.get('/categories', async (req, res) => {
            const query = {}
            const cursor = categoryCollection.find(query)
            const categories = await cursor.toArray()
            res.send(categories)
        });

        // send user data to db
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user)
            const userEmail = user.email;
            const emailQuery = { email: userEmail }
            const alreadyRegistred = await userCollection.findOne(emailQuery);
            if (alreadyRegistred) {
                return
            }
            const result = await userCollection.insertOne(user);
            console.log(result)
            res.send(result)
        });


    } finally {
        //   await client.close();
    }
}
run().catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('Blog server running')
});
app.listen(port, () => {
    console.log(`Blog app listening on port ${port}`)
})