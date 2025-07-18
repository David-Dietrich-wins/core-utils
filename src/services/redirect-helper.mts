import { hasData } from './general.mjs'
import { safestr, safestrTrim, stringIf } from './string-helper.mjs'

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
    const winParamRedirectUrl = decodeURI(safestrTrim(searchParamRequestUrl)),
     winPathName = safestrTrim(windowPathname),

     desiredRedirectUrl = safestr(winParamRedirectUrl, winPathName),
     redirectAfterLogin = RedirectHelper.getRedirectAfterLogin(
      desiredRedirectUrl,
      redirectAfterLoginIfIllegalRedirectLocation
    ),

     isNotLogin =
      hasData(desiredRedirectUrl) &&
      RedirectHelper.IllegalRedirectPaths.includes(winPathName),

     encodedRedirectUrl = stringIf(isNotLogin, '', '/login?redirectUrl=')

    return (
      encodedRedirectUrl +
      stringIf(
        hasData(encodedRedirectUrl),
        encodeURIComponent(redirectAfterLogin),
        redirectAfterLogin
      )
    )
  }
}
