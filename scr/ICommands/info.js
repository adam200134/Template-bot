var { Embed, ICommandBuilder } = require('../../setting/Builder')

new ICommandBuilder()
.setName('server').setDescription(`伺服器資訊`)
    .setexec(async (interaction) => {
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

    .setName('user')
    .setDescription(`使用者資訊`)
    .setexec(async (interaction) => {
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
    })