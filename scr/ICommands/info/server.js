var { Embed,ICommandBuilder } = require('../../../Builder')

new ICommandBuilder()
    .setName('server')
    .setDescription(`伺服器資訊`).setexec(async (interaction) => {
        const { guild } = interaction

        const embed = new Embed(true)
            .setTitle(guild.name)
            .setDescription('ID:' + guild.id)
            .setThumbnail(guild.iconURL())
            .addFields(
                { name: `擁有者:`, value: `<@${guild.ownerId}>` },
                { name: `總成員:`, value: `${guild.memberCount}`, inline: true },
                { name: `成員數:`, value: `${guild.members.cache.filter(member => !member.user.bot).size}`, inline: true },
                { name: `機器人:`, value: `${guild.members.cache.filter(member => member.user.bot).size}`, inline: true }
            )
            .setFooter({ text: '建立時間', iconURL: '' })
            .setTimestamp(guild.createdAt.toString())

        return interaction.reply({ embeds: [embed] })
    
})