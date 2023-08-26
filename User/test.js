const router = require('express').Router()


router.post('/test', (req, res) => {
        return res.status(200).json({ Status: "Success", Details: "API Working Fine!!" })
    }
)

module.exports = router