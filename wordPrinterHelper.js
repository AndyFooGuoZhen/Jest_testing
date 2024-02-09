const printNumberClone = require('./numberPrinterHelperClone')

function printWord(input){
    console.log(input);
    printNumberLocal(10);
    printNumberClone(20);
    return input;
}

function printNumberLocal(input){
    console.log(input)
}

module.exports = { printWord , printNumberLocal };