## 재할당  {#reassignment}

JavaScript는 일부 명령형 프로그래밍 언어와 마찬가지로 매개변수에 바인딩된 값을 재할당할 수 있습니다. 우리는 이전에 재바인딩에서 이를 보았습니다:

기본적으로 JavaScript는 매개변수로 바인딩된 이름에 새로운 값을 *재바인딩*하는 것을 허용합니다. 예를 들어, 다음과 같이 작성할 수 있습니다:

    const evenStevens = (n) => {
      if (n === 0) {
        return true;
      }
      else if (n == 1) {
        return false;
      }
      else {
        n = n - 2;
        return evenStevens(n);
      }
    }

    evenStevens(42)
      //=> true

`n = n - 2;`라는 줄은 `n`에 새로운 값을 재바인딩합니다. 우리는 재할당에서 이 주제를 훨씬 더 깊이 있게 다룰 것이지만, 그 전에 `const`로 바인딩된 이름을 사용하여 비슷한 일을 해보겠습니다. 우리는 이미 `evenStevens`를 `const`로 바인딩했으므로, 재바인딩을 시도해 보겠습니다:

    evenStevens = (n) => {
      if (n === 0) {
        return true;
      }
      else if (n == 1) {
        return false;
      }
      else {
        return evenStevens(n - 2);
      }
    }
      //=> ERROR, evenStevens is read-only

JavaScript는 `const`로 바인딩된 이름을 재바인딩하는 것을 허용하지 않습니다. 우리는 `const`를 사용하여 새로운 함수나 블록 스코프에 새로운 바인딩을 선언하여 그림자를 만들 수 있지만, 기존 스코프에서 `const`로 바인딩된 이름을 재바인딩할 수는 없습니다.

매개변수를 재바인딩하는 것은 일반적으로 피하지만, 함수 내에서 선언된 이름을 재바인딩하는 것은 어떨까요? 우리가 원하는 것은 `const`처럼 작동하지만 변수를 재바인딩할 수 있는 문장입니다. JavaScript에는 그렇게 할 수 있는 방법이 있으며, 그것을 let이라고 합니다:

```js
let age = 52;

age = 53;
age
  //=> 53
```

우리는 환경에서 바인딩이 어떻게 작용하는지를 신중하게 살펴보는 데 시간을 투자했습니다. 이제 변수를 재할당할 때 어떤 일이 발생하는지 살펴보는 데 시간을 투자합시다. 핵심은 동일한 환경에서 동일한 이름에 다른 값을 재바인딩하는 것을 이해하는 것입니다.

그림자 변수에 대해 살펴보겠습니다:

    (() => {
      let age = 49;

      if (true) {
        let age = 50;
      }
      return age;
    })()
      //=> 49

블록 내에서 `50`을 `age`에 바인딩하는 것은 외부 환경의 `age` 바인딩을 변경하지 않습니다. 왜냐하면 블록에서의 `age` 바인딩이 외부 환경의 `age` 바인딩을 그림자 처리하기 때문입니다. 우리는 다음과 같이 변합니다:


    {age: 49, '..': global-environment}

To:

    {age: 50, '..': {age: 49, '..': global-environment}}

Then back to:

    {age: 49, '..': global-environment}

하지만 만약 우리가 `let`으로 `age`를 그림자 처리하지 않는다면, 블록 내에서의 재할당은 원래의 값을 변경합니다:

    (() => {
      let age = 49;

      if (true) {
        age = 50;
      }
      return age;
    })()
      //=> 50

변수 레이블을 평가하는 것처럼, 바인딩이 재바인딩될 때 JavaScript는 현재 환경에서 바인딩을 찾고, 다음으로 각 조상을 순회하여 찾습니다. 그런 다음 해당 환경에서 이름을 재바인딩합니다.

### `let`과 `const` 혼합

일부 프로그래머는 의도적으로 변수를 그림자 처리하는 것을 싫어합니다. 그 이유는 변수의 그림자가 코드를 혼란스럽게 만든다고 생각하기 때문입니다. 만약 당신이 이 주장을 믿는다면, JavaScript에서 그림자가 작동하는 방식은 코드를 이동할 때 실수로 변수를 그림자 처리하지 않도록 보호하기 위해 존재한다고 말할 수 있습니다.

만약 당신이 의도적으로 변수를 그림자 처리하는 것을 싫어한다면, 그림자 처리된 변수와 `const` 및 `let` 의미를 혼합하는 것에 대해 더욱 부정적인 시각을 가질 수 있습니다:

    (() => {
      let age = 49;

      if (true) {
        const age = 50;
      }
      age = 51;
      return age;
    })()
      //=> 51

`let`으로 `age`를 그림자 처리하더라도 원래 스코프에서 변수를 재바인딩하는 것은 여전히 가능합니다. 그리고:

    (() => {
      const age = 49;

      if (true) {
        let age = 50;
      }
      age = 52;
      return age;
    })()
      //=> ERROR: age is read-only

`let`으로 그림자 처리된 `const`는 원래 스코프에서 재바인딩할 수 없습니다.

### `var`

JavaScript에는 이름을 값에 바인딩하는 또 다른 방법인 `var`가 있습니다..[^namecount]

[^namecount]: 우리는 지금까지 몇 가지를 보았나요? 매개변수는 이름을 바인딩합니다. 함수 선언은 이름을 바인딩합니다. 명명된 함수 표현식은 이름을 바인딩합니다. const와 let은 이름을 바인딩합니다. 그래서 지금까지 다섯 가지 방법이 있습니다! 그리고 더 많습니다!

`var`는 `let`과 매우 유사해 보입니다:

```js
const factorial = (n) => {
  let x = n;
  if (x === 1) {
    return 1;
  }
  else {
    --x;
    return n * factorial(x);
  }
}

factorial(5)
  //=> 120

const factorial2 = (n) => {
  var x = n;
  if (x === 1) {
    return 1;
  }
  else {
    --x;
    return n * factorial2(x);
  }
}

factorial2(5)
  //=> 120
```

하지만 물론, `let`과 완전히 동일하지는 않습니다. 약간의 차이가 혼란을 초래할 수 있습니다. 첫째, `var`는 블록 스코프가 아니라 함수 스코프입니다. 함수 선언과 마찬가지로:

```js
(() => {
  var age = 49;

  if (true) {
    var age = 50;
  }
  return age;
})()
  //=> 50
```

`age`를 두 번 선언하는 것은 오류를 발생시키지 않으며(!) 내부 선언은 외부 선언을 그림자 처리하지 않습니다. 모든 `var` 선언은 함수의 최상단으로 끌어올려진 것처럼 작용하며, 약간의 함수 선언과 비슷합니다.

하지만, 일관성을 기대하는 것은 현명하지 않습니다. 함수 선언은 함수 내의 어디에나 나타날 수 있지만, 선언과 정의가 모두 끌어올려집니다. 도우미를 사용하는 함수의 예를 살펴보겠습니다:

```js
const factorial = (n) => {

  return innerFactorial(n, 1);

  function innerFactorial (x, y) {
    if (x == 1) {
      return y;
    }
    else {
      return innerFactorial(x-1, x * y);
    }
  }
}

factorial(4)
  //=> 24
```

JavaScript는 이 코드를 다음과 같이 해석합니다:

```js
const factorial = (n) => {
  let innerFactorial = function innerFactorial (x, y) {
      if (x == 1) {
        return y;
      }
      else {
        return innerFactorial(x-1, x * y);
      }
    }

  return innerFactorial(n, 1);
}
```

JavaScript는 `let`과 할당을 끌어올립니다. 그러나 `var`에 대해서는 그렇지 않습니다:


```js
const factorial = (n) => {

  return innerFactorial(n, 1);

  var innerFactorial = function innerFactorial (x, y) {
    if (x == 1) {
      return y;
    }
    else {
      return innerFactorial(x-1, x * y);
    }
  }
}

factorial(4)
  //=> undefined is not a function (evaluating 'innerFactorial(n, 1)')
```

JavaScript는 선언을 끌어올리지만 할당은 하지 않습니다. 마치 우리가 다음과 같이 작성한 것과 같습니다:


```js
const factorial = (n) => {

  let innerFactorial = undefined;

  return innerFactorial(n, 1);

  innerFactorial = function innerFactorial (x, y) {
    if (x == 1) {
      return y;
    }
    else {
      return innerFactorial(x-1, x * y);
    }
  }
}

factorial(4)
  //=> undefined is not a function (evaluating 'innerFactorial(n, 1)')
```

이러한 방식으로 `var`는 `const`와 `let`과 유사하지만, 항상 이름을 사용하기 전에 선언하고 바인딩해야 한다는 점에서 다릅니다. 그러나 블록 스코프가 아닌 함수 스코프입니다.

### `const`와 `let`이 만들어진 이유

`const`와 `let`은 JavaScript의 최근 추가된 기능입니다. 거의 20년 동안 변수는 `var`로 선언되었습니다(물론 매개변수와 함수 선언은 제외하고요). 그러나 `var`의 함수 스코프는 문제가 있었습니다.

아직 다루지 않았지만, JavaScript는 반복을 위한 `for` 루프를 제공합니다. 이 루프는 C의 for 루프와 매우 유사합니다. `var`를 사용한 예는 다음과 같습니다:

    var sum = 0;
    for (var i = 1; i <= 100; i++) {
      sum = sum + i
    }
    sum
      //=> 5050

이 합계를 계산하는 더 빠른 방법을 생각해 볼 수 있기를 바랍니다.[^gauss] 또한 var i = 1이 우리가 선호하는 방식으로 상단이 아니라는 점을 알아차렸을 것입니다. 하지만 이것이 문제가 될까요?


[^gauss]: 칼 프리드리히 가우스에 대한 잘 알려진 이야기가 있습니다. 그가 초등학교에 다닐 때, 선생님이 반 학생들에게 1부터 100까지의 숫자를 더해서 수업이 끝날 때까지 대답하라고 화를 냈습니다. 약 30초 후, 가우스는 정답을 제출했습니다. 다른 아이들은 숫자를 이렇게 더하고 있었습니다: `1 + 2 + 3 + ... + 99 + 100 = ?` 하지만 가우스는 숫자를 이렇게 재배열하여 더했습니다: `(1 + 100) + (2 + 99) + (3 + 98) + ... + (50 + 51) = ? `모든 숫자 쌍이 101이 더해지는 것을 알 수 있습니다. 숫자 쌍이 50개 있으므로, 정답은 50*101 = 5050입니다. 물론 가우스는 다른 아이들보다 20배는 더 빠르게 정답을 얻었습니다.


예를 들어 다음과 같은 변형을 고려해 보십시오:

    var introductions = [],
        names = ['Karl', 'Friedrich', 'Gauss'];

    for (var i = 0; i < 3; i++) {
      introductions[i] = "Hello, my name is " + names[i]
    }
    introductions
      //=> [ 'Hello, my name is Karl',
      //     'Hello, my name is Friedrich',
      //     'Hello, my name is Gauss' ]

지금까지는 잘 진행되고 있습니다. 자, JavaScript의 함수가 값이라는 것을 기억하시나요? 조금 더 fancy하게 만들어봅시다!

    var introductions = [],
        names = ['Karl', 'Friedrich', 'Gauss'];

    for (var i = 0; i < 3; i++) {
      introductions[i] = (soAndSo) =>
        `Hello, ${soAndSo}, my name is ${names[i]}`
    }
    introductions
      //=> [ [Function],
      //     [Function],
      //     [Function] ]

다시 잘 진행되고 있습니다. 이제 우리의 함수 중 하나를 호출해 보겠습니다:

    introductions[1]('Raganwald')
      //=> 'Hello, Raganwald, my name is undefined'

무슨 일이 일어난 걸까요? 왜 'Hello, Raganwald, my name은 Friedrich'이 아니었을까요? 답은 성가신 `var i`에 있습니다. `i`는 주변 환경에 바인딩되어 있으므로 마치 다음과 같이 작성한 것과 같습니다:

    var introductions = [],
        names = ['Karl', 'Friedrich', 'Gauss'],
        i = undefined;

    for (i = 0; i < 3; i++) {
      introductions[i] = function (soAndSo) {
        return "Hello, " + soAndSo + ", my name is " + names[i]
      }
    }
    introductions

각 함수가 생성될 때 `i`는 `0`, `1` 또는 `2`와 같은 합리적인 값을 가지고 있었습니다. 그러나 우리가 함수 중 하나를 호출할 때 `i`의 값은 `3`이 되어 루프가 종료되었기 때문에 이런 문제가 발생합니다. 그래서 함수가 호출될 때, JavaScript는 그 환경(클로저에서)의 `i`를 찾고 값을 `3`으로 가져오는 것입니다. 이건 우리가 원하는 것이 아닙니다.

이 오류는 처음부터 `let`을 사용했다면 전혀 발생하지 않았을 것입니다:

    let introductions = [],
        names = ['Karl', 'Friedrich', 'Gauss'];

    for (let i = 0; i < 3; i++) {
      introductions[i] = (soAndSo) =>
        `Hello, ${soAndSo}, my name is ${names[i]}`
    }
    introductions[1]('Raganwald')
      //=> 'Hello, Raganwald, my name is Friedrich'

이 작은 오류는 자주 혼란을 일으켰고, 블록 스코프 `let`이 없던 시절에는 프로그래머들이 이를 피하기 위해 보통 즉시 호출 함수(IIFE)를 사용해야 했습니다:

    var introductions = [],
        names = ['Karl', 'Friedrich', 'Gauss'];

    for (var i = 0; i < 3; i++) {
      ((i) => {
        introductions[i] = (soAndSo) =>
          `Hello, ${soAndSo}, my name is ${names[i]}`
        }
      })(i)
    }
    introductions[1]('Raganwald')
      //=> 'Hello, Raganwald, my name is Friedrich'

이제 우리는 새로운 내부 매개변수 `i`를 생성하고 그것을 외부 `i`의 값으로 바인딩하고 있습니다. 이 방법은 작동하지만, let을 사용하는 것이 훨씬 더 간단하고 깔끔하기 때문에 ECMAScript 2015 사양에 추가되었습니다.

이 책에서는 함수 선언을 드물게 사용할 것이며, `var`는 전혀 사용하지 않을 것입니다. 그러나 그렇다고 해서 여러분이 자신의 코드에서 꼭 같은 방식을 따라야 한다는 것은 아닙니다. 이 책의 목적은 특정 프로그래밍 원칙을 설명하는 것입니다. 여러분의 코드의 목적은 일을 처리하는 것입니다. 두 목표는 종종 일치하지만 항상 그렇지는 않습니다.
