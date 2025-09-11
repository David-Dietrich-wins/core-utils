import { describe, expect, it } from '@jest/globals'
import { RedirectHelper } from './redirect-helper.mjs'

describe('redirect Helper Tests', () => {
  it('should have protected paths', () => {
    expect.assertions(2)

    expect(RedirectHelper.ProtectedPaths).toContain('admin')
    expect(RedirectHelper.ProtectedPaths).toContain('dashboard')
  })

  it('should have illegal redirect paths', () => {
    expect.assertions(2)

    expect(RedirectHelper.IllegalRedirectPaths).toContain('/')
    expect(RedirectHelper.IllegalRedirectPaths).toContain('/login')
  })
})

describe('getRedirectAfterLogin', () => {
  it('returns default redirect for illegal paths', () => {
    expect.assertions(3)

    const result = RedirectHelper.cleansedRedirect('/login', '/dashboard'),
      resultNull = RedirectHelper.cleansedRedirect('/login', null)

    expect(result).toBe('/dashboard')
    expect(resultNull).toBe('/')
    expect(RedirectHelper.cleansedRedirect('/a', null)).toBe(
      '/login?redirectUrl=%2Fa'
    )
  })

  it('handles illegal redirect paths', () => {
    expect.assertions(8)

    const aresult = RedirectHelper.cleansedRedirect('/login', '/'),
      aresult2 = RedirectHelper.cleansedRedirect('/login', '/dashboard'),
      myCustomPath = '/test-path',
      nonLoggedInRedirectPath = `/login?redirectUrl=${encodeURIComponent(
        myCustomPath
      )}`

    expect(aresult).toBe('/')
    expect(aresult2).toBe('/dashboard')

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

describe('cleanse redirect', () => {
  it.each(['/a', '/admin', '/dashboard', '/zebra'])(
    'cleansedRedirect at /login goes directly to each of the paths',
    (path: string) => {
      expect.assertions(1)

      const result = RedirectHelper.cleansedRedirect('/login', path)

      expect(result).toBe(path)
    }
  )

  const myTestPath = '/test-path'

  it.each(['/a', '/admin', '/dashboard', '/zebra'])(
    'cleansedRedirect at /dashboard redirects to /login with the redirectUrl of the path',
    (path: string) => {
      expect.assertions(1)

      const result = RedirectHelper.cleansedRedirect('/dashboard', path)

      expect(result).toBe(`/login?redirectUrl=${encodeURIComponent(path)}`)
    }
  )

  it.each(['/a', '/admin', '/dashboard', '/zebra'])(
    'cleansedRedirect at /login redirects to /login with the redirectUrl of the path',
    (path: string) => {
      expect.assertions(1)

      const result = RedirectHelper.cleansedRedirect(path, myTestPath)

      expect(result).toBe(
        `/login?redirectUrl=${encodeURIComponent(myTestPath)}`
      )
    }
  )

  it.each([undefined, null, '', '/', '/login'])(
    'cleansedRedirect redirects to /dashboard for illegal paths',
    (path: string | null | undefined) => {
      expect.assertions(1)

      const result = RedirectHelper.cleansedRedirect('/login', path)

      expect(result).toBe('/')
    }
  )
})
