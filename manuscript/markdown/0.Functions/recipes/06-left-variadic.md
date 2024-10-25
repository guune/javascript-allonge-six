## Left-Variadic Functions

*가변 함수*는 다양한 수의 인수를 받도록 설계된 함수입니다.[^eng] 자바스크립트에서는 매개변수를 모아서 가변 함수를 만들 수 있습니다. 예를 들어

[^eng]: 영어는 자바스크립트만큼이나 일관성이 없습니다: 인자 수가 고정된 함수는 단항, 이진, 삼항 등이 될 수 있습니다. 하지만 “가변적”일 수 있을까요? 아니요! “가변적"이어야 합니다.(영어 농담 unary, binary 이니깐 variary여야 할 것 같은데 variadic이다)

```js
const abccc = (a, b, ...c) => {
  console.log(a);
  console.log(b);
  console.log(c);
};

abccc(1, 2, 3, 4, 5)
  1
  2
  [3,4,5]
```

이는 특정 종류의 구조 해체 알고리즘을 작성할 때 유용할 수 있습니다. 예를 들어, 일종의 팀 기록을 구축하는 함수를 만들고 싶을 수 있습니다. 이 함수는 코치, 주장, 임의의 수의 선수를 받아들입니다. ECMAScript 2015에서는 쉽습니다:

```js
function team(coach, captain, ...players) {
  console.log(`${captain} (captain)`);
  for (let player of players) {
    console.log(player);
  }
  console.log(`squad coached by ${coach}`);
}

team('Luis Enrique', 'Xavi Hernández', 'Marc-André ter Stegen',
     'Martín Montoya', 'Gerard Piqué')
  //=>
    Xavi Hernández (captain)
    Marc-André ter Stegen
    Martín Montoya
    Gerard Piqué
    squad coached by Luis Enrique
```

하지만 그 반대는 불가능합니다:

```js
function team2(...players, captain, coach) {
  console.log(`${captain} (captain)`);
  for (let player of players) {
    console.log(player);
  }
  console.log(`squad coached by ${coach}`);
}
//=> Unexpected token
```

ECMAScript 2015에서는 매개변수 목록의 *끝*에서만 매개변수를 수집할 수 있습니다. 시작이 아닙니다. 어떻게 해야 할까요?

### a history lesson

“예전에"[^ye] 자바스크립트는 매개변수를 수집할 수 없었기 때문에 `arguments`와 '.slice`로 백플립을 하거나 마지막에 선언된 매개변수로 인수를 수집할 수 있는 `variadic` 데코레이터를 직접 작성해야 했습니다. 다음은 ECMAScript-5의 모든 영광입니다:

[^ye]: 또 다른 역사 교훈입니다. “Ye Olde"의 ‘Ye’는 옛날에는 실제로 ‘Y’로 철자하지 않았고 [thorn](https://en.wikipedia.org/wiki/Thorn_(문자))로 철자했으며 ‘the’로 발음되었습니다. 또 다른 단어인 “작은 프로그래밍 신앙의 예”의 “예”는 “ye”로 발음되지만 완전히 다른 단어입니다.

```js
var __slice = Array.prototype.slice;

function rightVariadic (fn) {
  if (fn.length < 1) return fn;

  return function () {
    var ordinaryArgs = (1 <= arguments.length ?
          __slice.call(arguments, 0, fn.length - 1) : []),
        restOfTheArgsList = __slice.call(arguments, fn.length - 1),
        args = (fn.length <= arguments.length ?
          ordinaryArgs.concat([restOfTheArgsList]) : []);

    return fn.apply(this, args);
  }
};

var firstAndButFirst = rightVariadic(function test (first, butFirst) {
  return [first, butFirst]
});

firstAndButFirst('why', 'hello', 'there', 'little', 'droid')
  //=> ["why",["hello","there","little","droid"]]
```
더 이상 `rightVariadic`이 필요하지 않습니다:

```js
var firstAndButFirst = rightVariadic(
  function test (first, butFirst) {
    return [first, butFirst]
  });
```

이제 간단히 작성하면 됩니다:

```js
const firstAndButFirst = (first, ...butFirst) =>
  [first, butFirst];
```

이것은 *우변수 함수*로, 하나 이상의 고정 인자를 가지며 나머지는 가장 오른쪽 인자로 모이는 것을 의미합니다.

### 한계 극복하기

진전이 있는 것은 좋은 일입니다. 하지만 위에서 언급했듯이 우리는 쓸 수 없습니다:

```js
const butLastAndLast = (...butLast, last) =>
  [butLast, last];
```

이것이 바로 *좌변형 함수*입니다. 모든 좌변수 함수는 하나 이상의 고정 인수를 가지며, 나머지는 가장 왼쪽 인자로 모입니다. 자바스크립트는 이렇게 하지 않습니다. 하지만 좌변수 함수를 작성하고 싶다면 하나 이상의 인수가 있는 함수를 좌변수 함수로 바꾸는 `leftVariadic` 데코레이터를 직접 만들 수 있을까요?

물론 `rightVariadic`의 기술을 사용하면 가능합니다. 참고로 최신 JavaScript를 활용하여 코드를 간소화할 수 있습니다:

```js
const leftVariadic = (fn) => {
  if (fn.length < 1) {
    return fn;
  }
  else {
    return function (...args) {
      const gathered = args.slice(0, args.length - fn.length + 1),
            spread   = args.slice(args.length - fn.length + 1);

      return fn.apply(
        this, [gathered].concat(spread)
      );
    }
  }
};

const butLastAndLast = leftVariadic((butLast, last) => [butLast, last]);

butLastAndLast('why', 'hello', 'there', 'little', 'droid')
  //=> [["why","hello","there","little"],"droid"]
```

왼쪽 변형` 함수는 어떤 함수를 오른쪽이 아닌 왼쪽에서 *파라미터를 수집하는 함수로 바꾸는 데코레이터입니다.

### left-variadic destructuring

함수에 대한 인수를 수집하는 것은 자바스크립트가 배열을 *파괴*하는 방법 중 하나입니다. 또 다른 방법은 다음과 같이 변수를 할당할 때입니다:

```js
const [first, ...butFirst] = ['why', 'hello', 'there', 'little', 'droid'];

first
  //=> 'why'
butFirst
  //=> ["hello","there","little","droid"]
```

매개변수와 마찬가지로 배열을 구조 분해할 때 왼쪽에서 값을 수집할 수 없습니다:

```js
const [...butLast, last] = ['why', 'hello', 'there', 'little', 'droid'];
  //=> Unexpected token
```

어려운 방법으로 `leftVariadic`을 사용할 수 있습니다:

```js
const [butLast, last] = leftVariadic((butLast, last) => [butLast, last])(...['why', 'hello', 'there', 'little', 'droid']);

butLast
  //=> ['why', 'hello', 'there', 'little']

last
  //=> 'droid'
```

그러나 동일한 원리를 사용하여 지루함 없이 왼쪽 수집 함수 유틸리티를 직접 작성할 수 있습니다:

```js
const leftGather = (outputArrayLength) => {
  return function (inputArray) {
    return [inputArray.slice(0, inputArray.length - outputArrayLength + 1)].concat(
      inputArray.slice(inputArray.length - outputArrayLength + 1)
    )
  }
};

const [butLast, last] = leftGather(2)(['why', 'hello', 'there', 'little', 'droid']);

butLast
  //=> ['why', 'hello', 'there', 'little']

last
  //=> 'droid'
```

leftGather`를 사용하면 결과로 사용할 배열의 길이를 제공해야 하며, `leftVariadic`이 함수에 대한 초과 인수를 수집하는 것처럼 왼쪽에서 초과 인수를 수집합니다.
