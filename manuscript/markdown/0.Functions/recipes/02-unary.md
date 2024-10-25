## Unary

“단항"은 함수가 취하는 인수의 개수를 수정하는 함수 데코레이터입니다:   
단항은 어떤 함수를 받아 정확히 하나의 인수를 받는 함수로 바꿉니다.

가장 일반적인 사용 사례는 문제를 해결하는 것입니다.   
JavaScript에는 배열을 위한 '.map' 메서드가 있으며, 많은 라이브러리에서 동일한 의미의 `map` 함수를 제공합니다. 다음은 실제 사용 예시입니다:

    ['1', '2', '3'].map(parseFloat)
      //=> [1, 2, 3]
      
이 예제에서는 대부분의 언어에서 볼 수 있는 매핑 함수와 똑같이 보입니다:   
함수를 전달하면 배열의 요소라는 하나의 인자로 함수를 호출합니다. 하지만 이것이 전부는 아닙니다. JavaScript의 `map`은 실제로 *세 개의* 인수를 사용하여 각 함수를 호출합니다: 요소, 배열에 있는 요소의 인덱스, 배열 자체입니다.

한번 해봅시다:

    [1, 2, 3].map(function (element, index, arr) {
      console.log({element: element, index: index, arr: arr})
    })
      //=> { element: 1, index: 0, arr: [ 1, 2, 3 ] }
      //   { element: 2, index: 1, arr: [ 1, 2, 3 ] }
      //   { element: 3, index: 2, arr: [ 1, 2, 3 ] }
      
인수를 하나만 받는 함수를 전달하면 추가 인수는 무시됩니다. 하지만 일부 함수에는 선택적으로 두 번째 또는 세 번째 인수가 있습니다. 예를 들어

    ['1', '2', '3'].map(parseInt)
      //=> [1, NaN, NaN]

이 함수는 `parseInt`가 `parseInt(string[, radix])`로 정의되어 있기 때문에 작동하지 않습니다. 이 함수는 선택적 기수 인수를 받습니다. 그리고 `map`과 함께 `parseInt`를 호출하면 인덱스가 기수로 해석됩니다. 좋지 않습니다! 우리가 원하는 것은 `parseInt`를 하나의 인자만 받는 함수로 변환하는 것입니다.

'['1', '2', '3'].map((s) => parseInt(s))`를 작성하거나 데코레이터를 만들어서 이 작업을 수행할 수 있습니다:

    const unary = (fn) =>
      fn.length === 1
        ? fn
        : function (something) {
            return fn.call(this, something)
          }

이제 작성할 수 있습니다:

    ['1', '2', '3'].map(unary(parseInt))
      //=> [1, 2, 3]
      
완성!
