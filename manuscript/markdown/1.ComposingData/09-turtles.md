## 거북이, 토끼, 그리고 텔레포트 거북이 {#tortoises}

오래 전 (인터넷 스타트업의 첫 번째 시대), 누군가 저에게 그런 알고리즘 질문을 했습니다. "링크드 리스트에서 루프를 감지하는 알고리즘을 상수 공간으로 작성하라"는 것이었습니다.

당시 몇 분 안에 답을 생각해낼 수 없었다는 점에 그리 놀랍지 않습니다. 그리고 면접관의 공을 인정하자면, 그는 즉시 면접을 종료하지 않고 제 머릿속에서 어떤 생각들이 지나가는지를 설명해 달라고 했습니다.

제가 말씀드린 것 중 하나는 XOR 같은 해싱 알고리즘을 변형할 수 있을지 고민하고 있다는 것이었습니다. 이것은 리스트에서 누락된 정수를 찾는 문제에 대한 "트릭 답변"이므로, 저는 "이미 해결한 문제로 이것을 변형해 보자"[a problem you've already solved](http://www-users.cs.york.ac.uk/susan/joke/3.htm#boil)" 는 메타 알고리즘을 시도하고 있었습니다. 우리는 그 문제에서 벗어났고, 그는 "정답"을 공개하지 않았습니다.


저는 집에 가서 그 문제를 고민했습니다. 해결하고 싶었습니다. 결국, 해결책을 찾고 집에서 제 PC에서 (Java로!) 시도해 보았습니다. 저는 그 결과를 보여주기 위해 그에게 이메일을 보냈고, 자신의 능력을 보여주기 위해 이행력을 입증하고 싶었습니다. 그리고 한동안 그것을 잊어버렸습니다. 그러고 나서 얼마 후, 정답이 다음과 같다는 것을 알게 되었습니다:


```js
const EMPTY = null;

const isEmpty = (node) => node === EMPTY;

const pair = (first, rest = EMPTY) => ({first, rest});

const list = (...elements) => {
  const [first, ...rest] = elements;
  
  return elements.length === 0
    ? EMPTY
    : pair(first, list(...rest))
}

const forceAppend = (list1, list2) => {
  if (isEmpty(list1)) {
    return "FAIL!"
  }
  if (isEmpty(list1.rest)) {
    list1.rest = list2;
  }
  else {
    forceAppend(list1.rest, list2);
  }
}

const tortoiseAndHare = (aPair) => {
  let tortoisePair = aPair,
      harePair = aPair.rest;
  
  while (true) {
    if (isEmpty(tortoisePair) || isEmpty(harePair)) {
      return false;
    }
    if (tortoisePair.first === harePair.first) {
      return true;
    }
    
    harePair = harePair.rest;
    
    if (isEmpty(harePair)) {
      return false;
    }
    if (tortoisePair.first === harePair.first) {
      return true;
    }
    
    tortoisePair = tortoisePair.rest;
    harePair = harePair.rest;
  }
};

const aList = list(1, 2, 3, 4, 5);

tortoiseAndHare(aList)
  //=> false

forceAppend(aList, aList.rest.rest);

tortoiseAndHare(aList);
  //=> true
```
  
이 알고리즘은 "거북이와 토끼"라고 불리며, 1960년대에 로버트 플로이드(Robert Floyd)에 의해 발견되었습니다. 두 개의 노드 참조가 있으며, 하나는 다른 것보다 두 배 빠른 속도로 리스트를 탐색합니다. 리스트가 얼마나 커도, 결국 빠른 참조가 느린 참조와 같아지며, 따라서 루프를 감지할 수 있습니다.

당시 저는 해싱을 사용하여 문제를 해결할 방법을 생각해내지 못해 포기했고, 이 알고리즘을 2의 거듭제곱 알고리즘에 맞추려고 했습니다. 제가 처음 시도했을 때는 서툴렀지만 대략 다음과 같았습니다:


```js
const teleportingTurtle = (list) => {
  let speed = 1,
      rabbit = list,
      turtle = rabbit;
  
  while (true) {
    for (let i = 0; i <= speed; i += 1) {
      rabbit = rabbit.rest;
      if (rabbit == null) {
        return false;
      }
      if (rabbit === turtle) {
        return true;
      }
    }
    turtle = rabbit;
    speed *= 2;
  }
  return false;
};

const aList = list(1, 2, 3, 4, 5);

teleportingTurtle(aList)
  //=> false

forceAppend(aList, aList.rest.rest);

teleportingTurtle(aList);
  //=> true
```

  몇 년 후, 저는 이 알고리즘에 대한 논의를 접하게 되었고, 텔레포팅 거북이 이야기[The Tale of the Teleporting Turtle](http://www.penzba.co.uk/Writings/TheTeleportingTurtle.html).를 알게 되었습니다. 이 알고리즘은 루프의 크기와 특정 작업의 상대적 비용에 따라 특정 상황에서 더 빠를 수 있습니다.

이 두 알고리즘의 흥미로운 점은 둘 다 두 가지 별개의 문제를 얽히게 한다는 것입니다: 데이터 구조를 탐색하는 방법과 만나는 요소에 대해 무엇을 할 것인지. 함수적 반복자에서는 이러한 문제를 분리하는 한 가지 패턴을 탐구할 것입니다.
