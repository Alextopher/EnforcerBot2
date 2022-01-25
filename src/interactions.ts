import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction, CommandInteraction, CacheType, Awaitable, GuildMember, TextChannel } from 'discord.js';
import { getAPODEmbed } from './apod';
import { getStartTime, pushButton, startButton, updateChannel } from './button';
import { rpsCreateChallenge, rpsThrow } from './rps';

var interactions : Map<String, [Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">, (interaction: CommandInteraction<CacheType>) => Awaitable<void>]> = new Map();

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

// APOD
interactions.set("apod", [new SlashCommandBuilder().setName("apod").setDescription("Sends NASA's Astromy Picture of The Day"), async interaction => {
    interaction.reply({embeds: [await getAPODEmbed()]});
}]);

// BUTTON
interactions.set("push", [new SlashCommandBuilder().setName("push").setDescription("Push the button"), async interaction => {
    interaction.reply(await pushButton(interaction.member as GuildMember));
}]);

interactions.set("update", [new SlashCommandBuilder().setName("update").setDescription("update the button"), async interaction => {
    let respose = await updateChannel(interaction.guild!);
    if (!respose) {
        respose = "Failed to update button";
    }

    interaction.reply(respose + ". Start Time: " + getStartTime(interaction.guild!));
}]);

interactions.set("start", [new SlashCommandBuilder().setName("start").setDescription("Start the button"), async interaction => {
    if (interaction.member.user.id !== "539108568285184001") {
        interaction.reply("sucks to suck you don't have the privledge");
    } else {
        interaction.reply(startButton(interaction.guild!));
    }
}]);

// RPS
const CHALLENGE_COMMAND = new SlashCommandBuilder()
    .setName("challenge")
    .setDescription("Challenge someone to rock paper scissors")
    .addUserOption(option => 
        option.setName("opponent")
        .setDescription("Opponent you want to challenge to rock paper scissors")
        .setRequired(true));

interactions.set("challenge", [CHALLENGE_COMMAND, async interaction => {
    if (interaction.member instanceof GuildMember && interaction.inGuild && interaction.channel instanceof TextChannel) {    
        const opponent = interaction.options.getMember("opponent", true) as GuildMember;
        interaction.reply(rpsCreateChallenge(interaction.channel, interaction.member, opponent));
    } else {
        interaction.reply({ephemeral: true, content: "Sorry this doesn't work here"});
    }
}]);

interactions.set("rock", [new SlashCommandBuilder().setName("rock").setDescription("throw rock"), async interaction => {
    if (interaction.member instanceof GuildMember) {
        interaction.reply(rpsThrow(interaction.member, "ROCK"));
    } else {
        interaction.reply({ephemeral: true, content: "Sorry this doesn't work here"});
    }
}]);

interactions.set("paper", [new SlashCommandBuilder().setName("paper").setDescription("throw paper"), async interaction => {
    if (interaction.member instanceof GuildMember) {
        interaction.reply(rpsThrow(interaction.member, "PAPER"));
    } else {
        interaction.reply({ephemeral: true, content: "Sorry this doesn't work here"});
    }
}]);

interactions.set("scissors", [new SlashCommandBuilder().setName("scissors").setDescription("throw scissors"), async interaction => {
    if (interaction.member instanceof GuildMember) {
        interaction.reply(rpsThrow(interaction.member, "SCISSORS"));
    } else {
        interaction.reply({ephemeral: true, content: "Sorry this doesn't work here"});
    }
}]);

interactions.set("reject", [new SlashCommandBuilder().setName("reject").setDescription("Start the button"), async interaction => {
    if (interaction.member instanceof GuildMember) {
        interaction.reply(rpsThrow(interaction.member, "REJECT"));
    } else {
        interaction.reply({ephemeral: true, content: "Sorry this doesn't work here"});
    }
}]);

// BOT
interactions.set("ping", [new SlashCommandBuilder().setName("ping").setDescription("check"), async interaction => {
    const sent: any = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    interaction.editReply(`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
}]);

interactions.set("source", [new SlashCommandBuilder().setName("source").setDescription("Returns a link to my source code"), async interaction => {
    interaction.reply("https://github.com/Alextopher/EnforcerBot2");
}]);

export {get_interactions_json, handle_interactions}
