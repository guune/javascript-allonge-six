## Send {#send}

이전에 우리는 레시피 bound를 사용하여 인스턴스에서 바인드된 메서드를 가져올 수 있음을 보았습니다. 불행히도 이러한 메서드를 호출하는 것은 다소 번거롭습니다:

    mapWith(bound('eggs'))(inventories).map(
      boundmethod => boundmethod() 
    )
      //=> [ 36, 12, 42 ]

우리가 언급했듯이

    boundmethod => boundmethod()

이렇게 쓰는 것은 보기 좋지 않습니다. 따라서 우리는 새로운 레시피를 작성합니다:

    const send = (methodName, ...args) =>
      (instance) => instance[methodName].apply(instance, args);

    mapWith(send('apples'))(inventories)
      //=> [ 0, 240, 24 ]
      
`send('apples')`는 루비 프로그래밍 언어에서 `&:apples`와 매우 유사하게 작동합니다. 왜 `bound`를 유지하냐고 물을 수도 있습니다. 가끔은 즉시 평가하고 싶지 않은 함수가 필요할 때가 있습니다. 예를 들어, 콜백을 생성할 때 그렇습니다. `bound`는 그런 경우에 잘 작동합니다.
