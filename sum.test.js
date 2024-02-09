const sum = require('./sum');
const errorFunction = require('./error')
const axios = require('axios');
const {printWord, printNumberLocal} = require('./wordPrinterHelper');
const printNumberClone = require('./numberPrinterHelperClone');
const childPrinter = require('./childPrinter');

test('adds 1 + 2 to equal 3',()=>{
    expect(sum(1,2)).toBe(3);
});

test('object assignment', () => {
    const data = {one: 1};
    data['two'] = 2;
    expect(data).toEqual({one: 1, two: 2});
  });

test('should throw an error', () => {
    expect(()=>errorFunction("a")).toThrow();
    expect(()=>errorFunction("a")).toThrow('Invalid Input');
});

function fakeFetch(){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>resolve('peanut butter'),1000);
    })
}

//First way to do it via resolving a promise
test('should resolve to peanut butter', ()=>{
    expect(fakeFetch()).resolves.toBe('peanut butter');
})

//Second way to do it via async / await
test('should resolve to peanut butter', async ()=>{
    let p = await fakeFetch();
    expect(p).toBe('peanut butter');
})

//Mocking functions
test('mock function test', ()=>{
    const mockFunction = jest.fn(x=>42+x);
    expect(mockFunction(2)).toBe(44);
    expect(mockFunction).toHaveBeenCalledWith(2);
})

function callBackUser(callback, value){
    
    if(value==2){
        return callback(value);
    }

    return 3;
}
//Mocking callback functions
test('callback function with value 2 test', ()=>{
    const mockCallBack = jest.fn()
    callBackUser(mockCallBack, 2)
    expect(mockCallBack).toHaveBeenCalled();
    expect(mockCallBack).toHaveBeenCalledTimes(1);
    expect(mockCallBack).toHaveBeenCalledWith(2);

})

test('callback function with other value test', ()=>{
    const mockCallBack = jest.fn()

    expect(callBackUser(mockCallBack,1)).toEqual(3);
    expect(mockCallBack).not.toHaveBeenCalled();
})



//Mocking return values
test('mock return value test', ()=>{
    const mockFunction = jest.fn();
    mockFunction.mockReturnValueOnce(10);
    expect(mockFunction()).toBe(10);
})

// Function to get User via api call with axios
async function getUser(){
    const result = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
    return result.data.userId;
}

//Mocking api call
jest.mock('axios');
test('should fetch users 2',  () => {
   

const resp ={"data": {
                        "userId": 1,
                        "id": 1,
                        "title": "delectus aut autem",
                        "completed": false
                     }
            };
    axios.get.mockResolvedValue(resp);
    expect(getUser()).resolves.toEqual(1);
});


function randomBetween(min , max){
    return Math.floor(Math.random() * (max-min +  1) + min)
}

jest.spyOn(Math, 'random').mockReturnValue(0);
test('randomBetween function should return 3 if math.random is 3', ()=>{
    expect(randomBetween(3,5)).toEqual(3);
})



jest.mock('./numberPrinterHelperClone') // mock the imported module into wordPrinterHelper.js
jest.mock('./childPrinter')
test('printStuff test', ()=>{
    printWord("bye");

    //test wont work, because printNumberLocal technically not called 
    // expect(printNumberLocal).toHaveBeenCalledWith(10); 
    
    //works
    expect(printNumberClone).toHaveBeenCalledWith(20); 

    // wont work, childPrinter out of "module export range"
    // expect(childPrinter).toHaveBeenCalledWith("hello"); 
})