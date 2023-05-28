require('dotenv').config();
const axios = require('axios');



const TOKEN = process.env.DISCORD_TOKEN;
const OPENAI_KEY = process.env.OPENAI_KEY;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;



const {Client, IntentsBitField, Routes } = require('discord.js')
const {REST} = require('@discordjs/rest');
const {Configuration, OpenAIApi} = require('openai');


const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,

    ]
});


const rest = new REST({ version: '10' }).setToken(TOKEN);


client.on('ready', ()=> {
    console.log("Usman's GPT Bot is online on Discord");

    client.user.setActivity({name:'with the real homies. uwu'})
    
});

const configuration = new Configuration({
    apiKey: OPENAI_KEY,
});

const openai= new OpenAIApi(configuration);

client.on('messageCreate', async (message) => {

    try {
        if(message.author.bot || message.channel.id !== CHANNEL_ID) return;
        if(message.content === "!uwu")
        {
            message.reply("GPT 3.5-turbo bot developed by Usman#1000. uwu");
            return;
        }
        if(message.content.startsWith('!')) return;

        if(!message.mentions.has(client.user)) return;
    
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

client.on('interactionCreate', (interaction) => {
    if(interaction.isChatInputCommand())
    {
        //const obj = interaction.options.data;
        if(interaction.commandName === 'image')
        {
            console.log(interaction.options.getString('prompt'));
        }
        else
        {
        interaction.reply({content: 'GPT 3.5-turbo bot developed by Usman#1000. uwu'})
        }
    }
    
});

async function main () {

    const commands = [
        {
          name: 'uwu',
          description: 'About bot',
          
        },
        {
            name: 'image',
            description: 'Generate an image via DALL-E',
            options: [{
                name: 'prompt',
                description: 'Enter the prompt you want the image generated for',
                type: 3,
                required: true,

            },],
        },
      ];

    try {
        console.log('Started refreshing application (/) commands.');
      
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
      
        console.log('Successfully reloaded application (/) commands.');
      } catch (error) {
        console.error(error);
      }
};


main();


client.login(TOKEN);