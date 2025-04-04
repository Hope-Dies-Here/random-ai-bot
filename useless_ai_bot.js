// const express = require("express")
// const app = express()

const TelegramBot = require("node-telegram-bot-api")

const OpenAI = require("openai")


// const SDK = require('./openaiSDK.js')
const fs = require('fs')



require("dotenv").config()

const token = process.env.RANDOM_BOT_API;
const bot = new TelegramBot(token, { polling: true });

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
  // defaultHeaders: {
  //   "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
  //   "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
  // }
})

async function main(request) {
  try {
    const completion = await openai.chat.completions.create({
    model: "meta-llama/llama-3-8b-instruct:extended",
    messages: [
      {
        "role": "user",
        "content": `${request}`
      }
    ]
  })

  // console.log(completion.choices[0].message)
  return completion.choices[0].message
  } catch(e) {
    return "Error Occured. TrY again"
    console.log(e);
  }
  
}

const commandHandlers = {
  "/start": async (msg, bot) => {
    bot.sendMessage(
      msg.chat.id,
      "Hello, I am your personal useless ai. I maybe useless but i sure do steal your data :) ",
      {
        reply_markup: {
          // inline_keyboard: [
          //   [
          //     {
          //       text: "Yes",
          //       callback_data: "btn_yes",
          //     },
          //     {
          //       text: "No",
          //       callback_data: "btn_no",
          //     },
          //   ],
          // ],
          keyboard: [["Chill Button"]],
        },
      }
    );
  },
  "Chill Button": async (msg, bot) => {
    bot.sendMessage(msg.chat.id, "You pressed the chill button.... siiiiiiick ")
  }
};

// bot.onText("/start", (msg, match) => {
//   const handler = commandHandlers["/start"];
//   handler(msg, bot);
// });

bot.on("message", async (msg, match) => {

  try {
    const chatId = msg.chat.id;
    const command = msg.text;
    const handler = commandHandlers[command];
    bot.sendChatAction(chatId, 'typing'); 
    // if(msg.text !== "Chill Button" && msg.text !== "/start") {
    //   fs.readFile("./logs.json", (err, data) => {
    //       if(err) {
    //         console.error("err")
    //         process.exit(1)
    //       }

    //       const parsedData = JSON.parse(data.toString())
    //       console.log(msg)
    //       const newData = [{ username: msg.chat.username || msg.chat.first_name, prompt: msg.text }, ...parsedData]
    //       fs.writeFile("./logs.json", JSON.stringify(newData), (err) => err ? console.log("cant save") : console.log("saved"))
    //     })  

    // }

    if (handler) {
      handler(msg, bot);
    } else {
      try {
        const beyene = await main(msg.text)
        bot.sendMessage(chatId, beyene.content, {
          parse_mode: "Markdown",
        });
      } catch(e) {
        bot.sendMessage(chatId, "Sorry, I couldn't respond to that, try again maybe?", {
          parse_mode: "Markdown",
        });
        console.log(e);
      }
    }
  } catch(e) {
    bot.sendMessage(chatId, "Sorry, Internal Error. Try Afgain,", {
          parse_mode: "Markdown",
        });
    console.log(e);
  }
  
});

console.log("ai bot is running...")

bot.on("polling_error", (error) => {
  console.error("Polling error:", error);
  // Attempt to reconnect or implement retry logic
});


// const logData = fs.readFile("./logs.json", (err, data) => {
//   if(err) {
//     return console.log(err)
//     process.exit(1)
//   }

//   const parsedData = JSON.parse(data)
//   const filtered = parsedData.filter(data => data.username === "rootpal")
//   // console.log(filtered)
// })

module.exports = bot; 