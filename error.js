function errorFunction(input){
    console.log(typeof input)
    if(typeof input !== 'number'){
        throw new Error('Invalid Input');
    }
}

module.exports = errorFunction;