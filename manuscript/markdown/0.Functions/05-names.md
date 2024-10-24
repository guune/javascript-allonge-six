## 함수 이름 짓기 {#named-function-expressions}

바로 시작해보겠습니다. 다음 코드는 함수에 이름을 부여하지 않습니다:

    const repeat = (str) => str + str

이는 `const answer = 42`가 숫자 `42`에 이름을 부여하지 않는 것과 같은 이유입니다. 이 구문은 익명 함수를 환경의 이름에 바인딩할 뿐, 함수 자체는 익명으로 남습니다.

### `function` 키워드

JavaScript에는 함수에 이름을 부여하는 구문이 있는데, 바로 `function` 키워드를 사용하는 것입니다. ECMAScript 2015가 만들어지기 전까지는 `function`이 함수를 작성하는 일반적인 구문이었습니다.

다음은 "화살표 함수"로 작성된 `repeat` 함수입니다:

    (str) => str + str

그리고 다음은 function 키워드를 사용한 (거의) 동일한 함수입니다:

    function (str) { return str + str }

명백한 차이점들을 살펴보겠습니다:

1. function 키워드로 함수를 소개합니다.
2. 곧 논의할 다른 무언가가 선택사항입니다.
3. 화살표 함수와 마찬가지로 괄호 안에 인수를 넣습니다.
4. 화살표를 사용하지 않고 바로 본문으로 이동합니다.
5. 항상 블록을 사용해야 하며, function (str) str + str와 같이 작성할 수 없습니다. 즉, 함수가 값을 반환하기를 원한다면 항상 return 키워드를 사용해야 합니다.

function 키워드 뒤에 오는 "선택적인 무언가"를 제외하면, 우리가 본 모든 화살표 함수를 function 키워드 함수로 변환할 수 있습니다. 예를 들어:

    (n) => (1.618**n - -1.618**-n) / 2.236

다음과 같이 작성할 수 있습니다:

    function (n) {
      return (1.618**n - -1.618**-n) / 2.236;
    }

이것도 여전히 함수에 *이름*을 부여하지 않지만, 위에서 언급했듯이 function 키워드로 작성된 함수에는 선택적인 "다른 무언가"가 있습니다. 그 "다른 무언가"가 함수에 이름을 부여할 수 있을까요? 네, 물론입니다.[^ofcourse]

[^ofcourse]: "물론이죠?" 함수 이름 짓기를 다루는 책의 한 장에서, 우리가 언급하는 기능이 함수 이름 짓기와 관련이 있다는 것은 전혀 놀랍지 않습니다. ↩

다음은 이름이 부여된 예제 함수들입니다:

    const repeat = function repeat (str) {
      return str + str;
    };

    const fib = function fib (n) {
      return (1.618**n - -1.618**-n) / 2.236;
    };

`function` 키워드와 인수 목록 사이에 이름을 넣으면 함수에 이름이 부여됩니다. 혼란스럽게도, 함수의 이름은 함수 값을 바인딩하기 위해 선택할 수 있는 이름과 정확히 같은 것이 아닙니다. 예를 들어:

    const double = function repeat (str) {
      return str + str;
    }

이 표현식에서 `double`은 환경의 이름이지만, `repeat`은 함수의 실제 이름입니다. 이것을 기명 함수 표현식이라고 합니다. 혼란스러울 수 있지만, 바인딩 이름을 함수의 속성이 아닌 환경의 속성으로 생각하세요. 반면 함수의 이름은 환경의 속성이 아닌 함수의 속성입니다.

그리고 실제로 이름은 속성입니다:

    double.name
      //=> 'repeat'

이 책에서는 브라우저에 내장된 디버거와 같은 JavaScript 도구를 살펴보지는 않지만, 모든 현대 도구에서 콜 스택을 탐색할 때 함수의 바인딩 이름은 무시되고 실제 이름이 표시된다는 점을 언급하겠습니다. 따라서 함수에 공식적인 바인딩이 없더라도 이름을 부여하는 것이 매우 유용합니다. 예를 들어:

    someBackboneView.on('click', function clickHandler () {
      //...
    });

이제, 함수의 실제 이름은 사용되는 환경에 아무런 영향을 미치지 않습니다. 예를 들어:

    const bindingName = function actualName () {
      //...
    };

    bindingName
      //=> [Function: actualName]

    actualName
      //=> ReferenceError: actualName is not defined

따라서 "actualName"은 기명 함수 표현식을 사용하는 환경에 바인딩되어 있지 않습니다. 다른 곳에 바인딩되어 있을까요? 네, 그렇습니다. 다음은 양의 정수가 짝수인지 판단하는 함수입니다. `const`로 이름에 바인딩할 필요가 없도록 IIFE로 사용해보겠습니다:

    (function even (n) {
      if (n === 0) {
        return true
      }
      else return !even(n - 1)
    })(5)
      //=> false

    (function even (n) {
      if (n === 0) {
        return true
      }
      else return !even(n - 1)
    })(2)
      //=> true

분명히 `even`이라는 이름은 함수의 본문 내부에서 함수에 바인딩되어 있습니다. 함수 본문 외부에서도 함수에 바인딩되어 있을까요?

    even
      //=> Can't find variable: even

`even`은 함수 자체 내에서는 바인딩되어 있지만 외부에서는 그렇지 않습니다. 이는 위에서 본 것처럼 재귀 함수를 만드는 데 유용하며, 최소 권한의 원칙을 말해줍니다: 다른 곳에서 이름을 지정할 *필요*가 없다면, 그럴 필요가 없습니다.

### 함수 선언문 {#function-declarations}

함수를 이름 짓거나 정의하는 또 다른 구문이 있습니다. 이를 *함수 선언문*이라고 하며, 기명 함수 표현식과 매우 비슷하지만 문장으로 사용합니다:

    function someName () {
      // ...
    }

이는 다음과 *약간* 비슷하게 동작합니다:

    const someName = function someName () {
      // ...
    }

환경에서 이름을 기명 함수에 바인딩한다는 점에서는 비슷합니다. 하지만 두 가지 중요한 차이점이 있습니다. 첫째, 함수 선언문은 그것이 발생하는 함수의 맨 위로 *호이스팅*됩니다.

`const`로 함수를 바인딩하기 전에 `fizzbuzz`라는 변수를 함수로 사용하려고 하는 다음 예제를 살펴보겠습니다:

    (function () {
      return fizzbuzz();

      const fizzbuzz = function fizzbuzz () {
        return "Fizz" + "Buzz";
      }
    })()
      //=> undefined is not a function (evaluating 'fizzbuzz()')

사용하기 전에 실제로 `fizzbuzz`라는 이름에 함수를 바인딩하지 않았기 때문에 에러가 발생합니다. 하지만 *함수 선언문*은 다르게 작동합니다:

    (function () {
      return fizzbuzz();

      function fizzbuzz () {
        return "Fizz" + "Buzz";
      }
    })()
      //=> 'FizzBuzz'

`fizzbuzz`가 함수의 뒷부분에서 선언되었지만, JavaScript는 마치 다음과 같이 작성한 것처럼 동작합니다:

    (function () {
      const fizzbuzz = function fizzbuzz () {
        return "Fizz" + "Buzz";
      }

      return fizzbuzz();
    })()

`fizzbuzz`의 정의가 그것을 둘러싸고 있는 스코프(이 경우에는 IIFE)의 맨 위로 "호이스팅"됩니다. 이 동작은 주요 로직을 앞에 두고 "헬퍼 함수"를 아래에 두는 특정 프로그래밍 스타일을 용이하게 하기 위한 JavaScript 설계의 의도적인 부분입니다. JavaScript에서 이러한 방식으로 함수를 선언할 필요는 없지만, 이 구문과 그 동작을 이해하는 것(`const`와 다른 방식 특히)은 프로덕션 코드를 다루는 데 필수적입니다.

### 함수 선언문의 주의사항[^caveats]

함수 선언문은 공식적으로 함수의 "최상위 레벨"이라고 부를 수 있는 곳에서만 이루어져야 합니다. 일부 JavaScript 환경에서는 다음 코드를 허용하지만, 이 예제는 기술적으로 불법이며 확실히 나쁜 아이디어입니다:

    (function (camelCase) {
      return fizzbuzz();

      if (camelCase) {
        function fizzbuzz () {
          return "Fizz" + "Buzz";
        }
      }
      else {
        function fizzbuzz () {
          return "Fizz" + "Buzz";
        }
      }
    })(true)
      //=> 'FizzBuzz'? Or ERROR: Can't find variable: fizzbuzz?

함수 선언문은 블록 내부에서 발생해서는 안 됩니다. 이러한 표현식의 큰 문제는 테스트 환경에서는 잘 작동할 수 있지만 프로덕션에서는 다르게 작동할 수 있다는 것입니다. 또는 오늘은 한 가지 방식으로 작동하다가 새로운 최적화와 같이 JavaScript 엔진이 업데이트될 때 다른 방식으로 작동할 수 있습니다.

또 다른 주의사항은 함수 선언문이 어떤 표현식 내부에도 존재할 수 없다는 것입니다. 그렇지 않으면 그것은 함수 표현식이 됩니다. 따라서 다음은 함수 선언문입니다:

    function trueDat () { return true }

하지만 이것은 아닙니다:

    (function trueDat () { return true })

괄호가 이것을 함수 선언문이 아닌 표현식으로 만듭니다.

[^caveats]: 여기서 논의된 여러 주의사항들은 Jyrly Zaytsev의 훌륭한 글 [Named function expressions demystified](http://kangax.github.com/nfe/) 에서 설명되었습니다
