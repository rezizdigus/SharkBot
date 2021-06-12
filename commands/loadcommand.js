module.exports = {
	Info: Info = {
		command: 'loadcommand',
		usage: ';loadcommand (command)',
		description: 'Loads the provided command.',
		aliases: ['loadcmd'],
		permissions: ['DEV', 'ALL', 'LOADCMD'],
		DebugOnly: true,
		guildOnly: false // or false
	},

	run: async (client, message, args) => {
		if (args[1]) {
			try {
				client.CommandLoader.LoadCommand(args[1]);
				message.channel.send(`Loaded command \`\`${args[1]}\`\`!`);
			} catch (e) {
				new client.log(`Error occured while loading command \`\`${args[1]}\`\`: ${e}`,'error');
				new client.log(`Error stack: ${e.stack}`,'debug');
			}
		}
	}
}