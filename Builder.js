const PermissionString = 'ADMINISTRATOR' || 'KICK_MEMBERS' || 'BAN_MEMBERS' || 'ADD_REACTIONS' || 'SEND_MESSAGES' || 'MUTE_MEMBERS' || 'MANAGE_ROLES'
    || 'MANAGE_WEBHOOKS' || 'MANAGE_EMOJIS_AND_STICKERS' || 'USE_APPLICATION_COMMANDS', { client, GuildId, token } = require("./config"),
    Rest = new (require('@discordjs/rest')).REST({ version: '9' }).setToken(token), { SlashCommandBuilder } = require("@discordjs/builders"),
    { Routes } = require('discord-api-types/v9'), { Message, CommandInteraction, ButtonInteraction, MessageEmbed } = require("discord.js"),
    ICommandData = new Array(), modules = new Map(), aliases = new Map(), Commands = new Map(), ICommands = new Map(), Ibuttons = new Map();
/** ICommandUpdate */
const ICommandSet = {
    /** TestICommand */
    test() {
        Rest.put(Routes.applicationGuildCommands(client.user.id, GuildId), { body: ICommandData })
    },
    /** ApplyGolbalICommand */
    Golbal() {
        Rest.put(Routes.applicationCommands(client.user.id), { body: ICommandData })
    },
    /** ApplyGuildsICommand */
    Guild() {
        client.guilds.cache.forEach(g => Rest.put(Routes.applicationGuildCommands(client.user.id, g.id), { body: ICommandData }))
    },
    /** ClearGuildsICommand */
    clear() {
        client.guilds.cache.forEach(g => Rest.put(Routes.applicationGuildCommands(client.user.id, g.id), { body: [] }))
        return this
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
        this.name = this.alias.shift()
        return this
    }
    /** @param {PermissionString} permission */
    setPermissions(...permission) {
        this.permissions = permission
        return this
    }
    /** @param {(message:Message,args:string[])} exec */
    setexec(exec) {
        if (!this.name) {
            console.error('COMMAND_NAME_FAILED:\t Undefined CommandName or Not a String');
            return this
        }
        if (typeof exec != 'function') {
            console.error('COMMAND_EXECUTE_FAILED:\t Undefined CommandExecute or Not a Function');
            return this
        }
        this.cmdlist = modules.get(this.module) || []
        this.cmdlist.push(this.name)
        modules.set(this.module, this.cmdlist)
        Commands.set(this.name, { modules: this.module, aliases: this.alias, permissions: this.permissions, run: exec })
        this.alias.forEach(als => aliases.set(als, this.name))
        return this
    }
}
class ICommandBuilder extends SlashCommandBuilder {
    /** @param {PermissionString} permission */
    setRolePermission(...permission) {
        this.setDefaultPermission(false)
        permission.concat('ADMINISTRATOR')
        this.permissions = []
        client.guilds.cache.forEach(g => g.roles.cache.forEach(r => {
            if (r.permissions.has(permission) && r.members.find(m => !m.user.bot))
                this.permissions.push({ id: r.id, type: 1, permission: true })
        }))
        return this
    }
    /** @param {(interaction:CommandInteraction)} exec */
    setexec(exec) {
        ICommands.set(this.name, { name: this.name, permissions: this.permissions, run: exec })
        ICommandData.push(this.toJSON());
        return this
    }
}
class Embed extends MessageEmbed {
    /** @param {boolean} key */
    constructor(key) {
        if (typeof key != 'boolean') return super()
        if (!key) return super().setColor('#a00000')
        return super().setColor('#20c080')
    }
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
 * @default
 * let _ = new Embed((typeof args[0] == 'boolean') ? args.shift() : null)
 * return args[0] ? _.setDescription(Temp(...args)) : _
 */
function TmpEb(...args) {
    let _ = new Embed((typeof args[0] == 'boolean') ? args.shift() : null)
    return args[0] ? _.setDescription(Temp(...args)) : _
}
module.exports = {
    modules, aliases, Commands, ICommands, Ibuttons, ICommandSet,
    ButtonBuilder, CommandBuilder, ICommandBuilder, Temp, TmpEb
}