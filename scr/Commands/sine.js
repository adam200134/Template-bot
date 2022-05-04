var { CommandBuilder, TmpEb, db } = require('../../setting/Builder'), { stime } = require('../../config.json')
new CommandBuilder('gamble').setName('sine').setexec((message, args) => {
    const row = db.prepare(`SELECT sine FROM data Where uid = ${message.author.id} AND sine > 0`).get(),
        target = message.mentions.members.first() || message.guild.members.cache.get(args[1]); message.delete()
    if (!row || !target) return
    db.prepare(`UPDATE data SET sine = ${row.sine - 1} Where uid = ${message.author.id}`).run()
    const sineline = ['變成 LA PUTA', '送去新疆', '送去西伯利亞勞改', '做成兵馬俑', '送去冰島挖溫泉', '送去非洲挖礦', '做成消波塊'], i = Math.floor(Math.random() * sineline.length)
    message.channel.send({
        embeds: [TmpEb(true, '**{0} 發起陶片放逐 被放逐者: {1}**\n使用表情增加放逐時間**上限 {2} 分鐘**', message.author.tag, `${target}`, stime.max)]
    }).then(sinemsg => {
        const sinereaction = sinemsg.createReactionCollector({ time: 30000 })
        let count = 1; sinemsg.react(sinemsg.guild.emojis.cache.find(emj => emj.name == 'ticket'))
        sinereaction.on('collect', (reaction, user) => {
            const { sine } = db.prepare(`SELECT sine FROM data Where uid = ${user.id} AND sine > 0`).get()
            if (sine) return message.channel.send({
                embeds: [TmpEb(true, '{0} 請在__ 5 秒內__輸入`YES`確認', `${user}`)]
            }).then(sinechack => sinechack.channel.createMessageCollector({ max: 1, time: 5000, filter: msg => { return msg.author.id === user.id && msg.content === 'yes' } })
                .on('collect', msg => {
                    msg.delete(); if (sinereaction.checkEnd()) return;
                    count++; chackmsg.delete(); db.prepare(`UPDATE data SET sine = ${sine - 1} Where uid = ${user.id} `).run();
                }))
        });
        sinereaction.on('end', () => {
            const trow = db.prepare(`SELECT sine FROM data Where uid = ${target.id} AND sine > 0`).get()
            if (!trow) { timeout(count) } else message.channel.send({
                embeds: [TmpEb(false, '**{0} 你還有__ {1} 次機會__**\n在__ 10 秒內__ 可以輸入`1 ~ {1}`來減少放逐時間', `${target}`, trow.sine)]
            }).then(burst => burst.channel.createMessageCollector({ max: 1, time: 10000, filter: msg => { return msg.author.id === user.id && !isNaN(Number(msg.content.trim())) } })
                .on('collect', msg => { timeout(count - Math.min(trow.sine, Math.floor(Number(msg.content))) * 2); burst.delete() }))

            function timeout(value) {
                let time = Math.min(stime.max, Math.max(value * stime.add, 0)); sinemsg.delete()
                message.channel.send({ embeds: [TmpEb(false, `**{0} {1}已經被__{2} {3} 分鐘__**`, message.author.tag, `${target}`, sineline[i], time)] })
                if (time == 0 || message.guild.me.roles.highest.position <= target.roles.highest.position || target.permissions.has("ADMINISTRATOR")) return
                target.timeout({ timeout: time * 60000 })
            }
        });
    })
})