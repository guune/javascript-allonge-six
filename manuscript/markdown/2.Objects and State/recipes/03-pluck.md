## pluckWith {#pluck}

`mapWith`와 `getWith`를 결합하는 패턴은 JavaScript 코드에서 매우 자주 사용됩니다. 그래서 이를 한 단계 더 발전시킬 수 있습니다:

```js
    const pluckWith = (attr) => mapWith(getWith(attr));
```
    
혹은 더 나은 방법으로:


```js
    const pluckWith = compose(mapWith, getWith);
```

이제 우리는 다음과 같이 쓸 수 있습니다:

```js
    const inventories = [
      { apples: 0, oranges: 144, eggs: 36 },
      { apples: 240, oranges: 54, eggs: 12 },
      { apples: 24, oranges: 12, eggs: 42 }
    ];
    
    pluckWith('eggs')(inventories)
      //=> [ 36, 12, 42 ]
 ```

Underscore와 같은 라이브러리는 pluck을 제공하는데, 이는 pluckWith의 반전 버전입니다:

```js
    _.pluck(inventories, 'eggs')
      //=> [ 36, 12, 42 ]

이러한 조합은 함수를 명명할 때 더 간결해집니다:


```js
    const eggsByStore = pluckWith('eggs');
```

vs.

```js
    const eggsByStore = (inventories) =>
      _.pluck(inventories, 'eggs');
```

물론, 우리가 pluck이 있다면, flip을 사용하여 pluckWith를 도출할 수 있습니다:

```js
    const pluckWith = flip(_.pluck);
```
[Underscore]: http://underscorejs.org
