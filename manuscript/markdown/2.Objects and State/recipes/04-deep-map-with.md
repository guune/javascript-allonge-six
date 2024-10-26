## Deep Mapping {#deepMapWith}

mapWith는 훌륭한 도구이지만, 때때로 트리(tree)를 나타내는 배열을 다루어야 하는 경우가 있습니다. 예를 들어, 다음은 어떤 종류의 보고서에서 추출한 판매의 부분 목록입니다. 이 목록은 신비롭게도 그룹화되어 있으며, 보고서의 각 항목에 대해 작업을 수행해야 합니다.

```js
    const report = 
      [ [ { price: 1.99, id: 1 },
        { price: 4.99, id: 2 },
        { price: 7.99, id: 3 },
        { price: 1.99, id: 4 },
        { price: 2.99, id: 5 },
        { price: 6.99, id: 6 } ],
      [ { price: 5.99, id: 21 },
        { price: 1.99, id: 22 },
        { price: 1.99, id: 23 },
        { price: 1.99, id: 24 },
        { price: 5.99, id: 25 } ],

      // ...

      [ { price: 7.99, id: 221 },
        { price: 4.99, id: 222 },
        { price: 7.99, id: 223 },
        { price: 10.99, id: 224 },
        { price: 9.99, id: 225 },
        { price: 9.99, id: 226 } ] ];
```

우리는 중첩된 `mapWith`를 사용할 수 있지만, 사람은 도구를 사용하는 존재입니다. 만약 우리가 맛있는 개미를 꺼내기 위해 막대를 사용할 수 있다면, 배열 작업을 자동화할 수 있습니다:

```js
    const deepMapWith = (fn) =>
      function innerdeepMapWith (tree) {
        return Array.prototype.map.call(tree, (element) =>
          Array.isArray(element)
            ? innerdeepMapWith(element)
            : fn(element)
        );
      };
```

이제 우리는 `deepMapWith`를 사용하여 트리에 대해 작업할 수 있습니다. 마치 평면 배열에 대해 `mapWith`를 사용하는 것처럼 말이죠:

```js
    deepMapWith(getWith('price'))(report)
      //=>  [ [ 1.99,
                4.99,
                7.99,
                1.99,
                2.99,
                6.99 ],
              [ 5.99,
                1.99,
                1.99,
                1.99,
                5.99 ],
                
              // ...
              
              [ 7.99,
                4.99,
                7.99,
                10.99,
                9.99,
                9.99 ] ]
```

트리 형태의 데이터를 다시 살펴볼 기회가 있을 것이며, 컬렉션에서 TreeIterators를 살펴보겠습니다.
