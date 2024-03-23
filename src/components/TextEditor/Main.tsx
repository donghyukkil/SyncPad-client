import { useState, useEffect, RefObject } from "react";
import { ToastContainer } from "react-toastify";
import { Socket } from "socket.io-client";

interface MainProps {
  textareaRef: RefObject<HTMLDivElement>;
  handleInputChange: (event: React.FormEvent<HTMLDivElement>) => void;
  roomId: string;
  typingUser: string;
  backgroundColor: string;
  socket?: Socket;
  cursorNodeIndex?: number;
  handleColorChange: (color: string) => void;
}

const Main: React.FC<MainProps> = ({
  textareaRef,
  handleInputChange,
  roomId,
  typingUser,
  backgroundColor,
  socket,
  cursorNodeIndex,
  handleColorChange,
}) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [selectedRange, setSelectedRange] = useState<Range | null>(null);
  const [content, _] = useState("");
  const placeholder = "글을 작성 후 범위를 선택하세요...";

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.backgroundColor = backgroundColor;
    }
  }, [backgroundColor]);

  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();

      if (
        selection &&
        selection.type === "Range" &&
        selection.toString().trim() !== ""
      ) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setShowContextMenu(true);
        setContextMenuPosition({
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY - 40,
        });
        setSelectedRange(range);
      } else {
        setShowContextMenu(false);
      }
    };

    const textarea = textareaRef.current;

    if (textarea) {
      textarea.addEventListener("mouseup", handleTextSelection);

      return () => {
        textarea.removeEventListener("mouseup", handleTextSelection);
      };
    }

    return () => {};
  }, [textareaRef]);

  useEffect(() => {
    if (!content && textareaRef.current) {
      textareaRef.current.innerHTML = `<span class="placeholder">${placeholder}</span>`;
    }
  }, [content, textareaRef, placeholder]);

  const handleFocus = () => {
    if (
      textareaRef.current &&
      textareaRef.current.textContent === placeholder
    ) {
      textareaRef.current.innerHTML = "";
    }
  };

  const handleBlur = () => {
    if (!textareaRef.current?.textContent) {
      textareaRef.current!.innerHTML = `<span class="placeholder">${placeholder}</span>`;
    }
  };

  type StyleType =
    | "bold"
    | "italic"
    | "underline"
    | "color"
    | "size"
    | "highlight"
    | "backgroundColor";

  const applyStyle = (styleType: StyleType, value: string = "") => {
    if (!selectedRange) {
      return;
    }

    const content = selectedRange.extractContents();
    const fragment = document.createDocumentFragment();

    const applyStyleToTextNode = (
      node: Node,
      styleType: StyleType,
      value: string,
    ) => {
      const span = document.createElement("span");
      span.textContent = node.textContent;

      switch (styleType) {
        case "bold":
          span.style.fontWeight = "bold";
          break;
        case "italic":
          span.style.fontStyle = "italic";
          break;
        case "underline":
          span.style.textDecoration = "underline";
          break;
        case "highlight":
          span.style.backgroundColor = "yellow";
          break;
        case "backgroundColor":
          span.style.backgroundColor = value;
          break;

        default:
          break;
      }
      const styledHTML = span.outerHTML;

      socket?.emit("styleChange", {
        roomId,
        styleType,
        value: styledHTML,
        cursorIndex: cursorNodeIndex,
      });
      setShowContextMenu(false);

      return span;
    };

    Array.from(content.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim() !== "") {
        fragment.appendChild(applyStyleToTextNode(node, styleType, value));
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const clonedNode = node.cloneNode(true);

        Array.from(clonedNode.childNodes).forEach(childNode => {
          if (
            childNode.nodeType === Node.TEXT_NODE &&
            childNode.textContent?.trim() !== ""
          ) {
            clonedNode.replaceChild(
              applyStyleToTextNode(childNode, styleType, value),
              childNode,
            );
          }
        });

        fragment.appendChild(clonedNode);
      }
    });

    selectedRange.insertNode(fragment);

    const selection = window.getSelection();

    if (selection) {
      selection.removeAllRanges();
    }

    setShowContextMenu(false);
  };

  const resetStyle = () => {
    if (!selectedRange) {
      return;
    }

    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selectedRange.cloneRange();
    let commonAncestor = selectedRange.commonAncestorContainer;

    if (commonAncestor.nodeType === 3 && commonAncestor.parentNode !== null) {
      commonAncestor = commonAncestor.parentNode;
    }

    if (commonAncestor instanceof Element) {
      const spans = commonAncestor.getElementsByTagName("span");

      const spansToReset = Array.from(spans).filter(span =>
        selectedRange.intersectsNode(span),
      );

      spansToReset.forEach(span => {
        const parent = span.parentNode;

        while (span.firstChild) {
          parent?.insertBefore(span.firstChild, span);
        }

        parent?.removeChild(span);
      });

      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      console.error("Common ancestor is not an element.");
    }

    handleColorChange("#FFFFFF");
  };

  const handleColorSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    handleColorChange(event.target.value);
  };

  return (
    <>
      <div className="flex flex-col my-6">
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className="flex justify-center bg-blue-900 min-h-[7vh] rounded-t-lg">
          <div className="text-white text-lg m-auto">S y n c P a d</div>
        </div>

        <div
          className="bg-yellow-200 min-h-[60vh] max-h-[60vh] rounded-b-lg shadow-xl focus:border-2 focus:border-blue-500 focus:outline-none"
          ref={textareaRef}
          onInput={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          contentEditable
          style={{
            lineHeight: "33px",
            padding: "11px",
            fontFamily: "Courier New",
            color: "#000",
            background: `linear-gradient(0deg, rgba(0,0,0,0.2) 1px, transparent 1px)`,
            backgroundSize: "100% 33px, 100% 100%",
            backgroundColor: backgroundColor,
            overflowY: "auto",
            border: "none",
          }}
        />

        <div
          className="rounded-md text-center text-lg font-semibold font-mono flex items-center justify-center"
          style={{ height: "5px", marginTop: "25px" }}
        >
          {typingUser ? `${typingUser}가 입력 중입니다...` : ""}
        </div>

        {showContextMenu && (
          <ul
            className="context-menu"
            style={{
              position: "absolute",
              display: "flex",
              flexDirection: "row",
              top: `${contextMenuPosition.y - 20}px`,
              left: `${contextMenuPosition.x}px`,
              listStyle: "none",
              margin: 0,
              padding: "5px",
              backgroundColor: "rgba(249, 249, 249, 0.9)",
              border: "1px solid #ccc",
              borderRadius: "5px",
              zIndex: 100,
            }}
          >
            <li
              onClick={() => applyStyle("bold")}
              style={{ padding: "5px", cursor: "pointer" }}
            >
              Bold
            </li>
            <li
              onClick={() => applyStyle("italic")}
              style={{ padding: "5px", cursor: "pointer" }}
            >
              Italic
            </li>
            <li
              onClick={() => applyStyle("underline")}
              style={{ padding: "5px", cursor: "pointer" }}
            >
              Underline
            </li>

            <li
              onClick={() => applyStyle("highlight")}
              style={{ padding: "5px", cursor: "pointer" }}
            >
              Highlight
            </li>
            <li
              onClick={resetStyle}
              style={{ padding: "5px", cursor: "pointer" }}
            >
              reset
            </li>
            <li style={{ padding: "5px", cursor: "pointer" }}>
              <select
                value={backgroundColor}
                onChange={handleColorSelectChange}
                className="color-select focus:outline-none"
                style={{
                  listStyle: "none",
                  margin: 0,
                  backgroundColor: "rgba(249, 249, 249, 0.9)",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  zIndex: 100,
                }}
              >
                <option value="#FFFFFF">White</option>
                <option value="#F8BBD0">Pink</option>
                <option value="#C8E6C9">Green</option>
                <option value="#BBDEFB">Blue</option>
                <option value="#FFCDD2">Red</option>
              </select>
            </li>
          </ul>
        )}
      </div>
    </>
  );
};

export default Main;
