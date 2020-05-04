module.exports = {
    name: 'roll',
    description: 'roll a die',
    execute(message, args){
        var roll = Math.floor(Math.random() * 6) + 1;
        message.reply("You rolled a " + roll);
    }
}