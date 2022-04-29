var { CommandBuilder, Embed } = require('../../Builder'), { ownerID, db } = require('../../config'), path = require('path');

new CommandBuilder(path.parse(__filename).name)
    .setName('character', 'char')
    .setexec((message, args) => {
        if (`${message.author.id}` != `${ownerID}`) return;
        let id = ``, char, avatar = ``, embed
        switch (args[0]) {
            case 'add':
                avatar += message.attachments.first() ? `${message.attachments.first().url}` : `${args[args.length - 1]}`
                if (!avatar.includes('.png') && !avatar.includes('.jpg')) {
                    embed = new Embed(false).setDescription(`圖片格式錯誤`)
                } else {
                    (args[2].includes('#') && args[2].length == 7) ? id = args[2] : id = id
                    let i = 0, pg, cnt
                    page()
                    while (cnt >= 10) { page() }
                    function page() {
                        i++
                        pg = db.prepare(`SELECT count(id) AS count FROM character WHERE page = '${i}'`).get()
                        cnt = pg.count
                    }
                    db.prepare(`INSERT INTO character (page, name, color, avatar) VALUES ('${i}', '${args[1]}', '${id}', '${avatar}')`).run()
                    char = db.prepare(`SELECT count(id) AS count FROM character`).get()
                    embed = new Embed(true).setFooter({ text: `人設ID: ${char.count}` })
                        .addFields({ name: `新增人設`, value: `已加入 ${args[1]}`, inline: false })
                }
                break;
            case 'list':
                char = db.prepare(`SELECT count(id) AS count FROM character`).get()
                let num = Math.floor(char.count / 10 + 1)
                if (Number(args[1]) > num) args[1] = num
                let character = ``
                const rows = db.prepare(`SELECT * FROM character WHERE page = '${args[1] || 1}'`).all()
                rows.forEach(r => {
                    id += `${r.id}\n`
                    character += `[${r.name}](${r.avatar})\n`
                })
                embed = new Embed(true).setDescription(`Character Count: ${char.count}`)
                    .addFields({ name: `ID`, value: `${id}`, inline: true },
                        { name: `Character`, value: `${character}`, inline: true })
                    .setFooter({ text: `Page: ${args[1] || 1}/${num}` })
                break;
            default:
                char = db.prepare(`SELECT * FROM character WHERE id = ${Number(args[0])}`).get();
                client.user.setAvatar(`${char.avatar}`);
                client.user.setUsername(`${char.name}`);
                embed = new Embed(true).setDescription(`人設已變更為 ${char.name}`)
                break;
        }
        message.channel.send({ embeds: [embed] })
    })