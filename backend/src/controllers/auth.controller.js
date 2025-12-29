const discordOAuth = require("../services/discordOAuth.service")
const userService = require("../services/user.service")

exports.discordCallback = async (req, res) => {
    try {
        const { code, state } = req.query
        if (!code || typeof code !== "string") {
            return res.redirect("/?error=missing_code")
        }

        if (process.env.OAUTH_USE_STATE === "true") {
            if (!state || state !== req.session?.oauth_state) {
                return res.status(400).send("Ungültiger OAuth-Status. Bitte erneut versuchen.")
            }
            delete req.session.oauth_state
        }

        const discordUser = await discordOAuth.exchangeCode(code)
        if (!discordUser?.id || !discordUser?.username) {
            return res.redirect("/?error=missing_user_info")
        }

        const result = await userService.handleDiscordLogin(discordUser, req.session)

        req.session.save(() => {
            res.redirect(result.redirectTo)
        })

    } catch (err) {
        console.error("Discord OAuth Fehler:", err?.response?.data || err.message || err)
        res.redirect("/?error=oauth_error")
    }
}
