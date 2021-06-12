module.exports = {
	Info: Info = {
		command: 'reload',
		usage: ';reload [command]',
		description: 'Reloads command(s)',
		aliases: ['rl'],
		permissions: ['RELOAD', 'ALL'],
		guildOnly: false // or false
	},

	run: async (client, message, args) => {
		if (!args[1]) {
			try {
				client.CommandLoader.ReloadCommands();
				message.channel.send('Reloaded commands!');
			} catch (e) {
				new client.log('Error occured while performing command \'reload\': '+e,'error');
				new client.log('Error stack: '+e.stack,'debug');
			}
		} else {
			if (!client.commands.get(args[1])) return message.channel.send('This command does not exist.')

			try {
				client.CommandLoader.ReloadCommand(args[1]);
				message.channel.send(`Reloaded command \`${args[1]}\`!`);
			} catch (e) {
				new client.log('Error occured while performing command \'reload\': '+e,'error');
				new client.log('Error stack: '+e.stack,'debug');
			}
		}
	}
}