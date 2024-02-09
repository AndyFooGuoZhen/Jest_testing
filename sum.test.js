const sum = require('./sum');
const errorFunction = require('./error')
const axios = require('axios');


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