import { auth } from './auth'
import { getRequestHeaders } from '@tanstack/react-start/server'

export async function getAuthSession() {
  try {
    const h = getRequestHeaders()
    const session = await auth.api.getSession({
      headers: h,
    })
    return session
  } catch {
    return null
  }
}