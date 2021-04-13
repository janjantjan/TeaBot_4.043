const { Client, MessageEmbed } = require("discord.js");
const { Notification, ipcMain } = require("electron");

const TOKEN = "ODMwMTM2NTQ3NzU5NzUxMjA5.YHCS6A.7TuQKSNnbvubLG2DQMwdshKi_Jw";
const CHANNELID = "830140790981656606";


class DiscordBot {
  constructor(win, token = TOKEN) {
    this.win = win;
    this.token = token;
    this.client = new Client();

    this.client.on("ready", this.onReady.bind(this));
    this.client.on("message", this.onMessage.bind(this));
    this.client.login(token);
  }

  onReady() {
    console.log("Discord bot ready!");
  }


  showNotification(message = "Notification from the Main process") {
    const notification = {
      title: "Basic Notification",
      body: message,
    };
    new Notification(notification).show();
  }

  // function used to send messages originating in p5 to discord
  sendMessageToDiscord(data) {
  
    var channelToSend = this.client.channels.cache.get(CHANNELID);
    channelToSend.send(data);

  }

  // This is mostly likely the only function you will need to edit in this file. 
  // It gets data from Discord server and decides what to do with it. 
  onMessage(message) {
    

    // when discordbot receives a message it calls the fromDiscordBot function in p5 and relays the message to p5
    this.win.webContents.send("fromDiscordBot", message.content);
    
    // if discordbot receives 'hey' from discord, it replies with 'ho'
    if (message.content.includes("hey")) {  
      // send message to discord
      message.reply("ho");
    }

    // This block of code listen for a thumbs up emoji in Discord. 
    // When it sees it, it calls the thumbsup function in p5
    if (message.content.includes("👍")) {
      //this.showNotification("Like from discord");
      const thumbsup = message.content.split("👍");
      const count = thumbsup.length;
      this.win.webContents.send("thumbsup", count - 1);
    }

    // This is similar to previous block, but it listens to thumbs down
    if (message.content.includes("👎")) {
      //this.showNotification("Like from discord");
      const thumbsdown = message.content.split("👎");
      const count = thumbsdown.length;
      this.win.webContents.send("thumbsdown", count - 1);
    }


    /*
    if (message.content.includes("🍩")) {
      this.showNotification("donuts have been sent from discord");
      const donuts = message.content.split("🍩");
      console.log(donuts);
      const count = donuts.length;
      // We can create embeds using the MessageEmbed constructor
      // Read more about all that you can do with the constructor
      // over at https://discord.js.org/#/docs/main/master/class/MessageEmbed
      const embed = new MessageEmbed()
        // Set the title of the field
        .setTitle("YOU SEEM TO LIKE DONUTS !")
        // Set the color of the embed
        .setColor(0xffffff)
        // Set the main content of the embed
        .setDescription("I've counted, " + (count - 1) + " 🍩. Bon appetit");
      // Send the embed to the same channel as the message
      message.channel.send(embed);
    }

    if (message.content.includes("🤖")) {
      this.showNotification("Robot rocks!");
      this.win.webContents.send("robot", "whoooooooh!");
    }

    if (message.content.includes("👍")) {
      this.showNotification("Like from discord");
      const likes = message.content.split("👍");
      const count = likes.length;
      this.win.webContents.send("like", count - 1);
    }
    if (message.content.includes("👏")) {
      this.showNotification("Clap from discord");
      const claps = message.content.split("👏");
      const count = claps.length;
      this.win.webContents.send("clap", count - 1);
    }
    */
  }
}


module.exports = { DiscordBot };
