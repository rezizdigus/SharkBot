module.exports = client => {
	const statuses = client.informations.customStatuses;
	new client.log(`${client.informations.botName} is ready and has logged on as ${client.user.tag}`, "connected");
	if (client.DebugEnabled) {
	}

	setInterval(function(){
		let status = statuses[Math.floor(Math.random() * statuses.length)];

		client.user.setActivity(`${status.status} | ${client.informations.currentVersion}`, {
			type: status.type
		});
	}, 10000)
}