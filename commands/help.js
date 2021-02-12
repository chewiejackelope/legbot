module.exports = {
    name: 'help',
    description: 'display commands',
    execute(msg, args) {
      msg.channel.send("```\n&help/&h:              Shows all available commands\n" + 
                            "&opgg [Name]:          Displays rank and recent game information about the speicified player\n" +
                            "&ping:                 Pong!\n" +
                            "&refresh/&r [Name]:    Refreshes the OP.GG of the specified player```")
    },
  };
  