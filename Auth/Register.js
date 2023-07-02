const connection = require('../Schemas/Connection')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {

    const { email, password, fName, lName, admin } = req.body

    // Bcrypt using Blowfish encryption algorithm
    const salt = await bcrypt.genSalt(10)   // 128 bit salt generation
    const secPass = await bcrypt.hash(password, salt);  // hashed password using bcrypt 
    connection.query(`select * from CUSTOMER where CUSTOMER.email='${email}'`, async (err, result) => {
        if (err) throw err
        if (result.length != 0)
            return res.status(400).json({ msg: "Sorry a user with this email already exists" })
        const token = jwt.sign({ email, password }, process.env.TOKEN_KEY, { expiresIn: "2h" })
        if (admin === false) {
            connection.query(`insert into CUSTOMER (email, password,first_name,last_name) values('${email}','${secPass}','${fName}','${lName}')`, (err) => {
                if (err) throw err
                return res.status(201).json({ Status: "Success", Details: "User Registration Successfull", "Data": { email, fName, lName, token } })
            })
        } else {
            connection.query(`insert into CUSTOMER (email, password,first_name,last_name, admin) values('${email}','${secPass}','${fName}','${lName}',${true})`, (err) => {
                if (err) throw err
                return res.status(201).json({ Status: "Success", Details: "User Registration Successfull", "Data": { email: email, fName: fName, lName: lName, admin: true, token } })
            })
        }
    })
}

module.exports = register