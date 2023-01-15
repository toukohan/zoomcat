const fs = require("fs");
const path = require("path");
const readline = require("readline").createInterface({
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

// check if folder exists
const folder = __dirname + "/files/";
try {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
} catch (error) {
  console.error(error);
}

// check files in the folder and assign them to the files variable
let files = fs.readdirSync(folder);
console.log(files);

// read the files and put data in dataArr
let dataArr = [];

function readFiles(files) {
  let arr = [];
  files.forEach((file) => {
    const filepath = path.join(folder, file);
    console.log("trying to read: ", filepath);
    const data = fs.readFileSync(filepath, "utf-8");
    const rawMessages = data.split(timeStampRegex);
    rawMessages.forEach((msg) => {
      dataArr.push(msg);
    });
    //console.log(dataArr);
  });
}

// creating array for messages

let msgArr = [];

readFiles(files);
createMessages(dataArr);
search();

// going through the messages in data and pushing them in the msgArr as objects
function createMessages(dataArr) {
  for (let message of dataArr) {
    let pieces = message.split("\n");
    let sender = pieces[0].split("  ")[1];
    if (!sender) continue;
    let receiverData = pieces[0].split("  ")[3];
    let receiver = pieces[0]
      .split("  ")[3]
      .substring(0, receiverData.length - 2);
    let content = pieces[1].substring(1, pieces[1].length - 1);
    let newMessage = new Message(sender, receiver, content);
    // only push message in the array if it has content
    if (newMessage.content != "") msgArr.push(newMessage);
  }
}

// taking user input for search
function search() {
  readline.question(`What are you looking for?`, (query) => {
    // quitting program if empty query
    if (query.length < 1) {
      readline.close();
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
  });
}
