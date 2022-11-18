const { MessageEmbed } = require('discord.js');
var osu = require('node-os-utils')
let cpu = osu.cpu;
var drive = osu.drive;
var mem = osu.mem;
var netstat = osu.netstat;
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    config: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Check my host and bot stats"),
    async execute(interaction) {
        let bot = interaction.client;
        try {
            const os = require('os');
            var ut_sec = os.uptime();
            var ut_min = ut_sec / 60;
            var ut_hour = ut_min / 60;
            var ut_day = ut_hour / 24;
            ut_sec = Math.floor(ut_sec);
            ut_min = Math.floor(ut_min);
            ut_hour = Math.floor(ut_hour);
            ut_day = Math.floor(ut_day);
            ut_day = ut_day % 24;
            ut_hour = ut_hour % 60;
            ut_min = ut_min % 60;
            ut_sec = ut_sec % 60;

            let msg = await interaction.reply(`Getting information...`)
            const embed = new MessageEmbed()
                .setTitle("System Stats:")
                .setColor("GREEN")
                .addField("❯ CPU Count", `${cpu.count()}`, true)
                .addField(`❯ Node Version:`, `${process.versions.node}`, true)
                .addField(`❯ OS Uptime:`, ut_day + " Days(s) " + ut_hour + " Hour(s) " + ut_min + " minute(s) and " + ut_sec + " second(s)", true)
                .addField(`❯ Bot Uptime:`, `${require("ms")(bot.uptime, { long: true })}`, true)
                .addField(`❯ Shards [${bot.shard.count}]:`, `#${interaction.guild.shardId}/${bot.shard.count - 1}`, true);
            await cpu.usage().then(a => embed.addField("❯ CPU Usage:", `${a}%`, true))
            await drive.info().then(a => embed.addField(`❯ Disk Usage [${a.usedPercentage}%]:`, `${a.usedGb}gb/${a.totalGb}gb`, true))
            await mem.info().then(a => embed.addField(`❯ Memory Usage [${a.usedMemPercentage}%]:`, `${a.usedMemMb}mb/${a.totalMemMb}mb`, true))
            const promises = [
                bot.shard.fetchClientValues('guilds.cache.size'),
                bot.shard.fetchClientValues('channels.cache.size'),
                bot.shard.fetchClientValues('emojis.cache.size'),
                bot.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
                bot.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.roles.cache.size, 0)),
            ];
            Promise.all(promises)
                .then(results => {
                    const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
                    const totalChannels = results[1].reduce((acc, channelCount) => acc + channelCount, 0);
                    const totalEmojis = results[2].reduce((acc, emojiCount) => acc + emojiCount, 0);
                    const totalMembers = results[3].reduce((acc, memberCount) => acc + memberCount, 0);
                    const totalRoles = results[4].reduce((acc, roleCount) => acc + roleCount, 0);
                    embed.addField("❯ Total Cached Guilds", `${totalGuilds}`, true)
                    embed.addField("❯ Total Cached Channels", `${totalChannels}`, true);
                    embed.addField("❯ Total Cached Emojis", `${totalEmojis}`, true);
                    embed.addField("❯ Total Cached Users", `${totalMembers}`, true);
                    embed.addField("❯ Total Cached Roles", `${totalRoles}`, true);
                    embed.addField("❯ Total Cached Items", `${Number(totalGuilds + totalEmojis + totalChannels + totalMembers)}`, true)
                    interaction.followUp({ embeds: [embed] })

                });
        } catch (err) {
            return console.log(err);
        }
    }
}
