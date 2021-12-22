require('dotenv').config();

import Discord = require('discord.js');
import handle_rules from './rules';
import sendAPOD from './apod';
import { scheduleJob } from 'node-schedule';

const bot = new Discord.Client();

scheduleJob('35 30 7 * * *', async () => {
    console.log("Sending APOD")
    const channel = bot.channels.cache.get("826845551122710539") as Discord.TextChannel

    if (!channel) {
        console.log("Failed to load channel to send APOD!")
    } else {
        sendAPOD(channel)
    }
});

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user!.tag}!`);
});

bot.on('message', async msg => {
    // Exclude itself
    if (msg.author.id == "826495787240390727") return;

    if (msg.content.startsWith("apod")) {
        sendAPOD(msg.channel)
    }

    handle_rules(msg);
});

bot.on('messageUpdate', (_, newmsg) => {
    // Exclude itself
    if (newmsg.author?.id == "826495787240390727") return;

    handle_rules(newmsg);
});

bot.login(process.env.TOKEN);
