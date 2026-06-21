import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Details from "./Details";
import api from "../api";

vi.mock("react-router-dom", () => ({
  useHistory: () => ({ push: vi.fn() }),
  useParams: () => ({ id: "recipe-1" }),
}));

vi.mock("../api", () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
  getImageUrl: (src) => src || "",
  isAdminUser: () => false,
}));

vi.mock("../components/AdminRecipeDeleteButton", () => ({
  default: () => null,
}));

test("renders comment metadata on the details page", async () => {
  api.get.mockResolvedValueOnce({
    data: {
      id: "recipe-1",
      title: "אינג'רה",
      name: "יעקב",
      src: "",
      Ingredients: "קמח טף",
      Instructions: "מערבבים ומכינים",
      Nots: "",
      mealTimes: ["צהריים"],
      adminApproval: true,
      comments: [
        {
          text: "תגובה חדשה",
          authorName: "yakov133",
          authorId: "user-1",
          createdAt: "2026-06-21T12:30:00.000Z",
        },
      ],
    },
  });

  render(<Details userLogedIn={{ email: "yakov133@walla.com" }} />);

  expect(await screen.findByText("yakov133")).toBeInTheDocument();
  expect(screen.getByText("תגובה חדשה")).toBeInTheDocument();
  expect(screen.getByText((content, element) => (
    element.tagName.toLowerCase() === "time" && content.length > 0
  ))).toHaveAttribute("dateTime", "2026-06-21T12:30:00.000Z");
});
