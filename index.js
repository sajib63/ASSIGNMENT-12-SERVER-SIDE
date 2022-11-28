const express = require('express')
const app = express()
const cors = require('cors')
const { json } = require('express')
const jwt = require('jsonwebtoken')
require('dotenv').config()
// for payment 
const stripe = require("stripe")(process.env.STRIPE_SK);

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000




app.use(cors())
app.use(express.json())






const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.z2qhqgi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).send({ message: 'forbidden access' })
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.JWT_TOKEN, function (error, decoded) {
        if (error) {
            return res.status(403).send({ message: 'forbidden access' })
        }

        req.decoded = decoded
        next();
    })


}





async function run() {

    try {

        const teslaCollection = client.db('car-reseller').collection('tesla')
        const audiCollection = client.db('car-reseller').collection('audi')
        const bmwCollection = client.db('car-reseller').collection('bmw')
        const hyundaiCollection = client.db('car-reseller').collection('hyundai')
        const mercedesCollection = client.db('car-reseller').collection('mercedes')
        const lamborghiniCollection = client.db('car-reseller').collection('lamborghini')
        const buyerCollection = client.db('car-reseller').collection('buyer')
        const sellerCollection = client.db('car-reseller').collection('seller')
        const bookingCollection = client.db('car-reseller').collection('booking')
        const paymentCollection = client.db('car-reseller').collection('payment')
        const reportCollection = client.db('car-reseller').collection('report')
        const advertisementCollection = client.db('car-reseller').collection('advertisement')




        // get all brands
        app.get('/tesla', async (req, res) => {
            const query = {}
            const tesla = await teslaCollection.find(query).toArray()
            res.send(tesla)
        })
        app.get('/audi', async (req, res) => {
            const query = {}
            const tesla = await audiCollection.find(query).toArray()
            res.send(tesla)
        })
        app.get('/bmw', async (req, res) => {
            const query = {}
            const tesla = await bmwCollection.find(query).toArray()
            res.send(tesla)
        })
        app.get('/hyundai', async (req, res) => {
            const query = {}
            const tesla = await hyundaiCollection.find(query).toArray()
            res.send(tesla)
        })
        app.get('/mercedes', async (req, res) => {
            const query = {}
            const tesla = await mercedesCollection.find(query).toArray()
            res.send(tesla)
        })
        app.get('/lamborghini', async (req, res) => {
            const query = {}
            const tesla = await lamborghiniCollection.find(query).toArray()
            res.send(tesla)
        })


        // post seller or buyer 
        app.post('/position', async (req, res) => {
            const user = req.body;

            if (user.position === "Buyer") {
                const result = await buyerCollection.insertOne(user)
                return res.send(result)
            }

            if (user.position === "Seller") {
                const result = await sellerCollection.insertOne(user)
                return res.send(result)
            }

            const result = await buyerCollection.insertOne(user)
            res.send(result)

        })






        // jwt 

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const user = await sellerCollection.findOne(query)
            const user2 = await buyerCollection.findOne(query)
            if (user || user2) {
                const token = jwt.sign({ email }, process.env.JWT_TOKEN, { expiresIn: '1d' })
                return res.send({ token })
            }
            res.status(403).send({ message: 'Forbidden Access' })
        })



        // find all sellers

        app.get('/sellers', async (req, res) => {
            const query = {}
            const sellers = await sellerCollection.find(query).toArray()
            res.send(sellers)
        })

        // find all buyers

        app.get('/buyers', verifyJWT, async (req, res) => {


            const query = {}
            const sellers = await buyerCollection.find(query).toArray()
            res.send(sellers)
        })




        // for find specific one by id 

        app.get('/allProduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result1 = await teslaCollection.findOne(query)
            const result2 = await audiCollection.findOne(query)
            const result3 = await bmwCollection.findOne(query)
            const result4 = await mercedesCollection.findOne(query)
            const result5 = await hyundaiCollection.findOne(query)
            const result6 = await lamborghiniCollection.findOne(query)

            res.send(result1 || result2 || result3 || result4 || result5 || result6)
        })




        // add product 
        app.post('/addProduct', async (req, res) => {
            const products = req.body;

            if (products.brand === 'tesla') {
                const product = await teslaCollection.insertOne(products)
                return res.send(product)
            }
            if (products.brand === 'audi') {
                const product = await audiCollection.insertOne(products)
                return res.send(product)
            }
            if (products.brand === 'bmw') {
                const product = await bmwCollection.insertOne(products)
                return res.send(product)
            }
            if (products.brand === 'hyundai') {
                const product = await hyundaiCollection.insertOne(products)
                return res.send(product)
            }
            if (products.brand === 'mercedes') {
                const product = await mercedesCollection.insertOne(products)
                return res.send(product)
            }
            if (products.brand === 'lamborghini') {
                const product = await lamborghiniCollection.insertOne(products)
                return res.send(product)
            }


        })


        // get myProducts

        app.get('/myProducts', verifyJWT, async (req, res) => {
            const email = req.query.email;
            const decodedEmail = req.decoded.email;

            if (email !== decodedEmail) {
                return res.status(403).send({ message: 'forbidden access' })
            }

            const query = { email: email }
            const teslaProducts = await teslaCollection.find(query).toArray()
            const audiProducts = await audiCollection.find(query).toArray()
            const bmwProducts = await bmwCollection.find(query).toArray()
            const hyundaiProducts = await hyundaiCollection.find(query).toArray()
            const mercedesProducts = await mercedesCollection.find(query).toArray()
            const lamborghiniProducts = await lamborghiniCollection.find(query).toArray()

            res.send([
                teslaProducts, audiProducts, bmwProducts, hyundaiProducts, mercedesProducts, lamborghiniProducts
            ])

        })



        // delete my product 

        app.delete('/deleteMyProduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const teslaProducts = await teslaCollection.deleteOne(query)
            const audiProducts = await audiCollection.deleteOne(query)
            const bmwProducts = await bmwCollection.deleteOne(query)
            const hyundaiProducts = await hyundaiCollection.deleteOne(query)
            const mercedesProducts = await mercedesCollection.deleteOne(query)
            const lamborghiniProducts = await lamborghiniCollection.deleteOne(query)

            res.send(
                teslaProducts || audiProducts || bmwProducts || hyundaiProducts || mercedesProducts || lamborghiniProducts
            )

        })





        // add  AddProduct add 
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const bookings = await bookingCollection.insertOne(booking)
            res.send(bookings)
        })

        // get  AddProduct add 
        app.get('/getBooking', verifyJWT, async (req, res) => {

            const email = req.query.email;


            const decodedEmail = req.decoded.email;


            if (email !== decodedEmail) {
                return res.status(403).send({ message: 'forbidden access' })
            }


            const query = { email: email };
            const getBookings = await bookingCollection.find(query).toArray();
            res.send(getBookings)
        })



        // delete allUser 

        app.delete('/allSeller/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const seller = await sellerCollection.deleteOne(query)
            res.send(seller);
        })

        // delete Buyer 

        app.delete('/allBuyers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const buyer = await buyerCollection.deleteOne(query)
            res.send(buyer);
        })

        // verify user 

        app.put('/allSeller/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    verification: "verified"
                }
            }
            const seller = await sellerCollection.updateOne(filter, updateDoc, options)
            res.send(seller);
        })



        // find verified email 
        app.get('/verifiedEmail', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const verifiedSeller = await sellerCollection.find(query).toArray();
            res.send(verifiedSeller)
        })


        // get admin role 
        app.get('/buyer/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await sellerCollection.findOne(query);

            res.send({ isAdmin: user?.role === "admin" });
        })

        //get seller role
        app.get('/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await sellerCollection.findOne(query)
            res.send({ seller: user?.position === "Seller" })

        })


        // post report 
        app.post('/report', async (req, res) => {
            const reportData = req.body;
            const bookings = await reportCollection.insertOne(reportData)
            res.send(bookings)
        })
        // get report
        app.get('/reportProduct', async (req, res) => {
            const query = {}
            const reportProduct = await reportCollection.find(query).toArray()

            res.send(reportProduct)
        })

        // post advertisement

        app.post('/advertisement', async (req, res) => {
            const advertisement = req.body;
            const advertisementProduct = await advertisementCollection.insertOne(advertisement)
            res.send(advertisementProduct)
        })


        //PAYMENT START

        // for payment
        app.post('/create-payment-intent', async (req, res) => {
            const booking = req.body;
            const sell_price = booking.sell_price;
            const amount = sell_price * 100;

            const paymentIntent = await stripe.paymentIntents.create({
                currency: 'usd',
                amount: amount,
                "payment_method_types": [
                    "card"
                ]
            });
            res.send({
                clientSecret: paymentIntent.client_secret,
            });
        })


        // for payment 

        app.post('/payments', async (req, res) => {
            const payment = req.body;
            const result = await paymentCollection.insertOne(payment);

            const id = payment.bookingId;
            const filter = { _id: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    paid: true,
                    transactionId: payment.transactionId
                }
            }
            const updateResult = await bookingCollection.updateOne(filter, updatedDoc)
            res.send(result);
        })

        // get booking dynamic id 
        app.get('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bookingCollection.findOne(query)
            res.send(result);
        })

        app.get('/bookings', async (req, res) => {

            const query = {}
            const result = await bookingCollection.find(query).toArray()
            res.send(result);
        })



    }
    finally {

    }

}
run().catch(console.dir())


app.get('/', (req, res) => {
    res.send('Reseller Website Running...............')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})