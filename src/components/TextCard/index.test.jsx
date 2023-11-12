import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import TextCard from "./index";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn().mockImplementation(() => mockNavigate),
}));

jest.mock("../../useStore", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("TextCard Component", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  const mockText = {
    _id: "123",
    content: "Test content",
    backgroundColor: "blue",
  };

  test("should render TextCard correctly", () => {
    render(
      <Router>
        <TextCard text={mockText} />
      </Router>,
    );

    expect(screen.getByText("Hello, legalPad!")).toBeInTheDocument();
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  test("should navigate to the detail page on click", () => {
    render(
      <Router>
        <TextCard text={mockText} />
      </Router>,
    );

    const card = screen.getByText("Hello, legalPad!");

    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith(`/mypage/${mockText._id}`);
  });

  test("should render object content correctly", () => {
    const complexText = {
      ...mockText,
      content: { part1: "Hello", part2: "World" },
    };

    render(
      <Router>
        <TextCard text={complexText} />
      </Router>,
    );

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("World")).toBeInTheDocument();
  });
});
