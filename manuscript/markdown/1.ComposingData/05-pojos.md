## Plain Old JavaScript Objects {#pojos}

리스트는 여러 항목을 표현할 수 있는 유일한 방법은 아니지만, 고수준 언어의 역사에서 가장 "오래된" 데이터 구조입니다. 리스트는 컴퓨터의 하드웨어 구조와 매우 가깝게 맵핑되기 때문에 발전해왔습니다. 리스트는 쇼핑 목록 같은 동질적인 항목 모음에 아주 유용합니다.

```js
const remember = ["the milk", "the coffee beans", "the biscotti"];
```

리스트는 다양한 수준의 구조를 가진 이질적인 항목을 저장하는 데에도 사용할 수 있습니다.

```js
const user = [["Reginald", "Braithwaite"],[ "author", ["JavaScript Allongé", "JavaScript Spessore", "CoffeeScript Ristretto"]]];
```

이 때 이름이 첫 번째 항목이라는 점을 기억하는 것은 오류를 일으킬 수 있으며, `user[0][1]`에서 성을 의미한다고 알기를 기대하는 것은 무리가 있습니다. 그래서 리스트만 사용할 수 있던 시절에는 프로그래머들이 상수를 정의하여 보다 쉽게 사용할 수 있도록 하곤 했습니다.


```js
const NAME = 0,
      FIRST = 0,
      LAST = 1,
      OCCUPATION = 1,
      TITLE = 0,
      RESPONSIBILITIES = 1;

const user = [["Reginald", "Braithwaite"],[ "author", ["JavaScript Allongé", "JavaScript Spessore", "CoffeeScript Ristretto"]]];
```

이제 `user[NAME][LAST]` 또는 `user[OCCUPATION][TITLE]`와 같이 쓸 수 있어 `user[0][1]` 또는 `user[1][0]`을 사용할 필요가 없어졌습니다. 시간이 지나면서 이렇게 이름으로 멤버에 접근할 수 있는 이질적인 데이터 구조를 구축하려는 필요성이 Dictionary[Dictionary]데이터 타입으로 진화했습니다. 이는 고유한 객체 집합을 다른 객체 집합으로 매핑하는 방식입니다.

[Dictionary]: https://en.wikipedia.org/wiki/Associative_array

딕셔너리는 키-값 쌍을 저장하므로, `NAME`을 `0`에 바인딩하여 인덱스 `0`에 배열에서 이름을 저장하는 대신 딕셔너리에서 이름을 `name`에 직접 바인딩할 수 있습니다. 그리고 구현이 키-값 쌍의 목록인지, 해시된 컬렉션인지, 어떤 종류의 트리인지 등은 JavaScript가 알아서 처리합니다.

JavaScript에는 딕셔너리가 있으며 이를 "객체"라고 부릅니다. "객체"라는 용어는 프로그래밍에서 널리 사용되고 있으며, 이는 Alan Kay에 의해 '객체 지향 프로그래밍'이라는 용어가 등장한 이후로 많은 사람들이 각기 다른 의미로 받아들이고 있습니다.

JavaScript에서 객체는 문자열 키와 값 간의 매핑입니다.

### 리터럴 객체 구문

JavaScript에는 객체를 생성하는 리터럴 구문이 있습니다. 이 객체는 `year`, `month`, 및 `day` 키에 값을 맵핑합니다:

    { year: 2012, month: 6, day: 14 }

별도의 평가로 생성된 두 객체는 배열과 마찬가지로 서로 다른 아이덴티티를 가집니다:

    { year: 2012, month: 6, day: 14 } === { year: 2012, month: 6, day: 14 }
      //=> false

객체는 `[]`를 사용하여 이름을 통해 값을 접근할 수 있으며, 이 때는 문자열을 사용합니다:

    { year: 2012, month: 6, day: 14 }['day']
      //=> 14

객체에 포함된 값은 배열에 포함된 값처럼 원본을 참조하여 접근할 수 있습니다:

    const unique = () => [],
          x = unique(),
          y = unique(),
          z = unique(),
          o = { a: x, b: y, c: z };

    o['a'] === x && o['b'] === y && o['c'] === z
      //=> true

이름은 반드시 알파벳 문자열일 필요는 없습니다. 다른 경우에는 이름을 따옴표로 감싸면 됩니다:

    { 'first name': 'reginald', 'last name': 'lewis' }['first name']
      //=> 'reginald'

이름이 변수명 규칙에 맞는 알파벳 문자열이라면 값을 접근하는 간단한 구문도 사용할 수 있습니다:

    const date = { year: 2012, month: 6, day: 14 };

    date['day'] === date.day
      //=> true

키의 표현식을 사용할 수도 있습니다. 이때 키 표현식은 `[`와 `]`로 묶습니다:

    {
      ["p" + "i"]: 3.14159265
    }
      //=> {"pi":3.14159265}

모든 컨테이너는 함수나 다른 컨테이너처럼 어떤 값도 포함할 수 있으며, 예를 들어 화살표 함수를 포함할 수 있습니다:

    const Mathematics = {
      abs: (a) => a < 0 ? -a : a
    };

    Mathematics.abs(-5)
      //=> 5

혹은 일반 함수도 포함할 수 있습니다:

    const SecretDecoderRing = {
      encode: function (plaintext) {
        return plaintext
          .split('')
          .map( char => char.charCodeAt() )
          .map( code => code + 1 )
          .map( code => String.fromCharCode(code) )
          .join('');
      },
      decode: function (cyphertext) {
        return cyphertext
          .split('')
          .map( char => char.charCodeAt() )
          .map( code => code - 1 )
          .map( code => String.fromCharCode(code) )
          .join('');
      }
    }

또는 이름이 있는 함수 표현식도 사용할 수 있습니다:

    const SecretDecoderRing = {
      encode: function encode (plaintext) {
        return plaintext
          .split('')
          .map( char => char.charCodeAt() )
          .map( code => code + 1 )
          .map( code => String.fromCharCode(code) )
          .join('');
      },
      decode: function decode (cyphertext) {
        return cyphertext
          .split('')
          .map( char => char.charCodeAt() )
          .map( code => code - 1 )
          .map( code => String.fromCharCode(code) )
          .join('');
      }
    }

이름이 있는 함수 표현식을 키에 연결하는 것은 매우 일반적이며, 이를 위한 "간결한 메서드 구문"도 있습니다:

    const SecretDecoderRing = {
      encode (plaintext) {
        return plaintext
          .split('')
          .map( char => char.charCodeAt() )
          .map( code => code + 1 )
          .map( code => String.fromCharCode(code) )
          .join('');
      },
      decode (cyphertext) {
        return cyphertext
          .split('')
          .map( char => char.charCodeAt() )
          .map( code => code - 1 )
          .map( code => String.fromCharCode(code) )
          .join('');
      }
    }

(이름 있는 함수 표현식과 간결한 메서드 구문을 사용하는 데 몇 가지 기술적 차이가 있지만, 여기에서는 관련되지 않으므로 무시하겠습니다. 가능할 때마다 간결한 메서드 구문을 선호합니다.)

### 객체 비구조화

배열에서 본 것처럼, 리터럴 객체 구문을 사용하여 비구조화 할당을 쓸 수 있습니다. 따라서 다음과 같이 쓸 수 있습니다:

```js
const user = {
  name: { first: "Reginald",
          last: "Braithwaite"
        },
  occupation: { title: "Author",
                responsibilities: [ "JavaScript Allongé",
                                    "JavaScript Spessore",
                                    "CoffeeScript Ristretto"
                                  ]
              }
};

user.name.last
  //=> "Braithwaite"

user.occupation.title
  //=> "Author"
```

또한 다음과 같이 쓸 수도 있습니다:

```js
const {name: { first: given, last: surname}, occupation: { title: title } } = user;

surname
  //=> "Braithwaite"

title
  //=> "Author"
```

물론, 파라미터도 비구조화할 수 있습니다:

```js
const description = ({name: { first: given }, occupation: { title: title } }) =>
  `${given} is a ${title}`;

description(user)
  //=> "Reginald is a Author"
```

형편없는 문법과 대문자 사용이지만, 계속 진행해봅시다. 비구조화할 때 `title: title`과 같이 작성하는 것은 매우 일반적입니다. 이름이 유효한 변수명이라면, 그 이름이 가장 명확한 변수명이기도 합니다. 그래서 JavaScript는 추가적인 구문 최적화를 지원합니다:

```js
const description = ({name: { first }, occupation: { title } }) =>
  `${first} is a ${title}`;

description(user)
  //=> "Reginald is a Author"
```

And that same syntax works for literals:

```js
const abbrev = ({name: { first, last }, occupation: { title } }) => {
  return { first, last, title};
}

abbrev(user)
  //=> {"first":"Reginald","last":"Braithwaite","title":"Author"}
```

### 연결 리스트 다시 살펴보기

이전에 우리는 2개의 요소로 이루어진 배열을 사용해 연결 리스트의 노드를 만들었습니다.

```js
const cons = (a, d) => [a, d],
      car  = ([a, d]) => a,
      cdr  = ([a, d]) => d;
```

위 코드는 간단한 배열을 사용하여 `car`와 `cdr`이라는 추상화된 개념을 제공합니다. 하지만 객체를 살펴봤으니, 이제는 객체를 사용해 두 요소 배열 대신 객체로 구현해보겠습니다. 현대적인 이름을 사용해보면, 연결 리스트의 노드를 `{ first, rest }`라는 구조로 만들 수 있습니다.

이 경우, 숫자 `1`, `2`, `3`으로 구성된 연결 리스트는 다음과 같이 생깁니다:   
`{ first: 1, rest: { first: 2, rest: { first: 3, rest: EMPTY } } }`.

이제 first와 rest 속성에 직접 접근할 수 있어 `[first, ...rest]`와 유사한 작업을 할 수 있습니다.

```js
const EMPTY = {};
const OneTwoThree = { first: 1, rest: { first: 2, rest: { first: 3, rest: EMPTY } } };

OneTwoThree.first
  //=> 1

OneTwoThree.rest
  //=> {"first":2,"rest":{"first":3,"rest":{}}}

OneTwoThree.rest.rest.first
  //=> 3
```

연결 리스트의 길이를 구하는 것은 간단합니다:

```js
const length = (node, delayed = 0) =>
  node === EMPTY
    ? delayed
    : length(node.rest, delayed + 1);

length(OneTwoThree)
  //=> 3
```

그렇다면, 맵핑은 어떻게 할까요? 가장 단순한 방법으로 리스트를 복사하는 것부터 시작해보겠습니다. 앞서 설명했듯이 연결 리스트는 앞에서 뒤로 반복하는 것이 빠릅니다. 하지만 단순히 리스트를 복사하는 것은 느리지요:



```js
const slowcopy = (node) =>
  node === EMPTY
    ? EMPTY
    : { first: node.first, rest: slowcopy(node.rest)};

slowcopy(OneTwoThree)
  //=> {"first":1,"rest":{"first":2,"rest":{"first":3,"rest":{}}}}
```

여기서 문제는 연결 리스트가 뒤에서 앞으로 생성되기 때문에 앞에서 뒤로 반복하려면 모든 요소를 콜 스택에 저장해야 하고, 모든 재귀 호출이 반환될 때 뒤에서 앞으로 리스트를 생성해야 한다는 점입니다.

지연 작업 전략을 따라 가봅시다. 다음은 순진한 접근법으로 작성한 예제입니다:

```js
const copy2 = (node, delayed = EMPTY) =>
  node === EMPTY
    ? delayed
    : copy2(node.rest, { first: node.first, rest: delayed });

copy2(OneTwoThree)
  //=> {"first":3,"rest":{"first":2,"rest":{"first":1,"rest":{}}}}
```

이렇게 하면 리스트가 *역순*으로 복사된다는 것을 알 수 있습니다. 이는 리스트가 뒤에서 앞으로 생성되기 때문에 앞에서 뒤로 반복할 때 역방향으로 리스트를 만드는 결과가 생기는 것이므로 당연한 결과입니다. 이 방식이 나쁜 것은 아니며, 여기서는 이 함수의 이름을 reverse로 정해보겠습니다.


```js
const reverse = (node, delayed = EMPTY) =>
  node === EMPTY
    ? delayed
    : reverse(node.rest, { first: node.first, rest: delayed });
```

이제 리스트를 뒤집는 map 함수를 만들어보겠습니다.

```js
const reverseMapWith = (fn, node, delayed = EMPTY) =>
  node === EMPTY
    ? delayed
    : reverseMapWith(fn, node.rest, { first: fn(node.first), rest: delayed });

reverseMapWith((x) => x * x, OneTwoThree)
  //=> {"first":9,"rest":{"first":4,"rest":{"first":1,"rest":{}}}}
```

And a regular `mapWith` follows:

```js
const reverse = (node, delayed = EMPTY) =>
  node === EMPTY
    ? delayed
    : reverse(node.rest, { first: node.first, rest: delayed });

const mapWith = (fn, node, delayed = EMPTY) =>
  node === EMPTY
    ? reverse(delayed)
    : mapWith(fn, node.rest, { first: fn(node.first), rest: delayed });

mapWith((x) => x * x, OneTwoThree)
  //=> {"first":1,"rest":{"first":4,"rest":{"first":9,"rest":{}}}}
```

`mapWith` 함수는 직선적인 반복보다 두 배 시간이 소요되는데, 리스트를 전체적으로 두 번 반복하기 때문입니다. 첫 번째 반복에서 map을 적용하고, 두 번째 반복에서 리스트를 뒤집기 위해 역순으로 처리합니다. 이와 같이 메모리도 두 배 소요됩니다.

참고로, 이는 배열을 부분적으로 복사하는 것보다 훨씬 빠릅니다. 길이가 n인 리스트의 경우, 불필요한 노드 n개를 만들고 불필요한 값 n개를 복사했을 뿐입니다. 반면에, 단순한 배열 알고리즘은 2n개의 불필요한 배열을 만들고 n^2개의 불필요한 값을 복사합니다.
