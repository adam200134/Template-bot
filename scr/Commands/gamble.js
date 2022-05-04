const { CommandBuilder, Embed, db } = require('../../setting/Builder'), ms = require('ms');

new CommandBuilder(__filename.slice(__dirname.length + 1, -3))
    .setName('data')
    .setexec((message, args) => {
        const { author, channel } = message
        const per = db.prepare(`SELECT data FROM permit WHERE chid = '${channel.id}'`).get()
        if (!per || per.data != 1) return
        const row = db.prepare(`SELECT * FROM data WHERE uid = '${author.id}'`).get()
        const embed = new Embed(true).setTimestamp().setFooter({ text: '', iconURL: '' })
            .setAuthor({ name: `${author.tag}`, iconURL: author.displayAvatarURL(), url: '' })
            .addField(`等級：${row.level}\t經驗：${row.exp}\n金幣：${row.money}`, `上次祈福： ${row.term}\n${row.luck} ${row.number + row.side}`)

        message.channel.send({ embeds: [embed] })
    })
    
    .setName('pray')
    .setexec(async (message, args) => {
        const { author, channel, guild, member } = message
        const per = db.prepare(`SELECT pray FROM permit WHERE chid = '${channel.id}'`).get()
        if (per.pray != 1) return
        const row = db.prepare(`SELECT pray, exp FROM data WHERE uid = '${author.id}'`).get()
        const embed = new Embed(true)
        const date = new Date()
        const day = date.getDate()
        if (row.pray != day) {
            const month = date.getMonth()
            const side = db.prepare(`SELECT side FROM log WHERE id = ${Math.floor(Math.random() * 16)}`).get()
            const pray = db.prepare(`SELECT luck, image FROM log WHERE id = ${Math.floor(Math.random() * 7)}`).get()
            const num = Math.floor(Math.random() * 10)
            embed.setDescription(`${author} 雙手合十祈福!\n幸運方位：${side.side}\n幸運數字：${num}`).setImage(pray.image)
            db.prepare(`update data set user = '${author.username}',exp = ${row.exp + 1}, luck = '${pray.luck}', number = ${num},
                    side = '、${side.side}', pray = ${day}, term = '${month}月${day}號' where uid = '${author.id}'`).run()
            let role = guild.roles.cache.find(r => r.name == `${pray.luck}`)
            member.roles.remove(role)
            if (role) setTimeout(() => { try { member.roles.remove(role) } catch (error) { } }, ms('1d') - new Date().getTime())
        } else {
            embed.setDescription(`${author} 你今天已經祈福過了`)
        }
        message.channel.send({ embeds: [embed] })
    })
    .setName('shop')
    .setexec((message, args) => {
        const { author, channel } = message
        const per = db.prepare(`SELECT shop FROM permit WHERE chid = '${channel.id}'`).get()
        if (!per || per.shop != 1) return
        const row = db.prepare(`SELECT money FROM data WHERE uid = '${author.id}'`).get()

        const embed = new Embed(true).addField('道具商店', `你有 ${row.money} $`, false);
        (db.prepare(`SELECT * FROM shop WHERE page = ${Number(args[0]) || 1}`).all()).forEach(item => {
            embed.addField(`${item.id}.${item.name}`, `${item.main}\n價格:${item.price}`, true)
        })
        message.channel.send({ embeds: [embed] })
    })

    .setName('work')
    .setexec((message, args) => {
        const { author, channel } = message
        const per = db.prepare(`SELECT work FROM permit WHERE chid = '${channel.id}'`).get()
        if (!per || per.work != 1) return
        const row = db.prepare(`SELECT exp, money, work FROM data WHERE uid = '${author.id}'`).get()
        const embed = new Embed(true)
        const day = new Date().getDate()
        if (row.work != day) {
            const money = Math.floor(Math.random() * 201) + 100
            db.prepare(`UPDATE data SET user = '${author.username}', exp = ${row.exp + 2}, money = ${row.money + money}, work = ${day} WHERE uid = '${author.id}'`).run()
            embed.setDescription(`${author}今天賺了${money}`)
        } else {
            embed.setDescription(`${author} 你今天已經工作了`)
        }
        channel.send({ embeds: [embed] })
    })