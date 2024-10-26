## mapWith {#mapWith}

JavaScript에서 배열은 `.map` 메서드를 가지고 있습니다. `map`은 함수를 인자로 받아 배열의 각 요소에 적용하고, 그 결과를 다른 배열로 반환합니다. 예를 들어:

```js
[1, 2, 3, 4, 5].map(x => x * x)
  //=> [1, 4, 9, 16, 25]
```

우리가 원하는 경우, `.map` 메서드처럼 작동하는 함수를 작성할 수 있습니다:

```js
const map = (list, fn) =>
  list.map(fn);
```

이 레시피는 map이 아닌 mapWith에 대한 것입니다. mapWith는 map을 감싸고 다른 모든 함수를 맵퍼로 변환하는 함수입니다. mapWith는 매우 간단합니다:[^mapWith]

```js
const mapWith = (fn) => (list) => list.map(fn);
```

`mapWith`는 두 가지 방식에서 `map`과 다릅니다. 첫 번째는 인자를 반전시켜 함수가 먼저 오고 리스트가 두 번째로 옵니다. 두 번째는 함수를 "커링(curring)"하여 두 개의 인자를 받는 대신 하나의 인자를 받고 다른 인자를 받는 함수를 반환합니다.

즉, `mapWith`에 함수를 전달하면 해당 매핑을 모든 배열에 적용하는 함수를 얻을 수 있습니다. 예를 들어, 배열의 제곱을 반환하는 함수가 필요할 수 있습니다. `.map`을 감싸는 함수를 작성하는 대신:


    const squaresOf = (list) =>
      list.map(x => x * x);

    squaresOf([1, 2, 3, 4, 5])
      //=> [1, 4, 9, 16, 25]

한 번에 `mapWith`를 호출할 수 있습니다:

    const squaresOf = mapWith(n => n * n);

    squaresOf([1, 2, 3, 4, 5])
      //=> [1, 4, 9, 16, 25]

만약 `mapWith`를 사용하지 않는다면, `map`에 `callRight`를 사용하여 동일한 결과를 얻을 수도 있습니다:

    const squaresOf = callRight(map, n => n * n);

    squaresOf([1, 2, 3, 4, 5])
      //=> [1, 4, 9, 16, 25]

두 패턴 모두 같은 목적지에 도달하게 해줍니다: 전혀 새로 만드는 대신 공통된 조각으로부터 함수를 조합하는 것입니다. `mapWith`는 매우 일반적인 패턴에 대한 편리한 추상화입니다.

*`mapWith` was suggested by [ludicast](http://github.com/ludicast)*

[^mapWith]: 만약 우리가 항상 배열에 대해 `mapWith`를 사용한다면, 우리는 `list.map(fn)`을 작성할 수 있습니다. 하지만 `.length` 속성과 `[] `접근자를 가진 일부 객체는 `map` 메서드를 가지지 않지만 `mapWith`를 사용할 수 있습니다. `mapWith`는 이러한 객체와도 작동합니다. 이는 `.map`과 같은 메서드를 구현하는 것이 과연 적절한지에 대한 더 큰 문제를 시사합니다. JavaScript와 같은 언어에서는 구현 방법을 아는 객체를 정의하고, 나머지를 수행하는 독립적인 함수를 정의하는 것이 자유롭습니다. 


