const db = require('../../db');

exports.getLogin = (req, res) => {
    if (req.session?.user_id) return res.redirect('/');
    const data = {};
    if (req.query.msg === "error1") {
        data['msg'] = 'email or password incorrect';
        return res.json(data);
    }
    return res.render("login", data);
};

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    if (req.session?.user_id) return res.redirect('/');

    const user = await db.login(email, password);

    if (user?.id) {
        req.session.user_id = user.id;
        req.session.email = user.email;
        return res.redirect("/");
    } else {
        return res.redirect("/login?msg=error1");
    }
};
