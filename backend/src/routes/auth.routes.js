const router = require("express").Router()
const authController = require("../controllers/auth.controller")

router.get("/dc-auth", authController.discordCallback)

module.exports = router
