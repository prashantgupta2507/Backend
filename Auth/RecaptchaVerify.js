
const RecaptchaVerify = async (reCaptchaValue) => {

    const RECAPTCHA_SERVER_KEY = process.env.RECAPTCHA_SERVER_KEY

    // Validate Human
    const isHuman = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
        method: "post",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        },
        body: `secret=${RECAPTCHA_SERVER_KEY}&response=${reCaptchaValue}`
    })
        .then(res => res.json())
        .then(json =>json.success)
        .catch(err => {
            throw new Error(`Error in Google Siteverify API. ${err.message}`)
        })

    if (reCaptchaValue === null || !isHuman) {
        return false;
    }
    return true;

}

module.exports = RecaptchaVerify