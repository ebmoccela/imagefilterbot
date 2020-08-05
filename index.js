//import * as nsfwjs from "nsfwjs";
let {PythonShell} = require('python-shell');
const discord = require('discord.js');
//const {Client, Discord, MessageAttachment, Collection, MessageEmbed} = require('discord.js');
//var MessageAttachment = require('discord.js');
const client = new discord.Client();
//mconst discord = new Discord();
const fetch = require('node-fetch');
//const spawn = require('child_process');
const {token, prefix} = require('./config.json');
//const PREFIX = require('./config.json');
//const tf = require('@tensorflow/tfjs');
//const tfnode = require('@tensorflow/tfjs-node');
//const nsfw = require('nsfwjs');
const https = require('https')
const Jimp = require('jimp');
const path = require('path');
const cron = require('cron');
var rmdir = require('rimraf');
//const spawn = require('child_process');
var is_image = false;
var type_img;

//TODO: look into env.config 
//setting up commands folder
const fs = require('fs');
client.commands = new discord.Collection();

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

    if(message.author.bot) return;
    //TODO: add exception for reddit links
    let args = message.content.substring(prefix.length).split(" ");
    let img_args = message.attachments;

    //TODO: check if image is embeded, linked, and pasted

    //TODO: create a function for this
    if(img_args.size > 0 && !(message.channel.nsfw) && !(message.author.bot)) {  //may need to add check for embeds
        if(img_args.every(attachImage)){

            //currently checks if the image is copied, doesn't work with embeds
            checkImage(img_args, message);
        }
    }else if (message.embeds.length > 0 && !(message.channel.nsfw) && !(message.author.bot)) {
        var img_embed = message.embeds[0];
        var embed_image_url = img_embed.url;
        //var embed_thumbnail_url = img_embed.thumbnail.url;
        //var embed_arg = img_embed.image.url.substring(PREFIX.length).split(" ");
        if(embed_image_url !== null){
            console.log("image is embed");
            if(attachLink(embed_image_url)){
                checkEmbedImage(embed_image_url, message);
            }
            // if(attachLink(embed_url)){
            //     checkImage(img_embed, message);
            // }
        // }else if(embed_thumbnail_url !== null){
        //     console.log("image thumbnail");
        }
    }

    //checks the url

    

    //ask for weather

    switch(args[0]){
        case "ping":
            //responds with pong
            client.commands.get('ping').execute(message, args);
        case "roll":
            //roll die
            //add options for dnd die e.g 1 or 2 die, D4 - D20
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
// using https://github.com/notAI-tech/NudeNet
function scanImage(img_path){
    try{
        return new Promise((resolve, reject) => {
            let result;
            let shell = new PythonShell('./image_scan_folder/image_scan.py');
            
            shell.send(JSON.stringify(img_path));

            shell.on('message', function (message){
                result = message;
            });
            
            shell.on('stderr', function (stderr) {
                console.log(stderr);
            });

            shell.end(function (err, code, signal) {
                if(err) reject(err);
                console.log('exit code was:' + code);
                console.log('exit signal was:' + signal);
                console.log('finished');
                resolve(result);
                console.log(result);
            });

        });
    } catch (err) {
        console.log(err);
    }
}

//may still need conversions for pictures

// function checkPNGImage(base64string){

//     var src = base64string
//     var imageData = Uint8Array.from((src.replace('data:image/png;base64,', '')), c => c.charCodeAt(0), 'base64').toString('base64');
//     var sequence = [0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]; // in hex: 
    
//     //check last 12 elements of array so they contains needed values
//     for (var i = 12; i > 0; i--){
//         if (imageData[imageData.length - i] !== sequence[12-i]) {
//             console.log("image bad");
//                 return false;
//         }
//     }
//     console.log('image good');
//     return true;
// }

// function base64_encode(file) {
//     var path;
//    return path = fs.readFileSync(file, { encoding: 'base64' });
// }

//saves images
async function saveImg(img){
    try{
        var image = img.url;
        if(typeof image !== 'undefined'){
            image = await Jimp.read(img.url);
            img_path = `./temp_images/${img.url}`;
            ensureDirectoryExistence(img_path);
            //await fs.writeFileSync(`./images/${img.name}`, img.file);
            await image.writeAsync(`./temp_images/${img.url}`);
            // console.log(img_path);
            // console.log(typeof img_path);
            return img_path;
        } else {
            image = img;
            image = await Jimp.read(img);
            img_path = `./temp_images/${img}`;
            ensureDirectoryExistence(img_path);
            //await fs.writeFileSync(`./images/${img.name}`, img.file);
            await image.writeAsync(`./temp_images/${img}`);
            // console.log(img_path);
            // console.log(typeof img_path);
            return img_path;
        }

    }catch(err){
        console.log(err);
    }
}

//makes checks if directories exists if not makes one
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

function checkImage(img_args, message) {
    var img_path;
    var scan_return;
    var img_score;

    if(message.author.bot){
        return;
    } else if (!message.author.bot){
    
    img_args.forEach(attachments => {

        try{

            (async() => { 
                img_path = await saveImg(attachments);

                message.delete()
                    .then(message => console.log(`Deleted message ${message.author.username}`))
                    .catch(console.error);

                scan_return = await scanImage(img_path);
                console.log("the image safe:" + scan_return);
                //^^^^above code should work
                scan_return = scan_return.replace(img_path, "");
                //console.log(scan_return);   //example output should be {'': {'unsafe': 0.99, 'safe': 0.01}}
                scan_return = scan_return.substring(6, scan_return.length - 2)
                //console.log(scan_return);  //example output should be 'unsafe': 0.99, 'safe': 0.01
                scan_return = scan_return.split(",");
                //console.log(scan_return);  //array with two values, index 1 being the highest.

                img_score = scan_return[1].toString();
                if(img_score.indexOf("unsafe") !== -1){
                    console.log("image is not safe");
                    //PM score of image
                    try{
                        const attachment = new discord.MessageAttachment('./images/joey_wheeler.jpeg', 'joey_wheeler.jpeg');
                        const my_embed_four = new discord.MessageEmbed()
                            .setDescription('Your image has been banished to the Shadow Realm!')
                            .attachFiles([attachment])
                            .setImage('attachment://joey_wheeler.jpeg');
                        await message.author.send(my_embed_four);
                    } catch(err){
                        console.log(err);
                    }

                } else {
                    console.log("image is safe");
                    //repost image
                    try{
                    var img_response = img_path.slice(14, img_path.length);
                    const attachment = new discord.MessageAttachment(`${img_path}`, `${img_response}`);
                    const my_embed_two = new discord.MessageEmbed()
                        .setDescription(`${message.author}'s image was found appropriate.`)
                        .setColor('#FF69B4')
                        //.setURL(img_response)
                        .attachFiles([attachment])
                        .setImage(`attachment://${img_response}`);
                    await message.channel.send(my_embed_two);

                    if(typeof img_path !== 'undefined'){
                        //removeDir(img_path);
                        //delete here
                        try{
                            deleteSavedImage(img_path);
                        } catch (err) {
                            console.log(err.stack);
                        }


                    }
                    } catch (e){
                        console.log(e.stack);
                    }



                //await message.channel.send(my_embed_two);

                }
            })();

        } catch(e) {
            console.log(e.stack);
        }
    });


}
}

function checkEmbedImage(img_args, message){
    var img_path;
    //var img_resp = img_args;
    var scan_return;
    var img_score;

    if(message.author.bot){
        return;
    }else if (!message.author.bot){

    try{
        (async() => { 
            img_path = await saveImg(img_args);

            message.delete()
                .then(message => console.log(`Deleted message ${message.author.username}`))
                .catch(console.error);

            scan_return = await scanImage(img_path);
            console.log("the image safe:" + scan_return);
            //^^^^above code should work
            scan_return = scan_return.replace(img_path, "");
            //console.log(scan_return);   //example output should be {'': {'unsafe': 0.99, 'safe': 0.01}}
            scan_return = scan_return.substring(6, scan_return.length - 2)
            //console.log(scan_return);  //example output should be 'unsafe': 0.99, 'safe': 0.01
            scan_return = scan_return.split(",");
            //console.log(scan_return);  //array with two values, index 1 being the highest.

            img_score = scan_return[1].toString();
            if(img_score.indexOf("unsafe") !== -1){
                console.log("image is not safe");
                //PM score of image
                try{
                    const attachment = new discord.MessageAttachment('./images/joey_wheeler.jpeg', 'joey_wheeler.jpeg');
                    const my_embed_three = new discord.MessageEmbed()
                        .setDescription('Your image has been banished to the Shadow Realm!')
                        .attachFiles([attachment])
                        .setImage('attachment://joey_wheeler.jpeg');
                    await message.author.send(my_embed_three);
                }catch(err){
                    console.log(err);
                }
            } else {
                console.log("image is safe");
                //const attachment = new discord.MessageAttachment(img, 'joey_wheeler.jpeg');
                try{
                    const my_embed_one = new discord.MessageEmbed()
                        .setDescription(`${message.author}'s image was found appropriate.`)
                        .setColor('#FF69B4')
                        .setURL(img_args)
                        //.attachFiles([attachment])
                        .setImage(img_args);
                        await message.channel.send(my_embed_one);

                        //delete here
                        if(typeof img_path !== 'undefined'){
                            try{
                                fs.unlinkSync(img_path);
                            } catch(err) {
                                console.log(err.stack);
                            }
                        }

                        if(typeof img_path !== 'undefined') {
                            try{
                                deleteSavedImage(img_path);

                            }catch(err){
                                console.log(err.stack);
                            }
                        }
                        
                } catch (e) {
                    console.log(e.stack);
                }

                //await message.channel.send(my_embed_one);
                
            }
    })();

    } catch(e) {
        console.log(e.stack);
    }

 
}
}

function removeDir(img_path){
    if(!fs.existsSync(img_path)) {
        console.log('got here');
        return;
    }
    

    var list = fs.readdirSync(img_path);
    for(var i = 0; i < list.length; i++){
        var filename = path.join(img_path, list[i]);
        var stat = fs.statSync(filename);

        if(filename == "." || filename == "..") {
            //do nothing for current and parent dir
        } else if (stat.isDirectory()){
            removeDir(filename)
        } else {
            fs.unlinkSync(filename);
        }
    }
    fs.rmdirSync(img_path);
}

//remove the image from the path here
function deleteSavedImage(img_path){
    //TODO: remove image from pathdde
    console.log('\nCurrent filenames:');
    fs.unlinkSync(img_path);
    try{
        fs.rmdirSync(img_path, {recursive: true});

        console.log(`${img_path} is deleted`);
    } catch (err) {
        console.error(`Error while deleting ${img_path}`);
    }
}

client.login(token);



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