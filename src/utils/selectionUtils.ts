export const convertHTMLToPlainText = (html: string) => {
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

export const convertPlainTextToHTML = (text: string) => {
  const lines = text.split("\n");

  return lines.map(line => `<div>${line}</div>`).join("");
};

export const saveSelection = (): Range | null => {
  if (window.getSelection) {
    const sel = window.getSelection();

    if (sel) {
      if (sel.getRangeAt && sel.rangeCount) {
        return sel.getRangeAt(0);
      }
    }
  }

  return null;
};

export const restoreSelection = (range: Range | null) => {
  if (range) {
    if (window.getSelection) {
      const sel = window.getSelection();

      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }
};

export const showProfileImage = (
  userPhotoURL: string,
  cursorPosition: { x: number; y: number },
  container: HTMLElement,
): HTMLImageElement => {
  const iconElement = document.createElement("img");
  iconElement.src = userPhotoURL;
  iconElement.alt = "User Icon";
  iconElement.style.width = "32px";
  iconElement.style.height = "32px";
  iconElement.style.position = "absolute";

  const containerRect = container.getBoundingClientRect();
  iconElement.style.left = cursorPosition.x + containerRect.left + "px";

  const verticalOffset = 50;
  iconElement.style.top =
    cursorPosition.y + containerRect.top + verticalOffset + "px";

  container.appendChild(iconElement);

  return iconElement;
};

export const removeProfileImage = (
  iconElement: HTMLImageElement,
  timeoutDuration: number,
) => {
  setTimeout(() => {
    if (iconElement.parentNode) {
      iconElement.parentNode.removeChild(iconElement);
    }
  }, timeoutDuration);
};
