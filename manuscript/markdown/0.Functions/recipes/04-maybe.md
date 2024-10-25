## Maybe {#maybe}

프로그래밍에서 흔히 발생하는 문제는 `null` 또는 `정의되지 않음`(이하 `0`, `[]` 및 `false`를 포함한 다른 모든 값을 `무엇`이라고 하며, `무엇이 아닌 것`이라고 함)을 검사하는 것입니다. 자바스크립트와 같은 언어는 특정 변수나 특정 프로퍼티가 '무언가'라는 개념을 강력하게 강제하지 않기 때문에 프로그램은 종종 아무것도 아닐 수 있는 값을 설명하도록 작성됩니다.

이 레시피는 매우 일반적인 패턴에 관한 것입니다. `fn` 함수는 값을 매개변수로 받는데, 이 함수는 매개변수가 아무것도 아닌 경우 아무 작업도 수행하지 않는 것으로 설계되어 있습니다:

    const isSomething = (value) =>
      value !== null && value !== void 0;

    const checksForSomething = (value) => {
      if (isSomething(value)) {
        // function's true logic
      }
    }

또는 함수가 어떤 값으로든 작동하도록 의도되었지만 함수를 호출하는 코드가 아무것도 주어지지 않았을 때 설계상 아무것도 하지 않는 동작을 모방하고자 할 수도 있습니다:

    var something =
      isSomething(value)
        ? doesntCheckForSomething(value)
        : value;

당연히 이를 위한 함수 데코레이터 레시피가 있는데, 하스켈의 [maybe monad][maybe], Ruby의 [andand], CoffeeScript의 실존 메서드 호출에서 빌려온 것입니다:

    const maybe = (fn) =>
      function (...args) {
        if (args.length === 0) {
          return
        }
        else {
          for (let arg of args) {
            if (arg == null) return;
          }
          return fn.apply(this, args)
        }
      }

`maybe`은 아무것도 없는지 확인하는 로직을 함수 호출로 축소합니다:

    maybe((a, b, c) => a + b + c)(1, 2, 3)
      //=> 6

    maybe((a, b, c) => a + b + c)(1, null, 3)
      //=> undefined

보너스로, `maybe`는 인스턴스 메서드와 매우 잘 어울리므로 [later](#classes) 이에 대해 설명하겠습니다:

    function Model () {};

    Model.prototype.setSomething = maybe(function (value) {
      this.something = value;
    });

일부 코드에서 `model.setSomething`을 아무것도 없이 호출하려고 시도하면 작업이 건너뛰게 됩니다.

[andand]: https://github.com/raganwald/andand
[maybe]: https://en.wikipedia.org/wiki/Monad_(functional_programming)#The_Maybe_monad
