const { SlashCommandBuilder } = require('@discordjs/builders');
var {Embed,St } = require('../../setting/tip')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription(`使用者資訊`),
    async execute(interaction) {

        const { guild, user } = interaction

        let role = guild.members.cache.get(user.id).roles.cache
            .filter(r => r.id != guild.id)
            .map(r => r.toString())
        const embed = new Embed(true)
            .setAuthor({ name: user.tag, iconURL: user.avatarURL(), url: '' })
            .setDescription(`${user} 的資料\n[Avatar](${user.displayAvatarURL({ size: 4096, dynamic: true, format: "png" })})`)
            .addFields(
                { name: '**身分組-ROLE**', value: `${role}`, inline: false },
                { name: '使用者建立時間', value: `${user.createdAt.toLocaleString()}\n`, inline: false },
                { name: '使用者加入時間', value: `${user.createdAt.toLocaleString()}\n`, inline: false }
            )
            .setFooter({ text: `ID: ${user.id}`, iconURL: '' })
            .setTimestamp(interaction.createdAt.toString())
              
        return interaction.reply({ embeds: [embed] })
    }
}