const { Client, CommandInteraction } = require('discord.js');
/**
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */
module.exports = (client, interaction) => {
    const computer = client.computers.get(interaction.user.id)
    if (!computer || interaction.message.id != computer.id) return interaction.reply({ content: '計算機要自己召喚 `/computer`', ephemeral: true })
    interaction.deferReply()
    setTimeout(() => { interaction.deleteReply() }, 500)
    let id = computer.id, arr = computer.arr, txt = computer.txt, btnx = computer.btnx
    const msg = interaction.channel.messages.cache.get(id)
    txt = `${msg.content}`
    if (interaction.customId == 'ac') {
        arr.length = 0
        txt = `0`
    } else if (interaction.customId == 'del') {
        arr.pop()
        txt = (arr.length < 2) ? `0` : txt.slice(0, -1)
    } else if (interaction.customId != '=') {
        (txt == '0') ? txt = interaction.component.label : txt += interaction.component.label
        arr.push(interaction.customId)
        if (interaction.customId == 'dis') return msg.delete()
    } else {
        arr.push('=')
        for (let i = 0; i <= arr.indexOf('='); i++) {
            const btn = arr[i]
            if (`${Number(btn)}` != `NaN` || btn == '.') { btnx += btn }
            else if (btn == '%') { btnx = `${Number(btnx) / 100}` }
            else {
                arr.push(Number(btnx))
                arr.push(btn)
                btnx = ``
            }
        }
        arr.splice(0, arr.indexOf('=') + 1)
        arr.pop()
        for (let i = 0; i < arr.length; i++) {
            switch (arr[i]) {
                case '*':
                    arr[i - 1] = arr[i - 1] * arr[i + 1]
                    arr.splice(i, 2)
                    break;
                case '/':
                    arr[i - 1] = arr[i - 1] / arr[i + 1]
                    arr.splice(i, 2)
                    break;
            }
        }
        for (let i = 0; i < arr.length; i++) {
            switch (arr[i]) {
                case '+':
                    arr[i - 1] = arr[i - 1] + arr[i + 1]
                    arr.splice(i, 2)
                    break;
                case '-':
                    arr[i - 1] = arr[i - 1] - arr[i + 1]
                    arr.splice(i, 2)
                    break;
            }
        }
        txt = arr[0]
        btnx = ``
    }
    msg.edit({ content: `${txt}` })
    client.computers.set(interaction.user.id, {
        id: id,
        arr: arr,
        txt: txt,
        btnx: btnx
    })
}