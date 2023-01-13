const fs = require('fs');
const path = require('path')
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

// message object
class Message {
    constructor(sender, receiver, content) {
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
    }
}

// regex for splitting the data
let timeStampRegex = /\d\d:\d\d:\d\d\s/;

// file to read
let input = "test.txt";

// reading the input file in "files" folder
const data = fs.readFileSync(path.join(__dirname, "/files/", "test.txt"), 'utf-8');
let dataArr = data.split(timeStampRegex);

// creating array for messages

let msgArr = [];

// going through the messages in data and pushing them in the msgArr as objects

for (let message of dataArr) {
    let pieces = message.split("\n");
    let sender = pieces[0].split("  ")[1];
    if (!sender) continue;
    let receiverData = pieces[0].split("  ")[3];
    let receiver = pieces[0].split("  ")[3].substring(0, receiverData.length - 2);
    let content = pieces[1].substring(1, pieces[1].length - 1);
    let newMessage = new Message(sender, receiver, content)
    // only push message in the array if it has content
    if (newMessage.content != '') msgArr.push(newMessage);
}

// taking user input for search

readline.question(`What are you looking for?`, query => {
    // quitting program if empty query
    if(query.length < 1) {
        readline.close()
        return;
    }
    // creating an array for the matching messages
    let messages = [];
    // making everything lower case for wider matching
    let regex = query.toLowerCase();
    console.log(query);
    // looking for matching words in contents of each message
    for (const msg of msgArr) {
        let message = msg.content;
        if (message.toLowerCase().match(regex)) {
            messages.push(msg);
        }
    }
    console.log(messages);
    readline.close();
})