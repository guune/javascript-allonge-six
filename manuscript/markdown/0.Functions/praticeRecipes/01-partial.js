// const callFirst = (f, me) => (you) => f(me, you);
// const callLast = (f, me) => (you) => f(you, me);
// 극 초반 생각 한 것 일단 돌아감

const callFirst = (f, args) => (first) => f(first, args);
const callLast = (f, args) => (last) => f(args, last);

// 1.
// 밑의 결과가 나오도록 callFirst, callLast 작성

// 2.
//여기서 한 걸음 더 나아가 수집과 확산을 사용해
//둘 이상의 인수를 가진 부분 적용을 허용할 수 있습니다:(callLeft, callRight)

const greet = (me, you) => console.log(`Hello, ${you}, my name is ${me}`);

const greet2 = (me, you, me2, you2) => console.log(`${me} ${you} ${me2} ${you2}`);

const hello = callLeft(greet2, "me", "you");
hello("me2", "you2");

const heliosSaysHello = callRight(greet, "Helios");

heliosSaysHello("Eartha");
//=> 'Hello, Eartha, my name is Helios'

const sayHelloToCeline = callLeft(greet, "Celine");

sayHelloToCeline("Eartha");
//=> 'Hello, Celine, my name is Eartha'

// 아하 포인트 ...의 의미
// const callFirst = (fn, larg) =>
//   function (...rest) {
//     //여러 인자를 배열로 모음
//     return fn.call(this, larg, ...rest); // 배열을 다시 펼침
//     // ...이 위치에 따라 Rest Parameters, Spread Operator가 될 수 있다... 신기
//   };

// 정답 예시:

// const callFirst = (fn, larg) =>
//     function (...rest) {
//       return fn.call(this, larg, ...rest);
//     }

//   const callLast = (fn, rarg) =>
//     function (...rest) {
//       return fn.call(this, ...rest, rarg);
//     }

// const callLeft =
//   (f, ...args) =>
//   (...remainingArgs) =>
//     f(...args, ...remainingArgs);

// const callRight =
//   (f, ...args) =>
//   (...remainingArgs) =>
//     f(remainingArgs, ...args);
