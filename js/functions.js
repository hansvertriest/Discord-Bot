const knownWords = require('./knownWords')
const http = require('https');

const disecting = {
    askSomething(question, channel, client){
        return new Promise((resolve, reject) => {
            channel.send(question);
            client.on('message', recMessage =>{
                if(recMessage.author === client.user){ //is the author of the received message our bot?
                    resolve('Message recieved')
                }
            })
        })
        .then(response => {
            return new Promise((resolve, reject) => {
                client.on('message', recMessage =>{
                    if(recMessage.author !== client.user){
                        console.log('ANTWOORD:' + recMessage.content)
                        resolve(recMessage);
                    }
                })
            })
        })
    }
}
const getTime = {
    relativeToTime (string) {
        let currentTime = new Date();
        if(string === 'morgen'){
            return new Date(currentTime.getTime() + 1*24*3600000);
        }else if(string === 'overmorgen'){
            return new Date(currentTime.getTime() + 2*24*3600000);
        }else if(string === 'gisteren'){
            return new Date(currentTime.getTime() - 1*24*3600000);
        }else if(string === 'overmorgen'){
            return new Date(currentTime.getTime() + 2*24*3600000);
        }else{
            console.log(`didn't recognise that word`)
        }

    },
    dateObjToTimeStamp(dateObj){
        return Math.floor((dateObj.getTime()/1000));
    },
    timeStampToDateObj(timeStamp){
        return new Date(timeStamp*1000);
    }
}

const getWeather = {
    getLngLat (city) {
        return new Promise((resolve, reject) => {
            let lng , lat, coords;
            // geocoding key: 4fd322af35734eeebcfec687d05080e9
            const urlGeoCode = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=4fd322af35734eeebcfec687d05080e9`
            const requestGeoCode = http.get(urlGeoCode, function (response) {
                var buffer = "", data;
                response.on("data", function (chunk) {
                    
                    buffer += chunk;
                }); 
                response.on("end", function (err) {
                    data = JSON.parse(buffer);
                    if(data.results.length !== 0){
                        lng = data.results[0].geometry.lng;
                        lat = data.results[0].geometry.lat;
                        coords = [lat, lng]
                        console.log(coords)
                        resolve(coords)
                    }else{
                        reject(`Could not get coordinates for ${city}`)
                    }
                });
                
            });
        })
    },
    getTemperature (channel, city, time = false) {
        getWeather.getLngLat(city.replace(' ', '+'))
        .then(respons => {
            // darksky Key : 8a8299ad5b7a4dca08087f79b04b97bd
            let urlWeather;
            if(!time){
                const currentDate = getTime.dateObjToTimeStamp(new Date());
                urlWeather = `https://api.darksky.net/forecast/8a8299ad5b7a4dca08087f79b04b97bd/${respons[0]},${respons[1]}`
            }else{
                urlWeather = `https://api.darksky.net/forecast/8a8299ad5b7a4dca08087f79b04b97bd/${respons[0]},${respons[1]},${time}`
            }
            
            let apparentTemperatureFahr;
            let apparentTemperatureCel;
            const requestWeather = http.get(urlWeather, function (response) {
                var buffer = "", data;

                response.on("data", function (chunk) {
                    buffer += chunk;
                }); 

                response.on("end", function (err) {
                    dataJSON = JSON.parse(buffer);
                    if(!time){
                        apparentTemperatureFahr = dataJSON['currently']['apparentTemperature'];
                        apparentTemperatureCel = parseInt((apparentTemperatureFahr - 32) * (5/9));
                        channel.send(`Het is ${apparentTemperatureCel} graden Celcius in ${city} (timezone: ${dataJSON.timezone.replace('/', ',').replace('_', ' ')}).`)
                    }else{
                        apparentTemperatureFahr = dataJSON.daily.data[0].apparentTemperatureMax;
                        apparentTemperatureCel = parseInt((apparentTemperatureFahr - 32) * (5/9));
                        const currentTime = new Date();
                        if(time >= getTime.dateObjToTimeStamp(currentTime)){
                            console.log(getTime.timeStampToDateObj(dataJSON.currently.time))
                            channel.send(`Het wordt maximum ${apparentTemperatureCel} graden Celcius in ${city} op ${getTime.timeStampToDateObj(dataJSON.currently.time).getDate()} ${knownWords.tijd.absoluut.monthsShort[getTime.timeStampToDateObj(dataJSON.currently.time).getMonth()]} (timezone: ${dataJSON.timezone.replace('/', ',').replace('_', ' ')}).`)
                        }else{
                            channel.send(`Het was maximum ${apparentTemperatureCel} graden Celcius in ${city} op ${getTime.timeStampToDateObj(dataJSON.currently.time).getDate()} ${knownWords.tijd.absoluut.monthsShort[getTime.timeStampToDateObj(dataJSON.currently.time).getMonth()]} (timezone: ${dataJSON.timezone.replace('/', ', ').replace('_', ' ')}).`)
                        }
                    }
                     
                });
            });
        })
        .catch(error => {
            console.log(`ERROR: ${error}`)
        })
    }
}

    


module.exports = {getWeather, getTime, disecting};