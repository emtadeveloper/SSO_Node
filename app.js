const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
dotenvExpand.expand(dotenv.config());

const session = require('express-session');
const RedisStore = require('connect-redis').RedisStore;
const ioredis = require('ioredis');
const ioredisClient = new ioredis("127.0.0.1:6379");

// Middlewares
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "html"));

app.use(session({
    store: new RedisStore({ client: ioredisClient, prefix: "sso_server_sess:" }),
    secret: "78a7sd9asd90as7d07as86d86sa7d6as786d87asd57" || "secret",
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

// Home route
app.get("/", async (req, res) => {
    const url = req.query?.url ?? '';
    const data = { url };
    if (req.session?.user_id && req.session.email) {
        data['user'] = req.session.email;
    } else {
        delete req.session.user_id;
        delete req.session.email;
        data['user'] = '';
    }
    return res.render("home", data);
});

// Auth Routes
const authRoutes = require('./routers/auth');

app.use(authRoutes);

// 404 & error handler
app.use((req, res) => res.status(404).send("404 !"));
app.use((err, req, res, next) => res.status(500).send(err.toString()));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SSO Server is run on port ${PORT}`));
