# 목차

- [동기](#동기)
- [Deploy](#deploy)
- [주요 기능 소개](#주요-기능-소개)
- [프로젝트 관심사](#프로젝트-관심사)
  - [contentEditable](#contenteditable)
    - [contentEditable 도입한 이유](#contenteditable-도입한-이유)
    - [비제어 컴포너트](#비제어-컴포넌트)
    - [비제어 컴포넌트 방식으로 사용자 입력값 렌더링하기](#비제어-컴포넌트-방식으로-사용자-입력값-렌더링하기)
  - [소켓을 이용한 실시간 메모 기능](#소켓을-이용한-실시간-메모-기능)
    - [Socket IO 도입한 이유](#socket-io-도입한-이유)
    - [커서 위치 시각화 위치가 맞지 않은 문제를 어떻게 해결했는지?](#커서-위치-시각화-위치가-맞지-않는-문제를-어떻게-해결했는지)
- [기술스택](#기술스택)
- [느낀점](#느낀점)
- [연락처](#연락처)

<br>

# 동기

- SyncPad는 손글씨 인식(OCR)과 소켓 통신을 결합해 사용자들이 실시간으로 협업하며 메모를 작성할 수 있는 웹 애플리케이션입니다. SyncPad라는 이름은 손글씨를 디지털 데이터로 변환하는 '동기화(Sync)' 과정과 다른 사용자들과의 실시간 메모 공유를 가능하게 하는 '동기화(Sync)' 기능의 이중적 의미를 담고 있습니다. SyncPad는 개인 노트 작성부터 팀 프로젝트 협업까지 다양한 사용 사례를 고려한 웹 애플리케이션입니다.

<br>

# Deploy

[사용하기](https://syncpad.site)

<br>

# 주요 기능 소개

- 소켓을 사용하여 사용자의 입력 위치 실시간 동기화.

- 소켓을 사용하여 사용자의 richText(bold, italic, underline, highlight) 실시간 동기화.

- Google Cloud Vision API를 사용하여 작성한 메모에서 손 글씨를 인식하여 데이터화. (OCR)

- 메모 작성, 다운로드, 공유하기 등이 주요 기능. 이러한 기능 구현에 `contentEditable`을 사용.

- **함께 메모하기**

    <p align="center">
      <img src="https://github.com/donghyukkil/hello-legalpad-client/assets/124029691/9675ddb4-64f3-4e02-946e-45708b9c3525",width="600" height="500">
    </p>

- **richText**

    <p align="center">
      <img src="https://github.com/donghyukkil/SyncPad-client/assets/124029691/b935df59-f703-4849-81c5-95c92e210465", width="600" height="500">
    </p>

- **손글씨 인식** (OCR 기능)

  <p align="center">
    <img src="https://github.com/donghyukkil/hello-legalpad-client/assets/124029691/d147269d-f4a7-4727-802a-237d5b896942", width="200" height="350">
  </p>

- **텍스트 생성** (색상 변경, 이미지 다운로드 기능)

  <p align="center">
    <img src="https://github.com/donghyukkil/hello-legalpad-client/assets/124029691/9b91bf51-32c6-4ef9-aeb1-855984c2948b", width="200" height="300">
  </p>

# 프로젝트 관심사

## contentEditable

### contentEditable 도입한 이유

- 메모 앱 애플리케이션을 구현하기 위해선 사용자의 입력을 전달받아야 합니다. 이를 위해서 처음에는 `textarea`를 사용했습니다. `textarea`는 사용자 입력을 렌더링할 수 있지만, 사용자의 커서 위치를 계산하는데는 적합하지 않습니다. 좌표 계산을 위해 Selection API와 Range API를 사용했어야만 했는데, `textarea`에서 이 기술들을 적용하지 못하기 때문입니다. `textarea`는 텍스트가 DOM 노드로 분리되어 있지 않고 단일한 문자열로 취급되기 때문에, 이러한 API를 사용하는 것이 어렵거나 비효율적입니다.

- 또한 텍스트에디터 기능. richText, 마크다운 문법 적용 등을 도입하기에 `textarea` 방식이 한계가 있다는 것을 알게 되었습니다. 따라서 프로젝트가 확장될 것을 고려한 결과, 개발 도중 `textarea` 방식을 사용하는 것을 중단하고 `contentEditable`을 이용하여 프로젝트를 개발하게 되었습니다.

### 비제어 컴포넌트

| 특성            | 제어 컴포넌트 (`input`, `textarea`)       | 비제어 컴포넌트 (`contentEditable`)                   |
| --------------- | ----------------------------------------- | ----------------------------------------------------- |
| **데이터 흐름** | 위에서 아래로 (Top-down) React가 제어     | React 제어에서 벗어나서 사용자가 개입.(직접 DOM 편집) |
| **이벤트 처리** | `onChange` 이벤트를 사용하여 `value` 관리 | `input` 이벤트를 사용, `value` 속성 없음              |
| **DOM 제어**    | React가 DOM을 직접 제어                   | React 외부에서 DOM 제어                               |
| **상태 관리**   | React 상태에 따라 `value` 관리            | 직접 DOM 조회해서 데이터 관리                         |

<br>

- `contentEditable`의 사용은 React 데이터 흐름에서 벗어납니다. 사용자에 의해 제어되지 않은 입력값이(사용자에 의한 직접 DOM 편집) 개입되기 때문에 비제어 컴포넌트 방식이라고 할 수 있습니다. 제어 컴포넌트처럼 리액트가 DOM을 제어할 수가 없기 때문에, `contentEditable` 사용 시에는 제어 컴포넌트와 다른 방식으로 제어를 해줘야 합니다.

### 비제어 컴포넌트 방식으로 사용자 입력값 렌더링하기

- **입력 초기화 문제**

  - 사용자가 `contentEditable` 영역에서 텍스트를 입력하면 실제 DOM이 변경되고 React의 가상 DOM은 이러한 변경 사항을 자동으로 인식하지 않습니다. 결국 다음 렌더링 시에 content에 해당 DOM의 올바른 상태라고 생각하는 것을 React가 overwrite 시켜서 사용자 입력값과 일치하지 않는 문제가 발생합니다.
    `contentEditable`을 사용한 방식은 실제 DOM 조작이 발생하고 이에 따라 React는 가상 DOM을 일관되게 유지하는 데 문제가 있습니다.

- **커서 위치 초기화 문제**

  - 또한 `contentEditable` 방식은 cursor 위치 초기화 문제가 발생합니다. 텍스트 입력값을 상태로 관리하게 되면 입력 시마다 상태가 변경되고 React에 의해 렌더링이 발생해서 cursor가 초기화가 됩니다. 이를 carret jump라고 부른다는 것을 알게 되었습니다. 따라서 carret jump 없이 사용자 입력에 따라서 컴포넌트를 업데이트할 방법을 찾아야만 했습니다.

- **결론:**

  `contentEditable`을 이용한 개발 방식에서 텍스트 입력값을 React 상태로 관리하면 커서 초기화 문제, 텍스트 연속 입력이 불가능한 문제가 발생합니다. `contentEditable`의 입력값을 `UseRef`로 관리하면 컴포넌트의 리렌더링 사이에 정보를 유지하여 앞서 언급한 문제에 대응할 수 있습니다.

  결론을 정리하면 다음과 같습니다.

    <p align="center">
      <img width="583" alt="uncotrolled_component" src="https://github.com/donghyukkil/SyncPad-client/assets/124029691/e0f4fcb2-e0ba-4342-bb4a-5914f9d3f212">
    </p>

  | 단계                          | 설명                                                                                                                                              |
  | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
  | **사용한 접근 방식**          | `contentEditable`의 텍스트 입력값인 `event.target.innerHTML`를 useRef를 통해서 관리.                                                              |
  | **사용자 입력값 초기화 문제** | `useRef`를 사용하여 해당 element를 조회하고 사용자 입력값이 초기화되지 않고 연속 입력되도록 관리.                                                 |
  | **텍스트 갱신**               | 다른 사용자의 입력값을 갱신해야 할 때, `useEffect` 내부에서 소켓으로부터 전달받은 데이터를 `textarea.current.innerHTML`에 재할당하여 텍스트 갱신. |

## 소켓을 이용한 실시간 메모 기능

### Socket IO 도입한 이유

- 여러 사용자가 함께 앱을 사용할 수 있게 하고 싶었습니다. 처음에는 소켓을 이용한 실시간 채팅 기능이 구현된 페이지 만들고자 했습니다. 하지만 메모 앱을 지향하는 프로덕트에 갑작스레 실시간 채팅 기능을 추가하면 프로덕트의 정체성을 해칠 것 같았습니다. 따라서 채팅이 아니라 메모 앱이라는 아이덴티티를 유지하면서도 "실시간으로 함께 메모" 기능을 구현해 보고 싶었습니다. 그 결과, Google Docs처럼 다른 사용자의 커서 위치를 시각화해서 사용자가 실시간으로 함께 메모할 수 있도록 구현하였습니다. 여기에 더해 Slack처럼 입력 창 하단에 어떤 사용자가 입력 중인지를 표시하였습니다.

### 커서 위치 시각화 위치가 맞지 않는 문제를 어떻게 해결했는지?

- 브라우저에서 커서 위치 값을 변수 `cursorPosition`에 저장하고 그 값을 전달받은 사용자가 상대방의 데이터를 이용하여 커서 위치를 렌더링하는 시나리오를 구상하였습니다.

- **DOM API의 getBoundingClientRect()을 이용한 방식**

- 웹 브라우저가 제공하는 DOM API의 `getBoundingClientRect()`는 해당 element의 viewport 내부에서 위치를 계산합니다. 따라서 커서 위치도 viewport 기준으로 계산되었고 그 결과, 사용자 브라우저 크기에 따라 프로필 이미지의 배치가 맞지 않는 문제가 발생하였습니다.

 <p align="center">
    <img src="https://github.com/donghyukkil/hello-legalpad-client/assets/124029691/c57b7e8c-1da5-409c-970b-07b19f026376",  width="500" height="300">
  </p>

- 문제 해결을 위해 커서 위치를 `contentEditable`를 요소의 컨테이너인 TextEditor를 기준으로 상대적으로 조정하여 계산하여 프로필 이미지를 배치하고자 했습니다. 하지만 작성된 글이 길어지는 경우 여전히 커서 위치가 동기화 되지 않는 것을 발견하였고 결국 브라우저 전체에서 특정 요소의 좌표를 구해 해당 좌표에 원하는 이미지를 렌더링하는 기존 방식에 한계가 있다는 것 깨닫게 되었습니다.

  <p align="center">
    <img src="https://github.com/donghyukkil/hello-legalpad-client/assets/124029691/d7a80d2e-d438-4680-836b-4422da638792",  width="500" height="300">
  </p>

- **DOM 조회 방식으로 수정하기**

  - 커서 위치를 DOM 요소를 기반으로 위치를 추적한다면, 브라우저 크기와 독립적으로 변화가 발생한 요소를 찾아 스타일을 적용해 상대 사용자의 입력 데이터를 시각화할 수 있다고 판단했습니다.

  - 브라우저 크기가 변화해도 `targetNode`를 인식하여 다른 사용자의 커서 위치를 시각화할 수 있었습니다.

    <p align="center">
      <img src="https://github.com/donghyukkil/hello-legalpad-client/assets/124029691/cb3b3d16-6cc7-4025-8ff7-9176201e7cbf", width="500" height="300">
    </p>

- **상세 설명**

  - 사용자가 입력한 텍스트 값은 event 객체에서 Nodelist로 조회할 수 있습니다. NodeList에서 텍스트 입력 시 이벤트가 발생한 요소를 찾아 변수 `cursorNode`에 할당합니다.

  - `event.target.childNodes`에서 `cursorNode`의 인덱스를 찾고 이 인덱스를 변수 `cursorNodeIndex`에 저장합니다. 사용자 텍스트 입력 정보를 소켓으로 다른 사용자에게 전달합니다.

    <p align="center">
     <img width="602" alt="handleInputChange" src="https://github.com/donghyukkil/SyncPad-client/assets/124029691/a472cc4d-59c4-4f08-8de3-b1cda6bcbb03">

    </p>

  - textChanged 이벤트를 통해 현재 사용자의 `contentEditable` 요소를 갱신합니다. 해당 요소의 NodeList에서 전달받은 인덱스를 이용하여 다른 사용자에 의해 변화가 발생한 DOM 요소를 찾고 새로운 변수 `targetNode`에 할당합니다. `targetNode`는 소켓 이벤트를 전송한 사용자가 어느 부분을 편집하고 있는지를 시각적으로 나타냅니다.

  <p align="center">
    <img width="604" alt="textChanged" src="https://github.com/donghyukkil/SyncPad-client/assets/124029691/ec909758-ec0e-46c7-9d25-d29bb319fe3b">
  </p>

  - 전달받은 프로필 이미지를 `placeProfileImageNearNode` 함수를 이용하여 해당 DOM 근처에 렌더링합니다.

      <p align="center">
        <img width="561" alt="placeProfileImageNearNode" src="https://github.com/donghyukkil/SyncPad-client/assets/124029691/1dd921db-55a9-4dd5-b90e-a50c491054f0">
      </p>

  - 프로젝트에서 적용한 세부 시나리오는 다음과 같습니다.

  | 단계                            | 설명                                                                                                                                              |
  | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
  | **1. 입력 발생**                | `contentEditable` 영역에서 입력이 발생하면 `handleInputChange` 함수가 호출됩니다.                                                                 |
  | **2. 커서 위치 파악**           | `childNodes` 배열과 `cursorNodeIndex`를 사용하여 현재 커서의 위치를 찾습니다.                                                                     |
  | **3. 소켓을 통한 데이터 송신**  | 사용자 입력 데이터와 커서 위치 정보를 소켓을 통해 다른 사용자에게 전송합니다.                                                                     |
  | **4. 소켓 데이터 수신 및 처리** | 소켓을 통해 수신된 데이터(`text`)를 `contentEditable` 요소에 재할당하고, `cursorNodeIndex`를 사용하여 마지막 커서 위치를 찾습니다. (`targetNode`) |
  | **5. 타겟 노드 좌표 계산**      | 상대방에게 전달받은 데이터에서 `targetNode`의 위치를 `getBoundingClientRect()` 메소드를 사용하여 계산합니다.                                      |
  | **6. 스타일 적용**              | `targetNode`에 스타일을 적용하여 시각적으로 강조합니다.                                                                                           |
  | **7. 이미지 렌더링**            | `placeProfileImageNearNode` 함수를 사용하여 `targetNode` 근처에 프로필 이미지를 렌더링합니다.                                                     |
  | **8. 요약**                     | 사용자는 상대방의 텍스트와 `cursorNodeIndex` 전달받고 이를 사용하여 다른 사용자가 어느 부분을 편집하고 있는지를 DOM 요소를 기반으로 시각화합니다. |

  <br>

# 기술스택

- Front-end:
  - JavaScript, React.
- Back-end:
  - Node.js, Express.js.
- Database:
  - MongoDB.
- 상태 관리
  - Zustand.
- 테스트코드

  - React Testing Library, Jest.

  <br>

# 느낀점

- 익숙하지 않은 비제어 컴포넌트 방식으로 인해 리액트의 일반적인 흐름에서 벗어나니 개발 초기에는 혼란스러웠습니다. 하지만 `contentEditable`를 사용하고 이를 이해하기 위한 과정에서 DOM, React에 대해 조사하는 과정이 정말 좋았습니다.

- 혼자서 프로젝트를 진행하면서 시행착오를 겪는 것 역시 좋았습니다. 프로젝트를 내가 생각한 방향으로 차근차근 구현하는 게 꼭 제가 좋아했던 프라모델과 레고를 만드는 것처럼 느껴졌기 때문이었습니다. 또 문제를 파악하고 디버깅해 새로운 방식으로 다시 시도하고 결론에 도달할 무렵, 지난 과정을 README로 작성하는 제 모습 또한 좋았습니다. 꼭 작가가 자신의 시나리오를 완성하기 위해 계속해서 수정하는 모습처럼 느껴졌기 때문이었습니다.

- 제가 좋아하는 노벨문학상 작가의 말처럼, 바늘로 우물을 판다는 자세로 정진해 나겠습니다. 실패를 부끄러워하지 않고 과정 중에서 경험한 걸 기록하고 다시금 시도해 보는 개발자가 되겠습니다. 그래서 어제보다 더 성장한 동료가 되겠습니다.

<br>

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
