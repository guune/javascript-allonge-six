## 그 끊임없는 커피 갈망 {#const}

지금까지 우리가 실제로 본 것은 *익명 함수*들, 즉 이름이 없는 함수들뿐입니다. 이는 대부분의 다른 프로그래밍 언어들과는 매우 다르게 느껴집니다. 다른 언어들에서는 함수, 메서드, 프로시저에 이름을 붙이는 것에 중점을 둡니다. 이름을 붙이는 것은 프로그래밍의 중요한 부분이지만, 지금까지 우리가 본 것은 인자에 이름을 붙이는 방법뿐이었습니다.

JavaScript에서 다른 것들에 이름을 붙이는 방법들이 있지만, 그것들을 배우기 전에 우리가 이미 알고 있는 것을 사용해서 이름을 붙이는 방법을 살펴보겠습니다. 매우 간단한 예제를 다시 살펴보겠습니다:

    (diameter) => diameter * 3.14159265

이 "3.14159265" 숫자는 무엇일까요? 당연히 PI입니다[PI]. 우리는 이것에 이름을 붙여서 다음과 같이 쓰고 싶습니다:

    (diameter) => diameter * PI

`3.14159265`를 `PI`라는 이름에 바인딩하기 위해서는, `PI`라는 매개변수를 가진 함수에 `3.14159265`라는 인자를 적용해야 할 것입니다. 우리의 함수 표현식을 괄호로 감싸면, `3.14159265`라는 인자에 적용할 수 있습니다:

    ((PI) => 
      // ????
    )(3.14159265)

평가될 때 `3.14159265`를 이름 `PI`에 바인딩하는 이 새로운 함수 안에 무엇을 넣어야 할까요? 당연히 우리의 원둘레 함수입니다:

[PI]: https://en.wikipedia.org/wiki/Pi

    ((PI) =>
      (diameter) => diameter * PI
    )(3.14159265)

이 표현식은 평가될 때 원둘레를 계산하는 함수를 반환합니다. 그것은 나쁘게 들릴 수 있지만, 생각해보면 `(diameter) => diameter * 3.14159265` 또한 평가될 때 원둘레를 계산하는 함수를 반환하는 표현식입니다. 우리의 모든 "함수들"은 표현식입니다. 이것은 단지 몇 가지 더 많은 동작하는 부분들을 가지고 있을 뿐입니다. 하지만 우리는 이것을 `(diameter) => diameter * 3.14159265`처럼 사용할 수 있습니다.

테스트해 봅시다:

    ((diameter) => diameter * 3.14159265)(2)
      //=> 6.2831853
      
    ((PI) =>
      (diameter) => diameter * PI
    )(3.14159265)(2)
      //=> 6.2831853

작동합니다! 우리가 바인딩하고 싶은 값으로 즉시 호출되는 함수로 감싸서 표현식에서 무엇이든 바인딩할 수 있습니다.[^explain-iife]

[^explain-iife]: JavaScript 프로그래머들은 함수를 나타내는 표현식을 작성하고 즉시 인자에 적용하는 아이디어를 정기적으로 사용합니다. 이 패턴을 설명하면서, Ben Alman은 이것을 [Immediately Invoked Function Expression][iife]이라고 명명했으며, 흔히 "IIFE"로 줄여 씁니다. 

### 안에서 밖으로

`3.14159265`를 이름 `PI`에 바인딩하고 그것을 표현식에서 사용하는 함수를 만드는 또 다른 방법이 있습니다. 바인딩을 지름 계산 함수 안에 넣어서 안에서 밖으로 뒤집을 수 있습니다:

    (diameter) =>
      ((PI) =>
        diameter * PI)(3.14159265)

이는 지름 계산 함수에 대한 이전 표현식들과 동일한 결과를 만듭니다:

    ((diameter) => diameter * 3.14159265)(2)
      //=> 6.2831853
      
    ((PI) =>
      (diameter) => diameter * PI
    )(3.14159265)(2)
      //=> 6.2831853

    ((diameter) =>
      ((PI) =>
        diameter * PI)(3.14159265))(2)
      //=> 6.2831853

어느 것이 더 좋을까요? 첫 번째가 가장 간단해 보이지만, 반세기의 경험은 이름이 중요하다는 것을 가르쳐 주었습니다. `3.14159265`와 같은 "매직 리터럴"은 지속 가능한 소프트웨어 개발에 있어서 혐오스러운 것입니다.

세 번째가 대부분의 사람들이 읽기에 가장 쉽습니다. 이는 관심사를 잘 분리합니다: "외부" 함수는 그것의 매개변수들을 설명합니다:

    (diameter) =>
      // ...

나머지 모든 것은 그것의 본문에 캡슐화되어 있습니다. 그래야만 합니다. PI의 이름 짓기는 그것의 관심사이지, 우리의 관심사가 아닙니다.   
다른 공식은:

    ((PI) =>
      // ...
    )(3.14159265)

PI의 이름 짓기를 먼저 "노출"하고, 우리가 왜 신경 써야 하는지 알기 위해서는 안을 들여다봐야 합니다.   
그렇다면 우리는 항상 이렇게 써야 할까요?

    (diameter) =>
      ((PI) =>
        diameter * PI)(3.14159265)
      
음, 이것의 문제는 일반적으로 함수를 호출하는 것이 표현식을 평가하는 것보다 상당히 더 비용이 많이 든다는 것입니다. 외부 함수를 호출할 때마다 내부 함수를 호출하게 될 것입니다. 우리는 이렇게 작성함으로써 이를 피할 수 있습니다:
      
    ((PI) =>
      (diameter) => diameter * PI
    )(3.14159265)
    
하지만 그러면 우리의 코드가 모호해지고, 우리는 절대적으로 필요한 경우가 아니라면 그렇게 하고 싶지 않습니다.

함수 호출의 비용을 들이지 않고 블록 내부에서 이름을 바인딩할 수 있는 방법을 언어가 제공한다면 매우 좋을 것입니다. 그리고 JavaScript는 그렇게 합니다.

### const

우리의 "원둘레" 함수를 작성하는 또 다른 방법은 지름 인자와 함께 PI를 전달하는 것입니다, 이런 식으로:

    (diameter, PI) => diameter * PI

그리고 우리는 이렇게 사용할 수 있습니다:

    ((diameter, PI) => diameter * PI)(2, 3.14159265)
      //=> 6.2831853

이것은 두 개가 아닌 하나의 환경만 있다는 점에서 위의 예제와 다릅니다. 우리는 환경에서 우리의 일반 인자를 나타내는 하나의 바인딩과 우리의 "상수"를 나타내는 또 다른 바인딩을 가지고 있습니다. 그것이 더 효율적이며, 우리가 처음부터 원했던 것과 *거의* 같습니다: `3.14159265`를 읽기 쉬운 이름에 바인딩하는 방법입니다.

JavaScript는 우리에게 그렇게 할 수 있는 방법을 제공합니다, 바로 `const` 키워드입니다. 우리는 앞으로의 장에서 `const`에 대해 더 많이 배울 것이지만, 여기 우리가 `const`로 할 수 있는 가장 중요한 것이 있습니다:

    (diameter) => {
      const PI = 3.14159265;

      return diameter * PI
    }

`const` 키워드는 그것을 감싸는 블록에 하나 이상의 바인딩을 도입합니다. 이는 함수 호출의 비용이 들지 않습니다. 그것은 훌륭합니다. 더 좋은 것은, 그것이 심볼(예: `PI`)을 값(`3.14159265`)과 가깝게 둔다는 것입니다. 그것은 우리가 이전에 쓰던 것보다 훨씬 더 좋습니다.

우리는 *const 문*에서 `const` 키워드를 사용합니다. `const` 문은 블록 안에서 발생하며, 표현식을 본문으로 하는 화살표 함수를 작성할 때는 사용할 수 없습니다.

이것은 우리가 원하는 대로 작동합니다.   
다음과 같이 쓰는 대신:

    ((diameter) =>
      ((PI) =>
        diameter * PI)(3.14159265))(2)
        
또는:

    ((diameter, PI) => diameter * PI)(2, 3.14159265)
      //=> 6.2831853
      
우리는 이렇게 씁니다:

    ((diameter) => {
      const PI = 3.14159265;

      return diameter * PI
    })(2)
      //=> 6.2831853

우리는 어떤 표현식이든 바인딩할 수 있습니다. 함수는 표현식이므로, 우리는 헬퍼 함수를 바인딩할 수 있습니다:

    (d) => {
      const calc = (diameter) => {
        const PI = 3.14159265;

        return diameter * PI
      };

      return "The circumference is " + calc(d)
    }

calc(d)를 보셨나요? 이는 우리가 이야기했던 것을 강조합니다: 함수로 평가되는 표현식이 있다면, 우리는 ()를 사용하여 이를 적용합니다. 함수에 바인딩된 이름은 함수로 평가되는 유효한 표현식입니다.[^namedfn]

[^namedfn]: 두 번째 장에 와서야 드디어 함수의 이름을 지었네요. 허허.

> 함수 이름 짓기라는 이렇게 중요한 개념이 몇 마디 말로 *походя*(походя는 러시아어로 '지나가는 길에'라는 뜻) 설명될 수 있다는 것이 놀랍습니다. 이는 JavaScript가 정말로, 정말로 잘 해낸 것 중 하나를 강조합니다: "일급 객체"로서의 함수입니다. 함수는 다른 값들처럼 이름에 바인딩될 수 있고, 인자로 전달될 수 있으며, 다른 함수에서 반환될 수 있는 등의 값입니다.

쉼표로 구분하여 여러 개의 이름-값 쌍을 바인딩할 수 있습니다. 가독성을 위해 대부분의 사람들은 한 줄에 하나의 바인딩을 둡니다:

    (d) => {
      const PI   = 3.14159265,
          calc = (diameter) => diameter * PI;

      return "The circumference is " + calc(d)
    }

### 중첩된 블록

지금까지는 함수의 본문으로 사용하는 블록만 봤습니다. 하지만 다른 종류의 블록들도 있습니다. 블록을 찾을 수 있는 곳 중 하나는 `if` 문입니다. JavaScript에서 `if` 문은 다음과 같이 생겼습니다:

    (n) => {
      const even = (x) => {
        if (x === 0)
          return true;
        else
          return !even(x - 1);
      }
      return even(n)
    }
    
그리고 이는 비교적 작은 숫자에 대해 잘 작동합니다:

    ((n) => {
      const even = (x) => {
        if (x === 0)
          return true;
        else
          return !even(x - 1);
      }
      return even(n)
    })(13)
      //=> false

`if` 문은 표현식이 아닌 문장입니다(불행한 디자인 선택이죠), 그리고 그것의 절들은 문장이나 블록입니다. 그래서 우리는 다음과 같이 작성할 수도 있습니다:

    (n) => {
      const even = (x) => {
        if (x === 0)
          return true;
        else {
          const odd = (y) => !even(y);
          
          return odd(x - 1);
        }
      }
      return even(n)
    }

그리고 이것도 작동합니다:

    ((n) => {
      const even = (x) => {
        if (x === 0)
          return true;
        else {
          const odd = (y) => !even(y);
          
          return odd(x - 1);
        }
      }
      return even(n)
    })(42)
      //=> true
    
우리는 `else` 절로 블록을 사용했고, 블록이기 때문에 그 안에 `const` 문을 배치했습니다.

### const와 렉시컬 스코프

이것은 매우 직관적으로 보이지만, 아쉽게도 우리가 `const`를 원하는 곳 어디에나 배치하려면 이해해야 할 이름 바인딩의 의미론이 있습니다. 첫 번째로 물어봐야 할 것은, "같은" 이름에 두 개의 다른 값을 `const`로 바인딩하면 어떻게 되는가입니다.

클로저가 어떻게 작동하는지 다시 생각해봅시다. 매개변수를 사용하여 같은 이름에 두 개의 다른 값을 바인딩하면 어떻게 될까요?

여기 IIFE를 사용하여 이름에 바인딩된 우리의 지름 함수의 두 번째 공식이 있습니다:

    ((diameter_fn) =>
      // ...
    )(
      ((PI) =>
        (diameter) => diameter * PI
      )(3.14159265)
    )

약간 복잡하지만, `((PI) => (diameter) => diameter * PI)(3.14159265)`를 `diameter_fn`에 바인딩하고 우리가 생략한 표현식을 평가합니다. 우리는 거기에 어떤 표현식이든 사용할 수 있고, 그 표현식은 `diameter_fn`을 호출할 수 있습니다. 예를 들어:

    ((diameter_fn) =>
      diameter_fn(2)
    )(
      ((PI) =>
        (diameter) => diameter * PI
      )(3.14159265)
    )
      //=> 6.2831853
      
우리는 이것을 클로저 장에서 알고 있지만, `diameter_fn(2)`를 평가하여 `diameter_fn`을 호출할 때 `PI`가 바인딩되어 있지 않더라도, `(diameter) => diameter * PI`를 평가할 때 `PI`가 바인딩되어 있었고, 따라서 `diameter_fn`을 평가할 때 `diameter * PI` 표현식은 `PI`와 `diameter`의 값에 접근할 수 있습니다.

이를 [lexical scoping]이라고 합니다. 프로그램의 소스 코드를 보고 이름이 어디에 바인딩되어 있는지 알 수 있기 때문입니다. `PI`가 `(diameter) => diameter * PI`를 둘러싼 환경에 바인딩되어 있는 것을 볼 수 있으며, `diameter_fn`이 어디서 호출되는지 알 필요가 없습니다.

의도적으로 "충돌"을 만들어 이를 테스트할 수 있습니다:

    ((diameter_fn) =>
      ((PI) =>
        diameter_fn(2)
      )(3)
    )(
      ((PI) =>
        (diameter) => diameter * PI
      )(3.14159265)
    )
      //=> 6.2831853

`diameter_fn(2)`를 둘러싼 환경에서 `PI`에 `3`을 바인딩했지만, 중요한 값은 `(diameter) => diameter * PI`를 둘러싼 환경에서 `PI`에 바인딩한 `3.14159265`입니다.

클로저가 작동하는 방식에서 우리는 그만큼을 주의 깊게 파악할 수 있습니다. `const`도 같은 방식으로 작동할까요? 알아봅시다:

    ((diameter_fn) => {
      const PI = 3;
      
      return diameter_fn(2)
    })(
      (() => {
        const PI = 3.14159265;
        
        return (diameter) => diameter * PI
      })()
    )
      //=> 6.2831853

네. const로 이름에 값을 바인딩하는 것은 매개변수로 이름에 값을 바인딩하는 것과 똑같이 작동하며, 렉시컬 스코프를 사용합니다.

[lexical scoping]: https://en.wikipedia.org/wiki/Scope_(computer_science)#Lexical_scope_vs._dynamic_scope

### const도 그림자의 행성 출신일까요?

우리는 방금 const로 바인딩된 값들이 매개변수로 바인딩된 값들처럼 렉시컬 스코프를 사용한다는 것을 보았습니다. 이들은 선언된 환경에서 찾아집니다. 그리고 우리는 함수가 환경을 만든다는 것을 알고 있습니다. 매개변수는 함수를 만들 때 선언되므로, 매개변수가 함수를 호출할 때 생성되는 환경에 바인딩되는 것이 이치에 맞습니다.

하지만 const 문은 블록 안에 나타날 수 있고, 우리는 블록이 함수 본문을 포함한 다른 블록 안에 나타날 수 있다는 것을 보았습니다. 그렇다면 const 변수들은 어디에 바인딩될까요? 함수 환경에서? 아니면 블록에 해당하는 환경에서?

다른 충돌을 만들어 이를 테스트할 수 있습니다. 하지만 두 개의 다른 장소에서 같은 이름에 두 개의 다른 변수를 바인딩하는 대신, 같은 이름에 두 개의 다른 값을 바인딩할 것입니다. 단, 한 환경이 다른 환경을 완전히 포함할 것입니다.
먼저, 위와 같이 매개변수로 시작해보겠습니다:

    ((PI) =>
      (diameter) => diameter * PI
    )(3.14159265)

그리고 불필요하게 다른 IIFE로 감싸서 PI를 다른 것에 바인딩할 수 있게 합니다:

    ((PI) =>
      ((PI) =>
        (diameter) => diameter * PI
      )(3.14159265)
    )(3)
    
이것은 여전히 지름을 계산하는 함수로 평가됩니다:

    ((PI) =>
      ((PI) =>
        (diameter) => diameter * PI
      )(3.14159265)
    )(3)(2)
      //=> 6.2831853
      
그리고 우리는 `diameter * PI` 표현식이 가장 가까운 부모 환경에서 `PI`에 대한 바인딩을 사용한다는 것을 볼 수 있습니다. 하지만 한 가지 질문이 있습니다: `3.14159265`를 `PI`에 바인딩하는 것이 "외부" 환경의 바인딩을 어떻게든 변경했을까요? 조금 다르게 다시 작성해보겠습니다:

    ((PI) => {
      ((PI) => {})(3);
      
      return (diameter) => diameter * PI;
    })(3.14159265)
    
이제 우리는 `3.14159265`를 `PI`에 바인딩하는 IIFE 안에 있는 다른 빈 IIFE에서 `PI`에 `3`을 바인딩합니다. 그 바인딩이 외부 바인딩을 "덮어쓰나요"? 우리의 함수는 `6`을 반환할까요 아니면 `6.2831853`을 반환할까요? 이것은 책이고, 여러분은 이미 앞을 훑어보았으니, 답이 아니오라는 것을 알고 있습니다. 내부 바인딩은 외부 바인딩을 덮어쓰지 않습니다:

    ((PI) => {
      ((PI) => {})(3);
      
      return (diameter) => diameter * PI;
    })(3.14159265)(2)
      //=> 6.2831853
      
다른 바인딩 안에서 매개변수를 사용하여 변수를 바인딩할 때, 내부 바인딩이 외부 바인딩을 *가린다고* 합니다. 내부 바인딩은 자신의 스코프 안에서만 영향을 미치고, 둘러싸는 스코프의 바인딩에는 영향을 미치지 않습니다.

그렇다면 `const`는 어떨까요? 같은 방식으로 작동할까요?

    ((diameter) => {
      const PI = 3.14159265;
      
      (() => {
        const PI = 3;
      })();
      
      return diameter * PI;
    })(2)
      //=> 6.2831853

네, `const`로 바인딩된 이름들은 매개변수처럼 둘러싸는 바인딩을 가립니다. 하지만 잠깐! 더 있습니다!!!

매개변수는 함수를 호출할 때만 바인딩됩니다. 그래서 우리가 이 모든 IIFE를 만들었습니다. 하지만 `const` 문은 블록 안에 나타날 수 있습니다. 블록 안에서 `const`를 사용하면 어떻게 될까요?

불필요한 블록이 필요할 것입니다. 우리는 if 문을 보았는데, 다음보다 더 불필요한 것이 있을까요:

    if (true) {
      // an immediately invoked block statement (IIBS)
    }
    
Let's try it:

    ((diameter) => {
      const PI = 3;
      
      if (true) {
        const PI = 3.14159265;
      
        return diameter * PI;
      }
    })(2)
      //=> 6.2831853

    ((diameter) => {
      const PI = 3.14159265;
      
      if (true) {
        const PI = 3;
      }
      return diameter * PI;
    })(2)
      //=> 6.2831853
      
아하! `const` 구문은 함수에 의해 생성된 환경 내에서 바인딩된 값을 섀도잉할 뿐만 아니라, 블록에 의해 생성된 환경 내에서 바인딩된 값도 섀도잉합니다!

이것은 매우 중요합니다. 대안을 생각해보세요: 만약 `const`가 블록 내부에서 선언될 수 있지만 항상 함수의 스코프에서 이름을 바인딩한다면 어떨까요? 그런 경우, 다음과 같은 상황이 발생할 것입니다:

    ((diameter) => {
      const PI = 3.14159265;
      
      if (true) {
        const PI = 3;
      }
      return diameter * PI;
    })(2)
      //=> would return 6 if const had function scope
      
만약 `const`가 항상 함수의 환경에 정의된 이름에 값을 바인딩한다면, 블록 내부에 `const` 구문을 배치하는 것은 단순히 기존 이름을 재바인딩하여 이전 내용을 덮어쓰게 될 것입니다. 이는 매우 혼란스러울 것입니다. 그리고 이 코드는 "동작할" 것입니다:

    ((diameter) => {
      if (true) {
        const PI = 3.14159265;
      }
      return diameter * PI;
    })(2)
      //=> would return 6.2831853 if const had function scope

다시 말하지만, 혼란스럽습니다. 일반적으로, 우리는 이름을 필요한 곳에 최대한 가깝게 바인딩하기를 원합니다. 이 설계 규칙을 최소 권한의 원칙[plp]이라고 하며, 이는 품질과 보안에 모두 영향을 미칩니다. 블록 내부에서 이름을 바인딩할 수 있다는 것은, 만약 그 이름이 블록 내에서만 필요하다면 그 바인딩이 해당 이름과 상호작용할 필요가 없는 코드의 다른 부분으로 "누출"되지 않는다는 것을 의미합니다.


[plp]: https://en.wikipedia.org/wiki/Principle_of_least_privilege
    
### 재바인딩  {#rebinding-peek}

기본적으로 JavaScript는 매개변수로 바인딩된 이름에 새로운 값을 *재바인딩*하는 것을 허용합니다. 예를 들어, 다음과 같이 작성할 수 있습니다:

    const evenStevens = (n) => {
      if (n === 0) {
        return true;
      }
      else if (n == 1) {
        return false;
      }
      else {
        n = n - 2;
        return evenStevens(n);
      }
    }
    
    evenStevens(42)
      //=> true

`n = n - 2`; 라인은 이름 `n`에 새로운 값을 재바인딩합니다. 이에 대해서는 재할당 섹션에서 더 자세히 다룰 것입니다만, 그전에 `const`를 사용하여 바인딩된 이름으로 비슷한 작업을 시도해봅시다. 우리는 이미 `evenStevens`를 `const`로 바인딩했습니다. 이제 재바인딩을 시도해보겠습니다:


    evenStevens = (n) => {
      if (n === 0) {
        return true;
      }
      else if (n == 1) {
        return false;
      }
      else {
        return evenStevens(n - 2);
      }
    }
      //=> ERROR, evenStevens is read-only
      
JavaScript는 `const`로 바인딩된 이름을 재바인딩하는 것을 허용하지 않습니다. 새로운 함수나 블록 스코프에서 `const`를 사용하여 새로운 바인딩을 선언함으로써 섀도잉할 수는 있지만, 기존 스코프에서 `const`로 바인딩된 이름을 재바인딩할 수는 없습니다.

이는 매우 가치 있는 특성입니다. 왜냐하면 한눈에 무언가가 `const`로 바인딩되었다는 것을 볼 수 있으면, 그 값이 변경될 수 있다는 걱정을 할 필요가 없어 프로그램 분석이 크게 단순화되기 때문입니다.