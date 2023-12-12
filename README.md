# 목차

- [동기](#동기)
- [주요 기능 소개](#주요-기능-소개)
- [프로젝트 관심사](#프로젝트-관심사)
  - [contentEditable](#contenteditable)
    - [contentEditable 도입한 이유](#contenteditable-도입한-이유)
    - [비제어 컴포너트](#비제어-컴포넌트)
    - [비제어 컴포넌트 방식으로 사용자 입력값 렌더링하기](#비제어-컴포넌트-방식으로-사용자-입력값-렌더링하기)
    - [이미지 다운로드 기능에서 발생했던 문제](#image-download-기능에서-발생했던-문제)
  - [소켓을 이용한 실시간 메모 기능](#소켓을-이용한-실시간-메모-기능)
    - [Socket IO 도입한 이유](#socket-io-도입한-이유)
    - [커서 위치 시각화 위치가 맞지 않은 문제를 어떻게 해결했는지?](#커서-위치-시각화-위치가-맞지-않는-문제를-어떻게-해결했는지)
- [기술스택](#기술스택)
- [느낀점](#느낀점)
- [연락처](#연락처)

---

# 동기

- 노트에 필기하는 걸 좋아했습니다. 그런데 작성한 노트를 그냥 버리기 아까울 때가 많았습니다. 생각이 어떻게 발전되어 왔는지를 되돌아볼 수 있었기 때문이었습니다. legalpad라는 특정 메모장에 기록하는 것을 좋아했고 이를 테마로 한 메모 웹 애플리케이션을 만들고자 했습니다.

# 주요 기능 소개

- 메모 작성, 다운로드, 공유하기 등이 주요 기능입니다. 이러한 기능 구현에 `contentEditable`을 사용했습니다.

- 소켓을 통해 다른 사용자와 함께 메모할 수 있도록 하였고 이때, 사용자의 커서 위치를 시각화했습니다. 또한 현재 입력 중인 사용자를 화면 하단에 표시했습니다.

- Google Cloud Vision API를 사용하여 작성한 메모에서 손 글씨를 인식합니다. (OCR)

---

- **텍스트 생성** (색상 변경, 이미지 다운로드 기능)

  <p align="center">
    <img src="https://github.com/donghyukkil/hello-legalpad-client/assets/124029691/9bc1121a-8827-48c8-b260-edffaed221de", style="max-width: 80%; height: auto">
  </p>

- **함께 메모하기**

  - 다른 사용자의 입력값을 알 수 있도록 스타일을 적용했습니다.
    <p align="center">
      <img src="https://github.com/donghyukkil/hello-legalpad-client/assets/124029691/12d6079b-4557-4a0a-bab4-36dc502936ee", style="max-width: 80%; height: auto">
    </p>

- **손글씨 인식** (OCR 기능)

  <p align="center">
    <img src="https://github.com/donghyukkil/hello-legalpad-client/assets/124029691/e9c4ff5d-720f-4083-af63-e3e416f69d77", style="max-width: 80%; height: auto">
  </p>

# 프로젝트 관심사

## contentEditable

### contentEditable 도입한 이유

- 메모 앱 애플리케이션을 구현하기 위해선 사용자의 입력을 전달받아야 합니다. 이를 위해서 처음에는 `textarea`를 사용하여 개발을 시작했습니다. `textarea`를 사용하면 별도의 추가 조치 없이 사용자 input을 렌더링할 수 있습니다. 하지만 사용자의 커서 위치를 시각화하기 위해 좌표를 계산해야 했고 이를 위해선 Selection API와 Range API를 사용했어야만 했습니다.

- 하지만 `textarea`에서 이 기술들을 적용하지 못한다는 것을 알게 되었습니다. 그 이유는 Selection과 Range API는 주로 `contenteditable` 속성을 가진 요소나 document 객체에서 작동하도록 설계되었기 때문입니다. `textarea`는 텍스트가 DOM 노드로 분리되어 있지 않고 단일한 문자열로 취급되기 때문에, 이러한 API를 사용하는 것이 어렵거나 비효율적입니다.

- (`textarea`에 Selection과 Range API를 사용하는 것보다는 `textarea` 자체의 속성과 메서드를 사용(textarea의 value, selectionStart, selectionEnd)하여 텍스트 선택과 조작을 하는 것이 일반적입니다.)

- 또한 텍스트에디터 기능, 예를 들어 사용자가 글씨를 쓰고 제목을 표시하게 하는 기능, 마크다운 문법 적용 등을 적용하는 데 `textarea` 방식이 한계가 있다고 생각했습니다. 따라서 프로젝트가 확장될 것을 고려한 결과, 개발 도중 `textarea` 방식을 사용하는 것을 중단하고 `contentEditable`을 이용하여 프로젝트를 개발하게 되었습니다.

### 비제어 컴포넌트

| 특성            | 제어 컴포넌트 (`input`)                   | 비제어 컴포넌트 (`contentEditable`)      |
| --------------- | ----------------------------------------- | ---------------------------------------- |
| **데이터 흐름** | 위에서 아래로 (Top-down)                  | 사용자에 의한 직접 DOM 편집              |
| **이벤트 처리** | `onChange` 이벤트를 사용하여 `value` 관리 | `input` 이벤트를 사용, `value` 속성 없음 |
| **DOM 제어**    | React가 DOM을 직접 제어                   | React 외부에서 DOM 제어                  |
| **상태 관리**   | React 상태에 따라 `value` 관리            | 직접 DOM 조작으로 내용 관리              |

- `contentEditable`의 사용은 React 데이터 흐름에서 벗어나 사용자에 의해 제어되지 않은 입력값이(사용자에 의한 직접 DOM 편집) 개입되기 때문에 비제어 컴포넌트 방식이라고 할 수 있습니다.

- 제어 컴포넌트에 관한 예시로 보통 `input`을 이용한 개발을 설명합니다. `input`은 onChange로 value를 상태 관리합니다. React 통제 아래 제어 컴포넌트에서는 데이터 흐름이 위에서 아래로만 작동합니다. 반면에 `contentEditable`을 이용한 개발은 동작 방식이 다릅니다. `contentEditable`은 입력 시 change event가 아니라 input event가 동작하고 또한, input이 아니어서 value 값이 없습니다. 이 때문에 제어 컴포넌트처럼 리액트가 DOM을 제어할 수가 없습니다. 따라서 `contentEditable`은 제어 컴포넌트와 다른 방식으로 제어를 해줘야 합니다.

### 비제어 컴포넌트 방식으로 사용자 입력값 렌더링하기

- **사용자 입력 값을 렌더링할 때 발생했던 문제**

  > A component is “contentEditable” and contains “children” managed by React.

  - 사용자가 입력한 값은 `contentEditable` 영역의 `event.target.innerHTML`에서 조회할 수 있습니다. 이 값을 상태로 관리하고 `contentEditable`의 content 영역에 넣게 되면 렌더링 시 cursor 초기화가 되고 위와 같은 warning이 발생합니다.

  - 이 warning은 `suppressContentEditableWarning={true}`를 통해 막을 수도 있습지만, 권장되지는 않습니다. 왜냐하면 해당 경고를 막으면, React는 DOM이 변경되었는지 알 수가 없기 때문입니다. element의 innerHTML을 직접 조작하는 방식은 React의 제어 대상에서 벗어나기 때문에, 이를 개발자에게 알려주기 위한 경고가 위에서 인용한 경고입니다.

  - 사용자가 `contentEditable`를 수정하면 실제 DOM이 변경되고 React의 가상 DOM은 이러한 변경 사항을 자동으로 인식하지 않습니다. 결국 다음 렌더링 시에 content에 해당 DOM node의 올바른 상태라고 생각하는 것을 React가 overwrite 시켜서 사용자 입력값과 일치하지 않는 문제가 발생합니다. `contentEditable`을 사용한 방식은 실제 DOM 조작에 의해서 React 가상 DOM을 일관되게 유지하는 데 문제가 있으며 이에 대한 대응을 개발자가 해줘야 합니다.

- **커서 위치 초기화 문제**

  - 따라서 `contentEditable` element의 innerHTML를 조작하는 방식 대신 element에 `dangerouslySetInnerHTML` 속성을 부여하는 것을 적용해 보았습니다. `dangerouslySetInnerHTML`은 React의 메서드입니다. 이 메서드를 사용하면 React는 해당 값이 가상 DOM이 아닌 곳에서 왔음을 알아차리고는 해당 노드의 자식을 검사하는 것을 바로 건너뜁니다. 따라서 성능이 향상되는 장점이 생깁니다.

  - 하지만 `dangerouslySetInnerHTML`을 이용한 방식은 cursor 위치 초기화 문제가 발생합니다. 문제의 원인은 텍스트 입력값을 상태로 관리하게 되면 입력 시마다 상태가 변경되고 React에 의해 렌더링이 발생해서 cursor가 초기화되었던 것이었습니다. 이를 carret jump라고 부른다는 것을 알게 되었습니다. 따라서 carret jump 없이 사용자 입력에 따라서 컴포넌트를 업데이트할 방법을 찾아야만 했습니다.

- **결론:**

  `contentEditable`을 이용한 개발 방식에서 텍스트 입력값을 React 상태로 관리하면 커서 초기화 문제, 텍스트 연속 입력이 불가능한 문제가 발생합니다. `contentEditable`의 입력값을 `UseRef`로 관리하면 컴포넌트의 리렌더링 사이에 정보를 유지하여 앞서 언급한 문제에 대응할 수 있습니다.

  결론을 정리하면 다음과 같습니다.

  | 단계                          | 설명                                                                                                                                             |
  | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
  | **사용한 접근 방식**          | `contentEditable`의 사용자 텍스트 입력값인 `event.target.innerHTML`를 useRef를 통해서 관리합니다.                                                |
  | **사용자 입력값 초기화 문제** | `useRef`를 사용하여 해당 element를 조회하고 사용자 입력값이 초기화되지 않고 연속 입력되도록 관리                                                 |
  | **텍스트 갱신**               | 소켓을 이용하여 다른 사용자의 입력값을 갱신해야 할 때, `useEffect` 내부에서 소켓으로부터 전달받은 데이터를 `textarea.current.innerHTML`에 재할당 |

### image download 기능에서 발생했던 문제

- 몇 번의 실험 끝에 렌더링 자체는 문제가 없어 보였습니다. 하지만 프로젝트의 핵심 기능인 이미지 다운로드 기능에서 문제가 생겼습니다. 사용자가 enter 키를 누르면, 웹 브라우저는 새로운 줄을 생성하기 위해 새로운 `div` 태그를 자동으로 삽입합니다. 이에 따라서 줄 변경을 하면 다운로드 이미지에서 입력 테스트와 함께 의도하지 않은 `div` 태그가 나타났습니다.

  <p align="center">
    <img src="./src/assets/imageForImageDownLoanIsuue.png", style="max-width: 80%; height: auto">
  </p>

- 이를 해결 하기 위해 아래 사진의 `convertHTMLToPlainText`를 사용하여, HTML 요소의 구조와 상관없이 내부의 텍스트 값만 추출하고, 줄 바꿈을 유지하여 일반 텍스트로 변환하였습니다. 텍스트만을 `textValue`로 상태 관리하여서 이미지 다운로드를 담당하는 함수에 매개 변수로 전달하여 의도한 모습의 이미지가 다운로드 되게 하였습니다.

  <p align="center">
    <img src="./src/assets/imageForConverHTMLToPlainText.png", style="max-width: 80%; height: auto">
  </p>

  <p align="center">
  <img src="./src/assets/imageForImageDownLoadIssueSolved.png", style="max-width: 80%; height: auto">
  </p>

## 소켓을 이용한 실시간 메모 기능

### Socket IO 도입한 이유

- 여러 사용자가 함께 앱을 사용할 수 있게 하고 싶었습니다. 처음에는 소켓을 이용한 실시간 채팅 기능이 구현된 페이지 만들고자 했습니다. 하지만 메모 앱을 지향하는 프로덕트에 갑작스레 실시간 채팅 기능을 추가하면 프로덕트의 정체성을 해칠 것 같았습니다. 따라서 메모 앱이라는 아이덴티티를 유지하면서도 "실시간으로 함께 메모" 기능을 구현해 보고 싶었습니다. 이를 위해 기존의 TextEditor 컴포넌트를 활용하여 구현하기로 하였습니다. 의도했던 바는 Google Docs처럼 다른 사용자의 커서 위치를 시각화해서 사용자가 실시간으로 함께 메모할 수 있도록 하는 것이었습니다. 여기에 더해 Slack처럼 입력 창 하단에 어떤 사용자가 입력 중인지를 표시하고자 했습니다.

- 실시간 협업 기능을 갖춘 애플리케이션을 만들려면 클라이언트와 서버 간에 실시간으로 데이터를 송수신할 수 있어야 합니다. **`socket.io`**는 실시간 양방향 이벤트 기반 통신을 가능하게 하는 라이브러리로, 실시간 메모 기능을 구현하는 데 적합하다고 판단하여 프로젝트에 도입하게 되었습니다. 웹 소켓이 단순한 메시지 전송과 수신에 초점을 맞춘 기술로 다양한 클라이언트 상황을 대응하는 데 제한이 있을 것으로 생각했습니다. 또한 프로젝트에 room 기능이 꼭 필요하고 socket.io는 해당 기능을 위한 API를 제공하고 있어서 socket.io를 도입하게 되었습니다.

- **웹소켓 / socket.io**

  | 요인                | 웹소켓                                   | `socket.io`                                              |
  | ------------------- | ---------------------------------------- | -------------------------------------------------------- |
  | 호환성 및 접근성    | 오래된 브라우저나 장치에서 지원이 제한적 | 다양한 브라우저와 장치에서 일관된 성능 및 폴백 옵션 제공 |
  | 추가 기능 및 편의성 | 기본적인 웹소켓 기능만 제공              | 자동 재연결, 이벤트 방송, 룸 기반 통신 등 추가 기능 제공 |
  | 개발 효율성         | 낮은 수준의 API, 추가 기능 개발 필요     | API 제공(room), 적은 코드로 더 많은 작업 가능            |
  | 신뢰성 및 확장성    | 기본적인 웹소켓 프로토콜                 | 다양한 환경에서의 입증된 안정성 및 확장성                |

### 커서 위치 시각화 위치가 맞지 않는 문제를 어떻게 해결했는지?

- 브라우저에서 커서위치에 해당하는 값을 변수 `cursorPosition`에 저장하고 그 값을 소켓으로 통신하고 데이터를 전달받은 사용자가 상대 사용자의 데이터를 이용하여 커서 위치를 렌더링하는 시나리오를 구상하였습니다. 이를 위해 소켓의 `textChanged`이벤트를 통해서 사용자 간에 `text`, `cursorPosition`, `userPhotoURL`을 서로 공유하도록 했습니다.

- **DOM API의 getBoundingClientRect()을 이용한 방식**

  <p align="center">
    <img src="https://github.com/donghyukkil/hello-legalpad-client/assets/124029691/c57b7e8c-1da5-409c-970b-07b19f026376", style="max-width: 80%; height: auto">
  </p>

- 커서 위치를 계산하기 위해 웹 브라우저가 제공하는 DOM API의 `getBoundingClientRect()`을 이용하였습니다. `getBoundingClientRect()`은 해당 element의 viewport 내부에서 위치를 계산합니다. 따라서 커서 위치도 viewport 기준으로 위치를 계산하여서 사용자 브라우저 크기에 따라 프로필 이미지의 배치가 맞지 않는 문제가 발생하였습니다.

  <p align="center">
    <img src="https://github.com/donghyukkil/hello-legalpad-client/assets/124029691/d7a80d2e-d438-4680-836b-4422da638792", style="max-width: 80%; height: auto">
  </p>

- 발생한 문제를 해결하기 위해, 기존의 방식을 수정해서 다시 시도하였습니다. `getBoundingClientRect()`으로 프로필 이미지가 그려질 상위 영역인 TextEditor의 좌표를 얻고 이 위치를 기준으로 cursor 좌푯값을 다시 한번 더 계산하는 방식으로 커서 위치를 계산했습니다. 커서 위치를 컨테이너인 TextEditor를 기준으로 상대적으로 조정하여 계산하기 때문에 브라우저 크기가 달라져도 커서 위치에 프로필 이미지를 배치할 수 있었습니다. 하지만 작성된 글이 길어지는 경우 여전히 커서 위치가 동기화 되지 않는 것을 발견하였고 결국 특정 요소의 좌표를 구해서 해당 좌표에 원하는 이미지를 렌더링하는 기존 방식에 한계가 있다는 것 깨닫게 되었습니다.

- **기존 방식에 DOM 조회 방식을 추가하기**

  - 사용자가 입력한 텍스트 값은 event 객체에서 NodeList로 조회할 수 있습니다. 커서 위치를 DOM 요소를 기반으로 위치를 추적한다면, 브라우저 크기와 독립적으로 변화가 발생한 요소를 찾아 해당 요소에 시각적인 효과를 주는 식으로 상대 사용자의 입력 데이터를 시각화할 수 있다고 판단했습니다.

  - 브라우저 크기가 변화해도 `targetNode`를 인식하여 다른 사용자의 커서 위치를 시각화했습니다.

    <p align="center">
      <img src="https://github.com/donghyukkil/hello-legalpad-client/assets/124029691/cb3b3d16-6cc7-4025-8ff7-9176201e7cbf", style="max-width: 80%; height: auto">
    </p>

  - 프로젝트에서 적용한 세부 시나리오는 다음과 같습니다.

  | 단계                              | 설명                                                                                                                                                                                                                                                                     |
  | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
  | **1. 입력 발생**                  | `contentEditable` 영역에서 입력이 발생하면 `handleInputChange` 함수가 호출됩니다.                                                                                                                                                                                        |
  | **2. 커서 위치 파악**             | `childNodes` 배열과 `cursorNodeIndex`를 사용하여 현재 커서(`cursorNode`)의 위치를 찾습니다.                                                                                                                                                                              |
  | **3. 소켓을 통한 데이터 송신**    | 사용자 입력 데이터와 커서 위치 정보를 소켓을 통해 다른 사용자에게 전송합니다.                                                                                                                                                                                            |
  | **4. 소켓 데이터 수신 및 처리**   | 소켓을 통해 수신된 데이터(`text`)를 `textarea.current.innerHTML`에 재할당하고, `cursorIndex`를 사용하여 마지막 커서 위치를 찾습니다. (`targetNode`)                                                                                                                      |
  | **5. 타겟 노드 좌표 계산**        | `targetNode`의 위치를 `getBoundingClientRect()` 메소드를 사용하여 계산합니다.                                                                                                                                                                                            |
  | **6. 스타일 적용 및 클래스 부여** | `targetNode`에 스타일과 클래스를 적용하여 시각적으로 강조합니다.                                                                                                                                                                                                         |
  | **7. 이미지 렌더링**              | `placeProfileImageNearNode` 함수를 사용하여 `targetNode` 근처에 프로필 이미지를 렌더링합니다.                                                                                                                                                                            |
  | **8. 요약**                       | 사용자의 텍스트 입력은 소켓을 통해 다른 사용자에게 전달되며, 이때 커서 위치(cursorIndex)가 포함됩니다. 전달받은 사용자는 변경된 텍스트와 cursorIndex를 사용하여 다른 사용자가 어느 부분을 편집하고 있는지를 DOM 요소를 기반으로 시각화하고 프로필 이미지를 렌더링합니다. |

- **상세 설명**

  - 원 사용자의 NodeList에서 텍스트 입력 시 이벤트가 발생한 요소를 찾아 변수 `cursorNode`에 할당합니다. 변수 `cursorNode`는 `contentEditable` 영역에서 텍스트가 입력될 때 사용자의 커서 위치에 해당하는 노드입니다.

  - `event.target.childNodes`에서 `cursorNode`의 인덱스를 찾고 이 인덱스가 담긴 변수 `cursorIndex`를 포함한 사용자 텍스트 입력 정보를 소켓으로 다른 사용자에게 전달합니다. 서버는 이 정보를 모든 연결된 클라이언트에게 방송합니다.

    <p align="center">
      <img src="https://github.com/donghyukkil/hello-legalpad-client/assets/124029691/5e01eeaf-0612-41a1-87b7-9b1a25115f28", style="max-width: 80%; height: auto">
    </p>

    <p align="center">
      <img src="https://github.com/donghyukkil/hello-legalpad-client/assets/124029691/69aa4183-e51f-4e19-9f87-c7e199133095",  style="max-width: 80%; height: auto">
    </p>

    - textChanged 이벤트를 통해 현재 사용자가 참조하고 있는 NodeList에서 전달받은 인덱스를 이용하여 다른 사용자에 의해 변화가 발생한 DOM 요소를 찾고 새로운 변수 `targetNode`에 할당합니다. `targetNode`으로 소켓 이벤트를 전송한 사용자가 어느 부분을 편집하고 있는지를 시각적으로 나타냅니다.

  - 전달받은 프로필 이미지를 `placeProfileImageNearNode` 함수를 이용하여 해당 DOM 근처에 렌더링합니다.

    <p align="center">
      <img src="https://github.com/donghyukkil/hello-legalpad-client/assets/124029691/9ac3609a-3a13-4d3d-929d-4ec9d15c937f", style="max-width: 80%; height: auto">
    </p>

# 기술스택

- Front-end:
  - JS, ReactJS
- Back-end:
  - Node.js, Express.js
- Database:
  - MongoDB
- 상태 관리
  - zustand

# 느낀점

- 익숙하지 않은 비제어 컴포넌트 방식 개발로 인해 리액트의 일반적인 흐름에서 벗어나니 혼란스러웠던 것 같습니다. 하지만 `contentEditable`를 사용하고 이를 이해하기 위한 과정에서 DOM, React에 대해 조사하는 과정이 정말 좋았습니다.

- 혼자서 프로젝트를 진행하면서 시행착오를 겪는 것 역시 좋았습니다. 프로젝트를 내가 생각한 방향으로 차근차근 구현하는 게 꼭 제가 좋아했던 프라모델과 레고를 만드는 것처럼 느껴졌기 때문이었습니다. 또 문제를 파악하고 디버깅해 새로운 방식으로 다시 시도하고 결론에 도달할 무렵, 지난 과정을 README로 작성하는 제 모습 또한 좋았습니다. 꼭 작가가 자신의 시나리오를 완성하기 위해 계속해서 수정하는 모습처럼 느껴졌기 때문이었습니다.

- 제가 좋아하는 노벨문학상 작가의 말처럼, 바늘로 우물을 판다는 자세로 정진해 나겠습니다. 실패를 부끄러워하지 않고 과정 중에서 경험한 걸 기록하고 다시금 시도해 보는 개발자가 되겠습니다. 그래서 어제보다 더 성장한 동료가 될 수 있도록 노력하겠습니다.

# 연락처

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/donghyukkil">
        <img src="https://avatars.githubusercontent.com/u/124029691?v=4" alt="길동혁 프로필" width="100px" height="100px" />
      </a>
    </td>
  </tr>
  <tr>
    <td>
      <ul>
        <li><a href="https://github.com/donghyukkil">길동혁</a></li>
		    <li>asterism90@gmail.com</li>
	    </ul>
    </td>
  </tr>
</table>
