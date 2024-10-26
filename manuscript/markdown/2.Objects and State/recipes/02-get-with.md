## getWith {#getWith}

`getWith`는 매우 간단한 함수입니다. 이 함수는 속성의 이름을 받아서 해당 속성의 값을 객체에서 추출하는 함수를 반환합니다:


```js
    const getWith = (attr) => (object) => object[attr]
```

You can use it like this:

```js

    const inventory = {
      apples: 0,
      oranges: 144,
      eggs: 36
    };

    getWith('oranges')(inventory)
```
      //=> 144

아직까지는 그리 유용한 레시피는 아닙니다. 그러나 이것을 mapWith와 결합해 보겠습니다:

```js

    const inventories = [
      { apples: 0, oranges: 144, eggs: 36 },
      { apples: 240, oranges: 54, eggs: 12 },
      { apples: 24, oranges: 12, eggs: 42 }
    ];

    mapWith(getWith('oranges'))(inventories)
      //=> [ 144, 54, 12 ]
```

이렇게 작성하는 것보다 "길게" 쓰는 것보다 훨씬 좋습니다:

```js

    mapWith((inventory) => inventory.oranges)(inventories)
      //=> [ 144, 54, 12 ]
```

getWith는 maybe와도 잘 어울립니다. 희소 배열을 고려해 보세요. 다음과 같이 사용할 수 있습니다:

    mapWith(maybe(getWith('oranges')))

이렇게 하면 목록의 모든 null이 아닌 인벤토리에서 오렌지 수를 가져올 수 있습니다.

### 이름의 의미는?

왜 이걸 `getWith`라고 부를까요? 다음과 같은 함수가 있습니다. 함수와 사전은 있지만 메서드가 없는 언어에서 일반적으로 사용됩니다:

```js
    const get = (object, attr) => object[attr];
```

"왜 `[]` 대신 함수를 사용하나요?"라는 질문이 있을 수 있습니다. 그 대답은, 우리는 문법으로 할 수 없는 방식으로 함수를 조작할 수 있기 때문입니다. 예를 들어, flip에서 map을 사용하여 mapWith를 정의할 수 있었던 것을 기억하시나요?

```js
    var mapWith = flip(map);
```

우리는 getWith에 대해서도 같은 작업을 수행할 수 있습니다. 그래서 이 함수는 이렇게 이름 지어졌습니다:

```js
    var getWith = flip(get)
```
