exports.getRegister = (req, res) => {
    if (req.session?.user_id) return res.redirect('/');
    return res.render("register");
};

exports.postRegister = (req, res) => {
    if (req.session?.user_id) return res.redirect('/');
    return res.send("post register !");
};
