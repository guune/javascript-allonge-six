// 처음 생각 한 값
// const tap = (val) => (f) => (f(val), val);

// 가장 기본적인 결합자 중 하나는 “황조롱이”라는 별명을 가진 “K 결합자”입니다.
//     const K = (x) => (y) => x;

// 밑의 동작예시가 가능하도록 tap 만들기
// const a = tap("espresso")((it) => {
//   console.log(`Our drink is '${it}'`);
// });
// //=> Our drink is 'espresso'
//      'espresso'

// 모르겠는데...
// 왜? 어디가 모르겠음?
// 위의 예시는 함수가 함수를 반환 () => () => () 하면 될 것 같은데
// 밑의 예시는 함수가 인자를 두 개 받는 거임 어떻게 합치지?
// 레시피가 양방향으로 작동하도록 개선해 봅시다:
// _.tap('espresso', (it) =>
//     console.log(`Our drink is '${it}'`)
//   );
//     //=> Our drink is 'espresso'
//          'espresso'

// 내가 생각한 답
// const tap = (value, fn) => {
//   if (!fn) {
//     return (realFn) => (realFn(value), value);
//   } else {
//     return fn(value), value;
//   }
// };

const b = tap("espresso", (it) => {
  console.log(`Our drink is '${it}'`);
});

console.log(b);

const a = tap("espresso")((it) => {
  console.log(`Our drink is '${it}'`);
});

console.log(a);

// 실제 정답 예시
// const tap = (value) =>
//     (fn) => (
//       typeof(fn) === 'function' && fn(value),
//       value
//     )

// const tap = (value, fn) => {
//     const curried = (fn) => (
//         typeof(fn) === 'function' && fn(value),
//         value
//       );

//     return fn === undefined
//            ? curried
//            : curried(fn);
//   }
