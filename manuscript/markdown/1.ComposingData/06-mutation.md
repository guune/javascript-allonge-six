## Mutation {#mutation}

![Cupping Grinds](../../images/cupping.jpg)

JavaScript에서 거의 모든 유형의 값은 *변이*가 가능합니다. 값의 정체성은 동일하지만 구조는 변경될 수 있습니다. 특히, 배열과 객체는 변이 가능하다는 점을 기억해야 합니다. 배열이나 객체 내의 값을 `[]`를 사용하여 접근할 수 있으며, `[] =`를 사용하여 값을 재할당할 수 있습니다:

    const oneTwoThree = [1, 2, 3];
    oneTwoThree[0] = 'one';
    oneTwoThree
      //=> [ 'one', 2, 3 ]

값을 추가하는 것도 가능합니다:

    const oneTwoThree = [1, 2, 3];
    oneTwoThree[3] = 'four';
    oneTwoThree
      //=> [ 1, 2, 3, 'four' ]

객체에서도 동일한 방식으로 접근할 수 있습니다:

    const name = {firstName: 'Leonard', lastName: 'Braithwaite'};
    name.middleName = 'Austin'
    name
      //=> { firstName: 'Leonard',
      //    lastName: 'Braithwaite',
      //    middleName: 'Austin' }

JavaScript의 의미론은 두 개의 다른 바인딩이 동일한 값을 참조할 수 있도록 허용합니다. 예를 들어:

    const allHallowsEve = [2012, 10, 31]
    const halloween = allHallowsEve;  
      
여기서 halloween과 allHallowsEve는 로컬 환경 내에서 동일한 배열 값을 참조합니다. 또 다른 예로:

    const allHallowsEve = [2012, 10, 31];
    (function (halloween) {
      // ...
    })(allHallowsEve);

두 개의 중첩된 환경이 있으며, 각 환경은 동일한 배열 값에 이름을 바인딩합니다. 이러한 예시에서 우리는 동일한 값을 참조하는 두 개의 *별칭*을 생성했습니다.

중요한 점은 정체성이 동일하다는 것입니다. 동일한 값이기 때문에.

이 점은 매우 중요합니다. 그림자화에 대해 우리가 이미 알고 있는 내용을 고려해 보겠습니다:

    const allHallowsEve = [2012, 10, 31];
    (function (halloween) {
      halloween = [2013, 10, 31];
    })(allHallowsEve);
    allHallowsEve
      //=> [2012, 10, 31]
      
`allHallowsEve`의 외부 값은 변경되지 않았습니다. 내부 환경에서 `halloween`이라는 이름을 다른 변수에 바인딩했을 뿐입니다. 그러나 내부 환경에서 변이를 수행하면 어떻게 될까요?

    const allHallowsEve = [2012, 10, 31];
    (function (halloween) {
      halloween[0] = 2013;
    })(allHallowsEve);
    allHallowsEve
      //=> [2013, 10, 31]
      
이것은 다릅니다. 우리는 내부 이름을 다른 변수로 재바인딩한 것이 아니라, 두 개의 바인딩이 공유하는 값을 변이시켰습니다. 변이와 별칭에 대해 이야기를 마쳤으니, 이제 그것을 살펴보겠습니다.
      
> JavaScript는 기존 바인딩에 새로운 값을 재할당하고, 배열이나 객체와 같은 컨테이너의 요소에 새로운 값을 재할당하거나 할당하는 것을 허용합니다. 기존 객체의 변이는 두 바인딩이 동일한 값의 별칭일 때 특별한 의미를 가집니다.

> 주의하세요: 변수를 const로 선언한다고 해서 값의 변이를 방지하는 것이 아니라, 이름의 재바인딩을 방지하는 것입니다. 이는 중요한 차이입니다.

### 변이와 데이터 구조

변이는 놀라울 정도로 복잡한 주제입니다. 기존의 엔터티를 변이시키지 않고도 모든 것을 계산할 수 있습니다. 예를 들어, Haskell[Haskell]과 같은 언어는 변이를 전혀 허용하지 않습니다. 일반적으로 변이는 일부 알고리즘을 짧게 작성할 수 있게 하고, 아마도 더 빠르게 만들 수 있지만, 추론하기 더 어렵게 만듭니다.

[Haskell]: https://en.wikipedia.org/wiki/Haskell_(programming_language)

많은 사람들이 따르는 한 가지 패턴은 데이터를 구성할 때는 변이에 대해 관대해지고, 데이터를 소비할 때는 변이에 대해 신중해지는 것입니다. `Plain Old JavaScript Objects`에서 링크드 리스트를 다시 상기해 봅시다. `mapWith` 함수를 실행하는 동안 우리는 새로운 링크드 리스트를 구성하고 있습니다. 이 패턴에 따르면, `mapWith`를 실행할 때 리스트를 구성하기 위해 변이를 사용하는 데에는 문제가 없습니다.

하지만 새로운 리스트를 반환한 후에는 변이에 대해 신중해집니다. 이는 논리적입니다: 링크드 리스트는 종종 구조 공유를 사용합니다. 예를 들어:

```js
const EMPTY = {};
const OneToFive = { first: 1, 
                    rest: {
                      first: 2,
                      rest: {
                        first: 3,
                        rest: {
                          first: 4,
                          rest: {
                            first: 5,
                            rest: EMPTY } } } } };

OneToFive
  //=> {"first":1,"rest":{"first":2,"rest":{"first":"three","rest":{"first":"four","rest":{"first":"five","rest":{}}}}}}
                            
const ThreeToFive = OneToFive.rest.rest;

ThreeToFive
  //=> {"first":3,"rest":{"first":4,"rest":{"first":5,"rest":{}}}}
  
ThreeToFive.first = "three";
ThreeToFive.rest.first = "four";
ThreeToFive.rest.rest.first = "five";

ThreeToFive
  //=> {"first":"three","rest":{"first":"four","rest":{"first":"five","rest":{}}}}

OneToFive
  //=> {"first":1,"rest":{"first":2,"rest":{"first":"three","rest":{"first":"four","rest":{"first":"five","rest":{}}}}}}
```

`ThreeToFive`에서 한 변경사항은 `OneToFive`에 영향을 미칩니다. 왜냐하면 두 리스트가 동일한 구조를 공유하기 때문입니다. `ThreeToFive = OneToFive.rest.rest;`를 쓸 때, 우리는 `{"first":3,"rest":{"first":4,"rest":{"first":5,"rest":{}}}}`의 새로운 복사본을 만들지 않고, 동일한 노드 체인의 참조를 가져온 것입니다.

구조 공유는 링크드 리스트가 리스트의 첫 번째 항목을 제외한 모든 항목을 가져오는 데 매우 빠른 이유입니다. 우리는 새로운 리스트를 만들고 있는 것이 아니라, 이전 리스트의 일부를 사용하고 있습니다. 반면, 배열을 비구조화할 때 `[first, ...rest]`는 복사본을 만들기 때문에:


```js
const OneToFive = [1, 2, 3, 4, 5];

OneToFive
  //=> [1,2,3,4,5]

const [a, b, ...ThreeToFive] = OneToFive;

ThreeToFive
  //=> [3, 4, 5]

ThreeToFive[0] = "three";
ThreeToFive[1] = "four";
ThreeToFive[2] = "five";

ThreeToFive
  //=> ["three","four","five"]
  
OneToFive
  //=> [1,2,3,4,5]
```

수집 작업 `[a, b, ...ThreeToFive]`는 느리지만, "안전합니다."

변이를 피하는 쪽으로 돌아가 보겠습니다. 일반적으로 변이가 일어나지 않는 데이터를 추론하는 것이 더 쉽습니다. 우리는 데이터를 값으로 함수에 전달하거나 데이터를 추출할 때 복사 작업을 사용하는 것을 기억할 필요가 없습니다. 우리는 데이터를 사용하기만 하면 되고, 변이를 덜 하면 덜 할수록 변경 사항이 "안전할지"에 대해 생각해야 할 일이 줄어듭니다.


### 변이를 통한 구축

앞서 언급했듯이, 데이터 구조를 구축할 때 변이에 대해 더 관대해지는 패턴이 있습니다. 우리의 `copy` 알고리즘을 생각해 봅시다. 변이 없이 링크드 리스트의 복사본을 만들기 위해 리스트를 두 번 뒤집는 방법은 상수 공간으로 이루어집니다:

```js
const reverse = (node, delayed = EMPTY) =>
  node === EMPTY
    ? delayed
    : reverse(node.rest, { first: node.first, rest: delayed });

const copy = (node) => reverse(reverse(node));
```

변이 없이 링크드 리스트의 복사본을 만들고 싶다면, 두 번 반복하고 나중에 버릴 복사본을 만드는 대신, 변이를 사용할 수 있습니다:

```js
const copy = (node, head = null, tail = null) => {
  if (node === EMPTY) {
    return head;
  }
  else if (tail === null) {
    const { first, rest } = node;
    const newNode = { first, rest };
    return copy(rest, newNode, newNode);
  }
  else {
    const { first, rest } = node;
    const newNode = { first, rest };
    tail.rest = newNode;
    return copy(node.rest, head, newNode);
  }
}
```

이 알고리즘은 노드를 복사하면서 진행하며, 다음 노드를 연결하기 위해 리스트의 마지막 노드를 변경합니다. 기존 리스트에 노드를 추가하는 것은 위험한데, 이는 OneToFive와 ThreeToFive가 동일한 노드를 공유하고 있다는 사실에서 볼 수 있습니다. 하지만 새로운 리스트를 생성하는 과정에서는 다른 리스트와 노드를 공유하지 않으므로, 공간이나 시간을 절약하기 위해 더 자유롭게 변이를 사용할 수 있습니다.

이 기본 복사 구현을 바탕으로 mapWith를 작성할 수 있습니다:

```js
const mapWith = (fn, node, head = null, tail = null) => {
  if (node === EMPTY) {
    return head;
  }
  else if (tail === null) {
    const { first, rest } = node;
    const newNode = { first: fn(first), rest };
    return mapWith(fn, rest, newNode, newNode);
  }
  else {
    const { first, rest } = node;
    const newNode = { first: fn(first), rest };
    tail.rest = newNode;
    return mapWith(fn, node.rest, head, newNode);
  }
}

mapWith((x) => 1.0 / x, OneToFive)
  //=> {"first":1,"rest":{"first":0.5,"rest":{"first":0.3333333333333333,"rest":{"first":0.25,"rest":{"first":0.2,"rest":{}}}}}}
```
