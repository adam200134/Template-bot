const ms = require('ms');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed, St } = require('../../setting/tip')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute').setDescription('禁言').setDefaultPermission(false)
        .addUserOption(option => option.setName('user').setDescription('使用者'))
        .addStringOption(option => option.setName('reason').setDescription('原因'))
        .addStringOption(option => option.setName('time').setDescription('時間').setRequired(false)
            .addChoice("7d", "7d").addChoice("3d", "3d").addChoice("1d", "1d")
            .addChoice("12h", "12h").addChoice("1h", "1h").addChoice("30m", "30m").addChoice("5m", "5m")),
    async execute(interaction) {
        const Permit = interaction.memberPermissions
        if (!Permit.has("MANAGE_ROLES") && !Permit.has("ADMINISTRATOR"))
            return interaction.reply({ content: '你沒有權限', ephemeral: true })
        interaction.deferReply()
        setTimeout(() => { interaction.deleteReply() }, 500)
        const member = interaction.options.getMember('user');
        if (!member) return
        let time = interaction.options.getString('time') || '1m'
        let reason = interaction.options.getString('reason') || '太吵';
        if (ms(time) > ms('14d')) time = '14d'
        if (!member.permissions.has('ADMINISTRATOR')) member.timeout(ms(time), reason)
        await interaction.channel.send({
            embeds: [new Embed(true).
                setDescription(`${St('**{0} {1} __已經被禁言 {2}__**\n**原因**：{3}', interaction.user.tag, `${member}`, time, reason)}`)]
        })
    }
};