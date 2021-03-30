import Discord = require('discord.js');

var rules : Map<string, (msg: Discord.Message | Discord.PartialMessage) => void> = new Map();

// # avoid-5
rules.set("826491102152359936", function(msg) {    
    if (!msg.content) {
        return;
    }

    const banned = [ 'ℇ', 'e', 'E', '℈', '℮', 'ℯ', 'ℰ', 'ⅇ', '🇪' ]

    function bold(msg: string) {
        for (let i = 0; i < banned.length; i++) {
            let str = banned[i];
            msg = msg.replace(str, "**" + str + "**");
        }

        return msg;
    }

    for (let i = 0; i < banned.length; i++) {
        let str = banned[i];

        console.log(str, msg.content.includes(str));
        if (msg.content.includes(str)) {
            msg.reply("fifth glyph in our orthography is not part of writing in this forum");
            msg.author?.send("Your message was cringe and included a banned character:\n> " + bold(msg.content));
            msg.delete();
            break;
        }
    }
});

// # embrace-e
rules.set("826492976640557087", function(msg) {
    if (!msg.content) {
        return;
    }

    let words = msg.content.split(/[\;\:\.\,\s]+/);
    
    for (let i = 0; i < words.length; i++) {
        let word = words[i];

        if (!word.includes('e') && !word.includes('E')) {
            msg.reply("come comrade, embrace e.");
            msg.author?.send("You forget an e in this word: `" + word + "` in this post:\n> " + msg.content);
            msg.delete();
            return;
        }
    }
});

// # no posting whatsoever
rules.set("826181775981019156", function(msg) {
    msg.delete();
});

module.exports = rules;