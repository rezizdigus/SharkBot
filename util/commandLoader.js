const read = require('fs-readdir-recursive');

module.exports = class CommandLoader {
	constructor(client) {
		this.client = client;
		this.commandFiles = read('./commands').filter(file => file.endsWith('.js'));
	}

	async LoadCommands() {
		if (this.client.config.debug === false) this.client.log(`Debug mode disabled, not prompting loading infomations for commands.`, "debug");
		for (const file of this.commandFiles) {
			try {
				const f = require(`../commands/${file}`);
	
				if (f.Info.DebugOnly && this.client.DebugEnabled == false) {continue;}

				this.client.commands.set(f.Info.command, f);
				f.Info.aliases.forEach(cmd => (this.client.cmdAliases.set(cmd, f)));
	
				new this.client.log(`Loaded command file ${file}.`, "debug");
			} catch (err) {
				new this.client.log(`Unable to load command ${file}. Error contents: ${err}`, "error");
				new this.client.log(`Error stack: ${err.stack}`, "debug");
				return 'error';
			}
		}
	}
	
	async LoadCommand(command) {
		try {
			const f = require(`../commands/${command}.js`);

			this.client.commands.set(f.Info.command, f);
			f.Info.aliases.forEach(cmd => (this.client.cmdAliases.set(cmd, f)));

			new this.client.log(`Loaded command file ${command}.`, "debug");
		} catch (err) {
			new this.client.log(`Unable to load command ${command}. Error contents: ${err}`, "error");
			new this.client.log(`Error stack: ${err.stack}`, "debug");
			return 'error';
		}
	}

	async UnloadCommand(command) {
		try {
			this.client.commands.get(command).Info.aliases.forEach(alias => {
				this.client.cmdAliases.delete(alias);
			})
			delete require.cache[require.resolve(`${this.client.path}/commands/${command}.js`)];
			
			this.client.commands.delete(command);
		} catch (e) {
			new this.client.log(`Failed to unload ${command}: ${e}`, 'error');
			new this.client.log(`Error stack: ${e.stack}`, 'debug');
			return 'error';
		}
	}


	async ReloadCommands() {
		this.client.commands.forEach(cmd => {
            try {
				this.client.commands.get(cmd.Info.command).Info.aliases.forEach(alias => {
					this.client.cmdAliases.delete(alias);
				})
                delete require.cache[require.resolve(`${this.client.path}/commands/${cmd.Info.command}.js`)];
				
                this.client.commands.delete(cmd.Info.command);
            } catch (e) {
                new this.client.log(`Failed to unload ${cmd}: ${e}`, 'error');
                new this.client.log(`Error stack: ${e.stack}`, 'debug');
				return 'error';
            }
        });
        
        await this.LoadCommands();
		new this.client.log('Successfully reloaded all commands!', 'success');
	}

	async ReloadCommand(command) {
		try {
			delete require.cache[require.resolve(`${this.client.path}/commands/${command}.js`)];
			this.client.commands.get(command).Info.aliases.forEach(alias => {
				this.client.cmdAliases.delete(alias);
			})
			this.client.commands.delete(command);
		} catch (e) {
			new this.client.log(`Failed to unload ${command}: ${e}`, 'error');
			new this.client.log(`Error stack: ${e.stack}`, 'debug');
			return 'error';
		}
        
        await this.LoadCommand(command);
		new this.client.log(`Successfully reloaded command '${command}'!`, 'success');
	}
}

