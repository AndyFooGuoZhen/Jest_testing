# Resource: https://www.youtube.com/watch?v=IPiUDhwnZxA&t=3253s
# Jest documentation : https://jestjs.io/docs/getting-started

# Basic setup
1.  npm install --save-dev jest
2.  Make sure package.json test field is "jest"
3.  npm test

# Creating our first test
A simple test goes by with the following structure

```
test('description', function to test);

Example:
test('adds 1 + 2 to equal 3',()=>{
    expect(sum(1,2)).toBe(3);
});
```


# Matchers
We expect something to match the result. Refer to matchers documentation on jest for more details

```
test('object assignment', () => {
    const data = {one: 1};
    data['two'] = 2;
    expect(data).toEqual({one: 1, two: 2});
  });
```

# Testing errors

```
function errorFunction(input){
    console.log(typeof input)
    if(typeof input !== 'number'){
        throw new Error('Invalid Input');
    }
}

test('should throw an error', () => {
    expect(()=>errorFunction("a")).toThrow();
    expect(()=>errorFunction("a")).toThrow('Invalid Input');
});
```

# Testing promises with .resolves
```
function fakeFetch(){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>resolve('peanut butter'),1000);
    })
}

test('should resolve to peanut butter', ()=>{
    expect(fakeFetch()).resolves.toBe('peanut butter');
})
```

# Testing promises via async await
```
function fakeFetch(){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>resolve('peanut butter'),1000);
    })
}

test('should resolve to peanut butter', async ()=>{
    let p = await fakeFetch();
    expect(p).toBe('peanut butter');
})
```

# Mocking 

## Mocking functions
```
test('mock function test', ()=>{
    const mockFunction = jest.fn(x=>42+x);
    expect(mockFunction(2)).toBe(44);
    expect(mockFunction).toHaveBeenCalledWith(2);
})
```
## Mocking return values
```
test('mock return value test', ()=>{
    const mockFunction = jest.fn();
    mockFunction.mockReturnValueOnce(10);
    expect(mockFunction()).toBe(10);
})
```

## Mocking API Calls ***
```
async function getUser(){
    const result = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
    return result.data.userId;
}

jest.mock('axios');
test('should fetch users 2',  () => {
   

const resp ={"data":
                {
                    "userId": 1,
                    "id": 1,
                    "title": "delectus aut autem",
                    "completed": false
                 }
            };
    axios.get.mockResolvedValue(resp);
    expect(getUser()).resolves.toEqual(1);
});
```
## Mock vs Mocked
Mock : Action of actually mocking somethng
mocked: Used for typing purposes

In the previous example we mock the imported axios library, if we want to give the fake axios a type, we can do :
```
jest.mocked(axios).get.mockResolvedValue(resp);
```

# Important notes on mocking
Suppose we have file A , B and C. We want to test exported function in file A. We can only mock imported function/components into file A. 

If we have imported a function (call this F1) in A from B that uses another imported function (F2)  from C, we can only mock function F1. 

File A
```
import F1 from B;

function A(){
     F1();
}
```

File B
```
import F2 from C;
function B(){
    F2;
}
```

Testing file
```
# Code to test function A
mock F1 // works
mock F2 // fails
```

Another case where that mocking would be impossible is dual exports of function in the same file that are dependant on each other.

For more details refer to https://stackoverflow.com/questions/51269431/jest-mock-inner-function.

## Real example:

wordPrinterHelper.js (our supposed file A)
```
const printNumberClone = require('./numberPrinterHelperClone')

function printWord(input){
    printNumberLocal(10);
    printNumberClone(20);
    return input;
}

function printNumberLocal(input){
    console.log(input)
}

module.exports = { printWord , printNumberLocal };
```

numberPrinterHelperClone.js (our supposed file B)
```
const childPrinter = require("./childPrinter");

function printNumberClone(input){
    console.log(input)
    childPrinter("hello");
}

module.exports = printNumberClone;
```

childPrinter.js (our suuposed file C)
```
function childPrinter(input){
    console.log(input);
}

module.exports = childPrinter;

```

Testfile
```
const {printWord, printNumberLocal} = require('./wordPrinterHelper');
const printNumberClone = require('./numberPrinterHelperClone');
const childPrinter = require('./childPrinter');

jest.mock('./numberPrinterHelperClone')     // mock the imported module into wordPrinterHelper.js
jest.mock('./childPrinter')                 //fails
test('printStuff test', ()=>{
    printWord("bye");

    //test wont work, because printNumberLocal technically not called 
    expect(printNumberLocal).toHaveBeenCalledWith(10); 
    
    //works
    expect(printNumberClone).toHaveBeenCalledWith(20); 

    // wont work, childPrinter out of "module export range"
    expect(childPrinter).toHaveBeenCalledWith("hello"); 
})

```


## Lesson
- We can only test exported functions and functions used in it that are imported from other modules (only 1 layer of import supported).
- When we have a exported function dependant on another exported function  , we can only test both functions seperately.



# Practical Example 1 (when getCake manages to get cake)

cakeService.ts
```
Assume initial state of cakeStore = { cake : [], isLoading : false }

export async function getCake(cakeId: string): Promise<void> {
    setIsLoading(true);

    try {
        const result = await fetch(`/cake/${cakeId}/`);
        const json = await result.json();

        setCake(json);
    } catch {
        // Do nothing if we catch an error here for now
    }
    setIsLoading(false);
}

```

cakeTest.ts
```
it('should get cake and store cake', async () => {
    const cakeId = chance.guid();
    const fetchJson = {
        cake: chance.n(chance.guid, chance.d6())     // this returns a random array with random size from 0 - 6
    };
    const jsonMock = jest.fn().mockResolvedValue(fetchJson);       //create mock function that returns a promise that resolves to fetchjson
    global.fetch = jest.fn().mockResolvedValue({json: jsonMock});  // create mock function that returns a promise that resolves to json : jsonMock
   
    await getCake(cakeId); 
    expect(cakeStore.cake).toEqual(fetchJson); // axios resolves to json : jsonMock --> then await result.json() resolves to fetchJson
    expect(cakeStore.isLoading).toEqual(false);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`/cake/${cakeId}/`);
    expect(jsonMock).toHaveBeenCalledTimes(1);
    expect(jsonMock).toHaveBeenCalledWith();
});
```

In this example , we are testing the getCake function, we use chance to give random values. Notice that we create a jsonMock to be a function that returns a promise that returns fetchJson when it is resolved. This is created to then this line:
```
 const json = await result.json();
```

# Practical example 2  ( When getCake fails to get cake )

cakeTest.ts
```
it('fails to get cake, should not set cake', async () => {
    const cakeId = chance.guid();
    global.fetch = jest.fn().mockRejectedValue(new Error());  // create mock function that returns a promise that rejects to an error
   
    await getCake(cakeId); 
    expect(cakeStore.cake).toEqual([]); // axios rejects to error --> getCake catches the error and wont update state
    expect(cakeStore.isLoading).toEqual(false);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`/cake/${cakeId}/`);
});
```

# Practical example 3 ( When getCake is loading, isLoading is true)
```
it('isLoading is true while waiting for cake data ', async () => {
    const cakeId = chance.guid();
    const fetchJson = {
        cake: chance.n(chance.guid, chance.d6())     // this returns a random array with random size from 0 - 6
    };
    const jsonMock = jest.fn().mockResolvedValue(fetchJson);       //create mock function that returns a promise that resolves to fetchjson
    global.fetch = jest.fn().mockResolvedValue({json: jsonMock});  // create mock function that returns a promise that resolves to json : jsonMock
   
    let cakePromise =  getCake(cakeId); 
    expect(cakeStore.cake).toEqual([]); // Since promise is not yet resolved, no state change
    expect(cakeStore.isLoading).toEqual(true);

    await cakePromise() // Resolve cakePromise, indicating that cake data arrived
    expect(cakeStore.cake).toEqual(fetchJson); // axios resolves to json : jsonMock --> then await result.json() resolves to fetchJson
    expect(cakeStore.isLoading).toEqual(false);
});
```

# beforeEach, afterEach, beforeAll, afterAll
Used to perform instructions before or after a test. Refer to https://jestjs.io/docs/setup-teardown for more details.

# SpyOn
Used for mocking and accessing unaccesible component or component that not "stable"
For this example we will use the window as an example

Suppose we have the code below:
```
function alertPeople(input){
    window.alert("Warning " + input);
}
```

In tests, the window may not be accesible. To test this function, we can use the spy on function.
```
test('Tests the alertPeople function', ()=>{
    alertPeople("Andy");
    spyOn(window, 'alert');
    expect(window.alert).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith("Warning Andy");
}
```

Example with unstable component
```
function randomBetween(min , max){
    return Math.floor(Math.random() * (max-min +  1) + min)
}

jest.spyOn(Math, 'random').mockReturnValue(0);
test('randomBetween function should return 3 if math.random is 3', ()=>{
    expect(randomBetween(3,5)).toEqual(3);
})
```






