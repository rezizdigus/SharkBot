const { MessageFlags } = require('discord.js');
const fs = require('fs');
const path = require('path');
const log = require('../util/modules/logger');

const jsonFile = path.join(__dirname, '../debug.json')

function appendJson(Channel, LogGuild, ExperimentalMode, DangerMode) {
	let obj = { DebugEnabled: true, LogInfo: { Channel: Channel, LogGuild: LogGuild }, ExperimentalMode: ExperimentalMode, DangerMode: DangerMode }; //add some data
	json = JSON.stringify(obj); //convert it back to json
	fs.writeFileSync(jsonFile, json, 'utf8', () => {
		new log(`debug.json created`);
	}); // write it back 
}

module.exports = {
	Info: Info = {
		command: "debug",
		usage: ";debug (flags)",
		description: "Restarts the bot in debug mode.",
		aliases: [],
		permissions: ['ALL'],
		guildOnly: false
	},

	run: async (client, message, args) => {
		let Danger = false;
		let ExperimentalMode = false;
		let CustomLogChannel = false;
		let LogChannel = '835408850072895570';
		let LogGuild = '835408850072895568';

		if (args.includes('--danger')) Danger = true;
		if (args.includes('--experimental')) ExperimentalMode = true;
		if (args.includes('--this')) {LogChannel = message.channel.id; LogGuild = message.guild.id; CustomLogChannel = true;}

		try {
			appendJson(LogChannel, LogGuild, ExperimentalMode, Danger);
		} catch (e) {
			console.log(e,'error');
			return message.reply(`Error occured while trying to enable debug mode. Please report this to the bot's developer, or if you can, try to fix the issue.`);
		}
		if (Danger) message.reply(`**WARNING!** The flag \`\`--danger\`\` is present. Permission system will be disabled when the bot restarts.`);
		if (ExperimentalMode) message.reply(`**WARNING!** The flag \`\`--experimental\`\` is present. Experimental features will be enabled when the bot restarts.`);
		if (CustomLogChannel) message.reply(`The flag \`\`--this\`\` is present. This channel will be used for logging.`)
		await message.reply(`Starting restart procedure...`);
		return new client.log('Enabling Debug Mode', 'shutdown');
	}
}