const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('better-sqlite3')('./data.db')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription(' #匿名檢舉專用 先確認伺服器是否有此頻道'),
    async execute(interaction) {
        let tr = (interaction.guild.premiumSubscriptionCount < 7) ? ['此伺服器加成等級不足 2 無法建立私人討論串']
            : (interaction.channel.name != '匿名檢舉') ? ['請在特定頻道使用'] : ['請將您要投訴的內容、訊息鏈結、截圖都貼在討論串，會由管理員進行處置。', true]
        await interaction.reply({ content: `**__${tr[0]}__**`, ephemeral: true })
        if (tr[1]) {
            const date = new Date()
            //宣告討論串 = 創建斜線指令的討論串(設定)
            const thread = await interaction.channel.threads.create({
                name: `編號[${date.getDate()}日${date.getHours()}點${date.getMinutes()}分]`,
                autoArchiveDuration: 1440,
                type: 'GUILD_PRIVATE_THREAD',
                reason: 'Needed a separate thread for report',
            });
            console.log(`討論串建立了 : ${thread.name}`)
            //討論串成員加入(使用指令的成員ID)
            thread.members.add(interaction.member.id)
            const row = db.prepare(`SELECT * FROM ytmember WHERE gid = '${interaction.guild.id}'`).get()
            let role = (row) ? `${row.tag}` : '管理員'
            thread.send(
                `${interaction.member} 您好\n` +
                `請放心，這個討論串只有您與 ${role} 看的見\n` +
                `投訴專用討論串已為您建立，請放心的在該討論串進行投訴`)
        }
    }
}