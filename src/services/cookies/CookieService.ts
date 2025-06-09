import Cookies from 'js-cookie'

export class CookieService {
  public static setJwt(token: string, days = 7): void {
    Cookies.set('jwt', token, {
      expires: days,
      secure: true,
      sameSite: 'lax',
      path: '/',
    })
  }

  public static getJwt(): string | undefined {
    return Cookies.get('jwt')
  }

  public static removeJwt(): void {
    Cookies.remove('jwt')
  }
}
