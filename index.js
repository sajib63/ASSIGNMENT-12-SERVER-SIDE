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






app.get('/', (req, res) => {
  res.send('Reseller Website Running...............')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})