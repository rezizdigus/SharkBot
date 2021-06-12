module.exports = client => {
	const statuses = client.informations.customStatuses;
	new client.log(`${client.informations.botName} is ready and has logged on as ${client.user.tag}`, "connected");
	if (client.DebugEnabled) {
	}

	setInterval(function(){
		const commands = Array.from(client.commands.keys());
		const command = commands[Math.floor(Math.random() * commands.length)];

		let status = statuses[Math.floor(Math.random() * statuses.length)];
		StatusText = status.status;
		StatusText = StatusText.replace('{prefix}', client.config.prefix);
		StatusText = StatusText.replace('{command}', command);

		client.user.setActivity(`${StatusText} | ${client.informations.currentVersion}`, {
			type: status.type
		});
	}, 5000)
}