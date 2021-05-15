require('dotenv').config();

import Discord = require('discord.js');
var handle_rules = require('./rules');
var [letters_messages, letters_reactions] = require('./letters');
import User = require('./db');



const bot = new Discord.Client();

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user!.tag}!`);
});

bot.on('message', (msg) => {
    // Exclude itself
    if (msg.author.id == "826495787240390727") return;

    handle_rules(msg);
    letters_messages(msg);
});

bot.on('messageUpdate', (_, newmsg) => {
    // Exclude itself
    if (newmsg.author?.id == "826495787240390727") return;

    handle_rules(newmsg);
    letters_messages(newmsg);
});

bot.on('messageReactionAdd', (reaction, user) => {
    letters_reactions(reaction, user);
});

bot.login(process.env.TOKEN);
