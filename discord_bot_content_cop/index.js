//import * as nsfwjs from "nsfwjs";
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
const Jimp = require('jimp');
const path = require('path');
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

                scanImage(img_url);
                //const spawn = require('child_process').spawn;
                //const pyProcess = spawn('python', ['./tensorflow/image_scan.py', img_url])

                // pyProcess.on('data', (data) => {
                //     console.log('success: ' + data);
                // });
                // async function resize() {
                //     // Read the image.
                //     const sized_image = await Jimp.read({url: img_url});
                //     // Resize the image to width 150 and heigth 150.
                //     await sized_image.resize(224, 224);
                //     // Save and overwrite the image
                //     i = await sized_image.writeAsync(`./image/${Date.now()}_224x224` + type_img);
                // }


                // async function fn(){

                //     //const pic;
                    
                //     //await resize();
                    

                //     // sharp(img_url)
                //     //     .resize(224, 224)
                //     //     .toFile('./image/' + img_url)
                //     //     .then( results => {
                //     //         console.log('wrote to file');
                //     //         fs.writeFileSync('./image/' + img_url, results);
                //     //     }).catch(err => {
                //     //         console.log(err);
                //     //     });

                //     // var pic = await fs.readdirSync('./image/');
                //     // pic.forEach(img_file => {
                //     //     if(path.extname(img_file) == type_img){
                //     //         //pic = i;
                //     //         console.log('success');
                //     //         pic = pic;
                //     //     }
                //     // });
                //     //${Date.now()}_224x224` + type_img, (err, data) => {
                //     //     if(err) throw err;
                //     //     console.log(data);
                //     // });

                //     const pic = await i;
                //     const model = await nsfw.load();

                //     //const pic 
                //     //const buf = await str2ab(pic);
                //     //var data = await ab2str(buf);
                //     //st
                //     //var str64 = pic.toString('base64');
                //     //var data = Buffer.from(str64, 'base64');
                //     //var uintArray = Base64Binary.decode(data);  
                //     //var byteArray = Base64Binary.decodeArrayBuffer(data); 

                //     console.log(pic);
                //     //const buf = await str2ab(pic);
                //     //var uint8View = await new Uint8Array(i.data);

                //     const image1 = await tfnode.node.decodeImage(pic);
                //     // console.log(pic);
                //     // console.log(typeof image1);
                //     const pred = await model.classify(image1);
                //     console.log(pred);
                // }

                // fn();

                // if(scanImage(img_url)){
                //     console.log('python script ran');
                // }

                //TODO: ADD A SCAN FOR IMAGES
                //console.log("true");
                message.delete()
                    .then(message => console.log(`Deleted message ${message.author.username}`))
                    .catch(console.error);

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
function scanImage(the_image){
    var spawn = require('child_process').spawn;
    //var url = the_image.url;

    var process = spawn('python', ['./tensorflow/image_scan.py', the_image]);

    process.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    process.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    process.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

// function ab2str(buf) {
//     return String.fromCharCode.apply(null, new Uint8Array(buf));
// }

// function str2ab(str) {
//     var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
//     var bufView = new Uint8Array(buf);
//     for (var i=0, strLen=str.length; i < strLen; i++) {
//       bufView[i] = str.charCodeAt(i);
//     }
//     return buf;
// }


client.login(TOKEN);



/*
1. check message for image (.jpg, .png, etc.) - DONE
2. check if I can delete the image -DONE
3. if image exists send to tensor flow for analysis
3. if nsfw, delete
*/

//cayden pull top image from reddit