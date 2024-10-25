## Once

`once`은 매우 유용한 결합어입니다. 함수를 *한 번만* 호출할 수 있도록 해줍니다. 여기 레시피가 있습니다:

    const once = (fn) => {
      let done = false;

      return function () {
        return done ? void 0 : ((done = true), fn.apply(this, arguments))
      }
    }

아주 간단합니다! 함수를 전달하고 함수를 반환받으면 됩니다. 그 함수는 여러분의 함수를 한 번 호출하고 그 이후에는 호출될 때마다 '정의되지 않음'을 반환합니다. 한번 해봅시다:

    const askedOnBlindDate = once(
      () => "sure, why not?"
    );

    askedOnBlindDate()
      //=> 'sure, why not?'

    askedOnBlindDate()
      //=> undefined

    askedOnBlindDate()
      //=> undefined

어떤 사람들은 소개팅을 한 번만 시도하는 것 같습니다.

(참고: `once`와 같은 데코레이터에는 state와 메서드의 교차점과 관련된 몇 가지 미묘한 점이 있습니다. 상태 저장 메서드 데코레이터]에서 다시 살펴보겠습니다 [stateful method decorators](#stateful-method-decorators).)
