const axios = require("axios")
const { guildID, guildRoleID } = require("../../../config.json")

exports.exchangeCode = async (code) => {
    const tokenRes = await axios.post(
        "https://discord.com/api/oauth2/token",
        new URLSearchParams({
            client_id: process.env.ClientID,
            client_secret: process.env.ClientSecret,
            grant_type: "authorization_code",
            code,
            redirect_uri:
                process.env.NODE_ENV === "production"
                    ? process.env.DISCORD_REDIRECT_URI
                    : "http://localhost:3000/dc-auth",
            scope: "identify guilds guilds.members.read"
        }),
        {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            timeout: 10_000
        }
    )

    const accessToken = tokenRes.data?.access_token
    if (!accessToken) throw new Error("Kein access_token erhalten")

    const user = await axios.get("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 10_000
    })

    const guilds = await axios.get("https://discord.com/api/users/@me/guilds", {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 10_000
    })

    const isMember = guilds.data.find((g) => g.id === guildID)
    if (!isMember)
        throw new Error("Du bist kein Mitglied im offiziellen Bot-Server.")

    const memberRes = await axios.get(`https://discord.com/api/users/@me/guilds/${guildID}/member`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 10_000
    })

    const roleIds = memberRes.data?.roles ?? []
    const hasRole = roleIds.includes(guildRoleID)

    return { user: user.data, guilds: guilds.data, isMember: true, hasRole }
}