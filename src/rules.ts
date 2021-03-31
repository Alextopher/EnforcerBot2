import Discord = require('discord.js');

var rules : Map<string, (msg: Discord.Message | Discord.PartialMessage) => void> = new Map();

// # avoid-5
rules.set("826868893905322024", function(msg) {    
    if (!msg.content) {
        return;
    }

    const banned = [ 'ℇ', 'e', 'E', '℈', '℮', 'ℯ', 'ℰ', 'ⅇ', '🇪', 'Ə' ]

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
//            msg.reply("fifth glyph in our orthography is not part of writing in this forum");
            msg.author?.send("Your message was cringe and included a banned character:\n> " + bold(msg.content));
            msg.delete();
            break;
        }
    }
});

// # embrace-e
rules.set("826868953761710140", function(msg) {
    if (!msg.content) {
        return;
    }

    let words = msg.content.split(/[\;\:\.\,\s]+/);
    
    for (let i = 0; i < words.length; i++) {
        let word = words[i];

        if (!word.includes('e') && !word.includes('E')) {
//            msg.reply("come comrade, embrace e.");
            msg.author?.send("You forget an e in this word: `" + word + "` in this post:\n> " + msg.content);
            msg.delete();
            return;
        }
    }
});

// # no posting whatsoever
rules.set("826869062541639682", function(msg) {
    msg.delete();
});

// # bot spam
rules.set("826868377024593930", function(msg) {
    if (msg.content != "bot") {
        msg.delete();
    }

    if (Math.random() < 0.20) {
        setTimeout(() => msg.channel.send("bot"), 7000);
    }
});

module.exports = rules;