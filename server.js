const express = require("express")
const { QuickDB } = require("quick.db")

const db = new QuickDB()
const app = express()
app.set('view engine', 'html');

app.set("view engine", "ejs")

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


// signup
app.post("/signup", async (req, res) => {

    const { username, password } = req.body

    const user = await db.get(`users.${username}`)

    if (user) return res.send("User exists")

    await db.set(`users.${username}`, {
        username,
        password
    })

    res.send("Account created")

})

// login
app.post("/login", async (req, res) => {

    const { username, password } = req.body

    const user = await db.get(`users.${username}`)

    if (!user) return res.send("User not found")

    if (user.password !== password)
        return res.send("Wrong password")

    res.send("Login successful")

})

app.get("/", async (req,res) => {
    res.render("index", {title: "Login Signup", message: null})
})


app.listen(3000)