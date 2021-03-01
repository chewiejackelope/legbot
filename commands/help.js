module.exports = {
    name: 'help',
    description: 'display commands',
    execute(msg, args) {
      msg.channel.send("```javascript\n" + 
                            "&help/&h:                Shows all available commands\n" + 
                            "&opgg [--region] [Name]: Displays rank and recent game information about the speicified player\n" +
                            "                         Use --region to specify a region (e.g. \"&opgg --euw Gross Gore\")\n" +  
                            "                         (defaults to NA) (glitchy on kr and with non-ascii names)\n" + 
                            "&ping:                   Pong!```\n")
    },
  };
  