## Invoke {#invoke}

전송(send)은 객체의 메서드를 호출할 때 유용합니다. 그러나 때때로 객체의 컨텍스트 내에서 실행되도록 설계된 함수를 호출하고 싶을 때가 있습니다. 이는 일반적으로 한 "클래스"의 메서드를 빌려서 다른 객체에서 사용하고자 할 때 발생합니다.


이것은 전례가 없는 사용 사례가 아닙니다. 루비 프로그래밍 언어에는 [instance_exec] 유용한 기능이 있습니다. 이는 임의의 코드 블록을 어떤 객체의 컨텍스트에서 실행할 수 있게 해줍니다. 이게 익숙하게 들리나요? 자바스크립트에도 이와 같은 기능이 있으며, 우리는 이를 .apply(또는 필요에 따라 .call)라고 부릅니다. 우리는 어떤 함수를 어떤 임의의 객체의 컨텍스트에서 실행할 수 있습니다.

[instance_exec]: http://www.ruby-doc.org/core-1.8.7/Object.html#method-i-instance_exec

문제는 .apply가 메서드이기 때문에 다른 함수(예: 조합자)와 잘 결합되지 않는다는 점입니다. 그래서 우리는 이를 조합자로 사용할 수 있도록 하는 함수를 생성합니다:

    const invoke = (fn, ...args) =>
      instance => fn.apply(instance, args);

예를 들어, 누군가의 코드가 부분적으로는 배열 같지만 완전히 배열은 아닌 객체의 배열을 제공한다고 가정해 보겠습니다. 예를 들어:

    const data = [
      { 0: 'zero', 
        1: 'one', 
        2: 'two',
        length: 3},
      { 0: 'none',
        length: 1 },
      // ...
    ];
    
만약 그들이 배열이었다면, 우리는 다음과 같이 복사했을 것입니다:

    mapWith(send('slice', 0))(data)
  
배열은 `.send` 메서드를 가지고 있으니까요. 하지만 우리의 준 배열(quasi-array)에는 그런 것이 없습니다. 그래서 우리는 배열에서 `.slice` 메서드를 빌리고 싶지만, 이를 우리의 데이터에서 작동하게 하려 합니다. `invoke([].slice, 0)`가 해결책이 됩니다:


    mapWith(invoke([].slice, 0))(data)
      //=> [
             ["zero","one","two"],
             ["none"],
             // ...
           ]

### 인스턴스 평가
`invoke`는 함수가 있고 인스턴스를 찾고 있을 때 유용합니다. 반대로 인스턴스가 있고 함수가 필요할 때 "다른 방향"으로 작성할 수 있습니다:

    const instanceEval = instance =>
      (fn, ...args) => fn.apply(instance, args);
