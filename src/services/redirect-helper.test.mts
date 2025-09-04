import { RedirectHelper } from './redirect-helper.mjs'

it('Redirect Helper Tests', () => {
  expect(RedirectHelper.ProtectedPaths).toContain('admin')
  expect(RedirectHelper.ProtectedPaths).toContain('dashboard')

  expect(RedirectHelper.IllegalRedirectPaths).toContain('/')
  expect(RedirectHelper.IllegalRedirectPaths).toContain('/login')
})

describe('getRedirectAfterLogin', () => {
  it('returns default redirect for illegal paths', () => {
    const result = RedirectHelper.cleansedRedirect('/login', '/dashboard')
    expect(result).toBe('/dashboard')

    const defaultResult = RedirectHelper.cleansedRedirect('/login', null)
    expect(defaultResult).toBe('/')

    expect(RedirectHelper.cleansedRedirect('/a', null)).toBe(
      '/login?redirectUrl=%2Fa'
    )
  })

  it('handles illegal redirect paths', () => {
    const result = RedirectHelper.cleansedRedirect('/login', '/')
    expect(result).toBe('/')

    const result2 = RedirectHelper.cleansedRedirect('/login', '/dashboard')
    expect(result2).toBe('/dashboard')

    const myCustomPath = '/test-path',
      nonLoggedInRedirectPath = `/login?redirectUrl=${encodeURIComponent(
        myCustomPath
      )}`
    expect(RedirectHelper.cleansedRedirect('/login', myCustomPath)).toBe(
      myCustomPath
    )

    expect(RedirectHelper.cleansedRedirect('/', myCustomPath)).toBe(
      myCustomPath
    )
    expect(RedirectHelper.cleansedRedirect('/david', myCustomPath)).toBe(
      nonLoggedInRedirectPath
    )
    expect(RedirectHelper.cleansedRedirect('/dashboard', myCustomPath)).toBe(
      nonLoggedInRedirectPath
    )
    expect(RedirectHelper.cleansedRedirect('/admin', myCustomPath)).toBe(
      nonLoggedInRedirectPath
    )
    expect(RedirectHelper.cleansedRedirect('/a', myCustomPath)).toBe(
      nonLoggedInRedirectPath
    )
  })
})

test.each(['/a', '/admin', '/dashboard', '/zebra'])(
  'cleansedRedirect at /login goes directly to each of the paths',
  (path: string) => {
    const result = RedirectHelper.cleansedRedirect('/login', path)
    expect(result).toBe(path)
  }
)

const myTestPath = '/test-path'

test.each(['/a', '/admin', '/dashboard', '/zebra'])(
  'cleansedRedirect at /dashboard redirects to /login with the redirectUrl of the path',
  (path: string) => {
    const result = RedirectHelper.cleansedRedirect('/dashboard', path)
    expect(result).toBe(`/login?redirectUrl=${encodeURIComponent(path)}`)
  }
)

test.each(['/a', '/admin', '/dashboard', '/zebra'])(
  'cleansedRedirect at /login redirects to /login with the redirectUrl of the path',
  (path: string) => {
    const result = RedirectHelper.cleansedRedirect(path, myTestPath)
    expect(result).toBe(`/login?redirectUrl=${encodeURIComponent(myTestPath)}`)
  }
)

test.each([undefined, null, '', '/', '/login'])(
  'cleansedRedirect redirects to /dashboard for illegal paths',
  (path: string | null | undefined) => {
    const result = RedirectHelper.cleansedRedirect('/login', path)
    expect(result).toBe('/')
  }
)
