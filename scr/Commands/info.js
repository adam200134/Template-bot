const { CommandBuilder,Embed } = require('../../Builder') = require('../setting/ExecuteBuilder')

const path = require('path');
new CommandBuilder(path.parse(__filename).name)
    .setName('ping')
    .setexec((message, args) => {
        message.channel.send('Pinging...').then(msg => {
            msg.edit(`Pong! **${client.ws.ping} ms**`).then(m => {
                setTimeout(() => { m.delete() }, 2000)
            })
        })
    })
    .setName('guildrole','gr')
    .setexec((message, args) => {
        let user = message.mentions.users.first() || message.author

        let role = message.guild.members.cache.get(user.id).roles.cache
            .filter(r => r.id != message.guild.id)
            .map(r => r.toString())

        let embed = new Embed(true)
            .setDescription(`**${user} has :**\n${role}`)
            .setTimestamp()

        message.channel.send({ embeds: [embed] })
    })
    .setName('roleuser,','ru')
    .setexec((message, args) => {
        let role = message.mentions.roles.first()
        if (!role) role = message.guild.roles.cache.get(`${args[0]}`)
        let user = [`${message.author}`]
        role.members.each(m => user.push(m.user))
        user.length = 20
        let embed = new Embed(true)
            .setTitle(`${role.name} roles list`)
            .setDescription(`${user}`)
            .setTimestamp()

        message.channel.send({ embeds: [embed] })
    })
    .setName('guilddata','gd')
    .setexec((message, args) => {
        let embed = new Embed(true)
            .setTitle(`Total Members`)
            .setDescription(`👥 ${message.guild.memberCount}\n\n**Human**\n👤${message.guild.members.cache.filter(member => !member.user.bot).size}
        \n**Bot**\n🤖 ${message.guild.members.cache.filter(member => member.user.bot).size}`)
            .setThumbnail(message.guild.iconURL({ size: 4096, dynamic: true }))
            .setTimestamp()
        message.channel.send({ embeds: [embed] })
    })