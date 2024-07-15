const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// database related code

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9fglmuq.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const db = client.db("coffeeDb").collection("coffee");
    const userDb = client.db("coffeeDb").collection("user");

    app.get('/coffee',  async(req,res) =>{
        const corsor =  db.find();
        const result = await corsor.toArray();
        res.send(result)
    })

    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      const result = await db.insertOne(newCoffee);
      res.send(result);
    });

    app.get('/coffee/:id',async (req,res) =>{
        const id = req.params.id;
        const query = {_id:new ObjectId(id)};
        const result = await db.findOne(query);
        res.send(result)
    });

    app.put('/coffee/:id',async (req,res) =>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)};
      const options = { upsert: true };
      const coffee =req.body;
      const updatedCoffee ={
        $set:{
            name:coffee.name,
            quantity:coffee.quantity,
            supplier:coffee.supplier,
            taste:coffee.taste,
            category:coffee.category,
            details:coffee.details,
            photoUrl:coffee.photo,
        }
      }
      const result = await db.updateOne(query,updatedCoffee,options)
      res.send(result)
    })

    app.delete('/coffee/:id',async(req,res) =>{
        const id = req.params.id;
        const query ={_id:new ObjectId(id)}
        const result = await db.deleteOne(query);
        res.send(result)
    })

    // user related apis
    app.post('/user',async(req,res)=>{
      const newUser = req.body
      const result = await userDb.insertOne(newUser);
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Coffee making server is running");
});

app.listen(port, () => {
  console.log(`Coffee server is running on port ${port}`);
});
