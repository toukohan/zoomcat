const fs = require("fs");
const path = require("path");

let folder = __dirname + "/uploads/";

// class for creating message objects
class Message {
  constructor(sender, receiver, content) {
    this.sender = sender;
    this.receiver = receiver;
    this.content = content;
  }
}

module.exports = function search(query) {
  let timeStampRegex = /\d\d:\d\d:\d\d\s/;

  let files = fs.readdirSync(folder);

  //console.log(files);

  let dataArr = [];

  files.forEach((file) => {
    const data = fs.readFileSync(
      path.join(__dirname, "/uploads/", file),
      "utf-8"
    );
    // console.log(data);

    const rawMessages = data.split(timeStampRegex);
    rawMessages.forEach((msg) => {
      dataArr.push(msg);
    });
  });

  let msgArr = [];

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
  // console.log("here is msgArr:", msgArr);
  // creating an array for the matching messages
  let messages = [];

  // making everything lower case for wider matching
  let regex = query.toLowerCase();
  // console.log(query);

  // looking for matching words in contents of each message
  for (const msg of msgArr) {
    let message = msg.content;
    if (message.toLowerCase().match(regex)) {
      messages.push(msg);
    }
  }
  return messages;
};
