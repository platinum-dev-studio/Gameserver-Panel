const { findUserByDiscordID, usersFs, saveUsersFs } = require("../usersFs")

exports.handleDiscordLogin = async (discordUser, session) => {
  const { id, username, avatar } = discordUser

  const existing = findUserByDiscordID(id)
  const now = new Date().toISOString()

  if (existing) {
    const u = usersFs[existing.index]

    if (u.username !== username || u.avatar !== avatar) {
      u.username = username
      u.avatar = avatar
      u.updatedAt = now
    }

    u.lastLoginAt = now
    session.user = u
    await saveUsersFs()

    return {
      redirectTo: u.role ? "/panel" : "/access-pending"
    }
  }

  const newUser = {
    discordID: id,
    username,
    avatar,
    role: null,
    notes: "Access to be granted",
    grantedBy: null,
    grantedAt: null,
    expiresAt: null,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
    lastSeenAt: now,
    uuid: null
  }

  usersFs.push(newUser)
  await saveUsersFs()

  session.user = { discordID: id, username, avatar }

  return {
    redirectTo: "/access-pending"
  }
}