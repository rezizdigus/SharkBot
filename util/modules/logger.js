// Looking back, I should have just used Winston... but fuck me, at least I made this logger work.

const chalk = require("chalk");
const moment = require('moment');
const fs = require('fs');
const dP = (moment().format("YYYY-MM-DDTHH-mm-ss"));
let file = fs.createWriteStream(`./logs/other/${dP}.log`, {flags:'a'});
let errFile = fs.createWriteStream(`./logs/error/err-${dP}.log`, {flags:'a'});
const config = require('../../config.json');

function appendToLog(text, type = "normal") {
	switch (type) {
		case 'error': {
			return errFile.write(text + "\n");
		}
		case 'normal': {
			return file.write(text + "\n");
		}
		default: {
			return file.write(text + "\n");
		}
	}
	
}

module.exports = class log {
	constructor(msg, type = "info") {
		this.msg = msg;
		this.type = type.toLowerCase();

		const dateParsed = (moment().format("YYYY-MM-DD HH:mm:ss"));

		switch (this.type) {
			case "info": {
				appendToLog(`[${dateParsed} : INFO]: ${this.msg}`);

				return console.log(`${chalk.gray('['+dateParsed+' : ')}${chalk.blue('INFO')}${chalk.gray(']:')} ${this.msg}`);
			}
			case "api": {
				appendToLog(`[${dateParsed} : API]: ${this.msg}`);

				return console.log(`${chalk.gray('['+dateParsed+' : ')}${chalk.bgGreenBright('API')}${chalk.gray(']:')} ${this.msg}`);
			}
			case "debug": {
				if (config.debug == true) {
					appendToLog(`[${dateParsed} : DEBUG]: ${this.msg}`);

					return console.log(`${chalk.gray('['+dateParsed+' : ')}${chalk.cyan('DEBUG')}${chalk.gray(']:')} ${this.msg}`);
				} else {
					return false;
				}
			}
			case "connected": {
				appendToLog(`[${dateParsed} : CONNECTED]: ${this.msg}`);

				return console.log(`${chalk.gray('['+dateParsed+' : ')}${chalk.greenBright('CONNECTED')}${chalk.gray(']:')} ${this.msg}`);
			}
            case "connected": {
				appendToLog(`[${dateParsed} : READY]: ${this.msg}`);

				return console.log(`${chalk.gray('['+dateParsed+' : ')}${chalk.greenBright('READY')}${chalk.gray(']:')} ${this.msg}`);
			}
			case "success": {
				appendToLog(`[${dateParsed} : SUCCESS]: ${this.msg}`);

				return console.log(`${chalk.gray('['+dateParsed+' : ')}${chalk.green('SUCCESS')}${chalk.gray(']:')} ${this.msg}`);
			}
			case "error": {
				appendToLog(`[${dateParsed} : ERROR]: ${this.msg}`, 'error');

				return console.log(`${chalk.gray('['+dateParsed+' : ')}${chalk.bgRedBright('ERROR')}${chalk.gray(']:')} ${this.msg}`);
			}
			case "critical": {
				appendToLog(`[${dateParsed} : CRITICAL]: ${this.msg}`, 'error');

				console.log(`${chalk.gray('['+dateParsed+' : ')}${chalk.bgRed('CRITICAL')}${chalk.gray(']:')} ${this.msg}`);
				return new log(this.msg, "shutdown");
			}
			case "warning": {
				appendToLog(`[${dateParsed} : WARNING]: ${this.msg}`);

				return console.log(`${chalk.gray('['+dateParsed+' : ')}${chalk.yellow('WARNING')}${chalk.gray(']:')} ${this.msg}`);
			}
			case "important": {
				appendToLog(`[${dateParsed} : IMPORTANT]: ${this.msg}`);

				return console.log(`${chalk.gray('['+dateParsed+' : ')}${chalk.red('IMPORTANT')}${chalk.gray(']:')} ${this.msg}`);
			}
			case "shutdown": {
				new log("Shutdown procedure initialized.", "important");

				new log("Error logs were saved to '/logs/error/err-"+dP+".log'", "info");
				new log("Logs were saved to '/logs/other/"+dP+".log'", "info");

				if (this.msg) {
					appendToLog(`[${dateParsed} : SHUTDOWN]: ATOMiX is shutting down. Reason: ${this.msg}`);

					console.log(`${chalk.gray('['+dateParsed+' : ')}${chalk.red('SHUTDOWN')}${chalk.gray(']:')} ATOMiX is shutting down. Reason: ${this.msg}`);
				} else {
					appendToLog(`[${dateParsed} : SHUTDOWN]: ATOMiX is shutting down.`);

					console.log(`${chalk.gray('['+dateParsed+' : ')}${chalk.red('SHUTDOWN')}${chalk.gray(']:')} ATOMiX is shutting down.`);
				}
				
				file.end();
				errFile.end();

				return process.exit();
			}
		}
	}
}