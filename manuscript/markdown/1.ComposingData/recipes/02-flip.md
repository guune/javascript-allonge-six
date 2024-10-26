## Flip {#flip}

우리는 mapWith를 다음과 같이 작성했습니다:

```js
const mapWith = (fn) => (list) => list.map(fn);
```

이제 우리가 자체적으로 map 함수를 가지고 있다고 가정해 보겠습니다. 예를 들어, allong.es[allong.es](https://github.com/raganwald/allong.es) 라이브러리에서 가져온 것일 수도 있고, Underscor[Underscore](http://underscorejs.org)e에서 가져온 것일 수도 있습니다. 그러면 우리의 함수를 다음과 같이 작성할 수 있습니다:

    const mapWith = (fn) => (list) => map(list, fn);

여기서 우리는 두 가지 변환을 혼합하고 있음을 알 수 있습니다. 첫째, 우리는 인수의 순서를 뒤집고 있습니다. 이것을 간단하게 표현하면 다음과 같습니다:

    const mapWith = (fn, list) => map(list, fn);

둘째, 우리는 이 함수를 "커링(curring)"하고 있습니다. 즉, 두 개의 인수를 받는 함수를 정의하는 대신 첫 번째 인수를 받고, 두 번째 인수를 받는 함수를 반환하여 두 개의 인수를 함께 적용하는 형태입니다:

    const mapper = (list) => (fn) => map(list, fn);

이제 `map` 함수에 의존하는 `mapWith`의 구현으로 돌아가 보겠습니다:

    const mapWith = (fn) => (list) => map(list, fn);
    
우리는 이 두 가지 작업을 추출하여 `map`을 매개변수화하는 리팩토링을 진행할 것입니다. 첫 번째 단계는 매개변수에 일반적인 이름을 부여하는 것입니다:

    const mapWith = (first) => (second) => map(second, first);

그런 다음 전체를 함수로 감싸고 `map`을 추출합니다:

    const wrapper = (fn) =>
      (first) => (second) => fn(second, first);

이제 우리는 함수를 받아서 인수의 순서를 뒤집고, 커링을 적용하는 함수를 만들었습니다. 이를 `flipAndCurry`라고 부릅시다:

    const flipAndCurry = (fn) =>
      (first) => (second) => fn(second, first);
      
때때로 우리는 순서를 뒤집고 싶지만 커링하지 않고 원래 형태로 호출하고 싶을 수도 있습니다:

    const flip = (fn) =>
      (first, second) => fn(second, first);

이것은 유용합니다. 이제 우리는 mapWith를 다음과 같이 정의할 수 있습니다:

    var mapWith = flipAndCurry(map);

훨씬 더 깔끔해졌습니다!

### self-currying flip

때때로 우리는 함수를 뒤집고 싶지만, 커링된 형태(하나의 매개변수 전달)나 비커링된 형태(두 개의 매개변수 전달)로 호출할 수 있는 유연성을 유지하고 싶을 수 있습니다. 이를 `flip`으로 만들 수 있습니다:


    const flip = (fn) =>
      function (first, second) {
        if (arguments.length === 2) {
          return fn(second, first);
        }
        else {
          return function (second) {
            return fn(second, first);
          };
        };
      };

이제 `mapWith = flip(map)`으로 작성하면 `mapWith(fn, list)` 또는 `mapWith(fn)(list)` 형태로 호출할 수 있습니다.


### flipping methods

우리가 컨텍스트와 메서드에 대해 배울 때, flip은 현재의 컨텍스트를 잃어버리기 때문에 메서드를 뒤집는 데 사용할 수 없습니다. 이를 해결하기 위해 약간의 수정을 해줍니다:

    const flipAndCurry = (fn) =>
      (first) =>
        function (second) {
          return fn.call(this, second, first);
        }

    const flip = (fn) =>
      function (first, second) {
        return fn.call(this, second, first);
      }

    const flip = (fn) =>
      function (first, second) {
        if (arguments.length === 2) {
          return fn.call(this, second, first);
        }
        else {
          return function (second) {
            return fn.call(this, second, first);
          };
        };
      };

이렇게 하면 함수의 순서를 뒤집으면서도 원하는 형태로 호출할 수 있는 유연성을 유지할 수 있습니다.

