module.exports = {
  name: 'ping',
  description: 'Ping!',
  execute(msg, args) {
    msgTS = msg.createdTimestamp; // get timestamp of &ping
    msg.channel.send('Pong!').    // send pong
      then(message =>{thisTS = message.createdTimestamp; // get timestamp of pong
                      ms = thisTS - msgTS;               // get the difference between ping and pong timestamps
                      message.edit('Pong! `' + ms + 'ms`'); // edit message to show the difference
                     });
  },
};
