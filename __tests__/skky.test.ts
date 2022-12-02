import { urlJoin } from "../src/utils/skky"

test("Url join with trailing slashes", () => {
  const baseUrl = "  https://TestTrailing.com//"
  const path = "//TestLeadingAndTrailing//"
  expect(urlJoin(baseUrl, path)).toBe("https://TestTrailing.com/TestLeadingAndTrailing/")
})
