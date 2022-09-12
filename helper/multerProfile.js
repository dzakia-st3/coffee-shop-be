const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profile')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${uniqueSuffix}-${file.originalname}`)
    }
})

const fileFilter = (req, file, cb) => {
    cb(null, true) 
}

let upload = multer({
    storage: storage,
    fileFilter: fileFilter
})

module.exports = upload.single('image');

// const upload = multer({storage: storage})

// module.exports = upload