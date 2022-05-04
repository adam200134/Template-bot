var { GuildMember, Message } = require('discord.js'), { client, db, Embed, prefix, ownerID, ICommands, Commands, modules } = require('./Builder')

/**@param {GuildMember} user */
function useradd(user) {
    if (user.bot) return true
    if (db.prepare(`SELECT id FROM data WHERE uid = '${user.id}'`).get()) return false
    db.prepare(`INSERT OR IGNORE INTO data (uid) VALUES ('${user.id}')`).run()
    try { db.prepare(`UPDATE data SET user = '${user.username}' WHERE uid ='${user.id}'`).run() }
    catch (error) { db.prepare(`UPDATE data SET user = ' ' WHERE uid ='${user.id}'`).run() }
    console.log(`\n${new Date().toLocaleString()}\n${user.tag} 已更新`)
    return false
}

/**
 * @param {Message} message 
 * @param {Message} update 
 */
function updel(message, update) {
    try {
        if (message.author.bot) return
        if (typeof update != 'undefined')
            if (message.embeds == update.embeds || message.content == update.content) return
        if (!message.attachments.first() || !message.guild) return
        const channel = message.guild.channels.cache.find(c => c.name == 'snipes')
        if (!channel) return
        channel.send({
            embeds: [new Embed(true).setDescription(`${message.channel} ${message.author}`)
                .setFooter({ text: `Id:${message.id}` }).setTimestamp(message.createdAt.toString())]
        })
        message.attachments.forEach(({ url }) => {
            try { channel.send({ files: [{ attachment: url }] }) } catch (error) { channel.send(`${url}`) }
        })
    } catch (error) { }
}

/**
 * @param {Message} message
 * @param {object} command
 */

function chack(message, command) {
    if (!command) return false
    if (message.user.id != ownerID) {
        if (!message.member.permissions.has(['SEND_MESSAGES', 'ADMINISTRATOR'][i])) return false
    }
    let r = (db.prepare(`SELECT * FROM permit WHERE usage = 'all' usage = '${prefix}${command.name}' OR usage = '${command.module}'`).all())
        .filter(({ guild }) => { guild == message.guildId }).reverse()
    while (0 < r.length) {
        if (message.author.id == r[0].target || message.channelId == r[0].target ||
            r[0].type == 3 || message.member.roles.cache.has(r[0].target)) return r[0].value
        r.shift()
    }
}