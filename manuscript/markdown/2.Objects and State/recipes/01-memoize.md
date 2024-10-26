## 메모이제이션 {#memoize}

전통적인 인터뷰 질문인 재귀적 피보나치 함수를 작성하는 것을 고려해 봅시다(물론 피보나치 수를 구하는 다른 방법도 있습니다). 다음은 이름 있는 함수 표현식을 사용하지 않은 구현입니다. 그 생략의 이유는 나중에 설명하겠습니다:

```js
      const fibonacci = (n) =>
        n < 2
          ? n
          : fibonacci(n-2) + fibonacci(n-1);
          
      [0,1,2,3,4,5,6,7,8].map(fibonacci)
        //=> [0,1,1,2,3,5,8,13,21]
```

이제 실행 시간을 측정해 보겠습니다:


    s = (new Date()).getTime()
    fibonacci(45)
    ( (new Date()).getTime() - s ) / 1000
      //=> 15.194
      
왜 이렇게 느릴까요? 잘못된 점은 같은 결과를 계속 재계산하는 나쁜 습관 때문입니다. 이를 피하기 위해 계산을 재배치할 수도 있지만, 여기서는 시간을 거래하여 공간을 확보하는 방법을 선택하겠습니다. 우리가 하려는 것은 조회 테이블을 사용하는 것입니다. 결과가 필요할 때마다 테이블에서 찾아보고, 없으면 계산하여 결과를 테이블에 기록해 두고, 있으면 재계산하지 않고 결과를 반환하는 것입니다.

다음은 우리의 레시피입니다:

```js
    const memoized = (fn) => {
      const lookupTable = {};
        
      return function (...args) {
        const key = JSON.stringify(this, args);
      
        return lookupTable[key] || (lookupTable[key] = fn.apply(this, args));
      }
    }
```

`memoized`를 함수에 적용하면 그 결과로 같은 값을 두 번 재계산할 필요가 없는 새로운 "메모이즈"된 함수가 생성됩니다. 이는 "항등적"인 함수에만 작동하는데, 즉 동일한 인수에 대해 항상 같은 결과를 반환하는 함수입니다. 예를 들어 `fibonacci`와 같은 함수입니다:


Let's try it:

```js
    const fastFibonacci = memoized(
      (n) =>
        n < 2
          ? n
          : fastFibonacci(n-2) + fastFibonacci(n-1)
    );

    fastFibonacci(45)
      //=> 1134903170
```

결과를 즉시 얻을 수 있습니다. 잘 작동합니다! 메모이즈는 모든 종류의 "항등적" 순수 함수에 사용할 수 있습니다. 기본적으로는 JavaScript의 표준 라이브러리 함수로 JSON으로 변환할 수 있는 인수를 사용하는 함수에 작동합니다.

인수를 문자열 키로 변환하는 다른 전략이 있다면, 선택적인 `keymaker` 함수를 제공할 수 있는 버전을 만들어야 합니다:

```js
    const memoized = (fn, keymaker = JSON.stringify) => {
      const lookupTable = {};
        
      return function (...args) {
        const key = keymaker.apply(this, args);
      
        return lookupTable[key] || (lookupTable[key] = fn.apply(this, args));
      }
    }
```

### 재귀 함수 메모이제이션

우리는 의도적으로 재귀 함수를 메모이즈하기로 선택했는데, 이는 이름 있는 함수 표현식과 장식자를 결합할 때의 함정을 보여줍니다. 이름 있는 함수 표현식을 사용하는 구현을 고려해 보겠습니다:

```js
    var fibonacci = function fibonacci (n) {
      if (n < 2) {
        return n
      }
      else {
        return fibonacci(n-2) + fibonacci(n-1)
      }
    }
```

이것을 메모이즈하려고 하면 예상한 속도 향상을 얻지 못합니다:

```js
    var fibonacci = memoized( function fibonacci (n) {
      if (n < 2) {
        return n
      }
      else {
        return fibonacci(n-2) + fibonacci(n-1)
      }
    });
```

그 이유는 외부 환경에서 이름 `fibonacci`에 바인딩된 함수가 메모이즈되었지만, 이름 있는 함수 표현식은 이름 `fibonacci`를 메모이즈되지 않은 함수 내부에 바인딩하므로 재귀 호출이 절대 메모이즈되지 않기 때문입니다. 따라서 우리는 다음과 같이 작성해야 합니다:


```js
    var fibonacci = memoized( function (n) {
      if (n < 2) {
        return n
      }
      else {
        return fibonacci(n-2) + fibonacci(n-1)
      }
    });
```

함수가 재바인딩되는 것을 방지하려면 모듈 패턴을 사용해야 합니다.

