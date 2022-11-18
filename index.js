// ------------- CONSTS ------------------
const Discord = require("discord.js");
const { Database } = require('quickmongo');
require("dotenv").config();
const db = new Database(process.env.MongoDB);
const client = new Discord.Client({intents: ["GuildMembers", "GuildMessages", "Guilds"]});
const fs = require('fs');
// ------------- LOGIN ------------------
client.login(process.env.TOKEN);
// ------------- EVENTS ------------------
const load = dirs => {
	const events = fs.readdirSync(`./events/${dirs}/`).filter(d => d.endsWith('.js'));
	for (let file of events) {
		const evt = require(`./events/${dirs}/${file}`);
		let eName = file.split('.')[0];
		client.on(eName, evt.bind(null, client));
	};
};
["client", "guild"].forEach(x => load(x))
// ------------- COMMANDS -----------------
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.config.name, command);
}
// ------------- PROCESS ------------------
process.on("unhandledRejection", (err)=> console.log(err.message));
process.on("unhandledException", (err)=> console.log(err.message));
