const read = require('fs-readdir-recursive');

class EventLoader {
	constructor(client) {
		this.client = client;
		this.eventFiles = read('./events').filter(file => file.endsWith('.js'));
	}

	async LoadEvents() {
		if (this.client.config.debug === false) new this.client.log(`Debug mode disabled, not prompting loading infomations for events.`, "debug");
		for (const file of this.eventFiles) {
			try {
				const eventName = file.split('.')[0];
				const event = require(`../events/${eventName}`);
				this.client.on(eventName, event.bind(null, this.client));
	
				new this.client.log(`Loaded event file ${file}.`, "debug");
			} catch (err) {
				new this.client.log(`Unable to load event ${file}. Error contents: ${err}`, "error");
				new this.client.log(`Error stack: ${err.stack}`, "debug");
			}
		}
	}
}

module.exports = EventLoader;