import multer from "multer"
import AWS from "aws-sdk"
import multers3 from "multer-s3"

const S3=new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
})


const s3bucket=multer({
    storage:multers3({
        s3:S3,
        bucket:"nodejsmulterimage",
        acl:"public read",
        metadata:function(req,file,cb){
            cb(null, { fieldName: file.fieldname })
        },
        key: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`);
          },
    })
})



export default s3bucket

