import { render, fireEvent, screen } from "@testing-library/react";

import Button from "./index";

describe("Button Component", () => {
  test("should call onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByText("Click Me"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("should display the children prop", () => {
    render(<Button>Click Me</Button>);

    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  test("should use the style prop as className", () => {
    const style = "test-button";
    render(<Button style={style}>Click Me</Button>);

    expect(screen.getByText("Click Me")).toHaveClass(style);
  });

  test("should pass additional props to the button", () => {
    render(<Button data-testid="custom-button">Click Me</Button>);

    expect(screen.getByTestId("custom-button")).toBeInTheDocument();
  });
});
