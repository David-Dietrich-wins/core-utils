import { RedirectHelper } from './redirect-helper.mjs'

test('Redirect Helper Tests', () => {
  expect(RedirectHelper.ProtectedPaths).toContain('admin')
  expect(RedirectHelper.ProtectedPaths).toContain('dashboard')

  expect(RedirectHelper.IllegalRedirectPaths).toContain('/')
  expect(RedirectHelper.IllegalRedirectPaths).toContain('/login')
})

describe('getRedirectAfterLogin', () => {
  test('returns default redirect for illegal paths', () => {
    const result = RedirectHelper.CleansedRedirect('/login', '/dashboard')
    expect(result).toBe('/dashboard')

    const defaultResult = RedirectHelper.CleansedRedirect('/login', null)
    expect(defaultResult).toBe('/')

    expect(RedirectHelper.CleansedRedirect('/a', null)).toBe(
      '/login?redirectUrl=%2Fa'
    )
  })

  test('handles illegal redirect paths', () => {
    const result = RedirectHelper.CleansedRedirect('/login', '/')
    expect(result).toBe('/')

    const result2 = RedirectHelper.CleansedRedirect('/login', '/dashboard')
    expect(result2).toBe('/dashboard')

    const myCustomPath = '/test-path'
    const nonLoggedInRedirectPath = `/login?redirectUrl=${encodeURIComponent(
      myCustomPath
    )}`
    expect(RedirectHelper.CleansedRedirect('/login', myCustomPath)).toBe(
      myCustomPath
    )

    expect(RedirectHelper.CleansedRedirect('/', myCustomPath)).toBe(
      myCustomPath
    )
    expect(RedirectHelper.CleansedRedirect('/david', myCustomPath)).toBe(
      nonLoggedInRedirectPath
    )
    expect(RedirectHelper.CleansedRedirect('/dashboard', myCustomPath)).toBe(
      nonLoggedInRedirectPath
    )
    expect(RedirectHelper.CleansedRedirect('/admin', myCustomPath)).toBe(
      nonLoggedInRedirectPath
    )
    expect(RedirectHelper.CleansedRedirect('/a', myCustomPath)).toBe(
      nonLoggedInRedirectPath
    )
  })
})

test.each(['/a', '/admin', '/dashboard', '/zebra'])(
  'CleansedRedirect at /login goes directly to each of the paths',
  (path: string) => {
    const result = RedirectHelper.CleansedRedirect('/login', path)
    expect(result).toBe(path)
  }
)

const myTestPath = '/test-path'

test.each(['/a', '/admin', '/dashboard', '/zebra'])(
  'CleansedRedirect at /dashboard redirects to /login with the redirectUrl of the path',
  (path: string) => {
    const result = RedirectHelper.CleansedRedirect('/dashboard', path)
    expect(result).toBe(`/login?redirectUrl=${encodeURIComponent(path)}`)
  }
)

test.each(['/a', '/admin', '/dashboard', '/zebra'])(
  'CleansedRedirect at /login redirects to /login with the redirectUrl of the path',
  (path: string) => {
    const result = RedirectHelper.CleansedRedirect(path, myTestPath)
    expect(result).toBe(`/login?redirectUrl=${encodeURIComponent(myTestPath)}`)
  }
)

test.each([undefined, null, '', '/', '/login'])(
  'CleansedRedirect redirects to /dashboard for illegal paths',
  (path: string | null | undefined) => {
    const result = RedirectHelper.CleansedRedirect('/login', path)
    expect(result).toBe('/')
  }
)
