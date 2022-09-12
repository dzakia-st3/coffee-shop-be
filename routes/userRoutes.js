const express = require ("express")
const {getAllUser, addNewUser, updateUser, deleteUser} = require('../controller/userController')
const router = express.Router ()
const upload = require('../helper/multerProfile')
const verifyAuth = require('../helper/verifyAuth')
const validation = require('../helper/validation')

router.get('/', verifyAuth, getAllUser)
router.post('/', upload, validation, addNewUser)
router.patch('/:id', upload, validation, updateUser)
router.delete('/:id', deleteUser)


module.exports = router

