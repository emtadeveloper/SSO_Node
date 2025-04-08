const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
dotenvExpand.expand(dotenv.config());

const express = require('express');
const app = express();
const path = require('path');
const db = require('./db');

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "assets")));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "html"));

const ioredis = require('ioredis');
const ioredisClient = new ioredis("127.0.0.1:6379");

const session = require('express-session');
const RedisStore = require('connect-redis').RedisStore;

app.use(session({
    store: new RedisStore({ client: ioredisClient, prefix: "sso_server_sess:" }),
    secret: "869sa8d8sa96d8sa6d8sa68d68sa9d689as6d98sa6fsdg6f6gd8sf698",
    name: "sso-server-app",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 10 * 60 * 60 * 1000,
        sameSite: "lax"
    }
}));

app.get("/", async (req, res) => {
    const data = {};
    if (req.session?.user_id && req.session.email) {
        data['user'] = req.session.email;
    } else {
        delete req.session.user_id;
        delete req.session.email;
        data['user'] = '';
    }
    console.log(data);
    return res.render("home", data);
});

app.get("/login", async (req, res) => {
    if (req.session?.user_id) {
        return res.redirect('/');
    }
    const data = {};
    if (req.query.msg === "error1") {
        data['msg'] = 'email or password incorrect';
        return res.json(data);
    }
    return res.render("login", data);
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (req.session?.user_id) {
        return res.redirect('/');
    }

    const user = await db.login(email, password); // اگر async هست

    if (user?.id) {
        req.session.user_id = user.id;
        req.session.email = user.email;
        return res.redirect("/");
    } else {
        return res.redirect("/login?msg=error1");
    }
});


app.get("/register", async (req, res) => {
    if (req.session?.user_id) {
        return res.redirect('/');
    }
    return res.render("register");
});

app.post("/register", async (req, res) => {
    if (req.session?.user_id) {
        return res.redirect('/');
    }
    return res.send("post register !");
});

app.get("/logout", async (req, res) => {
    if (req.session?.user_id) {
        delete req.session.user_id;
        delete req.session.email;
    }

    return res.redirect("/");
});

app.use(async (req, res) => {
    return res.status(404).send("404 !");
});

app.use(async (error, req, res, next) => {
    return res.status(500).send(error.toString()); // اصلاح toSring
});

app.listen(PORT, async () => {
    console.log("SSO Server is run on port " + PORT);
});
