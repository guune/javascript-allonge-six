## 빌딩 블록 {#buildingblocks}

WhJavaScript에서 함수 안의 함수들을 보면 약간 "스파게티 코드"처럼 보입니다. JavaScript의 강점은 무엇이든 할 수 있다는 것입니다. 약점은 실제로 그렇게 한다는 것이죠. if문, for문, return문 등 모든 것이 뒤죽박죽 뒤섞여 있습니다. 몇 가지 간단한 패턴으로 자신을 제한할 필요는 없지만, 이러한 패턴들을 이해하면 기본 빌딩 블록을 중심으로 코드를 구조화하는 데 도움이 될 수 있습니다.

### composition

이러한 빌딩 블록 중 가장 기본적인 것 중 하나는 *합성*입니다:

    const cookAndEat = (food) => eat(cook(food));
    
정말 이렇게 간단합니다: 두 개 이상의 함수를 연결할 때마다 합성하는 것입니다. 방금 했던 것처럼 명시적인 JavaScript 코드로 합성할 수 있습니다. 조합자와 데코레이터에서 보았던 B 조합자 또는 "compose"로 합성을 일반화할 수도 있습니다:

    const compose = (a, b) => (c) => a(b(c));

    const cookAndEat = compose(eat, cook);
    
만약 이것이 전부라면 합성은 그다지 중요하지 않을 것입니다. 하지만 다른 많은 패턴들처럼, 적용 가능할 때 사용하는 것은 이점의 20%에 불과합니다. 나머지 80%는 사용할 수 있도록 코드를 구성하는 것에서 옵니다: 다양한 방식으로 합성될 수 있는 함수들을 작성하는 것이죠.

레시피에서 우리는 once라는 데코레이터를 살펴볼 것입니다: 이것은 함수가 단 한 번만 실행되도록 보장합니다. 그 이후에는 아무것도 하지 않습니다. Once는 특정 부작용이 반복되지 않도록 보장하는 데 유용합니다. 우리는 또한 maybe를 살펴볼 것입니다: 이것은 함수에 아무것도 (`null`이나 `undefined` 같은) 주어지지 않았을 때 아무것도 하지 않도록 보장합니다.

물론 이러한 아이디어들을 구현하기 위해 조합자를 사용할 필요는 없으며, if문을 사용할 수 있습니다. 하지만 `once`와 `maybe`는 합성이 가능하므로 원하는 대로 연결할 수 있습니다:

    const actuallyTransfer= (from, to, amount) =>
      // do something
    
    const invokeTransfer = once(maybe(actuallyTransfer(...)));
    
### partial application

또 다른 기본 빌딩 블록은 *부분 적용*입니다. 함수가 여러 인자를 받을 때, 모든 인자로 평가하여 값을 생성함으로써 함수를 인자에 "적용"합니다. 하지만 일부 인자만 제공하면 어떻게 될까요? 그런 경우, 최종 값을 얻을 수는 없지만 우리 애플리케이션의 일부를 나타내는 함수를 얻을 수 있습니다.

이를 설명하기엔 코드가 말보다 더 쉽습니다. Underscore 라이브러리는 *map*이라는 고차 함수를 제공합니다.[^headache] 이는 배열의 각 요소에 다른 함수를 적용하는데, 이렇게 합니다:

    _.map([1, 2, 3], (n) => n * n)
      //=> [1, 4, 9]

우리는 _.를 쓰는 것을 원치 않으므로, 이렇게 사용할 수 있습니다:[^_map]

    const map = _.map;
      
이 코드는 두 번째 인자로 함수 `(n) => n * n`를 적용하여 map 함수의 부분 적용을 구현합니다:

    const squareAll = (array) => map(array,  (n) => n * n);

결과로 나온 함수 `squareAll`은 여전히 map 함수입니다. 단지 두 인자 중 하나를 이미 적용한 것뿐입니다. `squareAll`은 좋지만, map에 함수를 부분 적용하고 싶을 때마다 함수를 하나씩 작성하는 게 좋을까요? 한 단계 더 추상화할 수 있습니다. `mapWith`는 어떤 함수든 인자로 받아 부분 적용된 map 함수를 반환합니다.

    const mapWith = (fn) =>
      (array) => map(array, fn);
    
    const squareAll = mapWith((n) => n * n);
    
    squareAll([1, 2, 3])
      //=> [1, 4, 9]

`mapWith`에 대해서는 나중에 다시 논의하겠습니다. 중요한 점은 부분 적용이 합성과 직교한다는 것이며, 둘 다 잘 어우러진다는 것입니다:

    const safeSquareAll = mapWith(maybe((n) => n * n));
    
    safeSquareAll([1, null, 2, 3])
      //=> [1, null, 4, 9]

우리는 `compose` 조합자로 합성을 일반화했습니다. 부분 적용 또한 조합자가 있는데, 이는 partial 레시피에서 살펴볼 것입니다.

[^bind]: Modern JavaScript provides a limited form of partial application through the `Function.prototype.bind` method. This will be discussed in greater length when we look at function contexts.

[^headache]: 현대 JavaScript 구현체들은 배열에 대한 map 메서드를 제공하지만, Underscore의 구현은 그런 골치거리를 다루는 구형 브라우저에서도 작동합니다. 

[^_map]: Underscore를 정리하고 싶지 않다면, 다음과 같이 작성할 수도 있습니다: const map = (a, fn) => a.map(fn); 아직 메서드를 논의하지 않았지만 이것이 작동한다고 믿으면 됩니다. ↩

[Underscore]: http://underscorejs.org
