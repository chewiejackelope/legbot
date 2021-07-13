var request = require('request');
const RSDict = {"Aftershock" : "<:Aftershock_rune:794282914317205524>",  "Electrocute" : "<:Electrocute_rune:794282914363342888>",  "Dark Harvest" : "<:Dark_Harvest_rune:794282914363473950>",  "Arcane Comet" : "<:Arcane_Comet_rune:794282914388115486>",  "Domination" : "<:Domination_icon:794282914392178699>",  "Conqueror" : "<:Conqueror_rune:794282914425995314>",  "Grasp of the Undying" : "<:Grasp_of_the_Undying_rune:794282915668033558>",  "Glacial Augment" : "<:Glacial_Augment_rune:794282915743793154>",  "Fleet Footwork" : "<:Fleet_Footwork_rune:794282915956523058>",  "Hail of Blades" : "<:Hail_of_Blades_rune:794282915965304892>",  "Guardian" : "<:Guardian_rune:794282916049584138>",  "Inspiration" : "<:Inspiration_icon:794282916112367656>",  "Sorcery" : "<:Sorcery_icon:794282916116561941>",  "Resolve" : "<:Resolve_icon:794282916129013770>",  "Lethal Tempo" : "<:Lethal_Tempo_rune:794282916145790986>",  "Press the Attack" : "<:Press_the_Attack_rune:794282916339253288>",  "Phase Rush" : "<:Phase_Rush_rune:794282916438867999>",  "Predator" : "<:Predator_rune:794282916438868009>",  "Precision" : "<:Precision_icon:794282916439785502>",  "Prototype: Omnistone" : "<:Prototype_Omnistone_rune:794282916443586560>",  "Summon Aery" : "<:Summon_Aery_rune:794282916443717672>",  "Unsealed Spellbook" : "<:Unsealed_Spellbook_rune:794282916452106270>",  "Challenging Smite" : "<:Challenging_Smite:794400581061312512>",  "Barrier" : "<:Barrier:794400581081890816>",  "Chilling Smite" : "<:Chilling_Smite:794400581090803722>",  "Clarity" : "<:Clarity:794400581094866954>",  "Exhaust" : "<:Exhaust:794400581217288383>",  "Ignite" : "<:Ignite:794400581145722931>",  "Mark" : "<:Mark:794400581174951958>",  "Cleanse" : "<:Cleanse:794400581288067102>",  "Smite" : "<:Smite:794400581171150869>",  "Heal" : "<:Heal:794400581346263071>",  "Flash" : "<:Flash:794400581384142858>",  "Ghost" : "<:Ghost:794400580965498911>",  "Teleport" : "<:Teleport:794400581518491649>", }
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'profile',
    description: 'Get profile of specified user',
    execute(msg, args, APIKEY) {
        try{ 
            msg.channel.send("Getting data...");
            console.log(args);
            //msg.channel.send("", {files: ["./commands/images/Emblem_Silver.png"]})
            var url = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/chewiejackelope?api_key=" + APIKEY;
            var byname;
            request(url, function(error, response, body) {
                console.log(body);
                byname = JSON.parse(body);
                msg.channel.send("omg its " + byname.name);
                url = "https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/" + byname.puuid + "/ids?start=0&count=20&api_key=" + APIKEY;
                request(url, function(error, response, bodyy) {
                    bypuuid = JSON.parse(bodyy);
                    console.log(bypuuid);
                    msg.channel.send("last game was " + bypuuid[0]);
                    url = "https://americas.api.riotgames.com/lol/match/v5/matches/" + bypuuid[19] + "?api_key=" + APIKEY;
                    request(url, function(error, response, bodyyy) {
                        bymatch = JSON.parse(bodyyy);
                        const participants = bymatch.info.participants;
                        var idx = 0;
                        for (i = 0; i < 10; i++) {
                            if (participants[i].puuid == byname.puuid) {
                                idx = i;
                                break;
                            }
                        }
                        info = bymatch.info.participants[idx];
                        console.log("idx = " + idx);
                        console.log(bymatch);
                        msg.channel.send("you were playing " + info.championName);
                    });
                });
            });
        }
        catch (erorr) {
            console.log(error.toString());
            msg.channel.send("error");
            return;
        }
    }
}