function Fib(n) {
    let array = []
    if (n === 1) {
        array[0] = 1
    }
    else {
        array[0] = 1
        array[1] = 1
        for (let i = 2; i < n; i++) {
            array[i] = array[i - 2] + array[i - 1]
        }
    }
    return array
}

console.log(Fib(5))