import { handleDownloadClick } from "./textAction";

describe("handleDownloadClick", () => {
  const mockTextValue = "Hello\nWorld";
  const mockBackgroundColor = "#fff";
  let mockTextareaRef;
  let mockCanvas, mockCtx, mockLink;

  beforeEach(() => {
    mockTextareaRef = {
      current: {
        offsetWidth: 500,
      },
    };

    mockCanvas = {
      width: 0,
      height: 0,
      getContext: jest.fn(() => mockCtx),
      toBlob: jest.fn(),
    };

    mockCtx = {
      fillStyle: null,
      fillRect: jest.fn(),
      fillText: jest.fn(),
    };

    mockLink = {
      href: "",
      download: "",
      click: jest.fn(),
    };

    mockCanvas.toBlob = jest.fn(callback => {
      const blob = new Blob();
      callback(blob);
    });

    document.createElement = jest.fn(tagName => {
      if (tagName === "canvas") return mockCanvas;
      if (tagName === "a") return mockLink;
      return null;
    });

    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should generate and download an image based on text", async () => {
    handleDownloadClick(mockTextValue, mockTextareaRef, mockBackgroundColor);

    expect(mockCanvas.getContext).toHaveBeenCalledWith("2d");
    expect(mockCanvas.toBlob).toHaveBeenCalled();
    expect(mockCtx.fillRect).toHaveBeenCalled();
    expect(mockCtx.fillText).toHaveBeenCalled();
    expect(mockLink.click).toHaveBeenCalled();
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });
});
