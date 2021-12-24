import { GuildMember, InteractionReplyOptions, TextChannel } from "discord.js";

type Throw = "ROCK" | "PAPER" | "SCISSORS" | "REJECT";

function aVSb(a: Throw, b: Throw): -1 | 0 | 1 {
    // ROCK > SCISSORS
    // SCISSORS > PAPER
    // PAPER > ROCK
    switch (a) {
        case "ROCK":
            switch (b) {
                case "ROCK":
                    return 0;
                case "PAPER":
                    return -1;
                case "SCISSORS":
                    return 1;
                case "REJECT":
                    return 1
            }
        case "PAPER":
            switch (b) {
                case "ROCK":
                    return 1;
                case "PAPER":
                    return 0;
                case "SCISSORS":
                    return -1;
                case "REJECT":
                    return 1
            }
        case "SCISSORS":
            switch (b) {
                case "ROCK":
                    return -1;
                case "PAPER":
                    return 1;
                case "SCISSORS":
                    return 0;
                case "REJECT":
                    return 1
            }
        case "REJECT":
            switch (b) {
                case "ROCK":
                    return -1;
                case "PAPER":
                    return -1;
                case "SCISSORS":
                    return -1;
                case "REJECT":
                    return 0
            }    
    }
}

// Both players have X minutes to respond to a challenge
const CHALLENGE_TIME_MINUTES = 2;
const CHALLENGE_TIME = 1000 * 60 * CHALLENGE_TIME_MINUTES;

class Challenge {
    channel: TextChannel;
    challenger: GuildMember;
    defender: GuildMember;
    challengerThrows?: Throw;
    defenderThrows?: Throw;
    time: number;

    constructor(channel: TextChannel, challenger: GuildMember, defender: GuildMember) {
        this.channel = channel;
        this.challenger = challenger;
        this.defender = defender;
        this.time = Date.now();
    }

    resolve(): [winner: GuildMember | null | "TIE" | "REPEAT", message: string] | null {
        // Nobody responded
        if (!this.defenderThrows && !this.challengerThrows) {
            if (Date.now() - this.time > CHALLENGE_TIME) {
                return ["TIE", `Go home everyone. Neither ${this.defender} or ${this.challenger} responded to the challenge.`];
            } else {
                // There is still time
                return null;
            }
        }

        // Both players rejected the challenge (this should never happen)
        if (this.challengerThrows == "REJECT" && this.defenderThrows == "REJECT") {
            return ["TIE", `${this.challenger} back downed and ${this.defender} rejected the challenge. Can we all be friends now?`];
        }

        // Challenger rejected the challenge
        if (this.challengerThrows == "REJECT") {
            return [null, `${this.challenger} has cooled off and has aborted the challenge. **NO WINNER**.`];
        }

        // Defender rejected the challenge
        if (this.defenderThrows == "REJECT") {
            return [null, `${this.defender} is trying to be the bigger person and has rejected the challenge. **NO WINNER**`];
        }

        // Challenger responded but defender didn't
        if (!this.defenderThrows) {
            return [this.challenger, `${this.defender} didn't respond to the challenge, forfeiting. ${this.challenger} **WINS** by default.`];
        }

        // Defender responded but challenger didn't
        if (!this.challengerThrows) {
            return [this.defender, `${this.challenger} didn't respond to the challenge, forfeiting. ${this.defender} **WINS** by default.`];
        }

        // R P S
        const result = aVSb(this.challengerThrows, this.defenderThrows);

        switch (result) {
            case -1:
                return [this.defender, `${this.challenger} threw ${this.challengerThrows} | ${this.defender} threw ${this.defenderThrows} | ${this.defender} **WINS**.`];
            case 0:
                // Tie
                const temp = this.challengerThrows;

                this.challengerThrows = undefined;
                this.defenderThrows = undefined;
                this.time = Date.now();
                return ["REPEAT", `**TIE** both players threw ${temp}, throw again with \`/rock\`, \`/paper\`, \`/scissors\`, or \`/reject\`.`];
            case 1:
                return [this.challenger, `${this.challenger} threw ${this.challengerThrows} | ${this.defender} threw ${this.defenderThrows} | ${this.challenger} **WINS**.`];
        }
    }
}

// Map from (guild id, user id) to challenge.
let activeChallenges: Map<string, Challenge> = new Map();

// Starts a new RPS challenge between challenger and defender
function rpsCreateChallenge(channel: TextChannel, challenger: GuildMember, defender: GuildMember): InteractionReplyOptions {
    // Someone tries to challenge themself
    if (challenger == defender) {
        return {ephemeral: true, content: "You cannot challenge yourself to rock paper scissors."}
    }

    let guildID = challenger.guild.id;
    
    // Make sure both users are free to start a competetion (pray there is no such thing as a race condition)
    if (activeChallenges.has(guildID + challenger.id)) {
        return {ephemeral: true, content: "You are already in a competetion! Reject it with \`/reject\`."};
    }

    if (activeChallenges.has(guildID + defender.id)) {
        return {ephemeral: true, content: "You can't challenge someone already in a competetion! Wait your turn."};
    }

    // Create the challenge
    let challenge = new Challenge(channel, challenger, defender);
    activeChallenges.set(guildID + challenger.id, challenge);
    activeChallenges.set(guildID + defender.id, challenge);

    // Schedule the event to end after some time
    setTimeout(rpsUpdate, CHALLENGE_TIME + 1000);

    // Start
    return {ephemeral: false, content: `${challenger} has challenged ${defender} to rock paper scissors. Both players have ${CHALLENGE_TIME_MINUTES} minutes to respond with \`/rock\`, \`/paper\`, \`/scissors\`, or \`/reject\`.`};
}

function rpsThrow(thrower: GuildMember, t: Throw): InteractionReplyOptions {
    let challenge = activeChallenges.get(thrower.guild.id + thrower.id);

    if (!challenge) {
        return {ephemeral: true, content: "Is something wrong? You aren't in a competetion. Start with \`/challenge\`."}
    }

    if (challenge.challenger === thrower) {
        challenge.challengerThrows = t;
    } else {
        challenge.defenderThrows = t;
    }

    // If both players have responded resolve the competetion
    if (t === "REJECT" || (challenge.challengerThrows && challenge.defenderThrows)) {
        const [winner, message] = challenge.resolve()!;

        if (winner != "REPEAT") {
            // Remove the challenge after completion
            activeChallenges.delete(challenge.challenger.guild.id + challenge.challenger.id);
            activeChallenges.delete(challenge.defender.guild.id + challenge.defender.id);
        } 

        return {ephemeral: false, content: message};
    } else {
        return {ephemeral: true, content: `You have thrown \`${t}\`, waiting on opponent.`};
    }
}

function rpsUpdate() {
    for (let challenge of activeChallenges.values()) {
        const result = challenge.resolve()
        if (result) {
            const [_winner, message] = result
            challenge.channel.send(message);

            // Remove the challenge after completion
            activeChallenges.delete(challenge.challenger.guild.id + challenge.challenger.id);
            activeChallenges.delete(challenge.defender.guild.id + challenge.defender.id);
        }
    }    
}

export {rpsCreateChallenge, rpsThrow, rpsUpdate}