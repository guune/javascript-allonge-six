## Object.assign

객체의 속성을 할당하여 "확장"하고 싶어 하는 경우가 매우 흔합니다:

    const inventory = {
      apples: 12,
      oranges: 12
    };
    
    inventory.bananas = 54;
    inventory.pears = 24;

또한 한 객체의 속성을 다른 객체에 할당하고 싶어 하는 경우도 흔합니다:

[shallow copy]: https://en.wikipedia.org/wiki/Object_copy#Shallow_copy

      for (let fruit in shipment) {
        inventory[fruit] = shipment[fruit]
      }

이 두 가지 필요를 모두 충족시킬 수 있는 표준 함수가 `Object.assign`입니다. 빈 객체로 객체를 복사할 수 있습니다:

    Object.assign({}, {
      apples: 12,
      oranges: 12
    })
      //=> { apples: 12, oranges: 12 }

한 객체를 다른 객체로 확장할 수 있습니다:

    const inventory = {
      apples: 12,
      oranges: 12
    };
    
    const shipment = {
      bananas: 54,
      pears: 24
    }
    
    Object.assign(inventory, shipment)
      //=> { apples: 12,
      //     oranges: 12,
      //     bananas: 54,
      //     pears: 24 }
      
그리고 프로토타입에 대해 논의할 때는 `Object.assign`을 사용하여 다음과 같이 변환할 것입니다:

    const Queue = function () {
      this.array = [];
      this.head = 0;
      this.tail = -1
    };
      
    Queue.prototype.pushTail = function (value) {
      // ...
    };
    Queue.prototype.pullHead = function () {
      // ...
    };
    Queue.prototype.isEmpty = function () {
      // ...
    }

이를 다음과 같이 변환합니다:

    const Queue = function () {
      Object.assign(this, {
        array: [],
        head: 0,
        tail: -1
      })
    };
      
    Object.assign(Queue.prototype, {
      pushTail (value) {
        // ...
      },
      pullHead () {
        // ...
      },
      isEmpty () {
        // ...
      }      
    });
    
한 객체의 속성을 다른 객체로 할당하는 것(또는 "복제" 또는 "얕은 복사"라고도 함)은 이후에 믹스인과 같은 더 고급 패러다임을 구현하는 데 사용할 기본 빌딩 블록입니다.

