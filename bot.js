var { client, db, token, aliases, modules, Commands, ICommands, Ibuttons, ICommandSet, prefix, ownerID, TestGuildId, fs, TmpEb, rd, guildgc, gc, actline,
    updel, useradd, ms, delmsg } = require('./setting/Builder'), gcstr = "ab1cd2efg3hi4jkl5mn6opq7rs8tuv9wx0yz", ver, code = ``

client.on("ready", () => {

    //#region 初始化

    if (fs.readFileSync('data.db').length == 0) {
        //如果資料庫為空 匯入SQL
        console.log('create database');
        fs.readdirSync('./SQL/').filter(dir => dir.endsWith('.sql')).forEach(file =>
            fs.readFileSync(`./SQL/${file}`).toString().split(';').slice(1, -2).forEach(sql => db.prepare(`${sql}`).run()))
    }

    fs.readdirSync('./scr').filter(n => !n.endsWith('.js')).forEach(rd =>
        fs.readdirSync(`./scr/${rd}`).filter(n => n.endsWith('.js')).forEach(f => require(`./scr/${rd}/${f}`)))

    client.guilds.cache.forEach(g => g.roles.cache.forEach(r => {
        switch (`${r.name}`) {
            case "大吉": case "中吉": case "小吉": case "吉": case "末吉": case "凶": case "大凶":
                r.members.forEach(m => setTimeout(() => { try { m.roles.remove({ roleOrRoles: r }) } catch (error) { } }, ms('1d') - new Date().getTime()))
                break;
        }
    }))
    //#endregion

    ver = ICommandSet.Golbal(); activity(ver); setInterval(() => { activity(ver) }, 300 * 1000)
    console.log(`
    ${client.user.tag} 已登入
    GUILD(${client.guilds.cache.size}) -> [P:${Commands.size} S:${ICommands.size}]`)

    //#region 指令初始化檢測
    if (typeof ver == "string") {

        ICommands.forEach(Icmd => console.log(Icmd))
        modules.forEach((cmd, mod) => cmd.forEach(m =>
            console.log(`${mod}-${m}:\n\t`, Commands.get(m))))
    }
    //#endregion

    function activity(ver) {
        (typeof ver == 'number')
            ? client.user.setActivity(actline[rd.int(ver)])
            : client.user.setActivity(`${ver}`)
    }
});
client.on("interactionCreate", (interaction) => {
    try {
        if (typeof ver == "string" && interaction.guildId != TestGuildId) return
        const { guild, channel, user } = interaction
        //if(interaction.isMessageComponent()) console.log(interaction);
        if (interaction.isCommand()) {
            const { commandName } = interaction
            const ICommand = ICommands.get(commandName);
            if (!ICommand) return;
            console.log(`\n${new Date().toLocaleString()}\n${guild.name} #${channel.name}\n${user.tag} use /${commandName}`)
            ICommand.run(interaction);
        } else if (interaction.isButton()) {
            const { customId } = interaction
            const IButton = Ibuttons.get(customId);
            if (!IButton) return require('./setting/computer')(client, interaction)
            console.log(`\n${new Date().toLocaleString()}\n${guild.name} #${channel.name}\n${user.tag} click ${customId}`)
            IButton.run(interaction);

        } else if (interaction.isSelectMenu()) {
            const { customId } = interaction
            const IMenu = IMenu.get(customId);
            if (!IMenu) return;
            console.log(`\n${new Date().toLocaleString()}\n${guild.name} #${channel.name}\n${user.tag} chack ${customId}`)
            IMenu.run(interaction);
        }
    } catch (error) { console.error(error) }
});
client.on("messageCreate", (message) => {
    try {
        const { guild, channel, author, member, content } = message
        //#region work chack
        if (typeof ver == "string" && guild.id != TestGuildId) return
        else if (!guild) {
            const file = []; message.attachments.forEach(({ url }) => file.push({ attachment: url }))
            client.channels.cache.get('963016506755653692').send({ content: `<@${ownerID}>`, embeds: [TmpEb(true, `${author}\n${content}`)], files: file })
        } else if (useradd(author)) return
        //#endregion
        const args = content.trim().toLowerCase().split(' ')
        if (args[0].startsWith(prefix)) {
            const cmd = args.shift().slice(prefix.length)
            const command = Commands.get(aliases.get(cmd))
            if (!command) return
            if (!member.permissions.has(command.permissions) || !guild.me.permissions.has(command.permissions)) return
            //if (!chack(message, command)) return
            console.log(`\n${new Date().toLocaleString()}\n${guild.name} #${channel.name}\n${author.tag} use ${content}`)
            command.run(message, args)
        }
        //#region 
        // admin tool
        else if (content.startsWith(`${client.user}`)) message.reply('蝦咪代誌').then(m =>
            m.channel.createMessageCollector({ time: 10000, filter: msg => { return msg.author.id === ownerID; } }).on('collect', msg => {
                switch (msg.content) {
                    //case '我老婆': case '老婆': case '我婆': msg.reply('沒錯'); break;
                    case 'ver test': case 'ver release': try {
                        msg.delete(); fs.readdirSync('./scr').filter(n => !n.includes('.')).forEach(d =>
                            fs.readdirSync(`./scr/${d}`).filter(n => n.endsWith('.js')).forEach(f => require(`./scr/${d}/${f}`)));
                        ver = (msg.content.split(' ')[1] == 'test') ? ICommandSet.test() : ICommandSet.Golbal();
                        message.reply({ embeds: [TmpEb(true, '重載成功目前版本為{0}', ver)] }).then(rp => delmsg(rp, 1500));
                    } catch (error) { console.log(error); message.reply({ embeds: [TmpEb(false, '重載失敗')] }); }
                        break;
                    case 'view cmd': m.delete(); msg.delete(); message.delete(); ICommands.forEach(Icmd => console.log(Icmd))
                        modules.forEach((cmd, mod) => cmd.forEach(m => console.log(`${mod}-${m}:\n\t`, Commands.get(m))))
                        break;
                    default: message.delete(); m.delete(); msg.delete(); break;
                }
            }))
        //gcmoney
        else if (gc.chance < Math.random() * 100 || guildgc.has(message.guildId)) return
        guildgc.add(message.guildId); setTimeout(() => { guildgc.delete(message.guildId); }, gc.timer * 1000);
        while (code.length < 4) { code += gcstr.charAt(Math.floor(Math.random() * gcstr.length)); }
        const money = rd.a2b(gc.min, gc.max)
        message.channel.send(`**輸入${prefix}catch \`${code}\`取得${money}**:hatched_chick:`).then(codemsg =>
            codemsg.channel.createMessageCollector({ max: 1, time: 30000, filter: (msg) => { return msg.content === `${prefix}catch ${code}` } }).on('collect', msg => {
                db.prepare(`UPDATE data SET money = ${money} + (SELECT money FROM data WHERE uid = '${msg.author.id}') WHERE uid = '${msg.author.id}'`).run();
                message.channel.send({ embeds: [TmpEb(true, `**${msg.author.tag} 得到了 ${money}**:hatched_chick: `)] }).then(m => delmsg(m, 1500));
                msg.delete(); codemsg.delete(); code = ``
            }))
        //#endregion
    } catch (error) { console.error(error) }
});
//#region events
client.on("guildMemberAdd", (member) => { useradd(member.user) });
client.on("messageUpdate", (message, update) => { updel(message, update) });
client.on('messageDelete', (message) => { updel(message) });
//#endregion
client.login(token)