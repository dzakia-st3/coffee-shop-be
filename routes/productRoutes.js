const express = require ("express")
const {getAllProduct, getProductbyId, addNewProduct, updateProduct, deleteProduct} = require('../controller/productController')
const router = express.Router ()
const upload = require('../helper/multer')
// const verifyAuth = require('../helper/verifyAuth')
const validation = require('../helper/validation')

router.get('/', getAllProduct)
router.post('/', upload, validation, addNewProduct)
router.get('/:product_id', getProductbyId)
router.patch('/:product_id', upload, validation, updateProduct)
router.delete('/:product_id', deleteProduct)



module.exports = router