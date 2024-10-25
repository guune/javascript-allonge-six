## 부분 적용 {#simple-partial}

빌딩 블록에서 부분 적용에 대해 설명했지만 일반화된 레시피는 작성하지 않았습니다. 부분 적용은 매우 일반적인 도구이므로 많은 라이브러리에서 부분 적용의 형태를 제공합니다. 마이클 포거스의  [Lemonad](https://github.com/fogus/lemonad) , 올리버 스틸의 함수형 자바스크립트[Functional JavaScript](http://osteele.com/sources/javascript/functional/), 제임스 할리데이의 간결하지만 편리한 노드-ap[node-ap](https://github.com/substack/node-ap)에서 예제를 찾을 수 있습니다.


이 두 가지 레시피는 가장 왼쪽 또는 가장 오른쪽에 있는 하나의 인수를 빠르고 간단하게 적용하기 위한 것입니다.[^inspired] 둘 이상의 인수를 바인딩하거나 인수 목록에 “구멍”을 남기려면 일반화된 부분 레시피를 사용하거나 인수를 반복적으로 적용해야 합니다. 문맥에 구애받지 않습니다.

```js
    const callFirst = (fn, larg) =>
      function (...rest) {
        return fn.call(this, larg, ...rest);
      }
    
    const callLast = (fn, rarg) =>
      function (...rest) {
        return fn.call(this, ...rest, rarg);
      }
    
    const greet = (me, you) =>
      `Hello, ${you}, my name is ${me}`;
      
    const heliosSaysHello = callFirst(greet, 'Helios');
    
    heliosSaysHello('Eartha')
      //=> 'Hello, Eartha, my name is Helios'
      
    const sayHelloToCeline = callLast(greet, 'Celine');
    
    sayHelloToCeline('Eartha')
      //=> 'Hello, Celine, my name is Eartha'
```
   
위에서 언급했듯이 부분 레시피를 사용하면 컨텍스트를 인식하는 함수의 부분 응용 프로그램인 함수를 만들 수 있습니다. 객체 메서드의 부분 응용 프로그램을 만들려면 다른 레시피가 필요합니다.

여기서 한 걸음 더 나아가 수집과 확산을 사용해 둘 이상의 인수를 가진 부분 적용을 허용할 수 있습니다:

```js
    const callLeft = (fn, ...args) =>
        (...remainingArgs) =>
          fn(...args, ...remainingArgs);

    const callRight = (fn, ...args) =>
        (...remainingArgs) =>
          fn(...remainingArgs, ...args);
```

[^inspired]: callFirst and callLast were inspired by Michael Fogus’ Lemonad.   
