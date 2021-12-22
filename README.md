# EnforcerBot2

Discord bot that enforces the rules on my server. The bot is currently running on dubsdot2.

Slowly becoming a framework for making bots.

## Running

Clone the repo

```
git clone https://gitea.cslabs.clarkson.edu/mahonec/EnforcerBot2.git
```

Ignore the error and checkout the `main` branch

```
cd EnforcerBot2
git checkout main
```

Create a `.env` file and add your bot's api token and your [NASA api key](https://api.nasa.gov/) like so:

```
TOKEN=<copy and paste the token>
NASA_KEY=<copy and paste api key>
```

Finally as **root** bring the service up with [docker-compose](https://docs.docker.com/compose/install/) 

```
sudo docker-compose up -d --build
```

## Adding rules

Rules are relatively straight forward to add. In [rules.ts](/src/rules.ts) there is a `Map` named rules that maps `channel.id` strings to a handler function; like so:

```ts
var rules : Map<string, (msg: Discord.Message) => void> = new Map();
```

So adding a new rule is as simple as:

```ts
// # no posting whatsoever
rules.set("826181775981019156", function(msg) {
    msg.delete();
});
```

## Adding slash commands

Slash commands are also easy! In [interactions.ts](/src/interactions.ts) there is a `Map` named iterations that maps `interaction.commandName` to a handler function; like so:

```ts
interactions.set("ping", [new SlashCommandBuilder().setName("ping").setDescription("Replies with pong!"), interaction => {  
    interaction.reply("Pong!");
}]);

interactions.set("pong", [new SlashCommandBuilder().setName("pong").setDescription("Replies with ping!"), interaction => {    
    interaction.reply("Ping!");
}]);
```