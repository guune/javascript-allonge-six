// 1. compose

const compose2 = (a, b) => (c) => a(b(c));
const compose3 = (a, b, c) => (d) => a(b(c(d)));
const compose = (a, ...rest) => (rest.length === 0 ? a : "to be determined");

const addOne = (number) => number + 1;

const doubleOf = (number) => number * 2;

const addTwo = (number) => number + 42;
const doubleOfAddOne = compose2(doubleOf, addOne);
const test = compose3(addTwo, doubleOf, addOne);

// console.log(doubleOfAddOne(2));
// console.log(test(2));

// const asd = compose(doubleOf);

const doubleOfAddOne2 = compose(doubleOf, addOne);
// const test2 = compose(addTwo, doubleOf, addOne);

// console.log(asd(32));
console.log(doubleOfAddOne2(2));
// console.log(test2(2));

// 만약 `compose3`를 구현하고 싶다면 다음과 같이 작성할 수 있습니다:

//     const compose3 = (a, b, c) => (d) =>
//       a(b(c(d)))

// 또는 실제로는 다음과 같다는 것을 알 수 있습니다:

//     const compose3 = (a, b, c) => compose(a, (compose(b, c)))

// 일단 `compose4`에 도달하면 더 나은 방법이 있는지 스스로에게 물어봅니다.
// 예를 들어, `*variadic* compose`가 있다면 `compose(a, b)`, `compose(a, b, c)` 또는 `compose(a, b, c, d)`를 작성할 수 있습니다.

// 재귀적으로 다양한 `compose`를 구현할 수 있습니다.
// 재귀적 `compose`를 작성하는 가장 쉬운 방법은 가장 작은 케이스 또는 *퇴화* 케이스부터 시작하는 것입니다.
// 만약 `compose`가 인자를 하나만 받는다면 다음과 같이 보일 것입니다:

//     const compose = (a) => a

// 다음으로 문제의 일부를 분리하는 방법이 필요합니다. 가변 인자 함수로 이를 할 수 있습니다:

//     const compose = (a, ...rest) =>
//       "to be determined"

// 퇴화된 경우인지 테스트할 수 있습니다:

//     const compose = (a, ...rest) =>
//       rest.length === 0
//         ? a
//         : "to be determined"

// 퇴행적인 경우가 아니라면, 나머지 부분에 대한 해결책과 우리가 가진 것을 결합해야 합니다.
//  즉, `fn`과 `compose(...rest)`를 결합해야 합니다. 어떻게 할까요?
//  컴포즈(a, b)`를 생각해 봅시다. 우리는 `compose(b)`가 퇴화된 경우이며, 그냥 `b`라는 것을 알고 있습니다.
//  그리고 `compose(a, b)`는 `(c) => a(b(c))`라는 것을 알고 있습니다.

// 따라서 `b`를 `compose(b)`로 대체해 봅시다:

//     compose(a, compose(b)) === (c) => a(compose(b)(c))

// 이제 `b`를 `...rest`로 대체합니다:

//     compose(a, compose(...rest)) === (c) => a(compose(...rest)(c))

// 이것이 우리의 해결책입니다:

//     const compose = (a, ...rest) =>
//       rest.length === 0
//         ? a
//         : (c) => a(compose(...rest)(c))

// 물론 다른 방법도 있습니다. compose`는 다음과 같이 반복이나 '.reduce`로 구현할 수 있습니다:

//     const compose = (...fns) =>
//       (value) =>
//         fns.reverse().reduce((acc, fn) => fn(acc), value);

// 하지만 일련의 함수를 합쳐서 새로운 함수를 만든다는 기본 동작은 동일합니다.
// 더 작은 단일 목적 함수를 작성하여 다양한 방식으로 조합할 수 있다는 점도 동일합니다.
