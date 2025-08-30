import {
  asyncGeneratorLoopRunMaxIterations,
  asyncGeneratorLoopStopOnFalsyOrException,
} from './async-helper.mjs'

describe(asyncGeneratorLoopRunMaxIterations.name, () => {
  test('good', async () => {
    const generator = asyncGeneratorLoopRunMaxIterations(
      () => Promise.resolve([1, 2, 3]),
      2
    )

    let result = await generator.next()
    expect(result).toStrictEqual({
      done: false,
      value: [1, 2, 3],
    })

    result = await generator.next()
    expect(result).toStrictEqual({
      done: true,
      value: undefined,
    })

    result = await generator.next()
    expect(result).toStrictEqual({
      done: true,
      value: undefined,
    })
  })

  test('default maxIterations', async () => {
    const generator = asyncGeneratorLoopRunMaxIterations(() =>
      Promise.resolve([1, 2, 3])
    )

    let result = await generator.next()
    expect(result).toStrictEqual({
      done: false,
      value: [1, 2, 3],
    })

    result = await generator.next()
    expect(result).toStrictEqual({
      done: true,
      value: undefined,
    })

    result = await generator.next()
    expect(result).toStrictEqual({
      done: true,
      value: undefined,
    })
  })

  test('throws an exception', async () => {
    const generator = asyncGeneratorLoopRunMaxIterations(
      () => Promise.reject(new Error('Test error')),
      2
    )

    let result = await generator.next()
    expect(result).toStrictEqual({
      done: true,
      value: undefined,
    })

    result = await generator.next()
    expect(result).toStrictEqual({
      done: true,
      value: undefined,
    })
  })
})

describe(asyncGeneratorLoopStopOnFalsyOrException.name, () => {
  test('good', async () => {
    let runCount = 0

    const generator = asyncGeneratorLoopStopOnFalsyOrException(() => {
      runCount += 1

      if (runCount === 1) {
        return Promise.resolve([1, 2, 3])
      }
      return Promise.resolve([])
    })

    let result = await generator.next()
    expect(result).toStrictEqual({
      done: false,
      value: [1, 2, 3],
    })

    result = await generator.next()
    expect(result).toStrictEqual({
      done: false,
      value: [],
    })
  })

  test('empty result', async () => {
    let runCount = 0

    const generator = asyncGeneratorLoopStopOnFalsyOrException(() => {
      runCount += 1

      if (runCount === 1) {
        return Promise.resolve([1, 2, 3])
      }

      return Promise.resolve(undefined)
    })

    let result = await generator.next()
    expect(result).toStrictEqual({
      done: false,
      value: [1, 2, 3],
    })

    result = await generator.next()
    expect(result).toStrictEqual({
      done: true,
      value: undefined,
    })
  })

  test('exception thrown', async () => {
    let runCount = 0

    const generator = asyncGeneratorLoopStopOnFalsyOrException(() => {
      runCount += 1

      if (runCount === 1) {
        return Promise.resolve([1, 2, 3])
      }

      return Promise.reject(new Error('Test error'))
    })

    let result = await generator.next()
    expect(result).toStrictEqual({
      done: false,
      value: [1, 2, 3],
    })

    result = await generator.next()
    expect(result).toStrictEqual({
      done: true,
      value: undefined,
    })
  })
})
