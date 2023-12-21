export const handleDownloadClick = (
  textValue: string,
  textareaRef: React.RefObject<HTMLDivElement>,
  backgroundColor: string,
) => {
  const lineHeight = 36;
  const getBetweenLines = 36;
  const padding = 20;
  const lines = textValue.split("\n");
  const lineCount = lines.length;
  const canvasHeight = lineCount * getBetweenLines + 2 * padding;

  const canvas = document.createElement("canvas");

  if (textareaRef.current) {
    canvas.width = textareaRef.current.offsetWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000";
      ctx.font = "18px Courier New";

      let yOffset = 0;

      for (let i = 0; i < lines.length; i++) {
        const y = padding + yOffset + lineHeight;
        ctx.fillText(lines[i], padding, y);
        ctx.fillRect(padding, y + 2, canvas.width - 2 * padding, 1);
        yOffset += getBetweenLines;
      }
    }

    canvas.toBlob(blob => {
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "legalpad.png";
        link.click();

        window.URL.revokeObjectURL(url);
      }
    }, "image/png");
  }
};
