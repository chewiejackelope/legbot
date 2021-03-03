var request = require('request');
var cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { MessageEmbed } = require('discord.js');

var urlbase = "https://na.op.gg/summoner/userName=";
var RSDict = {"Aftershock" : "<:Aftershock_rune:794282914317205524>",  "Electrocute" : "<:Electrocute_rune:794282914363342888>",  "Dark Harvest" : "<:Dark_Harvest_rune:794282914363473950>",  "Arcane Comet" : "<:Arcane_Comet_rune:794282914388115486>",  "Domination" : "<:Domination_icon:794282914392178699>",  "Conqueror" : "<:Conqueror_rune:794282914425995314>",  "Grasp of the Undying" : "<:Grasp_of_the_Undying_rune:794282915668033558>",  "Glacial Augment" : "<:Glacial_Augment_rune:794282915743793154>",  "Fleet Footwork" : "<:Fleet_Footwork_rune:794282915956523058>",  "Hail of Blades" : "<:Hail_of_Blades_rune:794282915965304892>",  "Guardian" : "<:Guardian_rune:794282916049584138>",  "Inspiration" : "<:Inspiration_icon:794282916112367656>",  "Sorcery" : "<:Sorcery_icon:794282916116561941>",  "Resolve" : "<:Resolve_icon:794282916129013770>",  "Lethal Tempo" : "<:Lethal_Tempo_rune:794282916145790986>",  "Press the Attack" : "<:Press_the_Attack_rune:794282916339253288>",  "Phase Rush" : "<:Phase_Rush_rune:794282916438867999>",  "Predator" : "<:Predator_rune:794282916438868009>",  "Precision" : "<:Precision_icon:794282916439785502>",  "Prototype: Omnistone" : "<:Prototype_Omnistone_rune:794282916443586560>",  "Summon Aery" : "<:Summon_Aery_rune:794282916443717672>",  "Unsealed Spellbook" : "<:Unsealed_Spellbook_rune:794282916452106270>",  "Challenging Smite" : "<:Challenging_Smite:794400581061312512>",  "Barrier" : "<:Barrier:794400581081890816>",  "Chilling Smite" : "<:Chilling_Smite:794400581090803722>",  "Clarity" : "<:Clarity:794400581094866954>",  "Exhaust" : "<:Exhaust:794400581217288383>",  "Ignite" : "<:Ignite:794400581145722931>",  "Mark" : "<:Mark:794400581174951958>",  "Cleanse" : "<:Cleanse:794400581288067102>",  "Smite" : "<:Smite:794400581171150869>",  "Heal" : "<:Heal:794400581346263071>",  "Flash" : "<:Flash:794400581384142858>",  "Ghost" : "<:Ghost:794400580965498911>",  "Teleport" : "<:Teleport:794400581518491649>", }

module.exports = {
    name: 'opgg',
    description: 'Get OP.GG of specified user',
    execute(msg, args) {
        try{
            msg.channel.send("Refreshing OP.GG...");
            console.log(args);
            var username = "";
            var start = 0;
            if (String(args[0]).substr(0, 2) == "--") {
                start = 1;
                if (args[0] == "--kr") {
                    urlbase = "https://www.op.gg/summoner/userName=";
                }
                else {
                    urlbase = "https://" + args[0].replace("--", "") + ".op.gg/summoner/userName=";
                }
            }
            for (i = start; i < args.length; i++) {
                username = username.concat(args[i] + "+");
            }
            username = username.substr(0, username.length - 1);
            run(urlbase + username, msg).then(() => {request(urlbase + username, function (error, response, body) {
                try {
                    var $ = cheerio.load(body);
                    var rank = $('.TierRank');
                    var rankText = rank.text();
                    var LP = $('.LeaguePoints');
                    var LPText = String(LP.text());
                    var LPStripText = LPText.trim();
                    var name = $('.Name');
                    var nameText = String(name.text());
                    if (!nameText) {
                        msg.channel.send("User does not exist!");
                        return;
                    }
                    var img = $('.Medal > .Image').attr('src');
                    var pfp = $('.ProfileIcon > .ProfileImage').attr('src');
                    var wins = $('.TierInfo > .WinLose > .wins').text();
                    var losses = $('.TierInfo > .WinLose > .losses').text();
                    var wlstr = wins + "/" + losses;
                    if (wins == "") {
                        wlstr = "N/A";
                    }
                    var wr = $('.TierInfo > .WinLose > .winratio').text();
                    var lastResultsStr = $('.GameResult').text();
                    var lastResults = lastResultsStr.trim().split('\n');
                    var lastWL = [];
                    var lastChampsStr = $('.ChampionName').text();
                    var lastChamps = lastChampsStr.trim().split("\n");
                    var runes = $('.Runes > .Rune > .Image').toArray();
                    var summs = $('.SummonerSpell > .Spell > .Image').toArray();
                    var lastKDA = $('.KDA > .KDA').text().split("\n");
                    var lastKDArray = ["","",""];
                    for (i = 0; i < 3; i++) {
                        lastKDArray[i] = lastKDArray[i] + lastKDA[lastKDA.length - 40 + i * 4].replace("\t\t\t\t\t", "");
                        lastKDArray[i] = lastKDArray[i] + " " + lastKDA[lastKDA.length - 39 + i * 4].replace("\t\t\t\t\t", "");
                        lastKDArray[i] = lastKDArray[i] + " " + lastKDA[lastKDA.length - 38 + i * 4].replace("\t\t\t\t\t", "");
                    }
                    var long = $('.GameStats > .TimeStamp').find('span')[0]["attribs"]["data-datetime"];
                    long = Math.round(msg.createdTimestamp / 1000);
                    var lastKP = $('.CKRate').text().split("\n");
                    var lastTime = $('.GameLength').text().split("s");
                    var lastCS = $('.CS').text().split("\n");
                    const embed = new MessageEmbed()
                        .setAuthor('Go to ' + nameText.substr(0, nameText.length - 3) + "'s OP.GG", "https:" + pfp, urlbase + username)
                        .setTitle("Current Rank: " + rankText.trim() + " " + LPStripText)
                        .setDescription("")
                        .setThumbnail("https:" + img)
                        .setURL('https://matias.ma/nsfw/')
                        .setColor('#0099ff')
                        .addFields(
                            // i am deeply sorry in advance
                            { name: 'Ranked Win/Loss: ' + wlstr, value: 'Winrate: ' + wr.substr(10, wr.length)},
                            { name: '\u200B', value: 'Last 3 Games:' },
                            { name: lastResults[0].replace("\t\t\t\t\t\t\t\t\t", "") + "!\n" + 
                                    lastChamps[lastChamps.length - 19].replace("\t\t\t\t\t", "") + "\n" + 
                                    get_dhm(Math.round(msg.createdTimestamp / 1000) - $('.GameStats > .TimeStamp').find('span')['0']["attribs"]["data-datetime"]), 
                                                    value:  RSDict[runes[0]["attribs"]["alt"]] + ' | ' + lastKDArray[0] + '\n' + 
                                                            RSDict[runes[1]["attribs"]["alt"]] + ' | ' + lastKP[1].replace("\t\t\t\t\tP/Kill", "") + ' KP\n' +
                                                            RSDict[summs[0]["attribs"]["alt"]] + ' | ' + lastTime[0] + 's\n' +
                                                            RSDict[summs[1]["attribs"]["alt"]] + ' | ' + lastCS[1].replace("\t\t\t\t\t", ""), inline: true },
                            { name: lastResults[1].replace("\t\t\t\t\t\t\t\t\t", "").replace("\t\t\t\t\t\t\t\t\t", "") + "!\n" +
                                    lastChamps[lastChamps.length - 17].replace("\t\t\t\t\t", "") + "\n" +
                                    get_dhm(Math.round(msg.createdTimestamp / 1000) - $('.GameStats > .TimeStamp').find('span')['1']["attribs"]["data-datetime"]), 
                                                    value:  RSDict[runes[2]["attribs"]["alt"]] + ' | ' + lastKDArray[1] + '\n' + 
                                                            RSDict[runes[3]["attribs"]["alt"]] + ' | ' + lastKP[3].replace("\t\t\t\t\tP/Kill", "") + ' KP\n' +
                                                            RSDict[summs[2]["attribs"]["alt"]] + ' | ' + lastTime[1] + 's\n' +
                                                            RSDict[summs[3]["attribs"]["alt"]] + ' | ' + lastCS[3].replace("\t\t\t\t\t", ""), inline: true },
                            { name: lastResults[2].replace("\t\t\t\t\t\t\t\t\t", "").replace("\t\t\t\t\t\t\t\t\t", "") + "!\n" +
                                    lastChamps[lastChamps.length - 15].replace("\t\t\t\t\t", "") + "\n" +
                                    get_dhm(Math.round(msg.createdTimestamp / 1000) - $('.GameStats > .TimeStamp').find('span')['2']["attribs"]["data-datetime"]), 
                                                    value:  RSDict[runes[4]["attribs"]["alt"]] + ' | ' + lastKDArray[2] + '\n' + 
                                                            RSDict[runes[5]["attribs"]["alt"]] + ' | ' + lastKP[5].replace("\t\t\t\t\tP/Kill", "") + ' KP\n' +
                                                            RSDict[summs[4]["attribs"]["alt"]] + ' | ' + lastTime[2] + 's\n' +
                                                            RSDict[summs[5]["attribs"]["alt"]] + ' | ' + lastCS[5].replace("\t\t\t\t\t", ""), inline: true },
                        );
                    msg.channel.send(embed);
                    return;
                        }
                        catch (error) {
                            console.log(error);
                            msg.channel.send("User has no data this season!");
                            return;
                        }
            })}).catch(console.error);
        }
        catch (error) {
            console.log(error.toString());
            msg.channel.send("There was an issue executing that command!");
            return;
        }
    },
  };

function get_dhm(seconds) {
    var d = Math.floor(seconds / (3600*24));
    if (d != 0) {
        if (d == 1) {
            return String(d) + " Day ago";
        }
        return String(d) + " Days ago";
    }
    var h = Math.floor(seconds % (3600*24) / 3600);
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

function run (url, msg) {
    return new Promise(async (resolve, reject) => {
        const browser = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ]
        });
        try {
            const page = await browser.newPage();
            await page.goto(url);
            try {
                await page.click('.Button.SemiRound');
            }
            catch (error) {
                msg.channel.send("User does not exist");
                browser.close();
                return reject(error)
            }
            try {
                await page.waitForSelector('.Button.SemiRound.Green', {timeout: 10000})
                let element = await page.$('.Button.SemiRound.Green');
                let value = await page.evaluate(el => el.textContent, element)
                if (value.includes("Updated")) {
                    browser.close();
                    msg.channel.send("User's OP.gg has been refreshed!");
                    return resolve(url);
                }
                else {
                    msg.channel.send("User's OP.gg is up to date");
                    browser.close();
                    return resolve(url)
                }
            }
            catch (error) {
                msg.channel.send("User's OP.gg is up to date");
                console.log("timeout")
                browser.close();
                return resolve(error)
            }
        }
        catch (error) {
            msg.channel.send("Error updating OP.gg!");
            browser.close();
            return reject(error);
        }
    })
}
