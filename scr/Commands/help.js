var { TmpEb, Embed, CommandBuilder, modules, Commands, aliases } = require('../../setting/Builder'), { prefix } = require('../../config');

new CommandBuilder(__filename.slice(__dirname.length + 1, -3))
    .setName('help', 'h')
    .setexec((message, args) => {
        if (!args[0]) return message.channel.send(`\`${prefix}help modules\`\n\`${prefix}help [cmds]\``)
        const eb = new Embed(true)
        let scr = Commands.get(aliases.get(args[0]))
        if (!scr) {
            scr = modules.get(args[0])
            if (scr) eb.addField(args[0], scr.join('\n'))
            else Array.from(modules).forEach(mod => eb.addField(mod[0], mod[1].join('\n'),true))
        } else eb.addField(`**\`${scr.alias.join('`/`')}\`**`, `${scr.description}`)
            .addField('權限需求', `${scr.permissions.join('\n')}` || `null`)
            .addField('使用範例', `${scr.example}` || `${scr.name}`)
            .setFooter({ text: `前綴: \`${prefix}\` | 模組:${scr.module}` })
        message.channel.send({ embeds: [eb] })
    })