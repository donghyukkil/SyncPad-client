export const handleDownloadClick = (
  textValue: string,
  textareaRef: React.RefObject<HTMLDivElement>,
  backgroundColor: string,
) => {
  const padding = 5;
  const titleHeight = 50;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx || !textareaRef.current) {
    console.error("Canvas context or textarea node is not available.");
    return;
  }

  const textarea = textareaRef.current;
  const computedStyle = window.getComputedStyle(textarea);

  canvas.width = textarea.offsetWidth;
  const lineHeight = parseInt(computedStyle.lineHeight, 10) || 36;
  const textHeight =
    Math.max(textarea.offsetHeight, lineHeight + 2 * padding) + titleHeight;
  canvas.height = textHeight;

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgb(30, 58, 138)";
  ctx.fillRect(0, 0, canvas.width, titleHeight);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.fillText("S y n c P a d", canvas.width / 2, titleHeight / 2 + 8);

  const lineSpacing = lineHeight;
  ctx.beginPath();
  const numberOfLines = Math.floor((canvas.height - titleHeight) / lineSpacing);

  for (let i = 0; i <= numberOfLines; i++) {
    ctx.moveTo(0, i * lineSpacing + titleHeight);
    ctx.lineTo(canvas.width, i * lineSpacing + titleHeight);
  }

  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  ctx.stroke();

  ctx.fillStyle = computedStyle.color || "#000";
  ctx.font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;
  ctx.textAlign = "left";
  let yOffset = padding + titleHeight;
  const lines = textValue.split("\n");

  lines.forEach(line => {
    const y =
      yOffset +
      lineHeight -
      (lineHeight - parseInt(computedStyle.fontSize, 10)) / 2;
    ctx.fillText(line, padding, y);
    yOffset += lineHeight;
  });

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
};
