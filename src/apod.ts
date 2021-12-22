import https = require('https')
import Discord = require('discord.js');

type APOD = {
    copyright: string,
    date: string,
    explanation: string,
    hdurl: string,
    media_type: string,
    service_version: string,
    title: string,
    url: string 
}

async function apod() {
    return new Promise<APOD>((resolve, reject) => {
        const req = https.request(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_KEY}`, res => {
            let data = '';
            res.on("data", chunk => {
                data = data + chunk.toString();
            });
    
            res.on('error', reject);

            res.on('end', () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode <= 299) {
                    resolve(JSON.parse(data));
                } else {
                    reject(res);
                }
            });
        });

        req.on('error', reject)
        req.end()
    })
}

async function getAPODEmbed() {
    const embed = new Discord.MessageEmbed();

    await apod().then(res => {
        embed.setTitle(res.title)
            .setImage(res.hdurl)
            .setAuthor(res.copyright + " " + res.date)
            .setColor('RED');
    });

    return embed;
}

async function sendAPODEmbded(channel: Discord.Message["channel"]) {
    channel.send({embeds: [await getAPODEmbed()]});
}

export { sendAPODEmbded, getAPODEmbed }