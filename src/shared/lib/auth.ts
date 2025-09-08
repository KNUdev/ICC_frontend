export const setCookie = (name: string, value: string, days: number): void => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure`
}

export const setAuthTokens = (
  accessToken: string,
  refreshToken: string,
): void => {
  setCookie('accessToken', accessToken, 1)
  setCookie('refreshToken', refreshToken, 7)
  window.dispatchEvent(new Event('auth-state-changed'))
}
