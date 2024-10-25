// 초반에 생각한 답
//const unary = (f) => (args) => f(args);

// const unary =
//   (f) =>
//   (...args) => {
//     if (args.length !== 1) {
//       return f(args[0]);
//     } else {
//       return f(...args);
//     }
//   };

// 두번째로 생각한 답
// const unary =
//   (f) =>
//   (...args) =>
//     args.length !== 1 ? f(args[0]) : f(...args);

//“단항"은 함수가 취하는 인수의 개수를 수정하는 함수 데코레이터입니다:
console.log(["1", "2", "3"].map(parseInt));
//=> [1, NaN, NaN]
// ['1', '2', '3'].map((s) => parseInt(s)) 이것도 가능하지만 일단 연습으로
// 이런식으로 동작 할 수 있게
console.log(["1", "2", "3"].map(unary(parseInt)));
//=> [1, 2, 3]

// 정답 예시
const unary = (fn) =>
  fn.length === 1
    ? fn
    : function (something) {
        return fn.call(this, something);
      };

// 내가 생각한 답
// const unary =
//   (f) =>
//   (...args) =>
//     args.length !== 1 ? f(args[0]) : f(...args);

// 이 둘의 차이가 뭘까?
// 데코레이터니깐 함수를 반환하는 정답 예시가 맞다고 생각
