const api = 'https://api.darksky.net/forecast/8a8299ad5b7a4dca08087f79b04b97bd/37.8267,-122.4233';
        fetch(api)
            .then(repsonse => {
                console.log('kakak')
                console.log(response);
            })