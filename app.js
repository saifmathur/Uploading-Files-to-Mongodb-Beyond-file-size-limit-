const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const methodOverride = require('method-override')



app.use(bodyParser.json())

app.use(methodOverride('_method'))

app.set('view engine','ejs')


const conn = mongoose.createConnection('mongodb+srv://saif:1234@home-cluster-yxtth.mongodb.net/mongouploads?retryWrites=true&w=majority',
{ useNewUrlParser: true ,
 useUnifiedTopology: true })

let gfs;



app.get('/', function (req,res){
    res.render('index')
})

const port = 5000;
app.listen(port, function(){
    console.log('connected')
})