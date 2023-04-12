import {
  FetchDataTypesAllowed,
  fetchJson,
  HttpFetchRequestProps,
  HttpMethod,
} from './fetch-http.js'

// From https://blog.logrocket.com/react-suspense-data-fectching/
// This will prevent a component from rendering until the data is ready.
// It does this by way of throwing the suspender promise.
// <Suspense /> sees a Promise is thrown and it knows to wait.

/**
 * Wraps a Promise waiting for status conditions.
 * Throws the Promise if it is not completed.
 * @param promise A long running Promise to manage pending, success and error states.
 * @returns A read method to be used by Components that are wrapped in <Suspense> and <ErrorBoundary> parent components.
 */
function wrapPromise<TResponse>(promise: Promise<TResponse>): { read: () => TResponse } {
  let status = 'pending'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let response: any

  const suspender = promise.then(
    (res) => {
      status = 'success'
      response = res
    },
    (err) => {
      status = 'error'
      response = err
    }
  )

  const read = (): TResponse => {
    switch (status) {
      case 'pending':
        throw suspender
      case 'error':
        throw response
      default:
        return response
    }
  }

  return { read }
}

/**
 * Wraps a Promise waiting for status conditions via the returned read() method.
 * Throws the Promise if it is not completed so that <Suspense> continues waiting until the Promise if returned cleanly from read().
 * @param url The API Endpoint to be used for this call.
 * @param sourceFunctionName The callers function name for outputting in potential error calls.
 * @param method The HTTP method to be used for this call. GET, PUT, POST, ...
 * @returns A read() method to be used by <Suspense> and <ErrorBoundary> to show components when the data is ready.
 */
export function fetchJsonPromise<Tdata extends FetchDataTypesAllowed, Tret>(
  url: string,
  sourceFunctionName: string,
  method: HttpMethod,
  { data, bearerToken }: HttpFetchRequestProps<Tdata>
) {
  const settings: HttpFetchRequestProps<Tdata> = {
    data,
    bearerToken,
  }
  const promise = fetchJson<Tdata, Tret>(url, sourceFunctionName, method, settings)

  return wrapPromise(promise)
}
