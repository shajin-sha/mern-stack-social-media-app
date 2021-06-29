const { request } = require('express');
var express = require('express');
var router = express.Router();
var multer = require("multer")
var MongoClient = require("mongodb").MongoClient


let date = new Date()

const dateNow = date.getTime()


const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        // callback(null,"public/uploads/images")
        callback(null,"../../client/public/uploads/images")

    },


    filename: function (request, file, callback,) {
        callback(null, dateNow+file.originalname);
    }
})


const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 3
    }
})



router.post('/', upload.single("Img"), function (req, res, next) {


    MongoClient.connect("mongodb://localhost:27017", (err, client) => {

        if(err){
            console.log(err)
        }
        else{
            let data = {
                caption:req.body.caption,
                ImgName:dateNow+req.body.ImgName,
                feedby:req.body.feedby,
                likes:0,
                comments:0,
                likedUsers:[]

            }    
            client.db("feed_app").collection("Feed").insertOne(data).then(()=>{
                res.json("feed added")
            }).catch((err)=>{
                res.status(400).json("err"+err)

            })
        }
    
      })

});

module.exports = router;