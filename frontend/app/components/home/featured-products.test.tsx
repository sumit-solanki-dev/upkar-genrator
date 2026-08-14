import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { products } from "~/data/products";
import { FeaturedProducts } from "./featured-products";

describe("FeaturedProducts carousel", () => {
  it("exposes every capacity and keeps the controls in sync", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <FeaturedProducts products={products} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("region", { name: "Featured generator models" }),
    ).toHaveAttribute("aria-roledescription", "carousel");

    const previous = screen.getByRole("button", { name: "Previous product" });
    const next = screen.getByRole("button", { name: "Next product" });
    const firstCapacity = screen.getByRole("button", { name: "15 KVA" });
    const secondCapacity = screen.getByRole("button", { name: "25 KVA" });
    const finalCapacity = screen.getByRole("button", { name: "125 KVA" });

    expect(previous).toBeDisabled();
    expect(firstCapacity).toHaveAttribute("aria-current", "true");
    expect(
      screen.getByRole("img", { name: "Representative industrial diesel generator" }),
    ).toHaveAttribute("src", products[0]!.images[0]);

    await user.click(next);
    expect(secondCapacity).toHaveAttribute("aria-current", "true");
    expect(previous).toBeEnabled();

    await user.click(finalCapacity);
    expect(finalCapacity).toHaveAttribute("aria-current", "true");
    expect(next).toBeDisabled();
    expect(document.querySelector("#featured-product-125-kva")).not.toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
