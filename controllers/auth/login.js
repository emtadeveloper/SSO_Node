const db = require('../../db');

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
    console.log("Redirect URL:", redirectUrl, data);

    return res.render("login", { ...data, redirectUrl });
};

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await db.login(email, password);
    const redirectUrl = req.query.url || ''
    console.log(redirectUrl);
    if (req.session?.user_id) {
        return res.redirect('/');
    }

    if (user?.id) {
        req.session.user_id = user.id;
        req.session.email = user.email;

        return res.redirect(redirectUrl);
    } else {
        return res.redirect("/login?msg=error1&url=" + redirectUrl);
    }
};
