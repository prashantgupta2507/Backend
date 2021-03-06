const router = require('express').Router()
const connection = require('../Schemas/Connection')
const jwt = require('jsonwebtoken')

router.patch('/confirmOrder', (req, res) => {

    const { authtoken, order_id } = req.body
    if (!authtoken) {
        return res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        const decoded = jwt.verify(authtoken, process.env.TOKEN_KEY)
        connection.query(`select * from CUSTOMER where email="${decoded.email}" and admin=${true}`, (err, result) => {
            if (err) throw err
            if (result.length === 0)
                return res.status(400).send({ msg: "Bad Request" })
            connection.query(`update \`order\` set pending=${false} where order_id=${order_id} `, (err) => {
                if (err) throw err;
                return res.status(200).json({ Status: "Success", Details: "Order Confirmed Successfully" })
            })
        })
    } catch (error) {
        return res.status(500).send("Internal Server Error")
    }
})

module.exports = router;