const express = require("express");
const app = express()
const productRoute = require('./productRoutes')
const authRoute = require('./authRoute')
const userRoutes = require('./userRoutes')



app.use('/product', productRoute)
app.use('/auth', authRoute)
app.use('/user', userRoutes)


module.exports = app