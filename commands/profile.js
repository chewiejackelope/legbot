var request = require('request');
const RSDict = { "Aftershock": "<:Aftershock_rune:794282914317205524>", "Electrocute": "<:Electrocute_rune:794282914363342888>", "Dark Harvest": "<:Dark_Harvest_rune:794282914363473950>", "Arcane Comet": "<:Arcane_Comet_rune:794282914388115486>", "Domination": "<:Domination_icon:794282914392178699>", "Conqueror": "<:Conqueror_rune:794282914425995314>", "Grasp of the Undying": "<:Grasp_of_the_Undying_rune:794282915668033558>", "Glacial Augment": "<:Glacial_Augment_rune:794282915743793154>", "Fleet Footwork": "<:Fleet_Footwork_rune:794282915956523058>", "Hail of Blades": "<:Hail_of_Blades_rune:794282915965304892>", "Guardian": "<:Guardian_rune:794282916049584138>", "Inspiration": "<:Inspiration_icon:794282916112367656>", "Sorcery": "<:Sorcery_icon:794282916116561941>", "Resolve": "<:Resolve_icon:794282916129013770>", "Lethal Tempo": "<:Lethal_Tempo_rune:794282916145790986>", "Press the Attack": "<:Press_the_Attack_rune:794282916339253288>", "Phase Rush": "<:Phase_Rush_rune:794282916438867999>", "Predator": "<:Predator_rune:794282916438868009>", "Precision": "<:Precision_icon:794282916439785502>", "Prototype: Omnistone": "<:Prototype_Omnistone_rune:794282916443586560>", "Summon Aery": "<:Summon_Aery_rune:794282916443717672>", "Unsealed Spellbook": "<:Unsealed_Spellbook_rune:794282916452106270>", "Challenging Smite": "<:Challenging_Smite:794400581061312512>", "Barrier": "<:Barrier:794400581081890816>", "Chilling Smite": "<:Chilling_Smite:794400581090803722>", "Clarity": "<:Clarity:794400581094866954>", "Exhaust": "<:Exhaust:794400581217288383>", "Ignite": "<:Ignite:794400581145722931>", "Mark": "<:Mark:794400581174951958>", "Cleanse": "<:Cleanse:794400581288067102>", "Smite": "<:Smite:794400581171150869>", "Heal": "<:Heal:794400581346263071>", "Flash": "<:Flash:794400581384142858>", "Ghost": "<:Ghost:794400580965498911>", "Teleport": "<:Teleport:794400581518491649>", }
const { MessageEmbed } = require('discord.js');
const { executablePath } = require('puppeteer');

module.exports = {
    name: 'profile',
    description: 'Get profile of specified user',
    execute(msg, args, APIKEY) {
        try {
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
            if (summoner.name == null) {
                msg.channel.send("Summoner does not exist!\nCheck spelling and region");
                return;
            }
            // get next url from region
            url = "https://" + region + ".api.riotgames.com/lol/match/v5/matches/by-puuid/" + summoner.puuid + "/ids?start=0&count=20&api_key=" + APIKEY;
            var matchesBody = getBody(url);
            console.log(url);
            var matches = JSON.parse(matchesBody);
            matches = JSON.parse(bodyy);
            console.log(matches);
            url = "https://" + region + ".api.riotgames.com/lol/match/v5/matches/" + matches[0] + "?api_key=" + APIKEY;
            var matchBody = getBody(url);
            var match = JSON.parse(matchBody);
            const participants = match.info.participants;
            var idx = 0;
            for (i = 0; i < 10; i++) {
                if (participants[i].puuid == summoner.puuid) {
                    idx = i;
                    break;
                }
            }
            info = match.info.participants[idx];
            console.log("idx = " + idx);
            console.log(match);
            url = "https://" + platform + ".api.riotgames.com/lol/league/v4/entries/by-summoner/" + summoner.id + "?api_key=" + APIKEY;
            var rankBody = getBody(url);
            console.log(rank);
            var rankl = rank[rank.length - 1];
            var rankCase = rankl.tier.substr(0, 1) +
                rankl.tier.substr(1).toLowerCase();
            var win = "Win!";
            if (match.info.gameDuration < 300000) {
                win = "Remake";
            }
            if (info.win == false) {
                win = "Loss";
            }
            var primary = info.perks.styles[0].selections[0].perk;
            var primaryFound = false;
            var secondary = info.perks.styles[1].style;
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
            var embed = new MessageEmbed()
                .setTitle(rankCase + " " + rankl.rank + " " +
                    String(rankl.leaguePoints) + " LP")
                .attachFiles("resources/images/Emblem_" +
                    rankl.tier + ".png")
                .setThumbnail("attachment://Emblem_" +
                    rankl.tier + ".png")
                .addFields(
                    {
                        name:
                            String(rankl.wins) + "W " +
                            String(rankl.losses) + "L | " +
                            String(Math.round(
                                rankl.wins / (rankl.losses +
                                    rankl.wins) * 100)) + "%",
                        value: "\u200B"
                    },
                    { name: '\u200B', value: "Most recent game" },
                    {
                        name: win + "\n" +
                            info.championName + "\n" +
                            get_dhm(msg.createdTimestamp -
                                match.info.gameStartTimestamp -
                                match.info.gameDuration),
                        value: RSDict[primaryString] + " " + String(info.kills) + "/" +
                            String(info.deaths) + "/" +
                            String(info.assists) + " \n" +
                            RSDict[secondaryString],
                        inline: true
                    }
                );
            msg.channel.send(embed);
        }
        catch(error) {
            console.log(error.toString());
            msg.channel.send("error");
            return;
        }
    }
}

function getBody(url) {
    return new Promise (resolve => {
        setTimeout(function() {
            request(url, function(error, response, body) {
                resolve(body);
            })
        }, 1000);
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

