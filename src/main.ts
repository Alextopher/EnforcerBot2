require('dotenv').config();

import { scheduleJob } from 'node-schedule';

import { Client, Intents, TextChannel } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import handle_rules from './rules';
import { get_interactions_json, handle_interactions } from './interactions';
import { sendAPODEmbded } from './apod';
import { updateChannel, updateRoles } from './button';


const bot = new Client({
    intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS ]
});

// Schedule APOD (UTC)
scheduleJob('35 30 12 * * *', async () => {
    console.log(Date(), "Sending APOD")
    const channel = bot.channels.cache.get("826845551122710539") as TextChannel;

    if (!channel) {
        console.log("Failed to load channel to send APOD!");
    } else {
        sendAPODEmbded(channel);
    }
});

// Update the color of the button every hour
scheduleJob("0 0 * * * *", async () => {
    let guild = await bot.guilds.fetch("678782910417076280");

    await updateChannel(guild).then(console.log);
})

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user!.tag}!`);

    rest.put(Routes.applicationGuildCommands(bot.user!.id, "678782910417076280"), { body: get_interactions_json() })
        .then(() => console.log('Successfully registered guild commands.'))
        .catch(console.error);

    bot.guilds.fetch("678782910417076280").then(channel => updateRoles(channel));
});

bot.on("interactionCreate", async interaction => {
    handle_interactions(interaction);
})

bot.on('messageCreate', async msg => {
    // Exclude itself
    if (msg.author.id == "826495787240390727") return;

    handle_rules(msg);
});

bot.on('messageUpdate', (_, newmsg) => {
    // Exclude itself
    if (newmsg.author?.id == "826495787240390727") return;

    handle_rules(newmsg);
});

bot.login(process.env.TOKEN);
const rest = new REST({ version: '9' }).setToken(process.env.TOKEN!);
