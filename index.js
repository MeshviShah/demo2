
const express = require('express')
const connectToMongo = require('./db')
const app = express()
const port = 5000

connectToMongo();
app.use(express.json())
app.get('/',(req,res) =>{
    res.send('hello mesh')
}),
app.use('/api/auth',require('./routes/auth'))

//availble routes


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})