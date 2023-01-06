const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        // get adminChoice Posts
        app.get('/adminChoiches', async (req, res) => {
            const query = { adminChoice: true }
            const data = await postCollection.find(query).toArray();
            res.send(data)
        })

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

        //find authors from user list
        app.get('/authors', async (req, res) => {
            const query = { userType: 'author' }
            const authors = await userCollection.find(query).toArray()
            res.send(authors)
        })
        //get specific user by id
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const user = await userCollection.findOne(query)
            res.send(user)
        })
        //get specific user by email
        app.get('/user', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const user = await userCollection.findOne(query)
            res.send(user)
        })
        //get specific posts by email
        app.get('/posts', async (req, res) => {
            const email = req.query.email;
            const query = {
                authorEmail
                    : email
            }
            const posts = await postCollection.find(query).toArray()
            res.send(posts)
        })
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const user = await userCollection.findOne(query)
            res.send(user)
        })
        //find all post from database
        app.get('/allposts', async (req, res) => {
            const query = {}
            const allPosts = await postCollection.find(query).toArray()
            res.send(allPosts)
        })
        //find limited post from database for homepage
        app.get('/homeposts', async (req, res) => {
            const query = {}
            const homepagePost = await postCollection.find(query).limit(4).toArray()
            res.send(homepagePost)
        })

        //get category wise post
        app.get('/posts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { categoryId: id };
            const result = await postCollection.find(query).toArray()
            res.send(result)
        })
        //get single post by id
        app.get('/post/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await postCollection.findOne(query)
            res.send(result)
        })

        //find most liked post from array
        app.get('/mostLiked', async (req, res) => {
            const query = {}
            const allPosts = await postCollection.find(query).toArray()
            const sortedPosts = allPosts.sort((a, b) => parseFloat(b.totalLike) - parseFloat(a.totalLike));
            const mostLiked = sortedPosts.slice(0, 1)
            res.send(mostLiked)
        })

        // update user data 
        app.put('/userprofile/:id', async (req, res) => {
            const id = req.params.id;
            const options = { upsert: true }
            const updatedData = await userCollection.updateOne({ _id: ObjectId(id) }, { $set: req.body }, options)
            console.log(updatedData)
            res.send(updatedData)
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

