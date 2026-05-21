import { render, screen } from "@testing-library/react";
import Page from "../page";
import { describe, expect, it } from "vitest";

describe("Home Page", () => {
  it("renders the baseline portfolio shell", () => {
    render(<Page />);

    expect(
      screen.getByRole("heading", { level: 1, name: "chan.works" }),
    ).toBeInTheDocument();
  });
});
