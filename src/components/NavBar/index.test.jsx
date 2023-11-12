import { render, fireEvent, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import NavBar from "./index";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("NavBar Component", () => {
  beforeEach(() => {
    mockedNavigate.mockReset();
  });

  test("should navigate to /create when 메모 만들기 button is clicked", () => {
    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByText("메모 만들기"));

    expect(mockedNavigate).toHaveBeenCalledWith("/create");
  });

  test("should navigate to /upload when 메모 추출하기 button is clicked", () => {
    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByText("메모 추출하기"));

    expect(mockedNavigate).toHaveBeenCalledWith("/upload");
  });

  test("should navigate to /mypage when 마이 페이지 button is clicked", () => {
    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByText("마이 페이지"));

    expect(mockedNavigate).toHaveBeenCalledWith("/mypage");
  });
});
