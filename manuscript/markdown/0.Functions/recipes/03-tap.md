## Tap {#tap}

가장 기본적인 결합자 중 하나는 “황조롱이”라는 별명을 가진 “K 결합자”입니다.

    const K = (x) => (y) => x;

이 조합자는 몇 가지 놀라운 용도로 사용됩니다. 하나는 부작용에 대한 값으로 무언가를 하고 싶지만 그 값은 그대로 유지하고 싶을 때입니다. 보세요:

    const tap = (value) =>
      (fn) => (
        typeof(fn) === 'function' && fn(value),
        value
      )

탭`은 다양한 유닉스 셸 명령어에서 차용한 전통적인 이름입니다. 값을 받아 항상 값을 반환하는 함수를 반환하지만, 함수를 전달하면 부작용을 위해 함수를 실행합니다. 빈민층을 위한 디버거로 실제로 작동하는 모습을 살펴봅시다:

    tap('espresso')((it) => {
      console.log(`Our drink is '${it}'`) 
    });
    //=> Our drink is 'espresso'
         'espresso'
    

쉽게 끌 수 있습니다:

    tap('espresso')();
      //=> 'espresso'

[Underscore]과 같은 라이브러리에서는 `tap`의 버전인 “언커레이티드:”를 사용합니다.

    _.tap('espresso', (it) =>
      console.log(`Our drink is '${it}'`) 
    );
      //=> Our drink is 'espresso'
           'espresso'
    
레시피가 양방향으로 작동하도록 개선해 봅시다:

    const tap = (value, fn) => {
      const curried = (fn) => (
          typeof(fn) === 'function' && fn(value),
          value
        );
      
      return fn === undefined
             ? curried
             : curried(fn);
    }

이제 작성할 수 있습니다:

    tap('espresso')((it) => {
      console.log(`Our drink is '${it}'`) 
    });
    //=> Our drink is 'espresso'
         'espresso'
    
또는:

    tap('espresso', (it) => {
      console.log(`Our drink is '${it}'`) 
    });
    //=> Our drink is 'espresso'
         'espresso'
    
아무 작업도 하지 않으려면 `tap('espresso')()` 또는 `tap('espresso', null)`을 작성하면 됩니다.

추신: `tap`은 디버깅 보조 기능 이상의 역할을 할 수 있습니다. [객체 및 인스턴스 메서드](#tap-methods)로 작업할 때도 유용합니다..

[Underscore]: http://underscorejs.org
