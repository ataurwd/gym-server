const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4jm04.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to Mongo')
    await client.db("admin").command({ ping: 1 });
    const gymCollection = client.db('gym-schudule').collection("schudule");

    //Get all schudules
    app.get('/schudules', async (req, res) => {
      const schudules = await gymCollection.find().toArray();
      res.send(schudules);
    });

    app.post('/schudules', async(req, res) => {
      const data = req.body;
      const result = await gymCollection.insertOne(data);
      res.send(result);
    })

    app.get('/status/:id', async(req, res) => {
      const newUserId = req.params.id;
      const quary = {_id: new ObjectId(newUserId)}
      const userInfo = await gymCollection.findOne(quary)
      res.send(userInfo)
  })

    app.patch('/status/:id', async (req, res) => { 
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const usepate = {
        $set: {
          isComplete: true,
        }
      }
      const result = await gymCollection.updateOne(query, usepate);
      res.send(result);
    })

    // for searching data
    app.get("/findschedules", async (req, res) => {
      const { searchParams } = req.query;

      console.log(searchParams);

      let option = {};

      if (searchParams) {
        option = { title: { $regex: searchParams, $options: "i" } };
      }
      const result = await gymCollection.find(option).toArray();
      res.send(result);
    });


  } finally {
  }
}
run().catch(console.dir);

app.get('/', (req, res) => { 
    res.send('welcome back')
})
app.listen(port)



//gym-schudule
//fM23q9sk8slrgGO5