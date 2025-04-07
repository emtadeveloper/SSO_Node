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