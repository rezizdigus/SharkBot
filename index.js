const Log = require('./util/modules/logger.js');
const apiRequest = require('./util/modules/requests.js');
const currentlog = require('./util/modules/logger.js');
const Database = require('./util/modules/dbmodule.js');
const CommandLoader = require('./util/commandLoader.js');
const EventLoader = require('./util/eventLoader.js');
const Discord = require('discord.js');
const clog = console.log;
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const info = require('./informations.json');
const fs = require('fs');
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const chalk = require('chalk');
let debug;
let debugEnabled = false;
try {
	debug = require('./debug.json')
	debugEnabled = true;
} catch (e) {
	new Log('Error occured while getting file \'debug.json\'. (File is most likely missing.) Assuming that debug mode is disabled.', 'info');
}


class ATOMiX extends Discord.Client {
	constructor() {
		super();

		this.path = __dirname;

		this.verfile = require('./version.json');
		this.config = require('./config.json');
		this.informations = require('./informations.json');
		this.permData = require('./permData.json');
		this.CommandLoader = new CommandLoader(this);
		this.EventLoader = new EventLoader(this);
		this.conLog = clog;
		this.log = Log;
		this.Sentry = Sentry;
		this.apiRequest = apiRequest;
		this.login(this.config.token);
		this.inVerification = new Map();
		this.DebugEnabled = debugEnabled;
		this.debug = false;
		if (this.DebugEnabled) {this.debug = debug; new Log('Debug mode is enabled', 'warning');}

		this.commands = new Map();
		this.cmdAliases = new Map();
	}
}

new Log(`Welcome! ${info.botName} is loading. Please standby.`, "info");
require('./validate.js');
const client = new ATOMiX();

if (!(client.config.devMode === true)) {
	try {
		Sentry.init({ 
			dsn: client.config.SentryInfo.dsn, 
			integrations: [
				new Sentry.Integrations.Http({ tracing: true }),
			], 
			tracesSampleRate: client.config.SentryInfo.tracesSampleRate });
	} catch (e) {
		new client.log('Error initializing Sentry.', "error")
	}
} else {
	new client.log("Running in development mode. Sentry Disabled", "warning");
}

let Transaction;

Transaction = Sentry.startTransaction({
	op: "cmdload",
	name: "Start Command Loader",
});

try {
    client.CommandLoader.LoadCommands();
} catch (e) {
    Sentry.captureException(e);
} finally {
    Transaction.finish();
}

Transaction = Sentry.startTransaction({
	op: "cmdload",
	name: "Start Event Loader",
});

try {
    client.EventLoader.LoadEvents();
} catch (e) {
    Sentry.captureException(e);
} finally {
    Transaction.finish();
}

process.on('SIGINT', () => {
	if (client.DebugEnabled) fs.unlinkSync(__dirname + '\\debug.json');
	new Log("Process termination detected.", "important");
	new Log("SIGINT detected.", "shutdown");
});

process.on('SIGTERM', () => {
	if (client.DebugEnabled) fs.unlinkSync(__dirname + '\\debug.json');
	new Log("Process termination detected. Saving important data!", "important");
	new Log("SIGTERM detected.", "shutdown");
});