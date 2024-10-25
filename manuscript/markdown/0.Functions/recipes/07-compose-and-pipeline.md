## Compose and Pipeline

다음은 [Combinators and Decorators](#combinators)에서 보았던 B 콤비네이터, 즉 '컴포지트'입니다:

    const compose = (a, b) =>
      (c) => a(b(c))

앞서 본 것처럼, 다음과 같은 함수가 있을 때:

    const addOne = (number) => number + 1;

    const doubleOf = (number) => number * 2;

다음과 같이 작성하는 대신:

    const doubleOfAddOne = (number) => doubleOf(addOne(number));

이렇게 작성할 수 있습니다:

    const doubleOfAddOne = compose(doubleOf, addOne);

### variadic compose and recursion

만약 `compose3`를 구현하고 싶다면 다음과 같이 작성할 수 있습니다:

    const compose3 = (a, b, c) => (d) =>
      a(b(c(d)))

또는 실제로는 다음과 같다는 것을 알 수 있습니다:

    const compose3 = (a, b, c) => compose(a, (compose(b, c)))

일단 `compose4`에 도달하면 더 나은 방법이 있는지 스스로에게 물어봅니다. 예를 들어, `*variadic* compose`가 있다면 `compose(a, b)`, `compose(a, b, c)` 또는 `compose(a, b, c, d)`를 작성할 수 있습니다.

재귀적으로 다양한 `compose`를 구현할 수 있습니다. 재귀적 `compose`를 작성하는 가장 쉬운 방법은 가장 작은 케이스 또는 *퇴화* 케이스부터 시작하는 것입니다. 만약 `compose`가 인자를 하나만 받는다면 다음과 같이 보일 것입니다:

    const compose = (a) => a

다음으로 문제의 일부를 분리하는 방법이 필요합니다. 가변 인자 함수로 이를 할 수 있습니다:

    const compose = (a, ...rest) =>
      "to be determined"

퇴화된 경우인지 테스트할 수 있습니다:

    const compose = (a, ...rest) =>
      rest.length === 0
        ? a
        : "to be determined"

퇴행적인 경우가 아니라면, 나머지 부분에 대한 해결책과 우리가 가진 것을 결합해야 합니다. 즉, `fn`과 `compose(...rest)`를 결합해야 합니다. 어떻게 할까요? 컴포즈(a, b)`를 생각해 봅시다. 우리는 `compose(b)`가 퇴화된 경우이며, 그냥 `b`라는 것을 알고 있습니다. 그리고 `compose(a, b)`는 `(c) => a(b(c))`라는 것을 알고 있습니다.

따라서 `b`를 `compose(b)`로 대체해 봅시다:

    compose(a, compose(b)) === (c) => a(compose(b)(c))

이제 `b`를 `...rest`로 대체합니다:

    compose(a, compose(...rest)) === (c) => a(compose(...rest)(c))

이것이 우리의 해결책입니다:

    const compose = (a, ...rest) =>
      rest.length === 0
        ? a
        : (c) => a(compose(...rest)(c))

물론 다른 방법도 있습니다. compose`는 다음과 같이 반복이나 '.reduce`로 구현할 수 있습니다:

    const compose = (...fns) =>
      (value) =>
        fns.reverse().reduce((acc, fn) => fn(acc), value);

하지만 일련의 함수를 합쳐서 새로운 함수를 만든다는 기본 동작은 동일합니다. 더 작은 단일 목적 함수를 작성하여 다양한 방식으로 조합할 수 있다는 점도 동일합니다.

### compose의 의

'compose'를 사용하면 일반적으로 새로운 함수를 만들게 됩니다. 완벽하게 잘 작동하지만, 결과 `8`을 얻기 위해 `compose(double, addOne)(3)`과 같은 것을 인라인으로 작성할 필요는 없습니다. double(addOne(3))`을 작성하는 것이 더 쉽고 명확합니다.

반면에 메서드 데코레이터와 같은 것으로 작업할 때는 이렇게 작성하는 것이 도움이 될 수 있습니다:

    const setter = compose(fluent, maybe);

    // ...

    SomeClass.prototype.setUser = setter(function (user) {
      this.user = user;
    });

    SomeClass.prototype.setPrivileges = setter(function (privileges) {
      this.privileges = privileges;
    });

이렇게 하면 `setter`가 장식하는 각 메서드에 `fluent`와 `maybe`의 동작을 모두 추가한다는 것을 명확히 알 수 있으며, `const setter = compose(fluent, maybe);`보다 읽기가 더 쉬울 때도 있습니다:

    const setter = (fn) => fluent(maybe(fn));

요점은 기존 함수의 효과를 결합하는 새로운 함수를 정의할 때 `compose`가 유용하다는 것입니다.

### pipeline {#pipeline}

컴포지트`는 매우 편리하지만, 한 가지 전달이 잘 되지 않는 것이 연산 순서입니다. 컴포즈`가 그렇게 작성된 이유는 자바스크립트 및 대부분의 다른 언어에서 함수를 명시적으로 작성하는 방식과 일치하기 때문입니다: a(b(...))를 작성하면 `b` 다음에 `a`가 발생합니다.

때로는 “값은 a를 거쳐 b로 흐른다”와 같이 데이터 흐름 순서대로 함수를 작성하는 것이 더 합리적일 수 있습니다. 이를 위해 '파이프라인' 함수를 사용할 수 있습니다:

    const pipeline = (...fns) =>
      (value) =>
        fns.reduce((acc, fn) => fn(acc), value);

    const setter = pipeline(addOne, double);

파이프라인`과 `컴포지트`를 비교하면, 파이프라인은 “숫자에 1을 더한 다음 두 배로 만듭니다.”라고 말합니다. Compose는 “숫자에 1을 더한 결과를 두 배로 늘립니다.”라고 말합니다. 둘 다 같은 작업을 수행하지만 의도를 반대되는 방식으로 전달합니다.

![Saltspring Island Roasting Facility](../../../images/saltspring/rollers.jpg)
