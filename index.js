var { aliases, Commands, ICommands, ICommandSet, Ibuttons } = require('./Builder'), { token, client, prefix } = require('./config'), fs = require('fs');
client.once("ready", () => { //初始化
    console.log(`\n${new Date().toLocaleString()}\n${client.user.tag} 已登入`)

    //fs.readdirSync('./scr').filter(n => !n.endsWith('.js')).forEach(rd => fs.readdirSync(`./scr/${rd}`)
    //    .filter(n => n.endsWith('.js')).forEach(f => require(`./scr/${rd}/${f}`)))

    ICommandSet.test()
    console.log(`\n>> GUILD:${client.guilds.cache.size}`)
    console.log(`[P:${Commands.size} S:${ICommands.size}]`)
    /*
    //  指令初始化檢測
    ICommands.forEach(Icmd=>console.log(Icmd))
    modules.forEach((cmd, mod) => {
        console.log(`\n${mod}:`, cmd);
        cmd.forEach(m => console.log(` ${m}:`, Commands.get(m)))
    })
    */
});
client.on("interactionCreate", (interaction) => {
    try {
        const { guild, channel, user } = interaction
        //if(interaction.isMessageComponent()) console.log(interaction);
        if (interaction.isCommand()) {
            const { commandName } = interaction
            const ICommand = ICommands.get(commandName);
            if (!ICommand) return;
            console.log(`\n${new Date().toLocaleString()}\n${guild.name} #${channel.name}\n${user.tag} use /${commandName}`)
            ICommand.run(interaction);
            /*
        } else if (interaction.isSelectMenu()) {
            const { customId } = interaction
            const IMenu = IMenu.get(customId);
            if (!IMenu) return;
            console.log(`\n${new Date().toLocaleString()}\n${guild.name} #${channel.name}\n${user.tag} click ${customId}`)
            IMenu.run(interaction);
            */
        } else if (interaction.isButton()) {
            const { customId } = interaction
            const IButton = Ibuttons.get(customId);
            if (IButton) {
                console.log(`\n${new Date().toLocaleString()}\n${guild.name} #${channel.name}\n${user.tag} click ${customId}`)
                IButton.run(interaction);
            } else { computer(client, interaction) }
        }
    } catch (error) { console.error(error) }
});
client.on("messageCreate", (message) => {
    try {
        if (message.author.bot || !message.guild || !message.content.startsWith(prefix)) return;
        const args = message.content.trim().toLowerCase().split(' ');
        const cmd = args.shift().slice(prefix.length);
        const command = Commands.get(aliases.get(cmd) || cmd)
        if (!command) return
        if (!Array.isArray(command.permissions) || !message.member.permissions.any(command.permissions)) return
        //if (!chack(message, command)) return
        console.log(`\n${new Date().toLocaleString()}\n${message.guild.name} #${message.channel.name}\n${message.author.tag} use ${message.content}`)
        command.run(message, args)
    } catch (error) { console.error(error) }
});
client.login(token)