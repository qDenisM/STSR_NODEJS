// for (let i = 1; i < 4; i++) {
//     new Promise((resolve, reject) => {
//         resolve(console.log(i))
//     })
// }

let sum = [
  { '$': { value: 'a' } },
  { '$': { value: 'b' } },
  { '$': { value: 'c' } }
].reduce((acc, next, index) => acc + next.$.value, ''
);
console.log(sum)