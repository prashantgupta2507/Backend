const router = require('express').Router()
const { body, validationResult } = require('express-validator')
const connection = require('../Schemas/Connection')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', [body('email', 'Enter a valid Email').isEmail(), body('password', 'Password is too short!!').isLength(6)], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })
    // check whether the user exist with this email
    try {
        const { email, fName, lName, password, admin } = req.body;
        if (!email)
            return res.status(400).json({ Status: "Failure", Details: "Email not be null" })
        if (!fName)
            return res.status(400).json({ Status: "Failure", Details: "First name not be null" })
        if (!lName)
            return res.status(400).json({ Status: "Failure", Details: "Last name not be null" })
        if (!password)
            return res.status(400).json({ Status: "Failure", Details: "Password not be null" })

        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(password, salt);
        connection.query(`select * from CUSTOMER where CUSTOMER.email='${email}'`, async (err, result) => {
            if (err) throw err
            if (result.length != 0)
                return res.status(400).json({ errors: new Array({ "msg": "Sorry a user with this email already exists" }) })
            const token = jwt.sign({ email, password }, process.env.TOKEN_KEY, { expiresIn: "2h" })
            if (admin === false) {
                connection.query(`insert into CUSTOMER (email, password,first_name,last_name) values('${email}','${secPass}','${fName}','${lName}')`, (err) => {
                    if (err) throw err
                    return res.status(201).json({ Status: "Success", Details: "User Registration Successfull", "Data": { email, password, fName, lName, token } })
                })
            } else {
                connection.query(`insert into CUSTOMER (email, password,first_name,last_name, admin) values('${email}','${secPass}','${fName}','${lName}',${true})`, (err) => {
                    if (err) throw err
                    return res.status(201).json({ Status: "Success", Details: "User Registration Successfull", "Data": { email: email, password: password, fName: fName, lName: lName, admin: true, token } })
                })
            }
        })
    } catch (error) {
        res.status(500).send("Internal Server Error")
    }
}
)

module.exports = router;