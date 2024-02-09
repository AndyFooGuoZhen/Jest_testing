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

# Mocking Functions
```
test('mock function test', ()=>{
    const mockFunction = jest.fn(x=>42+x);
    expect(mockFunction(2)).toBe(44);
    expect(mockFunction).toHaveBeenCalledWith(2);
})
```
# Mocking return values
```
test('mock return value test', ()=>{
    const mockFunction = jest.fn();
    mockFunction.mockReturnValueOnce(10);
    expect(mockFunction()).toBe(10);
})
```

# Mocking API Calls ***
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






