var { CommandBuilder, Embed } = require('../../Builder'), { prefix } = require('../../config'), path = require('path');

new CommandBuilder(path.parse(__filename).name)
    .setName('help', 'h')
    .setexec((message, args) => {
        if (!args[0]) message.channel.send(`\`${prefix}help modules\`\n\`${prefix}help [cmds]\``)
        let eb = new Embed(true)
        if (args[0] == 'modules') {
            modules.forEach((value, key, map) => {
                let alias = ``
                value.forEach(v => alias += `${v}\n`)
                eb.addField(`${key}`, `${alias}`, true)
            })
        } else {
            let cmd = commands.get(aliases.get(args[0]) || args[0])
            cmd.aliases.forEach(als => alias += `${als} `)
            eb.setDescription(`**${cmd.name}**\nalias:${alias}\n\n${cmd.description}`)
        }
        message.channel.send({ embeds: [eb] })
    })