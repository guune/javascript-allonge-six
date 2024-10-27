## Fluent {#fluent}

객체 및 인스턴스 메서드는 두 가지 클래스로 분류될 수 있습니다: 무언가를 쿼리하는 메서드와 무언가를 업데이트하는 메서드입니다. 대부분의 디자인 철학에서는 업데이트 메서드가 업데이트되는 값을 반환하도록 구성합니다. 예를 들어:

    class Cake {
      setFlavour (flavour) { 
        return this.flavour = flavour 
      },
      setLayers (layers) { 
        return this.layers = layers 
      },
      bake () {
        // do some baking
      }
    }
    
    const cake = new Cake();
    cake.setFlavour('chocolate');
    cake.setLayers(3);
    cake.bake();

`setFlavour`와 같은 메서드가 설정되는 값을 반환하는 것은 할당의 동작을 모방합니다. 여기서 `cake.flavour = '초콜릿'`은 속성을 설정하는 것 외에도 값 `'초콜릿'`으로 평가되는 표현식입니다.


유창한[fluent] 스타일은 업데이트를 수행할 때 대개 인수로 전달된 값보다 수신자와 함께 다른 작업을 수행하는 것에 더 관심이 있다고 가정합니다. 따라서 규칙은 메서드가 쿼리가 아닌 경우 수신자를 반환하는 것입니다:

    class Cake {
      setFlavour (flavour) { 
        this.flavour = flavour;
        return this;
      },
      setLayers (layers) { 
        this.layers = layers;
        return this;
      },
      bake () {
        // do some baking
        return this;
      }
    }

이제 케이크와 작업하는 코드는 더 읽기 쉽고 덜 반복적입니다:

    const cake = new Cake().
                   setFlavour('chocolate').
                   setLayers(3).
                   bake();

속성을 설정하는 것과 같은 원라인 코드에는 이 방식이 좋습니다. 그러나 일부 함수는 더 길고, 메서드의 의도를 상단에 신호하고 싶습니다. 일반적으로 이는 메서드의 이름에서 수행되지만, 유창한 인터페이스는 `setLayersAndReturnThis`와 같은 메서드를 포함하도록 작성되지 않습니다.


[fluent]: https://en.wikipedia.org/wiki/Fluent_interface

자신의 프로토타입을 작성할 때 fluent 메서드 데코레이터는 이 문제를 해결합니다:

    const fluent = (methodBody) =>
      function (...args) {
        methodBody.apply(this, args);
        return this;
      }

이제 다음과 같이 메서드를 작성할 수 있습니다:

    function Cake () {}

    Cake.prototype.setFlavour = fluent( function (flavour) { 
      this.flavour = flavour;
    });

이 메서드가 "유창하다"는 것이 한눈에 분명합니다.

class 키워드를 사용할 때도 유사한 방식으로 함수를 장식할 수 있습니다:

    class Cake {
      setFlavour (flavour) { 
        this.flavour = flavour;
      },
      setLayers (layers) { 
        this.layers = layers;
      },
      bake () {
        // do some baking
      }
    }
    Cake.prototype.setFlavour = fluent(Cake.prototype.setFlavour);
    Cake.prototype.setLayers = fluent(Cake.prototype.setLayers);
    Cake.prototype.bake = fluent(Cake.prototype.bake);
    
또는 약간의 변형을 작성할 수도 있습니다:

    const fluent = (methodBody) =>
      function (...args) {
        methodBody.apply(this, args);
        return this;
      }
    
    const fluentClass = (clazz, ...methodNames) {
      for (let methodName of methodNames) {
        clazz.prototype[methodName] = fluent(clazz.prototype[methodName]);
      }
      return clazz;
    }
    
Now we can simply write:

    fluentClass(Cake, 'setFlavour', 'setLayers', 'bake');
