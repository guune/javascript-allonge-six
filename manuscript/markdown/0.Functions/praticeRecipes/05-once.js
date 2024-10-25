// 처음 작성 한 코드
// const once = (fn) =>
//   function () {
//     let isOnce;
//     if (isOnce === undefined) {
//       return (isOnce = true), fn;
//     }
//     return () => {};
//   };

// 아주 간단합니다! 함수를 전달하고 함수를 반환받으면 됩니다. 그 함수는 여러분의 함수를 한 번 호출하고 그 이후에는 호출될 때마다 '정의되지 않음'을 반환합니다. 한번 해봅시다:

const askedOnBlindDate = once(() => "sure, why not?");

console.log(askedOnBlindDate());
//=> 'sure, why not?'

console.log(askedOnBlindDate());
//=> undefined

console.log(askedOnBlindDate());
//=> undefined

// 어떤 사람들은 소개팅을 한 번만 시도하는 것 같습니다.

// 정답 예시
// const once = (fn) => {
//     let done = false;

//     return function () {
//       return done ? void 0 : ((done = true), fn.apply(this, arguments))
//     }
//   }

// done 변수를 어디에 둬야하는지 고민이었음
// 함수 밖에 두면 되는데 그것을 몰랐네

// const once = (fn) => {
//   let once = false;
//   return function () {
//     return once == false ? ((once = true), fn.apply(this, arguments)) : void 0;
//   };
// };
