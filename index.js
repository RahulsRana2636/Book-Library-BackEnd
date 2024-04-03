// require('./db');
const connectToMongo = require('./db')
const express = require('express')

var cors = require('cors') 

connectToMongo()

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

// Available Routes
app.use('/user', require('./routes/user'))
app.use('/books', require('./routes/books'))
app.use('/getbook', require('./routes/getbooks'))
// const booklist = require('./routes/books');  
// app.use('/book', booklist);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
