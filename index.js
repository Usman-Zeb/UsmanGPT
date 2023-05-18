require('dotenv').config();
const axios = require('axios');

// const PREFIX = '!';
// const {Client, GatewayIntentBits } = require('discord.js');
// const client = new Client({ intents: [
//     GatewayIntentBits.Guilds,
//     GatewayIntentBits.GuildMessages,
//     GatewayIntentBits.MessageContent
// ]})

// const {Configuration, OpenAIApi} = require('openai');
// const configuration = new Configuration({
//     organization: process.env.OPENAI_ORG,
//     apiKey: process.env.OPENAI_KEY,
// });

// const openai= new OpenAIApi(configuration);


// client.on('messageCreate', async function(message) {
//     try {
//         if(message.author.bot) return;
//         const gptResponse = await openai.createCompletion({
//             model: "gpt-3.5-turbo",
//             prompt:`Usman's GPT is a friendly chatbot.\n\
//             Usman's GPT: Hello, how are you?\n\
//             ${message.author.username}: ${message.content}\n\
//             Usman's GPT:`,
//             temperature:0.9,
//             stop: ["ChatGPT:", "GPT:", "Usman:"],
//         })
//         message.reply(`You said: ${gptResponse.data.choices[0].text}`);
//     }catch(err){
//         console.log(err)
//     }
// })


// client.login(process.env.DISCORD_TOKEN);
// console.log("Usman's GPT Bot is online on Discord");


const {Client, IntentsBitField } = require('discord.js');
const {Configuration, OpenAIApi} = require('openai');


const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,

    ]
});


client.on('ready', ()=> {
    console.log("Usman's GPT Bot is online on Discord");
});

const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
});

const openai= new OpenAIApi(configuration);

client.on('messageCreate', async (message) => {

    try {
        if(message.author.bot) return;
        if(message.content === "!uwu")
        {
            message.reply("GPT 3.5-turbo bot developed by Usman#1000. uwu");
            return;
        }
        if(message.content.startsWith('!')) return;
    
        let conversationLog = [{role: 'system', content: 'You are a rude chatbot.'}];
    
        await message.channel.sendTyping();
    
        let previousMessages = await message.channel.messages.fetch({limit: 15});
    
        previousMessages.reverse();
    
        previousMessages.forEach((msg) => {
    
            if(message.content.startsWith('!')) return;
            if(msg.author.id !== client.user.id && message.author.bot) return;
            if(msg.author.id !== message.author.id) return;
    
            conversationLog.push({
                role: 'user',
                content: msg.content,
            })
    
        })
    
    
        const result = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: conversationLog,
    
        });
        
        if(result>2000)
        {
            const spliced_result = result.data.choices[0].message.slice(0,2000);
            message.reply(spliced_result);
        }
        else{
    
            message.reply(result.data.choices[0].message);
    
        }
        console.log(result.data.choices[0].message);
    } catch (error) {

        console.log(error);
        
    }
    

});

client.login(process.env.DISCORD_TOKEN);