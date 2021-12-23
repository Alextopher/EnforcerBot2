import { Client, ColorResolvable, Guild, GuildMember, Role } from "discord.js"
import { LocalStorage } from  "node-localstorage"

// Setup local storage
var buttonStorage = new LocalStorage("./button");

const colors: ColorResolvable[] = [
    "PURPLE",
    "BLUE",
    "GREEN",   
    "YELLOW",
    "ORANGE",
    "RED"
]

let rolesMap: Map<ColorResolvable, string> = new Map();

let colorToEmoji: Map<ColorResolvable, string> = new Map([
    ["PURPLE", "🟣"],
    ["BLUE", "🔵"],
    ["GREEN", "🟢"],
    ["YELLOW", "🟡"],
    ["ORANGE", "🟠"],
    ["RED", "🔴"],
]);

// let colorToDays: Map<string, number> = new Map([
//     ["GREY", 0],
//     ["PURPLE", 1],
//     ["BLUE", 2],
//     ["GREEN",  3],
//     ["YELLOW", 4],
//     ["ORANGE", 5],
//     ["RED", 6],
// ]);

function startButton(guild: Guild) {
    buttonStorage.setItem(guild.id, Date.now().toString());
    return Date.now().toString();
}

async function updateRoles(guild: Guild) {
    // The roles from the server
    const roles = await guild.roles.fetch();

    // Check that the server has a role for each color
    colors.forEach(async color => {
        const name = (color as String).toLocaleLowerCase()

        let role: Role;
        // Get color roles
        let filtered = roles.filter(r => r.name == name)

        if (filtered.size > 0) {
            role = filtered.first()!
        } else {
            console.log("create role", name);
            role = await guild.roles.create({
                name: name,
                color: color
            });
        }

        rolesMap.set(color, role!.id);
    });
}

async function pushButton(user: GuildMember) {
    const color = getColor(user.guild);

    if (!color) {
        return "Sorry, the button is over. Beg for it to be restarted, or die.";
    }

    // Remove all other color roles and then add the new color
    console.log([...rolesMap.values()])
    user.roles.remove([...rolesMap.values()]).then(user => {
        user.roles.add(rolesMap.get(color)!);
    });

    // Set the new button time
    buttonStorage.setItem(user.guild.id, Date.now().toString());

    // Update the channel
    await updateChannel(user.guild);

    return `${user.displayName} has pushed the button and has become ${color}.`
}

function getColor(guild: Guild) {
    let lastPressed = buttonStorage.getItem(guild.id);

    if (lastPressed == null) {
        lastPressed = Date.now().toString();
    }

    let currentTime = Date.now();
    let difference = currentTime - parseInt(lastPressed);
    
    // Compute difference in milliseconds to diffence in days
    let days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (days > 6) {
        return;
    }

    return colors[days];
}

async function updateChannel(guild: Guild) {
    const channel = await guild.channels.fetch("923410684161703937");

    if (!channel) {
        console.log("Could not get button channel by id");
        return;
    }

    const color = getColor(guild);
    
    let name: string; 

    if (color) {
        name = "button-" + colorToEmoji.get(color);
    } else {
        name = "button";
    }

    console.log(color, name);
    return channel.setName(name).then(newChannel => `Channel's new name is ${newChannel.name}`);
}

export { pushButton, updateRoles, startButton, updateChannel }