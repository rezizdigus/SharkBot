let previousPictures = [];

module.exports = {
	Info: Info = {
		command: "shark",
		usage: ";shark",
		description: "Shows a picture of a shork",
		aliases: ['sharkpicture', 'sharkpic', 'shork'],
		permissions: ['NONE'],
		guildOnly: false
	},

	run: async (client, message, args) => {
		let msg = await message.reply('Thinking...');
        
        if (args.includes('--sendlinkdata')) {
            msg.edit(`<@${message.author.id}>, here are all the links.`)
            return message.reply({ files: ['./sharkpics.json'] })
        }

		let pictures = require("./sharkpics.json").sharkPictureLinks;

		if (previousPictures.length > 10) {
			previousPictures.splice(0, 2);
		}

		let rng = Math.floor(Math.random() * pictures.length);

		function reroll() {
			rng = Math.floor(Math.random() * pictures.length)

			if (previousPictures.includes(rng)) {
				reroll();
			}
		}

		if (previousPictures.includes(rng)) {
			reroll();
		}

		previousPictures.push(rng);
		let sharkPic = pictures[rng];
        if (sharkPic.attach == true) {
            msg.delete();
			if (client.DebugEnabled) return message.reply(`**Here's a shork picture** (Added by \`\`${sharkPic.userAddedBy}\`\`)\n=====================\n**DEBUG MODE ENABLED**\nAdditional Info\n\`\`idAddedBy\`\`: \`\`${sharkPic.idAddedBy}\`\`;\n\`\`userAddedBy\`\`: \`\`${sharkPic.userAddedBy}\`\`;\n\`\`attach\`\`: \`\`${toString(sharkPic.attach)}\`\`;\n\`\`link\`\`: \`\`${sharkPic.link}\`\`;`, { files: [sharkPic.link] });
			return message.reply(`**Here's a shork picture** (Added by \`\`${sharkPic.userAddedBy}\`\`)`, { files: [sharkPic.link] });
        } else {
			if (client.DebugEnabled) return msg.edit(`<@${message.author.id}>, **Here's a shork picture:** ${sharkPic.link} (Added by \`\`${sharkPic.userAddedBy}\`\`)\n=====================\n**DEBUG MODE ENABLED**\nAdditional Info\n\`\`idAddedBy\`\`: \`\`${sharkPic.idAddedBy}\`\`;\n\`\`userAddedBy\`\`: \`\`${sharkPic.userAddedBy}\`\`;\n\`\`attach\`\`: \`\`${toString(sharkPic.attach)}\`\`;\n\`\`link\`\`: \`\`${sharkPic.link}\`\`;`, { files: [sharkPic.link] });
			return msg.edit(`<@${message.author.id}>, **Here's a shork picture:** ${sharkPic.link} (Added by \`\`${sharkPic.userAddedBy}\`\`)`);
    	}
	}
}