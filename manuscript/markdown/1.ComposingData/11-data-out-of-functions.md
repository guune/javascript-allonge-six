## 함수를 통한 데이터 만들기

![Coffee served at the CERN particle accelerator](../../images/cern-coffee.jpg)

지금까지의 코드에서는 배열과 객체를 사용하여 데이터 구조를 표현하였고, 기본 사례에 도달했을 때 알고리즘이 종료되도록 삼항 연산자를 광범위하게 사용했습니다.

예를 들어, 이 `length` 함수는 값에 이름을 바인딩하는 함수, 노드를 구조화하는 POJO, 그리고 빈 리스트인 기본 사례를 감지하는 삼항 함수를 사용합니다.

```js
const EMPTY = {};
const OneTwoThree = { first: 1, rest: { first: 2, rest: { first: 3, rest: EMPTY } } };

OneTwoThree.first
  //=> 1
  
OneTwoThree.rest.first
  //=> 2
  
OneTwoThree.rest.rest.first
  //=> 3
  
const length = (node, delayed = 0) =>
  node === EMPTY
    ? delayed
    : length(node.rest, delayed + 1);

length(OneTwoThree)
  //=> 3
```

오래 전, 알론조 처치(Alonzo Church), 모세 쇤킨(Moses Schönfinkel), 앨런 튜링(Alan Turing), 해스켈 커리(Haskell Curry)와 같은 수학자들은 우리가 계산을 수행하는 데 이렇게 많은 기능이 정말 필요한지 스스로에게 질문했습니다. 그들은 동일한 작업을 수행할 수 있는 훨씬 더 간단한 도구 세트를 찾고자 했습니다.

그들은 임의의 계산이 작은 집합의 공리적 구성 요소로 표현될 수 있다는 것을 확립했습니다. 예를 들어, 리스트를 표현하기 위해 배열이 필요하지 않으며, 심지어 연결 리스트의 노드를 표현하기 위해 POJO도 필요하지 않습니다. 우리는 함수만 사용하여 리스트를 모델링할 수 있습니다.

> [To Mock a Mockingbird](http://www.amazon.com/gp/product/0192801422/ref=as_li_ss_tl?ie=UTF8&tag=raganwald001-20&linkCode=as2&camp=1789&creative=390957&creativeASIN=0192801422) 에서는 조합기를 위한 노래새의 은유를 확립했으며, 그 이후로 논리학자들은 K 조합기를 "케스트렐"이라고 부르고, B 조합기를 "블루버드"라고 부르며 계속해서 그렇게 불렀습니다.

> [oscin.es] 라이브러리에는 모든 표준 조합기와 표준 표기를 사용한 실험을 위한 코드가 포함되어 있습니다.

[To Mock a Mockingbird]: http://www.amazon.com/gp/product/0192801422/ref=as_li_ss_tl?ie=UTF8&tag=raganwald001-20&linkCode=as2&camp=1789&creative=390957&creativeASIN=0192801422
[oscin.es]: http://oscin.es

조합 논리의 일부 빌딩 블록인 K, I, V 조합기부터 시작해 보겠습니다. 이들은 각각 "케스트렐", "바보새", "비레오"라는 별명을 가지고 있습니다:


```js
const K = (x) => (y) => x;
const I = (x) => (x);
const V = (x) => (y) => (z) => z(x)(y);
```

### 케스트렐과 바보새(the kestrel and the idiot(

*상수 함수*는 주어진 값에 관계없이 항상 같은 값을 반환하는 함수입니다. 예를 들어, (x) => 42는 항상 42를 평가하는 상수 함수입니다. 케스트렐(Kestrel) 또는 K는 상수 함수를 만드는 함수입니다. 값을 주면 그 값을 반환하는 상수 함수를 반환합니다.

For example:

```js
const K = (x) => (y) => x;

const fortyTwo = K(42);

fortyTwo(6)
  //=> 42

fortyTwo("Hello")
  //=> 42
```

*항등 함수*는 전달된 매개변수에 따라 평가되는 함수입니다. 그래서 I(42) => 42입니다. 매우 간단하지만 유용합니다. 이제 한 단계 더 나아가 보겠습니다: K에 값을 전달하면 함수가 반환되고, 그 함수에 값을 전달하면 값을 얻을 수 있습니다.

Like so:

```js
K(6)(7)
  //=> 6
  
K(12)(24)
  //=> 12
```

이것은 매우 흥미롭습니다. 두 값을 주면 `K`는 항상 첫 번째 값을 반환한다고 말할 수 있습니다: `K(x)(y) => x` (이것은 유효한 JavaScript는 아니지만, 본질적으로 이렇게 작동합니다).

이제 함수끼리 서로 전달할 때 흥미로운 일이 발생합니다. `K(I)`를 고려해 보십시오. 우리가 방금 쓴 대로 `K(x)(y) => x`입니다. 따라서 `K(I)(x) => I`가 됩니다. 이해가 됩니다. 이제 한 번 더 호출을 추가해 보겠습니다: `K(I)(x)(y)`는 무엇일까요? 만약 `K(I)(x) => I`라면 `K(I)(x)(y) === I(y)`는 `y`가 됩니다.


Therefore, `K(I)(x)(y) => y`:

```js
K(I)(6)(7)
  //=> 7
  
K(I)(12)(24)
  //=> 24
```

아하! 두 값을 주면 `K(I)`는 항상 두 번째 값을 반환합니다.

```js
K("primus")("secundus")
  //=> "primus"
  
K(I)("primus")("secundus")
  //=> "secundus"
```

만약 우리가 특별히 학문적이지 않다면, 우리의 함수에 이름을 붙일 수 있습니다:

```js
const first = K,
      second = K(I);
      
first("primus")("secundus")
  //=> "primus"
  
second("primus")("secundus")
  //=> "secundus"
```

> 이것은 매우 흥미롭습니다. 두 값을 주면 `K`는 항상 첫 번째 값을 반환하고, 두 값을 주면 `K(I)`는 항상 두 번째 값을 반환한다고 말할 수 있습니다.

### 역설적임(backwardness)

우리의 `first`와 `second` 함수는 데이터에 접근하는 함수에 대해 대부분 사람들이 익숙하게 생각하는 것과 조금 다릅니다. 값의 쌍을 배열로 표현한다면, 우리는 다음과 같이 작성할 것입니다:


```js
const first = ([first, second]) => first,
      second = ([first, second]) => second;
      
const latin = ["primus", "secundus"];
      
first(latin)
  //=> "primus"
  
second(latin)
  //=> "secundus"
```

만약 POJO를 사용하고 있다면, 우리는 이렇게 쓸 것입니다:

```js
const first = ({first, second}) => first,
      second = ({first, second}) => second;
      
const latin = {first: "primus", second: "secundus"};
      
first(latin)
  //=> "primus"
  
second(latin)
  //=> "secundus"
```

두 경우 모두, `first`와 `second` 함수는 데이터가 어떻게 표현되는지, 즉 배열인지 객체인지 알고 있습니다. 이 함수들에 데이터를 전달하면, 그 데이터를 추출합니다.


하지만 `K`와 `I`를 사용해 만든 `first`와 `second`는 그런 방식으로 작동하지 않습니다. 이들을 호출하고 조각들을 전달하면, 그들이 무엇을 반환할지 선택합니다. 따라서 두 요소 배열과 함께 사용하려면, 어떤 코드를 호출하는 코드가 필요합니다.

다음은 첫 번째 시도입니다:

```js
const first = K,
      second = K(I);
      
const latin = (selector) => selector("primus")("secundus");

latin(first)
  //=> "primus"
  
latin(second)
  //=> "secundus"
```

우리의 `latin` 데이터 구조는 더 이상 단순한 데이터 구조가 아니라 함수입니다. 그리고 `latin`에 `first`나 `second`를 전달하는 대신, `first`나 `second`를 `latin`에 전달합니다. 이는 데이터에 대해 작동하는 함수를 작성하는 방식과 정반대입니다.


### the vireo

우리의 `latin` 데이터가 함수 `(selector) => selector("primus")("secundus")`로 표현된다는 것을 감안할 때, 다음 단계는 데이터를 생성하는 함수를 만드는 것입니다. 배열의 경우 `cons = (first, second) => [first, second]`라고 작성할 수 있습니다. 객체의 경우에는 `cons = (first, second) => {first, second}`라고 쓸 수 있습니다. 두 경우 모두 두 개의 매개변수를 받아 데이터 형태를 반환합니다.


`K`와 `K(I)`로 접근하는 "데이터"를 위해, 우리의 "구조"는 함수 `(selector) => selector("primus")("secundus")`입니다. 이를 매개변수로 추출해 봅시다:

```js
(first, second) => (selector) => selector(first)(second)
```

조합자들이 단 하나의 매개변수를 받는 함수로 작성되는 방식과 일관성을 위해, 우리는 이 함수를 커리[curry]할 것입니다:

```js
(first) => (second) => (selector) => selector(first)(second)
```

[curry]: https://en.wikipedia.org/wiki/Currying

시도해 보겠습니다. 데이터를 만드는 함수를 `pair`라고 부르기로 하겠습니다. (특정 쌍을 언급해야 할 때는 기본적으로 `aPair`라는 이름을 사용하겠습니다):


```js
const first = K,
      second = K(I),
      pair = (first) => (second) => (selector) => selector(first)(second);

const latin = pair("primus")("secundus");

latin(first)
  //=> "primus"
  
latin(second)
  //=> "secundus"
```

작동합니다! 이제 이 `pair` 함수는 무엇일까요? 이름을 `x`, `y`, `z`로 바꾸면: `(x) => (y) => (z) => z(x)(y)`가 됩니다. 이것이 V 조합자, 비레오입니다! 따라서 우리는 이렇게 쓸 수 있습니다:


```js
const first = K,
      second = K(I),
      pair = V;

const latin = pair("primus")("secundus");

latin(first)
  //=> "primus"
  
latin(second)
  //=> "secundus"
```

> 부수적으로, 비레오는 JavaScript의 `.apply` 함수와 비슷합니다. "이 두 값을 가져와서 이 함수에 적용해라"는 식이죠. 값들을 함수에 적용하는 유사한 조합자들이 더 있습니다. 그중 하나의 주목할 만한 예는 "쓰러쉬" 또는 T 조합자입니다. 이는 하나의 값을 가져와서 함수에 적용합니다. 대부분의 프로그래머는 이를 .tap으로 알고 있습니다.

`K`, `I`, `V` 외에 아무것도 없이, 우리는 두 값을 담고 있는 작은 데이터 구조를 만들 수 있습니다. 이는 Lisp의 cons 셀과 연결 리스트의 노드입니다. 배열도, 객체도 없이, 오직 함수로만 말이죠. 확인하기 위해 테스트해 보는 것이 좋겠습니다.

### 함수로서의 데이터로 구성된 리스트

다음은 POJO를 사용한 연결 리스트의 또 다른 예입니다. `second` 대신 `rest`라는 용어를 사용하지만, 그 외에는 위와 동일합니다:

```js
const first = ({first, rest}) => first,
      rest  = ({first, rest}) => rest,
      pair = (first, rest) => ({first, rest}),
      EMPTY = ({});
      
const l123 = pair(1, pair(2, pair(3, EMPTY)));

first(l123)
  //=> 1

first(rest(l123))
  //=> 2

first(rest(rest(l123)))
  //=3
```

이 구조를 사용하여 `length` 및 `mapWith` 함수를 작성할 수 있습니다:


```js
const length = (aPair) =>
  aPair === EMPTY
    ? 0
    : 1 + length(rest(aPair));

length(l123)
  //=> 3

const reverse = (aPair, delayed = EMPTY) =>
  aPair === EMPTY
    ? delayed
    : reverse(rest(aPair), pair(first(aPair), delayed));

const mapWith = (fn, aPair, delayed = EMPTY) =>
  aPair === EMPTY
    ? reverse(delayed)
    : mapWith(fn, rest(aPair), pair(fn(first(aPair)), delayed));
    
const doubled = mapWith((x) => x * 2, l123);

first(doubled)
  //=> 2

first(rest(doubled))
  //=> 4

first(rest(rest(doubled)))
  //=> 6
```

함수로 구성된 연결 리스트에서도 같은 방식으로 할 수 있을까요? 네:

```js
const first = K,
      rest  = K(I),
      pair = V,
      EMPTY = (() => {});
      
const l123 = pair(1)(pair(2)(pair(3)(EMPTY)));

l123(first)
  //=> 1

l123(rest)(first)
  //=> 2

return l123(rest)(rest)(first)
  //=> 3
```

우리는 이를 뒤집어서 작성했지만, 잘 작동하는 것 같습니다. 그렇다면 `length`는 어떻게 될까요?

```js
const length = (aPair) =>
  aPair === EMPTY
    ? 0
    : 1 + length(aPair(rest));
    
length(l123)
  //=> 3
```

And `mapWith`?

```js
const reverse = (aPair, delayed = EMPTY) =>
  aPair === EMPTY
    ? delayed
    : reverse(aPair(rest), pair(aPair(first))(delayed));

const mapWith = (fn, aPair, delayed = EMPTY) =>
  aPair === EMPTY
    ? reverse(delayed)
    : mapWith(fn, aPair(rest), pair(fn(aPair(first)))(delayed));
    
const doubled = mapWith((x) => x * 2, l123)

doubled(first)
  //=> 2

doubled(rest)(first)
  //=> 4

doubled(rest)(rest)(first)
  //=> 6
```

프레스토, **우리는 순수 함수를 사용하여 연결 리스트를 표현할 수 있습니다**. 조심스럽게 다룬다면, 숫자를 표현하는 데 함수 사용, 나무와 같은 더 복잡한 데이터 구조를 구축하는 것, 사실 계산할 수 있는 모든 것은 함수와 그 외에 아무것도 없이 계산할 수 있습니다.

하지만 JavaScript 인터프리터와 같은 미친 작업을 하기 위해 아무 다른 데이터 구조 없이 JavaScript 함수를 사용하여 우리가 구축한 것과는 별개로, 약간 다른 방향으로 한 걸음 더 나아가 보겠습니다.

우리는 배열과 POJO를 대체하기 위해 함수를 사용했지만, 여전히 JavaScript의 내장 연산자(===)를 사용하여 동등성을 검사하고(?:) 분기합니다.


### say "please"

우리는 함수에서 같은 패턴을 계속 사용합니다: `aPair === EMPTY ? doSomething : doSomethingElse.` 이것은 데이터 구조와 함께 사용했던 철학을 따릅니다: 작업을 수행하는 함수는 데이터 구조를 검사합니다.

이를 반대로 바꿀 수 있습니다: 쌍이 비어 있는지 물어보고 무엇을 할지 결정하는 대신, 쌍에게 그것을 대신 하도록 요청할 수 있습니다. 다음은 length 함수입니다:

```js
const length = (aPair) =>
  aPair === EMPTY
    ? 0
    : 1 + length(aPair(rest));
```

우리가 약간 더 높은 추상화에서 작업하고 있다고 가정해 보겠습니다. 이를 list라고 부르겠습니다. length(list)를 작성하고 리스트를 검사하는 대신, 다음과 같이 작성할 것입니다:


```js
const length = (list) => list(
  () => 0,
  (aPair) => 1 + length(aPair(rest)))
);
```

이제 리스트에 대한 `first`와 `rest` 함수를 작성해야 하며, 이 이름들은 쌍에 대해 작성한 `first`와 `rest`와 충돌할 것입니다. 따라서 이름을 구분해 보겠습니다:


```js
const pairFirst = K,
      pairRest  = K(I),
      pair = V;
      
const first = (list) => list(
    () => "ERROR: Can't take first of an empty list",
    (aPair) => aPair(pairFirst)
  );
      
const rest = (list) => list(
    () => "ERROR: Can't take first of an empty list",
    (aPair) => aPair(pairRest)
  );

const length = (list) => list(
    () => 0,
    (aPair) => 1 + length(aPair(pairRest))
  );
```

편리한 리스트 프린터도 작성하겠습니다:

```js
const print = (list) => list(
    () => "",
    (aPair) => `${aPair(pairFirst)} ${print(aPair(pairRest))}`
  );
```

이 모든 것이 어떻게 작동할까요? 먼저 명확한 것부터 시작해 보겠습니다. 빈 리스트는 무엇인가요?

```js
const EMPTYLIST = (whenEmpty, unlessEmpty) => whenEmpty()
```

그리고 리스트의 노드는 무엇인가요?

```js
const node = (x) => (y) =>
  (whenEmpty, unlessEmpty) => unlessEmpty(pair(x)(y));
```

Let's try it:

```js
const l123 = node(1)(node(2)(node(3)(EMPTYLIST)));

print(l123)
  //=> 1 2 3
```

`reverse`와 `mapWith`도 작성할 수 있습니다. 우리는 조합 논리를 엄격하게 모방하는 것은 아니며, 기본 매개변수를 사용할 것입니다:

```js
const reverse = (list, delayed = EMPTYLIST) => list(
  () => delayed,
  (aPair) => reverse(aPair(pairRest), node(aPair(pairFirst))(delayed))
);

print(reverse(l123));
  //=> 3 2 1
  
const mapWith = (fn, list, delayed = EMPTYLIST) =>
  list(
    () => reverse(delayed),
    (aPair) => mapWith(fn, aPair(pairRest), node(fn(aPair(pairFirst)))(delayed))
  );
  
print(mapWith(x => x * x, reverse(l123)))
  //=> 941
```

우리는 `===`와 `?:`가 제공했던 것과 정확히 동일한 기능을 제공하는 데 성공했으며, 함수와 그 외의 아무것도 사용하지 않았습니다.


### 함수는 실제 요점이 아니다


복잡한 의미론을 함수로 구성하는 방법을 설명하는 유사한 텍스트가 많이 있습니다. `K`와 `K(I)`가 `true`와 `false`를 나타낼 수 있음을 확립하고, 처치 수[Church Numerals]나 초현실수[Surreal Numbers]로 크기를 모델링하며, FizzBuzz를 출력하기 위해 점차 발전할 수 있습니다.

표면적인 결론은 다음과 같이 읽힙니다:

[Church Numerals]: https://en.wikipedia.org/wiki/Church_encoding
[Surreal Numbers]: https://en.wikipedia.org/wiki/Surreal_number

> 함수는 계산의 기본 구성 요소입니다. 그것들은 조합 논리의 "공리"이며, JavaScript가 계산할 수 있는 모든 것을 계산하는 데 사용될 수 있습니다.

그러나 여기서 주목할 흥미로운 점은 아닙니다. 실용적으로 볼 때, JavaScript와 같은 언어는 이미 매핑 및 접기 메서드, 선택 연산 및 기타 풍부한 구조를 제공하는 배열을 제공합니다. 함수로 연결 리스트를 만드는 방법을 아는 것은 실제 프로그래머에게는 그리 필요하지 않습니다. 반면, 그렇게 할 수 있다는 것을 아는 것은 컴퓨터 과학을 이해하는 데 매우 중요합니다.

오직 함수만으로 리스트를 만드는 방법을 아는 것은 마치 광자가 전자기력의 게이지 보손[Gauge Bosons]이라는 것을 아는 것과 같습니다. 이것은 프로그래밍의 맥스웰 방정식을 뒷받침하는 물리학의 QED입니다. 깊이 중요한 것이지만, 다리를 짓는 데 있어서는 실용적이지 않습니다.

[Gauge Bosons]: https://en.wikipedia.org/wiki/Gauge_boson

그렇다면 이와 관련하여 *무엇*이 흥미로운 것인가요? 우리가 이 과정을 마친 후 잠에 빠질 때, 무엇이 우리의 마음을 괴롭히고 있을까요?


### 역행적 사고로 돌아가기

쌍이 작동하도록 하기 위해 우리는 *역행*했습니다. `first`와 `rest` 함수를 쌍에 전달하고, 쌍이 우리의 함수를 호출하도록 했습니다. 결과적으로, 쌍은 비레오(V combinator)에 의해 구성되었습니다: `(x) => (y) => (z) => z(x)(y)`.

하지만 우리는 완전히 다른 것을 할 수 있었습니다. 요소를 배열에 저장하는 쌍을 작성하거나 POJO에 저장하는 쌍을 작성할 수 있었습니다. 우리가 아는 것은, 쌍 함수에 우리의 함수를 전달할 수 있으며, 그러면 쌍은 우리의 요소로 그 함수를 호출할 것이라는 것입니다.

쌍의 정확한 구현은 쌍을 사용하는 코드에서 숨겨져 있습니다. 여기서 이를 증명해 보겠습니다:

```js
const first = K,
      second = K(I),
      pair = (first) => (second) => {
        const pojo = {first, second};
        
        return (selector) => selector(pojo.first)(pojo.second);
      };

const latin = pair("primus")("secundus");

latin(first)
  //=> "primus"
  
latin(second)
  //=> "secundus"
```

이것은 약간 불필요할 수 있지만, 포인트는 분명합니다: 데이터를 사용하는 코드는 데이터를 직접 접근하지 않습니다. 데이터를 사용하는 코드는 일부 코드를 제공하고 데이터에게 그것을 수행하도록 요청합니다.

리스트에서도 같은 일이 발생합니다. 리스트의 `length` 함수는 다음과 같습니다:


```js
const length = (list) => list(
    () => 0,
    (aPair) => 1 + length(aPair(pairRest)))
  );
```

우리는 `list`에게 빈 리스트에서 원하는 작업과 적어도 하나의 요소가 있는 리스트에서 원하는 작업을 전달하고 있습니다. 그런 다음 `list`에게 그것을 수행하도록 요청하고, 우리가 전달한 코드를 호출할 수 있는 방법을 제공합니다.

여기서는 신경 쓰지 않겠지만, 우리의 함수를 쉽게 교체하고 배열로 대체할 수 있는 방법이 있다는 것을 쉽게 알 수 있습니다. 또는 데이터베이스의 열로 대체할 수 있습니다. 이는 본질적으로 다음의 코드와는 전혀 다릅니다:


```js
const length = (node, delayed = 0) =>
  node === EMPTY
    ? delayed
    : length(node.rest, delayed + 1);
```

`node === EMPTY`라는 줄은 많은 것을 전제합니다. 그것은 하나의 표준 빈 리스트 값을 가정합니다. 이러한 것들을 === 연산자로 비교할 수 있다고 가정합니다. 우리는 isEmpty 함수를 사용하여 이를 수정할 수 있지만, 이제는 리스트의 구조에 대한 더 많은 지식을 사용하여야 합니다.


리스트가 스스로 빈 상태인지 아는 것은 리스트를 사용하는 코드에서 구현 정보를 숨깁니다. 이는 좋은 설계의 근본 원칙입니다. 이는 객체 지향 프로그래밍의 신념이지만, **OOP에만 국한되지 않습니다**: 우리는 함수, 객체 또는 두 가지 모두 작업할 때, 데이터를 사용하는 코드에서 구현 정보를 숨기기 위해 데이터 구조를 설계해야 합니다.

구현 정보를 숨기는 데는 여러 도구가 있으며, 우리는 이제 특히 강력한 두 가지 패턴을 보았습니다:

* 엔티티의 일부를 직접 조작하는 대신, 함수를 전달하고 그 부분을 원하는 함수로 호출하게 하십시오.
* 그리고 엔티티의 속성을 테스트하고 ?:(또는 if)를 사용하여 선택하는 대신, 엔티티에 각 경우에 대해 원하는 작업을 전달하고 스스로 테스트하도록 하십시오.
