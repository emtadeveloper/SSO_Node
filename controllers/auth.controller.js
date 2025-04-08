const db = require('../db');
const { makeToken } = require('../utils/token.util');

exports.loginPage = (req, res) => {
    const url = req.query?.url ?? '';
    return res.render('login', {
        url,
        msg: req.query.msg === 'err1' ? 'email or password is incorrect!' : '',
    });
};

exports.loginHandler = async (req, res) => {
    const url = req.query?.url ?? '';
    const { email, password } = req.body;
    const user = db.login(email, password);

    if (!user?.id) return res.redirect(`/login?msg=err1&url=${url}`);

    req.session.user_id = user.id;
    req.session.email = user.email;

    return url.trim() ? await makeToken(url, req, res) : res.redirect('/');
};

exports.registerPage = (req, res) => {
    if (req.session?.user_id) return res.redirect('/');
    return res.render('register');
};

exports.logoutHandler = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};
