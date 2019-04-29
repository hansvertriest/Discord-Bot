let done = false;

new Promise((resolve, reject) => {
    console.log('promis started')
    setTimeout(() => {
        done = true;
    }, 5000);
    if(done === true){
        resolve('Dit is 1')
    }else{
        reject('1 is niet gelukt')
    }
})

console.log('Dit is 2')

