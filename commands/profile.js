var request = require('request');
const fs = require('fs');
var RSDict;
var runeslist;
try {
    RSDict = JSON.parse(fs.readFileSync("./resources/runessumms.json"))
    runeslist = JSON.parse(fs.readFileSync("./resources/en_US/runesReforged.json", "utf-8"));
}
catch (err) {
    console.log(err);
    return;
}
var summ;
try {
    summ = JSON.parse(fs.readFileSync("./resources/en_US/summoner.json", "utf-8"));
}
catch (err) {
    console.log(err);
    return;
}
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'profile',
    description: 'Get profile of specified user',
    execute(msg, args, APIKEY) {
        try {
            profile(msg, args, APIKEY);
        }
        catch(error) {
            console.log(error.toString());
            msg.channel.send("error");
            return;
        }
    }
}

async function profile(msg, args, APIKEY) {
    msg.channel.startTyping();
    console.log(args);
    var platform = "na1";
    var region = "americas";
    if (String(args[0]).substr(0, 2) == "--") {
        ret = getRegion(String(args[0]).substring(2));
        platform = ret[0];
        region = ret[1];
        // handle region names
        args = args.slice(1);
    }
    username = "";
    args.forEach(word => username = username.concat(word + "%20"));
    username = username.substr(0, username.length - 3);
    console.log("plat: " + platform);
    console.log("region: " + region);
    console.log("username: " + username);
    var url = "https://" + platform + ".api.riotgames.com/lol/summoner/v4/summoners/by-name/" + username + "?api_key=" + APIKEY;
    console.log(url);
    var summonerBody = await getBody(url);
    console.log(summonerBody);
    var summoner = JSON.parse(summonerBody);
    if (summoner.status != null && summoner.status.status_code == 403) {
        msg.channel.send("tell jack to update the api key");
        return;
    }
    if (summoner.name == null) {
        msg.channel.send("Summoner does not exist!\nCheck spelling and region");
        return;
    }
    // get next url from region
    url = "https://" + region + ".api.riotgames.com/lol/match/v5/matches/by-puuid/" + summoner.puuid + "/ids?start=0&count=20&api_key=" + APIKEY;
    var matchesBody = await getBody(url);
    console.log(url);
    var matches = JSON.parse(matchesBody);
    console.log(matches);
    var match = [];
    // for loop in case i switch back to 3 games
    for (var i = 0; i < 1; i++) {
        url = "https://" + region + ".api.riotgames.com/lol/match/v5/matches/" + matches[i] + "?api_key=" + APIKEY;
        timeurl = "https://" + region + ".api.riotgames.com/lol/match/v5/matches/" + matches[i] + "/timeline?api_key=" + APIKEY;
        match.push(await getMatch(url, timeurl, summoner.puuid, msg.createdTimestamp));
    }
    console.log(match);
    url = "https://" + platform + ".api.riotgames.com/lol/league/v4/entries/by-summoner/" + summoner.id + "?api_key=" + APIKEY;
    var rankBody = await getBody(url);
    var rank = JSON.parse(rankBody);
    var rankidx = 0;
    for (var i = 0; i < rank.length; i++) {
        if (rank[i].queueType == "RANKED_SOLO_5x5") {
            rankidx = i;
        }
    }
    var rankl = rank[rankidx];
    var rankCase = rankl.tier.substr(0, 1) +
        rankl.tier.substr(1).toLowerCase();
    console.log(rankBody);
    var div = rankl.rank + " ";
    if (rankCase == "Challenger" || rankCase == "Grandmaster" || rankCase == "Master") {
        div = "";
    }
    url = "https://" + platform + ".api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + summoner.id + "?api_key=" + APIKEY;
    var mastery = await getMastery(url);
    var embed = new MessageEmbed()
        .setAuthor(summoner.name + "'s profile", "attachment://" + summoner.profileIconId + ".png")
        .setTitle("Current rank: " + rankCase + " " + div +
            String(rankl.leaguePoints) + " LP")
        .setURL('https://matias.ma/nsfw/')
        .attachFiles("resources/images/Emblem_" +
            rankl.tier + ".png")
        .attachFiles("resources/dragon/11.20.1/img/profileicon/" + summoner.profileIconId + ".png")
        .setThumbnail("attachment://Emblem_" +
            rankl.tier + ".png")
        .addFields(
            {
                name:
                    "Ranked Win/Loss: " + String(rankl.wins) + "W/" +
                    String(rankl.losses) + "L",
                value:
                    "Winrate: " + String(Math.round(
                    rankl.wins / (rankl.losses +
                    rankl.wins) * 100)) + "%",
            },
            {
                name: "Most Recent Game",
                value: match,
                inline: true
            },
            {
                name: "Highest Champion Masteries",
                value: mastery,
                inline: true
            }
        );
    msg.channel.stopTyping();
    msg.channel.send(embed);
}

async function getMatch(url, timeurl, puuid, timestamp) {
    var matchBody = await getBody(url);
    var match = JSON.parse(matchBody);
    const participants = match.info.participants;
    var totalKills = 0;
    var idx = 0;
    for (i = 0; i < 10; i++) {
        if (participants[i].puuid == puuid) {
            idx = i;
        }
    }
    const partInfo = match.info.participants[idx];
    for (i = 0; i < 10; i++) {
        if (participants[i].teamId == partInfo.teamId) {
            totalKills += participants[i].kills;
        }
    }
    console.log("idx = " + idx);
    console.log(match);
    var win = "Victory!";
    if (match.info.gameDuration < 300) {
        win = "Remake";
    }
    if (partInfo.win == false) {
        win = "Loss";
    }
    var primary = partInfo.perks.styles[0].selections[0].perk;
    var primaryFound = false;
    var primaryString = "";
    var secondary = partInfo.perks.styles[1].style;
    var secondaryFound = false;
    var secondaryString = "";
    for (i = 0; i < runeslist.length && (primaryFound == false
        || secondaryFound == false); i++) {
        if (secondary == runeslist[i].id) {
            secondaryFound = true;
            secondaryString = runeslist[i].name;
        }
        var sl = runeslist[i].slots[0].runes;
        for (x = 0; x < sl.length; x++) {
            if (primary == sl[x].id) {
                primaryFound = true;
                primaryString = sl[x].name;
            }
        }
    }
    var summ1 = "";
    var summ1Found = false;
    var summ2 = "";
    var summ2Found = false;
    const summkeys = Object.keys(summ.data);
    for (i = 0; i < summkeys.length && (summ1Found == false
        || summ2Found == false); i++) {
        if (partInfo.summoner1Id == summ.data[summkeys[i]].key) {
            summ1 = summ.data[summkeys[i]].name;
            summ1Found = true;
        }
        if (partInfo.summoner2Id == summ.data[summkeys[i]].key) {
            summ2 = summ.data[summkeys[i]].name;
            summ2Found = true;
        }
    }
    var realStartBody = await getBody(timeurl);
    var realStart = JSON.parse(realStartBody);
    const realStartStamp = realStart.info.frames[1].events[0].timestamp * 10 + match.info.gameStartTimestamp;
    console.log(realStartStamp);
    var cs = partInfo.neutralMinionsKilled + partInfo.totalMinionsKilled;
    return win + "\n" +
        partInfo.championName + "\n" +
        get_dhm(timestamp -
        match.info.gameStartTimestamp -
        match.info.gameDuration) + " \n" + 
        RSDict[primaryString] + " | " + String(partInfo.kills) + " / " +
        String(partInfo.deaths) + " / " +
        String(partInfo.assists) + " \n" + 
        RSDict[secondaryString] + " | " +
        String(Math.round((partInfo.kills + partInfo.assists)/totalKills * 100)) +
        "% KP \n" + 
        RSDict[summ1] + " | " + get_minutes(match.info.gameEndTimestamp - realStartStamp) + " \n" + 
        RSDict[summ2] + " | " + String(cs) + 
        " (" + String((Math.round(cs / 
            ((match.info.gameEndTimestamp - realStartStamp)/600000)))/10) + ") CS";
}

async function getMastery(url) {
    var mastBody = await getBody(url);
    var mastery = JSON.parse(mastBody);
    console.log(mastery);
    return "<:Poppy:897540086609092648>" + " **Poppy** \nLevel " + 
    mastery[0].championLevel + " <:m7:900474020376502272> | " + 
    mastery[0].championPoints + " Points\n" + 
    "<:Twitch:897540901323280444>" + " **Twitch** \nLevel " +
    mastery[1].championLevel + " <:m7:900474020376502272> | " +
    mastery[1].championPoints + " Points\n" + 
    "<:Rengar:897540086487449722>" + " **Rengar** \nLevel " + 
    mastery[2].championLevel + " <:m7:900474020376502272> | " + 
    mastery[2].championPoints + " Points\n";
}

function getBody(url) {
    return new Promise (resolve => {
        setTimeout(function() { 
            request(url, function(error, response, body) {
                resolve(body);
            });
        }, 100);
    });
}

function getRegion(plt) {
    var platform = "";
    var region = "";
    if (plt == "br") {
        platform = "br1";
        region = "americas";
    } else if (plt == "eun" || plt == "eune") {
        platform = "eun1";
        region = "europe";
    } else if (plt == "euw") {
        platform = "euw1";
        region = "europe";
    } else if (plt == "jp") {
        platform = "jp1";
        region = "asia";
    } else if (plt == "kr") {
        platform = "kr";
        region = "asia";
    } else if (plt == "lan" || plt == "la1") {
        platform = "la1";
        region = "americas";
    } else if (plt == "las" || plt == "la2") {
        platform = "la2";
        region = "americas";
    } else if (plt == "na" || plt == "🇺🇸") {
        platform = "na1";
        region = "americas";
    } else if (plt == "oc" || plt == "oce") {
        platform = "oc1";
        // why is oceania in the americas? did we take that much of it?
        region = "amercias";
    } else if (plt == "tr") {
        platform = "tr1";
        region = "europe";
    } else if (plt == "ru") {
        platform = "ru";
        region = "europe";
    }
    ret = [];
    ret.push(platform);
    ret.push(region);
    return ret;
}

function get_dhm(seconds) {
    seconds /= 1000;
    var d = Math.floor(seconds / (3600 * 24));
    if (d != 0) {
        if (d == 1) {
            return String(d) + " Day ago";
        }
        return String(d) + " Days ago";
    }
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    if (h != 0) {
        if (h == 1) {
            return String(h) + " Hour ago";
        }
        return String(h) + " Hours ago";
    }
    var m = Math.floor(seconds % 3600 / 60);
    if (m == 1) {
        return String(m) + " Minute ago";
    }
    return String(m) + " Minutes ago";
}

function get_minutes(ms) {
    var seconds = Math.round(ms / 1000 % 60);
    var minutes = Math.round(ms / 60000);
    return String(minutes) + " minutes " + String(seconds) + " seconds";
}



