const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const methodOverride = require('method-override')
const { pathToFileURL } = require('url')
const path = require('path')


app.use(bodyParser.json())

app.use(methodOverride('_method'))

app.set('view engine','ejs')


const conn = mongoose.createConnection('mongodb://localhost:27017/mongouploads',
{ useNewUrlParser: true ,
 useUnifiedTopology: true })

let gfs;
conn.once('open', function(){
    //intialise a stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads')
})

//create a storage object
const storage = new GridFsStorage({
url: 'mongodb://localhost:27017/mongouploads',
file: (req,file)=>{
    return new Promise(function(resolve,reject){
        crypto.randomBytes(16,function(err, buff){
          if(err){
             return reject(err)
             }
            const filename = buff.toString('hex') + path.extname(file.originalname)
            const fileInfo = {
                filename: filename,
                bucketName: 'uploads'
            }   
            resolve(fileInfo)
        })
    }) 
}
})

const upload = multer({storage})


// @route GET, loads form
app.get('/', function (req,res){
    res.render('index')
})

//@route posts /uploading file to db
app.post('/upload',upload.single('file'),function (req, res){   //'file' comes from the ejs template
    //res.json({file: req.file})
    res.redirect('/');
})

//to get files 
app.get('/files', function(req,res){
    //find file
    gfs.files.find().toArray(function (err, files){
        if (!files || files.lengh === 0){
            return res.status(404).json({
                err: 'No file found'
            })
        }
        //files exist
        return res.json(files)


    })
})




const port = 5000;
app.listen(port, function(){
    console.log('connected')
})