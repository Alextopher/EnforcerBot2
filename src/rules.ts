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

    let words = msg.content.split(/[\s]+/);

    for (let i = 0; i < words.length; i++) {
        let word = words[i];

        if (Discord.MessageMentions.CHANNELS_PATTERN.test(word) || Discord.MessageMentions.EVERYONE_PATTERN.test(word)
         || Discord.MessageMentions.ROLES_PATTERN.test(word) || Discord.MessageMentions.USERS_PATTERN.test(word)) {
            continue;
        }

        if (!word.includes('e') && !word.includes('E') ) {
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

// # odd
rules.set("834816504939675688", function(msg) {
    let discriminator = parseInt(msg.author!.discriminator);

    // yeet even users
    if (discriminator % 2 == 0) {
        msg.delete();
    }
});

// # even
rules.set("834816520856666172", function(msg) {
    let discriminator = parseInt(msg.author!.discriminator);
    
    // yeet odd users
    if (discriminator % 2 == 1) {
        msg.delete();
    }
});

module.exports = rules;