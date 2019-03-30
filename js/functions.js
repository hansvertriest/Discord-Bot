const http = require('https');
const getWeather = (channel) => {
    const url = 'https://api.darksky.net/forecast/8a8299ad5b7a4dca08087f79b04b97bd/37.8267,-122.4233'
        const request = http.get(url, function (response) {
            var buffer = "", data;

            response.on("data", function (chunk) {
                buffer += chunk;
            }); 

            response.on("end", function (err) {
                data = JSON.parse(buffer);
                channel.send(`Het is ${data.currently.apparentTemperature} graden Fahrenheit `)
            });

        });
}

module.exports = {getWeather};