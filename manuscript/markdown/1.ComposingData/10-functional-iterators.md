## 함수형 반복자 {#functional-iterators}

아주 간단한 문제를 생각해 보겠습니다: 배열의 요소의 합을 찾는 것입니다. 꼬리 재귀 스타일로 나타내면 다음과 같습니다:

```js
const arraySum = ([first, ...rest], accumulator = 0) =>
  first === undefined
    ? accumulator
    : arraySum(rest, first + accumulator)

arraySum([1, 4, 9, 16, 25])
  //=> 55
```

앞서 살펴본 것처럼, 이 방법은 배열을 순회하는 메커니즘과 요소를 합산하는 작업을 얽혀 있습니다. 따라서 `fold`를 사용하여 이를 분리할 수 있습니다:

```js
const callLeft = (fn, ...args) =>
    (...remainingArgs) =>
      fn(...args, ...remainingArgs);

const foldArrayWith = (fn, terminalValue, [first, ...rest]) =>
  first === undefined
    ? terminalValue
    : fn(first, foldArrayWith(fn, terminalValue, rest));

const arraySum = callLeft(foldArrayWith, (a, b) => a + b, 0);

arraySum([1, 4, 9, 16, 25])
  //=> 55
```

이 방식의 장점은 `arraySum` 정의가 대부분 합산과 관련이 있고, 데이터 컬렉션을 순회하는 것과는 관계가 없다는 것입니다. 하지만 여전히 `foldArrayWith`에 의존하고 있어 배열에 대해서만 합산할 수 있습니다.

트리 구조의 숫자를 합산하고 싶거나, 숫자로 구성된 링크드 리스트를 합산하고 싶다면 어떻게 해야 할까요?

`arraySum`은 배열을 인자로 받으며, 배열을 순회하는 방법이 내장되어 있습니다. 아마도 두 가지를 모두 추출할 수 있을 것입니다. 코드를 조금 정리해 보겠습니다:


```js
const callRight = (fn, ...args) =>
    (...remainingArgs) =>
      fn(...remainingArgs, ...args);

const foldArrayWith = (fn, terminalValue, [first, ...rest]) =>
  first === undefined
    ? terminalValue
    : fn(first, foldArrayWith(fn, terminalValue, rest));

const foldArray = (array) => callRight(foldArrayWith, array);

const sumFoldable = (folder) => folder((a, b) => a + b, 0);

sumFoldable(foldArray([1, 4, 9, 16, 25]))
  //=> 55
```

우리가 한 일은 배열을 `const foldArray = (array) => callRight(foldArrayWith, array);`를 사용해 함수로 변환하는 것입니다. `sumFoldable` 함수는 어떤 종류의 데이터 구조가 있는지 신경 쓰지 않고, 단지 그것이 폴드 가능하기만 하면 됩니다.


이제 숫자 트리를 합산해 보겠습니다:

```js
const callRight = (fn, ...args) =>
    (...remainingArgs) =>
      fn(...remainingArgs, ...args);

const foldTreeWith = (fn, terminalValue, [first, ...rest]) =>
  first === undefined
    ? terminalValue
    : Array.isArray(first)
      ? fn(foldTreeWith(fn, terminalValue, first), foldTreeWith(fn, terminalValue, rest))
      : fn(first, foldTreeWith(fn, terminalValue, rest));

const foldTree = (tree) => callRight(foldTreeWith, tree);

const sumFoldable = (folder) => folder((a, b) => a + b, 0);

sumFoldable(foldTree([1, [4, [9, 16]], 25]))
  //=> 55
```

우리는 데이터 구조를 순회하는 방법과 해당 데이터 구조에서 수행하고자 하는 작업을 분리하는 원칙을 또 다른 방법으로 표현했습니다. 우리는 배열이나 트리(아니면 실제로 어떤 것이든) 폴드하는 방법에 대한 지식과 합산하는 방법을 완전히 분리했습니다.

### 반복하기(iterating)

폴드는 보편적인 작업이며, 주의하면 for 루프와 같은 구조적 프로그래밍에서 수행할 수 있는 모든 작업을 폴드를 사용하여 수행할 수 있습니다. 그럼에도 불구하고 어떤 알고리즘을 반복으로 표현할 수 있는 가치가 있습니다.

JavaScript에는 C 언어의 의미론을 모방한 매우 저수준의 `for` 루프가 있습니다. 배열의 요소를 합산하는 것은 다음과 같이 할 수 있습니다:


```js
const arraySum = (array) => {
  let sum = 0;

  for (let i = 0; i < array.length; ++i) {
    sum += array[i];
  }
  return sum
}

arraySum([1, 4, 9, 16, 25])
  //=> 55
```

이번에도 우리는 배열을 순회하는 코드와 합산하는 코드를 혼합하고 있습니다. 가장 나쁜 점은 요소가 0부터 시작하는 연속적인 정수로 인덱싱된다는 세부사항에 대해 매우 저수준으로 접근하고 있다는 것입니다.

조금 다른 방식으로, `while` 루프를 사용할 수 있습니다:

```js
const arraySum = (array) => {
  let done,
      sum = 0,
      i = 0;

  while ((done = i == array.length, !done)) {
    const value = array[i++];
    sum += value;
  }
  return sum
}

arraySum([1, 4, 9, 16, 25])
  //=> 55
```

루프 내부에 `done`과 `value`라는 이름을 묶었습니다. 이를 POJO(Plain Old JavaScript Object)로 묶어 보겠습니다. 조금 불편할 수 있지만, 인내심을 가지고 진행해 보겠습니다:

```js
const arraySum = (array) => {
  let iter,
      sum = 0,
      index = 0;

  while (
    (eachIteration = {
        done: index === array.length,
        value: index < array.length ? array[index] : undefined
      },
      ++index,
      !eachIteration.done)
    ) {
    sum += eachIteration.value;
  }
  return sum;
}

arraySum([1, 4, 9, 16, 25])
  //=> 55
```

이 코드에서는 `done`과 `value` 키를 가진 POJO를 만듭니다. 모든 합산 코드는 `eachIteration.value`를 추가하기만 하면 됩니다. 이제 이 번거로움을 별도의 함수로 추출할 수 있습니다:

```js
const arrayIterator = (array) => {
  let i = 0;

  return () => {
    const done = i === array.length;

    return {
      done,
      value: done ? undefined : array[i++]
    }
  }
}

const iteratorSum = (iterator) => {
  let eachIteration,
      sum = 0;

  while ((eachIteration = iterator(), !eachIteration.done)) {
    sum += eachIteration.value;
  }
  return sum;
}

iteratorSum(arrayIterator([1, 4, 9, 16, 25]))
  //=> 55
```

이제 이 코드가 흥미롭습니다. `arrayIterator` 함수는 배열을 받아들이고, 배열의 요소를 얻기 위해 반복해서 호출할 수 있는 함수를 반환합니다. `iteratorSum` 함수는 `{ done: true }`를 반환할 때까지 반복하여 요소를 순회합니다.


우리는 다른 데이터 구조에 대한 다른 반복자를 작성할 수 있습니다. 다음은 연결 리스트에 대한 반복자입니다:


```js
const EMPTY = null;

const isEmpty = (node) => node === EMPTY;

const pair = (first, rest = EMPTY) => ({first, rest});

const list = (...elements) => {
  const [first, ...rest] = elements;

  return elements.length === 0
    ? EMPTY
    : pair(first, list(...rest))
}

const print = (aPair) =>
  isEmpty(aPair)
    ? ""
    : `${aPair.first} ${print(aPair.rest)}`

const listIterator = (aPair) =>
  () => {
    const done = isEmpty(aPair);
    if (done) {
      return {done};
    }
    else {
      const {first, rest} = aPair;

      aPair = aPair.rest;
      return { done, value: first }
    }
  }

const iteratorSum = (iterator) => {
  let eachIteration,
      sum = 0;;

  while ((eachIteration = iterator(), !eachIteration.done)) {
    sum += eachIteration.value;
  }
  return sum
}

const aListIterator = listIterator(list(1, 4, 9, 16, 25));

iteratorSum(aListIterator)
  //=> 55
```

### 펼치기와 게으름(unfolding and laziness)

반복자는 함수입니다. 그들이 배열이나 연결 리스트를 순회할 때, 그들은 이미 존재하는 것을 탐색하고 있습니다. 그러나 그들은 데이터를 제조하는 것도 가능합니다. 가장 간단한 예를 고려해 보겠습니다:

```js
const NumberIterator = (number = 0) =>
  () => ({ done: false, value: number++ })

fromOne = NumberIterator(1);

fromOne().value;
  //=> 1
fromOne().value;
  //=> 2
fromOne().value;
  //=> 3
fromOne().value;
  //=> 4
fromOne().value;
  //=> 5
```

그리고 또 다른 예는 다음과 같습니다:

```js
const FibonacciIterator  = () => {
  let previous = 0,
      current = 1;

  return () => {
    const value = current;

    [previous, current] = [current, current + previous];
    return {done: false, value};
  };
};

const fib = FibonacciIterator()

fib().value
  //=> 1
fib().value
  //=> 1
fib().value
  //=> 2
fib().value
  //=> 3
fib().value
  //=> 5
```

시드로 시작하여 이를 데이터 구조로 확장하는 함수를 펼치기라고 합니다. 이것은 접기의 반대입니다. 일반적인 펼치기 메커니즘을 작성할 수 있지만, 우리는 펼친 반복자로 무엇을 할 수 있는지에 대해 넘어가겠습니다.

우선, 우리는 컬렉션을 매핑하는 것처럼 반복자를 map 할 수 있습니다.


```js
const mapIteratorWith = (fn, iterator) =>
  () => {
    const {done, value} = iterator();

    return ({done, value: done ? undefined : fn(value)});
  }

const squares = mapIteratorWith((x) => x * x, NumberIterator(1));

squares().value
  //=> 1
squares().value
  //=> 4
squares().value
  //=> 9
```

이 영원히 계속되는 비즈니스에는 몇 가지 단점이 있습니다. 아이디어를 도입해 보겠습니다: 반복자를 받아 다른 반복자를 반환하는 함수입니다. 우리는 `take`로 시작할 수 있는데, 이는 고정된 수의 요소만 반환하는 간단한 함수입니다:

```js
const take = (iterator, numberToTake) => {
  let count = 0;

  return () => {
    if (++count <= numberToTake) {
      return iterator();
    } else {
      return {done: true};
    }
  };
};

const toArray = (iterator) => {
  let eachIteration,
      array = [];

  while ((eachIteration = iterator(), !eachIteration.done)) {
    array.push(eachIteration.value);
  }
  return array;
}

toArray(take(FibonacciIterator(), 5))
  //=> [1, 1, 2, 3, 5]

toArray(take(squares, 5))
  //=> [1, 4, 9, 16, 25]
```

첫 다섯 개의 홀수의 제곱은 어떨까요? 우리는 홀수를 생성하는 반복자가 필요합니다. 이를 직접 작성할 수 있습니다:

```js
const odds = () => {
  let number = 1;

  return () => {
    const value = number;

    number += 2;
    return {done: false, value};
  }
}

const squareOf = callLeft(mapIteratorWith, (x) => x * x)

toArray(take(squareOf(odds()), 5))
  //=> [1, 9, 25, 49, 81]
```

우리는 또한 매핑 함수에 동반할 필터 반복자를 작성할 수 있습니다:

```js
const filterIteratorWith = (fn, iterator) =>
  () => {
    do {
      const {done, value} = iterator();
    } while (!done && !fn(value));
    return {done, value};
  }

const oddsOf = callLeft(filterIteratorWith, (n) => n % 2 === 1);

toArray(take(squareOf(oddsOf(NumberIterator(1))), 5))
  //=> [1, 9, 25, 49, 81]
```

반복자를 매핑하고 필터링하는 것은 우리가 이미 가진 부분들을 조합할 수 있게 해주며, 복잡한 조건문, 반복문 및 경계 조건을 처리하는 번거로운 코드를 작성할 필요가 없습니다.

### bonus

다른 언어에서 JavaScript로 오는 많은 프로그래머는 컬렉션에 대한 세 가지 "표준" 작업인 접기(folding), 필터링(filtering), 찾기(finding)에 익숙합니다. 예를 들어, Smalltalk에서는 이들을 `collect`, `select`, `detect`라고 부릅니다.

우리는 특정 기준을 만족하는 반복의 첫 번째 요소를 찾는 기능을 작성하지 않았습니다. 아니면 했을까요?

```js
const firstInIteration = (fn, iterator) =>
  take(filterIteratorWith(fn, iterator), 1);
```

이것은 흥미롭습니다. 왜냐하면 이는 게으르기 때문입니다: 반복의 모든 요소에 대해 `fn`을 적용하지 않고, 테스트를 통과하는 첫 번째 요소를 찾는 데 충분한 만큼만 적용하기 때문입니다. 반면, 우리가 다음과 같은 코드를 작성했다면:

```js
const firstInArray = (fn, array) =>
  array.filter(fn)[0];
```

JavaScript는 모든 요소에 대해 `fn`을 적용할 것입니다. 만약 `array`가 매우 크고 `fn`이 매우 느리다면, 이는 불필요한 시간을 많이 소모할 수 있습니다. 그리고 `fn`에 어떤 종류의 부작용이 있다면, 프로그램이 버그가 있을 수 있습니다.


### 주의사항

다른 함수들과는 달리, 반복자는 *상태 유지(stateful)* 합니다. 상태 유지 함수에 대한 몇 가지 중요한 의미가 있습니다. 그 중 하나는 `take(...)`와 같은 함수가 완전히 새로운 반복자를 생성하는 것처럼 보이지만, 실제로는 원래 반복자에 대한 장식된 참조를 반환한다는 것입니다. 따라서 새로운 장식을 탐색하는 동안 원래의 상태가 변경됩니다!


모든 의도와 목적상, 반복자를 함수에 전달하면 더 이상 그 반복자를 "소유"하지 않는다고 예상할 수 있으며, 그 상태가 변경되었거나 변경될 것이라는 점을 기억해야 합니다.

