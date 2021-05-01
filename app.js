const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var mongodbErrorHandler = require('mongoose-mongodb-errors')
require('dotenv').config()
const apiRouter = require('./api/routes/routes')


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(express.static('upload'))

// test
app.get('/test',(req,res)=>{
  res.send("test api working Fine")
})

//router
app.use('/api/v1/',apiRouter)

//mongoose connection
mongoose.connect(process.env.MONGO_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>{console.log('mongo connected')})


app.listen(process.env.PORT,()=>{
    console.log('server started at ',process.env.PORT)
})
