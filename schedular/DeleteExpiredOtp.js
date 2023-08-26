const crone = require('node-cron')
const connection  = require('../Schemas/Connection')

const deleteOTP = () => {
    crone.schedule('*/5 * * * *', () => {
        connection.query(`DELETE FROM OTP WHERE is_verified=${true} OR updated_at< (NOW()- INTERVAL 5 MINUTE)`, (err)=>{
            if(err) console.log(err)
        })
    })
}

module.exports = deleteOTP