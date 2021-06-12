const Discord = require('discord.js');

module.exports = {
	Info: Info = {
		command: 'ping',
		usage: ';ping',
		description: 'Shows bots latency',
		aliases: [],
		permissions: ['NONE'],
		guildOnly: true
	},

	run: async (client, message) => {
		const msg = await message.channel.send(new Discord.MessageEmbed().setTitle('Pinging...'));
		try {
			const embed = new Discord.MessageEmbed().setTitle('Pong!').setColor('#3440eb').setDescription(`\n**ATOMiX's latency is** \`${Math.round(msg.createdTimestamp - message.createdTimestamp)}ms\`.`).setTimestamp().setFooter(`${client.informations.cmdFooter} | ${client.informations.currentVersion}`, "https://pbs.twimg.com/profile_images/614071524853616640/L7hkgWm7_400x400.png");
			msg.edit(embed);
		} catch (e) {
			message.channel.send('**Sorry!** An error occurred while trying to perform this command, please report this bug to the bot\'s developer and try again later.');
			new client.log('-------- Separator --------', "info");
			new client.log('An error occurred while trying to perform \';ping\' command. Error: ' + e, "error");
			new client.log('Error stack: ' + e.stack, "debug");
			new client.log('-------- Separator --------', "info");
		}
		
	}
}