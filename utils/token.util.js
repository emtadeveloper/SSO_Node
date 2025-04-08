const crypto = require('crypto');
const { URL } = require('url');
const redis = require('../config/redis.config');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const consumer = require('../consumer');

const privateKey = fs.readFileSync('./keys/private_key.pem');

exports.makeToken = async (url, req, res) => {
    const urlObj = new URL(url);
    const origin = urlObj.origin;

    if (!consumer[origin]) return res.redirect('/');

    const rawData = `${Date.now()}${req.session.user_id}${req.session.email}${req.session.id}${Math.random()}`;
    const token = crypto.createHash('sha256').update(`salt${rawData}salt`).digest('hex');

    const key = `sso_token_${token}`;
    await redis.hset(key, {
        consumer_url: origin,
        token,
        session_user_id: req.session.id,
    });
    await redis.expire(key, 300); // 5 minutes

    return res.redirect(`${origin}/?token=${token}`);
};

exports.generateSignToken = (data) => {
    try {
        return jwt.sign(data, privateKey, {
            algorithm: 'RS256',
            issuer: 'SSO-Server',
            expiresIn: '1h',
        });
    } catch {
        return '';
    }
};
