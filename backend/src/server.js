const app = require("./app")

const PORT = 3000

app.listen(PORT, () => {
    app.listen(PORT, '0.0.0.0', () => console.log(`Server läuft auf http://localhost:${PORT} mit ${process.env.NODE_ENV}`))
})