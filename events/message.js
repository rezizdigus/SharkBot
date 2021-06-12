// const Discord = require('discord.js');

// 619646071181672462 <- botlogs

module.exports = (client, message) => {
	const args = message.content.split(" ");
	let isCommand = true;

	if (message.author.bot) return;

	let cmdCheck = false ? args[0].toLowerCase() !== client.config.prefix.toLowerCase() : !message.content.startsWith(client.config.prefix.toLowerCase());
  	if (cmdCheck) isCommand = false;

	let cmd = false ? args[1].toLowerCase() : args[0].toLowerCase().substring(client.config.prefix.length);
  	if ((!client.commands.get(cmd)) && (!client.cmdAliases.get(cmd))) isCommand = false;

	if (isCommand===false) {	
        if (message.mentions) {
            if (!(message.channel.type === 'dm')) {
                let MentionUser = message.mentions.members.first();

                if (MentionUser && MentionUser.user.id=="798258822682378341") {
                    message.channel.send(`Hello! My current prefix for commands is: \`\`${client.config.prefix}\`\`\nRun \`\`;help\`\` to see a list of commands.`)
                }
            }
        }

		return;
	}

	if (message.channel.type === 'dm') {if (client.commands.get(cmd).Info.guildOnly === true) return message.channel.send('This command cannot be ran in DMs!');}

	let hasPerms = false;

	let command;
	if (!client.commands.get(cmd)) {command=client.cmdAliases.get(cmd);} else {command=client.commands.get(cmd);}

	if (!client.DebugEnabled || !client.debug.DangerMode) {
		if (!command.Info.permissions.includes('NONE')) {
			client.permData.userData.forEach(user => {
				if (user.userId == message.author.id) {
					client.permData.roles.forEach(role => {
						if (role.ID == user.role) {
							let command;
							if (!client.commands.get(cmd)) {command=client.cmdAliases.get(cmd);} else {command=client.commands.get(cmd);}
							if (!(command.Info.permissions.includes('NONE'))) {
								let i = 0;
								//for (const user of command.Info.permissions) {}
								command.Info.permissions.forEach(perm => {
									if (!role.Permissions.includes(perm)) {i++}
								})
								if (i == command.Info.permissions.length) {hasPerms=false;} else {hasPerms=true;}
							} else {
								hasPerms=true;
							}
						}
					})
				}
			});
		} else {hasPerms=true;}
	} else {hasPerms=true;}

	if (hasPerms == false) return message.channel.send('Sorry, you are not authorized to perform this command.');

	try {
		if (!client.commands.get(cmd)) return client.cmdAliases.get(cmd).run(client, message, args);
		return client.commands.get(cmd).run(client, message, args)
	} catch (e) {
		new client.log('Error stack: ' + e.stack, 'debug');
		new client.log('A critical error occured while performing command \';' + cmd + '\': ' + e, 'critical');
	}
}