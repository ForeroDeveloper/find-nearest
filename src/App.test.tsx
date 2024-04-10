import { render, screen } from "@testing-library/react";
import App from "./App";

describe("BannerBase", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("should render header button", () => {
    expect(screen.getAllByText(/Lets go!/)).toBeDefined();
  });
});
