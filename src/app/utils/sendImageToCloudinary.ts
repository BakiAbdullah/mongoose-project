import { v2 as cloudinary } from 'cloudinary'
import config from '../config'
import multer from 'multer'

export const sendImageToCloudinary = () => {
  cloudinary.config({
    cloud_name: 'dbknbnlb0',
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
  })

  cloudinary.uploader.upload(
    'https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg',
    { public_id: 'olympic_flag' },
    function (error, result) {
      console.log(result)
    },
  )
}

//todo: Multer code below for parsing file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  },
})

export const upload = multer({ storage: storage })
