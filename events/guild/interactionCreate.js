module.exports = async (client, interaction) => {
	if (!interaction.isCommand()) return;
	if (interaction.user.bot) return;
	if (!interaction.guild) return interaction.reply({ content: "My commands may only work in Servers!", ephemeral: true })
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	try {
		console.log(" ")
		console.log(`
			------------------------------------------------------------
			User: ${interaction.user.username}[${interaction.user.id}]
			ChannelId:      [  ${interaction.channel.id}  ]
			Command: ${interaction.commandName}[${interaction.commandId}
			------------------------------------------------------------
		`)
		console.log(" ")
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true }).catch(err => {
			return console.log(err)
		})
	}
}
