// 처음 생각 한 답
// const maybe =
//   (fn) =>
//   (...args) =>
//     (function () {
//       for (const arg of args) {
//         if (arg === null) {
//           return;
//         }
//       }
//       return fn.apply(this, args);
//     });

// `maybe`은 아무것도 없는지 확인하는 로직을 함수 호출로 축소합니다:

console.log(maybe((a, b, c) => a + b + c)(1, 2, 3));
//=> 6

console.log(maybe((a, b, c) => a + b + c)(1, null, 3));
//=> undefined

// 정답 예시
// const maybe = (fn) =>
//   function (...args) {
//     if (args.length === 0) {
//       return;
//     }

//     for (const arg of args) {
//       if (arg === null) {
//         return;
//       }
//     }
//     return fn.apply(this, args);
//   };

// 즉시 실행 할 거면 굳이 () => () => () 이런식으로 함수를 반환하는 함수를 구현 안 해도 될 듯
