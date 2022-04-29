const { ButtonBuilder } = require('../setting/ExecuteBuilder');
const { db } = require('../setting/config');
new ButtonBuilder()
    .addbutton('report', async (interaction) => {
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
    })
    .addbutton('ytmember', async (interaction) => {
        let tr = (interaction.guild.premiumSubscriptionCount < 7) ? ['此伺服器加成等級不足 2 無法建立私人討論串\n請將截圖私訊給管理員']
            : (interaction.channel.name != '會限手動申請') ? ['請在特定頻道使用'] : ['會限申請專用討論串已為您建立，請放心的在該討論串傳送截圖\n', true]
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
                `請將您的__**YT會員的到期日**__ 與 __**DISCORD的帳號**__的截圖傳到這裡。`)
        }
    })
