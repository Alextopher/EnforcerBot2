import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction, CommandInteraction, CacheType, Awaitable } from 'discord.js';
import { getAPODEmbed } from './apod';

var interactions : Map<String, [SlashCommandBuilder, (interaction: CommandInteraction<CacheType>) => Awaitable<void>]> = new Map();

function get_interactions_json() {
    // Get command builders
    return [...interactions.values()].map(v => v[0].toJSON());
}

function handle_interactions(interaction: Interaction<CacheType>) {
    if (!interaction.isCommand()) return;

    let handler = interactions.get(interaction.commandName);

    if (handler) {
        handler[1](interaction)
    }
}

interactions.set("ping", [new SlashCommandBuilder().setName("ping").setDescription("Replies with pong!"), interaction => {  
    interaction.reply("Pong!");
}]);

interactions.set("pong", [new SlashCommandBuilder().setName("pong").setDescription("Replies with ping!"), interaction => {    
    interaction.reply("Ping!");
}]);

interactions.set("apod", [new SlashCommandBuilder().setName("apod").setDescription("Sends NASA's Astromy Picture of The Day"), async interaction => {
    interaction.reply( {embeds: [await getAPODEmbed()]});
}]);


interactions.set("source", [new SlashCommandBuilder().setName("source").setDescription("Returns a link to my source code"), async interaction => {
    interaction.reply("https://github.com/Alextopher/EnforcerBot2");
}]);

export {get_interactions_json, handle_interactions}