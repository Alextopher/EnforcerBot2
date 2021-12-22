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

export default async function sendAPOD(channel: Discord.Message["channel"]) {
    const embed = new Discord.MessageEmbed();

    apod().then(res => {
        embed.setTitle(res.title)
            .setImage(res.hdurl)
            .setAuthor(res.copyright + " " + res.date)
            .setColor('RED');
    }).then(() => {
        channel.send(embed);
    }).catch(error => {
        console.log("Failed to send APOD", error);
    })
}
