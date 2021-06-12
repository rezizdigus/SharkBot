module.exports = {
	Info: Info = {
		command: 'unloadcommand',
		usage: ';unloadcmd (command)',
		description: 'description',
		aliases: ['unloadcmd'],
		permissions: ['CMDUNLOAD', 'ALL', 'DEV'],
		DebugOnly: true,
		guildOnly: true // or false
	},

	run: async (client, message, args) => {
		if (args[1]) {
			try {
				client.CommandLoader.UnloadCommand(args[1]);
			} catch (e) {
				new client.log(`Error occured while unloading command \`\`${args[1]}\`\`: ${e}`,'error');
				new client.log(`Error stack: ${e.stack}`,'debug');
			}
		}
	}
}