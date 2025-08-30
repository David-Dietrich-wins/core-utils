// Function to generate an array of promises
export function generateAsyncElements<T>(
  n: number,
  generateFn: (index: number) => Promise<T>
): Promise<T>[] {
  return Array.from({ length: n }, (_, i) => generateFn(i))
}

export async function* createAsyncIterableFromPromises<T>(
  promises: Promise<T>[]
): AsyncIterable<T> {
  for (const promise of promises) {
    // Wait for each promise to resolve before yielding its value
    // eslint-disable-next-line no-await-in-loop
    yield await promise
  }
}
/**
 * All this for await in a loop that can bail early...
 *
 * Async generator that repeatedly calls an async function and yields its result.
 * Stops when the async function throws or returns a falsy value.
 */
export async function* asyncGeneratorLoopRunMaxIterations<T>(
  asyncFn: () => Promise<T>,
  maxIterations = 100
): AsyncGenerator<T, void, unknown> {
  let count = 0

  while (count < maxIterations) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const result = await asyncFn()
      // If no exception is thrown, stop and yield the result
      yield result

      // Exit the loop after yielding the result
      break
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // If exception is thrown, continue looping
      count += 1
    }
  }
}

/**
 * Initial rev
 * Async generator that repeatedly calls an async function and yields its successful result.
 * Stops when the async function throws or returns a falsy value (customize as needed).
 */
export async function* asyncGeneratorLoopStopOnFalsyOrException<T>(
  asyncFn: () => Promise<T>,
  maxIterations = 100
): AsyncGenerator<T, void, unknown> {
  let count = 0
  while (count < maxIterations) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const result = await asyncFn()
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!result) {
        // Stop if result is falsy, adjust as needed
        break
      }
      yield result
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Stop on error, or handle/log as needed
      break
    }

    count += 1
  }
}
