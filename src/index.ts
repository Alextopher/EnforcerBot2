require('dotenv').config();

import Discord = require('discord.js');
var rules : Map<string, (msg: Discord.Message | Discord.PartialMessage) => void> = require('./rules');

const bot = new Discord.Client();

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user!.tag}!`);
});

bot.on('message', (msg) => {
    // Exclude itself
    if (msg.author.id == "826495787240390727") return;

    let rule = rules.get(msg.channel.id);
    if (rule != undefined) {
        rule(msg);
    }
})

bot.on('messageUpdate', (_, newmsg) => {
    // Exclude itself
    if (newmsg.author?.id == "826495787240390727") return;

    let rule = rules.get(newmsg.channel.id);
    if (rule != undefined) {
        rule(newmsg);
    }
})

bot.login(process.env.TOKEN);
