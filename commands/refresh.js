const puppeteer = require('puppeteer');
const urlbase = "https://na.op.gg/summoner/userName="

module.exports = {
    name: 'refresh',
    description: "Refreshes the user's OP.GG",
    execute(msg, args) {
        var username = "";
        for (i = 0; i < args.length; i++) {
            username = username.concat(args[i] + "+");
        }
        username = username.substr(0, username.length - 1);
        run(urlbase + username, msg).then(console.log).catch(console.error);
    }
};

function run (url, msg) {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ]
            });
            const page = await browser.newPage();
            await page.goto(url);
            await Promise.all([
                await page.click('.Button'),
                await page.waitForSelector('.Button')
            ])
            browser.close();
            msg.channel.send("User's OP.GG has been refreshed!");
            return resolve(url);
        }
        catch (error) {
            msg.channel.send("User does not exist");
            return reject(error);
        }
    })
}