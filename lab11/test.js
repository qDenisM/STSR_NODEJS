function fact(n) {
    if (n < 2) {
        return 1
    }
    return fact(n - 1) * n
}

let arr = ('1,1,2,3,5,8,1'.split(',')).map(Number)

// console.log([1, 2, 3] + [1, 2, 3])

// console.log('1,2,3,4'.split(',').join(''))

console.log(poo())

function poo() {
    var a = 2
    return 'poo'
}

poo()
console.log()

let qwerty