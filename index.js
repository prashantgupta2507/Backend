require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connection = require('./Schemas/Connection')
const { createUser, createAddress, createCategory, createProduct, createOrder, createSubOrder, creatOtp } = require('./Schemas/Tables')
const deleteOTP = require('./schedular/DeleteExpiredOtp')

const app = express()
const port = 5500;

connection.connect()

// Creating Tables if not exists on every request
app.use(cors())
app.use(express.json())
app.use(createUser)
app.use(createAddress)
app.use(createCategory)
app.use(createProduct)
app.use(createOrder)
app.use(createSubOrder)
app.use(creatOtp)

//User Account related routes
app.use('/api/auth', require('./Auth/Login'))
app.use('/api/otp', require('./Auth/Otp'))

//admin related routes
app.use('/api/admin', require('./Admin/fetchAllUsers'))
app.use('/api/admin', require('./Admin/fetchAllOrders'))
app.use('/api/admin', require('./Admin/fetchAllProducts'))
app.use('/api/admin', require('./Admin/AddProduct'))
app.use('/api/admin', require('./Admin/PendingOrders'))
app.use('/api/admin', require('./Admin/Dashboard'))
app.use('/api/admin', require('./Admin/DeleteProduct'))
app.use('/api/admin', require('./Admin/UpdateProduct'))
app.use('/api/admin', require('./Admin/ConfirmOrder'))
app.use('/api/admin', require('./Admin/CancelOrder'))

//user related routes
app.use('/api/user', require('./User/fetchProduct'))
app.use('/api/user', require('./User/updatePhone'))
app.use('/api/user', require('./User/updateUserInfo'))
app.use('/api/user', require('./User/addAddress'))
app.use('/api/user', require('./User/getAddress'))
app.use('/api/user', require('./User/deleteAddress'))
app.use('/api/user', require('./User/test'))

//order related routes
app.use('/api/order', require('./orders/addOrder'))
app.use('/api/order', require('./orders/getOrders'))

app.listen(port, () => {
    console.log(`Server started at port ${port}`)
    deleteOTP()
})