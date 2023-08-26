const router = require('express').Router()
const connection = require('../Schemas/Connection')
const { body, validationResult } = require('express-validator')
const register = require('./Register')
const sendMail = require('./mailer')
const RecaptchaVerify = require('./RecaptchaVerify')

router.post('/generate', async (req, res) => {
    const { email, fName, lName, reCaptchaValue } = req.body
    try {
        if (await RecaptchaVerify(reCaptchaValue)) {
            connection.query(`select * from CUSTOMER where email='${email}'`, (err, result) => {
                if (err) throw err
                if (result.length !== 0) {
                    return res.status(400).json({ msg: 'User with this email already exists!!' })
                }
                connection.query(`select * from OTP where email='${email}'`, (err, result) => {
                    if (err) throw err
                    if (result.length == 0) {
                        const otp = (Math.random() * 1000000).toFixed(0)
                        connection.query(`insert into OTP (otp_value,email) values ('${otp}','${email}')`, (err) => {
                            if (err) throw err
                            sendMail(email, otp, fName, lName);
                            return res.status(200).json({ msg: 'OTP SENT SUCCESSFULLY' })
                        })
                    } else {
                        const [bool, minutesRemaining] = [...isOTPExpired(result)]
                        if (!bool) {
                            return res.status(400).json({ msg: `Please wait ${((2 - minutesRemaining) * 60).toFixed(0)} seconds to generate new OTP` })
                        } else {
                            const otp = (Math.random() * 1000000).toFixed(0)
                            connection.query(`UPDATE OTP set otp_value = '${otp}' where email = '${email}'`, (err) => {
                                if (err) throw err
                                sendMail(email, otp, fName, lName);
                                return res.status(200).json({ msg: 'OTP SENT SUCCESSFULLY' })
                            })
                        }
                    }
                })
            })
        } else {
            return res.status(400).json({ msg: 'Please Verify Captcha!! ' })
        }
    } catch (error) {
        return res.status(500).json({ err: 'Internal Server Error !!' })
    }
})

router.post('/verify', (req, res) => {

    const { email, userOtp } = req.body;

    if (userOtp === undefined || userOtp === null) {
        return res.status(400).json({ err: 'Bad request OTP not found' })
    }
    try {
        connection.query(`SELECT * FROM otp WHERE email = '${email}'`, (err, result) => {
            if (err) throw err
            if (result[0].otp_value !== undefined) {
                if (result[0].is_verified == false) {
                    const [bool] = [...isOTPExpired(result)]
                    if (!bool) {
                        if (result[0].otp_value === userOtp) {
                            connection.query(`UPDATE OTP set is_verified=${true} where email='${email}'`, (err) => {
                                if (err) throw err
                                return register(req, res);
                            })
                        } else {
                            return res.status(400).json({ msg: 'INVALID OTP' })
                        }
                    } else {
                        return res.status(400).json({ msg: 'OTP EXPIRED' })
                    }
                } else {
                    return res.status(400).json({ msg: 'INVALID OTP' })
                }
            } else {
                return res.status(400).json({ msg: 'INVALID OTP' })
            }
        })
    } catch (error) {
        return res.status(500).json({ err: 'INTERNAL SERVER ERROR' })
    }
})

const isOTPExpired = (result) => {
    const minutesRemaining = Math.abs(new Date() - result[0].updated_at) / (1000 * 60)
    if (minutesRemaining < 2) {
        return [false, minutesRemaining];
    }
    return [true, minutesRemaining];
}

module.exports = router