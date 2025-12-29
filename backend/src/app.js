const express = require("express")
const session = require("express-session")
const authRoutes = require("./routes/auth.routes")

// =========== Environment Variables Check =========== //
if (!process.env.SESSION_SECRET) throw new Error("SESSION_SECRET ist nicht in den Umgebungsvariablen definiert.")

// =========== Express App Initialization =========== //
const app = express()

// =================== Middleware =================== //
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session({
    name: 'sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    }
}))
app.use(authRoutes)

module.exports = app