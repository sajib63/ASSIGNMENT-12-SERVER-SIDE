const express = require('express')
const app = express()
const cors = require('cors')
const { json } = require('express')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port =process.env.PORT || 5000




app.use(cors())
app.use(express.json())






const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.z2qhqgi.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){

    try{

        const teslaCollection= client.db('car-reseller').collection('tesla')
        const audiCollection= client.db('car-reseller').collection('audi')
        const bmwCollection= client.db('car-reseller').collection('bmw')
        const hyundaiCollection= client.db('car-reseller').collection('hyundai')
        const mercedesCollection= client.db('car-reseller').collection('mercedes')
        const lamborghiniCollection= client.db('car-reseller').collection('lamborghini')
        const buyerCollection= client.db('car-reseller').collection('buyer')
        const sellerCollection= client.db('car-reseller').collection('seller')




// get all brands
        app.get('/tesla', async(req, res)=>{
            const query={}
            const tesla= await teslaCollection.find(query).toArray()
            res.send(tesla)
        })
        app.get('/audi', async(req, res)=>{
            const query={}
            const tesla= await audiCollection.find(query).toArray()
            res.send(tesla)
        })
        app.get('/bmw', async(req, res)=>{
            const query={}
            const tesla= await bmwCollection.find(query).toArray()
            res.send(tesla)
        })
        app.get('/hyundai', async(req, res)=>{
            const query={}
            const tesla= await hyundaiCollection.find(query).toArray()
            res.send(tesla)
        })
        app.get('/mercedes', async(req, res)=>{
            const query={}
            const tesla= await mercedesCollection.find(query).toArray()
            res.send(tesla)
        })
        app.get('/lamborghini', async(req, res)=>{
            const query={}
            const tesla= await lamborghiniCollection.find(query).toArray()
            res.send(tesla)
        })


        // post seller or buyer 
        app.post('/seller', async(req, res)=>{
            const user=req.body;
            if(user.position === "Buyer"){
                const result= await buyerCollection.insertOne(user)
                return res.send(result)
            }

            if(user.position === "Seller"){
                const result= await sellerCollection.insertOne(user)
                return res.send(result)
            }

            const result=await buyerCollection.insertOne(user)
            res.send(result)

        })




    }
    finally{

    }

}
run().catch(console.dir())


app.get('/', (req, res) => {
  res.send('Reseller Website Running...............')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})