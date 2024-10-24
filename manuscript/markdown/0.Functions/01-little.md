## 함수에 대해 최소한으로, 하지만 부족하지 않게

JavaScript에서 함수는 값이지만, 단순한 숫자나 문자열, 또는 트리나 맵과 같은 복잡한 데이터 구조보다 훨씬 더 많은 것을 의미합니다. 함수는 수행될 연산을 나타냅니다. 숫자, 문자열, 배열처럼 함수도 표현 방식이 있습니다. 두 번째로 단순한 함수부터 시작해보겠습니다.[^simplest] JavaScript에서는 다음과 같이 표현됩니다:

    () => 0
    
이것은 아무 값도 받지 않고 0을 반환하는 함수입니다. 우리의 함수가 다른 값들처럼 하나의 값인지 확인해봅시다:

    (() => 0)
      //=> [Function]
      
뭐라고요!? 왜 () => 0이라고 표시되지 않은 걸까요? 이는 표현식이 값이면 JavaScript가 동일한 값을 반환한다는 우리의 규칙을 깨는 것 같습니다. 무슨 일이 일어난 걸까요? 가장 간단하고 쉬운 답은 JavaScript 인터프리터가 실제로 그 값을 반환하기는 하지만, 화면에 표시하는 것은 약간 다른 문제라는 것입니다. [Function]은 JavaScript REPL을 호스팅하는 JavaScript 환경인 Node.js를 만든 사람들이 선택한 것입니다. 브라우저에서 같은 것을 시도하면 다른 것이 보일 수 있습니다.

[^simplest]: The simplest possible function is `() => {}`, we'll see that later.

{pagebreak}

A> 다른 것이 보이면 좋겠지만, 화면에 표시되는 것은 임의적이며 인간이 읽기에 어느 정도 유용하다는 것이 중요하다는 것을 받아들여야 합니다. 하지만 우리가 [Function]이나 () => 0을 보든 상관없이, JavaScript 내부적으로는 완전하고 적절한 함수를 가지고 있다는 것을 이해해야 합니다.

### 함수와 식별성

값에는 식별성과 관련하여 두 가지 유형이 있다는 것을 기억하실 것입니다: 값 타입과 참조 타입입니다. 값 타입은 내용이 같으면 같은 식별성을 공유합니다. 참조 타입은 그렇지 않습니다.
함수는 어떤 종류일까요? 시도해보고 확인해봅시다. JavaScript 파서를 달래기 위해 함수를 괄호로 감싸겠습니다:

    (() => 0) === (() => 0)
      //=> false
      
배열처럼, 표현식을 평가하여 함수를 생성할 때마다 동일한 표현식을 사용하여 생성하더라도 다른 어떤 함수와도 동일하지 않은 새로운 함수를 얻게 됩니다. "함수"는 참조 타입입니다.

### 함수 적용하기

함수를 사용해봅시다. 함수를 사용하는 방법은 *인수(arguments)*라고 하는 0개 이상의 값에 함수를 적용하는 것입니다. 2 + 2가 값(이 경우 4)을 생성하는 것처럼, 함수를 0개 이상의 인수에 적용하는 것도 값을 생성합니다.

JavaScript에서 함수를 몇 개의 값에 적용하는 방법은 다음과 같습니다: fn_expr이 평가되었을 때 함수를 생성하는 표현식이라고 합시다. 인수들을 args라고 부릅시다. 다음은 함수를 몇 개의 인수에 적용하는 방법입니다:

  *fn_expr*`(`*args*`)`

  

현재 우리가 알고 있는 그런 표현식은 () => 0 하나뿐이므로, 이것을 사용해보겠습니다. 위에서처럼 파서를 달래기 위해 괄호[^ambiguous]로 감싸겠습니다: (() => 0). 인수를 주지 않으므로 표현식 뒤에 ()만 쓰면 됩니다. 따라서 다음과 같이 씁니다:

    (() => 0)()
      //=> 0


[^ambiguous]: If you're used to other programming languages, you've probably internalized the idea that sometimes parentheses are used to group operations in an expression like math, and sometimes to apply a function to arguments. If not... Welcome to the [ALGOL] family of programming languages!

[ALGOL]: https://en.wikipedia.org/wiki/ALGOL

### 값을 반환하고 표현식을 평가하는 함수들

우리는 () => 0을 보았습니다. (() => 0)()가 0을 반환한다는 것을 알고 있고, 이는 놀랍지 않습니다. 마찬가지로, 다음은 모두 명백해야 합니다:

    (() => 1)()
      //=> 1
    (() => "Hello, JavaScript")()
      //=> "Hello, JavaScript"
    (() => Infinity)()
      //=> Infinity

마지막 것은 좀 대단하지만, 여전히 일반적인 아이디어는 이렇습니다: 화살표의 오른쪽에 값을 넣어서 그 값을 반환하는 함수를 만들 수 있습니다.

서문에서 우리는 표현식을 살펴보았습니다. 0과 같은 값들은 표현식이고, 40 + 2와 같은 것들도 표현식입니다. 화살표의 오른쪽에 표현식을 넣을 수 있을까요?

    (() => 1 + 1)()
      //=> 2
    (() => "Hello, " + "JavaScript")()
      //=> "Hello, JavaScript"
    (() => Infinity * Infinity)()
      //=> Infinity

네, 할 수 있습니다. 화살표의 오른쪽에 어떤 표현식이든 넣을 수 있습니다. 예를 들어, (() => 0)()는 표현식입니다. 이것을 화살표의 오른쪽에 넣을 수 있을까요? 이렇게요: () => (() => 0)()?

Let's try it:

    (() => (() => 0)())()
      //=> 0

네, 할 수 있습니다! 함수는 다른 함수를 평가한 값을 반환할 수 있습니다.

같은 문자(괄호와 같은)가 많이 있는 표현식을 다룰 때, 코드를 포맷팅하여 보기 쉽게 만드는 것이 도움이 될 수 있습니다. 따라서 다음과 같이 쓸 수도 있습니다:


    (() =>
        (() => 0
          )()
      )()
      //=> 0

이것은 같은 것, 0으로 평가됩니다.

### 콤마

JavaScript의 콤마 연산자는 흥미롭습니다. 두 개의 인수를 받아서 둘 다 평가하고, 자신은 오른쪽 인수의 값으로 평가됩니다. 다시 말해서:

    (1, 2)
      //=> 2

    (1 + 1, 2 + 2)
      //=> 4

함수에서 콤마를 사용하여 여러 표현식을 평가하는 함수를 만들 수 있습니다:

    (() => (1 + 1, 2 + 2))()
      //=> 4

이것은 *부수 효과*와 관련된 작업을 할 때 유용할 수 있지만, 그것은 나중에 다루겠습니다. 대부분의 경우 JavaScript는 띄어쓰기, 탭, 또는 줄바꿈으로 구분되는 것을 신경 쓰지 않습니다. 따라서 다음과 같이 쓸 수도 있습니다:

    () =>
      (1 + 1, 2 + 2)

Or even:

    () => (
        1 + 1,
        2 + 2
      )


### 가장 단순한 블록

화살표의 오른쪽에 넣을 수 있는 또 다른 것이 있는데, 바로 블록입니다. 블록은 세미콜론으로 구분된 0개 이상의 문장들을 가집니다.[^asi]

[^asi]: 때로는 세미콜론 없이 줄바꿈으로만 구분된 JavaScript 문장들을 볼 수 있습니다. 이것이 작동하는 이유는 JavaScript가 대부분의 경우 세미콜론이 어디에 있어야 하는지 추론할 수 있는 기능을 가지고 있기 때문입니다. 우리는 이 기능을 활용하지는 않을 것이지만, 이것이 존재한다는 것을 아는 것은 도움이 됩니다.

따라서 이것은 유효한 함수입니다:

    () => {}
    
이것은 문장이 없는 블록을 평가한 결과를 반환합니다. 그 결과는 무엇일까요? 시도해봅시다:

    (() => {})()
      //=> undefined

이 undefined는 무엇일까요?

### `undefined`

JavaScript에서 값의 부재는 `undefined`로 표현되며, 이는 값이 없다는 것을 의미합니다. 이것은 다시 나타날 것입니다. `undefined`는 자신만의 타입의 값이며, 값 타입처럼 동작합니다:

    undefined
      //=> undefined

숫자, 불리언, 문자열처럼 JavaScript는 undefined 값을 출력할 수 있습니다.

    undefined === undefined
      //=> true
    (() => {})() === (() => {})()
      //=> true
    (() => {})() === undefined
      //=> true
      
`undefined`를 어떻게 평가하든 동일한 값을 돌려받습니다. `undefined`는 "나는 값을 가지고 있지 않다"는 것을 의미하는 값입니다. 하지만 그래도 여전히 값입니다 :-)
      
A> JavaScript의 undefined가 SQL의 NULL과 동등하다고 생각할 수 있습니다. 아니요. SQL에서는 NULL인 두 가지가 서로 동등하지 않고 같은 식별성을 공유하지 않습니다. 왜냐하면 두 개의 알 수 없는 것은 동등할 수 없기 때문입니다. JavaScript에서는 모든 undefined가 다른 모든 undefined와 동일합니다.

### void

JavaScript가 undefined 값을 undefined라고 표현한다는 것을 보았고, 우리는 두 가지 방법으로 `undefined` 값을 생성했습니다:

1. 값을 반환하지 않는 함수를 평가함으로써 `(() => {})()`, 그리고;
2. `undefined`를 직접 작성함으로써.

세 번째 방법이 있는데, JavaScript의 void 연산자를 사용하는 것입니다. 보세요:

    void 0
      //=> undefined
    void 1
      //=> undefined
    void (2 + 2)
      //=> undefined
      
`void`는 어떤 값이든 받아서 항상 `undefined`로 평가되는 연산자입니다. 그래서, 의도적으로 `undefined` 값이 필요할 때, 첫 번째, 두 번째, 또는 세 번째 형태 중 어떤 것을 사용해야 할까요?[^fourth] 답은, void를 사용하라는 것입니다. 관례적으로 void 0을 사용합니다.

첫 번째 형태는 작동하지만 번거롭습니다. 두 번째 형태는 대부분의 경우 작동하지만, 재할당과 변이에서 논의할 `undefined`를 다른 값으로 재할당함으로써 깨질 수 있습니다. 세 번째 형태는 항상 작동하는 것이 보장되므로, 우리는 이것을 사용할 것입니다[^void]

[^fourth]: 경험 많은 JavaScript 프로그래머들은 함수 인수를 사용하는 네 번째 방법이 있다는 것을 알고 있습니다. 이것은 실제로 void가 일반적이 되기 전까지 선호되던 메커니즘이었습니다

[^void]: 독자를 위한 연습으로, 여러분의 친근한 이웃 프로그래밍 언어 설계자나 인간 요소 전문가에게 왜 void라고 불리는 키워드가 undefined 값을 생성하는 데 사용되는지, 둘 다 void나 둘 다 undefined로 부르지 않는 이유를 설명해달라고 요청해보세요. 우리도 모릅니다.

### 블록으로 돌아가서

우리의 함수로 돌아갑시다. 우리는 이것을 평가했습니다:

    (() => {})()
      //=> undefined

우리는 함수가 블록을 평가한 결과를 반환한다고 말했고, 블록이 세미콜론으로 구분된 JavaScript 문장의 (비어 있을 수도 있는) 목록이라고 말했습니다.[^break]

[^break]: 문장들을 줄바꿈으로 구분할 수도 있습니다. 인터넷 논쟁을 따라가는 독자들은 자동 세미콜론 삽입이라는 것을 알고 있을 것입니다. 기본적으로, JavaScript가 여러분의 코드를 보고 여러분이 세미콜론을 생략한 경우 어디에 세미콜론을 넣으려고 했는지 추측하는 규칙을 따르는 단계가 있습니다. 이 기능은 원래 일종의 도움이 되는 오류 수정으로 만들어졌습니다. 일부 프로그래머들은 이것이 언어 정의의 일부이므로 이를 활용하는 코드를 작성하는 것이 공정한 게임이라고 주장하므로, JavaScript가 그들을 위해 삽입할 세미콜론을 의도적으로 생략합니다

다음과 같이요:  `{` statement^1^`;` statement^2^`;` statement^3^`; ... ;` statement^n^ `}`

우리는 이 *문장*들에 대해 논의하지 않았습니다. 문장이란 무엇일까요?

[^todonamed]: TODO: Named functions, probably discussed in a whole new section when we discuss `var` hoisting.

JavaScript 문장에는 여러 종류가 있지만, 첫 번째 종류는 우리가 이미 만난 것입니다. 표현식은 JavaScript 문장입니다. 그다지 실용적이지는 않지만, 다음은 유효한 JavaScript 함수들이며, 적용했을 때 `undefined`를 반환합니다:

    () => { 2 + 2 }
    () => { 1 + 1; 2 + 2 }
    
위에서 콤마로 본 것처럼, 더 읽기 쉽다고 생각될 때 이러한 함수들을 여러 줄로 재배열할 수 있습니다:

    () => {
        1 + 1;
        2 + 2
      }

하지만 어떻게 배열하든, 하나 이상의 표현식이 있는 블록은 여전히 `undefined`로 평가됩니다:

    (() => { 2 + 2 })()
      //=> undefined
      
    (() => { 1 + 1; 2 + 2 })()
      //=> undefined
      
    (() => {
        1 + 1;
        2 + 2
      })()
      //=> undefined

보시다시피, 하나의 표현식이 있는 블록은 표현식처럼 동작하지 않으며, 하나 이상의 표현식이 있는 블록은 콤마 연산자로 구성된 표현식처럼 동작하지 않습니다:

    (() => 2 + 2)()
      //=> 4
    (() => { 2 + 2 })()
      //=> undefined
      
    (() => (1 + 1, 2 + 2))()
      //=> 4
    (() => { 1 + 1; 2 + 2 })()
      //=> undefined

그렇다면 블록을 평가하는 함수가 적용되었을 때 값을 반환하게 하려면 어떻게 해야 할까요? `return` 키워드와 아무 표현식을 사용하면 됩니다:

    (() => { return 0 })()
      //=> 0
      
    (() => { return 1 })()
      //=> 1
      
    (() => { return 'Hello ' + 'World' })()
      // 'Hello World'

`return` 키워드는 함수 적용을 즉시 종료하고 그 표현식을 평가한 결과를 반환하는 return 문을 만듭니다. 예를 들어:

    (() => {
        1 + 1;
        return 2 + 2
      })()
      //=> 4

그리고 또한:
      
    (() => {
        return 1 + 1;
        2 + 2
      })()
      //=> 2

return 문은 우리가 본 첫 번째 문장이며, 표현식과는 다르게 동작합니다. 예를 들어, 표현식이 아니기 때문에 단순한 함수의 표현식으로 사용할 수 없습니다:


    (() => return 0)()
      //=> ERROR

문장들은 블록 안에, 그리고 블록 안에만 속합니다. 일부 언어들은 모든 것을 표현식으로 만들어 이를 단순화하지만, JavaScript는 이 구분을 유지하므로, JavaScript를 배울 때 함수 선언, for 루프, if 문 등과 같은 문장들에 대해서도 배우게 됩니다. 이것들 중 몇 가지는 나중에 보게 될 것입니다.

### 함수로 평가되는 함수들

함수로 평가되는 표현식이 표현식이고, return 문이 오른쪽에 어떤 표현식이든 가질 수 있다면...  *함수로 평가되는 표현식을 함수 표현식의 오른쪽에 넣을 수 있을까요?*

Yes:

    () => () => 0
    
이것은 함수입니다! 적용되었을 때 적용되면 0으로 평가되는 함수로 평가되는 함수입니다. 따라서 우리는 *0을 반환하는 함수를 반환하는 함수*를 가지고 있습니다. 마찬가지로:

    () => () => true
    
이것은 true를 반환하는 함수를 반환하는 함수입니다:

    (() => () => true)()()
      //=> true
      
물론 원한다면 블록을 사용해서 같은 일을 할 수 있습니다:

    () => () => { return true; }

하지만 일반적으로 그렇게 하지 않습니다.

---

음. 우리는 매우 영리했지만, 지금까지는 이 모든 것이 매우 추상적으로 보입니다. 결정의 회절은 그 자체로 아름답고 흥미롭지만, 수백만 광년 떨어진 별의 구성을 결정할 수 있는 것과 같은 실용적인 용도를 보여달라고 해도 우리를 탓할 수는 없습니다. 그래서... 다음 장인 "논쟁을 하고 싶습니다"에서 우리는 함수를 실용적으로 만드는 방법을 보게 될 것입니다.