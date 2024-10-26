## Copy on Write {#cow}

![The Coffee Cow](../../images/coffee-cow.jpg)

우리는 배열과 연결 리스트로 리스트를 만드는 방법을 보았습니다. 그들 사이의 중요한 차이점에 대해 언급했습니다:

* 구조 분해 할당(`const [first, ...rest]`)을 사용하여 배열의 나머지를 가져올 때, 우리는 배열 요소의 복사본을 받습니다.
* 연결 리스트에서 나머지를 가져올 때는 참조를 통해 원래 리스트의 동일한 노드를 받습니다.

이로 인해 배열이 있을 때, "나머지"를 가져오면 "자식" 배열은 부모 배열의 요소의 복사본이 됩니다. 따라서 부모를 수정해도 자식에는 영향을 주지 않고, 자식을 수정해도 부모에는 영향을 주지 않습니다.

반면 연결 리스트가 있을 때, "나머지"를 가져오면 자식 리스트가 부모 리스트와 노드를 공유합니다. 따라서 부모를 수정하면 자식도 수정되고, 자식을 수정하면 부모도 수정됩니다.

우리의 이해를 확인해 봅시다:

```js
const parentArray = [1, 2, 3];
const [aFirst, ...childArray] = parentArray;

parentArray[2] = "three";
childArray[0] = "two";

parentArray
  //=> [1,2,"three"]
childArray
  //=> ["two",3]

const EMPTY = { first: {}, rest: {} };
const parentList = { first: 1, rest: { first: 2, rest: { first: 3, rest: EMPTY }}};
const childList = parentList.rest;

parentList.rest.rest.first = "three";
childList.first = "two";

parentList
  //=> {"first":1,"rest":{"first":"two","rest":{"first":"three","rest":{"first":{},"rest":{}}}}}
childList
  //=> {"first":"two","rest":{"first":"three","rest":{"first":{},"rest":{}}}}
```

이것은 매우 위험합니다. 만약 우리가 리스트가 다른 리스트와 요소를 공유하지 않는다고 *확신*할 수 있다면, 우리는 안전하게 그것을 수정할 수 있습니다. 그러나 이를 추적하려면 많은 부가적인 작업이 필요합니다. 우리는 참조 카운팅과 가비지 컬렉션을 다시 발명하게 될 것입니다.

### 몇 가지 유틸리티

더 나아가기 전에, 약간의 단순한 리스트 유틸리티를 작성하여 약간 더 높은 추상화 수준에서 작업할 수 있도록 합시다:

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

const first = ({first, rest}) => first;
const rest = ({first, rest}) => rest;

const reverse = (node, delayed = EMPTY) =>
  node === EMPTY
    ? delayed
    : reverse(rest(node), { first: first(node), rest: delayed });

const mapWith = (fn, node, delayed = EMPTY) =>
  node === EMPTY
    ? reverse(delayed)
    : mapWith(fn, rest(node), { first: fn(first(node)), rest: delayed });

const at = (index, list) =>
  index === 0
    ? first(list)
    : at(index - 1, rest(list));
    
const set = (index, value, list, originalList = list) =>
  index === 0
    ? (list.first = value, originalList)
    : set(index - 1, value, rest(list), originalList)
    
const parentList = { first: 1, rest: { first: 2, rest: { first: 3, rest: EMPTY }}};
const childList = rest(parentList);

set(2, "three", parentList);
set(0, "two", childList);

parentList
  //=> {"first":1,"rest":{"first":"two","rest":{"first":"three","rest":{"first":{},"rest":{}}}}}
childList
  //=> {"first":"two","rest":{"first":"three","rest":{"first":{},"rest":{}}}}
```

우리의 새로운 `at`과 `set` 함수는 각각 `array[index]`와 `array[index] = value`와 유사하게 동작합니다. 주요 차이점은 `array[index] = value`가 `value`를 평가하는 반면, `set(index, value, list)`는 수정된 `list`를 평가한다는 것입니다.

  
### copy-on-read(읽을 때 복사하기)

그렇다면 구조 공유 문제로 돌아가 보겠습니다. 문제를 피하는 한 가지 전략은 *비관적*이 되는 것입니다. 리스트의 나머지를 가져올 때마다 복사본을 만듭니다.


```js
const rest = ({first, rest}) => copy(rest);

const parentList = { first: 1, rest: { first: 2, rest: { first: 3, rest: EMPTY }}};
const childList = rest(parentList);

const newParentList = set(2, "three", parentList);
set(0, "two", childList);

parentList
  //=> {"first":1,"rest":{"first":2,"rest":{"first":"three","rest":{"first":{},"rest":{}}}}}
childList
  //=> {"first":"two","rest":{"first":3,"rest":{"first":{},"rest":{}}}}
```

이 전략은 "읽을 때 복사하기(copy-on-read)"라고 불리며, 리스트의 자식을 읽으려고 할 때 복사본을 만들고 자식의 값을 읽습니다. 이후에는 부모나 자식의 복사본을 자유롭게 수정할 수 있습니다.

우리가 예상한 대로, 복사본을 만들면 원본에 영향을 주지 않고 수정할 수 있습니다. 그러나 이 방법은 비용이 많이 듭니다. 때때로 우리는 리스트를 수정하지 않을 것이기 때문에 복사할 필요가 없습니다. 예를 들어, `mapWith` 함수는 매번 `rest(node)`를 호출할 때 복사하면 매우 비쌀 것입니다.

또한 버그가 있습니다: 리스트의 첫 번째 요소를 수정할 때는 어떻게 될까요? 하지만 이를 수정하기 전에, 복사하는 것에 대해 느리게 접근해 보겠습니다.

### copy-on-write(쓸때 복사하기)

왜 우리는 복사하고 있을까요? 자식 리스트를 수정할 경우를 대비해서입니다. 그렇다면 이렇게 해봅시다: 리스트를 수정할 때 복사합니다. 언제 수정할지 알 수 있을까요? `set`을 호출할 때입니다. 우리는 `rest`에 대한 원래 정의를 복원하되, `set`을 변경합시다:


```js
const rest = ({first, rest}) => rest;

const set = (index, value, list) =>
  index === 0
    ? { first: value, rest: list.rest }
    : { first: list.first, rest: set(index - 1, value, list.rest) };

const parentList = { first: 1, rest: { first: 2, rest: { first: 3, rest: EMPTY }}};
const childList = rest(parentList);

const newParentList = set(2, "three", parentList);
const newChildList = set(0, "two", childList);
```

이제 우리의 원래 부모 및 자식 리스트는 수정되지 않습니다:

```js
parentList
  //=> {"first":1,"rest":{"first":2,"rest":{"first":3,"rest":{"first":{},"rest":{}}}}}
childList
  //=> {"first":2,"rest":{"first":3,"rest":{"first":{},"rest":{}}}}
```

하지만 우리의 새로운 부모 및 자식 리스트는 서로 간섭하지 않고 원하는 수정 사항을 포함하는 복사본입니다:


```js
newParentList
  //=> {"first":1,"rest":{"first":2,"rest":{"first":"three","rest":{"first":{},"rest":{}}}}}
newChildList
  //=> {"first":"two","rest":{"first":3,"rest":{"first":{},"rest":{}}}}
```

이제 `mapWith`와 같은 함수는 복사 없이도 완전히 빠르게 동작합니다.

이 쓰기 시 복사하기 전략은 복사-온-라이트(copy-on-write)라고 불립니다:

> 쓰기 시 복사하기는 공유 정보를 변경하려고 하는 작업이 있을 때, 그 변경 사항이 다른 모든 작업에 보이지 않도록 하기 위해 먼저 별도의(개인) 복사본을 생성해야 한다는 정책의 이름입니다.—[Wikipedia][Copy-on-write]

[Copy-on-write]: https://en.wikipedia.org/wiki/Copy-on-write

모든 전략과 마찬가지로, 이는 트레이드오프를 만듭니다: 드물게 작은 변경을 많이 하는 경우 비관적 복사보다 훨씬 저렴하지만, 변경이 많은 경우 비용이 더 많이 듭니다.

코드를 다시 살펴보면, `copy` 함수는 쓰기 시 복사(copy-on-write)를 하지 않습니다. 이는 우리가 무언가를 구성하는 동안 그것을 소유하고 있어 변형을 자유롭게 할 수 있다는 패턴을 따릅니다. 우리가 그것을 끝내고 다른 사람에게 넘기면, 우리는 신중해야 하며 카피-온-리드(copy-on-read)나 쓰기 시 복사(copy-on-write)와 같은 전략을 사용해야 합니다.
