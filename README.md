# 동기

- 평소 공부를 할 때 노트에 필기해서 생각을 정리해 왔습니다. 그런데 이런 노트를 그냥 버리기 아까울 때가 많았습니다. 생각이 어떻게 발전되어 왔는지를 되돌아볼 수 있었기 때문이었습니다. 따라서 사용자가 노트를 작성하여 이를 보관하고 다른 사용자와 공유도 할 수 있는 웹 메모 애플리케이션을 제작하는데 도전하게 되었습니다.

# 프로젝트 관심사

## 소켓을 이용한 실시간 메모 기능

- 추가 예정

## Google Cloud Vision API를 손글씨 인식(OCR) 도입

- 추가 예정

## div contentEditable

### 들어가며

- 텍스트 에디터 기능이 포함된 메모 애플리케이션을 구현하기 위해 사용자의 입력을 전달받아야 했습니다. 이를 위해서 처음에는 `textarea` 태그를 사용하여 개발을 시작하였습니다.`textarea`사용자 input을 렌더링하는 역할만 할 뿐, 텍스트 에디터 기능, 예를 들어 사용자가 글씨를 쓰고 제목을 표시하게 하는 기능, 마크다운 문법 적용 등을 적용하는 데 한계가 있다고 생각했습니다. 따라서 프로젝트가 텍스트 에디터로 확장될 것을 고려하여서 개발 도중 `textarea` 방식을 사용하는 것을 중단하고 `div contentEditable`을 이용하여 프로덕트를 개발하게 되었습니다.

### 비제어 컴포넌트

- “contentEditable” 속성이 있는 요소는 사용자가 웹페이지에서 직접 DOM을 편집할 수 있는 요소입니다. `div contentEditable` 방식은 React 컴포넌트의 데이터 흐름에서 벗어나 사용자에 의해 제어되지 않은 입력값이 렌더링 되기에 비제어 컴포넌트 방식이라고 할 수 있습니다.

- React가 직접 상태 제어를 하는 컴포넌트를 Controlled Components라고 부르며, 브라우저가 상태 제어를 하는 컴포넌트를 Uncontrolled Components라고 부릅니다. `input`은 onChange 로 value를 상태 관리하며 이를 두고 React가 데이터가 관리한다고 하여서 제어 컴포넌트라고 부릅니다. 이같이 React 통제 아래의 제어 컴포넌트에서는 데이터 흐름이 위에서 아래로만 작동합니다. 즉, 최상위 수준에서 모델을 관리하고 해당 데이터를 나타내는 가상 DOM을 유지한 다음 해당 가상 DOM을 기반으로 DOM 트리를 렌더링합니다. `div contentEditable` input과 동작 방식이 다릅니다. 먼저, 입력 시 change event가 아니라 input event가 동작합니다. 또한, input이 아니기 때문에 value 값이 없습니다. 이 때문에 제어 컴포넌트처럼 리액트가 DOM을 제어할 수가 없고 따라서 비제어 컴포넌트 방식으로 contentEditable을 관리해 줘야 합니다.

### 발생했던 문제

1. “A component is “contentEditable” and contains “children” managed by React 경고

- `event.target.innerHTML` 을 상태로 관리하고 상태 값을 div contentEditable의 content 영역에 상태 값을 넣으면 렌더링 시 cursor 초기화 및 warning이 발생한다.

- 이 warning은 `suppressContentEditableWarning={true}`를 통해 막을 수도 있습니다. 하지만 요소의 innerHTML을 직접 조작하는 방식은 React가 DOM이 변경되었는지 알 수가 없습니다. 사용자가 contentEditable 요소를 편집하면 실제 DOM이 변경됩니다. React의 가상 DOM은 이러한 변경사항을 자동으로 인식하지 않습니다. 따라서 다음 렌더링 시에 콘텐츠에 해당 DOM 노드의 올바른 상태라고 생각하는 것을 React가 overwrite 시켜서 사용자 Input과 sync가 맞지 않기 때문에 문제가 발생합니다. 실제 DOM 조작에 의해서 React 가상 DOM을 일관되게 유지하는데 문제가 될 수 있습니다. 또 innerHTML을 적절하지 않은 방식으로 사용하면 cross-site scripting (XSS) 공격에 노출될 수 있습니다.

2. dangerouslySetInnerHTML property on an element 방식에서 cursor 위치 초기화가 발생

- 따라서 setting element's innerHTML 방식 대신 요소에 `dangerouslySetInnerHTML` 속성을 부여하는 것을 적용해 보았습니다. `dangerouslySetInnerHTML`은 innerHTML을 직접 조작하는 방식과는 달리 React의 메서드입니다. React는 가상 DOM을 사용하기 때문에 실제 DOM과 차이를 비교할 때 HTML이 다른 소스에서 왔다는 것을 알기 때문에 해당 노드의 자식을 검사하는 것을 바로 건너뛸 수 있습니다. 따라서 성능이 향상됩니다.
- `dangerouslySetInnerHTML`을 통해 텍스트 입력 값을 상태로 관리하게 되면 입력 시마다 상태가 변경이 되고 React에 의해 렌더링이 발생해서 cursor가 초기화되는 문제가 있었는데, 이를 carret jump라고 부른다는 것을 알게 되었습니다. 따라서 carret jump 없이 사용자 입력에 따라서 컴포넌트를 업데이트할 방법을 찾아야만 했습니다.

- 결론: `div contentEditable`을 어떤 방식으로 렌더링 할 것인지에 대해 몇 번의 우여곡절이 있었습니다.`contentEditable = true`로 변경하고 사용자가 텍스트를 입력하면 텍스트 값 `event.target.innerHTML`에서 확인할 수 있습니다. `event.currentTarget.innerHTML`를 의 값을 상태 관리하였습니다. `div contentEditable`의 값을 업데이트하기 위해서 해당 요소에 접근하기 위해 useRef를 사용했습니다. 그리고 useEffect의 의존성 배열에 `event.currentTarget.innerHTML`을 담은 변수를 넣어서 텍스트 값이 업데이트 될 때마다 렌더링 되게 하였습니다.

3. 이미지 다운로드 기능에서 발생했던 문제

- 여러 차례 실험 끝에 렌더링 자체는 문제가 없어 보였지만, 프로젝트의 핵심 기능인 이미지 다운로드 기능에서 문제가 발생하였습니다. contentEditable 속성이 있는 `div` 태그에서 사용자가 enter 키를 누르면, 웹 브라우저는 새로운 줄을 생성하기 위해 새로운 `<div>` 태그를 자동으로 삽입합니다. 이로 인해 발생했던 문제는 줄 변경을 하고 나서 다운로드 버튼을 누르면 이미지에서 사용자가 입력한 텍스트와 `div` 태그가 함께 나타나는 것이었습니다.

<p align="center">
  <img src="./src/assets/imageForImageDownLoanIsuue.png", height="300px", width="300px">
</p>

`convertPlainTextToHTML`를 사용하여, HTML 요소의 구조와 상관없이 내부의 텍스트 값만 추출하고, 줄바꿈을 적절히 유지하여 일반 텍스트로 변환할 수 있게 되었습니다. `convertToHTMLToPlainText`의 반환값, 즉 텍스트만을 상태 관리하여서 이미지 저장하는 함수에 매개 변수로 전달하여 텍스트가 줄 변경이 반영되어 이미지로 다운로드할 수 있도록 하였습니다.

<p align="center">
  <img src="./src/assets/imageForConverHTMLToPlainText.png", height="300px", width="300px">
</p>

1. `convertHTMLToPlainText` 함수는 모든 자식 노드를 순회하면서 노드가 **`<div>`** 또는 **`<p>`**이면, 노드의 텍스트 콘텐츠 앞에 줄바꿈 문자 (**`"\n"`**)를 추가합니다. 변환된 텍스트가 줄바꿈 문자로 시작한다면, 그 문자를 제거합니다. 마지막으로 변환된 텍스트를 반환합니다.

<p align="center">
  <img src="./src/assets/imageForImageDownLoadIssueSolved.png", height="300px", width="300px">
</p>

- `convertToHTMLToPlainText`의 반환값, 즉 평문으로 바꾼 입력값을 상태 관리하였고, 이를 서버에 보내고, myPage에서 서버에서 다시 text를 조회할 때 평문을 받아오니까 이제 줄 변경 되지 않고 일렬로 렌더링 되는 문제가 발생하였습니다.

<p align="center">
  <img src="./src/assets/imageForConvertPlainTextToHTML.png", height="100px", width="300px">
</p>

- `convertPlainTextToHTML` 함수로 다시 평문을 div 태그로 감싸서 줄 변경이 되게 렌더링 하였습니다. 서버에서 Text를 조회하고 다시 TextEditor에 렌더링 시 줄 변경을 적용하기 위해 div 태그로 text를 래핑 한 값을 반환하도록 하였습니다.

# 주요 기능 소개

- 사용자 입력 텍스트 CRUD
- 텍스트 배경 색상 변경 기능
- 텍스트 이미지 다운로드 기능
- 손글씨 인식 OCR 기능

# 연락처

- 성명: 길동혁
- Email: asterism90@gmail.com

# 기술스택

- Front-end:
  - JS, ReactJS
- Back-end:
  - Node.js, Express.js
- Database:
  - MongoDB
- 상태 관리
  - zustand

# 리팩터링 계획

- 추가 예정

# 느낀점

- 프로젝트가 익숙하지 않은 비제어 컴포넌트로 인해 리액트의 일반적인 흐름에서 벗어나니 로직이 복잡해지고 불필요한 함수가 만들고 이해하기가 더 어려워진 측면이 있었던 것 같습니다. 지금 당장보다도 미래를 대비한답시고 충분한 POC 없이 새로운 방식을 시도한 결과라고 생각합니다. 차라리 `textArea`와 같은 제어 컴포넌트를 사용하고 richText 기능을 위해서는 Draft.js 같은 라이브러리를 추가 도입하는 것이 어쩌면 더 나았을 수도 있었을 것 같습니다. 하지만 `div contentEditable`를 사용하고 이를 이해하기 위한 과정 속에서 DOM, React에 대해 조사하는 과정이 정말 좋았습니다. 기존에 DOM, React에 대해 잘 이해하지 못했던 것을 이번 프로젝트에서 조금이나마 알게 되어서 정말로 유익한 시간이었던 것 같습니다.

- 혼자서 프로젝트를 진행하면서 실패한다는 것에 대해 부끄러워지지 않게 된 점이 좋았습니다. 실패하지 않는다는 것은 제대로 시도하지 않았다는 것이니까요. 그런 점에서 프로젝트 중 렌더링 방식을 `textArea`에서 `div contentEditable`로 변경하고 이를 위해 자료조사를 하고 실험해 보는 일련의 과정이 앞으로 개발하는 데 있어 엄청나게 중요한 경험이 되었다고 생각합니다. 실패를 부끄러워하지 않고 과정 중에서 경험한 걸 기록하고 다시금 공부해서 시도해 보는 개발자가 되겠습니다. 그래서 어제보다 더 성장한 동료가 될 수 있도록 노력하겠습니다.
