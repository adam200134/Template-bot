var { ICommandBuilder } = require('../../../Builder')
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js')
new ICommandBuilder().setName('test').setDescription('test1')
    .setexec(async (interaction) => {
        const Permit = interaction.memberPermissions
        //const btnid = interaction.options.getString('selbtn');
        if (!Permit.has("MANAGE_ROLES") && !Permit.has("ADMINISTRATOR")) return
        //if (btnid == 'ytmember') {
        //    btn.setLabel('會限申請').setStyle('PRIMARY')
        //} else if (btnid == 'report') {
        //    btn.setLabel('檢舉').setStyle('PRIMARY')
        //}
        interaction.reply({
            content: '測試而已', components: [
                new MessageActionRow().addComponents(new MessageSelectMenu()
                    .setCustomId('select').setPlaceholder('Nothing selected')
                    .setMinValues(2).setMaxValues(3)
                    .addOptions([
                        {
                            label: 'Select me',
                            description: 'This is a description',
                            value: 'first_option',
                        },
                        {
                            label: 'You can select me too',
                            description: 'This is also a description',
                            value: 'second_option',
                        },
                        {
                            label: 'I am also an option',
                            description: 'This is a description as well',
                            value: 'third_option',
                        },
                    ])
                ),
                new MessageActionRow()
                    .addComponents(new MessageButton().setCustomId('id').setLabel('會限申請').setStyle('PRIMARY'))
                    .addComponents(new MessageButton().setCustomId('ue').setLabel('123').setStyle('DANGER'))
            ]
        })
    })