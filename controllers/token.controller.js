const { makeToken, generateSignToken } = require('../utils/token.util');
const redis = require('../config/redis.config');
const consumer = require('../consumer');

exports.homePage = async (req, res) => {
    const url = req.query?.url ?? '';
    if (url && req.session?.user_id) {
        return await makeToken(url, req, res);
    }

    return res.render('home', {
        url,
        user: req.session?.email || '',
    });
};

exports.verifyToken = async (req, res) => {
    try {
        const { consumer_url, token, sso_token } = req.body;
        console.log(consumer[consumer_url], consumer[consumer_url], sso_token, consumer_url);
        if (!consumer[consumer_url] || consumer[consumer_url] !== sso_token)
            return res.json({ status: -2, msg: 'invalid consumer or token' });

        const tokenInfo = await redis.hgetall("sso_token_" + token);
        if (!tokenInfo || tokenInfo.token !== token) {
            return res.json({ status: -3, msg: 'token mismatch' });
        }

        const sessionRaw = await redis.get('sso_server_sess:' + tokenInfo.session_user_id);
        if (!sessionRaw) {
            return res.json({ status: -4, msg: 'session expired' });
        }

        await redis.del("sso_token_" + token);
        const session = JSON.parse(sessionRaw);

        const jwt = await generateSignToken({
            email: session.email,
            user_id: session.user_id,
        });

        return res.json({ status: 0, msg: 'success', data: jwt });
    } catch (e) {
        return res.status(500).json({ status: -1, msg: e.toString() });
    }
};
