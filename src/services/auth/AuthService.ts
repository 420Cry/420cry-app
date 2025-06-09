import { API_URL } from '@/lib'

export class AuthService {
  public static async checkLoginStatus(token: string): Promise<boolean> {
    try {
      const authStatusUrl = `${API_URL}/users/auth/status`
      const response = await fetch(authStatusUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) return false
      const data = await response.json()
      return data.loggedIn === true
    } catch {
      return false
    }
  }
}
