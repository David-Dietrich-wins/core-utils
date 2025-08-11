import { ConfigOperations } from './ConfigOperations.mjs'

test(ConfigOperations.name, () => {
  const cfg = ConfigOperations.defaults()

  expect(cfg).toBeDefined()
  expect(cfg.minusEightPlus10).toBeDefined()
  expect(cfg.minusEightPlus10.value).toBe(true)

  const updated = ConfigOperations.minusEightPlus10(cfg)

  expect(updated).toBeDefined()
  expect(updated.minusEightPlus10.value).toBe(false)
  expect(updated.updated).toBeDefined()
})

test(ConfigOperations.minusEightPlus10.name, () => {
  const cfg = ConfigOperations.defaults()

  expect(cfg).toBeDefined()
  expect(cfg.minusEightPlus10).toBeDefined()
  expect(cfg.minusEightPlus10.value).toBe(true)

  const updated = ConfigOperations.minusEightPlus10(cfg)

  expect(updated).toBeDefined()
  expect(updated.minusEightPlus10.value).toBe(false)
  expect(updated.updated).toBeDefined()
})
