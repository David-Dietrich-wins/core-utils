import { safestr, safestrTrim, stringIf } from '../primitives/string-helper.mjs'
import { hasData } from '../primitives/object-helper.mjs'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class RedirectHelper {
  static readonly ProtectedPaths = ['dashboard', 'admin', 'settings', 'profile']
  static readonly IllegalRedirectPaths = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
  ]

  private static getRedirectAfterLogin(
    redirectLocation: string,
    redirectAfterLoginIfIllegalRedirectLocation: string
  ): string {
    if (
      !redirectLocation ||
      RedirectHelper.IllegalRedirectPaths.includes(redirectLocation)
    ) {
      return safestr(redirectAfterLoginIfIllegalRedirectLocation, '/')
    }

    return redirectLocation
  }

  static CleansedRedirect(
    windowPathname: string,
    searchParamRequestUrl?: string | null,
    redirectAfterLoginIfIllegalRedirectLocation = '/'
  ): string {
    const awinParamRedirectUrl = decodeURI(safestrTrim(searchParamRequestUrl)),
      awinPathName = safestrTrim(windowPathname),
      desiredRedirectUrl = safestr(awinParamRedirectUrl, awinPathName),
      desiredRedirectUrlAfterLogin = RedirectHelper.getRedirectAfterLogin(
        desiredRedirectUrl,
        redirectAfterLoginIfIllegalRedirectLocation
      ),
      disNotLogin =
        hasData(desiredRedirectUrl) &&
        RedirectHelper.IllegalRedirectPaths.includes(awinPathName),
      encodedRedirectUrl = stringIf(disNotLogin, '', '/login?redirectUrl=')

    return (
      encodedRedirectUrl +
      stringIf(
        hasData(encodedRedirectUrl),
        encodeURIComponent(desiredRedirectUrlAfterLogin),
        desiredRedirectUrlAfterLogin
      )
    )
  }
}
