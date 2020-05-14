//import * as nsfwjs from "nsfwjs";
let {PythonShell} = require('python-shell');
const {Client, MessageAttachment, Collection, MessageEmbed} = require('discord.js');
//var MessageAttachment = require('discord.js');
const client = new Client();
const fetch = require('node-fetch');
//const spawn = require('child_process');
const TOKEN = "NzA1MTM4NjAzMjc3Mjg3NTE1.XqnW7Q.LibqYobOJT2WNuDxQcbi2uASrzU";
const PREFIX = '!';
const tf = require('@tensorflow/tfjs');
const tfnode = require('@tensorflow/tfjs-node');
const nsfw = require('nsfwjs');
const http = require('http')
const Jimp = require('jimp');
const path = require('path');
const cron = require('cron');
var is_image = false;
var type_img;

//setting up commands folder
const fs = require('fs');
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands/').filter(filer => filer.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}


//check if bot is online
client.on('ready', () => {
    console.log("the bot is ready.");
});

//need to get the time and location from user
var job = new cron.CronJob('* * * * * *', function(){
    console.log('message sent with cron');
}, null, true, 'America/Los_Angeles');
job.start();

//these happen when the client sends a message
client.on('message', message => {
    let args = message.content.substring(PREFIX.length).split(" ");
    let img_args = message.attachments;

    

    //checks if the image is directly linked
    if(img_args.size > 0) {
        if(img_args.every(attachImage)){
            if(is_image){

                /*
                1. download and save the image
                2. send image to script
                3. either delete or add to training set
                */
                var img_url;
                //var i;

                img_args.forEach(attachments => {
                    img_url = attachments.url;
                    console.log(typeof img_url);
                });

                

                //save image to temp folder of images, pass the path of image to scan image
                //store position first in first out
                //delete image position from folder

                //make async if child process doesn't make it already
                //scanImage(img_url);

                // if(scanImage(img_url)){
                //     console.log('python script ran');
                // }

                //TODO: ADD A SCAN FOR IMAGES
                //console.log("true");
                // message.delete()
                //     .then(message => console.log(`Deleted message ${message.author.username}`))
                //     .catch(console.error);

            } else {
                console.log("false");
            }

            ///////gets the image and posts the image again
            // var img_attachment = new MessageAttachment(img_url);
            // message.channel.send(img_attachment)
            //     .then(message => console.log(`Sending image using ${img_attachment.url}`))
            //     .catch(console.error);
        }
    }

    //checks the url
    if(args.length > 0 && !(img_args.size > 0)){
        attachLink(message.content)
        if(is_image){

            // if(scanImage(message.content)){ //scanImage with python script
            //     console.log('python script ran');
            // };

            //TODO: ADD A SCAN FOR IMAGES
            //console.log("true");
            message.delete()
                .then(message => console.log(`Deleted message from ${message.author.username}`))
                .catch(console.error);
        } else {
            console.log("false");
        }
    }

    //ask for weather

    switch(args[0]){
        case "ping":
            //responds with pong
            client.commands.get('ping').execute(message, args);
        case "roll":
            //roll die
            client.commands.get('roll').execute(message, args);
        break;
    }
})

//gets the image type, needs to do something with it
function attachImage(msgAttachment){
    var url = msgAttachment.url;    //url with attachment
    var reverse_url = url.split("").reverse().join(""); //reversing url
    var img_type = reverse_url.slice(0, reverse_url.indexOf(".")+1);    //image type
    var correct_img_type = img_type.split("").reverse().join(""); //reversing url
    type_img = correct_img_type;

    console.log(correct_img_type);  //the image type

    //return true or false
    switch(correct_img_type){
        case ".png":
                return is_image = true;
        case ".jpeg":
                return is_image = true;
        case ".jpg":
                return is_image = true;
        default:
                return is_image = false;
    }
}

//checks if the url is image
function attachLink(msgAttachment){
    var message = msgAttachment;
    var reverse_message = message.split("").reverse().join("");
    var img_type = reverse_message.slice(0, reverse_message.indexOf(".")+1);
    var correct_img_type = img_type.split("").reverse().join("");
    type_img = correct_img_type;

    console.log(correct_img_type);  //the image type

    //return true or false
    switch(correct_img_type){
        case ".png":
            return is_image = true;
        case ".jpeg":
            return is_image = true;
        case ".jpg":
            return is_image = true;
        default:
            return is_image = false;
    }
}

//passes the embedded image to the scanner script
function scanImage(img_url){


    // PythonShell.run('./image_scan_folder/image_scan.py', options, function (err, results){
    //     if(err) throw err;
    //     console.log('finished');
    // });

    let shell = new PythonShell('./image_scan_folder/image_scan.py');
    shell.send(JSON.stringify(img_url));

    shell.on('message', function(message){
        console.log('the message: %j', message);
    });

    shell.end(function(err){
        if(err) throw err;
        console.log('finished');
    });


    //TODO: pass data back from python to node
};

function test(){
    console.log("action executed");
};


client.login(TOKEN);



/*
1. check message for image (.jpg, .png, etc.) - DONE
2. check if I can delete the image -DONE
3. if image exists send to tensor flow for analysis
3. if nsfw, delete
*/

//cayden pull top image from reddit


/*
weather api
1. use cron so it can go off at set time
2. use open weather
*/