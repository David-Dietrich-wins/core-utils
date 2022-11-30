import { hello } from "../src/index"

test("Verifies hello", () => {
  expect(hello("David")).toBe("Hello, David!")
})
