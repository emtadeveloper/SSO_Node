exports.logout = (req, res) => {
    if (req.session?.user_id) {
        delete req.session.user_id;
        delete req.session.email;
    }
    return res.redirect("/");
};
