// 처음 고민한 코드

// const leftVariadic = (fn) => {
//   return function (...args) {
//     //["why", "hello", "there", "little", "droid"]
//     const last = args.slice(-1);
//     return fn.bind(this, ...args, last);
//   };
// };

const leftVariadic = (fn) => {
  if (fn.length < 1) {
    return fn;
  } else {
    return function (...args) {
      const gathered = args.slice(0, args.length - fn.length + 1),
        spread = args.slice(args.length - fn.length + 1);

      return fn.apply(this, [gathered].concat(spread));
    };
  }
};

//1. leftVariadic 구현
const butLastAndLast = leftVariadic((butLast, last) => [butLast, last]);
// const butLastAndLast = (butLast, last) => [butLast, last];

console.log(butLastAndLast("why", "hello", "there", "little", "droid"));
//   //=> [["why","hello","there","little"],"droid"]

//2. left-variadic destructuring 구현(leftGather)
// 이거는 아직 이해 못함
// const [butLast, last] = leftGather(2)(['why', 'hello', 'there', 'little', 'droid']);

// butLast
//   //=> ['why', 'hello', 'there', 'little']

// last
//   //=> 'droid'

// 정답 예시
// const leftVariadic = (fn) => {
//     if (fn.length < 1) {
//       return fn;
//     }
//     else {
//       return function (...args) {
//         const gathered = args.slice(0, args.length - fn.length + 1),
//               spread   = args.slice(args.length - fn.length + 1);

//         return fn.apply(
//           this, [gathered].concat(spread)
//         );
//       }
//     }
//   };
