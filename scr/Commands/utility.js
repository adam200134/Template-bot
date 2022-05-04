
const { CommandBuilder,Embed } = require('../../setting/Builder');

new CommandBuilder(__filename.slice(__dirname.length + 1, -3))
    .setName('avater','av')
    .setexec((message, args) => {
        let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
        const embed = new Embed(true).setImage(user.displayAvatarURL({ size: 4096, dynamic: true, format: "png" }))
        message.channel.send({ embeds: [embed] })
    })
    .setName('say')
    .setexec((message, args) => {
        let ctx = ''
        for (let i = 0; i < args.length; i++) {
            ctx = ctx + ' ' + args[i]
        }
        message.channel.send(ctx)
    })
    .setName('emoji','emj')
    .setexec((message, args) => {
        let emoji = ``
        let noemj = ``
        for (let i = 0; i < args.length; i++) {
            let emj = message.guild.emojis.cache.find(e => e.name == args[i])
                (!emj) ? noemj += `${args[i]}\, `
                : (emj.animated == true) ? emoji = emoji += `https://cdn.discordapp.com/emojis/${emj.id}.gif`
                    : emoji += `<:${emj.name}:${emj.id}> `;
        }
        console.log(emoji)
            (emoji != ``) ? message.channel.send({ content: `${emoji}`, embeds: [new Embed(true).setDescription(`USED BY ${message.author}`)] })
            : message.channel.send({ embeds: [new Embed(true).setDescription(`${message.author} 此伺服器沒有下列表情符號\n${noemj}`)] })
    })