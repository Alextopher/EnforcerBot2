# EnforcerBot2

Discord bot that enforces the rules on the Potsdam ∩ COSI server. The bot is currently running on dubsdot2.

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

Create a `.env` file and add your bot's api token like so:

```
TOKEN=<copy and paste the token>
```

Finally as **root** bring the service up with [docker-compose](https://docs.docker.com/compose/install/) 

```
sudo docker-compose up -d
```

## Adding rules

Rules are relatively straight forward to add. In [rules.ts](/src/rules.ts) there is a `Map` name rules that maps `channel.id` strings to a functions `(msg: Discord.Message) => void`. So adding new rules is really simple:

```ts
// # no posting whatsoever
rules.set("826181775981019156", function(msg) {
    msg.delete();
});
```

Whenever a message is posted or edited [index.ts](/src/index.ts) will check if `msg.channel.id` has an associated function and then calls the function on the message.

```ts
// get the rule
let rule : ((msg: Discord.Message) => void) | undefined = rules.get(msg.channel.id);
// check if the rule exists
if (rule != undefined) {
    // callback
    rule(msg);
}
```