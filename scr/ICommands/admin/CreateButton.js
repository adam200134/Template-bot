const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-button')
        .setDescription('發送按鈕訊息')
        .addStringOption(option => option.setName('selbtn').setDescription('選擇按鈕').setRequired(true)
            .addChoice("會限申請", "ytmember").addChoice("檢舉", "report")),
    async execute(interaction) {
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
    }
};