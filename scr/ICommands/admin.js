var { ICommandBuilder, TmpEb } = require('../../setting/Builder'), ms = require('ms')

new ICommandBuilder()

    .setName('mute').setDescription('禁言').setDefaultPermission(false).setRolePermission("MUTE_MEMBERS")
    .addUserOption(option => option.setName('user').setDescription('使用者'))
    .addStringOption(option => option.setName('reason').setDescription('原因'))
    .addStringOption(option => option.setName('time').setDescription('時間').setRequired(false).setChoices(
        { name: "1d", value: "1d" }, { name: "12h", value: "12h" }, { name: "1h", value: "1h" },
        { name: "30m", value: "30m" }, { name: "10m", value: "10m" }, { name: "5m", value: "5m" }))
    .setexec(async (interaction) => {
        const target = interaction.options.getMember('user');
        if (!target) return
        let time = interaction.options.getString('time') || '1m'
        let reason = interaction.options.getString('reason') || '太吵';
        if (ms(time) > ms('14d')) time = '14d'
        const targetpos = target.roles.highest.position
        if (interaction.guild.me.roles.highest.position <= targetpos || interaction.guild.ownerId == target.id) {
            await interaction.reply({ embeds: [TmpEb(false, '**我的權限比 {0} 低**', `${target}`)] })
        } else {
            if (!target.permissions.has('ADMINISTRATOR')) target.timeout(ms(time), reason)
            await interaction.reply({ embeds: [TmpEb(true, '**{0} {1} __已經被禁言 {2}__**\n**原因**：{3}', interaction.user.tag, `${target}`, time, reason)] })
        }
    })
    .setName('create-button').setDescription('發送按鈕訊息').setDefaultPermission(false)
    .addStringOption(option => option.setName('selbtn').setDescription('選擇按鈕').setRequired(true)
        .addChoices({ name: "會限申請", value: "ytmember" }, { name: "檢舉", value: "report" }))
    .setexec(async (interaction) => {
        const Permit = interaction.memberPermissions
        const btnid = interaction.options.getString('selbtn');
        const btn = new MessageButton().setCustomId(btnid)
        if (!Permit.has("MANAGE_ROLES") && !Permit.has("ADMINISTRATOR")) return
        if (btnid == 'ytmember') {
            btn.setLabel('會限申請').setStyle('PRIMARY')
        } else if (btnid == 'report') {
            btn.setLabel('檢舉').setStyle('PRIMARY')
        }
        interaction.reply({ content: 'ㄜ 這裡不能打指令ㄌ 按按鈕', components: [new MessageActionRow().addComponents(btn)] })
    })

    .setName('guild-set')
    .setDescription('伺服器設定(頭像盡量使用1:1)')
    .addStringOption(option => option.setName('option').setDescription('設定選項').setRequired(true)
        .addChoices({ name: "icon", value: "圖示" }, { name: "banner", value: "橫幅" }))
    .addStringOption(option => option.setName('url').setDescription('網址'))
    .setexec(async (interaction) => {
        const { member, guild } = interaction
        if (!member.permissions.has("ADMINISTRATOR")) return await interaction.reply({ content: '沒有此命令權限', ephemeral: true })
        const url = interaction.options.getString('url');
        if (!url || !url.startsWith('https')) return await interaction.reply({ content: '網址錯誤', ephemeral: true })
        const option = interaction.options.getString('option')
        if (option == `圖示`) guild.setIcon(`${url}`)
        if (option == `橫幅`) guild.setBanner(`${url}`)
        await interaction.reply({ content: `伺服器 ${option} 已更新`, ephemeral: false })
    })

    .setName('emoji-add')
    .setDescription('新增表情符號')
    .addStringOption(option => option.setName('name').setDescription('名字'))
    .addStringOption(option => option.setName('url').setDescription('網址'))
    .addAttachmentOption(option => option.setName('file').setDescription('檔案'))
    .setexec(async (interaction) => {
        const { member, guild } = interaction
        if (!member.permissions.has("ADMINISTRATOR")) return await interaction.reply({ content: '沒有此命令權限', ephemeral: true })
        const url = interaction.options.getString('url');
        const name = interaction.options.getString('name');
        const file = interaction.options.getString('file');
        if (!url || !url.startsWith('https')) return await interaction.reply({ content: '網址錯誤', ephemeral: true })
        const emj = await guild.emojis.create(url, name)
        await interaction.reply({ content: `${emj}表情符號已加入伺服器` })
        console.log(file);
    })