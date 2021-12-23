import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction, CommandInteraction, CacheType, Awaitable, GuildMember } from 'discord.js';
import { getAPODEmbed } from './apod';
import { pushButton, startButton } from './button';

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

interactions.set("apod", [new SlashCommandBuilder().setName("apod").setDescription("Sends NASA's Astromy Picture of The Day"), async interaction => {
    interaction.reply( {embeds: [await getAPODEmbed()]});
}]);

interactions.set("push", [new SlashCommandBuilder().setName("push").setDescription("Push the button"), async interaction => {
    interaction.reply(pushButton(interaction.member as GuildMember));
}]);

interactions.set("start", [new SlashCommandBuilder().setName("start").setDescription("Start the button"), async interaction => {
    if (interaction.member.user.id !== "539108568285184001") {
        interaction.reply("sucks to suck you don't have the privledge");
    } else {
        interaction.reply(startButton(interaction.guild!));
    }
}]);

interactions.set("ping", [new SlashCommandBuilder().setName("ping").setDescription("check"), async interaction => {
    const sent: any = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    interaction.editReply(`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
}]);


interactions.set("source", [new SlashCommandBuilder().setName("source").setDescription("Returns a link to my source code"), async interaction => {
    interaction.reply("https://github.com/Alextopher/EnforcerBot2");
}]);

export {get_interactions_json, handle_interactions}