const childPrinter = require("./childPrinter");

function printNumberClone(input){
    console.log(input)
    childPrinter("hello");
}

module.exports = printNumberClone;