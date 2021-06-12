const config = require('./config.json');
const info = require('./informations.json');
const client = require('./index.js');
const Log = require('./util/modules/logger.js');

if (!config.prefix) return new Log("No command prefix set!", "critical");
if (!info.currentVersion) return new Log("No current version set. Version won't display, this may lead to some issues.", "warn");