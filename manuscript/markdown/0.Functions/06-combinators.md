## Combinators and Function Decorators {#combinators}

### 고차 함수

우리가 봤듯이, JavaScript 함수는 값을 인자로 받고 값을 반환합니다. JavaScript 함수는 값이기 때문에, JavaScript 함수는 함수를 인자로 받거나, 함수를 반환하거나, 또는 둘 다 할 수 있습니다. 일반적으로, 함수를 인자로 받거나 함수를 반환하거나, 또는 둘 다 하는 함수를 "고차" 함수라고 합니다.

다음은 함수를 인자로 받는 매우 간단한 고차 함수입니다:

    const repeat = (num, fn) =>
      (num > 0)
        ? (repeat(num - 1, fn), fn(num))
        : undefined

    repeat(3, function (n) {
      console.log(`Hello ${n}`)
    })
      //=>
        'Hello 1'
        'Hello 2'
        'Hello 3'
        undefined

고차 함수는 JavaScript Allongé를 지배합니다. 하지만 계속 진행하기 전에, 특정 유형의 고차 함수들에 대해 이야기해보겠습니다.

### combinators

"컴비네이터"라는 단어는 수학에서 정확한 기술적 의미를 가지고 있습니다:

> "컴비네이터는 함수 응용과 이전에 정의된 컴비네이터만을 사용하여 인자로부터 결과를 정의하는 고차 함수입니다."--[Wikipedia][combinators]

[combinators]: https://en.wikipedia.org/wiki/Combinatory_logic "Combinatory Logic"

만약 우리가 조합 논리를 배운다면, 가장 기본적인 컴비네이터인 `S`, `K`, `I`부터 시작하여 실용적인 컴비네이터로 발전시켜 나갈 것입니다. Raymond Smullyan의 유명한 책 To Mock a Mockingbird[mock]의 예시를 따라 기본 컴비네이터들이 새의 이름을 따서 명명되었다는 것을 배우게 될 것입니다.

[mock]: http://www.amazon.com/gp/product/B00A1P096Y/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=B00A1P096Y&linkCode=as2&tag=raganwald001-20

이 책에서는 "컴비네이터"의 더 느슨한 정의를 사용할 것입니다: 함수만을 인자로 받고 함수를 반환하는 고차 순수 함수입니다. 우리는 구현에 있어 이전에 정의된 컴비네이터만을 사용하는 것에 대해 엄격하지 않을 것입니다.

유용한 컴비네이터부터 시작해보겠습니다: 대부분의 프로그래머들은 이것을 Compose라고 부르지만, 논리학자들은 이를 B 컴비네이터 또는 "Bluebird"라고 부릅니다. 다음은 일반적인 프로그래밍[^bluebird] 구현입니다:

[^bluebird]: 나중에 논의하겠지만, B 컴비네이터의 이러한 구현은 Scheme과 같은 언어에서는 올바르지만, JavaScript에서 진정으로 범용적으로 사용하기 위해서는 함수 컨텍스트를 올바르게 관리해야 합니다.   

```
  const compose = (a, b) =>
      (c) => a(b(c))
```

다음과 같은 함수가 있다고 가정해봅시다:

    const addOne = (number) => number + 1;

    const doubleOf = (number) => number * 2;

`compose`를 사용하면, 다음과 같이 작성하는 대신:

    const doubleOfAddOne = (number) => doubleOf(addOne(number));

다음과 같이 작성할 수 있습니다:

    const doubleOfAddOne = compose(doubleOf, addOne);

이것은 물론 많은 예시 중 하나일 뿐입니다. 이 책의 레시피들을 살펴보면 더 많은 예시를 찾을 수 있습니다. 일부 프로그래머들은 "한 가지 일을 하는 방법은 하나여야 한다"고 믿지만, 적절하게 사용된다면 많은 기호와 키워드를 명시적으로 작성하는 것과 함께 컴비네이터를 사용할 수 있다는 것은 몇 가지 장점이 있습니다.

### 컴비네이터에 대한 균형 잡힌 설명

많은 컴비네이터를 사용하는 코드는 동사와 부사(`doubleOf`, `addOne`, `compose`와 같은)에 이름을 붙이는 경향이 있으며, 언어 키워드와 명사의 이름(`number`와 같은)은 피하는 경향이 있습니다. 따라서 한 관점에서 보면, 컴비네이터는 무엇을 하는지와 그것이 어떻게 맞춰지는지를 강조하고 싶을 때 유용하며, 더 명시적인 코드는 무엇을 가지고 작업하는지를 강조하고 싶을 때 유용합니다.

### 함수 데코레이터{#decorators}

*함수 데코레이터*는 하나의 함수를 인자로 받아 다른 함수를 반환하는 고차 함수이며, 반환된 함수는 인자로 받은 함수의 변형입니다. 다음은 매우 단순한 데코레이터입니다:[^variadic]

    const not = (fn) => (x) => !fn(x)

[^variadic]: 나중에 더 유용한 버전이 왜 (fn) => (...args) => !fn(...args)로 작성되어야 하는지 살펴볼 것입니다 ↩

따라서 `!someFunction(42)`를 작성하는 대신, `not(someFunction)(42)`를 작성할 수 있습니다. 별로 진전된 것 같지 않습니다. 하지만 `compose`처럼, 다음과 같이 작성할 수 있습니다:

    const something = (x) => x != null;

그리고 다른 곳에서 다음과 같이 작성할 수 있습니다:

    const nothing = (x) => !something(x);

또는 다음과 같이 작성할 수 있습니다:

    const nothing = not(something);

not은 함수 데코레이터입니다. 왜냐하면 원래 함수의 의미와 강하게 연관되어 있으면서 함수를 수정하기 때문입니다. 레시피에서 once와 maybe와 같은 다른 함수 데코레이터들을 보게 될 것입니다. 함수 데코레이터는 순수 함수여야 한다는 점에서 엄격하지 않기 때문에, 컴비네이터보다 데코레이터를 만드는 데 더 많은 자유도가 있습니다.

[^bluebird]: As we'll discuss later, this implementation of the B Combinator is correct in languages like Scheme, but for truly general-purpose use in JavaScript, it needs to correctly manage the [function context](#context).
