import { validateUsername } from "./utils";

test("validateUsername returns false for non-emails", () => {
  expect(validateUsername(undefined)).toBe(false);
  expect(validateUsername(null)).toBe(false);
  expect(validateUsername("")).toBe(false);
  expect(validateUsername("not-an-email")).toBe(false);
  expect(validateUsername("n@")).toBe(false);
});

test("validateUsername returns true for emails", () => {
  expect(validateUsername("kody@example.com")).toBe(true);
});
