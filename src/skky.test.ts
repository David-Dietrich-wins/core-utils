import { urlJoin } from "./skky"

test("Url join with trailing slashes", () => {
  const baseUrl = "  https://TestTrailing.com//"
  const path = "//TestLeadingAndTrailing//"
  expect(urlJoin(baseUrl, path)).toBe("https://TestTrailing.com/TestLeadingAndTrailing/")
})
