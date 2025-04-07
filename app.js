const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const express = require('express');
const app = express();
const path = require('path');

dotenv.config()

const PORT = process.env.PORT

app.use(express.static("assets"))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use(express.json({ limit: "10mb" }))

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "html"));

const ioredis = require('ioredis');
const ioredisClient = new ioredis("127.0.0.1:6379")

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
        maxAge: 10 * 60 * 60 * 1000, // 10 ساعت
        sameSite: "lax"
    }
}));



app.get("/", async (req, res) => {
    return res.render("home")
})

app.get("/login", async (req, res) => {
    return res.render("login")
})

app.post("/login", async (req, res) => {
    return res.send("login")
})

app.get("/register", async (req, res) => {
    return res.render("register")
})

app.post("/register", async (req, res) => {
    return res.send("post register !")
})

app.get("/logout", async (req, res) => {
    return res.send("register !")
})


app.listen(PORT, async () => {
    console.log("SSO Server is run ....");
}) 