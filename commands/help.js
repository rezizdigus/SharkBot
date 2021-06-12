const Discord = require('discord.js');

module.exports = {
	Info: Info = {
		command: "help",
		usage: ";help [command]",
		description: "Show a list of commands!",
		aliases: ['cmds'],
		permissions: ['NONE'],
		guildOnly: false
	},

	run: (client, message, args) => {
		function commandList() {
			let i = 0;
			let output = '';
			client.commands.forEach( c => {
				i++;

				if (i !== client.commands.size) {
					output += `\`\`${client.config.prefix}${c.Info.command}\`\`, `;
				} else {
					output += `\`\`${client.config.prefix}${c.Info.command}\`\``;
				}
			});
			const embed = new Discord.MessageEmbed().setTitle('Commands').setColor('#3440eb').setDescription(`You can use \`;cmds [command]\` to see a detailed description of a provided command. \n`).addField('About me:', client.informations.about).addField('List of commands:', output).setTimestamp().setFooter(`${client.informations.cmdFooter} | ${client.informations.currentVersion}`, "https://pbs.twimg.com/profile_images/614071524853616640/L7hkgWm7_400x400.png");
			message.channel.send(embed);
		}
		function commandDesc(command) {
			const cmdInfo = client.commands.get(command).Info;
			const cmdAliases = client.commands.get(command).Info.aliases;

			let i = 0;
			let output = '';

			if (cmdAliases.length){
				cmdAliases.forEach( a => {
					i++;
	
					if (i !== cmdAliases.length) {
						output += `\`\`${client.config.prefix}${a}\`\`, `;
					} else {
						output += `\`\`${client.config.prefix}${a}\`\``;
					}
				})
			} else {
				output += `\`\`NONE\`\``;
			}

			const embed = new Discord.MessageEmbed().setDescription('[arg] - Optional arguments. (arg) - Required argument').setTitle(`Informations about: ${client.config.prefix}${command}`).setColor('#3440eb').addFields({name: 'Command description:', value: cmdInfo.description, inline: true}, {name: 'Usage:', value: cmdInfo.usage, inline: true}, {name: 'Aliases:', value: output, inline: true}, {name: 'Guild only:', value: cmdInfo.guildOnly, inline: true}).setTimestamp().setFooter(`${client.informations.cmdFooter} | ${client.informations.currentVersion}`, "https://pbs.twimg.com/profile_images/614071524853616640/L7hkgWm7_400x400.png");
			message.channel.send(embed);
		}
		if (!args[1]) {
			return commandList();
		} else {
			if (client.commands.get(args[1])) {
				return commandDesc(args[1]);
			} else if (client.cmdAliases.get(args[1])) {
				return commandDesc(client.cmdAliases.get(args[1]).Info.command);
			} else {return commandList();}
		}	
	}
}