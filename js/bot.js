// NTYxNjI3MTU4NTUyOTAzNzM4.XJ--lg.6M7EVHoppmF3QxtrRPnDjMF1Fw4
const Discord = require('discord.js');
const strSimil = require('string-similarity');
const functions = require('./functions');
const knownWords = require('./knownWords');
const client = new Discord.Client();

let textChannel = client.channels.get('561626346954948623');

let messagesArray = [];

let punctutations = ['.', '?']

const words = ['hans', 'ik', 'jij', 'ben', 'bent', 'wat', 'welk', 'weer', 'wordt', 'het']



class Message {
    constructor(message, ) {
        this._string = message;
        this._wordObjArray = [];
        this.intention;

        this.setIntention();
        this.setWordObjArray();
        
    }
    setWordObjArray(){
        punctutations.forEach(leesteken => {
            this._string = this._string.replace(leesteken, '');
        })
        let tempArray = this._string.split(' ');

        for(let wordIndex in tempArray){
            this._wordObjArray.push(new Word(tempArray[wordIndex], wordIndex));
            
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
        this.word = this.string;
        
        
    }
    findSimilarWords(){ // Searches for similar words in the array words
        const word = this.string;
        if(words.includes(word)){
            this.word = word;
            return
        }
        for(let presetWord of words){
            if(strSimil.compareTwoStrings(word, presetWord) >= 0.6){
                this.similarWords.push(presetWord);
                this.word = presetWord;
                break;
            }else{
                this.word = word;
            }
        };
        
    }
}


const  disectMessage = async function(message) {
    console.log('disecting')
    let wordArray = [];
    message._wordObjArray.forEach(wordObj => {
        wordArray.push(wordObj.word.toLowerCase());
    });
    if(wordArray.includes('temperatuur') || wordArray.includes('temp') || wordArray.includes('graden')){
        console.log('includes temperatuur')
        let timeUNIX;
        let timeWord = '';
        let city = '';
        if(wordArray.length === 1){ //When only word in message is just 'temp'
            await functions.disecting.askSomething('Voor welke stad wil je de temperatuur weten?', textChannel, client)
            .then(response => {
                messagesArray.unshift(new Message(response.content, true)); //create Message object and add to messagesArray
                messagesArray[0]._wordObjArray.forEach(wordObj => {
                    city += wordObj.word;
                    city += ' ';
                })
                console.log('fetching weather')
                functions.getWeather.getTemperature(textChannel, city);
            })
        }else{
            
            for(wordIndex in wordArray){
                if(knownWords.tijd.relatief.includes(wordArray[wordIndex])){
                    timeWord = wordArray[wordIndex];
                }
            }
            for(wordIndex in wordArray){
                if(wordArray[wordIndex] === 'in'){
                    let string = '';
                    for(let i = wordIndex; i < wordArray.length; i++){
                        if(wordArray[i] !== timeWord){
                            string += wordArray[i];
                            string += ' ';
                        }
                    }
                    string = string.replace('in', '').trim()
                    city = string;
                    console.log('Found in! -> ' + city)
                }
            }
            if(city === ''){
                await functions.disecting.askSomething('Voor welke stad wil je de temperatuur weten?', textChannel, client)
                .then(response => {
                    messagesArray.unshift(new Message(response.content, true)); //create Message object and add to messagesArray
                    console.log('City obtained: ' + response)
                    messagesArray[0]._wordObjArray.forEach(wordObj => {
                        city += wordObj.word;
                        city += ' ';
                        city.trim();
                    })
                })
                
            }
            
            if(timeWord === ''){
                await functions.disecting.askSomething('Voor wanneer wil je de temperatuur weten?', textChannel, client)
                .then(response => {
                    messagesArray.unshift(new Message(response.content, true)); //create Message object and add to messagesArray
                    console.log('City obtained: ' + response)
                    messagesArray[0]._wordObjArray.forEach(wordObj => {
                        timeWord += wordObj.word;
                        timeWord += ' ';
                        timeWord = timeWord.trim();
                    })
                })
            }
            timeUNIX = Math.floor(functions.getTime.dateObjToTimeStamp(functions.getTime.relativeToTime(timeWord)));
            console.log('tijd: ' + timeWord+ '->' + timeUNIX)
            functions.getWeather.getTemperature(textChannel, city, timeUNIX);
        }
        
    }
}

client.on('ready', () => {   
    textChannel = client.channels.get('561626346954948623'); 
    textChannel.send('Hello, how can I help you?');
    console.log('Connected as ' + client.user.tag);
})

client.on('message', recMessage =>{
    if (recMessage.author === client.user) {
        console.log('M --->: ' + recMessage.content)
        return
    }
    messagesArray.unshift(new Message(recMessage.content, false)); //create Message object and add to messagesArray
    disectMessage(messagesArray[0]);
})

client.login('NTYxNjI3MTU4NTUyOTAzNzM4.XJ--lg.6M7EVHoppmF3QxtrRPnDjMF1Fw4')