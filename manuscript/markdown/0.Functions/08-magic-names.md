## 매직 이름 {#magic-names}

함수가 인자와 함께 적용될 때(또는 "호출"될 때), JavaScript는 함수 실행을 위해 생성된 환경에서 인자의 값들을 함수의 인자 이름에 바인딩합니다. 지금까지 우리가 논의하지 않은 것은 JavaScript가 여러분이 인자 목록에 넣은 것 외에도 몇 가지 "매직" 이름에 값을 바인딩한다는 것입니다.[^read-only]

[^read-only]: JavaScript가 여러분을 위해 바인딩하는 "매직" 이름에 대해 직접 바인딩을 정의하려고 시도해서는 안 됩니다. 이들을 항상 읽기 전용으로 취급하는 것이 현명합니다. ↩

### function 키워드

이러한 "매직" 이름에 대해서는 두 가지 별도의 규칙이 있습니다. 하나는 `function` 키워드를 사용하여 함수를 호출할 때의 규칙이고, 다른 하나는 "화살표 함수"로 정의된 함수에 대한 규칙입니다. 먼저 `function` 키워드로 정의된 함수에서 어떻게 작동하는지 살펴보겠습니다.

첫 번째 매직 이름은 `this`이며, 이는 함수의 컨텍스트라고 불리는 것에 바인딩됩니다. `this`에 대해서는 객체와 클래스를 다룰 때 더 자세히 살펴볼 것입니다. 두 번째 매직 이름은 매우 흥미로운데, 이는 `arguments`라고 불리며, 가장 흥미로운 점은 함수에 전달된 인자들의 목록을 포함한다는 것입니다:

```js
const plus = function (a, b) {
  return arguments[0] + arguments[1];
}

plus(2,3)
  //=> 5
```

`arguments`가 배열처럼 보이지만, 실제로는 배열이 아닙니다: 이는 0부터 시작하는 정수처럼 보이는 이름을 가진 속성에 일부 값을 바인딩하는 객체[^pojo]에 더 가깝습니다:

```js
const args = function (a, b) {
  return arguments;
}

args(2,3)
  //=> { '0': 2, '1': 3 }
```

`arguments`는 선언된 개수와 관계없이 항상 함수에 전달된 모든 인자를 포함합니다. 따라서 우리는 plus를 다음과 같이 작성할 수 있습니다:

```js
const plus = function () {
  return arguments[0] + arguments[1];
}

plus(2,3)
  //=> 5
```

객체를 논의할 때 속성에 대해 더 자세히 다룰 것입니다. 여기 `arguments`에 대한 흥미로운 점이 있습니다:

```js
const howMany = function () {
  return arguments['length'];
}

howMany()
  //=> 0

howMany('hello')
  //=> 1

howMany('sharks', 'are', 'apex', 'predators')
  //=> 4
```

arguments 바인딩의 가장 일반적인 사용은 가변 개수의 인자를 받을 수 있는 함수를 만드는 것입니다. 부분 적용과 말줄임표부터 시작하여 많은 레시피에서 이것이 사용되는 것을 볼 수 있을 것입니다.

[^pojo]: We'll look at [arrays](#arrays) and [plain old javascript objects](#pojos) in depth later.

### 매직 이름과 화살표 함수

매직 이름 `this`와 `arguments`는 화살표 함수로 정의된 함수를 호출할 때 다른 동작을 합니다: 함수가 호출될 때 바인딩되는 대신, 화살표 함수는 다른 바인딩과 마찬가지로 항상 자신을 감싸고 있는 범위에서 `this`와 `arguments`에 대한 바인딩을 가져옵니다.

예를 들어, 이 표현식의 내부 함수가 `function`으로 정의될 때, `arguments[0]`은 자신의 유일한 인자인 "inner"를 참조합니다:

```js
(function () {
  return (function () { return arguments[0]; })('inner');
})('outer')
  //=> "inner"
```

하지만 화살표 함수를 사용하면, `arguments`는 외부 환경, 즉 `function`으로 정의된 환경에서 정의될 것입니다. 따라서` arguments[0]`은 "inner"가 아닌 "outer"를 참조할 것입니다:

```js
(function () {
  return (() => arguments[0])('inner');
})('outer')
  //=> "outer"
```

두 구문이 서로 다른 의미를 가지는 것이 엉뚱해 보일 수 있지만, 설계 목표를 고려하면 이해가 됩니다:   
화살표 함수는 매우 가볍게 설계되었으며 종종 구문을 모방하기 위해 매핑이나 콜백과 같은 구조와 함께 사용됩니다.

인위적인 예를 들어보겠습니다. 이 함수는 숫자를 받아서 가상의 곱셈표에서 한 행을 나타내는 배열을 반환합니다.   
Building Blocks에서 논의했던 mapWith를 사용합니다.[^mapWith] 화살표 함수와 function 키워드의 차이를 보여주기 위해 arguments를 사용하겠습니다:

[^mapWith]: 다음과 같이 작성할 수도 있습니다: `const mapWith = (fn) => array => array.map(fn);`, 아직 방법에 대해 논의하지 않았더라도 그것이 작동한다고 믿을 수 있습니다.

```js
const row = function () {
  return mapWith((column) => column * arguments[0])(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  )
}

row(3)
  //=> [3,6,9,12,15,18,21,24,27,30,33,36
```

이는 잘 작동합니다. `arguments[0]`이 함수 `row`에 전달한 `3`을 참조하기 때문입니다. 우리의 "화살표" 함수 `(column) => column * arguments[0]`는 호출될 때 `arguments`를 바인딩하지 않습니다. 하지만 `row`를 `function` 키워드를 사용하도록 다시 작성하면 작동이 멈춥니다:

```js
const row = function () {
  return mapWith(function (column) { return column * arguments[0] })(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  )
}

row(3)
  //=> [1,4,9,16,25,36,49,64,81,100,121,144]
```

이제 우리의 내부 함수는 호출될 때마다 `arguments[0]`을 바인딩하므로, `function (column) { return column * column }`을 작성한 것과 같은 결과를 얻게 됩니다.


이 예제가 명백히 비현실적이긴 하지만, 주목할 만한 일반적인 설계 원칙이 있습니다. 때로는 함수가 대문자-F 함수로 사용되도록 의도됩니다. 이는 이름이 있고, 다른 코드 조각들에 의해 호출되며, 코드에서 일급 개체입니다.

하지만 때로는 함수가 소문자-f 함수입니다. 이는 계산될 표현식의 간단한 표현입니다. 우리의 위 예제에서 `row`는 대문자-F 함수이지만, `(column) => column * arguments[0]`은 소문자-f 함수이며, `mapWith`에 적용할 무언가를 제공하기 위해서만 존재합니다.

매직 변수가 대문자-F 함수에는 적용되지만 소문자-f 함수에는 적용되지 않게 함으로써, 소문자-f 함수를 구문으로 사용하기가 훨씬 쉬워지며, 이들을 `mapWith`와 같은 함수에 전달할 수 있는 표현식이나 블록으로 취급할 수 있습니다.
