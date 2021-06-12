const fs = require('fs');
const path = require('path');
const log = require('../util/modules/logger');

const jsonFile = path.join(__dirname, 'sharkpics.json')

function appendJson(picLink, addedById, addedByUsername) {
	fs.readFile(jsonFile, 'utf8', function readFileCallback(err, data){
		if (err){
			console.log(err);
		} else {
		obj = JSON.parse(data); //now it an object
		obj.sharkPictureLinks.push({ idAddedBy: addedById, userAddedBy: addedByUsername, link: picLink }); //add some data
		json = JSON.stringify(obj); //convert it back to json
		fs.writeFile(jsonFile, json, 'utf8', () => {
			new log(`${addedById} has added a new shark picture (${picLink})`);
		}); // write it back 
	}});
}

module.exports = {
	Info: Info = {
		command: "addsharkpicture",
		usage: ";addsharkpic <**link** to an image/embedded image>",
		description: "Adds a shark picture to the database.",
		aliases: ['addspic', 'addshark'],
		permissions: ['NONE'],
		guildOnly: false
	},

	run: (client, message, args) => {
		if (!args[1]) {
			return message.reply(`You need to provide \`\`argument 1\`\` (Usage: ${this.Info.usage})`);
		}

		try {
			appendJson(args[1], message.author.id, message.member.user.tag);
		} catch (e) {
			return message.reply(`Sowwy! An error occured while adding this picture, please report this into the bot's author.`);
		}
		return message.reply(`Picture added! Thanks!`);
	}
}