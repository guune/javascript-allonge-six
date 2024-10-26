## 배열과 매개변수 분해 {#arraysanddestructuring}

우리는 배열에 대해 간단히 언급했지만, 자세히 살펴보지는 않았습니다. 배열은 JavaScript에서 리스트를 표현하는 "기본" 방식입니다. 문자열이 글쓰기를 표현하기 때문에 중요한 것처럼, 리스트는 순서가 있는 것들의 모음을 표현하기 때문에 중요합니다. 그리고 순서가 있는 모음은 현실을 이해하기 위한 기본적인 추상화입니다.

### 배열 리터럴

JavaScript에는 배열을 생성하기 위한 리터럴 문법이 있습니다: `[` 와 `]` 문자를 사용합니다. 빈 배열을 만들 수 있습니다:

    []
      //=> []

대괄호 사이에 하나 이상의 *요소*를 넣고 쉼표로 구분하여 배열을 만들 수 있습니다. 공백은 선택사항입니다:

    [1]
      //=> [1]

    [2, 3, 4]
      //=> [2,3,4]

어떤 표현식이든 사용할 수 있습니다:

    [ 2,
      3,
      2 + 2
    ]
      //=> [2,3,4]

다른 배열을 나타내는 표현식도 포함할 수 있습니다:

    [[[[[]]]]]

이것은 빈 배열을 포함하는 배열을 포함하는 배열을 포함하는 배열을 포함하는 배열입니다. 아무도 이런 것을 만들지 않을 것 같아 보이지만, 많은 학생들이 집합론에서 산술을 구성하는 다양한 방법을 탐구할 때 거의 똑같은 것을 다뤄봤을 것입니다.

이름을 포함한 어떤 표현식이든 사용할 수 있습니다:

    const wrap = (something) => [something];

    wrap("lunch")
      //=> ["lunch"]

배열 리터럴은 표현식이고, 배열은 *참조 타입*입니다. 배열 리터럴이 평가될 때마다 정확히 같은 요소를 포함하더라도 새롭고 독립적인 배열을 얻는다는 것을 알 수 있습니다:

    [] === []
      //=> false

    [2 + 2] === [2 + 2]
      //=> false

    const array_of_one = () => [1];

    array_of_one() === array_of_one()
      //=> false

### 요소 참조

배열 요소는 후위 연산자로 `[` 와 `]`를 사용하여 추출할 수 있습니다. 추출할 요소의 인덱스로 정수를 전달합니다:

    const oneTwoThree = ["one", "two", "three"];

    oneTwoThree[0]
      //=> 'one'

    oneTwoThree[1]
      //=> 'two'

    oneTwoThree[2]
      //=> 'three'

보시다시피, JavaScript 배열은 0부터 시작합니다. [zero-based].

[zero-based]: https://en.wikipedia.org/wiki/Zero-based_numbering

모든 배열이 고유한 엔티티이며, 고유한 참조를 가진다는 것을 알고 있습니다. 배열의 내용은 어떨까요? 우리가 넣은 것들의 참조를 저장할까요? 아니면 어떤 종류의 복사본을 저장할까요?

```js
const x = [],
      a = [x];

a[0] === x
  //=> true, 배열은 넣은 것들의 참조를 저장합니다..
```

### 배열 분해

배열에서 요소를 추출하는 또 다른 방법이 있습니다: Common Lisp 이전부터 있었던 기능인 *분해*입니다. `[, 표현식, ,, ]`를 사용하여 배열 리터럴을 구성하는 방법을 보았습니다. 다음은 이름을 사용하는 배열 리터럴의 예입니다:

    const wrap = (something) => [something];

블록과 추가 이름을 사용하도록 확장해보겠습니다:

    const wrap = (something) => {
      const wrapped = [something];

      return wrapped;
    }

    wrap("package")
      //=> ["package"]

`const wrapped = [something]`; 줄이 흥미롭습니다. 왼쪽에는 바인딩될 이름이 있고, 오른쪽에는 유사 리터럴 문자열처럼 배열을 구성하기 위한 템플릿인 배열 리터럴이 있습니다.

JavaScript에서는 실제로 문장을 *뒤집어서* 템플릿을 왼쪽에, 값을 오른쪽에 놓을 수 있습니다:

    const unwrap = (wrapped) => {
      const [something] = wrapped;

      return something;
    }

    unwrap(["present"])
      //=> "present"

`const [something] = wrapped;` 문장은 `wrapped`가 나타내는 배열을 *분해*하여, 단일 요소의 값을 `something`이라는 이름에 바인딩합니다. 하나 이상의 요소에 대해서도 같은 작업을 할 수 있습니다:

    const surname = (name) => {
      const [first, last] = name;

      return last;
    }

    surname(["Reginald", "Braithwaite"])
      //=> "Braithwaite"

`(name) => name[1]`로도 같은 작업을 할 수 있지만, 분해는 소비하는 데이터와 비슷한 모양의 코드를 만들어내므로 가치 있는 코딩 스타일입니다.

분해는 중첩될 수 있습니다:

    const description = (nameAndOccupation) => {
      const [[first, last], occupation] = nameAndOccupation;

      return `${first} is a ${occupation}`;
    }

    description([["Reginald", "Braithwaite"], "programmer"])
      //=> "Reginald is a programmer"

### 모으기

때로는 배열에서 배열을 추출해야 할 필요가 있습니다. 다음은 가장 일반적인 패턴입니다:   
배열에서 첫 번째 요소를 추출하고 첫 번째를 제외한 모든 것을 모으는 것입니다:   

    const [car, ...cdr] = [1, 2, 3, 4, 5];

    car
      //=> 1
    cdr
      //=> [2, 3, 4, 5]
      

car와 cdr는[`car` and `cdr`](https://en.wikipedia.org/wiki/CAR_and_CDR) IBM 704 컴퓨터에서 실행되는 Lisp 구현체로 거슬러 올라가는 고풍스러운 용어입니다. 다른 언어들은 이것을 first와 butFirst, 또는 head와 tail이라고 부릅니다. 우리는 일반적인 관례를 따라 모으는 변수를 rest라고 부르지만, Kyle Simpson의 예를 따라 ... 연산을 "모으기"라고 부르겠습니다.[^getify]

[^getify]: Kyle Simpson is the author of [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS/blob/master/README.md#you-dont-know-js-book-series), available [here](http://search.oreilly.com/?q=you+don%27t+know+js+kyle+simpson)

안타깝게도, `...` 표기법은 범용적인 패턴 매칭 기능을 제공하지 않습니다. 예를 들어, 다음과 같이 쓸 수 없습니다:

    const [...butLast, last] = [1, 2, 3, 4, 5];
      //=> ERROR

    const [first, ..., last] = [1, 2, 3, 4, 5];
      //=> ERROR

자, 분해를 소개할 때, 이것이 어떤 면에서 배열 리터럴의 반대라는 것을 보았습니다. 따라서 만약

    const wrapped = [something];

이라면:

    const [unwrapped] = something;

모으기의 반대는 무엇일까요? 우리는 다음을 알고 있습니다:

    const [car, ...cdr] = [1, 2, 3, 4, 5];

그렇다면 반대는 무엇일까요? 다음과 같을 것입니다:

    const cons = [car, ...cdr];

Let's try it:

```js
const oneTwoThree = ["one", "two", "three"];

["zero", ...oneTwoThree]
  //=> ["zero","one","two","three"]
```

작동합니다! `...`를 사용하여 한 배열의 요소들을 다른 배열 안에 넣을 수 있습니다. 분해할 때 `...`를 사용하는 것을 모으기라고 하고, 리터럴에서 요소를 삽입할 때 사용하는 것을 "펼치기"라고 합니다.

### 구조 분해는 패턴 매칭이 아닙니다

다른 언어들에는 *패턴 매칭*이라는 것이 있는데, 구조 분해 할당과 비슷한 것을 작성하면 언어가 "패턴"이 일치하는지 여부를 결정합니다. 일치한다면, 적절한 곳에 할당이 이루어집니다.

그러한 언어에서는 다음과 같이 작성하면:

    const [what] = [];

배열에 `what`에 할당할 요소가 없기 때문에 매칭이 실패할 것입니다. 하지만 JavaScript는 이렇게 작동하지 않습니다. JavaScript는 최선을 다해 할당하려 하고, 맞는 것이 없다면 JavaScript는 그 이름에 `undefined`를 바인딩합니다. 따라서:

    const [what] = [];

    what
      //=> undefined

    const [which, what, who] = ["duck feet", "tiger tail"];

    who
      //=> undefined

그리고 `...`로 할당할 항목이 없다면, JavaScript는 빈 배열을 할당합니다:

    const [...they] = [];

    they
      //=> []

    const [which, what, ...they] = ["duck feet", "tiger tail"];

    they
      //=> []

JavaScript는 처음부터 치명적인 오류를 피하려고 노력해왔습니다. 그 결과, 종종 값을 강제 변환하거나, `undefined`를 전달하거나, 실패하지 않고 계속 실행하기 위해 할 수 있는 모든 것을 합니다. 이는 종종 우리가 의미론적으로 무의미한 일을 할 때 언어가 지적해주는 것을 신뢰할 수 없기 때문에, 실패 조건을 감지하는 코드를 직접 작성해야 한다는 것을 의미합니다.

### 구조 분해와 반환 값

일부 언어는 다중 반환 값을 지원합니다: 함수가 값과 오류 코드와 같이 여러 가지를 한 번에 반환할 수 있습니다. 이는 JavaScript에서 구조 분해로 쉽게 모방할 수 있습니다:

```js
    const description = (nameAndOccupation) => {
      if (nameAndOccupation.length < 2) {
        return ["", "occupation missing"]
      }
      else {
        const [[first, last], occupation] = nameAndOccupation;

        return [`${first} is a ${occupation}`, "ok"];
      }
    }

    const [reg, status] = description([["Reginald", "Braithwaite"], "programmer"]);

    reg
      //=> "Reginald is a programmer"

    status
       //=> "ok"
```

### 매개변수 구조 분해

인수를 매개변수에 전달하는 방식을 살펴보겠습니다:

    foo()
    bar("smaug")
    baz(1, 2, 3)

이는 배열 리터럴과 매우 비슷합니다. 그리고 매개변수 이름에 값을 바인딩하는 방식을 살펴보면:

    const foo = () => ...
    const bar = (name) => ...
    const baz = (a, b, c) => ...

구조 분해처럼 *보입*니다. 구조 분해처럼 작동합니다. 단 하나의 차이점이 있습니다: 우리는 아직 나머지 수집을 시도하지 않았습니다. 해보겠습니다:

    const numbers = (...nums) => nums;

    numbers(1, 2, 3, 4, 5)
      //=> [1,2,3,4,5]

    const headAndTail = (head, ...tail) => [head, tail];

    headAndTail(1, 2, 3, 4, 5)
      //=> [1,[2,3,4,5]]

매개변수에서 나머지 수집이 작동합니다! 이는 매우 유용하며, 곧 더 자세히 살펴볼 것입니다.[^rest]

[^rest]: 매개변수에서의 나머지 수집은 오랜 역사를 가지고 있으며, 일반적으로 나머지 수집을 "패턴 매칭"이라고 하고 나머지 수집된 값에 바인딩된 이름을 "나머지 매개변수"라고 합니다. "나머지"라는 용어는 수집과 완벽하게 호환됩니다: "나머지"는 명사이고 "수집"은 동사입니다. 우리는 매개변수의 나머지를 수집합니다
