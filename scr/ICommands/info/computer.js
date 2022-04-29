var { ICommandBuilder } = require('../../../Builder'), { client } = require('../../../config')
const { MessageActionRow, MessageButton } = require('discord.js')

new ICommandBuilder().setName('computer').setDescription('計算機').setexec(async (interaction) => {
    interaction.reply({ content: '計算機召喚成功', ephemeral: true })
    const msg = await interaction.channel.send({
        content: '0',
        components: [
            new MessageActionRow()
                .addComponents(new MessageButton().setCustomId('ac').setLabel('AC').setStyle('DANGER'))
                .addComponents(new MessageButton().setCustomId('del').setLabel('←').setStyle('DANGER'))
                .addComponents(new MessageButton().setCustomId('dis').setLabel('⦸').setStyle('DANGER'))
                .addComponents(new MessageButton().setCustomId('/').setLabel('/').setStyle('SUCCESS')),
            new MessageActionRow()
                .addComponents(new MessageButton().setCustomId('7').setLabel('7').setStyle('SECONDARY'))
                .addComponents(new MessageButton().setCustomId('8').setLabel('8').setStyle('SECONDARY'))
                .addComponents(new MessageButton().setCustomId('9').setLabel('9').setStyle('SECONDARY'))
                .addComponents(new MessageButton().setCustomId('*').setLabel('X').setStyle('SUCCESS')),
            new MessageActionRow()
                .addComponents(new MessageButton().setCustomId('4').setLabel('4').setStyle('SECONDARY'))
                .addComponents(new MessageButton().setCustomId('5').setLabel('5').setStyle('SECONDARY'))
                .addComponents(new MessageButton().setCustomId('6').setLabel('6').setStyle('SECONDARY'))
                .addComponents(new MessageButton().setCustomId('-').setLabel('-').setStyle('SUCCESS')),
            new MessageActionRow()
                .addComponents(new MessageButton().setCustomId('1').setLabel('1').setStyle('SECONDARY'))
                .addComponents(new MessageButton().setCustomId('2').setLabel('2').setStyle('SECONDARY'))
                .addComponents(new MessageButton().setCustomId('3').setLabel('3').setStyle('SECONDARY'))
                .addComponents(new MessageButton().setCustomId('+').setLabel('+').setStyle('SUCCESS')),
            new MessageActionRow()
                .addComponents(new MessageButton().setCustomId('%').setLabel('%').setStyle('SECONDARY'))
                .addComponents(new MessageButton().setCustomId('0').setLabel('0').setStyle('SECONDARY'))
                .addComponents(new MessageButton().setCustomId('.').setLabel('.').setStyle('SECONDARY'))
                .addComponents(new MessageButton().setCustomId('=').setLabel('=').setStyle('SUCCESS'))
        ]
    })
    const computer = client.computers.get(interaction.user.id)
    computer ? client.computers.set(interaction.user.id, { id: `${msg.id}`, arr: computer.arr, txt: `${computer.txt}`, btnx: `${computer.btnx}` })
        : client.computers.set(interaction.user.id, { id: `${msg.id}`, arr: [], txt: `${msg.content}`, btnx: `` })
})