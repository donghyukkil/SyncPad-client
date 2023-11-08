export const convertHTMLToPlainText = html => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  let text = "";

  tempDiv.childNodes.forEach(node => {
    const nodeName = node.nodeName.toLowerCase();
    if (nodeName === "div" || nodeName === "p") {
      text += "\n" + (node.textContent || "");
    } else if (nodeName === "br") {
      text += "\n";
    } else {
      text += node.textContent;
    }
  });

  return text.startsWith("\n") ? text.slice(1) : text;
};

export const convertPlainTextToHTML = text => {
  const lines = text.split("\n");

  return lines.map(line => `<div>${line}</div>`).join("");
};

export const saveSelection = () => {
  if (window.getSelection) {
    const sel = window.getSelection();

    if (sel.getRangeAt && sel.rangeCount) {
      return sel.getRangeAt(0);
    }
  }

  return null;
};

export const restoreSelection = range => {
  if (range) {
    if (window.getSelection) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
};

export const handleContentChange = (
  event,
  setTextValue,
  socket,
  roomId,
  typingTimerRef,
  TYPING_INTERVAL,
  textareaRef,
  setTypingUser,
) => {
  const savedSelection = saveSelection();
  const cursorPosition = savedSelection.getBoundingClientRect();

  const newValue = convertHTMLToPlainText(event.currentTarget.innerHTML);
  setTextValue(newValue);

  const userPhotoURL = localStorage.getItem("userPhotoURL");

  if (!!socket.current) {
    socket.current.emit("textChange", {
      roomId,
      text: newValue,
      userPhotoURL,
      cursorPosition,
    });
    socket.current.emit("typing", roomId);
  }

  if (typingTimerRef.current) {
    clearTimeout(typingTimerRef.current);
  }

  typingTimerRef.current = setTimeout(() => {
    setTypingUser(null);
  }, TYPING_INTERVAL);

  const iconElement = showProfileImage(
    userPhotoURL,
    cursorPosition,
    textareaRef.current.parentElement,
  );

  removeProfileImage(iconElement, TYPING_INTERVAL);

  restoreSelection(savedSelection);
};

export const showProfileImage = (userPhotoURL, cursorPosition, container) => {
  const iconElement = document.createElement("img");
  iconElement.src = userPhotoURL;
  iconElement.alt = "User Icon";
  iconElement.style.width = "32px";
  iconElement.style.height = "32px";
  iconElement.style.position = "absolute";
  iconElement.style.left = cursorPosition.left + "px";
  iconElement.style.top = cursorPosition.top + "px";

  container.appendChild(iconElement);

  return iconElement;
};

export const removeProfileImage = (iconElement, timeoutDuration) => {
  setTimeout(() => {
    if (iconElement.parentNode) {
      iconElement.parentNode.removeChild(iconElement);
    }
  }, timeoutDuration);
};
