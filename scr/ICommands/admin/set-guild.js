var { ICommandBuilder } = require('../../../Builder')

new ICommandBuilder()
        .setName('guild-set')
        .setDescription('伺服器設定(頭像盡量使用1:1)')
        .addStringOption(option => option.setName('option').setDescription('設定選項').setRequired(true)
            .addChoice("icon", "圖示").addChoice("banner", "橫幅"))
        .addStringOption(option => option.setName('url').setDescription('網址')).setexec(async(interaction)=> {
        const { member, guild } = interaction
        if(!member.permissions.has("ADMINISTRATOR")) return await interaction.reply({ content: '沒有此命令權限', ephemeral: true })
        const url = interaction.options.getString('url');
        if(!url || !url.startsWith('https')) return await interaction.reply({ content: '網址錯誤', ephemeral: true })
        const option = interaction.options.getString('option')
        if(option == `圖示`) guild.setIcon(`${url}`)
        if(option == `橫幅`)guild.setBanner(`${url}`)
        await interaction.reply({ content: `伺服器 ${option} 已更新`, ephemeral: false })
    })

