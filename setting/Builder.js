const db = require('better-sqlite3')('./data.db'), { prefix, ownerID, TestGuildId, color, token, gc, actline } = require('../config.json'), 
    { Client, Message, CommandInteraction, ButtonInteraction, MessageEmbed, Collection } = require("discord.js"), { SlashCommandBuilder } = require("@discordjs/builders"),
    PermissionString = 'ADMINISTRATOR' || 'BAN_MEMBERS' || 'KICK_MEMBERS' || 'MUTE_MEMBERS' || 'MANAGE_ROLES' || 'MANAGE_WEBHOOKS' || 'SEND_MESSAGES' || 'ADD_REACTIONS',
    client = new Client({ intents: 32767 }), rest = new (require('@discordjs/rest')).REST({ version: '9' }).setToken(token), { Routes } = require('discord-api-types/v9'),
    ms = require('ms'), fs = require('fs'), ICommandData = [], guildgc = new Set(),
    computers = new Collection(), modules = new Collection(), aliases = new Collection(), Commands = new Collection(), ICommands = new Collection(), Ibuttons = new Collection()

const rd = {
    dot(i) { return Math.random() * i },
    int(i) { return Math.floor(Math.random() * i) },
    a2b(j, i) { return Math.floor(Math.random() * (i - j)) + j }
}

const delmsg = (msg, time) => setTimeout(() => { msg.delete(); }, time)

/** ICommandUpdate */
const ICommandSet = {
    /** TestICommand */
    test() {
        rest.put(Routes.applicationGuildCommands(client.user.id, TestGuildId), { body: ICommandData })
        return '!!!VERSION TEST!!!'
    },
    /** ApplyGolbalICommand & ClearTest */
    Golbal() {
        rest.put(Routes.applicationGuildCommands(client.user.id, TestGuildId), { body: [] })
        rest.put(Routes.applicationCommands(client.user.id), { body: ICommandData })
        return actline.length
    }
}
class ButtonBuilder {
    /** 
     * @param {String} btnId
     * @param {(interaction:ButtonInteraction)} exec
     */
    addbutton(btnId, exec) {
        if (typeof btnId == 'string' && btnId != '' && typeof exec == 'function')
            Ibuttons.set(btnId, { run: exec })
        return this
    }
}
class CommandBuilder {
    /** @param {String} module */
    constructor(module) {
        this.module = module || 'non-modular'
    }
    /** @param {String[]} alias */
    setName(...alias) {
        this.alias = alias.filter(als => typeof als == 'string' && als != '' && !als.includes(' '))
        this.name = this.alias[0]
        return this
    }
    /** @param {string} main */
    setDescription(main) {
        this.description = main
    }
    /** @param {PermissionString} permission */
    setPermissions(...permission) {
        this.permissions = permission
        return this
    }
    /** @param {(message:Message,args:Array)} exec */
    setexec(exec) {
        if (this.name && typeof exec == 'function') {
            this.cmdlist = modules.get(this.module) || []
            this.cmdlist.push(this.name)
            modules.set(this.module, this.cmdlist)
            Commands.set(this.name, { modules: this.module, aliases: this.alias, permissions: this.permissions, run: exec })
            this.alias.forEach(als => aliases.set(als, this.name))
        } else {
            console.error('COMMAND_LOAD_FAILED:\t CommandName Not a String or/and Execute Not a Function');
        }
        this.permissions = undefined
        return this
    }
}
class ICommandBuilder extends SlashCommandBuilder {
    constructor() {
        return super()
    }
    setOwnerPermission() {
        if (this.defaultPermission == false) this.permissions = [{ id: ownerID, type: 2, permission: true }]
        return this
    }
    /** @param {PermissionString[]} permission */
    setRolePermission(...permission) {
        if (this.defaultPermission == false) {
            this.permissions = this.permissions || []
            if (!permission.includes('ADMINISTRATOR')) permission.concat('ADMINISTRATOR')
            client.guilds.cache.forEach(g => g.roles.cache.forEach(r => {
                if (r.permissions.has(permission) && r.members.find(m => !m.user.bot))
                    this.permissions.push({ id: r.id, type: 1, permission: true })
            }))
        }
        return this
    }
    /** @param {(interaction:CommandInteraction)} exec */
    setexec(exec) {
        ICommands.set(this.name, { name: this.name, permissions: this.permissions, run: exec })
        ICommandData.push(this.toJSON());
        return new ICommandBuilder()
    }
}
class Embed extends MessageEmbed {
    /** @param {boolean} key */
    constructor(key) { return (typeof key == 'boolean') ? super().setColor((key) ? `${color.fin}` : `${color.wor}`) : super() }
}
/** 
 * @alias C# SrtingTemp
 * @default typeof args[0] == "string"
 */
function Temp(...args) {
    while (1 < args.length) {
        let argi = args.pop()
        if (!args[0].includes(`{${args.length - 1}}`)) continue
        let arr = args[0].split(`{${args.length - 1}}`)
        args[0] = arr.shift();
        if (0 < arr.length) args[0] += argi + arr.shift()
    }
    return args[0]
}
/**
 * @param {boolean|string} type
 */
function TmpEb(...args) {
    const embed = new Embed((typeof args[0] == 'boolean') ? args.shift() : null)
    return args[0] ? embed.setDescription(Temp(...args)) : embed
}
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
        if (typeof update != 'undefined') if (message.embeds == update.embeds || message.content == update.content) return
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

module.exports = {

    client, db, prefix, ownerID, TestGuildId, token, gc, guildgc, actline,
    modules, aliases, Commands, ICommands, Ibuttons, computers, ICommandSet,

    fs, ButtonBuilder, CommandBuilder, ICommandBuilder, Embed,
    Temp, TmpEb, useradd, updel, ms, rd, delmsg
}