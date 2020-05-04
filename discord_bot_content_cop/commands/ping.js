module.exports = {
    name: 'ping',
    description: 'says pong',
    execute(message, args){
        message.channel.send('pong');
    }
}