import { render, fireEvent, screen } from "@testing-library/react";

import ImageUploader from "./index";

import useStore from "../../useStore";

jest.mock("../../utils/helpers", () => ({
  uploadImageToServer: jest.fn(),
}));

jest.mock("../../useStore", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("ImageUploader Component", () => {
  beforeEach(() => {
    useStore.mockReturnValue({ user: { id: "123" } });
  });

  test("should render initial state correctly", () => {
    render(<ImageUploader />);

    const labelElement =
      screen.getByText(/원하는 이미지에서 메모를 추출하세요/i);

    expect(labelElement).toBeInTheDocument();
  });

  test("should display selected image", async () => {
    const file = new File(["dummy content"], "test.png", {
      type: "image/png",
    });

    render(<ImageUploader />);

    const inputElement =
      screen.getByLabelText(/원하는 이미지에서 메모를 추출하세요/i);

    fireEvent.change(inputElement, { target: { files: [file] } });

    const image = await screen.findByAltText("Uploaded");

    expect(image).toBeInTheDocument();
  });
});
