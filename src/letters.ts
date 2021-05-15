// Listens in #1-letter-per-day and posts/edits messages in #letters

import Discord = require('discord.js');

var letters_messages = function(msg: Discord.Message | Discord.PartialMessage) {
    
}

var letters_reactions = function(reaction: Discord.MessageReaction, user: Discord.User | Discord.PartialUser) {
    // Require reactions in #letters
    if (reaction.message.channel.id != "834757828999643157")
        return;

    console.log(reaction);
}

module.exports = [letters_messages, letters_reactions];