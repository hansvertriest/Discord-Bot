// NTYxNjI3MTU4NTUyOTAzNzM4.XJ--lg.6M7EVHoppmF3QxtrRPnDjMF1Fw4
const Discord = require('discord.js');
const strSimil = require('string-similarity')
const functions = require('./functions')
const client = new Discord.Client();

let textChannel = client.channels.get('561626346954948623');

let messagesArray = [];

let punctutations = ['.', '?']

const words = ['hans', 'ik', 'jij', 'ben', 'bent', 'wat', 'welk', 'weer', 'wordt', 'het']


class Message {
    constructor(message) {
        this._string = message;
        this._wordArray = [];
        this.intention;

        this.setIntention();
        this.setWordArray();
        console.log(this._wordArray)
    }
    setWordArray(){
        punctutations.forEach(leesteken => {
            this._string = this._string.replace(leesteken);
        })
        let tempArray = this._string.split(' ');

        for(let wordIndex in tempArray){
            console.log(new Word(tempArray[wordIndex], wordIndex).word)
            this._wordArray.push(new Word(tempArray[wordIndex], wordIndex).word);
        }
        
    }
    setIntention(){
        if(this._string.includes('?')){
            this.intention = 'question';
        }else{
            this.intention = 'statement';
        }
    }
}
class Word {
    constructor(string, position){
        this.string = string;
        this.position = position; 
        this.similarWords = [];
        this.word;
        this.findSimilarWords()
        
    }
    findSimilarWords(){ // Searches for similar words in the array words
        const word = this.string;
        if(words.includes(word)){
            this.word = word;
            return
        }
        for(let presetWord of words){
            if(strSimil.compareTwoStrings(word, presetWord) >= 0.6){
                console.log('tjam');
                this.similarWords.push(presetWord);
                this.word = presetWord;
                console.log('tjam');
                break;
            }else{
                this.word = word;
                console.log('no word found')
            }
        };
        
    }
}


const disectMessage = (message) => {
    if(message._wordArray.includes('weer')){
        functions.getWeather(textChannel)
        // console.log('Searching weather')
        // const url = 'https://api.darksky.net/forecast/8a8299ad5b7a4dca08087f79b04b97bd/37.8267,-122.4233'
        // const request = http.get(url, function (response) {
        //     var buffer = "", data;

        //     response.on("data", function (chunk) {
        //         buffer += chunk;
        //     }); 

        //     response.on("end", function (err) {
        //         data = JSON.parse(buffer);
        //         textChannel.send(`Het is ${data.currently.apparentTemperature} graden Fahrenheit `)
        //     });

        // });
    }
}

client.on('ready', () => {   
    textChannel = client.channels.get('561626346954948623'); 
    textChannel.send('Hello, how can I help you?');
    console.log('Connected as ' + client.user.tag);
})

client.on('message', recMessage =>{
    if (recMessage.author == client.user) {
        return
    }

    messagesArray.unshift(new Message(recMessage.content)); //create Message object and add to messagesArray
    
    disectMessage(messagesArray[0]);
})

client.login('NTYxNjI3MTU4NTUyOTAzNzM4.XJ--lg.6M7EVHoppmF3QxtrRPnDjMF1Fw4')