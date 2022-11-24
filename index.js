const express = require('express')
const app = express()
const cors = require('cors')
const { json } = require('express')
require('dotenv').config()
const port =process.env.PORT || 5000




app.use(cors())
app.use(express.json())









app.get('/', (req, res) => {
  res.send('Reseller Website Running...............')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})