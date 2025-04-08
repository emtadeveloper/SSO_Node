const db = require('../../db');
const consumer = require('../../consumer');
const crypto = require('crypto');
const { ioredisClient } = require('../../app');
const jsonWebToken = require('jsonwebtoken');

exports.getLogin = (req, res) => {
    if (req.session?.user_id) {
        return res.redirect('/');
    }

    const url = req.query?.url ?? '';

    const data = {
        "url": url
    };

    if (req.query.msg === "error1") {
        data['msg'] = 'email or password incorrect';
    } else {
        data['msg'] = ''
    }

    const redirectUrl = req.query.url || '/';

    return res.render("login", { ...data, redirectUrl });
};

exports.postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await db.login(email, password);
        const redirectUrl = req.query.url || '/'
        if (req.session?.user_id) {
            return res.redirect('/');
        }

        if (user?.id) {
            req.session.user_id = user.id;
            req.session.email = user.email;
            if (redirectUrl.trim() != '') {
                const urlObject = new URL(redirectUrl)
                if (consumer[urlObject.origin]) {
                    const data = random(1000000, 999999999) + new Date().getTime() + req.session.email + random(1000000, 999999999)
                    const token = crypto.createHash('sha256').update('salt' + data + "salt").digest('hex')
                    const key = 'SSO_token_' + token
                    await ioredisClient.hset(key, {
                        "url": urlObject.origin,
                        "token": token,
                        "session_user_id": req.session.id
                    })
                    await ioredisClient.expire(key, 60 * 5)
                    return res.redirect(`${urlObject.origin}/?token=${token}`);

                } else {
                    return res.redirect("/")
                }
            } else {
                return res.redirect(redirectUrl);
            }

        } else {
            return res.redirect("/login?msg=error1&url=" + redirectUrl);
        }
    } catch (error) {
        return res.status(500).send(error.toString())
    }
};


exports.verifyToken = async (req, res, next) => {
    try {
        const { consumer_url, token, sso_token } = req.body;
        if (consumer === sso_token) {
            if (consumer[consumer_url] === sso_token) {
                const checkTokenUser = await ioredisClient.hget("sso_token_" + token)
                if (checkTokenUser && checkTokenUser?.token == token && checkTokenUser?.consumer_url === consumer_url) {
                    const sessionUser = await ioredisClient.get("sso_server_sess:" + checkTokenUser.session_user_id);
                    if (sessionUser) {
                        const sessionData = JSON.parse(sessionUser)
                        await ioredisClient.del("sso_token_" + token)
                        const jwtToken = await generateSignToken({
                            "email": sessionData?.email,
                            "user_id": sessionData?.user_id
                        })
                        return res.json({
                            "status": 0,
                            "msg": "sucess",
                            "data": jwtToken
                        })
                    } else {
                        return res.json({
                            "status": -5,
                            "msg": "err5"
                        })
                    }

                } else {
                    return res.json({
                        "status": -3,
                        "msg": "err4"
                    })
                }
            } else {
                return res.json({
                    "status": -2,
                    "msg": "err3"
                })
            }

        } else {
            return res.json({
                "status": -4,
                "msg": "err3"
            })
        }

    } catch (error) {
        return res.status(500).json({
            "status": -1,
            "msg": "error" + error.toString()
        })
    }
};

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const fs = require('fs');

const privateKey = fs.readFileSync('../../keys/private_key.pem')

async function generateSignToken(data) {
    try {
        return jsonWebToken.sign({ ...data }, privateKey, {
            algorithm: "RS256",
            issuer: "SSO_Server",
            expiresIn: "1h"
        })
    } catch (error) {
        return ''
    }

}