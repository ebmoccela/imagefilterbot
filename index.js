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
const https = require('https')
const Jimp = require('jimp');
const path = require('path');
const cron = require('cron');
const spawn = require('child_process');
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
// var job = new cron.CronJob('* * * * * *', function(){
//     console.log('message sent with cron');
// }, null, true, 'America/Los_Angeles');
//job.start(); //starts the job

//these happen when the client sends a message
client.on('message', message => {
    //TODO: add exception for reddit links
    let args = message.content.substring(PREFIX.length).split(" ");
    let img_args = message.attachments;

    //console.log(message.channel.nsfw);
    //checks if the image is directly linked
    if(img_args.size > 0 && !(message.channel.nsfw)) {  //may need to add check for embeds
        if(img_args.every(attachImage)){
            if(is_image){

                var img_path;
                var img_safe;

                img_args.forEach(attachments => {

                    try{

                        (async() => { 
                            img_path = await saveImg(attachments);
                            // message.delete()
                            //     .then(message => console.log(`Deleted message ${message.author.username}`))
                            //     .catch(console.error);
                            //console.log(typeof img_path);
                            //(async() => {
                               img_safe = await scanImage(img_path);
                               console.log(img_safe)
                               if(img_safe){
                                   console.log("img is safe");
                               }
                            //})();
                              //check if img is safe or unsafe
                            // if(img_safe){
                            //     //post image
                            //     var img_attachment = new MessageAttachment(attachments.url);
                            //     message.channel.send(img_attachment)
                            //         .then(message => console.log(`Sending image using ${img_attachment.url}`))
                            //         .catch(console.error);
                            // }
                        })();

                    } catch(e) {
                        console.log(e.stack);
                    }
                });

                //save image to temp folder of images, pass the path of image to scan image

                //TODO: ADD A SCAN FOR IMAGES
                //console.log("true");

            } else {
                console.log("false");
            }
        }
    }

    //checks the url
    if(args.length > 0 && !(img_args.size > 0)){
        attachLink(message.content)
        if(is_image){
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
function scanImage(img_path){
    var safe;
    var unsafe;
    try{
        //https://stackoverflow.com/questions/45327365/sending-multiple-respone-from-nodejs-using-python-shell
        let shell = new PythonShell('./image_scan_folder/image_scan.py');
        //console.log(img_path);
        //console.log(typeof img_path);
        
        //return new Promise(async function(resolve, reject){
            shell.send(JSON.stringify(img_path));

            shell.on('message', function(message){
                //console.log('the message: %j', message);
                newmessage = message.replace(img_path, "");
                console.log(newmessage);
                submessage = newmessage.substring(6, newmessage.length - 2)
                //console.log(submessage);
                messagesplit = submessage.split(",");
                //console.log(messagesplit);
                /*
                check here for invalid safe and unsafe values
                 */
                unsafe = messagesplit[0].toString();
                safe = messagesplit[1].toString();
                unsafe = unsafe.slice(10);
                safe = safe.slice(9);
                console.log("safe: " + safe);
                console.log("unsafe: " + unsafe);
                if(safe >= unsafe){
                    console.log("the image is safe");
                    return img_safe = true;
                } else {
                    console.log("the image is not safe");
                    return img_safe = false;
                }
    
            });

        //})

        shell.end(function(err){

            if(err) throw err;
            console.log('finished');
        });

    } catch(err){
        console.log(err)
    }
};

function test(){
    console.log("action executed");
};

function checkPNGImage(base64string){

    var src = base64string
    var imageData = Uint8Array.from((src.replace('data:image/png;base64,', '')), c => c.charCodeAt(0), 'base64').toString('base64');
    var sequence = [0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]; // in hex: 
    
    //check last 12 elements of array so they contains needed values
    for (var i = 12; i > 0; i--){
        if (imageData[imageData.length - i] !== sequence[12-i]) {
            console.log("image bad");
                return false;
        }
    }
    console.log('image good');
    return true;
}

function base64_encode(file) {
    var path;
   return path = fs.readFileSync(file, { encoding: 'base64' });
}

async function saveImg(img){
    try{
        const image = await Jimp.read(img.url);
        img_path = `./images/${img.url}`;
        ensureDirectoryExistence(img_path);
        //await fs.writeFileSync(`./images/${img.name}`, img.file);
        await image.writeAsync(`./images/${img.url}`);
        console.log(img_path);
        console.log(typeof img_path);
        return img_path;
    }catch(err){
        console.log(err)
    }
}


function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    try{
        if (fs.existsSync(dirname)) {
        return true;
        }
        ensureDirectoryExistence(dirname);
        fs.mkdirSync(dirname);
    }catch(err){
        console.log(err)
    }
}

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