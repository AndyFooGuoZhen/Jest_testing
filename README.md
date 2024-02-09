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
